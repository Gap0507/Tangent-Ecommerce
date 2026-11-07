import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Order } from "@/models/Order";
import { syncOrderWithShiprocket } from "@/lib/shiprocket-sync";

function maskName(name: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].length > 2 ? `${parts[0].slice(0, 2)}***` : `${parts[0]}***`;
  }
  return `${parts[0]} ${parts[parts.length - 1].slice(0, 1)}***`;
}

function maskEmail(email: string): string {
  if (!email || !email.includes("@")) return "";
  const [user, domain] = email.split("@");
  if (user.length <= 2) return `**@${domain}`;
  return `${user.slice(0, 2)}***@${domain}`;
}

function maskPhone(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/[^0-9]/g, "");
  if (digits.length <= 4) return "****";
  return `******${digits.slice(-4)}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let query = searchParams.get("query")?.trim() || "";
    const contact = searchParams.get("contact")?.trim() || searchParams.get("phone")?.trim() || searchParams.get("email")?.trim() || "";

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Please enter your Order Number (e.g. TAN-123456)." },
        { status: 400 }
      );
    }

    // Strip leading '#' if customer typed '#TAN-103969'
    let cleanOrderNumber = query.replace(/^#/, "").trim().toUpperCase();

    // Auto-prefix if user just entered raw numbers (e.g. 103969)
    if (/^\d{5,8}$/.test(cleanOrderNumber)) {
      cleanOrderNumber = `TAN-${cleanOrderNumber}`;
    }

    // Strict validation: Must match exact TAN format (no regex wildcards allowed)
    if (!/^TAN-\d{5,8}$/i.test(cleanOrderNumber)) {
      return NextResponse.json(
        { success: false, message: "Invalid Order Number format. Valid format: TAN-123456" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Exact search only - no regex vulnerability
    const order = await Order.findOne({ orderNumber: cleanOrderNumber }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "No order found matching that Order Number. Please check your confirmation email for your correct Order ID." },
        { status: 404 }
      );
    }

    // Auto-sync live status from Shiprocket if AWB exists
    if (order.awbCode) {
      const syncResult = await syncOrderWithShiprocket(order);
      if (syncResult.changed) {
        order.orderStatus = syncResult.orderStatus as any;
        order.shipmentStatus = syncResult.shipmentStatus as any;
      }
    }

    // If customer provided contact verification, check match
    let isContactVerified = false;
    if (contact) {
      const cleanContact = contact.toLowerCase().trim();
      const normInputDigits = cleanContact.replace(/[^0-9]/g, "");
      const normPhoneDigits = (order.customerPhone || "").replace(/[^0-9]/g, "");
      const orderEmail = (order.customerEmail || "").toLowerCase().trim();

      const phoneMatches = normInputDigits.length >= 4 && (normPhoneDigits.endsWith(normInputDigits) || normInputDigits.endsWith(normPhoneDigits));
      const emailMatches = orderEmail === cleanContact;

      if (!phoneMatches && !emailMatches) {
        return NextResponse.json(
          { success: false, message: "The phone or email does not match this Order Number." },
          { status: 403 }
        );
      }
      isContactVerified = true;
    }

    // Sanitize and mask sensitive customer PII before sending to public client
    const sanitizedOrder = {
      _id: order._id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      shipmentStatus: order.shipmentStatus,
      createdAt: order.createdAt,
      pricing: order.pricing,
      items: order.items,
      awbCode: order.awbCode || "",
      courierName: order.courierName || "",
      customerName: maskName(order.customerName),
      customerEmail: maskEmail(order.customerEmail),
      customerPhone: maskPhone(order.customerPhone),
      shippingAddress: {
        street: isContactVerified ? order.shippingAddress.street : "*** (Protected Delivery Address)",
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.pincode,
        country: order.shippingAddress.country || "India",
      },
    };

    return NextResponse.json({
      success: true,
      orders: [sanitizedOrder],
    });
  } catch (error: any) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to search order. Please try again later." },
      { status: 500 }
    );
  }
}

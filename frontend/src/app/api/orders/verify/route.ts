import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDB from "@/lib/db";
import { Order } from "@/models/Order";
import { Settings } from "@/models/Settings";
import { fulfillOrder } from "@/lib/order-fulfillment";

export async function POST(request: Request) {
  try {
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Missing order ID" }, { status: 400 });
    }

    await connectToDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const settings = await Settings.findOne();
    const razorpayKeySecret = settings?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;
    const isLiveRazorpayOrder = Boolean(order.razorpayOrderId && order.razorpayOrderId.startsWith("order_"));

    // If Razorpay secret is configured OR this was created as a live Razorpay order, strict signature verification is REQUIRED
    if (razorpayKeySecret || isLiveRazorpayOrder) {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return NextResponse.json(
          { success: false, error: "Missing required payment verification details (order ID, payment ID, or signature)" },
          { status: 400 }
        );
      }

      if (order.razorpayOrderId && order.razorpayOrderId !== razorpayOrderId) {
        return NextResponse.json(
          { success: false, error: "Razorpay order ID mismatch" },
          { status: 400 }
        );
      }

      if (!razorpayKeySecret) {
        return NextResponse.json(
          { success: false, error: "Razorpay secret key not configured on server" },
          { status: 500 }
        );
      }

      const generatedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
      }
    }

    // Atomic, idempotent fulfillment (prevents race conditions with webhook)
    const updatedOrder = await fulfillOrder({
      orderId: order._id.toString(),
      razorpayOrderId: razorpayOrderId || order.razorpayOrderId,
      razorpayPaymentId: razorpayPaymentId || `pay_mock_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      data: updatedOrder || order,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

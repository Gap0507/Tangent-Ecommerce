import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDB from "@/lib/db";
import { Order, OrderStatus, PaymentStatus } from "@/models/Order";
import { Product } from "@/models/Product";
import { Customer } from "@/models/Customer";
import { Settings } from "@/models/Settings";

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

    // Verify signature if provided and secret is configured
    if (razorpayOrderId && razorpayPaymentId && razorpaySignature && razorpayKeySecret) {
      const generatedSignature = crypto
        .createHmac("sha256", razorpayKeySecret)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (generatedSignature !== razorpaySignature) {
        return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
      }
    }

    // Prevent double processing
    if (order.paymentStatus !== PaymentStatus.PAID) {
      order.paymentStatus = PaymentStatus.PAID;
      order.orderStatus = OrderStatus.CONFIRMED;
      order.razorpayOrderId = razorpayOrderId || order.razorpayOrderId;
      order.razorpayPaymentId = razorpayPaymentId || `pay_mock_${Date.now()}`;

      // 1. Decrement Product Stock Inventory
      for (const item of order.items) {
        try {
          const prodIdStr = String(item.productId || "");
          if (prodIdStr && prodIdStr.match(/^[0-9a-fA-F]{24}$/)) {
            await Product.findByIdAndUpdate(prodIdStr, {
              $inc: { stock: -item.quantity },
            });
          } else if (item.sku || item.name) {
            await Product.findOneAndUpdate(
              { $or: [{ sku: item.sku }, { name: item.name }] },
              { $inc: { stock: -item.quantity } }
            );
          }
        } catch (e) {
          console.error(`Failed to update stock for item ${item.name}:`, e);
        }
      }

      // 2. Update or Create Customer Profile in CRM
      try {
        await Customer.findOneAndUpdate(
          { email: order.customerEmail },
          {
            $set: {
              name: order.customerName,
              phone: order.customerPhone,
            },
            $inc: {
              totalOrders: 1,
              totalSpend: order.pricing.total,
            },
          },
          { upsert: true, new: true }
        );
      } catch (e) {
        console.error("Failed to update customer CRM:", e);
      }

      await order.save();
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      data: order,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

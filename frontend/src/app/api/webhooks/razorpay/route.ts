import { NextResponse } from "next/server";
import crypto from "crypto";
import connectToDB from "@/lib/db";
import { Order, PaymentStatus } from "@/models/Order";
import { Product } from "@/models/Product";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "fallback_secret";

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ success: false, error: "Missing signature" }, { status: 400 });
    }

    // 1. Verify Signature
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_WEBHOOK_SECRET)
      .update(bodyText)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(bodyText);

    // 2. Handle specific events
    if (payload.event === "payment.captured") {
      const paymentEntity = payload.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      await connectToDB();

      // Find the order
      const order = await Order.findOne({ razorpayOrderId });
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }

      // Idempotency check: if already PAID, ignore to prevent double inventory reduction
      if (order.paymentStatus === PaymentStatus.PAID) {
        return NextResponse.json({ success: true, message: "Order already marked as PAID." });
      }

      // Update Order Status
      order.paymentStatus = PaymentStatus.PAID;
      order.razorpayPaymentId = razorpayPaymentId;

      // 3. Securely Reduce Inventory Stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stock: -item.quantity } }
        );
      }

      await order.save();
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

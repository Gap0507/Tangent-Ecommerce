import { NextResponse } from "next/server";
import crypto from "crypto";
import { fulfillOrder } from "@/lib/order-fulfillment";

const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || (process.env.NODE_ENV === "production" ? "" : "fallback_secret");

export async function POST(request: Request) {
  try {
    const bodyText = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ success: false, error: "Missing signature" }, { status: 400 });
    }

    if (!RAZORPAY_WEBHOOK_SECRET) {
      console.error("[Webhook] RAZORPAY_WEBHOOK_SECRET is not configured on server.");
      return NextResponse.json({ success: false, error: "Server webhook configuration error" }, { status: 500 });
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
    if (payload.event === "payment.captured" || payload.event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;
      const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
      const razorpayPaymentId = paymentEntity?.id || (orderEntity ? `pay_${orderEntity.id}` : "");

      if (!razorpayOrderId) {
        return NextResponse.json({ success: false, error: "Invalid payment payload: missing order ID" }, { status: 400 });
      }

      // Atomic fulfillment: Updates status to PAID & CONFIRMED, deducts stock, increments coupon, updates CRM & sends email
      await fulfillOrder({
        razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || `pay_wh_${Date.now()}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Webhook] Error processing Razorpay webhook:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

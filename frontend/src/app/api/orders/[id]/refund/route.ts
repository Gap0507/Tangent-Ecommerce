import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Order, PaymentStatus } from "@/models/Order";
import { getSession } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectToDB();
    
    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus !== PaymentStatus.PAID) {
      return NextResponse.json(
        { success: false, error: "Only PAID orders can be refunded" }, 
        { status: 400 }
      );
    }

    // TODO: Integrate Razorpay refund API here
    // Example: await razorpay.payments.refund(order.razorpayPaymentId);

    // After successful Razorpay refund, update DB
    order.paymentStatus = PaymentStatus.REFUNDED;
    await order.save();

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

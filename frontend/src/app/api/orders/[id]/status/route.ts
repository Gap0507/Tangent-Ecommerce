import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Order, OrderStatus, PaymentStatus, ShipmentStatus } from "@/models/Order";
import { getSession } from "@/lib/auth";

export async function PATCH(
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
    
    const { orderStatus, paymentStatus, shipmentStatus } = await request.json();

    // Validate that at least one status is provided
    if (!orderStatus && !paymentStatus && !shipmentStatus) {
      return NextResponse.json(
        { success: false, error: "At least one status field must be provided." }, 
        { status: 400 }
      );
    }

    const updateFields: any = {};
    if (orderStatus && Object.values(OrderStatus).includes(orderStatus)) updateFields.orderStatus = orderStatus;
    if (paymentStatus && Object.values(PaymentStatus).includes(paymentStatus)) updateFields.paymentStatus = paymentStatus;
    if (shipmentStatus && Object.values(ShipmentStatus).includes(shipmentStatus)) updateFields.shipmentStatus = shipmentStatus;

    const order = await Order.findByIdAndUpdate(
      id, 
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

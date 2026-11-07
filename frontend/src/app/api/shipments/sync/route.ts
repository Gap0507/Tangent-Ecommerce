import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Order } from "@/models/Order";
import { getSession } from "@/lib/auth";
import { syncOrderWithShiprocket } from "@/lib/shiprocket-sync";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, orderNumber } = await request.json();

    if (!orderId && !orderNumber) {
      return NextResponse.json({ success: false, error: "Order ID or Order Number required" }, { status: 400 });
    }

    await connectToDB();

    const query: any = {};
    if (orderId) query._id = orderId;
    else if (orderNumber) query.orderNumber = orderNumber;

    const order = await Order.findOne(query);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (!order.awbCode) {
      return NextResponse.json({
        success: true,
        message: "Order does not have an AWB code yet.",
        order,
      });
    }

    const syncResult = await syncOrderWithShiprocket(order);
    const updatedOrder = await Order.findById(order._id);

    return NextResponse.json({
      success: true,
      message: syncResult.changed
        ? `Status updated to ${syncResult.orderStatus} (${syncResult.liveStatus})`
        : `Order is already in sync (${syncResult.liveStatus})`,
      data: updatedOrder,
      liveStatus: syncResult.liveStatus,
      changed: syncResult.changed,
    });
  } catch (err: any) {
    console.error("API shipment sync error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


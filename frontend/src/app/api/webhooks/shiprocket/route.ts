import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Order, OrderStatus, ShipmentStatus } from "@/models/Order";

/**
 * Shiprocket Webhook Receiver
 *
 * Shiprocket calls this webhook whenever a courier scans or updates a shipment status
 * (e.g. Picked Up, In Transit, Out for Delivery, Delivered, RTO).
 *
 * Webhook URL to register in Shiprocket Dashboard -> Settings -> API -> Webhooks:
 * https://yourdomain.com/api/webhooks/shiprocket
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const awbCode = payload.awb || payload.awb_code;
    const orderNumber = payload.order_id || payload.order_no;
    const currentStatus = (payload.current_status || payload.status || "").toUpperCase();

    if (!awbCode && !orderNumber) {
      return NextResponse.json({ success: false, error: "Missing AWB code or Order ID" }, { status: 400 });
    }

    await connectToDB();

    const query: any = {};
    if (awbCode) {
      query.awbCode = awbCode;
    } else if (orderNumber) {
      query.orderNumber = orderNumber;
    }

    const order = await Order.findOne(query);

    if (!order) {
      console.log(`[Shiprocket Webhook] No matching order found for AWB: ${awbCode}, Order: ${orderNumber}`);
      return NextResponse.json({ success: true, message: "Ignored, order not found" });
    }

    console.log(`[Shiprocket Webhook] Received status "${currentStatus}" for Order #${order.orderNumber} (AWB: ${awbCode})`);

    // Map Shiprocket tracking status to internal status
    if (currentStatus.includes("DELIVERED")) {
      order.shipmentStatus = ShipmentStatus.DELIVERED;
      order.orderStatus = OrderStatus.DELIVERED;
    } else if (
      currentStatus.includes("TRANSIT") ||
      currentStatus.includes("OUT FOR DELIVERY") ||
      currentStatus.includes("REACHED AT DESTINATION")
    ) {
      order.shipmentStatus = ShipmentStatus.IN_TRANSIT;
      order.orderStatus = OrderStatus.SHIPPED;
    } else if (
      currentStatus.includes("PICKED UP") ||
      currentStatus.includes("PICKEDUP") ||
      currentStatus.includes("MANIFEST")
    ) {
      order.shipmentStatus = ShipmentStatus.PICKED_UP;
      order.orderStatus = OrderStatus.SHIPPED;
    } else if (currentStatus.includes("CANCEL")) {
      order.orderStatus = OrderStatus.CANCELLED;
    }

    await order.save();

    return NextResponse.json({
      success: true,
      message: `Order #${order.orderNumber} status updated to ${order.shipmentStatus}`,
    });
  } catch (err: any) {
    console.error("[Shiprocket Webhook] Error processing event:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}


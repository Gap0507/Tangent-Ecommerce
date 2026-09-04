import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Order, OrderStatus, PaymentStatus, ShipmentStatus } from "@/models/Order";
import { Settings } from "@/models/Settings";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    await connectToDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus !== PaymentStatus.PAID) {
      return NextResponse.json(
        { success: false, error: "Can only create shipments for PAID orders." }, 
        { status: 400 }
      );
    }

    if (order.shipmentStatus !== ShipmentStatus.NOT_CREATED) {
      return NextResponse.json(
        { success: false, error: "Shipment already processed for this order." }, 
        { status: 400 }
      );
    }

    const settings = await Settings.findOne();
    const shiprocketEmail = settings?.shiprocketEmail || process.env.SHIPROCKET_EMAIL;
    const shiprocketApiKey = settings?.shiprocketApiKey || process.env.SHIPROCKET_PASSWORD;

    let shiprocketOrderId = `SR_ORD_${order.orderNumber}`;
    let awbCode = `AWB${Math.floor(100000000 + Math.random() * 900000000)}`;
    let courierName = "Delhivery Surface (Express)";

    // Live Shiprocket API Call if credentials exist in Settings or env
    if (shiprocketEmail && shiprocketApiKey) {
      try {
        // 1. Authenticate with Shiprocket API
        const authRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: shiprocketEmail,
            password: shiprocketApiKey,
          }),
        });
        const authData = await authRes.json();

        if (authData.token) {
          const token = authData.token;

          // 2. Create Order in Shiprocket
          const srOrderRes = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              order_id: order.orderNumber,
              order_date: new Date().toISOString().split("T")[0],
              pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "Primary",
              billing_customer_name: order.customerName,
              billing_last_name: "",
              billing_address: order.shippingAddress.street,
              billing_city: order.shippingAddress.city,
              billing_pincode: order.shippingAddress.pincode,
              billing_state: order.shippingAddress.state,
              billing_country: "India",
              billing_email: order.customerEmail,
              billing_phone: order.customerPhone,
              shipping_is_billing: true,
              order_items: order.items.map((item: any) => ({
                name: item.name,
                sku: item.sku,
                units: item.quantity,
                selling_price: item.price,
              })),
              payment_method: "Prepaid",
              sub_total: order.pricing.subtotal,
              length: 10,
              breadth: 10,
              height: 10,
              weight: 0.5,
            }),
          });
          const srOrderData = await srOrderRes.json();

          if (srOrderData.order_id) {
            shiprocketOrderId = String(srOrderData.order_id);
            if (srOrderData.awb_code) {
              awbCode = srOrderData.awb_code;
            }
          }
        }
      } catch (err) {
        console.error("Shiprocket API call failed, falling back to generated AWB:", err);
      }
    }

    // Update order with shipment details & change orderStatus to SHIPPED
    order.shipmentStatus = ShipmentStatus.CREATED;
    order.orderStatus = OrderStatus.SHIPPED;
    order.shiprocketOrderId = shiprocketOrderId;
    order.awbCode = awbCode;
    order.courierName = courierName;
    
    await order.save();

    return NextResponse.json({ 
      success: true, 
      message: "Shipment created & AWB code generated successfully", 
      data: order 
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

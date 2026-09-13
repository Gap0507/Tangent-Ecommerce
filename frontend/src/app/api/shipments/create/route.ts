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

    if (!shiprocketEmail || !shiprocketApiKey) {
      return NextResponse.json(
        { success: false, error: "Shiprocket credentials not configured. Go to Admin → Settings to add them." },
        { status: 400 }
      );
    }

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

    if (!authData.token) {
      return NextResponse.json(
        { success: false, error: "Shiprocket authentication failed. Check your credentials in Settings." },
        { status: 400 }
      );
    }

    const token = authData.token;

    // 2. Check Shiprocket wallet balance BEFORE creating the order
    let walletBalance = 0;
    let estimatedShippingCost = 0;

    try {
      const walletRes = await fetch("https://apiv2.shiprocket.in/v1/external/account/details/wallet-balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const walletData = await walletRes.json();
      walletBalance = walletData?.data?.balance_amount ?? walletData?.data?.amount ?? 0;

      if (typeof walletBalance === "string") {
        walletBalance = parseFloat(walletBalance) || 0;
      }
    } catch (err) {
      console.error("Failed to fetch Shiprocket wallet balance:", err);
      // Continue — we'll still try and catch at the order creation stage
    }

    // Calculate estimated shipping cost for this order using serviceability API
    let totalWeight = 0;
    let maxLen = 25, maxBreadth = 18, maxHeight = 12;

    if (order.items && order.items.length > 0) {
      order.items.forEach((item: any) => {
        let w = 1.5, l = 25, b = 18, h = 12;

        if (item.size === "Pack of 4") {
          w = settings?.pack4Weight ?? 1.5;
          l = settings?.pack4Length ?? 25;
          b = settings?.pack4Breadth ?? 18;
          h = settings?.pack4Height ?? 12;
        } else if (item.size === "Pack of 8") {
          w = settings?.pack8Weight ?? 3.0;
          l = settings?.pack8Length ?? 30;
          b = settings?.pack8Breadth ?? 22;
          h = settings?.pack8Height ?? 15;
        } else if (item.size === "Pack of 24") {
          w = settings?.pack24Weight ?? 9.0;
          l = settings?.pack24Length ?? 45;
          b = settings?.pack24Breadth ?? 30;
          h = settings?.pack24Height ?? 25;
        }

        totalWeight += w * (item.quantity || 1);
        maxLen = Math.max(maxLen, l);
        maxBreadth = Math.max(maxBreadth, b);
        maxHeight = Math.max(maxHeight, h);
      });
    }
    const finalWeight = totalWeight > 0 ? totalWeight : 0.5;

    // Get estimated shipping cost via serviceability check
    try {
      const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || "382443";
      const deliveryPincode = order.shippingAddress?.pincode || "000000";

      const rateRes = await fetch(
        `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${deliveryPincode}&weight=${finalWeight}&cod=0&declared_value=${order.pricing.subtotal || order.pricing.total}&length=${maxLen}&breadth=${maxBreadth}&height=${maxHeight}&is_insured=1`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const rateData = await rateRes.json();

      if (rateData.status === 200 && rateData.data?.available_courier_companies?.length > 0) {
        const couriers = rateData.data.available_courier_companies;
        // Find cheapest total rate (freight + coverage + whatsapp) — same as checkout
        let minTotal = Infinity;
        for (const c of couriers) {
          const total = (c.freight_charge || c.rate || 0) + (c.coverage_charges || 0) + (c.whatsapp_charges || 0);
          if (total < minTotal) {
            minTotal = total;
          }
        }
        estimatedShippingCost = Math.round(minTotal);
      }
    } catch (err) {
      console.error("Failed to estimate shipping cost:", err);
    }

    // 3. Block if wallet balance is insufficient
    if (estimatedShippingCost > 0 && walletBalance < estimatedShippingCost) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient Shiprocket wallet balance. Current balance: ₹${walletBalance.toFixed(2)}. Estimated shipping cost: ₹${estimatedShippingCost}. Please recharge your Shiprocket wallet with at least ₹${Math.ceil(estimatedShippingCost - walletBalance)} and try again.`,
          errorType: "INSUFFICIENT_BALANCE",
          walletBalance,
          requiredAmount: estimatedShippingCost,
          shortfall: Math.ceil(estimatedShippingCost - walletBalance),
        },
        { status: 400 }
      );
    }

    // 4. Create Order in Shiprocket
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
        length: maxLen,
        breadth: maxBreadth,
        height: maxHeight,
        weight: finalWeight,
      }),
    });
    const srOrderData = await srOrderRes.json();

    // 5. Validate Shiprocket response — only proceed if order was actually created
    if (!srOrderData.order_id) {
      // Shiprocket rejected the order
      const srError = srOrderData.message || srOrderData.errors || JSON.stringify(srOrderData);
      return NextResponse.json(
        {
          success: false,
          error: `Shiprocket rejected the order: ${typeof srError === 'object' ? JSON.stringify(srError) : srError}`,
          errorType: "SHIPROCKET_REJECTION",
        },
        { status: 400 }
      );
    }

    // 6. Order created successfully — update our database
    const shiprocketOrderId = String(srOrderData.order_id);
    const awbCode = srOrderData.awb_code || "";
    const courierName = srOrderData.courier_name || "Pending Assignment";

    order.shipmentStatus = ShipmentStatus.CREATED;
    order.orderStatus = OrderStatus.SHIPPED;
    order.shiprocketOrderId = shiprocketOrderId;
    order.awbCode = awbCode;
    order.courierName = courierName;

    await order.save();

    return NextResponse.json({
      success: true,
      message: awbCode
        ? `Shipment created! AWB: ${awbCode}`
        : `Order pushed to Shiprocket (ID: ${shiprocketOrderId}). AWB will be assigned after courier pickup.`,
      data: order,
      walletBalance,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

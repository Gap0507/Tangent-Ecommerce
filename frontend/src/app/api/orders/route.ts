import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Order, OrderStatus, PaymentStatus } from "@/models/Order";
import { Settings } from "@/models/Settings";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDB();
    
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    
    let query: any = {};
    if (statusParam) {
      const statuses = statusParam.split(",");
      if (statuses.length > 1) {
        query = { orderStatus: { $in: statuses } };
      } else {
        query = { orderStatus: statusParam };
      }
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    const data = await request.json();

    const settings = await Settings.findOne();
    const orderNumber = `TAN-${Math.floor(100000 + Math.random() * 900000)}`;

    // Ensure items have a valid ObjectId for MongoDB ref
    const parsedItems = data.items.map((item: any) => {
      let validProductId = item.productId;
      if (!validProductId || (typeof validProductId === "string" && !validProductId.match(/^[0-9a-fA-F]{24}$/))) {
        validProductId = "650000000000000000000001";
      }
      return {
        productId: validProductId,
        sku: item.sku || item.productId || "TAN-SKU",
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      };
    });

    const razorpayKeyId = settings?.razorpayKeyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const razorpayKeySecret = settings?.razorpayKeySecret || process.env.RAZORPAY_KEY_SECRET;

    let razorpayOrderId = "";

    // Create real Razorpay order on Razorpay servers if Key ID & Secret are present
    if (razorpayKeyId && razorpayKeySecret && !razorpayKeyId.includes("mockkey")) {
      try {
        const authHeader = Buffer.from(`${razorpayKeyId.trim()}:${razorpayKeySecret.trim()}`).toString("base64");
        const rzpRes = await fetch("https://api.razorpay.com/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${authHeader}`,
          },
          body: JSON.stringify({
            amount: Math.round(data.pricing.total * 100), // amount in paise
            currency: "INR",
            receipt: orderNumber,
          }),
        });

        const rzpData = await rzpRes.json();
        if (rzpData && rzpData.id) {
          razorpayOrderId = rzpData.id;
        } else {
          console.error("Razorpay API order creation error response:", rzpData);
        }
      } catch (err) {
        console.error("Failed to connect to Razorpay API:", err);
      }
    }

    // Fallback order ID if API call was skipped or offline
    if (!razorpayOrderId) {
      razorpayOrderId = `mock_order_${Date.now()}`;
    }

    const orderData = {
      orderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      items: parsedItems,
      pricing: data.pricing,
      orderStatus: OrderStatus.NEW,
      paymentStatus: PaymentStatus.PENDING,
      razorpayOrderId,
    };

    const order = await Order.create(orderData);
    
    return NextResponse.json({ 
      success: true, 
      data: order,
      razorpayOrderId,
      razorpayKeyId: razorpayKeyId || "rzp_test_mockkey123",
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

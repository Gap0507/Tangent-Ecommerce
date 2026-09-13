import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Order } from "@/models/Order";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let query = searchParams.get("query")?.trim() || "";

    if (!query) {
      return NextResponse.json(
        { success: false, message: "Please enter your Order Number." },
        { status: 400 }
      );
    }

    // Strip leading '#' if customer typed '#TAN-103969'
    query = query.replace(/^#/, "").trim();

    await connectToDB();

    // Search strictly by orderNumber
    const orders = await Order.find({
      orderNumber: { $regex: query, $options: "i" },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        { success: false, message: "No order found with that Order Number. Please check your confirmation email for your correct Order ID." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error: any) {
    console.error("Track order error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to search order. Please try again later." },
      { status: 500 }
    );
  }
}

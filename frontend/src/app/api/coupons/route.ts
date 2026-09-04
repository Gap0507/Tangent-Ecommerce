import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Coupon } from "@/models/Coupon";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    // const session = await getSession();
    // if (!session) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }

    await connectToDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ success: true, data: coupons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // const session = await getSession();
    // if (!session) {
    //   return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    // }

    await connectToDB();
    const data = await request.json();
    const coupon = await Coupon.create(data);
    
    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

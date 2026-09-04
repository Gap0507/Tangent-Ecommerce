import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Settings } from "@/models/Settings";

export async function GET() {
  try {
    await connectToDB();
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({
        razorpayKeyId: "",
        razorpayKeySecret: "",
        shiprocketEmail: "",
        shiprocketApiKey: "",
        useRealTimeRates: false,
        flatShippingRate: 49,
        storeEmail: "hello@tangentdrinks.com",
        storePhone: "+91 98765 43210",
        storeName: "Tangent Drinks",
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDB();
    const body = await request.json();

    const {
      razorpayKeyId,
      razorpayKeySecret,
      shiprocketEmail,
      shiprocketApiKey,
      useRealTimeRates,
      flatShippingRate,
      storeEmail,
      storePhone,
      storeName,
    } = body;

    const updateFields = {
      razorpayKeyId: razorpayKeyId ?? "",
      razorpayKeySecret: razorpayKeySecret ?? "",
      shiprocketEmail: shiprocketEmail ?? "",
      shiprocketApiKey: shiprocketApiKey ?? "",
      useRealTimeRates: Boolean(useRealTimeRates),
      flatShippingRate: Number(flatShippingRate) || 49,
      storeEmail: storeEmail || "hello@tangentdrinks.com",
      storePhone: storePhone || "+91 98765 43210",
      storeName: storeName || "Tangent Drinks",
    };

    const updatedSettings = await Settings.findOneAndUpdate(
      {},
      { $set: updateFields },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedSettings,
      message: "Settings saved successfully to database",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

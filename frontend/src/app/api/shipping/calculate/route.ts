import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Settings } from "@/models/Settings";

export async function POST(request: Request) {
  try {
    const { pincode, subtotal } = await request.json();

    if (!pincode || subtotal === undefined) {
      return NextResponse.json({ success: false, error: "Pincode and subtotal required" }, { status: 400 });
    }

    await connectToDB();
    const settings = await Settings.findOne();

    // Default fallback shipping rate
    let finalRate = 49;

    if (settings && settings.useRealTimeRates) {
      // TODO: Call Shiprocket API to calculate exact rate based on Pincode and package weight
      // For now, we mock a dynamic rate if real-time is enabled
      finalRate = 60; // Mock dynamic rate
    } else if (settings) {
      finalRate = settings.flatShippingRate;
    }

    // Optional: Free shipping threshold logic can be added here
    // if (subtotal > 999) finalRate = 0;

    return NextResponse.json({ 
      success: true, 
      data: {
        shippingCost: finalRate,
        isRealTime: settings?.useRealTimeRates || false
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

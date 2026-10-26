import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Settings } from "@/models/Settings";
import { getSession } from "@/lib/auth";

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
        storePhone: "+9724565952",
        storeName: "Tangent Drinks",
        pack4Weight: 1.5,
        pack4Length: 25,
        pack4Breadth: 18,
        pack4Height: 12,
        pack8Weight: 3.0,
        pack8Length: 30,
        pack8Breadth: 22,
        pack8Height: 15,
        pack24Weight: 9.0,
        pack24Length: 45,
        pack24Breadth: 30,
        pack24Height: 25,
      });
    }

    const session = await getSession();
    if (!session) {
      // For public / customer requests (e.g. checkout), only expose safe store settings
      const publicSettings = {
        useRealTimeRates: settings.useRealTimeRates,
        flatShippingRate: settings.flatShippingRate,
        storeEmail: settings.storeEmail,
        storePhone: settings.storePhone,
        storeName: settings.storeName,
        pack4Weight: settings.pack4Weight,
        pack4Length: settings.pack4Length,
        pack4Breadth: settings.pack4Breadth,
        pack4Height: settings.pack4Height,
        pack8Weight: settings.pack8Weight,
        pack8Length: settings.pack8Length,
        pack8Breadth: settings.pack8Breadth,
        pack8Height: settings.pack8Height,
        pack24Weight: settings.pack24Weight,
        pack24Length: settings.pack24Length,
        pack24Breadth: settings.pack24Breadth,
        pack24Height: settings.pack24Height,
      };
      return NextResponse.json({ success: true, data: publicSettings });
    }

    // Authenticated admin gets full settings including credentials
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

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
      pack4Weight,
      pack4Length,
      pack4Breadth,
      pack4Height,
      pack8Weight,
      pack8Length,
      pack8Breadth,
      pack8Height,
      pack24Weight,
      pack24Length,
      pack24Breadth,
      pack24Height,
    } = body;

    const updateFields = {
      razorpayKeyId: razorpayKeyId ?? "",
      razorpayKeySecret: razorpayKeySecret ?? "",
      shiprocketEmail: shiprocketEmail ?? "",
      shiprocketApiKey: shiprocketApiKey ?? "",
      useRealTimeRates: Boolean(useRealTimeRates),
      flatShippingRate: Number(flatShippingRate) || 49,
      storeEmail: storeEmail || "hello@tangentdrinks.com",
      storePhone: storePhone || "+9724565952",
      storeName: storeName || "Tangent Drinks",
      pack4Weight: Number(pack4Weight) || 1.5,
      pack4Length: Number(pack4Length) || 25,
      pack4Breadth: Number(pack4Breadth) || 18,
      pack4Height: Number(pack4Height) || 12,
      pack8Weight: Number(pack8Weight) || 3.0,
      pack8Length: Number(pack8Length) || 30,
      pack8Breadth: Number(pack8Breadth) || 22,
      pack8Height: Number(pack8Height) || 15,
      pack24Weight: Number(pack24Weight) || 9.0,
      pack24Length: Number(pack24Length) || 45,
      pack24Breadth: Number(pack24Breadth) || 30,
      pack24Height: Number(pack24Height) || 25,
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

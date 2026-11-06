import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Coupon } from "@/models/Coupon";

export async function POST(request: Request) {
  try {
    await connectToDB();
    const { code, orderValue } = await request.json();

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    const numericOrderValue = Number(orderValue) || 0;

    // First search in MongoDB Coupon collection
    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (coupon) {
      const now = new Date();
      if (coupon.validFrom && new Date(coupon.validFrom) > now) {
        return NextResponse.json({ success: false, error: "Coupon is not active yet" }, { status: 400 });
      }
      if (coupon.validUntil && new Date(coupon.validUntil) < now) {
        return NextResponse.json({ success: false, error: "Coupon has expired" }, { status: 400 });
      }
      if (coupon.minOrderValue && numericOrderValue < coupon.minOrderValue) {
        return NextResponse.json(
          { success: false, error: `Minimum order value for this coupon is ₹${coupon.minOrderValue}` },
          { status: 400 }
        );
      }
      if (coupon.maxUsageLimit > 0 && coupon.usageCount >= coupon.maxUsageLimit) {
        return NextResponse.json({ success: false, error: "Coupon usage limit reached" }, { status: 400 });
      }

      let discountAmount = 0;
      let isFreeShipping = false;
      if (coupon.discountType === "FLAT") {
        discountAmount = coupon.discountValue;
      } else if (coupon.discountType === "PERCENTAGE") {
        discountAmount = (numericOrderValue * coupon.discountValue) / 100;
      } else if (coupon.discountType === "FREE_SHIPPING") {
        isFreeShipping = true;
        discountAmount = 0;
      }

      return NextResponse.json({
        success: true,
        data: {
          code: coupon.code,
          discountType: coupon.discountType,
          discountAmount: Math.min(discountAmount, numericOrderValue),
          isFreeShipping,
        },
      });
    }

    // Default fallback promo codes: Seed into database so they are manageable and tracked
    if (cleanCode === "TANGENT10") {
      const seeded = await Coupon.findOneAndUpdate(
        { code: "TANGENT10" },
        {
          $setOnInsert: {
            code: "TANGENT10",
            discountType: "PERCENTAGE",
            discountValue: 10,
            minOrderValue: 499,
            usageCount: 0,
            maxUsageLimit: 0,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            isActive: true,
          },
        },
        { upsert: true, new: true }
      );
      return NextResponse.json({
        success: true,
        data: {
          code: seeded.code,
          discountType: seeded.discountType,
          discountAmount: Math.round(numericOrderValue * 0.1),
          isFreeShipping: false,
        },
      });
    }

    if (cleanCode === "WELCOME50") {
      const seeded = await Coupon.findOneAndUpdate(
        { code: "WELCOME50" },
        {
          $setOnInsert: {
            code: "WELCOME50",
            discountType: "FLAT",
            discountValue: 50,
            minOrderValue: 299,
            usageCount: 0,
            maxUsageLimit: 0,
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            isActive: true,
          },
        },
        { upsert: true, new: true }
      );
      return NextResponse.json({
        success: true,
        data: {
          code: seeded.code,
          discountType: seeded.discountType,
          discountAmount: Math.min(50, numericOrderValue),
          isFreeShipping: false,
        },
      });
    }

    return NextResponse.json({ success: false, error: "Invalid coupon code" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

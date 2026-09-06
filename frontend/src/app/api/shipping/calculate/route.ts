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
      const shiprocketEmail = settings.shiprocketEmail || process.env.SHIPROCKET_EMAIL;
      const shiprocketApiKey = settings.shiprocketApiKey || process.env.SHIPROCKET_PASSWORD;

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
            // Use a default pickup pincode if not provided in env. E.g., '110030'
            const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || "110030";
            const weight = 0.5; // Standard estimated weight in kg

            // 2. Fetch live rates using Courier Serviceability API
            const rateRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${pincode}&weight=${weight}&cod=0`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            const rateData = await rateRes.json();
            
            if (rateData.status === 200 && rateData.data && rateData.data.available_courier_companies) {
              const couriers = rateData.data.available_courier_companies;
              if (couriers.length > 0) {
                // Find the cheapest courier rate
                let minRate = couriers[0].rate;
                for (let i = 1; i < couriers.length; i++) {
                  if (couriers[i].rate < minRate) {
                    minRate = couriers[i].rate;
                  }
                }
                finalRate = Math.round(minRate);
              }
            } else {
               // Fallback if pincode is unserviceable or error
               finalRate = settings.flatShippingRate || 49;
            }
          }
        } catch (err) {
          console.error("Failed to fetch live Shiprocket rates, using flat rate:", err);
          finalRate = settings.flatShippingRate || 49;
        }
      } else {
        finalRate = settings.flatShippingRate || 49;
      }
    } else if (settings) {
      finalRate = settings.flatShippingRate;
    }

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

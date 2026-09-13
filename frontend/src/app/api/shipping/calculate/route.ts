import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Settings } from "@/models/Settings";

export async function POST(request: Request) {
  try {
    const { pincode, subtotal, items = [] } = await request.json();

    if (!pincode || subtotal === undefined) {
      return NextResponse.json({ success: false, error: "Pincode and subtotal required" }, { status: 400 });
    }

    await connectToDB();
    const settings = await Settings.findOne();

    // Default fallback shipping rate
    let finalRate = 49;
    let etd = "";

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
            // Use the pickup pincode from Shiprocket (user's warehouse in Ahmedabad)
            const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || "382443";
            let totalWeight = 0;
            let maxLength = 25, maxBreadth = 18, maxHeight = 12; // defaults for Pack of 4
            if (items.length > 0) {
              items.forEach((item: any) => {
                let w = 1.5, l = 25, b = 18, h = 12;
                if (item.size === "Pack of 4") {
                  w = settings.pack4Weight ?? 1.5;
                  l = settings.pack4Length ?? 25;
                  b = settings.pack4Breadth ?? 18;
                  h = settings.pack4Height ?? 12;
                } else if (item.size === "Pack of 8") {
                  w = settings.pack8Weight ?? 3.0;
                  l = settings.pack8Length ?? 30;
                  b = settings.pack8Breadth ?? 22;
                  h = settings.pack8Height ?? 15;
                } else if (item.size === "Pack of 24") {
                  w = settings.pack24Weight ?? 9.0;
                  l = settings.pack24Length ?? 45;
                  b = settings.pack24Breadth ?? 30;
                  h = settings.pack24Height ?? 25;
                }
                totalWeight += w * (item.quantity || 1);
                if (l > maxLength) maxLength = l;
                if (b > maxBreadth) maxBreadth = b;
                if (h > maxHeight) maxHeight = h;
              });
            }
            const weight = totalWeight > 0 ? totalWeight : 0.5;

            // 2. Fetch live rates using Courier Serviceability API (with dimensions + declared_value + insurance to match Shiprocket dashboard)
            const rateRes = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${pincode}&weight=${weight}&cod=0&declared_value=${subtotal}&length=${maxLength}&breadth=${maxBreadth}&height=${maxHeight}&is_insured=1`, {
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
                // Calculate the TOTAL rate for each courier the same way Shiprocket dashboard does:
                // total = freight_charge + coverage_charges + whatsapp_charges
                const getTotalRate = (c: any) => {
                  return (c.freight_charge || c.rate || 0) + (c.coverage_charges || 0) + (c.whatsapp_charges || 0);
                };

                let minTotal = getTotalRate(couriers[0]);
                etd = couriers[0].etd || "";
                for (let i = 1; i < couriers.length; i++) {
                  const total = getTotalRate(couriers[i]);
                  if (total < minTotal) {
                    minTotal = total;
                    etd = couriers[i].etd || "";
                  }
                }
                finalRate = Math.round(minTotal);
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
        isRealTime: settings?.useRealTimeRates || false,
        etd
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

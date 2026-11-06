import { NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import { Order, OrderStatus, PaymentStatus } from "@/models/Order";
import { Product } from "@/models/Product";
import { Settings } from "@/models/Settings";
import { Coupon } from "@/models/Coupon";
import { getSession } from "@/lib/auth";
import { findMatchingProduct } from "@/lib/inventory";
import { getShiprocketToken } from "@/lib/shiprocket";

const VALID_PACK_SIZES = [4, 8, 24];

function computeServerItemPrice(item: any, dbProducts: any[]): number {
  const itemSize = (item.size || "").trim();
  const itemName = (item.name || "").toLowerCase();

  // Case 1: Variety Pack with flavor breakdown (e.g. "4 Cans: 1 x Watermelon Mint, 2 x Guava, 1 x Cranberry")
  if (
    itemSize.includes("Cans:") ||
    (itemSize.includes("x ") && !itemSize.startsWith("Pack of"))
  ) {
    const breakdownPart = itemSize.includes("Cans:") ? itemSize.split("Cans:")[1] : itemSize;
    const regex = /(\d+)\s*x\s*([^,()]+)/gi;
    let match;
    let calculatedPackPrice = 0;
    let totalCansInBreakdown = 0;

    while ((match = regex.exec(breakdownPart)) !== null) {
      const cansQty = parseInt(match[1], 10);
      if (isNaN(cansQty) || cansQty <= 0) {
        throw new Error("Invalid can quantity in variety pack breakdown");
      }
      totalCansInBreakdown += cansQty;
      const flavorName = match[2].trim();
      const matchedProd = findMatchingProduct(flavorName, dbProducts);
      const unitPrice = matchedProd?.price && matchedProd.price > 0 ? matchedProd.price : 149;
      calculatedPackPrice += unitPrice * cansQty;
    }

    if (totalCansInBreakdown > 0 && calculatedPackPrice > 0) {
      return calculatedPackPrice;
    }
  }

  // Determine cans count from size string (e.g. "Pack of 4", "Pack of 8", "Pack of 24", "4 Cans", "24 Cans")
  let cansPerPack = 0;
  const packMatch = itemSize.match(/Pack of (\d+)/i) || itemSize.match(/^(\d+)\s*cans?/i);
  if (packMatch && packMatch[1]) {
    cansPerPack = parseInt(packMatch[1], 10);
  } else if (itemSize.includes("24")) {
    cansPerPack = 24;
  } else if (itemSize.includes("8")) {
    cansPerPack = 8;
  } else if (itemSize.includes("4")) {
    cansPerPack = 4;
  }

  // Reject zero, negative, or unapproved pack sizes
  if (!VALID_PACK_SIZES.includes(cansPerPack)) {
    throw new Error(`Invalid pack size "${itemSize}". Permitted pack sizes are: Pack of 4, Pack of 8, Pack of 24.`);
  }

  // Case 2: Standard Variety Pack without breakdown
  if (itemName.includes("variety pack")) {
    const avgUnitPrice = dbProducts.length > 0
      ? dbProducts.reduce((sum: number, p: any) => sum + (p.price || 149), 0) / dbProducts.length
      : 149;
    return Math.round(avgUnitPrice * cansPerPack);
  }

  // Case 3: Standard Single-Flavor Pack
  const matchedProd = findMatchingProduct(item.name || item.sku || String(item.productId), dbProducts);
  const unitPrice = matchedProd?.price && matchedProd.price > 0 ? matchedProd.price : 149;
  return unitPrice * cansPerPack;
}

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

    if (!data.items || !Array.isArray(data.items) || data.items.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 });
    }

    // Strict Server-Side Customer Contact & Address Validation
    const customerName = (data.customerName || "").trim();
    if (!customerName || customerName.length < 2) {
      return NextResponse.json({ success: false, error: "Please provide a valid full name." }, { status: 400 });
    }

    const customerEmail = (data.customerEmail || "").trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail || !emailRegex.test(customerEmail)) {
      return NextResponse.json({ success: false, error: "Please provide a valid email address." }, { status: 400 });
    }

    const rawPhone = (data.customerPhone || "").replace(/[^0-9]/g, "");
    const cleanPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone;
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid 10-digit Indian phone number starting with 6, 7, 8, or 9." },
        { status: 400 }
      );
    }

    const shippingAddress = data.shippingAddress || {};
    const street = (shippingAddress.street || "").trim();
    const city = (shippingAddress.city || "").trim();
    const state = (shippingAddress.state || "").trim();
    const pincode = (shippingAddress.pincode || "").trim();

    if (!street || street.length < 3) {
      return NextResponse.json({ success: false, error: "Please provide a complete street delivery address." }, { status: 400 });
    }
    if (!city || city.length < 2) {
      return NextResponse.json({ success: false, error: "Please provide a valid delivery city." }, { status: 400 });
    }
    if (!state || state.length < 2) {
      return NextResponse.json({ success: false, error: "Please select a valid state." }, { status: 400 });
    }
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      return NextResponse.json({ success: false, error: "Please provide a valid 6-digit Indian PIN code." }, { status: 400 });
    }

    const settings = await Settings.findOne();
    const orderNumber = `TAN-${Math.floor(100000 + Math.random() * 900000)}`;

    const dbProducts = await Product.find({});

    // 1. Compute server-side verified item prices & ensure items have a valid ObjectId
    const parsedItems = data.items.map((item: any) => {
      let validProductId = item.productId;
      let matchedSku = item.sku;

      const matched = findMatchingProduct(item.name || item.sku || String(item.productId), dbProducts);
      if (matched) {
        validProductId = matched._id;
        matchedSku = matched.sku;
      } else if (!validProductId || (typeof validProductId === "string" && !validProductId.match(/^[0-9a-fA-F]{24}$/))) {
        validProductId = "650000000000000000000001";
      }

      // Compute tamper-proof price strictly on server based on DB inventory
      const verifiedUnitPrice = computeServerItemPrice(item, dbProducts);
      const quantity = Math.max(1, Number(item.quantity) || 1);

      return {
        productId: validProductId,
        sku: matchedSku || "TAN-SKU",
        name: item.name,
        size: item.size || "Pack of 4",
        quantity,
        price: verifiedUnitPrice,
        image: item.image,
      };
    });

    // 2. Validate stock availability before allowing order creation (both single-flavor & variety packs)
    for (const item of parsedItems) {
      const itemSize = item.size || "";
      const itemName = (item.name || "").toLowerCase();

      // Case A: Variety Pack with flavor breakdown
      if (
        itemSize.includes("Cans:") ||
        itemName.includes("variety pack") ||
        (itemSize.includes("x ") && !itemSize.startsWith("Pack of"))
      ) {
        const breakdownPart = itemSize.includes("Cans:") ? itemSize.split("Cans:")[1] : itemSize;
        const regex = /(\d+)\s*x\s*([^,()]+)/gi;
        let match;
        let foundFlavors = false;

        while ((match = regex.exec(breakdownPart)) !== null) {
          foundFlavors = true;
          const cansQty = parseInt(match[1], 10) * (item.quantity || 1);
          const flavorName = match[2].trim();
          const matchedProd = findMatchingProduct(flavorName, dbProducts);
          const availableStock = matchedProd && typeof matchedProd.stock === "number" ? matchedProd.stock : 0;
          if (availableStock < cansQty) {
            return NextResponse.json({
              success: false,
              error: availableStock === 0
                ? `Sorry, ${matchedProd?.name || flavorName} is currently Out of Stock!`
                : `Sorry, ${matchedProd?.name || flavorName} has only ${availableStock} cans left, but this pack needs ${cansQty} cans.`,
            }, { status: 400 });
          }
        }

        if (!foundFlavors && itemName.includes("variety pack")) {
          // Standard 4-pack (1 can of each DB product)
          for (const prod of dbProducts) {
            const availableStock = typeof prod.stock === "number" ? prod.stock : 0;
            const required = item.quantity || 1;
            if (availableStock < required) {
              return NextResponse.json({
                success: false,
                error: `Sorry, ${prod.name} is Out of Stock for the Variety Pack!`,
              }, { status: 400 });
            }
          }
        }
      } else {
        // Case B: Standard Single-Flavor Pack
        const matched = findMatchingProduct(item.name || item.sku || String(item.productId), dbProducts);
        if (matched) {
          let cansPerPack = 1;
          const packMatch = (item.size || "").match(/Pack of (\d+)/i) || (item.size || "").match(/(\d+)\s*cans?/i);
          if (packMatch && packMatch[1]) {
            cansPerPack = parseInt(packMatch[1], 10);
          }
          const requiredCans = cansPerPack * (item.quantity || 1);
          const availableStock = typeof matched.stock === "number" ? matched.stock : 0;

          if (availableStock < requiredCans) {
            return NextResponse.json({
              success: false,
              error: availableStock === 0
                ? `Sorry, ${matched.name} is currently Out of Stock!`
                : `Sorry, ${matched.name} (${item.size}) requires ${requiredCans} cans, but only ${availableStock} cans remain in stock.`,
            }, { status: 400 });
          }
        }
      }
    }

    // 3. Compute verified Subtotal on server
    const serverSubtotal = parsedItems.reduce((acc: number, item: any) => {
      return acc + (item.price * item.quantity);
    }, 0);

    // 4. Validate Coupon strictly on server
    let serverDiscount = 0;
    let isFreeShippingCoupon = false;
    let validatedCouponCode: string | undefined = undefined;

    const rawCoupon = data.couponCode || data.pricing?.couponCode;
    if (rawCoupon && typeof rawCoupon === "string" && rawCoupon.trim()) {
      const cleanCoupon = rawCoupon.trim().toUpperCase();
      const couponDoc = await Coupon.findOne({ code: cleanCoupon, isActive: true });

      if (couponDoc) {
        const now = new Date();
        const isNotStarted = couponDoc.validFrom && new Date(couponDoc.validFrom) > now;
        const isExpired = couponDoc.validUntil && new Date(couponDoc.validUntil) < now;
        const isMinOrderUnmet = couponDoc.minOrderValue && serverSubtotal < couponDoc.minOrderValue;
        const isLimitReached = couponDoc.maxUsageLimit > 0 && couponDoc.usageCount >= couponDoc.maxUsageLimit;

        if (!isNotStarted && !isExpired && !isMinOrderUnmet && !isLimitReached) {
          validatedCouponCode = couponDoc.code;
          if (couponDoc.discountType === "FLAT") {
            serverDiscount = Math.min(couponDoc.discountValue, serverSubtotal);
          } else if (couponDoc.discountType === "PERCENTAGE") {
            serverDiscount = Math.round((serverSubtotal * couponDoc.discountValue) / 100);
          } else if (couponDoc.discountType === "FREE_SHIPPING") {
            isFreeShippingCoupon = true;
            serverDiscount = 0;
          }
        }
      }
    }

    // 5. Determine verified Shipping Fee on server
    // Free shipping is ONLY granted when the admin explicitly creates and applies a FREE_SHIPPING coupon
    let serverShipping = 0;
    const hasFreeShippingPromise = isFreeShippingCoupon;

    if (hasFreeShippingPromise) {
      serverShipping = 0;
    } else if (settings?.useRealTimeRates) {
      const shiprocketEmail = settings.shiprocketEmail || process.env.SHIPROCKET_EMAIL;
      const shiprocketApiKey = settings.shiprocketApiKey || process.env.SHIPROCKET_PASSWORD;

      if (shiprocketEmail && shiprocketApiKey) {
        try {
          const token = await getShiprocketToken(shiprocketEmail, shiprocketApiKey);
          if (token) {
            const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || "382443";
            let totalWeight = 0;
            let maxLength = 25, maxBreadth = 18, maxHeight = 12;

            parsedItems.forEach((item: any) => {
              let w = 1.5, l = 25, b = 18, h = 12;
              const s = (item.size || "").toLowerCase();
              if (s.includes("24")) {
                w = settings.pack24Weight ?? 9.0;
                l = settings.pack24Length ?? 45;
                b = settings.pack24Breadth ?? 30;
                h = settings.pack24Height ?? 25;
              } else if (s.includes("8")) {
                w = settings.pack8Weight ?? 3.0;
                l = settings.pack8Length ?? 30;
                b = settings.pack8Breadth ?? 22;
                h = settings.pack8Height ?? 15;
              } else {
                w = settings.pack4Weight ?? 1.5;
                l = settings.pack4Length ?? 25;
                b = settings.pack4Breadth ?? 18;
                h = settings.pack4Height ?? 12;
              }
              totalWeight += w * (item.quantity || 1);
              if (l > maxLength) maxLength = l;
              if (b > maxBreadth) maxBreadth = b;
              if (h > maxHeight) maxHeight = h;
            });

            const finalWeight = totalWeight > 0 ? totalWeight : 1.5;
            const rateRes = await fetch(
              `https://apiv2.shiprocket.in/v1/external/courier/serviceability/?pickup_postcode=${pickupPincode}&delivery_postcode=${pincode}&weight=${finalWeight}&cod=0&declared_value=${serverSubtotal}&length=${maxLength}&breadth=${maxBreadth}&height=${maxHeight}&is_insured=1`,
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
              let minTotal = Infinity;
              for (const c of couriers) {
                const total = (c.freight_charge || c.rate || 0) + (c.coverage_charges || 0) + (c.whatsapp_charges || 0);
                if (total < minTotal) minTotal = total;
              }
              serverShipping = Math.round(minTotal);
            } else {
              return NextResponse.json({
                success: false,
                error: `Delivery to PIN code ${pincode} is currently unavailable by our courier partners. Please try another delivery address.`,
              }, { status: 400 });
            }
          } else {
            serverShipping = settings.flatShippingRate ?? 49;
          }
        } catch {
          serverShipping = settings.flatShippingRate ?? 49;
        }
      } else {
        serverShipping = settings.flatShippingRate ?? 49;
      }
    } else {
      serverShipping = settings?.flatShippingRate ?? 49;
    }

    // 6. Compute final server Total (guarantees customer cannot pay ₹1 for a ₹1000 pack)
    const serverTotal = Math.max(0, serverSubtotal - serverDiscount + serverShipping);

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
            amount: Math.round(serverTotal * 100), // amount strictly in paise
            currency: "INR",
            receipt: orderNumber,
          }),
        });

        const rzpData = await rzpRes.json();
        if (rzpData && rzpData.id) {
          razorpayOrderId = rzpData.id;
        } else {
          console.error("Razorpay API order creation error response:", rzpData);
          return NextResponse.json({
            success: false,
            error: rzpData.error?.description || "Failed to initialize payment with Razorpay. Please check payment gateway credentials."
          }, { status: 500 });
        }
      } catch (err) {
        console.error("Failed to connect to Razorpay API:", err);
        return NextResponse.json({
          success: false,
          error: "Failed to connect to payment gateway. Please try again."
        }, { status: 500 });
      }
    } else {
      // Offline / Developer Sandbox fallback ONLY when Razorpay keys are not configured
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({
          success: false,
          error: "Razorpay payment gateway credentials are not configured on production server."
        }, { status: 500 });
      }
      razorpayOrderId = `mock_order_${Date.now()}`;
    }

    const orderData = {
      orderNumber,
      customerName,
      customerEmail,
      customerPhone: cleanPhone,
      shippingAddress: {
        street,
        city,
        state,
        pincode,
        country: shippingAddress.country || "India",
      },
      items: parsedItems,
      couponCode: validatedCouponCode,
      pricing: {
        subtotal: serverSubtotal,
        shipping: serverShipping,
        discount: serverDiscount,
        total: serverTotal,
      },
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

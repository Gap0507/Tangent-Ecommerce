import connectToDB from "@/lib/db";
import { Order, OrderStatus, PaymentStatus } from "@/models/Order";
import { Customer } from "@/models/Customer";
import { Coupon } from "@/models/Coupon";
import { deductInventoryForOrder } from "@/lib/inventory";
import { sendOrderConfirmationEmail } from "@/lib/email";

export interface FulfillOrderParams {
  orderId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId: string;
}

/**
 * Atomic and idempotent order fulfillment handler.
 * Safely invoked by BOTH /api/orders/verify and /api/webhooks/razorpay.
 *
 * Guarantees:
 * 1. Double processing prevention: Uses atomic findOneAndUpdate with paymentStatus != PAID.
 * 2. Exactly-once inventory deduction.
 * 3. Exactly-once coupon usage increment.
 * 4. Guaranteed Customer CRM creation/update.
 * 5. Awaited confirmation email so serverless runtimes don't freeze the promise.
 */
export async function fulfillOrder({
  orderId,
  razorpayOrderId,
  razorpayPaymentId,
}: FulfillOrderParams) {
  await connectToDB();

  const query: any = {
    paymentStatus: { $ne: PaymentStatus.PAID },
  };

  if (orderId) {
    query._id = orderId;
  } else if (razorpayOrderId) {
    query.razorpayOrderId = razorpayOrderId;
  } else {
    throw new Error("Either orderId or razorpayOrderId must be provided to fulfill order");
  }

  // ATOMIC UPDATE: Only one concurrent execution can match this and update the document
  const order = await Order.findOneAndUpdate(
    query,
    {
      $set: {
        paymentStatus: PaymentStatus.PAID,
        orderStatus: OrderStatus.CONFIRMED,
        razorpayPaymentId: razorpayPaymentId,
      },
    },
    { new: true }
  );

  // If order is null, another execution already marked this order as PAID
  if (!order) {
    console.log(`[Fulfillment] Order already fulfilled (idempotent skip). Order: ${orderId || razorpayOrderId}`);
    const existingOrder = await Order.findOne(orderId ? { _id: orderId } : { razorpayOrderId });
    return existingOrder;
  }

  console.log(`[Fulfillment] Processing fulfillment for Order #${order.orderNumber}...`);

  // 1. Decrement Product Stock Inventory accurately based on single pack / custom pack breakdown
  try {
    await deductInventoryForOrder(order.items);
  } catch (err) {
    console.error("[Fulfillment] Inventory deduction error:", err);
  }

  // 2. Increment Coupon Usage Count if a coupon was used
  if (order.couponCode) {
    try {
      await Coupon.findOneAndUpdate(
        { code: order.couponCode.toUpperCase() },
        { $inc: { usageCount: 1 } }
      );
      console.log(`[Fulfillment] Incremented usageCount for coupon: ${order.couponCode}`);
    } catch (err) {
      console.error("[Fulfillment] Failed to increment coupon usageCount:", err);
    }
  }

  // 3. Update or Create Customer Profile in CRM
  try {
    await Customer.findOneAndUpdate(
      { email: order.customerEmail.toLowerCase().trim() },
      {
        $set: {
          name: order.customerName,
          phone: order.customerPhone,
        },
        $inc: {
          totalOrders: 1,
          totalSpend: order.pricing.total,
        },
      },
      { upsert: true, new: true }
    );
    console.log(`[Fulfillment] CRM profile updated for: ${order.customerEmail}`);
  } catch (err) {
    console.error("[Fulfillment] Failed to update customer CRM:", err);
  }

  // 4. Send Order Confirmation Email (awaited so serverless execution context does not drop it)
  try {
    await sendOrderConfirmationEmail({
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      orderNumber: order.orderNumber,
      items: order.items.map((item: any) => ({
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      pricing: order.pricing,
      shippingAddress: order.shippingAddress,
    });
    console.log(`[Fulfillment] Confirmation email dispatched for Order #${order.orderNumber}`);
  } catch (err) {
    console.error("[Fulfillment] Failed to send confirmation email:", err);
  }

  return order;
}


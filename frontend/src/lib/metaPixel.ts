/**
 * Meta Pixel Standard Event Tracking Utility
 * Standard events: ViewContent, AddToCart, InitiateCheckout, Purchase
 * Fails silently if adblockers are active to prevent interrupting user flow.
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    try {
      window.fbq("track", eventName, params);
      if (process.env.NODE_ENV !== "production") {
        console.log(`[Meta Pixel] Tracked ${eventName}:`, params);
      }
    } catch (err) {
      console.warn(`[Meta Pixel] Failed to track ${eventName}:`, err);
    }
  }
}

/**
 * 1. ViewContent: Trigger when customer views any product page
 */
export function trackViewContent(product: {
  id: string;
  name: string;
  price?: number;
  category?: string;
}) {
  trackEvent("ViewContent", {
    content_name: product.name,
    content_category: product.category || "Beverages",
    content_ids: [product.id],
    content_type: "product",
    value: typeof product.price === "number" ? product.price : 0,
    currency: "INR",
  });
}

/**
 * 2. AddToCart: Trigger after a product is successfully added to the cart
 */
export function trackAddToCart(item: {
  id: string;
  name: string;
  price: number;
  quantity?: number;
}) {
  const qty = item.quantity || 1;
  trackEvent("AddToCart", {
    content_name: item.name,
    content_ids: [item.id],
    content_type: "product",
    value: item.price * qty,
    currency: "INR",
  });
}

/**
 * 3. InitiateCheckout: Trigger when a customer begins the checkout process
 */
export function trackInitiateCheckout(params: {
  items: Array<{ productId?: string; id?: string; quantity: number; price: number }>;
  total: number;
}) {
  trackEvent("InitiateCheckout", {
    content_ids: params.items.map((i) => i.productId || i.id || "item"),
    contents: params.items.map((i) => ({
      id: i.productId || i.id || "item",
      quantity: i.quantity,
      item_price: i.price,
    })),
    num_items: params.items.reduce((acc, i) => acc + i.quantity, 0),
    value: params.total,
    currency: "INR",
  });
}

/**
 * 4. Purchase: Trigger only after payment gateway & backend verify the order
 */
export function trackPurchase(params: {
  orderId?: string;
  total: number;
  items: Array<{ id?: string; productId?: string; sku?: string; quantity: number; price: number; name?: string }>;
}) {
  trackEvent("Purchase", {
    content_type: "product",
    content_ids: params.items.map((i) => i.productId || i.sku || i.id || "item"),
    contents: params.items.map((i) => ({
      id: i.productId || i.sku || i.id || "item",
      quantity: i.quantity,
      item_price: i.price,
    })),
    num_items: params.items.reduce((acc, i) => acc + i.quantity, 0),
    value: params.total,
    currency: "INR",
  });
}


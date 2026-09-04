"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ChevronRight,
  Lock,
  RotateCcw,
  Leaf,
  Tag,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useCart } from "@/context/CartContext";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  // Form State - Empty by default for dynamic customer entry
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Karnataka");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [shippingFee, setShippingFee] = useState(subtotal >= 1999 ? 0 : 49);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  // Dynamically load Razorpay SDK script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Update shipping when pincode changes
  useEffect(() => {
    if (pincode && pincode.length >= 6) {
      setIsCalculatingShipping(true);
      fetch("/api/shipping/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pincode, subtotal }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setShippingFee(subtotal >= 1999 ? 0 : data.data.shippingCost);
          }
        })
        .catch((err) => console.error("Error fetching shipping rates:", err))
        .finally(() => setIsCalculatingShipping(false));
    }
  }, [pincode, subtotal]);

  // Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponMessage(null);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, orderValue: subtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setCouponDiscount(data.data.discountAmount);
        setCouponMessage({ text: `Coupon '${couponCode.toUpperCase()}' applied! Saved ₹${data.data.discountAmount}`, isError: false });
      } else {
        setCouponDiscount(0);
        setCouponMessage({ text: data.error || "Invalid coupon code", isError: true });
      }
    } catch {
      setCouponMessage({ text: "Failed to validate coupon", isError: true });
    }
  };

  const finalTotal = Math.max(0, subtotal - couponDiscount + shippingFee);

  // Handle Order Submission
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    if (!fullName || !email || !phone || !address || !city || !state || !pincode) {
      setErrorMsg("Please fill in all required shipping address fields.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // 1. Create order on backend
      const orderPayload = {
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: {
          street: `${address}${apartment ? `, ${apartment}` : ""}`,
          city,
          state,
          pincode,
          country: "India",
        },
        items: items.map((i) => ({
          productId: i.productId,
          sku: i.productId,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          image: i.image,
        })),
        pricing: {
          subtotal,
          shipping: shippingFee,
          discount: couponDiscount,
          total: finalTotal,
        },
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const orderResult = await res.json();

      if (!orderResult.success) {
        throw new Error(orderResult.error || "Failed to create order");
      }

      const createdOrder = orderResult.data;
      const razorpayOrderId = orderResult.razorpayOrderId;
      const razorpayKeyId = orderResult.razorpayKeyId;

      // Function to complete payment & verify
      const completeVerification = async (payId?: string, sig?: string) => {
        const verifyRes = await fetch("/api/orders/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: createdOrder._id,
            razorpayOrderId,
            razorpayPaymentId: payId || `pay_mock_${Date.now()}`,
            razorpaySignature: sig || "mock_signature",
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setCompletedOrder(verifyData.data || createdOrder);
          clearCart();
        } else {
          throw new Error(verifyData.error || "Payment verification failed");
        }
      };

      // If Razorpay SDK is available on window, open popup
      if (typeof window !== "undefined" && window.Razorpay) {
        const options: any = {
          key: razorpayKeyId,
          amount: Math.round(finalTotal * 100),
          currency: "INR",
          name: "Tangent Drinks",
          description: `Order #${createdOrder.orderNumber}`,
          handler: async function (response: any) {
            try {
              await completeVerification(
                response.razorpay_payment_id,
                response.razorpay_signature
              );
            } catch (err: any) {
              setErrorMsg(err.message || "Payment verification failed.");
            } finally {
              setIsSubmitting(false);
            }
          },
          prefill: {
            name: fullName,
            email: email,
            contact: phone,
          },
          theme: {
            color: "#091E33",
          },
          modal: {
            ondismiss: function () {
              setIsSubmitting(false);
            },
          },
        };

        if (razorpayOrderId && razorpayOrderId.startsWith("order_")) {
          options.order_id = razorpayOrderId;
        }

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          setErrorMsg(`Payment failed: ${response.error.description || "Transaction cancelled or blocked by browser extensions."}`);
          setIsSubmitting(false);
        });
        rzp.open();
      } else {
        // Mock fallback mode if script fails or in dev sandbox
        await completeVerification();
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong creating your order.");
      setIsSubmitting(false);
    }
  };

  // ORDER CONFIRMATION SUCCESS SCREEN
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] py-16 px-4 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl p-8 md:p-10 border border-navy/10 shadow-xl text-center">
          <div className="w-16 h-16 bg-[#DCFCE7] text-[#166534] rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[12px] font-bold uppercase tracking-widest text-[#166534] bg-[#F0FDF4] px-3 py-1 rounded-full border border-[#166534]/10">
            Payment Confirmed
          </span>

          <h1 className="font-fraunces text-3xl md:text-4xl font-black text-navy mt-4 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-ink/60 font-medium text-[14px] mb-6">
            Thank you for your purchase, {completedOrder.customerName}. Your order is being packed.
          </p>

          <div className="bg-[#FAF7F2] rounded-2xl p-5 text-left border border-navy/10 space-y-3 mb-8 text-[13px]">
            <div className="flex justify-between border-b border-navy/10 pb-2">
              <span className="font-bold text-navy/60">Order Number</span>
              <span className="font-extrabold text-navy">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between border-b border-navy/10 pb-2">
              <span className="font-bold text-navy/60">Amount Paid</span>
              <span className="font-black text-[#166534]">₹{completedOrder.pricing?.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-bold text-navy/60">Shipping Address</span>
              <span className="font-medium text-navy text-right max-w-[220px]">
                {completedOrder.shippingAddress?.street}, {completedOrder.shippingAddress?.city} - {completedOrder.shippingAddress?.pincode}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/shop"
              className="flex-1 bg-[#091E33] hover:bg-navy text-white font-bold py-3.5 px-6 rounded-2xl transition-all shadow-md text-center text-[14px]"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[12px] font-bold text-ink/50 mb-8">
          <Link href="/" className="hover:text-navy transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/cart" className="hover:text-navy transition-colors">Your Cart</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-navy">Checkout</span>
        </nav>

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-navy font-fraunces mb-2 tracking-tight">Checkout</h1>
          <p className="text-ink/60 font-medium">Almost there! Complete your order details below</p>
        </div>

        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-10">

          {/* Left Column - Forms */}
          <div className="flex-1 space-y-6">

            {/* Error banner */}
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 text-[14px] font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Secure Checkout Banner */}
            <div className="bg-[#F0FDF4] border border-[#166534]/10 rounded-2xl p-4 flex items-start gap-4">
              <div className="bg-white rounded-full p-2 border border-[#166534]/10 shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#166534]" />
              </div>
              <div>
                <h4 className="font-bold text-[#166534] text-[15px]">100% Secure Checkout</h4>
                <p className="text-[13px] text-[#166534]/70 font-medium">Encrypted SSL payment pipeline via Razorpay.</p>
              </div>
            </div>

            {/* 1. Contact Information */}
            <div className="bg-white rounded-3xl border border-navy/5 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-navy font-black text-[14px]">1</div>
                <h3 className="text-xl font-black text-navy font-fraunces">Contact Information</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-navy mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@domain.com"
                    required
                    className="w-full bg-transparent border border-navy/20 rounded-xl px-4 py-3 text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-navy mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full bg-transparent border border-navy/20 rounded-xl px-4 py-3 text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white rounded-3xl border border-navy/5 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-navy font-black text-[14px]">2</div>
                <h3 className="text-xl font-black text-navy font-fraunces">Shipping Address</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-bold text-navy mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                    className="w-full bg-transparent border border-navy/20 rounded-xl px-4 py-3 text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-navy mb-1.5">Street Address *</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House no., Street name, Area"
                    required
                    className="w-full bg-transparent border border-navy/20 rounded-xl px-4 py-3 text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-navy mb-1.5">Apartment, Suite, etc. <span className="text-ink/40 font-medium">(Optional)</span></label>
                  <input
                    type="text"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    placeholder="Flat 4B, Building A"
                    className="w-full bg-transparent border border-navy/20 rounded-xl px-4 py-3 text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[13px] font-bold text-navy mb-1.5">City *</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City name"
                      required
                      className="w-full bg-transparent border border-navy/20 rounded-xl px-4 py-3 text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-navy mb-1.5">State *</label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-transparent border border-navy/20 rounded-xl px-4 py-3 text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
                    >
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Gujarat">Gujarat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[13px] font-bold text-navy mb-1.5">PIN Code *</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="6-digit PIN code"
                      required
                      maxLength={6}
                      className="w-full bg-transparent border border-navy/20 rounded-xl px-4 py-3 text-[14px] text-navy focus:outline-none focus:border-navy transition-colors font-mono font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-navy mb-1.5">Landmark <span className="text-ink/40 font-medium">(Optional)</span></label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="Nearby landmark"
                    className="w-full bg-transparent border border-navy/20 rounded-xl px-4 py-3 text-[14px] text-navy focus:outline-none focus:border-navy transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 3. Shipping Method */}
            <div className="bg-white rounded-3xl border border-navy/5 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-navy font-black text-[14px]">3</div>
                <h3 className="text-xl font-black text-navy font-fraunces">Shipping Method</h3>
              </div>

              <div className="border border-navy border-opacity-20 rounded-xl p-4 bg-[#F0F6FF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0F5394]" />
                <div className="flex items-center gap-4 pl-2">
                  <div className="w-5 h-5 rounded-full border-[5px] border-[#0F5394] bg-white shrink-0" />
                  <div className="bg-white rounded-full p-2 border border-navy/5">
                    <Truck className="w-5 h-5 text-[#0F5394]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy text-[14px]">Standard Express Delivery</h4>
                    <p className="text-[12px] text-ink/60 font-medium">3-5 business days via Shiprocket</p>
                  </div>
                </div>
                <div className="sm:text-right pl-[4.5rem] sm:pl-0">
                  {isCalculatingShipping ? (
                    <Loader2 className="w-4 h-4 animate-spin text-navy" />
                  ) : shippingFee === 0 ? (
                    <>
                      <span className="font-black text-[#166534] text-[15px] block">FREE</span>
                      <span className="text-[11px] text-ink/50 font-medium">Unlocked (Orders ₹1999+ ship FREE)</span>
                    </>
                  ) : (
                    <span className="font-black text-navy text-[15px]">₹{shippingFee}</span>
                  )}
                </div>
              </div>
            </div>

            {/* 4. Payment Method */}
            <div className="bg-white rounded-3xl border border-navy/5 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-navy font-black text-[14px]">4</div>
                <h3 className="text-xl font-black text-navy font-fraunces">Payment Method</h3>
              </div>

              <div className="border border-navy/20 rounded-xl overflow-hidden divide-y divide-navy/10">
                <div
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-colors ${paymentMethod === 'razorpay' ? 'bg-[#F0F6FF]/30 relative' : 'hover:bg-cream/20'}`}
                  onClick={() => setPaymentMethod('razorpay')}
                >
                  {paymentMethod === 'razorpay' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0F5394]" />}
                  <div className="flex items-center gap-4 pl-2">
                    <div className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center shrink-0 ${paymentMethod === 'razorpay' ? 'border-[#0F5394]' : 'border-navy/30'}`}>
                      {paymentMethod === 'razorpay' && <div className="w-2.5 h-2.5 rounded-full bg-[#0F5394]" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-[#02042B] text-white text-[12px] font-black px-2 py-1 rounded italic tracking-tighter">Razorpay</div>
                      <span className="text-[13px] text-ink/70 font-medium ml-1">Pay securely via Razorpay</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-[3.25rem] sm:pl-0">
                    <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center font-bold text-[8px] text-blue-900">VISA</div>
                    <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center font-bold text-[8px] text-red-500">MC</div>
                    <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center font-bold text-[8px] text-orange-500">UPI</div>
                    <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200 flex items-center justify-center font-bold text-[8px] text-purple-700">RuPay</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-[12px] text-ink/60 font-medium justify-center sm:justify-start">
                <Lock className="w-3.5 h-3.5" />
                <span>Your payment details are 100% encrypted & secure.</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || items.length === 0}
                className="w-full bg-[#091E33] hover:bg-[#071728] disabled:opacity-50 text-white font-bold text-[16px] py-4 rounded-2xl mt-4 transition-all shadow-lg hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{finalTotal.toFixed(2)} & Place Order</span>
                    <Lock className="w-4 h-4 opacity-50 ml-1" />
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Right Column - Order Summary */}
          <div className="w-full lg:w-[420px] shrink-0 mt-8 lg:mt-0">
            <div className="bg-white rounded-3xl border border-navy/5 shadow-sm p-6 lg:p-8 sticky top-8">
              <h2 className="text-2xl font-black text-navy font-fraunces mb-6">Order Summary</h2>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-navy/5">
                <span className="text-[13px] font-bold text-navy">{items.length} Item(s) in Cart</span>
                <Link href="/cart" className="text-[13px] font-bold text-[#0F5394] hover:underline">Edit Cart</Link>
              </div>

              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto no-scrollbar pr-1">
                {items.length === 0 ? (
                  <p className="text-[13px] text-ink/50 py-4 text-center">Your cart is empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-black/5 p-2 flex items-center justify-center shrink-0">
                        <Image src={item.image} alt={item.name} width={40} height={40} className="object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-navy text-[13px] truncate">{item.name}</h4>
                        <p className="text-[11px] text-ink/50">{item.size}</p>
                        <p className="text-[11px] font-bold text-ink/70">Qty: {item.quantity}</p>
                      </div>
                      <div className="font-black text-navy text-[14px]">₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-navy/5 text-[14px]">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-ink/70">Subtotal</span>
                  <span className="font-bold text-navy">₹{subtotal.toFixed(2)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center text-[#166534]">
                    <span className="font-medium">Discount</span>
                    <span className="font-bold">-₹{couponDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="font-medium text-ink/70">Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-black text-[#166534]">FREE</span>
                  ) : (
                    <span className="font-bold text-navy">₹{shippingFee.toFixed(2)}</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-end pt-4 mt-4 border-t border-navy/10 mb-6">
                <span className="font-black text-navy text-[18px]">Total</span>
                <span className="font-black text-navy text-3xl">₹{finalTotal.toFixed(2)}</span>
              </div>

              {/* Coupon Input */}
              <div className="mb-6">
                <div className="flex gap-2 p-1.5 bg-[#FAF7F2] border border-navy/10 rounded-xl border-dashed">
                  <div className="flex-1 relative">
                    <Tag className="w-4 h-4 text-navy/40 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Coupon code"
                      className="w-full bg-transparent pl-9 pr-3 py-2 text-[13px] font-bold text-navy focus:outline-none placeholder:text-navy/40 uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-[#F0F6FF] text-[#0F5394] font-bold text-[13px] px-5 py-2 rounded-lg hover:bg-[#E0EFFF] transition-colors shrink-0 cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
                {couponMessage && (
                  <p className={`text-[12px] font-semibold mt-2 ${couponMessage.isError ? 'text-red-600' : 'text-[#166534]'}`}>
                    {couponMessage.text}
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="space-y-4 pt-6 border-t border-navy/5">
                <div className="flex items-start gap-3">
                  <div className="bg-cream rounded-full p-2 shrink-0">
                    <Lock className="w-4 h-4 text-navy/70" />
                  </div>
                  <div>
                    <h5 className="font-bold text-navy text-[12px]">100% Secure Payment</h5>
                    <p className="text-[11px] text-ink/60 font-medium">Transactions processed via SSL encryption.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-cream rounded-full p-2 shrink-0">
                    <Truck className="w-4 h-4 text-navy/70" />
                  </div>
                  <div>
                    <h5 className="font-bold text-navy text-[12px]">Shiprocket Dispatch</h5>
                    <p className="text-[11px] text-ink/60 font-medium">Tracking number generated upon shipping.</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </form>

      </div>
    </div>
  );
}

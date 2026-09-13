"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ChevronRight,
  RefreshCw,
  ShoppingBag
} from "lucide-react";

interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  size?: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderData {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: OrderItem[];
  pricing: {
    subtotal: number;
    shipping: number;
    discount: number;
    total: number;
  };
  orderStatus: string;
  paymentStatus: string;
  shipmentStatus: string;
  awbCode?: string;
  courierName?: string;
  createdAt: string;
}

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [searchInput, setSearchInput] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [orders, setOrders] = useState<OrderData[]>([]);

  const handleSearch = async (queryToSearch?: string) => {
    const q = (queryToSearch !== undefined ? queryToSearch : searchInput).trim();
    if (!q) {
      setErrorMsg("Please enter your Order Number.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setSearched(true);

    try {
      const res = await fetch(`/api/track-order?query=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (data.success && data.orders) {
        setOrders(data.orders);
      } else {
        setOrders([]);
        setErrorMsg(data.message || "No order found matching that Order Number. Please check your confirmation email.");
      }
    } catch (err) {
      console.error("Search order error:", err);
      setErrorMsg("Something went wrong while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const getStepProgress = (orderStatus: string, shipmentStatus: string) => {
    const status = orderStatus.toUpperCase();
    const ship = shipmentStatus.toUpperCase();

    if (status === "CANCELLED") return -1;
    if (status === "DELIVERED" || ship === "DELIVERED") return 4;
    if (ship === "IN_TRANSIT" || ship === "PICKED_UP") return 3;
    if (status === "SHIPPED" || ship === "CREATED") return 2;
    if (status === "PROCESSING" || status === "CONFIRMED" || status === "NEW") return 1;
    return 1;
  };

  const steps = [
    { title: "Order Placed", desc: "Received" },
    { title: "Processing", desc: "Packing & Quality Check" },
    { title: "Shipped", desc: "Handed to Courier" },
    { title: "Out for Delivery", desc: "Arriving Soon" },
    { title: "Delivered", desc: "Fulfilled" },
  ];

  return (
    <div className="min-h-screen bg-cream font-sans text-navy pb-24">
      {/* Top Banner Header */}
      <div className="bg-navy text-cream pt-16 pb-20 px-4 md:px-8 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 bg-coral/20 text-coral text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-4">
            <Truck className="w-3.5 h-3.5" /> Order Tracking
          </span>
          <h1 className="text-3xl md:text-5xl font-black font-fraunces mb-4 tracking-tight">
            Track Your Order
          </h1>
          <p className="text-cream/70 text-sm md:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Enter your <strong className="text-cream font-bold">Order Number</strong> below to track your live delivery status. Check your confirmation email to find your Order Number.
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-2xl shadow-xl border border-navy/10"
          >
            <div className="relative flex-grow flex items-center">
              <Search className="w-5 h-5 text-navy/40 absolute left-4" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Order Number (e.g. TAN-123456)"
                className="w-full pl-12 pr-4 py-3.5 text-navy text-sm font-semibold rounded-xl bg-transparent focus:outline-none placeholder:text-navy/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-navy hover:bg-navy/90 text-cream font-bold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Searching...
                </>
              ) : (
                <>
                  Track Order <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Subtle Decorative Gradient Shapes */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-coral/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-navy-light/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Main Results Container */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 -mt-8 relative z-20">

        {/* Error / Empty State */}
        {errorMsg && (
          <div className="bg-white border border-red-200 rounded-2xl p-6 mb-8 text-center shadow-sm animate-in fade-in duration-200">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-navy mb-1">Order Not Found</h3>
            <p className="text-navy/60 text-sm max-w-md mx-auto">{errorMsg}</p>
          </div>
        )}

        {/* Initial Search Prompt */}
        {!searched && !loading && (
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center border border-navy/10 shadow-sm">
            <Package className="w-16 h-16 text-navy/20 mx-auto mb-4 stroke-[1.5]" />
            <h2 className="text-xl font-extrabold text-navy mb-2">Ready to Track</h2>
            <p className="text-navy/60 text-sm max-w-md mx-auto mb-6">
              Enter your Order Number above to fetch instant live delivery updates. Check your confirmation email for your Order ID.
            </p>
            <div className="inline-flex items-center gap-6 text-xs font-semibold text-navy/50 bg-cream/50 px-6 py-3 rounded-full border border-navy/5">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure Search</span>
              <span>•</span>
              <span className="flex items-center gap-1.5"><RefreshCw className="w-4 h-4 text-navy/60" /> Real-time Updates</span>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-3xl p-12 text-center border border-navy/10 shadow-sm">
            <Loader2 className="w-12 h-12 text-navy animate-spin mx-auto mb-4" />
            <p className="text-navy font-bold text-base">Fetching your order status...</p>
            <p className="text-navy/50 text-xs mt-1">Checking live dispatch and delivery tracking</p>
          </div>
        )}

        {/* Orders Results */}
        {!loading && orders.length > 0 && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-extrabold text-navy uppercase tracking-wider">
                Found {orders.length} Order{orders.length > 1 ? "s" : ""}
              </h2>
              <span className="text-xs text-navy/50 font-medium">Sorted by newest first</span>
            </div>

            {orders.map((order) => {
              const currentStep = getStepProgress(order.orderStatus, order.shipmentStatus);
              const isCancelled = currentStep === -1;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-navy/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Card Header */}
                  <div className="bg-cream/60 p-6 md:p-8 border-b border-navy/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-black text-navy font-fraunces">
                          #{order.orderNumber}
                        </h3>
                        <span className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full ${isCancelled
                            ? "bg-red-100 text-red-700"
                            : order.orderStatus === "DELIVERED"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-navy/10 text-navy"
                          }`}>
                          {order.orderStatus}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-navy/50">
                        Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <p className="text-xs font-bold text-navy/50 uppercase tracking-wider">Total Amount</p>
                      <p className="text-xl font-black text-navy font-fraunces">₹{order.pricing.total.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Tracking Stepper */}
                  {!isCancelled ? (
                    <div className="p-6 md:p-8 border-b border-navy/10 bg-white">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-navy/50 mb-6">Delivery Progress</h4>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
                        {steps.map((step, idx) => {
                          const isDone = currentStep > idx;
                          const isCurrent = currentStep === idx;

                          return (
                            <div key={idx} className="flex flex-col items-start md:items-center text-left md:text-center relative z-10">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-2 ${isDone
                                  ? "bg-emerald-600 text-white"
                                  : isCurrent
                                    ? "bg-navy text-cream ring-4 ring-navy/10"
                                    : "bg-cream text-navy/40 border border-navy/10"
                                }`}>
                                {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                              </div>
                              <p className={`text-xs font-bold ${isCurrent || isDone ? "text-navy" : "text-navy/40"}`}>
                                {step.title}
                              </p>
                              <p className="text-[11px] text-navy/50 hidden md:block mt-0.5">{step.desc}</p>
                            </div>
                          );
                        })}
                      </div>

                      {/* Shiprocket Courier Info */}
                      {(order.awbCode || order.courierName) && (
                        <div className="mt-8 p-4 bg-cream/40 rounded-2xl border border-navy/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center">
                              <Truck className="w-5 h-5 text-navy" />
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-navy">
                                Courier: {order.courierName || "Shiprocket Express"}
                              </p>
                              <p className="text-xs text-navy/60 font-semibold">
                                AWB: <span className="font-mono text-navy font-bold">{order.awbCode}</span>
                              </p>
                            </div>
                          </div>

                          <a
                            href={`https://shiprocket.co/tracking/${order.awbCode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-navy hover:text-coral flex items-center gap-1.5 transition-colors bg-white px-4 py-2 rounded-xl border border-navy/10 shadow-xs"
                          >
                            Live Tracking <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 md:p-8 bg-red-50/50 border-b border-navy/10 flex items-center gap-3 text-red-700">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p className="text-xs font-semibold">This order has been cancelled.</p>
                    </div>
                  )}

                  {/* Order Items & Shipping Address Grid */}
                  <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="md:col-span-2 space-y-4">
                      <h4 className="text-xs font-extrabold uppercase tracking-wider text-navy/50 mb-2">Order Items</h4>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 py-2 border-b border-navy/5 last:border-0">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={56}
                              height={56}
                              className="w-14 h-14 object-cover rounded-xl border border-navy/10 bg-cream"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-cream rounded-xl border border-navy/10 flex items-center justify-center text-navy/30">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                          <div className="flex-grow">
                            <p className="text-sm font-bold text-navy">{item.name}</p>
                            <p className="text-xs text-navy/50 font-medium">
                              {item.size ? item.size + " · " : ""}Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-extrabold text-navy">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address Box */}
                    <div className="bg-cream/40 p-5 rounded-2xl border border-navy/10 h-fit">
                      <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-navy/60 mb-3">
                        <MapPin className="w-4 h-4 text-coral" /> Delivery Address
                      </div>
                      <p className="text-sm font-bold text-navy mb-1">{order.customerName}</p>
                      <p className="text-xs text-navy/70 leading-relaxed font-medium">
                        {order.shippingAddress.street}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
                        {order.shippingAddress.country}
                      </p>
                      <div className="mt-4 pt-3 border-t border-navy/10 text-xs text-navy/60 font-semibold space-y-1">
                        <p>📧 {order.customerEmail}</p>
                        <p>📞 {order.customerPhone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Support Section */}
        <div className="mt-12 text-center bg-white p-8 rounded-3xl border border-navy/10 shadow-xs">
          <h3 className="text-lg font-bold text-navy mb-1">Need help with your shipment?</h3>
          <p className="text-navy/60 text-xs max-w-md mx-auto mb-4">
            If you have questions about your order or delivery timelines, our support team is ready to assist you.
          </p>
          <a
            href="mailto:info@tangentfnb.com"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-navy bg-cream px-5 py-2.5 rounded-full border border-navy/10 hover:border-coral hover:text-coral transition-colors"
          >
            Contact Customer Support →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 text-navy animate-spin" />
      </div>
    }>
      <TrackOrderContent />
    </Suspense>
  );
}

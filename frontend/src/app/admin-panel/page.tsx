"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  ArrowRight,
  IndianRupee,
  ExternalLink,
  Loader2,
} from "lucide-react";

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
  pricing: {
    total: number;
  };
  paymentStatus: string;
  orderStatus: string;
  shipmentStatus: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpend: number;
}

interface InventoryItem {
  id: string;
  name: string;
  size: string;
  stock: number;
  active: boolean;
  image: string;
}

const DEFAULT_INVENTORY: InventoryItem[] = [
  { id: "watermelon-mint", name: "Watermelon Mint", size: "250ml", stock: 150, active: true, image: "/can2.png" },
  { id: "yuzu-mint", name: "Yuzu Mint", size: "250ml", stock: 120, active: true, image: "/can4.png" },
  { id: "guava-chilli", name: "Guava Chilli", size: "250ml", stock: 80, active: true, image: "/can3.png" },
  { id: "watermelon-cranberry", name: "Watermelon Cranberry", size: "250ml", stock: 60, active: true, image: "/can1.png" },
];

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>(DEFAULT_INVENTORY);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [ordersRes, customersRes, productsRes] = await Promise.all([
          fetch("/api/orders").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/customers").then((r) => r.json()).catch(() => ({ success: false })),
          fetch("/api/products").then((r) => r.json()).catch(() => ({ success: false })),
        ]);

        if (ordersRes.success && Array.isArray(ordersRes.data)) {
          setOrders(ordersRes.data);
        }

        if (customersRes.success && Array.isArray(customersRes.data)) {
          setCustomers(customersRes.data);
        }

        if (productsRes.success && Array.isArray(productsRes.data) && productsRes.data.length > 0) {
          const dbProducts = productsRes.data;
          setInventory((prev) =>
            prev.map((item) => {
              const matched = dbProducts.find(
                (p: any) =>
                  p.name.toLowerCase().includes(item.name.toLowerCase()) ||
                  item.id.includes(p.sku.toLowerCase())
              );
              if (matched) {
                return {
                  ...item,
                  stock: matched.stock !== undefined ? matched.stock : item.stock,
                  active: matched.isActive !== undefined ? matched.isActive : item.active,
                };
              }
              return item;
            })
          );
        }
      } catch (err) {
        console.error("Error loading admin dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const handleToggleInventory = (id: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const handleStockChange = (id: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: Math.max(0, newStock) } : item))
    );
  };

  const handlePackOrder = async (orderId: string) => {
    setProcessingId(orderId);
    try {
      const res = await fetch("/api/shipments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });
      const data = await res.json();
      if (data.success) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, shipmentStatus: "CREATED", orderStatus: "SHIPPED" } : o))
        );
        alert(`Shipment created successfully! AWB: ${data.data.awbCode}`);
      } else {
        alert(data.error || "Failed to create shipment");
      }
    } catch (e) {
      console.error(e);
      alert("Error creating shipment");
    } finally {
      setProcessingId(null);
    }
  };

  // Metrics Calculations
  const todayStr = new Date().toISOString().split("T")[0];
  const todayOrders = orders.filter(
    (o) => o.createdAt && new Date(o.createdAt).toISOString().split("T")[0] === todayStr
  );
  const todaySales = todayOrders.reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  const ordersToFulfill = orders.filter(
    (o) => o.paymentStatus === "PAID" && o.shipmentStatus !== "CREATED" && o.orderStatus !== "SHIPPED"
  );

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + (o.pricing?.total || 0), 0);

  const recentOrders = [...orders].slice(0, 5);

  const topCustomers = [...customers]
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-navy font-bold">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-navy/60" />
        <p className="text-[14px]">Loading live dashboard metrics...</p>
      </div>
    );
  }

  return (
    <>
      {/* ---------------- KPI SUMMARY CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-ink/60 mb-1">Today&apos;s Sales</p>
            <h3 className="font-fraunces font-black text-[30px] text-navy leading-none mb-2">
              ₹{todaySales.toLocaleString("en-IN")}
            </h3>
            <p className="text-[12px] font-bold text-[#6A9A4A] flex items-center gap-1">
              <span>{todayOrders.length} order(s) today</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#E8F2FD] flex items-center justify-center text-[#1E73BE] shrink-0">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-ink/60 mb-1">Orders to Fulfill</p>
            <h3 className="font-fraunces font-black text-[30px] text-navy leading-none mb-2">
              {ordersToFulfill.length}
            </h3>
            <p className="text-[12px] font-bold text-[#D97706]">
              {ordersToFulfill.length > 0 ? "Requires packing & shipping" : "All orders fulfilled"}
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0">
            <Package className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-ink/60 mb-1">Total Paid Revenue</p>
            <h3 className="font-fraunces font-black text-[30px] text-navy leading-none mb-2">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </h3>
            <p className="text-[12px] font-bold text-[#6A9A4A] flex items-center gap-1">
              <span>From {orders.filter(o => o.paymentStatus === 'PAID').length} paid order(s)</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#EDF5E6] flex items-center justify-center text-[#4B7322] shrink-0">
            <IndianRupee className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* ---------------- MIDDLE SECTION: RECENT ORDERS & INVENTORY ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Recent Orders */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-fraunces font-bold text-[20px] text-navy">Recent Orders</h3>
              <Link
                href="/admin-panel/all-orders"
                className="text-[13px] font-bold text-navy hover:text-[#6A9A4A] flex items-center gap-1 transition-colors"
              >
                <span>View All Orders</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/40 border-b border-navy/10 pb-3">
                    <th className="pb-3 font-bold">ORDER ID</th>
                    <th className="pb-3 font-bold">CUSTOMER</th>
                    <th className="pb-3 font-bold">DATE</th>
                    <th className="pb-3 font-bold">AMOUNT</th>
                    <th className="pb-3 font-bold text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/5">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-ink/50">
                        No orders recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-cream/30 transition-colors">
                        <td className="py-4 font-bold text-navy">{order.orderNumber}</td>
                        <td className="py-4 font-medium text-navy/80">{order.customerName}</td>
                        <td className="py-4 text-ink/60">{formatDate(order.createdAt)}</td>
                        <td className="py-4 font-bold text-navy">₹{order.pricing?.total || 0}</td>
                        <td className="py-4 text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                              order.paymentStatus === "PAID"
                                ? "bg-[#ECFDF5] text-[#047857]"
                                : order.paymentStatus === "REFUNDED"
                                ? "bg-[#FEE2E2] text-[#B91C1C]"
                                : "bg-[#FEF3C7] text-[#B45309]"
                            }`}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-fraunces font-bold text-[20px] text-navy">Inventory Overview</h3>
              <Link href="/admin-panel/inventory" className="text-[13px] font-bold text-navy hover:text-[#6A9A4A] flex items-center gap-1 cursor-pointer">
                <span>View All Products</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-ink/40 pb-2 border-b border-navy/10 px-1">
                <div className="col-span-6">PRODUCT</div>
                <div className="col-span-3 text-center">STOCK</div>
                <div className="col-span-3 text-right">STATUS</div>
              </div>
              {inventory.map((item) => (
                <div key={item.id} className="grid grid-cols-12 items-center py-2 px-1">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-black/5 p-1 flex items-center justify-center shrink-0">
                      <Image src={item.image} alt={item.name} width={32} height={32} className="object-contain max-h-8" unoptimized />
                    </div>
                    <div>
                      <h4 className="font-bold text-[13.5px] text-navy leading-tight">{item.name}</h4>
                      <p className="text-[11px] text-ink/50">{item.size}</p>
                    </div>
                  </div>
                  <div className="col-span-3 flex justify-center">
                    <input
                      type="number"
                      value={item.stock}
                      onChange={(e) => handleStockChange(item.id, parseInt(e.target.value) || 0)}
                      className="w-16 bg-[#FAF7F2] border border-navy/15 rounded-xl text-center py-1.5 text-[13px] font-bold text-navy focus:outline-none focus:border-navy"
                    />
                  </div>
                  <div className="col-span-3 flex justify-end">
                    <button
                      onClick={() => handleToggleInventory(item.id)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${item.active ? "bg-[#34D399]" : "bg-gray-300"}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${item.active ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[12px] text-ink/40 font-medium pt-3 border-t border-navy/5">Showing {inventory.length} active catalog products</p>
        </div>
      </div>

      {/* ---------------- BOTTOM SECTION: ORDERS TO FULFILL, TOP CUSTOMERS, BRAND BANNER ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Orders to Fulfill List */}
        <div className="lg:col-span-4 bg-[#FFFFFF] rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="font-fraunces font-bold text-[20px] text-navy">Orders to Fulfill</h3>
                <span className="bg-[#FEF3C7] text-[#B45309] text-[12px] font-bold px-2 py-0.5 rounded-full">
                  {ordersToFulfill.length}
                </span>
              </div>
              <Link
                href="/admin-panel/pending-orders"
                className="text-[13px] font-bold text-navy hover:text-[#6A9A4A] flex items-center gap-1 transition-colors"
              >
                <span>View All</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3 mb-6">
              {ordersToFulfill.length === 0 ? (
                <div className="bg-[#FAF7F2] rounded-2xl p-4 text-center text-ink/50 text-[13px]">
                  No unfulfilled orders pending.
                </div>
              ) : (
                ordersToFulfill.slice(0, 3).map((ord) => {
                  const isProcessing = processingId === ord._id;
                  return (
                    <div
                      key={ord._id}
                      className="bg-[#FAF7F2] rounded-2xl p-3.5 flex items-center justify-between border border-black/5"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-[13px] text-navy">{ord.orderNumber}</span>
                          <span className="text-[12px] text-navy/70 truncate max-w-[90px]">{ord.customerName}</span>
                        </div>
                        <p className="text-[11px] text-ink/50">
                          {formatDate(ord.createdAt)} • <span className="font-bold text-navy">₹{ord.pricing?.total}</span>
                        </p>
                      </div>

                      <button
                        onClick={() => handlePackOrder(ord._id)}
                        disabled={isProcessing}
                        className="text-[12px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer bg-[#091E33] hover:bg-[#071728] text-white disabled:opacity-50"
                      >
                        {isProcessing ? "Processing..." : "Push to Shiprocket"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <Link
            href="/admin-panel/pending-orders"
            className="text-[13px] font-bold text-navy hover:underline flex items-center gap-1 transition-all pt-2"
          >
            <span>View all orders to fulfill</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Top Customers */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-fraunces font-bold text-[20px] text-navy">Top Customers</h3>
              <Link href="/admin-panel/customers" className="text-[13px] font-bold text-navy hover:text-[#6A9A4A] flex items-center gap-1 cursor-pointer">
                <span>View All</span> <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/40 border-b border-navy/10 pb-2">
                  <th className="pb-2">CUSTOMER</th>
                  <th className="pb-2 text-center">ORDERS</th>
                  <th className="pb-2 text-right">TOTAL SPEND</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {topCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-ink/50">
                      No customer profiles found.
                    </td>
                  </tr>
                ) : (
                  topCustomers.map((cust) => (
                    <tr key={cust._id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-3 font-bold text-navy">{cust.name}</td>
                      <td className="py-3 text-center text-ink/70 font-medium">{cust.totalOrders}</td>
                      <td className="py-3 text-right font-bold text-navy">₹{cust.totalSpend?.toLocaleString("en-IN") || 0}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Brand Card */}
        <div className="lg:col-span-4 bg-[#EBF3E7] rounded-3xl p-6 md:p-8 border border-[#D0E2C8] shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-44 h-56 pointer-events-none transform group-hover:scale-105 transition-transform duration-500">
            <Image
              src="/can3bg.png"
              alt="Guava Chilli Can Promo"
              fill
              className="object-contain object-bottom-right"
              unoptimized
            />
          </div>

          <div className="relative z-10 max-w-[210px] mb-8">
            <h3 className="font-fraunces font-black text-navy text-[26px] leading-tight mb-2">
              Real Ingredients.<br />Real Impact.
            </h3>
            <p className="text-[13px] text-navy/70 leading-relaxed font-medium">
              You&apos;re building a healthier tomorrow, one can at a time.
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 bg-[#091E33] hover:bg-[#071728] text-white font-bold text-[13.5px] px-5 py-3 rounded-2xl shadow-md transition-all cursor-pointer"
            >
              <span>View your store</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

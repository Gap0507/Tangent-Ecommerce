"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  ArrowRight,
  IndianRupee,
  ExternalLink,
} from "lucide-react";

const INITIAL_INVENTORY = [
  { id: "watermelon-mint", name: "Watermelon Mint", size: "250ml", stock: 150, active: true, image: "/can2.png" },
  { id: "yuzu-mint", name: "Yuzu Mint", size: "250ml", stock: 120, active: true, image: "/can4.png" },
  { id: "guava-chilli", name: "Guava Chilli", size: "250ml", stock: 80, active: true, image: "/can3.png" },
  { id: "watermelon-cranberry", name: "Watermelon Cranberry", size: "250ml", stock: 60, active: false, image: "/can1.png" },
];

const RECENT_ORDERS = [
  { id: "#TNG1234", customer: "Rohit Verma", date: "May 20, 2024", amount: 598, status: "Pending" },
  { id: "#TNG1233", customer: "Ananya Sharma", date: "May 20, 2024", amount: 447, status: "Pending" },
  { id: "#TNG1232", customer: "Priya Mehta", date: "May 19, 2024", amount: 298, status: "Shipped" },
  { id: "#TNG1231", customer: "Karan Singh", date: "May 19, 2024", amount: 447, status: "Delivered" },
  { id: "#TNG1230", customer: "Sneha Patel", date: "May 18, 2024", amount: 149, status: "Delivered" },
];

const PENDING_ORDERS = [
  { id: "#TNG1234", customer: "Rohit Verma", date: "May 20, 2024", amount: 598 },
  { id: "#TNG1233", customer: "Ananya Sharma", date: "May 20, 2024", amount: 447 },
  { id: "#TNG1231", customer: "Karan Singh", date: "May 19, 2024", amount: 447 },
];

const TOP_CUSTOMERS = [
  { name: "Rohit Verma", orders: 8, spend: 4250 },
  { name: "Ananya Sharma", orders: 6, spend: 3280 },
  { name: "Priya Mehta", orders: 5, spend: 2980 },
  { name: "Karan Singh", orders: 4, spend: 2450 },
  { name: "Sneha Patel", orders: 3, spend: 1890 },
];

export default function AdminDashboardPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [packedOrders, setPackedOrders] = useState<string[]>([]);

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

  const handlePackOrder = (id: string) => {
    setPackedOrders((prev) => [...prev, id]);
  };

  return (
    <>
      {/* ---------------- KPI SUMMARY CARDS ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-ink/60 mb-1">Today&apos;s Sales</p>
            <h3 className="font-fraunces font-black text-[30px] text-navy leading-none mb-2">₹24,350</h3>
            <p className="text-[12px] font-bold text-[#6A9A4A] flex items-center gap-1">
              <span>↑ 12.5%</span> <span className="text-ink/40 font-normal">vs Yesterday</span>
            </p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#E8F2FD] flex items-center justify-center text-[#1E73BE] shrink-0">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-ink/60 mb-1">Pending Orders</p>
            <h3 className="font-fraunces font-black text-[30px] text-navy leading-none mb-2">18</h3>
            <p className="text-[12px] font-bold text-[#D97706]">3 new orders</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0">
            <Package className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[13px] font-bold text-ink/60 mb-1">Total Revenue</p>
            <h3 className="font-fraunces font-black text-[30px] text-navy leading-none mb-2">₹2,45,680</h3>
            <p className="text-[12px] font-bold text-[#6A9A4A] flex items-center gap-1">
              <span>↑ 18.6%</span> <span className="text-ink/40 font-normal">vs Last Month</span>
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
                  {RECENT_ORDERS.map((order) => (
                    <tr key={order.id} className="hover:bg-cream/30 transition-colors">
                      <td className="py-4 font-bold text-navy">{order.id}</td>
                      <td className="py-4 font-medium text-navy/80">{order.customer}</td>
                      <td className="py-4 text-ink/60">{order.date}</td>
                      <td className="py-4 font-bold text-navy">₹{order.amount}</td>
                      <td className="py-4 text-right">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                            order.status === "Pending"
                              ? "bg-[#FEF3C7] text-[#B45309]"
                              : order.status === "Shipped"
                              ? "bg-[#ECFDF5] text-[#047857]"
                              : "bg-[#EFF6FF] text-[#1D4ED8]"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
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
              <span className="text-[13px] font-bold text-navy hover:text-[#6A9A4A] flex items-center gap-1 cursor-pointer">
                <span>View All Products</span> <ArrowRight className="w-4 h-4" />
              </span>
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
          <p className="text-[12px] text-ink/40 font-medium pt-3 border-t border-navy/5">Showing 4 of 4 products</p>
        </div>
      </div>

      {/* ---------------- BOTTOM SECTION: PENDING ORDERS, TOP CUSTOMERS, BRAND BANNER ---------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Pending Orders List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="font-fraunces font-bold text-[20px] text-navy">Pending Orders</h3>
                <span className="bg-[#FEF3C7] text-[#B45309] text-[12px] font-bold px-2 py-0.5 rounded-full">
                  18
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
              {PENDING_ORDERS.map((ord) => {
                const isPacked = packedOrders.includes(ord.id);
                return (
                  <div
                    key={ord.id}
                    className="bg-[#FAF7F2] rounded-2xl p-3.5 flex items-center justify-between border border-black/5"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-[13px] text-navy">{ord.id}</span>
                        <span className="text-[12px] text-navy/70">{ord.customer}</span>
                      </div>
                      <p className="text-[11px] text-ink/50">
                        {ord.date} • <span className="font-bold text-navy">₹{ord.amount}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handlePackOrder(ord.id)}
                      disabled={isPacked}
                      className={`text-[12px] font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        isPacked
                          ? "bg-[#6A9A4A] text-white"
                          : "bg-white border border-navy/20 hover:bg-navy hover:text-white text-navy"
                      }`}
                    >
                      {isPacked ? "Packed ✓" : "Pack & Ship"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href="/admin-panel/pending-orders"
            className="text-[13px] font-bold text-navy hover:underline flex items-center gap-1 transition-all pt-2"
          >
            <span>View all pending orders</span> <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Top Customers */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-fraunces font-bold text-[20px] text-navy">Top Customers</h3>
              <span className="text-[13px] font-bold text-navy hover:text-[#6A9A4A] flex items-center gap-1 cursor-pointer">
                <span>View All</span> <ArrowRight className="w-4 h-4" />
              </span>
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
                {TOP_CUSTOMERS.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 font-bold text-navy">{cust.name}</td>
                    <td className="py-3 text-center text-ink/70 font-medium">{cust.orders}</td>
                    <td className="py-3 text-right font-bold text-navy">₹{cust.spend.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
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

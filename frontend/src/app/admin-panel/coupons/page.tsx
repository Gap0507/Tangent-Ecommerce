"use client";

import React, { useState } from "react";
import { Search, Filter, Ticket, Tag, Percent, IndianRupee, Copy, MoreVertical, Pencil, Lightbulb, ExternalLink } from "lucide-react";

interface Coupon {
  id: string;
  code: string;
  discount: string;
  discountType: string;
  minOrder: string;
  minOrderType: string;
  usageUsed: number;
  usageTotal: number;
  validityDate: string;
  validityDays: string;
  status: "Active" | "Expired";
}

const COUPONS_DATA: Coupon[] = [
  {
    id: "coup-1",
    code: "TANGENT10",
    discount: "10% OFF",
    discountType: "Flat discount",
    minOrder: "₹799",
    minOrderType: "Min. order",
    usageUsed: 128,
    usageTotal: 500,
    validityDate: "May 1 – May 31, 2024",
    validityDays: "31 days left",
    status: "Active",
  },
  {
    id: "coup-2",
    code: "FREESHIP",
    discount: "Free Shipping",
    discountType: "On shipping",
    minOrder: "₹499",
    minOrderType: "Min. order",
    usageUsed: 86,
    usageTotal: 300,
    validityDate: "May 1 – May 31, 2024",
    validityDays: "31 days left",
    status: "Active",
  },
  {
    id: "coup-3",
    code: "YUZU15",
    discount: "15% OFF",
    discountType: "Flat discount",
    minOrder: "₹999",
    minOrderType: "Min. order",
    usageUsed: 42,
    usageTotal: 200,
    validityDate: "Apr 20 – May 20, 2024",
    validityDays: "Expired",
    status: "Expired",
  },
  {
    id: "coup-4",
    code: "SUMMER20",
    discount: "20% OFF",
    discountType: "Flat discount",
    minOrder: "₹1,499",
    minOrderType: "Min. order",
    usageUsed: 45,
    usageTotal: 250,
    validityDate: "Apr 15 – Jun 15, 2024",
    validityDays: "26 days left",
    status: "Active",
  },
  {
    id: "coup-5",
    code: "WELCOME5",
    discount: "5% OFF",
    discountType: "Flat discount",
    minOrder: "₹399",
    minOrderType: "Min. order",
    usageUsed: 22,
    usageTotal: 1000,
    validityDate: "Apr 10 – Dec 31, 2024",
    validityDays: "225 days left",
    status: "Active",
  },
  {
    id: "coup-6",
    code: "FIRSTBUY",
    discount: "₹100 OFF",
    discountType: "Flat discount",
    minOrder: "₹599",
    minOrderType: "Min. order",
    usageUsed: 19,
    usageTotal: 100,
    validityDate: "Apr 1 – Jun 30, 2024",
    validityDays: "41 days left",
    status: "Active",
  },
];

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCoupons = COUPONS_DATA.filter(
    (coupon) => coupon.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Coupons */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div className="w-13 h-13 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7E22CE] shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Total Coupons</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">12</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">All time</p>
          </div>
        </div>

        {/* Card 2: Active Coupons */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div className="w-13 h-13 rounded-2xl bg-[#EDF5E6] flex items-center justify-center text-[#4B7322] shrink-0">
            <Tag className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Active Coupons</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">6</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">Currently active</p>
          </div>
        </div>

        {/* Card 3: Total Redemptions */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div className="w-13 h-13 rounded-2xl bg-[#FFF3E0] flex items-center justify-center text-[#FB8C00] shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Total Redemptions</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">342</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">All time</p>
          </div>
        </div>

        {/* Card 4: Total Discount Given */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div className="w-13 h-13 rounded-2xl bg-[#E8F2FD] flex items-center justify-center text-[#1E73BE] shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Total Discount Given</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">₹28,450</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">All time</p>
          </div>
        </div>

      </div>

      {/* Action Bar (Search & Filter) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by coupon code or name..."
            className="w-full bg-white border border-navy/15 rounded-xl py-2.5 pl-9 pr-4 text-[13px] text-navy placeholder:text-ink/40 focus:outline-none focus:border-navy shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[13px] px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm whitespace-nowrap">
            <Filter className="w-4 h-4 text-navy/70" />
            <span>Filters</span>
          </button>

          <div className="flex items-center gap-2 bg-white border border-navy/20 rounded-xl px-3 py-2.5 shadow-sm text-[13px] font-bold text-navy">
            <span className="text-ink/60">Sort by:</span>
            <select className="bg-transparent focus:outline-none cursor-pointer">
              <option>Latest</option>
              <option>Oldest</option>
              <option>Most Used</option>
            </select>
          </div>
        </div>
      </div>

      {/* Coupons Table Container */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6 pb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/40 border-b border-navy/10 pb-4">
                <th className="pb-3 px-2">COUPON CODE</th>
                <th className="pb-3 px-2">DISCOUNT</th>
                <th className="pb-3 px-2">MIN. ORDER VALUE</th>
                <th className="pb-3 px-2">USAGE</th>
                <th className="pb-3 px-2">VALIDITY</th>
                <th className="pb-3 px-2 text-center">STATUS</th>
                <th className="pb-3 px-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {filteredCoupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-cream/20 transition-colors">
                  
                  {/* Coupon Code */}
                  <td className="py-5 px-2">
                    <div className="inline-flex items-center gap-2 bg-[#FFF8E7] text-navy font-bold text-[13px] px-3 py-1.5 rounded-lg border border-[#FDE68A]">
                      <span>{coupon.code}</span>
                      <button className="text-navy/40 hover:text-navy cursor-pointer transition-colors" title="Copy Code">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Discount */}
                  <td className="py-5 px-2">
                    <h4 className="font-bold text-navy text-[13.5px] leading-tight">{coupon.discount}</h4>
                    <p className="text-[12px] text-ink/50 leading-tight mt-1">{coupon.discountType}</p>
                  </td>

                  {/* Min Order Value */}
                  <td className="py-5 px-2">
                    <h4 className="font-bold text-navy text-[13.5px] leading-tight">{coupon.minOrder}</h4>
                    <p className="text-[12px] text-ink/50 leading-tight mt-1">{coupon.minOrderType}</p>
                  </td>

                  {/* Usage */}
                  <td className="py-5 px-2">
                    <h4 className="font-bold text-navy text-[13.5px] leading-tight">
                      {coupon.usageUsed} / {coupon.usageTotal}
                    </h4>
                    <p className="text-[12px] text-ink/50 leading-tight mt-1">Used</p>
                  </td>

                  {/* Validity */}
                  <td className="py-5 px-2">
                    <h4 className="font-bold text-navy text-[13.5px] leading-tight whitespace-nowrap">
                      {coupon.validityDate}
                    </h4>
                    <p className="text-[12px] text-ink/50 leading-tight mt-1">{coupon.validityDays}</p>
                  </td>

                  {/* Status */}
                  <td className="py-5 px-2 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-[12px] font-bold ${
                      coupon.status === "Active" 
                        ? "bg-[#E6F4EA] text-[#1E7B34]" 
                        : "bg-ink/5 text-ink/60"
                    }`}>
                      {coupon.status}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-5 px-2 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-2 w-full">
                      <button className="w-8 h-8 rounded-lg border border-navy/15 flex items-center justify-center text-navy/70 hover:text-navy hover:bg-cream transition-colors cursor-pointer" title="Edit Coupon">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg border border-navy/15 flex items-center justify-center text-navy/70 hover:text-navy hover:bg-cream transition-colors cursor-pointer" title="More Options">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Help Banner inside table container */}
        <div className="mt-6 mb-2 bg-[#FFFBF0] border border-[#FDE68A] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#FBBF24] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Lightbulb className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="font-bold text-navy text-[14px]">How it works?</h4>
              <p className="text-[12.5px] text-ink/70 mt-0.5">
                Create a coupon, share it with your customers, and track its performance here.
              </p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-[#1E73BE] hover:text-[#0F5394] font-bold text-[13px] transition-colors whitespace-nowrap cursor-pointer">
            <span>View Help Guide</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
      
      {/* Table Footer / Pagination - Below Table Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-[13px] px-2">
        <p className="text-ink/60 font-medium">
          Showing <span className="font-bold text-navy">1 to {filteredCoupons.length}</span> of 12 coupons
        </p>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-ink/60 text-[12px]">
            <span>Rows per page</span>
            <select className="bg-white border border-navy/15 rounded-lg px-2 py-1 text-navy font-bold focus:outline-none cursor-pointer">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-full border border-navy/15 flex items-center justify-center text-navy/60 hover:bg-white cursor-pointer transition-colors">
              &lt;
            </button>
            <button className="w-8 h-8 rounded-full bg-[#091E33] text-white font-bold flex items-center justify-center shadow-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-full hover:bg-white text-navy font-medium flex items-center justify-center cursor-pointer transition-colors">
              2
            </button>
            <button className="w-8 h-8 rounded-full border border-navy/15 flex items-center justify-center text-navy/60 hover:bg-white cursor-pointer transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

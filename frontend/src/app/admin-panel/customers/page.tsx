"use client";

import React, { useState } from "react";
import { Search, Filter, Download, Users, ShoppingBag, IndianRupee, Star, MoreVertical } from "lucide-react";

interface Customer {
  id: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  name: string;
  phone: string;
  email: string;
  orders: number;
  totalSpend: number;
  lastOrder: string;
}

const CUSTOMERS_DATA: Customer[] = [
  {
    id: "cust-1",
    initials: "RV",
    avatarBg: "bg-[#FFF4E5]",
    avatarText: "text-[#E68A00]",
    name: "Rohit Verma",
    phone: "+91 98765 43210",
    email: "rohit.verma@email.com",
    orders: 8,
    totalSpend: 4250,
    lastOrder: "May 20, 2024",
  },
  {
    id: "cust-2",
    initials: "AS",
    avatarBg: "bg-[#FCE8F0]",
    avatarText: "text-[#D81B60]",
    name: "Ananya Sharma",
    phone: "+91 91234 56789",
    email: "ananya.sharma@email.com",
    orders: 6,
    totalSpend: 3280,
    lastOrder: "May 20, 2024",
  },
  {
    id: "cust-3",
    initials: "PM",
    avatarBg: "bg-[#EBF5E8]",
    avatarText: "text-[#4CAF50]",
    name: "Priya Mehta",
    phone: "+91 99887 66554",
    email: "priya.mehta@email.com",
    orders: 5,
    totalSpend: 2980,
    lastOrder: "May 19, 2024",
  },
  {
    id: "cust-4",
    initials: "KS",
    avatarBg: "bg-[#F3E8FF]",
    avatarText: "text-[#7E22CE]",
    name: "Karan Singh",
    phone: "+91 88776 55433",
    email: "karan.singh@email.com",
    orders: 4,
    totalSpend: 2450,
    lastOrder: "May 19, 2024",
  },
  {
    id: "cust-5",
    initials: "SP",
    avatarBg: "bg-[#E0F7FA]",
    avatarText: "text-[#00ACC1]",
    name: "Sneha Patel",
    phone: "+91 77665 44321",
    email: "sneha.patel@email.com",
    orders: 3,
    totalSpend: 1890,
    lastOrder: "May 18, 2024",
  },
  {
    id: "cust-6",
    initials: "VJ",
    avatarBg: "bg-[#FFF3E0]",
    avatarText: "text-[#FB8C00]",
    name: "Vikram Joshi",
    phone: "+91 88990 11223",
    email: "vikram.joshi@email.com",
    orders: 3,
    totalSpend: 1790,
    lastOrder: "May 18, 2024",
  },
  {
    id: "cust-7",
    initials: "MI",
    avatarBg: "bg-[#E3F2FD]",
    avatarText: "text-[#1E88E5]",
    name: "Meera Iyer",
    phone: "+91 77889 99112",
    email: "meera.iyer@email.com",
    orders: 2,
    totalSpend: 1298,
    lastOrder: "May 17, 2024",
  },
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = CUSTOMERS_DATA.filter(
    (cust) =>
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      
      {/* Top Action Bar (Search & Export) inside header area according to design, 
          but our layout handles the main header title. We put search below it. */}
      <div className="flex flex-col sm:flex-row justify-end items-center gap-3 w-full">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="w-full bg-white border border-navy/15 rounded-full py-2.5 pl-9 pr-4 text-[13px] text-navy placeholder:text-ink/40 focus:outline-none focus:border-navy shadow-sm"
          />
        </div>

        <button className="flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[13px] px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-sm whitespace-nowrap">
          <Filter className="w-4 h-4 text-navy/70" />
          <span>Filters</span>
        </button>

        <button className="flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[13px] px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-sm whitespace-nowrap">
          <span>Export</span>
          <Download className="w-4 h-4 text-navy/70" />
        </button>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Customers */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div className="w-13 h-13 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7E22CE] shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Total Customers</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">328</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">All time</p>
          </div>
        </div>

        {/* Card 2: New This Month */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div className="w-13 h-13 rounded-2xl bg-[#EDF5E6] flex items-center justify-center text-[#4B7322] shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">New This Month</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">28</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">May 1 - May 20</p>
          </div>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div className="w-13 h-13 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Total Revenue from Customers</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">₹2,45,680</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">All time</p>
          </div>
        </div>

        {/* Card 4: Repeat Customers */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div className="w-13 h-13 rounded-2xl bg-[#E8F2FD] flex items-center justify-center text-[#1E73BE] shrink-0">
            <Star className="w-6 h-6" />
          </div>
          <div className="text-right">
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Repeat Customers</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">84</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">25.6% of total</p>
          </div>
        </div>

      </div>

      {/* Customers Table Container */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/40 border-b border-navy/10 pb-4">
                <th className="pb-3 px-2">CUSTOMER</th>
                <th className="pb-3 px-2">EMAIL / PHONE</th>
                <th className="pb-3 px-2 text-center">ORDERS</th>
                <th className="pb-3 px-2 text-right">TOTAL SPEND</th>
                <th className="pb-3 px-2">LAST ORDER</th>
                <th className="pb-3 px-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {filteredCustomers.map((cust) => (
                <tr key={cust.id} className="hover:bg-cream/20 transition-colors">
                  
                  {/* Customer Info (Avatar, Name, Phone) */}
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0 ${cust.avatarBg} ${cust.avatarText}`}>
                        {cust.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-navy text-[13.5px] leading-tight">{cust.name}</h4>
                        <p className="text-[11.5px] text-ink/50 leading-tight mt-0.5">{cust.phone}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="py-4 px-2 font-medium text-navy/70 text-[13px]">
                    {cust.email}
                  </td>

                  {/* Orders */}
                  <td className="py-4 px-2 font-bold text-navy text-[14px] text-center">
                    {cust.orders}
                  </td>

                  {/* Total Spend */}
                  <td className="py-4 px-2 font-bold text-navy text-[14px] text-right whitespace-nowrap">
                    ₹{cust.totalSpend.toLocaleString("en-IN")}
                  </td>

                  {/* Last Order Date */}
                  <td className="py-4 px-2 font-medium text-navy/80 text-[13px] whitespace-nowrap">
                    {cust.lastOrder}
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-2 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-2 w-full">
                      <button className="border border-navy/20 hover:border-navy text-navy font-bold text-[12px] px-3.5 py-1.5 rounded-full transition-all cursor-pointer hover:bg-cream whitespace-nowrap">
                        View Details
                      </button>
                      <button className="p-1.5 text-ink/40 hover:text-navy transition-colors cursor-pointer shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-4 border-t border-navy/10 text-[13px]">
          <p className="text-ink/60 font-medium">
            Showing <span className="font-bold text-navy">1 to {filteredCustomers.length}</span> of 328 customers
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-ink/60 text-[12px]">
              <span>Rows per page</span>
              <select className="bg-[#FAF7F2] border border-navy/15 rounded-lg px-2 py-1 text-navy font-bold focus:outline-none cursor-pointer">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-full border border-navy/15 flex items-center justify-center text-navy/60 hover:bg-cream cursor-pointer">
                &lt;
              </button>
              <button className="w-8 h-8 rounded-full bg-[#091E33] text-white font-bold flex items-center justify-center">
                1
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-cream text-navy font-medium flex items-center justify-center cursor-pointer">
                2
              </button>
              <button className="w-8 h-8 rounded-full hover:bg-cream text-navy font-medium flex items-center justify-center cursor-pointer">
                3
              </button>
              <span className="px-1 text-ink/40">...</span>
              <button className="w-8 h-8 rounded-full hover:bg-cream text-navy font-medium flex items-center justify-center cursor-pointer">
                33
              </button>
              <button className="w-8 h-8 rounded-full border border-navy/15 flex items-center justify-center text-navy/60 hover:bg-cream cursor-pointer">
                &gt;
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Users, Search, Download, TrendingUp, Filter, Loader2 } from "lucide-react";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpend: number;
  createdAt: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (data.success) {
        setCustomers(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch customers", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter((cust) => {
    return (
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.includes(searchQuery)
    );
  });

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.totalOrders > 0).length;
  const averageSpend = customers.length > 0 
    ? Math.round(customers.reduce((acc, c) => acc + c.totalSpend, 0) / customers.length)
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return <div className="p-8 text-center text-navy font-bold animate-pulse">Loading customers...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#091E33] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <p className="text-[12px] font-bold text-white/70 mb-1">TOTAL CUSTOMERS</p>
          <h3 className="text-4xl font-black mb-2">{totalCustomers}</h3>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#34D399]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% this month</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col justify-center">
          <p className="text-[12px] font-bold text-ink/50 mb-1">ACTIVE CUSTOMERS</p>
          <h3 className="text-3xl font-black text-navy mb-2">{activeCustomers}</h3>
          <p className="text-[11px] text-ink/50 font-medium">Placed at least 1 order</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col justify-center">
          <p className="text-[12px] font-bold text-ink/50 mb-1">AVERAGE SPEND</p>
          <h3 className="text-3xl font-black text-navy mb-2">₹{averageSpend}</h3>
          <p className="text-[11px] text-ink/50 font-medium">Per customer lifetime</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-navy/10 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full bg-[#FAF7F2] border border-navy/15 rounded-full py-2 pl-9 pr-4 text-[13px] text-navy placeholder:text-ink/40 focus:outline-none focus:border-navy"
          />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[12.5px] px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm">
            <Filter className="w-3.5 h-3.5 text-navy/70" />
            <span>Filters</span>
          </button>
          <button className="flex items-center gap-1.5 bg-[#091E33] hover:bg-[#071728] text-white font-bold text-[12.5px] px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm">
            <span>Export CSV</span>
            <Download className="w-3.5 h-3.5 text-white/80" />
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/40 border-b border-navy/10 pb-4">
                <th className="pb-3 px-2">CUSTOMER</th>
                <th className="pb-3 px-2">CONTACT INFO</th>
                <th className="pb-3 px-2 text-center">TOTAL ORDERS</th>
                <th className="pb-3 px-2 text-right">TOTAL SPEND</th>
                <th className="pb-3 px-2 text-right">JOINED DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-ink/50">No customers found.</td>
                </tr>
              ) : filteredCustomers.map((cust) => (
                <tr key={cust._id} className="hover:bg-cream/20 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-navy/5 flex items-center justify-center text-navy font-black text-[14px]">
                        {cust.name.charAt(0)}
                      </div>
                      <h4 className="font-bold text-navy text-[14px]">{cust.name}</h4>
                    </div>
                  </td>
                  
                  <td className="py-4 px-2">
                    <p className="text-navy font-medium text-[13px]">{cust.email}</p>
                    <p className="text-ink/50 text-[11px] mt-0.5">{cust.phone}</p>
                  </td>

                  <td className="py-4 px-2 text-center">
                    <span className="inline-block bg-[#FAF7F2] border border-black/5 rounded-lg px-3 py-1 font-bold text-navy text-[14px]">
                      {cust.totalOrders}
                    </span>
                  </td>

                  <td className="py-4 px-2 text-right font-black text-[#091E33] text-[15px]">
                    ₹{cust.totalSpend}
                  </td>

                  <td className="py-4 px-2 text-right text-ink/60 font-medium">
                    {formatDate(cust.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

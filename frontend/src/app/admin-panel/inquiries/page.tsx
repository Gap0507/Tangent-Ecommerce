"use client";

import React, { useState, useEffect } from "react";
import { Search, MessageSquare } from "lucide-react";

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) {
        setInquiries(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch inquiries", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    return (
      inq.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalInquiries = inquiries.length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return <div className="p-8 text-center text-navy font-bold animate-pulse">Loading inquiries...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
        <div className="bg-[#091E33] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <p className="text-[12px] font-bold text-white/70 mb-1">TOTAL INQUIRIES</p>
          <h3 className="text-4xl font-black mb-2">{totalInquiries}</h3>
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
            placeholder="Search by name, email, or subject..."
            className="w-full bg-[#FAF7F2] border border-navy/15 rounded-full py-2 pl-9 pr-4 text-[13px] text-navy placeholder:text-ink/40 focus:outline-none focus:border-navy"
          />
        </div>

      </div>

      {/* Inquiries Table */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/40 border-b border-navy/10 pb-4">
                <th className="pb-3 px-2">CUSTOMER</th>
                <th className="pb-3 px-2">SUBJECT</th>
                <th className="pb-3 px-2">MESSAGE</th>
                <th className="pb-3 px-2 text-right">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-ink/50">No inquiries found.</td>
                </tr>
              ) : filteredInquiries.map((inq) => (
                <tr key={inq._id} className="hover:bg-cream/20 transition-colors">
                  <td className="py-4 px-2">
                    <div className="flex flex-col">
                      <h4 className="font-bold text-navy text-[14px]">{inq.name}</h4>
                      <p className="text-navy font-medium text-[12px]">{inq.email}</p>
                    </div>
                  </td>
                  
                  <td className="py-4 px-2 max-w-[200px]">
                    <p className="text-navy font-bold text-[13px] truncate" title={inq.subject}>{inq.subject}</p>
                  </td>

                  <td className="py-4 px-2 max-w-[300px]">
                     <p className="text-ink/70 text-[13px] truncate" title={inq.message}>{inq.message}</p>
                  </td>

                  <td className="py-4 px-2 text-right text-ink/60 font-medium">
                    {formatDate(inq.createdAt)}
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

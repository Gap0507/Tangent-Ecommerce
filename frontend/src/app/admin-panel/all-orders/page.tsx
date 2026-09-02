"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, Filter, Download, Eye } from "lucide-react";

interface OrderItem {
  name: string;
  size: string;
  qty: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  item: OrderItem;
  amount: number;
  paymentStatus: "Paid" | "Unpaid";
  paymentGateway: string;
  status: "Pending" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
  statusSubtext?: string;
  shippingAddress: string;
}

const ALL_ORDERS_DATA: Order[] = [
  {
    id: "#TNG1234",
    customerName: "Rohit Verma",
    customerEmail: "rohit.verma@email.com",
    customerPhone: "+91 98765 43210",
    date: "May 20, 2024",
    time: "10:30 AM",
    item: { name: "Watermelon Mint", size: "250ml (Pack of 1)", qty: 2, image: "/can2.png" },
    amount: 598,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    status: "Pending",
    statusSubtext: "Payment Captured",
    shippingAddress: "B-12, Sector 27 Noida, Uttar Pradesh 201301",
  },
  {
    id: "#TNG1233",
    customerName: "Ananya Sharma",
    customerEmail: "ananya.sharma@email.com",
    customerPhone: "+91 91234 56789",
    date: "May 20, 2024",
    time: "09:15 AM",
    item: { name: "Yuzu Mint", size: "250ml (Pack of 1)", qty: 1, image: "/can4.png" },
    amount: 149,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    status: "Pending",
    statusSubtext: "Payment Captured",
    shippingAddress: "18, Park Street Bengaluru, Karnataka 560001",
  },
  {
    id: "#TNG1232",
    customerName: "Priya Mehta",
    customerEmail: "priya.mehta@email.com",
    customerPhone: "+91 99887 66554",
    date: "May 19, 2024",
    time: "08:45 PM",
    item: { name: "Guava Chilli", size: "250ml (Pack of 1)", qty: 2, image: "/can3.png" },
    amount: 298,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    status: "Shipped",
    statusSubtext: "May 20, 2024",
    shippingAddress: "102, Green View Apt. Mumbai, Maharashtra 400064",
  },
  {
    id: "#TNG1231",
    customerName: "Karan Singh",
    customerEmail: "karan.singh@email.com",
    customerPhone: "+91 88776 55433",
    date: "May 19, 2024",
    time: "05:20 PM",
    item: { name: "Watermelon Cranberry", size: "250ml (Pack of 1)", qty: 1, image: "/can1.png" },
    amount: 149,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    status: "Delivered",
    statusSubtext: "May 20, 2024",
    shippingAddress: "55, Lace Garden Pune, Maharashtra 411001",
  },
  {
    id: "#TNG1230",
    customerName: "Sneha Patel",
    customerEmail: "sneha.patel@email.com",
    customerPhone: "+91 77665 44321",
    date: "May 18, 2024",
    time: "11:10 AM",
    item: { name: "Watermelon Mint", size: "250ml (Pack of 1)", qty: 1, image: "/can2.png" },
    amount: 149,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    status: "Delivered",
    statusSubtext: "May 19, 2024",
    shippingAddress: "9, Shanti Nagar Ahmedabad, Gujarat 380015",
  },
  {
    id: "#TNG1229",
    customerName: "Vikram Joshi",
    customerEmail: "vikram.joshi@email.com",
    customerPhone: "+91 88990 11223",
    date: "May 18, 2024",
    time: "09:05 AM",
    item: { name: "Yuzu Mint", size: "250ml (Pack of 1)", qty: 2, image: "/can4.png" },
    amount: 298,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    status: "Cancelled",
    statusSubtext: "May 18, 2024",
    shippingAddress: "42, Civil Lines Jaipur, Rajasthan 302006",
  },
  {
    id: "#TNG1228",
    customerName: "Meera Iyer",
    customerEmail: "meera.iyer@email.com",
    customerPhone: "+91 77889 99112",
    date: "May 17, 2024",
    time: "07:45 PM",
    item: { name: "Guava Chilli", size: "250ml (Pack of 1)", qty: 1, image: "/can3.png" },
    amount: 149,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    status: "Refunded",
    statusSubtext: "May 18, 2024",
    shippingAddress: "15, MG Road Kochi, Kerala 682016",
  },
];

export default function AllOrdersPage() {
  const [selectedFilterTab, setSelectedFilterTab] = useState<string>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderModal, setSelectedOrderModal] = useState<Order | null>(null);

  const filteredAllOrders = ALL_ORDERS_DATA.filter((ord) => {
    const matchesFilter =
      selectedFilterTab === "All Orders" || ord.status.toLowerCase() === selectedFilterTab.toLowerCase();
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs Bar & Search / Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-navy/10 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {["All Orders", "Pending", "Confirmed", "Shipped", "Delivered", "Cancelled", "Refunded"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedFilterTab(tab)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedFilterTab === tab
                  ? "bg-[#091E33] text-white shadow-sm"
                  : "bg-transparent text-navy/70 hover:bg-cream hover:text-navy"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Action Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order ID, customer, email..."
              className="w-full bg-[#FAF7F2] border border-navy/15 rounded-full py-2 pl-9 pr-4 text-[12.5px] text-navy placeholder:text-ink/40 focus:outline-none focus:border-navy"
            />
          </div>

          <button className="flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[12.5px] px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm">
            <Filter className="w-3.5 h-3.5 text-navy/70" />
            <span>Filters</span>
          </button>

          <button className="flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[12.5px] px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm">
            <span>Export</span>
            <Download className="w-3.5 h-3.5 text-navy/70" />
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/40 border-b border-navy/10 pb-4">
                <th className="pb-3 px-2">ORDER ID</th>
                <th className="pb-3 px-2">CUSTOMER</th>
                <th className="pb-3 px-2">DATE</th>
                <th className="pb-3 px-2">ITEMS</th>
                <th className="pb-3 px-2">AMOUNT</th>
                <th className="pb-3 px-2">PAYMENT</th>
                <th className="pb-3 px-2">STATUS</th>
                <th className="pb-3 px-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {filteredAllOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-cream/20 transition-colors">
                  <td className="py-4 px-2 font-bold text-navy whitespace-nowrap">{ord.id}</td>

                  <td className="py-4 px-2">
                    <h4 className="font-bold text-navy text-[13.5px] leading-tight">{ord.customerName}</h4>
                    <p className="text-[11px] text-ink/50 leading-tight">{ord.customerEmail}</p>
                    <p className="text-[11px] text-ink/50 leading-tight">{ord.customerPhone}</p>
                  </td>

                  <td className="py-4 px-2 whitespace-nowrap">
                    <p className="font-bold text-navy text-[13px]">{ord.date}</p>
                    <p className="text-[11px] text-ink/50">{ord.time}</p>
                  </td>

                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-black/5 p-1 flex items-center justify-center shrink-0">
                        <Image src={ord.item.image} alt={ord.item.name} width={32} height={32} className="object-contain max-h-8" unoptimized />
                      </div>
                      <div>
                        <h5 className="font-bold text-navy text-[13px] leading-tight">{ord.item.name}</h5>
                        <p className="text-[11px] text-ink/50">{ord.item.size}</p>
                      </div>
                      <span className="text-[12px] font-bold text-ink/60 ml-auto">x {ord.item.qty}</span>
                    </div>
                  </td>

                  <td className="py-4 px-2 font-black text-[#091E33] text-[14px]">₹{ord.amount}</td>

                  <td className="py-4 px-2 whitespace-nowrap">
                    <span className="inline-block bg-[#EBF5E8] text-[#365615] text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-0.5">
                      {ord.paymentStatus}
                    </span>
                    <p className="text-[11px] text-ink/50">{ord.paymentGateway}</p>
                  </td>

                  <td className="py-4 px-2 whitespace-nowrap">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                        ord.status === "Pending" ? "bg-[#FEF3C7] text-[#B45309]" :
                        ord.status === "Shipped" ? "bg-[#ECFDF5] text-[#047857]" :
                        ord.status === "Delivered" ? "bg-[#EFF6FF] text-[#1D4ED8]" :
                        ord.status === "Cancelled" ? "bg-[#FEE2E2] text-[#B91C1C]" :
                        "bg-[#F3E8FF] text-[#7E22CE]"
                      }`}
                    >
                      {ord.status}
                    </span>
                    {ord.statusSubtext && (
                      <p className="text-[11px] text-ink/50 mt-0.5">{ord.statusSubtext}</p>
                    )}
                  </td>

                  <td className="py-4 px-2 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedOrderModal(ord)}
                      className="inline-flex items-center gap-1.5 border border-navy/20 hover:border-navy text-navy font-bold text-[12px] px-3.5 py-1.5 rounded-full transition-all cursor-pointer hover:bg-cream"
                    >
                      <span>View Details</span>
                      <Eye className="w-3.5 h-3.5 text-navy/70" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-4 border-t border-navy/10 text-[13px]">
          <p className="text-ink/60 font-medium">
            Showing <span className="font-bold text-navy">1 to {filteredAllOrders.length}</span> of 128 orders
          </p>

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
              19
            </button>
            <button className="w-8 h-8 rounded-full border border-navy/15 flex items-center justify-center text-navy/60 hover:bg-cream cursor-pointer">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-navy/10 relative">
            <div className="flex items-center justify-between pb-4 border-b border-navy/10 mb-4">
              <div>
                <h3 className="font-fraunces font-bold text-[22px] text-navy">
                  Order {selectedOrderModal.id}
                </h3>
                <p className="text-[12px] text-ink/50">
                  Placed on {selectedOrderModal.date} at {selectedOrderModal.time}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-navy font-bold text-[14px] hover:bg-navy hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-[13px] mb-6">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-black/5">
                <h4 className="font-bold text-navy mb-1 uppercase tracking-wider text-[11px]">Customer Details</h4>
                <p className="font-bold text-[14px] text-navy">{selectedOrderModal.customerName}</p>
                <p className="text-ink/60">{selectedOrderModal.customerEmail}</p>
                <p className="text-ink/60">{selectedOrderModal.customerPhone}</p>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-black/5">
                <h4 className="font-bold text-navy mb-1 uppercase tracking-wider text-[11px]">Shipping Address</h4>
                <p className="text-navy font-medium">{selectedOrderModal.shippingAddress}</p>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image src={selectedOrderModal.item.image} alt={selectedOrderModal.item.name} width={40} height={40} className="object-contain max-h-10" unoptimized />
                  <div>
                    <h4 className="font-bold text-navy">{selectedOrderModal.item.name}</h4>
                    <p className="text-[11px] text-ink/50">{selectedOrderModal.item.size}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-navy">Qty: {selectedOrderModal.item.qty}</span>
                  <p className="font-fraunces font-black text-navy text-[16px]">₹{selectedOrderModal.amount}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrderModal(null)}
              className="w-full bg-[#091E33] hover:bg-[#071728] text-white font-bold text-[14px] py-3 rounded-2xl transition-all cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

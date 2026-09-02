"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  Send,
  MoreVertical,
  Clock,
  Truck,
  Wallet,
} from "lucide-react";

interface OrderItem {
  name: string;
  size: string;
  qty: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  item: OrderItem;
  amount: number;
  paymentStatus: "Paid" | "Unpaid";
  paymentGateway: string;
  shippingAddress: string;
  pushedToShiprocket?: boolean;
}

const PENDING_ORDERS_DATA: Order[] = [
  {
    id: "#TNG1234",
    customerName: "Rohit Verma",
    customerPhone: "+91 98765 43210",
    date: "May 20, 2024",
    time: "10:30 AM",
    item: { name: "Watermelon Mint", size: "250ml (Pack of 1)", qty: 2, image: "/can2.png" },
    amount: 598,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    shippingAddress: "B-12, Sector 27 Noida, Uttar Pradesh 201301",
  },
  {
    id: "#TNG1233",
    customerName: "Ananya Sharma",
    customerPhone: "+91 91234 56789",
    date: "May 20, 2024",
    time: "09:15 AM",
    item: { name: "Yuzu Mint", size: "250ml (Pack of 1)", qty: 1, image: "/can4.png" },
    amount: 149,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    shippingAddress: "18, Park Street Bengaluru, Karnataka 560001",
  },
  {
    id: "#TNG1232",
    customerName: "Priya Mehta",
    customerPhone: "+91 99887 66554",
    date: "May 19, 2024",
    time: "08:45 PM",
    item: { name: "Guava Chilli", size: "250ml (Pack of 1)", qty: 2, image: "/can3.png" },
    amount: 298,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    shippingAddress: "102, Green View Apt. Mumbai, Maharashtra 400064",
  },
  {
    id: "#TNG1231",
    customerName: "Karan Singh",
    customerPhone: "+91 88776 55433",
    date: "May 19, 2024",
    time: "05:20 PM",
    item: { name: "Watermelon Cranberry", size: "250ml (Pack of 1)", qty: 1, image: "/can1.png" },
    amount: 149,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    shippingAddress: "55, Lace Garden Pune, Maharashtra 411001",
  },
  {
    id: "#TNG1230",
    customerName: "Sneha Patel",
    customerPhone: "+91 77665 44321",
    date: "May 18, 2024",
    time: "11:10 AM",
    item: { name: "Watermelon Mint", size: "250ml (Pack of 1)", qty: 1, image: "/can2.png" },
    amount: 149,
    paymentStatus: "Paid",
    paymentGateway: "Razorpay",
    shippingAddress: "9, Shanti Nagar Ahmedabad, Gujarat 380015",
  },
];

export default function PendingOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(PENDING_ORDERS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [selectedOrderModal, setSelectedOrderModal] = useState<Order | null>(null);

  const filteredOrders = orders.filter(
    (ord) =>
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery)
  );

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedOrderIds(filteredOrders.map((o) => o.id));
    } else {
      setSelectedOrderIds([]);
    }
  };

  const handleToggleSelectOrder = (id: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handlePushShiprocket = (orderId: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, pushedToShiprocket: true } : ord))
    );
  };

  return (
    <div className="space-y-6">
      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Total Pending */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Total Pending</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">18</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">Orders</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Amount */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Total Amount</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">₹7,452</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">To be Collected</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#E8F2FD] flex items-center justify-center text-[#1E73BE] shrink-0">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Ready to Ship */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Ready to Ship</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">14</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">Orders</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#EDF5E6] flex items-center justify-center text-[#4B7322] shrink-0">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Avg Time */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Avg. Time</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">12 hrs</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">To Ship</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7E22CE] shrink-0">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Push to Shiprocket Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-navy/10 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer, phone..."
            className="w-full bg-[#FAF7F2] border border-navy/15 rounded-full py-2.5 pl-9 pr-4 text-[13px] text-navy placeholder:text-ink/40 focus:outline-none focus:border-navy"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[13px] px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-sm">
            <Filter className="w-4 h-4 text-navy/70" />
            <span>Filters</span>
          </button>

          <button
            disabled={selectedOrderIds.length === 0}
            className="flex items-center gap-2 bg-[#091E33] hover:bg-[#071728] text-white font-bold text-[13px] px-6 py-2.5 rounded-full transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Push to Shiprocket ({selectedOrderIds.length})</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/40 border-b border-navy/10 pb-4">
                <th className="pb-3 px-2 w-8">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length}
                    className="w-4 h-4 rounded border-navy/20 text-[#091E33] focus:ring-[#091E33] cursor-pointer"
                  />
                </th>
                <th className="pb-3 px-2">ORDER ID</th>
                <th className="pb-3 px-2">CUSTOMER</th>
                <th className="pb-3 px-2">DATE</th>
                <th className="pb-3 px-2">ITEMS</th>
                <th className="pb-3 px-2">AMOUNT</th>
                <th className="pb-3 px-2">PAYMENT</th>
                <th className="pb-3 px-2">SHIPPING ADDRESS</th>
                <th className="pb-3 px-2 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {filteredOrders.map((ord) => {
                const isSelected = selectedOrderIds.includes(ord.id);
                return (
                  <tr key={ord.id} className={`hover:bg-cream/20 transition-colors ${isSelected ? "bg-cream/40" : ""}`}>
                    <td className="py-4 px-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectOrder(ord.id)}
                        className="w-4 h-4 rounded border-navy/20 text-[#091E33] focus:ring-[#091E33] cursor-pointer"
                      />
                    </td>

                    <td className="py-4 px-2 font-bold text-navy whitespace-nowrap">{ord.id}</td>

                    <td className="py-4 px-2">
                      <h4 className="font-bold text-navy text-[13.5px] leading-tight">{ord.customerName}</h4>
                      <p className="text-[11px] text-ink/50">{ord.customerPhone}</p>
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

                    <td className="py-4 px-2 max-w-[220px]">
                      <p className="text-[12px] text-navy/80 font-medium leading-snug line-clamp-2">
                        {ord.shippingAddress}
                      </p>
                    </td>

                    <td className="py-4 px-2 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrderModal(ord)}
                          className="border border-navy/20 hover:border-navy text-navy font-bold text-[12px] px-3 py-1.5 rounded-xl transition-all cursor-pointer hover:bg-cream flex items-center gap-1"
                        >
                          <span>View</span>
                          <Eye className="w-3.5 h-3.5 text-navy/70" />
                        </button>

                        <button
                          onClick={() => handlePushShiprocket(ord.id)}
                          disabled={ord.pushedToShiprocket}
                          className={`font-bold text-[12px] px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-sm ${
                            ord.pushedToShiprocket
                              ? "bg-[#6A9A4A] text-white"
                              : "bg-[#091E33] hover:bg-[#071728] text-white"
                          }`}
                        >
                          <span>{ord.pushedToShiprocket ? "Pushed ✓" : "Push"}</span>
                          {!ord.pushedToShiprocket && <Send className="w-3 h-3" />}
                        </button>

                        <button className="p-1.5 text-ink/40 hover:text-navy transition-colors cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 mt-4 border-t border-navy/10 text-[13px]">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 font-medium text-navy cursor-pointer">
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedOrderIds.length > 0 && selectedOrderIds.length === filteredOrders.length}
                className="w-4 h-4 rounded border-navy/20 text-[#091E33]"
              />
              <span>Select All ({filteredOrders.length} orders)</span>
            </label>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-ink/60 text-[12px]">
              <span>Rows per page</span>
              <select className="bg-[#FAF7F2] border border-navy/15 rounded-lg px-2 py-1 text-navy font-bold focus:outline-none">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>

            <p className="text-ink/60 font-medium">
              Showing <span className="font-bold text-navy">1 to {filteredOrders.length}</span> of 18
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
              <button className="w-8 h-8 rounded-full border border-navy/15 flex items-center justify-center text-navy/60 hover:bg-cream cursor-pointer">
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
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

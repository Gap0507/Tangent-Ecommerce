"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Filter, Download, Eye, Loader2 } from "lucide-react";

interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  items: OrderItem[];
  pricing: {
    total: number;
  };
  paymentStatus: string;
  orderStatus: string;
  shipmentStatus: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilterTab, setSelectedFilterTab] = useState<string>("All Orders");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderModal, setSelectedOrderModal] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch orders", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredAllOrders = orders.filter((ord) => {
    let matchesFilter = true;
    if (selectedFilterTab === "Payment Pending") {
      matchesFilter = ord.paymentStatus === "PENDING";
    } else if (selectedFilterTab === "Refunded") {
      matchesFilter = ord.paymentStatus === "REFUNDED";
    } else if (selectedFilterTab !== "All Orders" && selectedFilterTab !== "All") {
      matchesFilter = ord.orderStatus.toLowerCase() === selectedFilterTab.toLowerCase();
    }
      
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
      case 'CONFIRMED':
        return "bg-[#FEF3C7] text-[#B45309]"; // Warning/Pending
      case 'PROCESSING':
      case 'SHIPPED':
        return "bg-[#ECFDF5] text-[#047857]"; // Success/In Progress
      case 'DELIVERED':
        return "bg-[#EFF6FF] text-[#1D4ED8]"; // Complete
      case 'CANCELLED':
        return "bg-[#FEE2E2] text-[#B91C1C]"; // Error/Cancelled
      default:
        return "bg-[#F3E8FF] text-[#7E22CE]"; // Misc
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Tabs Bar & Search / Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-navy/10 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {["All Orders", "Payment Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded"].map((tab) => (
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
              placeholder="Search by order ID, customer..."
              className="w-full bg-[#FAF7F2] border border-navy/15 rounded-full py-2 pl-9 pr-4 text-[12.5px] text-navy placeholder:text-ink/40 focus:outline-none focus:border-navy"
            />
          </div>

          <button className="flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[12.5px] px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm">
            <Filter className="w-3.5 h-3.5 text-navy/70" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-navy/50">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-[13px] font-bold">Loading orders...</p>
            </div>
          ) : (
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
                {filteredAllOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-ink/50">No orders found.</td>
                  </tr>
                ) : filteredAllOrders.map((ord) => {
                  const { date, time } = formatDate(ord.createdAt);
                  const firstItem = ord.items[0];
                  const extraItemsCount = ord.items.length - 1;

                  return (
                    <tr key={ord._id} className="hover:bg-cream/20 transition-colors">
                      <td className="py-4 px-2 font-bold text-navy whitespace-nowrap">{ord.orderNumber}</td>

                      <td className="py-4 px-2">
                        <h4 className="font-bold text-navy text-[13.5px] leading-tight">{ord.customerName}</h4>
                        <p className="text-[11px] text-ink/50 leading-tight">{ord.customerEmail}</p>
                        <p className="text-[11px] text-ink/50 leading-tight">{ord.customerPhone}</p>
                      </td>

                      <td className="py-4 px-2 whitespace-nowrap">
                        <p className="font-bold text-navy text-[13px]">{date}</p>
                        <p className="text-[11px] text-ink/50">{time}</p>
                      </td>

                      <td className="py-4 px-2">
                        {firstItem && (
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-black/5 p-1 flex items-center justify-center shrink-0">
                              <Image src={firstItem.image || "/can2.png"} alt={firstItem.name} width={32} height={32} className="object-contain max-h-8" unoptimized />
                            </div>
                            <div>
                              <h5 className="font-bold text-navy text-[13px] leading-tight">{firstItem.name}</h5>
                              <p className="text-[11px] text-ink/50">x{firstItem.quantity}</p>
                            </div>
                            {extraItemsCount > 0 && (
                              <span className="text-[11px] font-bold text-ink/40 ml-2 bg-black/5 px-2 py-0.5 rounded-full">
                                +{extraItemsCount}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-2 font-black text-[#091E33] text-[14px]">₹{ord.pricing?.total || 0}</td>

                      <td className="py-4 px-2 whitespace-nowrap">
                        <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-0.5 ${
                          ord.paymentStatus === 'PAID' ? 'bg-[#EBF5E8] text-[#365615]' : 
                          ord.paymentStatus === 'REFUNDED' ? 'bg-[#FEE2E2] text-[#B91C1C]' :
                          'bg-[#FEF3C7] text-[#B45309]'
                        }`}>
                          {ord.paymentStatus}
                        </span>
                        <p className="text-[11px] text-ink/50">Razorpay</p>
                      </td>

                      <td className="py-4 px-2 whitespace-nowrap">
                        <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${getStatusColor(ord.orderStatus)}`}>
                          {ord.orderStatus}
                        </span>
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrderModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto pt-20">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-navy/10 relative my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-navy/10 mb-4">
              <div>
                <h3 className="font-fraunces font-bold text-[22px] text-navy">
                  Order {selectedOrderModal.orderNumber}
                </h3>
                <p className="text-[12px] text-ink/50">
                  Placed on {formatDate(selectedOrderModal.createdAt).date} at {formatDate(selectedOrderModal.createdAt).time}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderModal(null)}
                className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-navy font-bold text-[14px] hover:bg-navy hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] mb-6">
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-black/5">
                <h4 className="font-bold text-navy mb-1 uppercase tracking-wider text-[11px]">Customer Details</h4>
                <p className="font-bold text-[14px] text-navy">{selectedOrderModal.customerName}</p>
                <p className="text-ink/60">{selectedOrderModal.customerEmail}</p>
                <p className="text-ink/60">{selectedOrderModal.customerPhone}</p>
              </div>

              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-black/5">
                <h4 className="font-bold text-navy mb-1 uppercase tracking-wider text-[11px]">Shipping Address</h4>
                <p className="text-navy font-medium">{selectedOrderModal.shippingAddress?.street}</p>
                <p className="text-navy font-medium">{selectedOrderModal.shippingAddress?.city}, {selectedOrderModal.shippingAddress?.state} {selectedOrderModal.shippingAddress?.pincode}</p>
              </div>
            </div>

            <h4 className="font-bold text-navy mb-3 uppercase tracking-wider text-[11px]">Order Items</h4>
            <div className="space-y-3 mb-6">
              {selectedOrderModal.items.map((item, idx) => (
                <div key={idx} className="bg-[#FAF7F2] p-4 rounded-2xl border border-black/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image src={item.image || "/can2.png"} alt={item.name} width={40} height={40} className="object-contain max-h-10" unoptimized />
                    <div>
                      <h4 className="font-bold text-navy">{item.name}</h4>
                      <p className="text-[11px] text-ink/50">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-navy text-[12px] block mb-0.5">Qty: {item.quantity}</span>
                    <p className="font-fraunces font-black text-navy text-[16px]">₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-navy/10 pt-4 flex justify-between items-center mb-6">
              <span className="font-bold text-navy">Total Amount</span>
              <span className="font-fraunces font-black text-navy text-[20px]">₹{selectedOrderModal.pricing?.total}</span>
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

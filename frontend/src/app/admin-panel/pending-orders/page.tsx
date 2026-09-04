"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Filter, Eye, Send, Clock, Truck, Wallet, Loader2 } from "lucide-react";

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

export default function PendingOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderModal, setSelectedOrderModal] = useState<Order | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingOrders();
  }, []);

  const fetchPendingOrders = async () => {
    try {
      // Fetch all orders and filter strictly for PAID orders waiting to be packed and shipped
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        const unfulfilled = data.data.filter((o: Order) => 
          o.paymentStatus === 'PAID' && 
          o.shipmentStatus !== 'CREATED' && 
          o.orderStatus !== 'SHIPPED' && 
          o.orderStatus !== 'DELIVERED' && 
          o.orderStatus !== 'CANCELLED'
        );
        setOrders(unfulfilled);
      }
    } catch (e) {
      console.error("Failed to fetch orders to fulfill", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePushToShiprocket = async (order: Order) => {
    if (order.paymentStatus !== 'PAID') {
      alert("Cannot push unpaid orders to Shiprocket.");
      return;
    }
    setProcessingId(order._id);
    try {
      const res = await fetch('/api/shipments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order._id })
      });
      const data = await res.json();
      
      if (data.success) {
        // Remove from pending list once shipped
        setOrders((prev) => prev.filter((o) => o._id !== order._id));
        alert(`Shipment created! AWB: ${data.data.awbCode}`);
      } else {
        alert(data.error || "Failed to push to Shiprocket");
      }
    } catch (e) {
      console.error(e);
      alert("Error pushing to Shiprocket");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    return (
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerPhone.includes(searchQuery)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    };
  };

  const totalPending = orders.length;
  const totalValue = orders.reduce((acc, curr) => acc + curr.pricing.total, 0);

  if (loading) {
    return <div className="p-8 text-center text-navy font-bold animate-pulse">Loading orders to fulfill...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header & KPI Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#091E33] rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />
          <p className="text-[12px] font-bold text-white/70 mb-1">ORDERS TO FULFILL</p>
          <h3 className="text-4xl font-black mb-2">{totalPending}</h3>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-[#34D399]">
            <Clock className="w-3.5 h-3.5" />
            <span>Requires action</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col justify-center">
          <p className="text-[12px] font-bold text-ink/50 mb-1">TOTAL VALUE TO FULFILL</p>
          <h3 className="text-3xl font-black text-navy mb-2">₹{totalValue}</h3>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-navy/60">
            <Wallet className="w-3.5 h-3.5" />
            <span>Value of paid unfulfilled orders</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col justify-center">
          <p className="text-[12px] font-bold text-ink/50 mb-1">LOGISTICS PARTNER</p>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-2xl font-black text-navy">Shiprocket</h3>
            <span className="bg-[#ECFDF5] text-[#047857] text-[10px] font-bold px-2 py-0.5 rounded-full">Connected</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-navy/60">
            <Truck className="w-3.5 h-3.5" />
            <span>1-click dispatch enabled</span>
          </div>
        </div>
      </div>

      {/* Search & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-navy/10 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-ink/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pending orders..."
            className="w-full bg-[#FAF7F2] border border-navy/15 rounded-full py-2 pl-9 pr-4 text-[13px] text-navy placeholder:text-ink/40 focus:outline-none focus:border-navy"
          />
        </div>
        <button className="flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[13px] px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm">
          <Filter className="w-3.5 h-3.5 text-navy/70" />
          <span>Sort & Filter</span>
        </button>
      </div>

      {/* Pending Orders Table */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6">
        <h3 className="text-[16px] font-bold text-navy mb-4">Action Required</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/40 border-b border-navy/10 pb-4">
                <th className="pb-3 px-2">ORDER & TIME</th>
                <th className="pb-3 px-2">CUSTOMER INFO</th>
                <th className="pb-3 px-2">ITEMS TO PACK</th>
                <th className="pb-3 px-2 text-center">PAYMENT</th>
                <th className="pb-3 px-2 text-right">ONE-CLICK FULFILLMENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-ink/50">No pending orders.</td>
                </tr>
              ) : filteredOrders.map((ord) => {
                const { date, time } = formatDate(ord.createdAt);
                const firstItem = ord.items[0];
                const extraItemsCount = ord.items.length - 1;
                const isProcessing = processingId === ord._id;

                return (
                  <tr key={ord._id} className="hover:bg-cream/20 transition-colors">
                    {/* Order ID & Time */}
                    <td className="py-4 px-2 whitespace-nowrap">
                      <p className="font-black text-navy text-[14px]">{ord.orderNumber}</p>
                      <p className="text-[11px] text-ink/50 mt-0.5">{date}</p>
                      <div className="flex items-center gap-1 text-[11px] font-bold text-[#B45309] mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{time}</span>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-2">
                      <h4 className="font-bold text-navy text-[13.5px] leading-tight">{ord.customerName}</h4>
                      <p className="text-[11px] text-ink/60 mt-0.5">{ord.customerPhone}</p>
                      <p className="text-[11px] text-ink/60">{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</p>
                    </td>

                    {/* Items */}
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

                    {/* Payment Status */}
                    <td className="py-4 px-2 text-center whitespace-nowrap">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-0.5 ${
                          ord.paymentStatus === 'PAID' ? 'bg-[#EBF5E8] text-[#365615]' : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}>
                        {ord.paymentStatus}
                      </span>
                      <p className="font-black text-navy text-[13px]">₹{ord.pricing.total}</p>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-2 text-right whitespace-nowrap">
                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => handlePushToShiprocket(ord)}
                          disabled={isProcessing || ord.paymentStatus !== 'PAID'}
                          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-bold transition-all shadow-sm w-44
                            ${isProcessing || ord.paymentStatus !== 'PAID'
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
                              : "bg-[#091E33] hover:bg-[#071728] text-white cursor-pointer"
                            }`}
                        >
                          {isProcessing ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <span>Push to Shiprocket</span>
                              <Send className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                        
                        <button
                          onClick={() => setSelectedOrderModal(ord)}
                          className="inline-flex items-center gap-1.5 text-navy/70 hover:text-navy text-[11px] font-bold px-2 cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal (Same as All Orders for consistency) */}
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

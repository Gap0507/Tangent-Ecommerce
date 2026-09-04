"use client";

import React, { useState, useEffect } from "react";
import { Search, Filter, Ticket, Tag, Percent, IndianRupee, Lightbulb, Loader2, Plus, X, Save } from "lucide-react";

interface Coupon {
  _id: string;
  code: string;
  discountType: 'FLAT' | 'PERCENTAGE' | 'FREE_SHIPPING';
  discountValue: number;
  minOrderValue: number;
  usageCount: number;
  maxUsageLimit: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All Coupons");

  // Create Coupon Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountType: "FLAT",
    discountValue: 0,
    minOrderValue: 0,
    maxUsageLimit: 0,
    validFrom: new Date().toISOString().split('T')[0],
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCoupon,
          discountValue: Number(newCoupon.discountValue),
          minOrderValue: Number(newCoupon.minOrderValue),
          maxUsageLimit: Number(newCoupon.maxUsageLimit),
        })
      });
      const data = await res.json();
      if (data.success) {
        setCoupons([data.data, ...coupons]);
        setIsCreateModalOpen(false);
        setNewCoupon({
          code: "",
          discountType: "FLAT",
          discountValue: 0,
          minOrderValue: 0,
          maxUsageLimit: 0,
          validFrom: new Date().toISOString().split('T')[0],
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
      } else {
        alert(data.error || "Failed to create coupon");
      }
    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch coupons", e);
    } finally {
      setLoading(false);
    }
  };

  const getStatus = (coupon: Coupon) => {
    if (!coupon.isActive) return "Inactive";
    const now = new Date();
    const expiry = new Date(coupon.validUntil);
    if (now > expiry) return "Expired";
    return "Active";
  };

  const filteredCoupons = coupons.filter((coup) => {
    const status = getStatus(coup);
    const matchesFilter = filterStatus === "All Coupons" || status === filterStatus;
    const matchesSearch = coup.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalCoupons = coupons.length;
  const activeCouponsCount = coupons.filter(c => getStatus(c) === "Active").length;
  const expiredCouponsCount = coupons.filter(c => getStatus(c) === "Expired").length;
  const totalUses = coupons.reduce((acc, curr) => acc + curr.usageCount, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getDaysLeft = (validUntil: string) => {
    const now = new Date();
    const expiry = new Date(validUntil);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "Expired";
    return `${diffDays} days left`;
  };

  const formatDiscount = (type: string, value: number) => {
    if (type === 'FREE_SHIPPING') return "Free Shipping";
    if (type === 'PERCENTAGE') return `${value}% OFF`;
    return `₹${value} OFF`;
  };

  if (loading) {
    return <div className="p-8 text-center text-navy font-bold animate-pulse">Loading coupons...</div>;
  }

  return (
    <div className="space-y-6">
      
      {/* Top Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy">Coupons & Discounts</h2>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-[#091E33] hover:bg-navy text-white px-5 py-2.5 rounded-full text-[13px] font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-ink/50 mb-1">TOTAL COUPONS</p>
            <h3 className="text-3xl font-black text-navy">{totalCoupons}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#F0F6FF] text-[#0F5394] flex items-center justify-center shrink-0">
            <Ticket className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-ink/50 mb-1">ACTIVE NOW</p>
            <h3 className="text-3xl font-black text-[#34D399]">{activeCouponsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#047857] flex items-center justify-center shrink-0">
            <Tag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-ink/50 mb-1">TOTAL USES</p>
            <h3 className="text-3xl font-black text-navy">{totalUses}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-cream text-navy flex items-center justify-center shrink-0">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-ink/50 mb-1">EXPIRED</p>
            <h3 className="text-3xl font-black text-[#D97706]">{expiredCouponsCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FFFBEB] text-[#B45309] flex items-center justify-center shrink-0">
            <IndianRupee className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs Bar & Search / Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-navy/10 shadow-sm">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 lg:pb-0">
          {["All Coupons", "Active", "Expired", "Inactive"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              className={`px-4 py-2 rounded-full text-[13px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === tab
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
              placeholder="Search code..."
              className="w-full bg-[#FAF7F2] border border-navy/15 rounded-full py-2 pl-9 pr-4 text-[12.5px] text-navy placeholder:text-ink/40 focus:outline-none focus:border-navy"
            />
          </div>
          <button className="flex items-center gap-1.5 bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[12.5px] px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm">
            <Filter className="w-3.5 h-3.5 text-navy/70" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCoupons.length === 0 ? (
          <div className="col-span-full text-center py-8 text-ink/50 font-bold">No coupons found.</div>
        ) : filteredCoupons.map((coup) => {
          const status = getStatus(coup);
          return (
            <div key={coup._id} className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden flex flex-col hover:border-navy/20 transition-colors">
              {/* Upper Section (Code & Status) */}
              <div className="p-6 pb-4 relative">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-black text-navy text-[20px] tracking-tight">{coup.code}</h3>
                    <p className="text-[12.5px] text-ink/60 font-medium">{formatDiscount(coup.discountType, coup.discountValue)}</p>
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold ${
                      status === "Active" ? "bg-[#ECFDF5] text-[#047857]" :
                      status === "Expired" ? "bg-[#FEE2E2] text-[#B91C1C]" :
                      "bg-[#F3F4F6] text-[#4B5563]"
                    }`}
                  >
                    {status}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-2.5 rounded-xl border border-black/5 mt-4">
                  <Ticket className="w-4 h-4 text-[#D97706]" />
                  <span className="text-[12px] font-bold text-navy">
                    Min. order ₹{coup.minOrderValue}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-navy/15 my-2 mx-6 relative">
                <div className="absolute w-4 h-4 rounded-full bg-[#FAF7F2] border-r border-navy/15 -left-8 -top-2"></div>
                <div className="absolute w-4 h-4 rounded-full bg-[#FAF7F2] border-l border-navy/15 -right-8 -top-2"></div>
              </div>

              {/* Lower Section (Stats & Dates) */}
              <div className="p-6 pt-4 mt-auto">
                <div className="flex justify-between items-center mb-5">
                  <div>
                    <p className="text-[11px] font-bold text-ink/40 mb-1">USAGE</p>
                    <p className="text-[13px] font-bold text-navy">
                      <span className="text-[16px] font-black">{coup.usageCount}</span>
                      <span className="text-ink/40"> / {coup.maxUsageLimit === 0 ? '∞' : coup.maxUsageLimit}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-ink/40 mb-1">VALIDITY</p>
                    <p className="text-[13px] font-bold text-navy">{formatDate(coup.validFrom)} – {formatDate(coup.validUntil)}</p>
                    <p className="text-[11.5px] text-ink/50 mt-0.5">{getDaysLeft(coup.validUntil)}</p>
                  </div>
                </div>

                <div className="w-full bg-cream h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-navy h-full rounded-full transition-all" 
                    style={{ width: `${coup.maxUsageLimit === 0 ? 100 : Math.min((coup.usageCount / coup.maxUsageLimit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Coupon Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-navy/10 relative overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-navy/10 mb-6">
              <div>
                <h3 className="font-fraunces font-black text-navy text-[20px]">Create New Coupon</h3>
                <p className="text-[12px] text-ink/50 font-medium">Add a new discount code for your customers</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-ink/40 hover:text-navy p-1.5 rounded-full hover:bg-cream transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  placeholder="e.g. SUMMER20"
                  className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl px-4 py-3 text-[14px] font-bold text-navy focus:outline-none focus:border-navy uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">Discount Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({...newCoupon, discountType: e.target.value as any})}
                    className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl px-4 py-3 text-[13px] font-bold text-navy focus:outline-none focus:border-navy"
                  >
                    <option value="FLAT">Flat Amount (₹)</option>
                    <option value="PERCENTAGE">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">
                    {newCoupon.discountType === 'PERCENTAGE' ? 'Discount Percentage *' : 'Discount Value *'}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({...newCoupon, discountValue: Number(e.target.value)})}
                    className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl px-4 py-3 text-[14px] font-bold text-navy focus:outline-none focus:border-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">Min Order Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCoupon.minOrderValue}
                    onChange={(e) => setNewCoupon({...newCoupon, minOrderValue: Number(e.target.value)})}
                    className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl px-4 py-3 text-[14px] font-bold text-navy focus:outline-none focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">Usage Limit (0=∞)</label>
                  <input
                    type="number"
                    min="0"
                    value={newCoupon.maxUsageLimit}
                    onChange={(e) => setNewCoupon({...newCoupon, maxUsageLimit: Number(e.target.value)})}
                    className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl px-4 py-3 text-[14px] font-bold text-navy focus:outline-none focus:border-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">Valid From *</label>
                  <input
                    type="date"
                    required
                    value={newCoupon.validFrom}
                    onChange={(e) => setNewCoupon({...newCoupon, validFrom: e.target.value})}
                    className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl px-4 py-3 text-[13px] font-bold text-navy focus:outline-none focus:border-navy"
                  />
                </div>
                <div>
                  <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">Valid Until *</label>
                  <input
                    type="date"
                    required
                    value={newCoupon.validUntil}
                    onChange={(e) => setNewCoupon({...newCoupon, validUntil: e.target.value})}
                    className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl px-4 py-3 text-[13px] font-bold text-navy focus:outline-none focus:border-navy"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy/10 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-3 rounded-2xl border border-navy/15 text-navy font-bold text-[14px] hover:bg-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-2xl bg-[#091E33] hover:bg-navy text-white font-bold text-[14px] transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Create Coupon</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Info Banner */}
      <div className="bg-[#FFFDF5] border border-[#FCD34D]/50 rounded-3xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-navy text-[14px]">Discount Strategy</h4>
          <p className="text-[12.5px] text-navy/70 font-medium mt-0.5">
            Use targeted coupons to clear out inventory or reward loyal customers. Flat discounts convert best on lower-priced items.
          </p>
        </div>
      </div>

    </div>
  );
}

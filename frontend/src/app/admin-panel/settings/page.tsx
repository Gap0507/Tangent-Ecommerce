"use client";

import React, { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2, Truck, Settings as SettingsIcon, Lightbulb, Info, Loader2, Save, AlertCircle } from "lucide-react";

export default function SettingsPage() {
  const [showRazorpayKeyId, setShowRazorpayKeyId] = useState(false);
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [showShiprocketKey, setShowShiprocketKey] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [formData, setFormData] = useState({
    razorpayKeyId: "",
    razorpayKeySecret: "",
    shiprocketEmail: "",
    shiprocketApiKey: "",
    useRealTimeRates: false,
    flatShippingRate: 49,
    storeEmail: "hello@tangentdrinks.com",
    storePhone: "+91 98765 43210",
    storeName: "Tangent Drinks",
  });

  // Fetch settings from API on mount
  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          const d = resData.data;
          setFormData({
            razorpayKeyId: d.razorpayKeyId || "",
            razorpayKeySecret: d.razorpayKeySecret || "",
            shiprocketEmail: d.shiprocketEmail || "",
            shiprocketApiKey: d.shiprocketApiKey || "",
            useRealTimeRates: d.useRealTimeRates || false,
            flatShippingRate: d.flatShippingRate !== undefined ? d.flatShippingRate : 49,
            storeEmail: d.storeEmail || "hello@tangentdrinks.com",
            storePhone: d.storePhone || "+91 98765 43210",
            storeName: d.storeName || "Tangent Drinks",
          });
        }
      })
      .catch((err) => console.error("Failed to load settings:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success && data.data) {
        const updated = data.data;
        setFormData({
          razorpayKeyId: updated.razorpayKeyId || "",
          razorpayKeySecret: updated.razorpayKeySecret || "",
          shiprocketEmail: updated.shiprocketEmail || "",
          shiprocketApiKey: updated.shiprocketApiKey || "",
          useRealTimeRates: updated.useRealTimeRates || false,
          flatShippingRate: updated.flatShippingRate !== undefined ? updated.flatShippingRate : 49,
          storeEmail: updated.storeEmail || "hello@tangentdrinks.com",
          storePhone: updated.storePhone || "+91 98765 43210",
          storeName: updated.storeName || "Tangent Drinks",
        });
        setStatusMessage({ type: "success", text: "Settings saved successfully" });
      } else {
        setStatusMessage({ type: "error", text: data.error || "Failed to save settings." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "An error occurred while saving settings." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form id="settings-form" onSubmit={handleSave} className="space-y-6 max-w-[1200px]">

      {/* Loading Overlay State */}
      {isLoading && (
        <div className="bg-white rounded-3xl p-8 text-center border border-navy/10 shadow-sm flex items-center justify-center gap-3 text-navy">
          <Loader2 className="w-6 h-6 animate-spin text-navy" />
          <span className="font-bold text-[15px]">Loading saved store settings...</span>
        </div>
      )}

      {/* Status Feedback Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl border flex items-center gap-3 text-[14px] font-semibold transition-all ${statusMessage.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
            }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* 1. Razorpay Settings Card */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col">

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F6FF] flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12.07L13.84 21H11.59L19.75 12.07H22Z" fill="#3388FF" />
                <path d="M10.15 21H12.4L20.56 12.07H18.31L10.15 21Z" fill="#0052CC" />
                <path d="M12.4 12.07L4.24 3H6.49L14.65 12.07H12.4Z" fill="#3388FF" />
                <path d="M2 12.07L10.16 3H7.91L-0.25 12.07H2Z" fill="#0052CC" />
              </svg>
            </div>
            <div>
              <h3 className="font-fraunces font-black text-[20px] text-navy">Razorpay Settings</h3>
              <p className="text-[13px] text-ink/60 mt-0.5">Connect your Razorpay account to accept payments.</p>
            </div>
          </div>

          <div className="space-y-5 flex-1">
            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Razorpay Key ID</label>
              <div className="relative">
                <input
                  type={showRazorpayKeyId ? "text" : "password"}
                  placeholder="rzp_live_xxxxxxxxxxxx"
                  value={formData.razorpayKeyId}
                  onChange={(e) => setFormData({ ...formData, razorpayKeyId: e.target.value })}
                  className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 pr-10 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowRazorpayKeyId(!showRazorpayKeyId)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-navy cursor-pointer transition-colors"
                >
                  {showRazorpayKeyId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Razorpay Key Secret</label>
              <div className="relative">
                <input
                  type={showRazorpaySecret ? "text" : "password"}
                  placeholder="Enter Key Secret"
                  value={formData.razorpayKeySecret}
                  onChange={(e) => setFormData({ ...formData, razorpayKeySecret: e.target.value })}
                  className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 pr-10 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-navy cursor-pointer transition-colors"
                >
                  {showRazorpaySecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-navy/5 flex items-center gap-2 text-[13px] font-bold text-[#1E7B34]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{formData.razorpayKeyId ? "Razorpay configured" : "Razorpay ready to connect"}</span>
          </div>
        </div>

        {/* 2. Shiprocket Settings Card */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col">

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F6F0FF] flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 7.5V16.5C21 17.0304 20.7893 17.5391 20.4142 17.9142C20.0391 18.2893 19.5304 18.5 19 18.5H5C4.46957 18.5 3.96086 18.2893 3.58579 17.9142C3.21071 17.5391 3 17.0304 3 16.5V7.5C3 6.96957 3.21071 6.46086 3.58579 6.08579C3.96086 5.71071 4.46957 5.5 5 5.5H19C19.5304 5.5 20.0391 5.71071 20.4142 6.08579C20.7893 6.46086 21 6.96957 21 7.5Z" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 21V5M8 21V5" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 12H21" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <h3 className="font-fraunces font-black text-[20px] text-navy">Shiprocket Settings</h3>
              <p className="text-[13px] text-ink/60 mt-0.5">Connect your Shiprocket account to automate order shipping.</p>
            </div>
          </div>

          <div className="space-y-5 flex-1">
            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Shiprocket Email / Username</label>
              <input
                type="text"
                placeholder="admin@tangentdrinks.com"
                value={formData.shiprocketEmail}
                onChange={(e) => setFormData({ ...formData, shiprocketEmail: e.target.value })}
                className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Shiprocket API Key</label>
              <div className="relative">
                <input
                  type={showShiprocketKey ? "text" : "password"}
                  placeholder="Enter Shiprocket API Key"
                  value={formData.shiprocketApiKey}
                  onChange={(e) => setFormData({ ...formData, shiprocketApiKey: e.target.value })}
                  className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 pr-10 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm tracking-wider"
                />
                <button
                  type="button"
                  onClick={() => setShowShiprocketKey(!showShiprocketKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-navy cursor-pointer transition-colors"
                >
                  {showShiprocketKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-navy/5 flex items-center gap-2 text-[13px] font-bold text-[#1E7B34]">
            <CheckCircle2 className="w-4 h-4" />
            <span>{formData.shiprocketEmail ? "Shiprocket configured" : "Shiprocket ready to connect"}</span>
          </div>
        </div>

        {/* 3. Shipping Settings Card */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col">

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#EDF5E6] flex items-center justify-center shrink-0 text-[#4B7322]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-fraunces font-black text-[20px] text-navy">Shipping Settings</h3>
              <p className="text-[13px] text-ink/60 mt-0.5">Configure how shipping is calculated at checkout.</p>
            </div>
          </div>

          <div className="space-y-6 flex-1">

            {/* Toggle Row */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-[13.5px] font-bold text-navy">Use Shiprocket Rates (Real-time)</h4>
                  <span className="bg-[#E6F4EA] text-[#1E7B34] text-[11px] font-bold px-2 py-0.5 rounded-full">Recommended</span>
                </div>
                <p className="text-[13px] text-ink/60">Get real-time shipping rates from Shiprocket at checkout.</p>
              </div>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, useRealTimeRates: !formData.useRealTimeRates })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.useRealTimeRates ? 'bg-[#4B7322]' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.useRealTimeRates ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Info Banner */}
            {!formData.useRealTimeRates && (
              <div className="bg-[#F0F6FF] rounded-xl p-4 flex gap-3 text-[#0F5394]">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-[13px] leading-relaxed">
                  When turned off, the flat rate below will be used as the final shipping rate shown to customers at checkout.
                </p>
              </div>
            )}

            {/* Flat Rate Input */}
            {!formData.useRealTimeRates && (
              <div className="space-y-2">
                <div>
                  <label className="block text-[13.5px] font-bold text-navy">Final Shipping Rate (Flat Rate in ₹)</label>
                  <p className="text-[12px] text-ink/50 mt-0.5 mb-2">This is the final shipping charge shown to customers.</p>
                </div>
                <input
                  type="number"
                  value={formData.flatShippingRate}
                  onChange={(e) => setFormData({ ...formData, flatShippingRate: Number(e.target.value) })}
                  className="w-1/2 sm:w-1/3 bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-bold focus:outline-none focus:border-navy shadow-sm"
                />
                <p className="text-[12px] text-ink/50 mt-2">This flat rate will be applied to all orders at checkout.</p>
              </div>
            )}

          </div>
        </div>

        {/* 4. General Settings Card */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col">

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] flex items-center justify-center shrink-0 text-[#7E22CE]">
              <SettingsIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-fraunces font-black text-[20px] text-navy">General Settings</h3>
              <p className="text-[13px] text-ink/60 mt-0.5">Update your store's general preferences.</p>
            </div>
          </div>

          <div className="space-y-5 flex-1">
            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Store Email</label>
              <input
                type="email"
                value={formData.storeEmail}
                onChange={(e) => setFormData({ ...formData, storeEmail: e.target.value })}
                className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Store Phone</label>
              <input
                type="text"
                value={formData.storePhone}
                onChange={(e) => setFormData({ ...formData, storePhone: e.target.value })}
                className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Store Name</label>
              <input
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer Button */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#091E33] hover:bg-navy text-white text-[15px] font-bold px-8 py-3.5 rounded-2xl transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>

        {statusMessage && (
          <span className={`text-[13px] font-bold ${statusMessage.type === "success" ? "text-green-700" : "text-red-600"}`}>
            {statusMessage.text}
          </span>
        )}
      </div>

      {/* Important Notice Banner */}
      <div className="mt-8 bg-[#FFFBF0] border border-[#FDE68A] rounded-2xl p-6 flex items-start sm:items-center gap-4 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-[#FBBF24] text-white flex items-center justify-center shrink-0 shadow-sm">
          <Lightbulb className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h4 className="font-bold text-navy text-[16px]">Important</h4>
          <p className="text-[13.5px] text-ink/70 mt-1">
            After updating any API keys or shipping settings, please test a sample order to ensure everything is working correctly.
          </p>
        </div>
      </div>

    </form>
  );
}

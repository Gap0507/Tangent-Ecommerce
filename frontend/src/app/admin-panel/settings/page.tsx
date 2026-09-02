"use client";

import React, { useState } from "react";
import { Eye, CheckCircle2, Truck, Settings as SettingsIcon, Lightbulb, Info } from "lucide-react";

export default function SettingsPage() {
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);
  const [showShiprocketKey, setShowShiprocketKey] = useState(false);
  const [useRealTimeRates, setUseRealTimeRates] = useState(false);

  return (
    <div className="space-y-6 max-w-[1200px]">
      
      {/* Settings Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* 1. Razorpay Settings Card */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col">
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F0F6FF] flex items-center justify-center shrink-0">
              {/* Custom SVG icon for Razorpay to match screenshot */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12.07L13.84 21H11.59L19.75 12.07H22Z" fill="#3388FF"/>
                <path d="M10.15 21H12.4L20.56 12.07H18.31L10.15 21Z" fill="#0052CC"/>
                <path d="M12.4 12.07L4.24 3H6.49L14.65 12.07H12.4Z" fill="#3388FF"/>
                <path d="M2 12.07L10.16 3H7.91L-0.25 12.07H2Z" fill="#0052CC"/>
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
                  type="password"
                  defaultValue="rzp_test_1234567890ABCD"
                  className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm tracking-widest"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-navy cursor-pointer transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Razorpay Key Secret</label>
              <div className="relative">
                <input
                  type={showRazorpaySecret ? "text" : "password"}
                  defaultValue="ABCDEFGHIJKLMNOPQRSTUVWXYZ123456"
                  className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm tracking-widest"
                />
                <button 
                  onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-navy cursor-pointer transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-navy/5 flex items-center gap-2 text-[13px] font-bold text-[#1E7B34]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Razorpay is connected and active</span>
          </div>
        </div>

        {/* 2. Shiprocket Settings Card */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex flex-col">
          
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F6F0FF] flex items-center justify-center shrink-0">
              {/* Custom SVG icon for Shiprocket */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 7.5V16.5C21 17.0304 20.7893 17.5391 20.4142 17.9142C20.0391 18.2893 19.5304 18.5 19 18.5H5C4.46957 18.5 3.96086 18.2893 3.58579 17.9142C3.21071 17.5391 3 17.0304 3 16.5V7.5C3 6.96957 3.21071 6.46086 3.58579 6.08579C3.96086 5.71071 4.46957 5.5 5 5.5H19C19.5304 5.5 20.0391 5.71071 20.4142 6.08579C20.7893 6.46086 21 6.96957 21 7.5Z" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 21V5M8 21V5" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12H21" stroke="#7E22CE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                defaultValue="admin@tangentdrinks.com"
                className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Shiprocket API Key</label>
              <div className="relative">
                <input
                  type={showShiprocketKey ? "text" : "password"}
                  defaultValue="1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                  className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm tracking-widest"
                />
                <button 
                  onClick={() => setShowShiprocketKey(!showShiprocketKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink/40 hover:text-navy cursor-pointer transition-colors"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-navy/5 flex items-center gap-2 text-[13px] font-bold text-[#1E7B34]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Shiprocket is connected and active</span>
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
                onClick={() => setUseRealTimeRates(!useRealTimeRates)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${useRealTimeRates ? 'bg-[#4B7322]' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${useRealTimeRates ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Info Banner */}
            {!useRealTimeRates && (
              <div className="bg-[#F0F6FF] rounded-xl p-4 flex gap-3 text-[#0F5394]">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-[13px] leading-relaxed">
                  When turned off, the flat rate below will be used as the final shipping rate shown to customers at checkout.
                </p>
              </div>
            )}

            {/* Flat Rate Input */}
            {!useRealTimeRates && (
              <div className="space-y-2">
                <div>
                  <label className="block text-[13.5px] font-bold text-navy">Final Shipping Rate (Flat Rate)</label>
                  <p className="text-[12px] text-ink/50 mt-0.5 mb-2">This is the final shipping charge shown to customers.</p>
                </div>
                <input
                  type="text"
                  defaultValue="₹49"
                  className="w-1/2 sm:w-1/3 bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-bold focus:outline-none focus:border-navy shadow-sm"
                />
                <p className="text-[12px] text-ink/50 mt-2">This flat rate will be applied to all orders.</p>
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
                defaultValue="hello@tangentdrinks.com"
                className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Store Phone</label>
              <input
                type="text"
                defaultValue="+91 98765 43210"
                className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[12.5px] font-bold text-navy">Store Name</label>
              <input
                type="text"
                defaultValue="Tangent Drinks"
                className="w-full bg-white border border-navy/15 rounded-xl py-2.5 px-4 text-[14px] text-navy font-medium focus:outline-none focus:border-navy shadow-sm"
              />
            </div>
          </div>
        </div>

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

    </div>
  );
}

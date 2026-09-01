"use client";

import React, { useState } from "react";

export function ProductTabs() {
  const tabs = ["Details", "Ingredients", "Nutrition", "Reviews (128)"];
  const [activeTab, setActiveTab] = useState("Details");

  return (
    <div className="flex border-b border-navy/10 overflow-x-auto hide-scrollbar">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-6 md:px-8 py-4 font-bold text-[14px] whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
            activeTab === tab 
              ? "border-navy text-navy" 
              : "border-transparent text-ink/50 hover:text-navy hover:border-navy/30"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const products = [
  { id: 1, name: "Citrus Sunrise", type: "Energy Drink", color: "from-sand to-coral" },
  { id: 2, name: "Berry Burst", type: "Energy Drink", color: "from-sky to-blue" },
  { id: 3, name: "Tropical Vibe", type: "Energy Drink", color: "from-sand to-sand-deep" },
  { id: 4, name: "Midnight Mint", type: "Energy Drink", color: "from-navy to-ink" },
];

export function ShopSection() {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <section className="py-[100px] px-5 md:px-10 text-center">
      <h2 className="font-fraunces font-bold text-[clamp(32px,4vw,46px)] text-navy mb-[26px]">
        Find Your Flavor
      </h2>
      
      <div className="flex gap-3 justify-center flex-wrap mb-4">
        {["All", "Fruity", "Citrus", "Bold"].map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`border-[1.5px] font-semibold text-[14px] py-2.5 px-5 rounded-full transition-all duration-200 ${
              activeFilter === filter 
                ? "bg-navy border-navy text-cream" 
                : "bg-transparent border-navy text-navy hover:border-coral"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
      
      <p className="text-[13px] text-navy/65 mb-[60px] font-medium tracking-[.02em]">
        Each pack contains 12 cans.
      </p>

      <div className="relative max-w-[1180px] mx-auto md:px-[66px]">
        {/* Navigation Arrows */}
        <button className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-[46px] h-[46px] rounded-full bg-cream border-[1.5px] border-navy/25 items-center justify-center shadow-[0_6px_16px_rgba(14,42,77,0.14)] hover:bg-pale-sky hover:-translate-y-1/2 hover:scale-105 transition-all z-10">
          <ChevronLeft className="w-5 h-5 stroke-navy stroke-2" />
        </button>
        <button className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 w-[46px] h-[46px] rounded-full bg-cream border-[1.5px] border-navy/25 items-center justify-center shadow-[0_6px_16px_rgba(14,42,77,0.14)] hover:bg-pale-sky hover:-translate-y-1/2 hover:scale-105 transition-all z-10">
          <ChevronRight className="w-5 h-5 stroke-navy stroke-2" />
        </button>

        {/* Carousel Track */}
        <div className="flex items-end justify-start md:justify-center gap-[44px] md:gap-[88px] overflow-x-auto snap-x snap-mandatory pt-5 pb-2.5 px-4 hide-scrollbar">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col items-center flex-none snap-center group cursor-pointer transition-transform duration-250 hover:-translate-y-1.5">
              
              <div className={`w-[88px] h-[225px] rounded-t-2xl rounded-b-[28px] bg-gradient-to-b ${product.color} relative shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_18px_22px_rgba(14,42,77,0.28)]`}>
                <div className="absolute -top-[9px] left-1/2 -translate-x-1/2 w-[64px] h-[16px] rounded-full bg-gradient-to-b from-[#EFF6FC] to-[#BFDCF2] shadow-[0_2px_4px_rgba(14,42,77,0.18)]"></div>
                <div className="absolute -top-[21px] left-1/2 -translate-x-1/2 w-[20px] h-[11px] border-2 border-navy/30 rounded-md"></div>
              </div>

              <h3 className="mt-[18px] font-fraunces font-bold text-[17px] text-navy text-center leading-[1.25]">
                {product.name}
              </h3>
              <p className="font-sans italic font-semibold text-[13.5px] text-navy/40">
                {product.type}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

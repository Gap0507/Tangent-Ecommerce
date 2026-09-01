"use client";

import React from "react";
import { SlidersHorizontal, Grid, Sparkles } from "lucide-react";

interface ShopFiltersProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  totalItems: number;
}

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "single", label: "Single Flavors" },
  { id: "variety", label: "Variety Packs" },
  { id: "bundles", label: "Bundles & Gifts" },
];

export function ShopFilters({
  activeCategory,
  setActiveCategory,
  sortBy,
  setSortBy,
  totalItems,
}: ShopFiltersProps) {
  return (
    <div className="bg-cream border-y border-navy/10 py-5 px-6 md:px-12 sticky top-[72px] z-30 backdrop-blur-md bg-cream/90">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-navy text-white shadow-sm"
                    : "bg-white text-navy/70 border border-navy/15 hover:border-navy/40 hover:text-navy"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Right side stats & Sort */}
        <div className="flex items-center justify-between md:justify-end gap-6">
          <span className="text-ink/60 text-[13px] font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#73A642]" />
            Showing <strong className="text-navy font-bold">{totalItems}</strong> beverages
          </span>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-navy/15 text-[13px] text-navy font-semibold">
              <SlidersHorizontal className="w-3.5 h-3.5 text-navy/60" />
              <span className="text-ink/60 text-[12px]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-navy font-bold text-[13px] cursor-pointer"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

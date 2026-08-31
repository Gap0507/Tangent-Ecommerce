"use client";

import { useState } from "react";
import { motion } from "motion/react";

const filters = ["All Blogs", "Ingredients", "Wellness", "Lifestyle", "Behind Tangent"];

export function BlogFilters() {
  const [activeFilter, setActiveFilter] = useState("All Blogs");

  return (
    <section className="bg-cream py-8 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5">
          {filters.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`relative px-6 py-2.5 rounded-full text-[13px] md:text-[14px] font-semibold transition-all duration-300 ${
                  isActive
                    ? "bg-navy text-cream shadow-md"
                    : "bg-white text-navy border border-navy/20 hover:border-navy hover:bg-navy/5"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

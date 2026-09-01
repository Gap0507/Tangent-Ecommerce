"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import { ProductDetails } from "@/data/products";

export function IngredientsGrid({ ingredients }: { ingredients: ProductDetails["ingredients"] }) {
  return (
    <div className="flex flex-col h-full pl-0 lg:pl-10">
      <h3 className="font-fraunces font-black text-navy text-[24px] md:text-[28px] mb-8">
        Ingredients
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 mb-12">
        {ingredients.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white border border-navy/5 shadow-sm flex items-center justify-center text-[28px] mb-4">
              {item.emoji}
            </div>
            <span className="font-bold text-[13px] text-navy leading-tight px-2">
              {item.name}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <button className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-navy/20 text-navy font-bold text-[13px] hover:border-navy hover:bg-navy/5 transition-colors cursor-pointer w-fit">
          View Full Ingredients <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

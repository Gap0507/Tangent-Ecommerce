"use client";

import React from "react";
import { Leaf, Box, Droplet } from "lucide-react";
import { ProductDetails } from "@/data/products";

export function ProductFeatures({ features }: { features: ProductDetails["features"] }) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'leaf': return <Leaf className="w-5 h-5" />;
      case 'box': return <Box className="w-5 h-5" />;
      case 'droplet': return <Droplet className="w-5 h-5" />;
      default: return <Leaf className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex justify-between md:justify-center md:gap-16 pt-8 pb-4">
      {features.map((feature, idx) => (
        <div key={idx} className="flex flex-col items-center text-center max-w-[120px]">
          <div className="w-12 h-12 rounded-full border border-navy/15 flex items-center justify-center text-navy mb-3 bg-white">
            {getIcon(feature.icon)}
          </div>
          <h4 className="font-bold text-[13px] text-navy mb-1.5 leading-tight">{feature.title}</h4>
          <p className="text-[11px] text-ink/60 leading-snug">{feature.description}</p>
        </div>
      ))}
    </div>
  );
}

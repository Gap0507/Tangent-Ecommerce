"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { ProductDetails } from "@/data/products";

export function WhyLoveIt({ data }: { data: ProductDetails["whyLoveIt"] }) {
  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
      {/* Left: Text & Points */}
      <div className="w-full lg:w-1/2 flex flex-col gap-8">
        <div>
          <h3 className="font-fraunces font-black text-navy text-[24px] md:text-[28px] mb-4">
            Why You&apos;ll Love It
          </h3>
          <p className="text-[14px] text-ink/70 leading-[1.6] mb-6">
            {data.text}
          </p>
          <ul className="flex flex-col gap-3">
            {data.points.map((point, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[13px] text-navy font-medium">
                <CheckCircle2 className="w-5 h-5 text-[#6A9A4A] shrink-0 mt-0.5" />
                <span className="leading-snug">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right: Image */}
      <div className="w-full lg:w-1/2">
        <div className="relative w-full aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden bg-[#FBEFF1] flex items-center justify-center p-6">
          <Image 
            src={data.image} 
            alt="Lifestyle product shot" 
            fill 
            className="object-cover" 
            unoptimized 
          />
        </div>
      </div>
    </div>
  );
}

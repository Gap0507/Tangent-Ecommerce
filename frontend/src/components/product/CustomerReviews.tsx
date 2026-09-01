"use client";

import React from "react";
import { Star, BadgeCheck, ArrowRight } from "lucide-react";
import { ProductDetails } from "@/data/products";
import { motion } from "motion/react";

export function CustomerReviews({ reviews }: { reviews: ProductDetails["reviews"] }) {
  // Duplicate reviews to create a seamless infinite loop
  // Need enough to fill the screen twice for -50% translation to work seamlessly
  const duplicatedReviews = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <div className="flex flex-col overflow-hidden w-full">
      <div className="flex items-center justify-between mb-10 max-w-[1280px] mx-auto px-6 md:px-12 w-full">
        <h3 className="font-fraunces font-black text-navy text-[24px] md:text-[28px]">
          What Our Customers Say
        </h3>
      </div>

      <div
        className="relative flex flex-col gap-4 w-full overflow-hidden"
        style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
      >
        {/* Row 1: Left to Right (or Right to Left) */}
        <motion.div
          className="flex gap-6 py-2 px-2 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 40, repeat: Infinity }}
        >
          {duplicatedReviews.map((review, idx) => (
            <div
              key={`row1-${review.id}-${idx}`}
              className="min-w-[280px] md:min-w-[340px] max-w-[340px] bg-white rounded-3xl p-6 border border-navy/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-cream rounded-full overflow-hidden flex items-center justify-center relative">
                  <div className="text-navy font-bold text-[18px]">
                    {review.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-navy text-[14px] flex items-center gap-1.5">
                    {review.name} {review.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                  </h5>
                  <div className="flex text-[#F9D949] mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-ink/80 text-[13px] leading-[1.6] mb-4">
                {review.text}
              </p>
              <span className="text-ink/40 text-[11px]">{review.date}</span>
            </div>
          ))}
        </motion.div>

        {/* Row 2: Opposite Direction */}
        <motion.div
          className="flex gap-6 py-2 px-2 w-max"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ ease: "linear", duration: 45, repeat: Infinity }}
        >
          {duplicatedReviews.map((review, idx) => (
            <div
              key={`row2-${review.id}-${idx}`}
              className="min-w-[280px] md:min-w-[340px] max-w-[340px] bg-white rounded-3xl p-6 border border-navy/5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-cream rounded-full overflow-hidden flex items-center justify-center relative">
                  <div className="text-navy font-bold text-[18px]">
                    {review.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h5 className="font-bold text-navy text-[14px] flex items-center gap-1.5">
                    {review.name} {review.verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                  </h5>
                  <div className="flex text-[#F9D949] mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-ink/80 text-[13px] leading-[1.6] mb-4">
                {review.text}
              </p>
              <span className="text-ink/40 text-[11px]">{review.date}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

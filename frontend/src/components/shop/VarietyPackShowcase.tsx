"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ShoppingBag, Check, Package, Sparkles, Leaf, Droplets, Zap } from "lucide-react";

export function VarietyPackShowcase() {
  const [isAdded, setIsAdded] = useState(false);

  const handleBuyNow = () => {
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  return (
    <section className="relative bg-cream py-20 md:py-28 px-6 md:px-12 overflow-hidden">
      {/* Subtle background decorations */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-sand/10 via-transparent to-transparent rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-navy/10 text-navy text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            <Package className="w-3.5 h-3.5" />
            Try Them All
          </span>
          <h2 className="font-fraunces font-black text-navy text-[36px] md:text-[52px] leading-tight mb-4">
            The <span className="italic text-coral">Variety</span> Pack
          </h2>
          <p className="text-ink/60 text-[15px] md:text-[17px] leading-[1.7] max-w-[550px] mx-auto">
            Can&apos;t decide? Get one of each! All 4 signature flavors in a single pack — the perfect way to explore the full Tangent experience.
          </p>
        </motion.div>

        {/* Variety Pack Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-white rounded-[32px] border border-navy/8 shadow-[0_8px_40px_rgba(0,0,0,0.06)] overflow-hidden"
        >
          <div className="flex flex-col lg:flex-row">
            {/* LEFT — Hero all4can image */}
            <div className="flex-1 relative">
              <div className="relative w-full h-[350px] md:h-[480px] lg:h-full lg:min-h-[520px] overflow-hidden">
                <Image
                  src="/all4can.png"
                  alt="Tangent Variety Pack - All 4 Flavors"
                  fill
                  className="object-contain object-center p-6 md:p-10"
                  unoptimized
                />
                {/* Subtle gradient overlay at bottom for depth */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/50 to-transparent pointer-events-none" />
              </div>

              {/* Flavor labels floating at bottom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 justify-center px-4 whitespace-nowrap">
                {["Watermelon Mint", "Yuzu Mint", "Watermelon Cranberry", "Guava Chilli"].map((name) => (
                  <span
                    key={name}
                    className="bg-white/90 backdrop-blur-md text-navy text-[11px] font-bold px-3 py-1.5 rounded-full border border-navy/8 shadow-sm"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — Pack Info + Buy Now */}
            <div className="lg:w-[400px] bg-gradient-to-br from-navy to-[#0A1F35] p-8 md:p-10 flex flex-col justify-center text-white relative overflow-hidden">


              <div className="relative z-10">
                <span className="inline-block bg-sand/20 text-sand text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full mb-5">
                  Best Value
                </span>

                <h3 className="font-fraunces font-black text-[28px] md:text-[36px] leading-tight mb-2">
                  Tangent<br />
                  <span className="text-sand">Variety Pack</span>
                </h3>

                <p className="text-cream/60 text-[14px] leading-[1.7] mb-7">
                  One can of each flavor — Watermelon Mint, Watermelon Cranberry, Yuzu Mint & Guava Chilli. The ultimate tasting experience.
                </p>

                {/* Perks */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cream/10 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-cream">100% Natural Ingredients</p>
                      <p className="text-[11px] text-cream/40">No artificial flavors or sweeteners</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cream/10 flex items-center justify-center">
                      <Droplets className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-cream">Prebiotic & Vitamin-Infused</p>
                      <p className="text-[11px] text-cream/40">B12, B6, B1 in every can</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-cream/10 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-cream">Zero Sugar, Low Calorie</p>
                      <p className="text-[11px] text-cream/40">Zero caffeine, zero crash</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-end gap-3 mb-3">
                  <span className="font-fraunces font-black text-[46px] text-sand leading-none">$16</span>
                  <span className="text-cream/50 text-[14px] font-medium pb-2">/pack of 4</span>
                </div>

                {/* Free Shipping pill */}
                <div className="flex items-center gap-2 text-[12px] text-cream/60 mb-8">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Free shipping on all orders
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className={`w-full py-4 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xl ${
                    isAdded
                      ? "bg-emerald-500 text-white scale-[0.98]"
                      : "bg-sand text-navy hover:bg-sand-deep hover:scale-[1.02]"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Buy Now — $16.00</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

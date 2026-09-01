"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Can3DViewer from "@/components/home/Can3DViewer";
import AnimatedBackground from "@/components/home/AnimatedBackground";

const WaterWave = dynamic(() => import("react-water-wave"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#F28C8C]"></div>
  ),
});

const FLAVORS = [
  {
    id: "watermelon-mint",
    name: "Watermelon Mint",
    tagline: "Ultra Hydrating & Crisp",
    color: "#F28C8C",
    modelPath: "/assets/3d/can/Tangent_Watermelon_Mint.glb",
    price: "$16.00",
    packLabel: "Pack of 4",
    offset: [0, -0.04, 0] as [number, number, number],
  },
  {
    id: "watermelon-cranberry",
    name: "Watermelon Cranberry",
    tagline: "Sweet Meets Tart",
    color: "#85C7D3",
    modelPath: "/assets/3d/can/Tangent_Watermelon_Cranberry_v2_FINAL_4K.glb",
    price: "$16.00",
    packLabel: "Pack of 4",
    offset: [0, -0.04, 0] as [number, number, number],
  },
  {
    id: "yuzu-mint",
    name: "Yuzu Mint",
    tagline: "Zesty Japanese Citrus",
    color: "#F9D949",
    modelPath: "/assets/3d/can/Tangent_Yuzu_Mint_FINAL_4K.glb",
    price: "$16.00",
    packLabel: "Pack of 4",
    offset: [0, -0.04, 0] as [number, number, number],
  },
  {
    id: "guava-chilli",
    name: "Guava Chilli",
    tagline: "Sweet Tropical Heat",
    color: "#E8706B",
    modelPath: "/assets/3d/can/Tangent_Guava_Chilli_FINAL_4K.glb",
    price: "$16.00",
    packLabel: "Pack of 4",
    offset: [0, -0.04, 0] as [number, number, number],
  },
];

export function ShopHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const activeFlavor = FLAVORS[activeIndex];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative w-full min-h-[600px] md:min-h-[650px] overflow-hidden bg-cream">
      <div className="flex flex-col lg:flex-row w-full min-h-[600px] md:min-h-[650px]">
        
        {/* LEFT — Content on cream bg */}
        <div className="flex-1 flex items-center px-8 md:px-16 lg:px-20 py-14 lg:py-0 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-[520px]"
          >
            <span className="text-[11px] font-black text-navy/50 uppercase tracking-[0.2em] mb-5 block">
              Shop All Flavors
            </span>

            <h1 className="font-fraunces font-black text-navy text-[48px] sm:text-[56px] lg:text-[68px] leading-[0.95] mb-6">
              Explore.<br />
              <span className="italic font-normal text-navy/70">Sip.</span>{" "}
              <span
                className="transition-colors duration-500"
                style={{ color: activeFlavor.color }}
              >
                Refresh.
              </span>
            </h1>

            <p className="text-ink/60 text-[16px] md:text-[17px] leading-[1.7] mb-10 max-w-[440px]">
              Vitamin-infused, botanical prebiotic sparkling beverages. Zero added sugar, low calorie, crafted with 100% real fruit juice.
            </p>

            {/* Flavor Selector — Clean Tabs */}
            <div className="flex flex-wrap gap-3 mb-10">
              {FLAVORS.map((flavor, idx) => (
                <button
                  key={flavor.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative px-5 py-2.5 rounded-full text-[13px] font-bold transition-all duration-300 cursor-pointer border-2 ${
                    activeIndex === idx
                      ? "text-white border-transparent shadow-lg scale-105"
                      : "bg-transparent text-navy/70 border-navy/12 hover:border-navy/30 hover:text-navy"
                  }`}
                  style={
                    activeIndex === idx
                      ? { backgroundColor: flavor.color, borderColor: flavor.color }
                      : undefined
                  }
                >
                  {flavor.name}
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4">
              <button className="bg-navy text-cream px-8 py-4 rounded-full font-bold text-[15px] hover:bg-navy/90 transition-all cursor-pointer shadow-xl flex items-center gap-2.5 group hover:scale-[1.03]">
                <ShoppingBag className="w-5 h-5" />
                <span>Shop {activeFlavor.name}</span>
              </button>
              <button className="text-navy font-bold text-[14px] flex items-center gap-1 hover:gap-2.5 transition-all cursor-pointer group">
                View All
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* RIGHT — Immersive 3D Panel with Water Wave BG */}
        <div className="w-full lg:w-[55%] relative h-[450px] md:h-auto overflow-hidden">
          <WaterWave
            dropRadius={isMobile ? 8 : 12}
            perturbance={isMobile ? 0.006 : 0.012}
            imageUrl="/assets/images/drop.png"
            resolution={isMobile ? 256 : 512}
            style={{ width: "100%", height: "100%" }}
          >
            {() => (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Animated color background */}
                <AnimatedBackground backgroundColor={activeFlavor.color} />
                
                {/* Large background text */}
                <div className="absolute z-[1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none text-center">
                  <h1
                    className="text-white/15 uppercase select-none leading-none inline-block mix-blend-overlay"
                    style={{
                      fontFamily: "var(--font-thunder)",
                      fontSize: isMobile ? "clamp(5rem, 20vw, 10rem)" : "clamp(8rem, 14vw, 20rem)",
                      letterSpacing: "0.02em",
                    }}
                  >
                    TANGENT
                  </h1>
                </div>

                {/* 3D Can — Large and Centered */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeFlavor.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.85 }}
                      transition={{ duration: 0.5 }}
                      className="w-[380px] md:w-[550px] lg:w-[620px] h-[520px] md:h-[700px] lg:h-[750px]"
                    >
                      <Can3DViewer
                        modelPath={activeFlavor.modelPath}
                        isMobile={isMobile}
                        rotation={[0, Math.PI / 3, 0]}
                        positionOffset={activeFlavor.offset}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Bottom floating info chip */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-white/90 backdrop-blur-xl px-8 py-3 rounded-2xl shadow-xl border border-white/40 flex items-center gap-6 pointer-events-none">
                  <div>
                    <p className="text-navy font-black text-[16px] leading-tight">{activeFlavor.name}</p>
                    <p className="text-ink/50 text-[12px]">{activeFlavor.tagline}</p>
                  </div>
                  <div className="h-8 w-px bg-navy/15" />
                  <div className="text-right">
                    <p className="text-navy font-black text-[18px]">{activeFlavor.price}</p>
                    <p className="text-ink/40 text-[11px]">{activeFlavor.packLabel}</p>
                  </div>
                </div>
              </div>
            )}
          </WaterWave>
        </div>

      </div>
    </section>
  );
}

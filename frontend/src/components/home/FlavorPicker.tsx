"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, ShoppingCart, Ban, Droplet, HeartPulse, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const flavors = [
  {
    id: 1,
    nameA: "Watermelon",
    nameB: "Cranberry",
    flavorLabel: "Watermelon Cranberry",
    tagline: "No added sugar. Zero crash.",
    desc: "The perfect blend of juicy watermelon and tart cranberry. Refreshing, hydrating, and packed with goodness.",
    canSrc: "/can1.png",
    cardSrc: "/flavourcard1.png",
    accentColor: "#E8604B",
    notes: ["Watermelon", "Cranberry", "Prebiotic"],
    features: [
      { icon: Ban, label: "No Added\nSugar" },
      { icon: Droplet, label: "Low\nCalorie" },
      { icon: HeartPulse, label: "Prebiotic\nGoodness" },
      { icon: Zap, label: "Zero\nCaffeine" },
    ]
  },
  {
    id: 2,
    nameA: "Watermelon",
    nameB: "Mint",
    flavorLabel: "Watermelon Mint",
    tagline: "Enriched with Vitamins B12, B6, B1.",
    desc: "A cool twist of fresh mint and sweet watermelon. Rejuvenating and perfect for hot afternoons.",
    canSrc: "/can2.png",
    cardSrc: "/flavourcard2.png",
    accentColor: "#6B8E5A",
    notes: ["Watermelon", "Mint", "Vitamins"],
    features: [
      { icon: Ban, label: "No Added\nSugar" },
      { icon: Droplet, label: "Low\nCalorie" },
      { icon: HeartPulse, label: "Prebiotic\nGoodness" },
      { icon: Zap, label: "Zero\nCaffeine" },
    ]
  },
  {
    id: 3,
    nameA: "Guava",
    nameB: "Chilli",
    flavorLabel: "Guava Chilli",
    tagline: "A sweet & spicy twist.",
    desc: "Tropical guava meets a surprising kick of chilli. A bold, unapologetic flavor for those who dare.",
    canSrc: "/can3.png",
    cardSrc: "/flavourcard3.png",
    accentColor: "#B8942E",
    notes: ["Guava", "Chilli", "Prebiotic"],
    features: [
      { icon: Ban, label: "No Added\nSugar" },
      { icon: Droplet, label: "Low\nCalorie" },
      { icon: HeartPulse, label: "Prebiotic\nGoodness" },
      { icon: Zap, label: "Zero\nCaffeine" },
    ]
  },
  {
    id: 4,
    nameA: "Yuzu",
    nameB: "Mint",
    flavorLabel: "Yuzu Mint",
    tagline: "Crisp and refreshing.",
    desc: "Bright citrus yuzu perfectly balanced with cool mint. Zesty, uplifting, and totally unique.",
    canSrc: "/can4.png",
    cardSrc: "/flavourcard4.png",
    accentColor: "#8B9A2E",
    notes: ["Yuzu", "Mint", "Zero Sugar"],
    features: [
      { icon: Ban, label: "No Added\nSugar" },
      { icon: Droplet, label: "Low\nCalorie" },
      { icon: HeartPulse, label: "Prebiotic\nGoodness" },
      { icon: Zap, label: "Zero\nCaffeine" },
    ]
  },
];

export function FlavorPicker() {
  const { addToCart } = useCart();
  const [activeIdx, setActiveIdx] = useState(0);

  const active = flavors[activeIdx];

  const handleNext = useCallback(() => setActiveIdx((prev) => (prev + 1) % flavors.length), []);
  const handlePrev = useCallback(() => setActiveIdx((prev) => (prev - 1 + flavors.length) % flavors.length), []);

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 4500); // 4.5 seconds
    
    // Cleanup interval on unmount or when user interacts (activeIdx changes)
    return () => clearInterval(timer);
  }, [activeIdx, handleNext]);

  return (
    <section className="relative w-full py-10 md:py-12 bg-[#FAF7F2] overflow-hidden flex items-center min-h-[100vh]">
      <div className="max-w-[1300px] w-full mx-auto px-4 md:px-8">
        
        {/* Header - Compact */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-6 md:mb-8"
        >
          <p className="text-[10px] md:text-[11px] font-bold tracking-[.18em] uppercase text-[#F36B5B] mb-2">
            FIND YOUR FLAVOR
          </p>
          <h2 className="font-fraunces font-black text-navy text-[clamp(28px,4vw,48px)] leading-[1.05] mb-3">
            Tap. Taste. <span className="text-[#F36B5B]">Repeat.</span>
          </h2>
          <p className="text-ink/60 text-[13px] md:text-[14px] max-w-[400px] mx-auto font-medium">
            Four flavors. Four moods. Pick one and explore what&apos;s inside.
          </p>
        </motion.div>

        {/* Top Cards - Square Aspect */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex justify-center gap-4 md:gap-8 mb-6 md:mb-8"
        >
          {flavors.map((flavor, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={flavor.id}
                onClick={() => setActiveIdx(i)}
                className={`relative w-[70px] h-[70px] md:w-[90px] md:h-[90px] transition-all duration-300 cursor-pointer ${
                  isActive ? "scale-110 opacity-100 drop-shadow-md" : "scale-100 opacity-50 hover:opacity-100 hover:scale-105"
                }`}
              >
                <Image
                  src={flavor.cardSrc}
                  alt={flavor.flavorLabel}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </button>
            );
          })}
        </motion.div>

        {/* Main Display Area */}
        <div className="relative bg-[#F3EFE9] rounded-[32px] p-6 md:p-8 lg:p-10 shadow-sm border border-black/5 overflow-hidden">
          
          {/* Subtle background circles for depth */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#F36B5B]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-300/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none" />

          {/* Arrows */}
          <button onClick={handlePrev} className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-110 transition-transform text-navy">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <button onClick={handleNext} className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:scale-110 transition-transform text-navy">
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 px-2 md:px-10">
            
            {/* Left: Can visual */}
            <div className="flex-1 w-full max-w-[400px] relative flex items-center justify-center min-h-[300px] md:min-h-[380px]">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 0.8, x: -30 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.8, x: 30 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center"
                >
                  <Image
                    src={active.cardSrc}
                    alt={active.flavorLabel}
                    fill
                    className="object-contain relative z-10 drop-shadow-[0_10px_30px_rgba(0,0,0,0.15)]"
                    unoptimized
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right: Details - Compact Margins */}
            <div className="flex-1 w-full max-w-[480px] py-2 relative z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="inline-block px-3 py-0.5 bg-[#F36B5B]/10 text-[#F36B5B] font-bold text-[10px] rounded-full mb-3 tracking-wider">
                    0{active.id} / 04
                  </div>

                  <h3 className="font-fraunces font-black text-[#1A2A3A] text-3xl md:text-4xl lg:text-5xl leading-[1.05] mb-2">
                    {active.nameA} <br /> {active.nameB}
                  </h3>
                  
                  <p className="text-ink/50 font-semibold italic text-xs md:text-sm mb-3">
                    &ldquo;{active.tagline}&rdquo;
                  </p>

                  <p className="text-[#1A2A3A]/80 text-[13px] md:text-[14px] leading-relaxed mb-5">
                    {active.desc}
                  </p>

                  <p className="text-[9px] font-bold tracking-[.15em] uppercase text-[#1A2A3A]/40 mb-2">
                    TASTING NOTES
                  </p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {active.notes.map((note) => (
                      <span
                        key={note}
                        className="px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border border-[#F36B5B]/30 text-[#F36B5B] bg-white/50"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  {/* Feature Icons */}
                  <div className="grid grid-cols-4 gap-2 mb-6 border-t border-b border-black/5 py-4">
                    {active.features.map((feat, i) => (
                      <div key={i} className="flex flex-col items-center text-center">
                        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-black/10 flex items-center justify-center mb-1.5 bg-white text-[#1A2A3A]">
                          <feat.icon className="w-3.5 h-3.5 md:w-4 md:h-4 opacity-80" strokeWidth={1.8} />
                        </div>
                        <span className="text-[8px] md:text-[9.5px] font-bold text-[#1A2A3A] whitespace-pre-line leading-tight">
                          {feat.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() =>
                      addToCart({
                        productId: active.flavorLabel.toLowerCase().replace(/\s+/g, "-"),
                        name: active.flavorLabel,
                        size: "Pack of 4",
                        price: 16.0,
                        quantity: 1,
                        image: active.canSrc,
                      })
                    }
                    className="inline-flex items-center gap-2 bg-[#F36B5B] hover:bg-[#E25A4B] text-white font-bold text-[13px] px-6 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-[0_8px_20px_rgba(243,107,91,0.3)] cursor-pointer"
                  >
                    Add to Cart
                    <ShoppingCart className="w-3.5 h-3.5" />
                  </button>


                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Pagination Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {flavors.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setActiveIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx ? "bg-[#F36B5B] w-6" : "bg-black/15 hover:bg-black/30 w-1.5"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

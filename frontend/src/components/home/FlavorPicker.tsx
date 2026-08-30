"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const flavors = [
  {
    id: 1,
    name: "Watermelon Cranberry",
    tagline: "No added sugar. Zero crash.",
    canSrc: "/can1.png",
    bgGradient: "from-[#87CEEB] via-[#B0DFF5] to-[#E8F4F8]",
    accentColor: "#E8604B",
    dotColor: "bg-[#E8604B]",
    ringColor: "ring-[#E8604B]",
    notes: ["Watermelon", "Cranberry", "Prebiotic"],
    calories: "Low",
    caffeine: "0mg",
  },
  {
    id: 2,
    name: "Watermelon Mint",
    tagline: "Enriched with Vitamins B12, B6, B1.",
    canSrc: "/can2.png",
    bgGradient: "from-[#6B8E5A] via-[#9AB88A] to-[#D4E4CC]",
    accentColor: "#6B8E5A",
    dotColor: "bg-[#6B8E5A]",
    ringColor: "ring-[#6B8E5A]",
    notes: ["Watermelon", "Mint", "Vitamins"],
    calories: "Low",
    caffeine: "0mg",
  },
  {
    id: 3,
    name: "Guava Chilli",
    tagline: "A sweet & spicy twist.",
    canSrc: "/can3.png",
    bgGradient: "from-[#D4A843] via-[#E5C96E] to-[#F5E6B0]",
    accentColor: "#B8942E",
    dotColor: "bg-[#D4A843]",
    ringColor: "ring-[#D4A843]",
    notes: ["Guava", "Chilli", "Prebiotic"],
    calories: "Low",
    caffeine: "0mg",
  },
  {
    id: 4,
    name: "Yuzu Mint",
    tagline: "Crisp and refreshing.",
    canSrc: "/can4.png",
    bgGradient: "from-[#C9D84D] via-[#DDE88A] to-[#F0F4C8]",
    accentColor: "#8B9A2E",
    dotColor: "bg-[#8B9A2E]",
    ringColor: "ring-[#8B9A2E]",
    notes: ["Yuzu", "Mint", "Zero Sugar"],
    calories: "Low",
    caffeine: "0mg",
  },
];

export function FlavorPicker() {
  const [activeIdx, setActiveIdx] = useState(0);
  const canContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const active = flavors[activeIdx];

  const switchFlavor = (idx: number) => {
    if (idx === activeIdx) return;

    const canEl = canContainerRef.current;
    const detailsEl = detailsRef.current;
    if (!canEl || !detailsEl) {
      setActiveIdx(idx);
      return;
    }

    // Animate out
    const tl = gsap.timeline({
      onComplete: () => {
        setActiveIdx(idx);
        // Animate in (after React re-renders with new state)
        requestAnimationFrame(() => {
          gsap.fromTo(
            canEl,
            { y: 60, opacity: 0, rotateZ: 8 },
            { y: 0, opacity: 1, rotateZ: 0, duration: 0.6, ease: "back.out(1.6)" }
          );
          gsap.fromTo(
            detailsEl.children,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power3.out" }
          );
        });
      },
    });

    tl.to(canEl, {
      y: -40,
      opacity: 0,
      rotateZ: -6,
      duration: 0.35,
      ease: "power2.in",
    });
    tl.to(
      detailsEl.children,
      { y: -15, opacity: 0, duration: 0.25, stagger: 0.04, ease: "power2.in" },
      0
    );
  };

  // Scroll-triggered entrance
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll(".flavor-reveal"), {
        scrollTrigger: { trigger: section, start: "top 75%" },
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28 transition-all duration-700"
      style={{
        background: `linear-gradient(135deg, #FAF6EC 0%, #FAF6EC 50%, ${active.accentColor}08 100%)`,
      }}
    >
      {/* Decorative circle */}
      <div
        className="absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full opacity-[0.04] pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: active.accentColor }}
      />
      <div
        className="absolute -left-24 -bottom-24 w-[400px] h-[400px] rounded-full opacity-[0.03] pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: active.accentColor }}
      />

      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20 flavor-reveal">
          <p className="text-[12px] font-bold tracking-[.2em] uppercase text-coral mb-3">
            Find Your Flavor
          </p>
          <h2 className="font-fraunces font-black text-navy text-[clamp(30px,4.5vw,52px)] leading-[1.05] mb-4">
            Tap. Taste. <span className="text-coral">Repeat.</span>
          </h2>
          <p className="text-ink/55 text-[16px] max-w-[420px] mx-auto font-medium">
            Four flavors. Four moods. Pick one and explore what&apos;s inside.
          </p>
        </div>

        {/* Flavor selector pills */}
        <div className="flex justify-center gap-2 md:gap-3 mb-12 md:mb-16 flex-wrap flavor-reveal">
          {flavors.map((f, i) => (
            <button
              key={f.id}
              onClick={() => switchFlavor(i)}
              className={`
                relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] md:text-[14px] font-bold 
                transition-all duration-300 cursor-pointer border-2
                ${
                  i === activeIdx
                    ? "bg-navy text-cream border-navy scale-105 shadow-[0_4px_20px_rgba(18,59,115,0.25)]"
                    : "bg-white text-navy border-navy/15 hover:border-navy/40 hover:shadow-md"
                }
              `}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${f.dotColor} ${
                  i === activeIdx ? "scale-125" : "opacity-60"
                }`}
              />
              {f.name}
            </button>
          ))}
        </div>

        {/* Main content: can + details */}
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 flavor-reveal">

          {/* Can display */}
          <div className="flex-1 flex justify-center">
            <div ref={canContainerRef} className="relative">
              {/* Background glow circle */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] md:w-[360px] md:h-[360px] rounded-full transition-all duration-700 blur-[25px] md:blur-[50px] opacity-20 pointer-events-none"
                style={{ backgroundColor: active.accentColor }}
              />
              <Image
                src={active.canSrc}
                alt={active.name}
                width={220}
                height={560}
                className="relative z-10 drop-shadow-[0_24px_48px_rgba(0,0,0,0.18)] mx-auto"
                unoptimized
                priority
              />
            </div>
          </div>

          {/* Details panel */}
          <div ref={detailsRef} className="flex-1 max-w-[480px]">
            {/* Flavor name + tagline */}
            <div>
              <h3 className="font-fraunces font-black text-navy text-[clamp(28px,3.5vw,44px)] leading-[1.1] mb-2">
                {active.name}
              </h3>
              <p className="text-ink/50 text-[17px] font-semibold italic mb-6">
                &ldquo;{active.tagline}&rdquo;
              </p>
            </div>

            {/* Flavor notes */}
            <div>
              <p className="text-[11px] font-bold tracking-[.18em] uppercase text-navy/40 mb-3">
                Tasting Notes
              </p>
              <div className="flex gap-2 mb-8">
                {active.notes.map((note) => (
                  <span
                    key={note}
                    className="px-4 py-1.5 rounded-full text-[13px] font-semibold border-2 transition-colors duration-500"
                    style={{ borderColor: active.accentColor + "40", color: active.accentColor }}
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 text-cream font-bold text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                style={{ backgroundColor: active.accentColor }}
              >
                Add to Cart
                <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

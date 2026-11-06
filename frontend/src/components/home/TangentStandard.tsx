"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Check } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function TangentStandard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Content Entrance
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current.children,
          { y: 35, opacity: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      }

      // 3 Pillar Cards Entrance
      if (cardsRef.current) {
        gsap.fromTo(
          cardsRef.current.children,
          { y: 30, opacity: 0, scale: 0.96 },
          {
            scrollTrigger: { trigger: section, start: "top 70%" },
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",
          }
        );
      }

      // CTA Button Entrance
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { y: 25, opacity: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 65%" },
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#0A2540] overflow-hidden min-h-[85vh] lg:min-h-[90vh] flex flex-col justify-center items-center py-24 md:py-32 lg:py-36 px-6 md:px-12 text-white"
    >
      <div className="max-w-[1240px] w-full mx-auto relative z-10 text-center flex flex-col items-center">
        {/* HEADER & VISION STATEMENT */}
        <div ref={contentRef} className="flex flex-col items-center max-w-[920px] mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5C05E]/10 border border-[#E5C05E]/20 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5C05E]" />
            <p className="text-[#E5C05E] font-bold text-[12px] sm:text-[13px] tracking-[.25em] uppercase">
              Our Vision
            </p>
          </div>

          <h2 className="font-fraunces font-black text-[clamp(44px,6.2vw,86px)] leading-[1.06] tracking-tight mb-8">
            Redefining{" "}
            <span className="text-[#E5C05E] relative inline-block">
              Refreshment.
            </span>
          </h2>

          <p className="text-white/85 text-[18px] sm:text-[21px] md:text-[23px] leading-[1.75] font-normal max-w-[840px] mx-auto mb-14 md:mb-16">
            To build Tangent into a global lifestyle beverage brand that inspires people to choose better every day—bringing together great taste, essential nutrition, and refreshing hydration in every sip.
          </p>
        </div>

        {/* 3 CORE PILLARS (ACROSS THE SCREEN) */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 w-full max-w-[1080px] mx-auto mb-14 md:mb-16"
        >
          {/* Pillar 1 */}
          <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#E5C05E]/40 rounded-2xl p-7 sm:p-8 flex items-center justify-center gap-4 transition-all duration-300 group shadow-lg backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-[#E5C05E]/15 border border-[#E5C05E]/30 flex items-center justify-center text-[#E5C05E] shrink-0 group-hover:scale-110 transition-transform">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-white font-semibold text-[17px] sm:text-[18px] tracking-wide text-left">
              Uncompromising Taste
            </span>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#E5C05E]/40 rounded-2xl p-7 sm:p-8 flex items-center justify-center gap-4 transition-all duration-300 group shadow-lg backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-[#E5C05E]/15 border border-[#E5C05E]/30 flex items-center justify-center text-[#E5C05E] shrink-0 group-hover:scale-110 transition-transform">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-white font-semibold text-[17px] sm:text-[18px] tracking-wide text-left">
              Essential Daily Nutrition
            </span>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 hover:border-[#E5C05E]/40 rounded-2xl p-7 sm:p-8 flex items-center justify-center gap-4 transition-all duration-300 group shadow-lg backdrop-blur-sm">
            <div className="w-10 h-10 rounded-full bg-[#E5C05E]/15 border border-[#E5C05E]/30 flex items-center justify-center text-[#E5C05E] shrink-0 group-hover:scale-110 transition-transform">
              <Check className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-white font-semibold text-[17px] sm:text-[18px] tracking-wide text-left">
              Clean, Refreshing Hydration
            </span>
          </div>
        </div>

        {/* CALL TO ACTION BUTTON */}
        <div ref={ctaRef} className="flex justify-center">
          <Link
            href="/our-story"
            className="inline-flex items-center gap-3 px-9 py-4 bg-[#E5C05E] hover:bg-white text-[#0A2540] font-bold text-[15px] sm:text-[16px] rounded-full shadow-[0_10px_30px_rgba(229,192,94,0.22)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.28)] transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <span>Read Our Story</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </div>
      </div>

      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-[#E5C05E]/8 blur-[150px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] rounded-full bg-sky-500/10 blur-[160px]" />
        <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-[#E5C05E]/5 blur-[140px]" />
      </div>
    </section>
  );
}

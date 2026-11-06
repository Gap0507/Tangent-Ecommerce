"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export function TasteOfWonder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Center text entrance
      if (centerTextRef.current) {
        gsap.fromTo(
          centerTextRef.current.children,
          { y: 30, opacity: 0 },
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
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-cream overflow-hidden py-20 md:py-28 px-6 md:px-12">
      <div className="max-w-[1380px] mx-auto relative flex items-center justify-center">
        {/* CENTER CONTENT */}
        <div ref={centerTextRef} className="relative z-20 text-center max-w-[580px] mx-auto px-4">
          <p className="text-[12px] font-bold tracking-[.22em] uppercase text-[#4A6038] mb-3">
            THE TANGENT DIFFERENCE
          </p>

          <h2 className="font-fraunces font-black text-navy text-[clamp(38px,4.8vw,62px)] leading-[1.06] mb-5">
            Real Ingredients. <br />
            <span className="text-[#3B5828] relative inline-block">
              Real Difference.
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#E5C05E]" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
                <path d="M2 9C50 3 150 3 198 9" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
              </svg>
            </span>
          </h2>

          <p className="text-ink/75 text-[15px] md:text-[16px] leading-[1.65] font-medium max-w-[460px] mx-auto mb-8">
            At Tangent, we keep it real. No shortcuts. No artificial stuff. Just honest ingredients and refreshing flavors that fit your lifestyle.
          </p>

          <div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-[#1A2A3A] hover:bg-[#111D2A] text-white font-bold text-[14px] px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-xl cursor-pointer"
            >
              <span>Explore All Flavors</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

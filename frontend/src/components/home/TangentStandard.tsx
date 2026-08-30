"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const bottomFeatures = [
  {
    id: 1,
    titleHighlight: "100%",
    titleText: "NATURAL",
    desc: "Made with real extracts and natural botanicals.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4.418 0 8-3.582 8-8 0-4.418-5.5-9-8-11-2.5 2-8 6.582-8 11 0 4.418 3.582 8 8 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10" />
      </svg>
    ),
  },
  {
    id: 2,
    titleHighlight: "0",
    titleText: "ARTIFICIAL",
    desc: "Zero artificial sweeteners, flavors or colors.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    id: 3,
    titleHighlight: "PLANT",
    titleText: "POWERED",
    desc: "Clean caffeine with L-theanine for balanced energy.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    id: 4,
    titleHighlight: "HYDRATION",
    titleText: "REIMAGINED",
    desc: "Pure refreshment that fits your lifestyle.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c-4.97 0-9-3.92-9-8.75 0-4.8 5.76-10.9 8.28-13.4a1 1 0 011.44 0C15.24 2.1 21 8.2 21 13c0 4.83-4.03 8.75-9 8.75z" />
      </svg>
    ),
  },
];

export function TangentStandard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Left text reveal
      if (leftColRef.current) {
        gsap.fromTo(
          leftColRef.current.children,
          { y: 35, opacity: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 80%" },
            y: 0,
            opacity: 1,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
          }
        );
      }

      // Right image reveal
      if (rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { scale: 0.92, opacity: 0, y: 30 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
          }
        );
      }

      // Bottom features reveal
      if (bottomRowRef.current) {
        const items = bottomRowRef.current.querySelectorAll(".feature-item");
        gsap.fromTo(
          items,
          { y: 35, opacity: 0 },
          {
            scrollTrigger: { trigger: bottomRowRef.current, start: "top 88%" },
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0A2540] overflow-hidden py-10 md:py-16 px-6 md:px-12 text-white">
      <div className="max-w-[1380px] mx-auto relative z-10">
        
        {/* ── TOP ROW: LEFT CONTENT + RIGHT CAN SHOWCASE ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 lg:gap-12 mb-8 md:mb-10">
          
          {/* LEFT COLUMN */}
          <div ref={leftColRef} className="lg:col-span-5 flex flex-col justify-center">
            {/* Tagline */}
            <p className="text-[#E5C05E] font-bold text-[13px] tracking-[.22em] uppercase mb-2">
              MORE THAN JUST A DRINK
            </p>

            {/* Underline */}
            <div className="w-12 h-[3px] bg-[#E5C05E] rounded-full mb-5" />

            {/* Heading */}
            <h2 className="font-fraunces font-black text-white text-[clamp(34px,4.2vw,56px)] leading-[1.08] mb-5">
              Refreshment <br />
              That <span className="text-[#E5C05E]">Elevates.</span>
            </h2>

            {/* Paragraph */}
            <p className="text-white/80 text-[15px] md:text-[16px] leading-[1.65] max-w-[420px] mb-7 font-medium">
              At Tangent, we believe what goes into your drink matters. That&apos;s why every can is crafted with care, so you can feel good with every sip.
            </p>

            {/* CTA Button */}
            <div>
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 bg-[#E5C05E] hover:bg-[#F5CE67] text-[#0A2540] font-bold text-[15px] px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-xl w-fit cursor-pointer"
              >
                <span>Discover Our Story</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* RIGHT COLUMN — ALL 4 CANS SHOWCASE */}
          <div ref={rightColRef} className="lg:col-span-7 relative flex justify-center lg:justify-end items-center">
            <div className="relative w-full max-w-[660px] h-[340px] sm:h-[420px] md:h-[460px]">
              <Image
                src="/all4can.png"
                alt="Tangent All 4 Cans Showcase"
                fill
                className="object-contain drop-shadow-[0_25px_60px_rgba(0,0,0,0.5)]"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>

        {/* ── BOTTOM FEATURES ROW ── */}
        <div ref={bottomRowRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6">
          {bottomFeatures.map((item) => (
            <div key={item.id} className="feature-item flex items-start gap-4 group">
              {/* Gold Circular Icon Badge */}
              <div className="w-14 h-14 rounded-full border-2 border-[#E5C05E]/70 flex items-center justify-center text-[#E5C05E] shrink-0 group-hover:scale-110 group-hover:bg-[#E5C05E]/10 transition-all duration-300">
                {item.icon}
              </div>

              {/* Text info */}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1.5 leading-none mb-2">
                  <span className="font-fraunces font-black text-[22px] text-[#E5C05E]">
                    {item.titleHighlight}
                  </span>
                  <span className="font-bold text-[14px] tracking-[.15em] uppercase text-white">
                    {item.titleText}
                  </span>
                </div>
                <p className="text-white/70 text-[13px] leading-[1.5] font-medium">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

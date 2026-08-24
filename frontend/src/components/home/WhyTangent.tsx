"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: "Natural Caffeine",
    desc: "From green tea & guarana. No synthetic buzz, just clean plant-powered energy.",
    stat: "80mg",
    statLabel: "per can",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    title: "L-Theanine",
    desc: "Amino acid that promotes calm focus. Smooth energy with zero jitters or crash.",
    stat: "100mg",
    statLabel: "per can",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: "Zero Sugar",
    desc: "Sweetened with stevia & monk fruit. Full flavor, zero guilt, zero sugar crash.",
    stat: "0g",
    statLabel: "sugar",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    title: "Vitamin Enriched",
    desc: "B3, B5, B6 and B12 to support metabolism and keep your mind firing on all cylinders.",
    stat: "4",
    statLabel: "B vitamins",
  },
];

export function WhyTangent() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const can = canRef.current;
    if (!section || !can) return;

    const ctx = gsap.context(() => {
      // Floating can animation
      gsap.to(can, {
        y: -16,
        duration: 3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Heading reveal
      if (headingRef.current) {
        gsap.from(headingRef.current, {
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
          },
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
        });
      }

      // Stagger card reveals
      const cards = cardsRef.current.filter(Boolean);
      gsap.from(cards, {
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
        },
        y: 60,
        opacity: 0,
        scale: 0.92,
        duration: 0.7,
        stagger: 0.15,
        ease: "back.out(1.4)",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-cream overflow-hidden py-20 md:py-28 px-6">
      {/* Subtle radial glow behind can */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Heading */}
      <div ref={headingRef} className="text-center mb-16 md:mb-20 relative z-10">
        <p className="text-[12px] font-bold tracking-[.2em] uppercase text-coral mb-3">
          What&apos;s Inside
        </p>
        <h2 className="font-fraunces font-black text-navy text-[clamp(32px,4.5vw,56px)] leading-[1.05] mb-4">
          Built Different.{" "}
          <span className="text-coral">By Design.</span>
        </h2>
        <p className="text-ink/60 text-[16px] max-w-[480px] mx-auto font-medium">
          Every can is packed with purpose. Here&apos;s the science behind the sharp.
        </p>
      </div>

      {/* Main grid: cards + central can */}
      <div className="relative max-w-[1200px] mx-auto">
        {/* Desktop: 2 left, can center, 2 right */}
        <div className="hidden lg:grid grid-cols-[1fr_280px_1fr] gap-8 items-center">

          {/* Left column */}
          <div className="flex flex-col gap-6">
            {benefits.slice(0, 2).map((b, i) => (
              <div
                key={b.title}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="group relative bg-white rounded-2xl p-6 border border-navy/8 shadow-[0_4px_24px_rgba(18,59,115,0.06)] hover:shadow-[0_8px_40px_rgba(18,59,115,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Stat badge */}
                <div className="absolute top-5 right-5 text-right">
                  <span className="font-fraunces font-black text-[28px] text-navy/15 leading-none block group-hover:text-coral/25 transition-colors">
                    {b.stat}
                  </span>
                  <span className="text-[10px] font-bold tracking-[.1em] uppercase text-navy/25 group-hover:text-coral/40 transition-colors">
                    {b.statLabel}
                  </span>
                </div>

                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue to-navy flex items-center justify-center text-cream mb-4 group-hover:scale-110 group-hover:shadow-[0_4px_16px_rgba(18,59,115,0.3)] transition-all">
                  {b.icon}
                </div>
                <h3 className="font-fraunces font-bold text-navy text-[19px] mb-2">
                  {b.title}
                </h3>
                <p className="text-ink/55 text-[14px] leading-[1.55] font-medium">
                  {b.desc}
                </p>

                {/* Bottom accent line that grows on hover */}
                <div className="absolute bottom-0 left-6 right-6 h-[3px] bg-coral/0 group-hover:bg-coral rounded-full transition-all duration-300 group-hover:left-4 group-hover:right-4" />
              </div>
            ))}
          </div>

          {/* Center can */}
          <div ref={canRef} className="flex justify-center items-center relative z-10">
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-[-20px] rounded-full bg-gradient-to-b from-sky/20 to-coral/10 blur-2xl pointer-events-none" />
              <Image
                src="/can1.png"
                alt="Tangent Watermelon Cranberry"
                width={220}
                height={560}
                className="relative z-10 drop-shadow-[0_20px_40px_rgba(18,59,115,0.25)]"
                unoptimized
              />
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {benefits.slice(2, 4).map((b, i) => (
              <div
                key={b.title}
                ref={(el) => { cardsRef.current[i + 2] = el; }}
                className="group relative bg-white rounded-2xl p-6 border border-navy/8 shadow-[0_4px_24px_rgba(18,59,115,0.06)] hover:shadow-[0_8px_40px_rgba(18,59,115,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Stat badge */}
                <div className="absolute top-5 right-5 text-right">
                  <span className="font-fraunces font-black text-[28px] text-navy/15 leading-none block group-hover:text-coral/25 transition-colors">
                    {b.stat}
                  </span>
                  <span className="text-[10px] font-bold tracking-[.1em] uppercase text-navy/25 group-hover:text-coral/40 transition-colors">
                    {b.statLabel}
                  </span>
                </div>

                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue to-navy flex items-center justify-center text-cream mb-4 group-hover:scale-110 group-hover:shadow-[0_4px_16px_rgba(18,59,115,0.3)] transition-all">
                  {b.icon}
                </div>
                <h3 className="font-fraunces font-bold text-navy text-[19px] mb-2">
                  {b.title}
                </h3>
                <p className="text-ink/55 text-[14px] leading-[1.55] font-medium">
                  {b.desc}
                </p>

                <div className="absolute bottom-0 left-6 right-6 h-[3px] bg-coral/0 group-hover:bg-coral rounded-full transition-all duration-300 group-hover:left-4 group-hover:right-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: can on top + stacked cards */}
        <div className="lg:hidden flex flex-col items-center gap-8">
          <div ref={canRef} className="relative">
            <div className="absolute inset-[-20px] rounded-full bg-gradient-to-b from-sky/20 to-coral/10 blur-2xl pointer-events-none" />
            <Image
              src="/can1.png"
              alt="Tangent Watermelon Cranberry"
              width={160}
              height={420}
              className="relative z-10 drop-shadow-[0_16px_32px_rgba(18,59,115,0.2)]"
              unoptimized
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[560px]">
            {benefits.map((b, i) => (
              <div
                key={b.title}
                ref={(el) => { cardsRef.current[i] = el; }}
                className="group relative bg-white rounded-2xl p-5 border border-navy/8 shadow-[0_4px_24px_rgba(18,59,115,0.06)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue to-navy flex items-center justify-center text-cream shrink-0">
                    <div className="scale-[0.8]">{b.icon}</div>
                  </div>
                  <h3 className="font-fraunces font-bold text-navy text-[16px]">
                    {b.title}
                  </h3>
                </div>
                <p className="text-ink/55 text-[13px] leading-[1.5] font-medium">
                  {b.desc}
                </p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="font-fraunces font-black text-[22px] text-coral/40">{b.stat}</span>
                  <span className="text-[10px] font-bold tracking-[.1em] uppercase text-navy/30">{b.statLabel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

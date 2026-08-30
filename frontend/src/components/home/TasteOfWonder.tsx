"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const pastelCards = [
  {
    id: 1,
    title: "100% Natural",
    desc: "Made with real fruit extracts and natural botanicals.",
    bg: "bg-[#EEF3E6]",
    accent: "bg-[#4A6038]",
    iconColor: "text-[#4A6038]",
    cornerImage: "/gingerfruit.png",
    cornerPos: "bottom-1 left-1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c4.418 0 8-3.582 8-8 0-4.418-5.5-9-8-11-2.5 2-8 6.582-8 11 0 4.418 3.582 8 8 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Zero Sugar",
    desc: "No added sugar. No guilt. Just pure refreshment.",
    bg: "bg-[#FDF0EC]",
    accent: "bg-[#E55347]",
    iconColor: "text-[#E55347]",
    cornerImage: "/watermelonfruit.png",
    cornerPos: "bottom-1 left-1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Plant Energy",
    desc: "Clean caffeine with L-theanine for a calm, sustained lift.",
    bg: "bg-[#EBF5F8]",
    accent: "bg-[#3B82F6]",
    iconColor: "text-[#3B82F6]",
    cornerImage: "/can3fruit.png",
    cornerPos: "bottom-1 left-1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Guilt-Free",
    desc: "Naturally sweetened with monk fruit & stevia.",
    bg: "bg-[#FDF9E7]",
    accent: "bg-[#EAB308]",
    iconColor: "text-[#EAB308]",
    cornerImage: "/can3fruit.png",
    cornerPos: "bottom-1 right-1",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.6} stroke="currentColor" className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75c-4.97 0-9-3.92-9-8.75 0-4.8 5.76-10.9 8.28-13.4a1 1 0 011.44 0C15.24 2.1 21 8.2 21 13c0 4.83-4.03 8.75-9 8.75z" />
      </svg>
    ),
  },
];

export function TasteOfWonder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftCanRef = useRef<HTMLDivElement>(null);
  const rightCanRef = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Left can entrance
      if (leftCanRef.current) {
        gsap.fromTo(
          leftCanRef.current,
          { x: -60, opacity: 0, scale: 0.95 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          }
        );
      }

      // Right can entrance
      if (rightCanRef.current) {
        gsap.fromTo(
          rightCanRef.current,
          { x: 60, opacity: 0, scale: 0.95 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          }
        );
      }

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

      // Cards entrance
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".pastel-card");
        gsap.fromTo(
          cards,
          { y: 45, opacity: 0, scale: 0.96 },
          {
            scrollTrigger: { trigger: cardsRef.current, start: "top 88%" },
            y: 0,
            opacity: 1,
            scale: 1,
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
    <section ref={sectionRef} className="relative bg-cream overflow-hidden py-16 md:py-24 px-6 md:px-12">
      
      {/* ── TOP SECTION: LEFT CAN + CENTER TEXT + RIGHT CAN ── */}
      <div className="max-w-[1380px] mx-auto relative min-h-[460px] md:min-h-[500px] flex items-center justify-center mb-16 md:mb-20">
        
        {/* LEFT CAN SHOWCASE */}
        <div
          ref={leftCanRef}
          className="absolute left-[-80px] lg:left-[-40px] xl:left-[-10px] top-1/2 -translate-y-1/2 w-[300px] md:w-[380px] lg:w-[440px] h-[360px] md:h-[460px] z-10 pointer-events-none hidden md:block"
        >
          <Image
            src="/leftcansection.png"
            alt="Tangent Ginger Ale Refreshment"
            fill
            className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
            priority
            unoptimized
          />
        </div>

        {/* CENTER CONTENT */}
        <div ref={centerTextRef} className="relative z-20 text-center max-w-[540px] mx-auto px-4 py-4">
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

        {/* RIGHT CAN SHOWCASE */}
        <div
          ref={rightCanRef}
          className="absolute right-[-80px] lg:right-[-40px] xl:right-[-10px] top-1/2 -translate-y-1/2 w-[300px] md:w-[380px] lg:w-[440px] h-[360px] md:h-[460px] z-10 pointer-events-none hidden md:block"
        >
          <Image
            src="/rightcansection.png"
            alt="Tangent Tonic Water Refreshment"
            fill
            className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]"
            priority
            unoptimized
          />
        </div>

      </div>

      {/* ── BOTTOM SECTION: 4 PASTEL FEATURE CARDS ── */}
      <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1340px] mx-auto relative z-20">
        {pastelCards.map((card) => (
          <div
            key={card.id}
            className={`pastel-card relative ${card.bg} rounded-[24px] p-8 md:p-10 text-center flex flex-col items-center justify-between min-h-[300px] border border-black/5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 overflow-hidden group cursor-pointer`}
          >
            {/* Top White Circular Icon Badge */}
            <div className={`w-14 h-14 rounded-full bg-white shadow-[0_4px_16px_rgba(0,0,0,0.06)] flex items-center justify-center mb-6 ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}>
              {card.icon}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col items-center">
              <h3 className="font-fraunces font-bold text-navy text-[22px] mb-2">
                {card.title}
              </h3>
              
              <div className={`w-8 h-[2.5px] ${card.accent} rounded-full mb-4`} />
              
              <p className="text-ink/70 text-[13.5px] leading-[1.5] font-medium max-w-[220px]">
                {card.desc}
              </p>
            </div>

            {/* Bottom Corner Fruit Decoration */}
            <div className={`absolute ${card.cornerPos} w-16 h-16 pointer-events-none opacity-80 group-hover:scale-110 transition-transform duration-500`}>
              <Image
                src={card.cornerImage}
                alt=""
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
}



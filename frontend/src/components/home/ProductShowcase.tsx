"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    bgSrc: "/can1bg.png",
    nameA: "Citrus",
    nameB: "Surge",
    flavor: "Zesty Citrus Blast",
    desc: "Bright and bold. A rush of citrus energy that cuts through the fog and keeps you sharp all day long.",
    tag: "Best Seller",
  },
  {
    id: 2,
    bgSrc: "/can2bg.png",
    nameA: "Berry",
    nameB: "Focus",
    flavor: "Wild Mixed Berry",
    desc: "Sweet meets sharp. Packed with antioxidants and natural caffeine for a clean, lasting lift.",
    tag: "Fan Favourite",
  },
  {
    id: 3,
    bgSrc: "/can3bg.png",
    nameA: "Tropical",
    nameB: "Rush",
    flavor: "Mango Pineapple",
    desc: "A sun-soaked escape in a can. Tropical flavours with the focus you need to own the day.",
    tag: "New Flavour",
  },
  {
    id: 4,
    bgSrc: "/can4bg.png",
    nameA: "Midnight",
    nameB: "Mint",
    flavor: "Cool Spearmint",
    desc: "Crisp, cool, and completely focused. The night-shift can that keeps your edge sharp.",
    tag: "Limited Edition",
  },
];

const features = [
  {
    label: "Zero Sugar",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Low Calories",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-10h-1M4.34 12h-1m15.07-6.07-.7.7M6.34 17.66l-.7.7m12.02 0-.7-.7M6.34 6.34l-.7-.7" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  {
    label: "Guilt Free",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
];

export function ProductShowcase() {
  const outerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);

  useEffect(() => {
    const outer = outerRef.current;
    const sticky = stickyRef.current;
    const slides = slidesRef.current;
    if (!outer || !sticky || !slides) return;

    const ctx = gsap.context(() => {
      const allSlides = slides.querySelectorAll<HTMLElement>(".slide");
      const count = allSlides.length;
      const vw = window.innerWidth;
      const scrollPerSlide = window.innerHeight * 6;
      const totalScroll = scrollPerSlide * (count - 1);

      gsap.set(allSlides, { x: (i: number) => i === 0 ? 0 : vw });

      ScrollTrigger.create({
        trigger: outer,
        start: "top top",
        end: () => `+=${totalScroll}`,
        scrub: 5,
        pin: sticky,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate(self) {
          const prog = self.progress;
          const floatIdx = prog * (count - 1);
          const currentIdx = Math.floor(Math.min(floatIdx, count - 1));
          const localProg = floatIdx - currentIdx;

          allSlides.forEach((slide, i) => {
            if (i < currentIdx) {
              gsap.set(slide, { x: -vw });
            } else if (i === currentIdx) {
              gsap.set(slide, { x: -localProg * vw });
            } else {
              gsap.set(slide, { x: (i - currentIdx - localProg) * vw });
            }
          });

          const newIdx = Math.round(prog * (count - 1));
          if (newIdx !== activeRef.current) {
            activeRef.current = newIdx;
            document.querySelectorAll<HTMLElement>(".pdot").forEach((d, i) => {
              d.style.opacity = i === newIdx ? "1" : "0.3";
              d.style.transform = i === newIdx ? "scale(1.6)" : "scale(1)";
            });
          }
        },
      });
    }, outer);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={outerRef} style={{ height: `${products.length * 600}vh` }} className="relative">
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden bg-cream">

        {/* Slides */}
        <div ref={slidesRef} className="relative w-full h-full">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="slide absolute inset-0 w-full h-full"
              style={{ willChange: "transform" }}
            >
              {/* ── FULL BLEED IMAGE — cover fills screen, image has its own left cream area ── */}
              <Image
                src={product.bgSrc}
                alt={`${product.nameA} ${product.nameB}`}
                fill
                className="object-cover object-top"
                priority={i === 0}
                sizes="100vw"
                unoptimized
              />

              {/* ── Subtle gradient just to ensure text stays readable ── */}
              <div className="absolute inset-0 bg-gradient-to-r from-cream/40 via-transparent to-transparent z-10" />

              {/* ── TEXT CONTENT ── */}
              <div
                className="absolute left-0 top-0 h-full z-20 flex flex-col justify-center px-12 md:px-16"
                style={{ width: "42vw" }}
              >
                {/* Tag */}
                <div className="inline-flex self-start items-center gap-1.5 bg-sand text-navy text-[11px] font-bold tracking-[.12em] uppercase px-3 py-1.5 rounded-full mb-5">
                  <span>⭐</span>
                  <span>{product.tag}</span>
                </div>

                {/* Name — two-line two-color */}
                <div className="mb-3">
                  <h2
                    className="font-fraunces font-black text-navy leading-[1.0] block"
                    style={{ fontSize: "clamp(50px, 6.5vw, 92px)" }}
                  >
                    {product.nameA}
                  </h2>
                  <h2
                    className="font-fraunces font-black text-coral leading-[1.0] block"
                    style={{ fontSize: "clamp(50px, 6.5vw, 92px)" }}
                  >
                    {product.nameB}
                  </h2>
                </div>

                {/* Divider */}
                <div className="w-10 h-[3px] bg-coral rounded-full mb-4" />

                {/* Flavor */}
                <p className="text-[12px] font-bold tracking-[.16em] uppercase text-navy/60 mb-3">
                  {product.flavor}
                </p>

                {/* Description */}
                <p className="text-[15px] text-ink/75 leading-[1.7] max-w-[340px] mb-7">
                  {product.desc}
                </p>

                {/* CTA row */}
                <div className="flex items-center gap-5 mb-10">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2.5 bg-navy text-cream font-bold text-[14px] px-6 py-3 rounded-full hover:bg-blue transition-all duration-200 hover:scale-105"
                  >
                    Shop Now
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <span className="text-[13px] text-navy/50 font-semibold">{i + 1} / {products.length}</span>
                </div>

                {/* Feature icons */}
                <div className="flex items-center gap-6">
                  {features.map((f) => (
                    <div key={f.label} className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full border-2 border-navy/30 bg-cream/60 flex items-center justify-center text-navy/70">
                        {f.icon}
                      </div>
                      <span className="text-[10px] font-bold tracking-[.14em] uppercase text-navy/60 text-center">
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-[23vw] flex gap-2.5 z-30">
          {products.map((_, i) => (
            <div
              key={i}
              className="pdot w-2 h-2 rounded-full bg-navy transition-all duration-300"
              style={{ opacity: i === 0 ? 1 : 0.3, transform: i === 0 ? "scale(1.6)" : "scale(1)" }}
            />
          ))}
        </div>

        {/* Scroll to explore */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-30">
          <svg className="w-5 h-5 text-navy/40 animate-bounce" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          <span className="text-[10px] font-bold tracking-[.2em] uppercase text-navy/35">Scroll to Explore</span>
        </div>
      </div>
    </div>
  );
}

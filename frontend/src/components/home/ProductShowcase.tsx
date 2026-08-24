"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

const products = [
  {
    id: 1,
    bgSrc: "/can1bg.png",
    mobileBgSrc: "/mobilecan1.png",
    nameA: "Citrus",
    nameB: "Surge",
    flavor: "Zesty Citrus Blast",
    desc: "Bright and bold. A rush of citrus energy that cuts through the fog and keeps you sharp all day long.",
    tag: "Best Seller",
  },
  {
    id: 2,
    bgSrc: "/can2bg.png",
    mobileBgSrc: "/mobilecan2.png",
    nameA: "Berry",
    nameB: "Focus",
    flavor: "Wild Mixed Berry",
    desc: "Sweet meets sharp. Packed with antioxidants and natural caffeine for a clean, lasting lift.",
    tag: "Fan Favourite",
  },
  {
    id: 3,
    bgSrc: "/can3bg.png",
    mobileBgSrc: "/mobilecan3.png",
    nameA: "Tropical",
    nameB: "Rush",
    flavor: "Mango Pineapple",
    desc: "A sun-soaked escape in a can. Tropical flavours with the focus you need to own the day.",
    tag: "New Flavour",
  },
  {
    id: 4,
    bgSrc: "/can4bg.png",
    mobileBgSrc: "/mobilecan4.png",
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

// ─────────────────────────────────────────────
// MOBILE: Embla swipe carousel
// ─────────────────────────────────────────────
function MobileProductCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });
  const [activeIdx, setActiveIdx] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIdx(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    return () => { emblaApi.off("select", onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full bg-cream" style={{ height: "100svh" }}>
      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden w-full h-full">
        <div className="flex h-full">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative flex-[0_0_100%] min-w-0 h-full overflow-hidden"
            >
              {/* Background image */}
              <Image
                src={product.mobileBgSrc}
                alt={`${product.nameA} ${product.nameB}`}
                fill
                className="object-cover object-top"
                sizes="100vw"
                unoptimized
              />

              {/* Gradient overlay — top cream fade for text */}
              <div className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, rgba(249,246,238,0.92) 0%, rgba(249,246,238,0.7) 45%, transparent 65%)"
                }}
              />

              {/* Text content — top aligned */}
              <div className="absolute inset-x-0 top-0 z-20 px-6 pt-[13vh]">
                {/* Name */}
                <div className="mb-2">
                  <h2
                    className="font-fraunces font-black text-navy leading-[1.0] drop-shadow-sm"
                    style={{ fontSize: "clamp(44px, 12vw, 72px)" }}
                  >
                    {product.nameA}
                  </h2>
                  <h2
                    className="font-fraunces font-black text-coral leading-[1.0] drop-shadow-sm"
                    style={{ fontSize: "clamp(44px, 12vw, 72px)" }}
                  >
                    {product.nameB}
                  </h2>
                </div>

                {/* Divider */}
                <div className="w-10 h-[3px] bg-coral rounded-full mb-3" />

                {/* Flavor */}
                <p className="text-[11px] font-bold tracking-[.16em] uppercase text-navy/70 mb-2">
                  {product.flavor}
                </p>

                {/* Description */}
                <p className="text-[13px] text-ink/80 leading-[1.5] max-w-[300px] mb-4 font-medium">
                  {product.desc}
                </p>

                {/* CTA */}
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 bg-navy text-cream font-bold text-[13px] px-5 py-2.5 rounded-full"
                >
                  Shop Now
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress dots — bottom center */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2.5 z-30">
        {products.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className="pdot w-2 h-2 rounded-full bg-navy transition-all duration-300"
            style={{
              opacity: i === activeIdx ? 1 : 0.3,
              transform: i === activeIdx ? "scale(1.6)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* Swipe hint */}
      <div className="absolute bottom-6 right-6 z-30 flex items-center gap-1 text-navy/40">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
        </svg>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// DESKTOP: GSAP scroll-jacking (unchanged)
// ─────────────────────────────────────────────
function DesktopProductShowcase() {
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
    <div ref={outerRef} className="relative">
      <div ref={stickyRef} className="h-screen w-full overflow-hidden bg-cream">

        {/* Slides */}
        <div ref={slidesRef} className="relative w-full h-full">
          {products.map((product, i) => (
            <div
              key={product.id}
              className="slide absolute inset-0 w-full h-full overflow-hidden"
              style={{ willChange: "transform" }}
            >
              {/* Desktop image */}
              <Image
                src={product.bgSrc}
                alt={`${product.nameA} ${product.nameB}`}
                fill
                className="object-cover object-top"
                priority={i === 0}
                sizes="100vw"
                unoptimized
              />

              {/* Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-cream/40 via-transparent to-transparent z-10 pointer-events-none" />

              {/* Text content */}
              <div className="absolute left-[8vw] top-0 h-full z-20 flex flex-col justify-center pr-4 pt-[4vh]" style={{ width: "45vw" }}>

                {/* Name */}
                <div className="mb-4">
                  <h2
                    className="font-fraunces font-black text-navy leading-[1.0] block hover:scale-[1.03] transition-transform origin-left cursor-pointer drop-shadow-sm"
                    style={{ fontSize: "clamp(48px, 6.5vw, 90px)" }}
                  >
                    {product.nameA}
                  </h2>
                  <h2
                    className="font-fraunces font-black text-coral leading-[1.0] block hover:scale-[1.03] transition-transform origin-left cursor-pointer drop-shadow-sm"
                    style={{ fontSize: "clamp(48px, 6.5vw, 90px)" }}
                  >
                    {product.nameB}
                  </h2>
                </div>

                {/* Divider */}
                <div className="w-12 h-[4px] bg-coral rounded-full mb-5" />

                {/* Flavor */}
                <p className="text-[13px] font-bold tracking-[.16em] uppercase text-navy/70 mb-4">
                  {product.flavor}
                </p>

                {/* Description */}
                <p className="text-[16px] text-ink/80 leading-[1.6] max-w-[380px] mb-6 font-medium">
                  {product.desc}
                </p>

                {/* CTA row */}
                <div className="flex items-center gap-6 mb-8">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-3 bg-navy text-cream font-bold text-[15px] px-8 py-3.5 rounded-full hover:bg-blue transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    Shop Now
                    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </Link>
                  <span className="text-[14px] text-navy/50 font-semibold">{i + 1} / {products.length}</span>
                </div>

                {/* Feature icons */}
                <div className="flex items-center gap-8">
                  {features.map((f) => (
                    <div key={f.label} className="flex flex-col items-center gap-3 group">
                      <div className="w-12 h-12 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-navy group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all cursor-pointer">
                        {f.icon}
                      </div>
                      <span className="text-[11px] font-bold tracking-[.15em] uppercase text-navy/80 text-center group-hover:text-navy transition-colors">
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

// ─────────────────────────────────────────────
// ROOT: pick the right version per device
// ─────────────────────────────────────────────
export function ProductShowcase() {
  const isMobile = useIsMobile();

  // Avoid flash of wrong version during SSR hydration
  if (isMobile === undefined) return null;

  return isMobile ? <MobileProductCarousel /> : <DesktopProductShowcase />;
}

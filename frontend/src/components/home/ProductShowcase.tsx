"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

const products = [
  {
    id: 1,
    bgSrc: "/can1bg.png",
    mobileBgSrc: "/mobilecan1.png",
    nameA: "Watermelon",
    nameB: "Cranberry",
    flavor: "Watermelon Cranberry",
    desc: "Carbonated water-based flavoured drink. Enriched with Vitamin B12, B6, B1. Zero caffeine, zero crash.",
    tag: "Best Seller",
  },
  {
    id: 2,
    bgSrc: "/can2bg.png",
    mobileBgSrc: "/mobilecan2.png",
    nameA: "Watermelon",
    nameB: "Mint",
    flavor: "Watermelon Mint",
    desc: "Carbonated water-based flavoured drink. Enriched with Vitamin B12, B6, B1. Zero caffeine, zero crash.",
    tag: "Fan Favourite",
  },
  {
    id: 3,
    bgSrc: "/can3bg.png",
    mobileBgSrc: "/mobilecan3.png",
    nameA: "Guava",
    nameB: "Chilli",
    flavor: "Guava Chilli",
    desc: "Carbonated water-based flavoured drink. Enriched with Vitamin B12, B6, B1. Zero caffeine, zero crash.",
    tag: "New Flavour",
  },
  {
    id: 4,
    bgSrc: "/can4bg.png",
    mobileBgSrc: "/mobilecan4.png",
    nameA: "Yuzu",
    nameB: "Mint",
    flavor: "Yuzu Mint",
    desc: "Carbonated water-based flavoured drink. Enriched with Vitamin B12, B6, B1. Zero caffeine, zero crash.",
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
              />

              {/* Gradient overlay — top cream fade for text */}
              <div className="absolute inset-0 z-10 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, rgba(249,246,238,0.45) 0%, rgba(249,246,238,0.15) 35%, transparent 55%)"
                }}
              />

              {/* Text content — top aligned */}
              <div className="absolute inset-x-0 top-0 z-20 px-6 pt-[8vh]">
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
// DESKTOP: Redwood-style Stacking Cards Animation
// ─────────────────────────────────────────────
interface ProductCardProps {
  i: number;
  product: (typeof products)[0];
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

function ProductCard({ i, product, progress, range, targetScale }: ProductCardProps) {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="h-screen flex items-center justify-center sticky top-12 md:top-16 px-4 md:px-8"
    >
      <motion.div
        style={{
          scale,
          top: `calc(0px + ${i * 24}px)`,
        }}
        className="relative w-full max-w-[1280px] h-[540px] md:h-[580px] rounded-3xl overflow-hidden shadow-2xl origin-top border border-black/10 bg-cream"
      >
        {/* Desktop image */}
        <Image
          src={product.bgSrc}
          alt={`${product.nameA} ${product.nameB}`}
          fill
          className="object-cover object-top"
          priority={i === 0}
          sizes="100vw"
        />

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream/40 via-transparent to-transparent z-10 pointer-events-none" />

        {/* Text content */}
        <div className="absolute left-[5vw] md:left-[6vw] top-0 h-full z-20 flex flex-col justify-center pr-4 pt-[1vh]" style={{ width: "45vw" }}>

          {/* Name */}
          <div className="mb-3">
            <h2
              className="font-fraunces font-black text-navy leading-[1.0] block hover:scale-[1.03] transition-transform origin-left cursor-pointer drop-shadow-sm"
              style={{ fontSize: "clamp(38px, 5vw, 72px)" }}
            >
              {product.nameA}
            </h2>
            <h2
              className="font-fraunces font-black text-coral leading-[1.0] block hover:scale-[1.03] transition-transform origin-left cursor-pointer drop-shadow-sm"
              style={{ fontSize: "clamp(38px, 5vw, 72px)" }}
            >
              {product.nameB}
            </h2>
          </div>

          {/* Divider */}
          <div className="w-10 h-[3px] bg-coral rounded-full mb-3" />

          {/* Flavor */}
          <p className="text-[12px] font-bold tracking-[.16em] uppercase text-navy/70 mb-3">
            {product.flavor}
          </p>

          {/* Description */}
          <p className="text-[14px] md:text-[15px] text-ink/80 leading-[1.5] max-w-[360px] mb-5 font-medium">
            {product.desc}
          </p>

          {/* CTA row */}
          <div className="flex items-center gap-6 mb-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-navy text-cream font-bold text-[14px] px-7 py-3 rounded-full hover:bg-blue transition-all duration-300 hover:scale-105 hover:shadow-md"
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
              <div key={f.label} className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-navy group-hover:scale-110 group-hover:bg-white group-hover:shadow-md transition-all cursor-pointer">
                  {f.icon}
                </div>
                <span className="text-[10px] font-bold tracking-[.15em] uppercase text-navy/80 text-center group-hover:text-navy transition-colors">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function DesktopProductShowcase() {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={container} className="relative w-full bg-cream">
      <div className="w-full pb-12 md:pb-16">
        {products.map((product, i) => {
          const targetScale = 1 - (products.length - i) * 0.05;
          return (
            <ProductCard
              key={product.id}
              i={i}
              product={product}
              progress={scrollYProgress}
              range={[i * (1 / products.length), 1]}
              targetScale={targetScale}
            />
          );
        })}
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

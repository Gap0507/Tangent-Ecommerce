"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { View } from "@react-three/drei";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Scene, Bubbles } from "./HeroComponents";
import { Leaf, Droplets, Zap, Check, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import localFont from 'next/font/local';

const alpino = localFont({
  src: "../../../public/fonts/Alpino-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-alpino",
});

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function HomeHero() {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [packPrice, setPackPrice] = useState(430);
  const [isOutOfStock, setIsOutOfStock] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          const sumPrices = resData.data.reduce((acc: number, item: any) => acc + (item.price || 0), 0);
          if (sumPrices > 0) {
            setPackPrice(sumPrices);
          }
          const hasOutOfStockFlavor = resData.data.some((item: any) => typeof item.stock === "number" && item.stock < 1);
          if (hasOutOfStockFlavor) {
            setIsOutOfStock(true);
          }
        }
      })
      .catch((err) => console.error("Failed to load inventory price for variety pack", err));
  }, []);

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart({
      productId: "variety-pack-4",
      name: "Tangent Variety Pack",
      size: "Pack of 4 (4 Cans: 1 x Watermelon Mint, 1 x Yuzu Mint, 1 x Watermelon Cranberry, 1 x Guava Chilli)",
      price: packPrice,
      quantity: 1,
      image: "/all4can.png",
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const introTl = gsap.timeline();
      introTl
        .from(".hero-container", { opacity: 0, duration: 0.2 })
        .from(".hero-header", { scale: 1.5, opacity: 0, ease: "power4.in", delay: 0.1, duration: 0.5 })
        .from(".hero-subheading", { opacity: 0, y: 30 }, "+=.2")
        .from(".hero-body", { opacity: 0, y: 10 })
        .from(".hero-button", { opacity: 0, y: 10, duration: 0.6, stagger: 0.1 });

      const scrollTl = gsap.timeline({
        scrollTrigger: { trigger: ".hero-container", start: "top top", end: "bottom bottom", scrub: 1.5 },
      });

      scrollTl
        .to(".section-2-bg", { opacity: 1, duration: 1 }, 1)
        .from(".text-side-heading", { y: 40, opacity: 0, ease: "back.out(3)", duration: 0.5 }, 2)
        .from(".text-side-body", { y: 20, opacity: 0 }, 2.3);
    });
  }, []);

  return (
    <div className={`page-wrapper min-h-screen w-full relative ${alpino.className}`} style={{ backgroundColor: "#1e3a8a" }}>
      <div className="section-2-bg absolute inset-0 z-[0] bg-[url('/all4bg.png')] bg-cover bg-center bg-no-repeat opacity-0 pointer-events-none" />




      {/* Container that drives the scroll height. */}
      <div className="hero-container relative">

        <View className="sticky top-0 z-[1] pointer-events-none h-screen w-screen">
          <Scene />
        </View>

        <div className="-mt-[100vh] relative z-10 pointer-events-none">
          {/* Section 1: Hero */}
          <section className="relative flex flex-col items-center h-[100dvh] pt-16 pb-4 md:grid md:place-items-center md:pt-20 md:pb-0 md:h-screen">
            <View className="absolute inset-0 z-0 pointer-events-none h-full w-full">
              <Bubbles count={150} speed={2} repeat={true} />
            </View>
            <div className="relative z-10 flex flex-col items-center text-center px-4 w-full h-full justify-end md:justify-center md:grid md:auto-rows-min md:place-items-center md:h-auto md:-mt-32">
              {/* Top Text Group */}
              <div className="flex flex-col items-center text-center pt-2 md:pt-0">
                <div className="hero-subheading text-xs md:text-sm font-bold tracking-[.14em] text-sand mb-2 md:mb-4 uppercase">
                  Meet Your New Daily Driver
                </div>

                <h1 className="hero-header font-fraunces font-black text-4xl sm:text-5xl md:text-5xl lg:text-6xl leading-[1.04] text-cream mb-2 md:mb-4">
                  Daily Vitamins.<br />Zero Crash.
                </h1>

                <div className="hero-body text-sm sm:text-lg max-w-md font-medium text-cream/85 mt-0.5 md:mt-4 px-4">
                  Tangent is a vitamin-infused functional drink that supports everyday energy, hydration, and wellness with zero sugar and great taste.
                </div>
              </div>

              {/* Bottom Button Group */}
              <div className="pb-1 mt-auto mb-36 md:pb-0 md:mt-8 md:mb-0 flex flex-col items-center">
                <Link
                  href="/shop"
                  className="hero-button bg-sand text-navy hover:bg-sand-deep text-lg sm:text-xl font-bold py-3.5 px-8 sm:py-4 sm:px-10 rounded-full transition-colors duration-300 pointer-events-auto shadow-xl flex items-center gap-2"
                >
                  <span>SHOP NOW</span>
                  <span className="text-xl">→</span>
                </Link>

                <div className="flex gap-2 mt-4 flex-wrap justify-center pointer-events-auto">
                  <div className="hero-button text-[12px] font-semibold tracking-[.03em] border border-cream/40 py-1.5 px-3.5 rounded-full text-cream/90">
                    Vitamin Infused
                  </div>
                  <div className="hero-button text-[12px] font-semibold tracking-[.03em] border border-cream/40 py-1.5 px-3.5 rounded-full text-cream/90">
                    Zero Sugar
                  </div>
                  <div className="hero-button text-[12px] font-semibold tracking-[.03em] border border-cream/40 py-1.5 px-3.5 rounded-full text-cream/90">
                    Vegan
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Four Flavors (Scroll Target) */}
          <section className="flex flex-col justify-end min-h-screen px-10 md:grid md:grid-cols-2 md:items-center md:gap-4 md:px-20 z-10 relative">
            {/* Spacer for 3D cans area on mobile */}
            <div className="h-[55vh] md:hidden" />
            <div className="pb-10 md:pb-0">
              <h2 className="text-5xl md:text-6xl font-black uppercase text-side-heading text-balance text-sky-950 lg:text-7xl mb-4 font-fraunces">
                Tangent<br /><span className="text-orange-600">Variety Pack</span>
              </h2>
              <div className="max-w-xl text-lg font-medium text-side-body text-balance text-sky-950 bg-[#eef3ce] p-6 rounded-3xl shadow-md border border-[#d5e0a6]">
                <p className="mb-6 leading-relaxed">
                  One can of each flavor Watermelon Mint, Watermelon Cranberry, Yuzu Mint &amp; Guava Chilli. The ultimate tasting experience.
                </p>

                {/* Perks */}
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-sky-950">100% Natural Ingredients</p>
                      <p className="text-xs text-sky-800">No artificial flavors or sweeteners</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Droplets className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-sky-950">Prebiotic &amp; Vitamin-Infused</p>
                      <p className="text-xs text-sky-800">B12, B6, B1 in every can</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-sky-950">Zero Sugar, Low Calorie</p>
                      <p className="text-xs text-sky-800">Zero caffeine, zero crash</p>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-end gap-3 mb-2">
                  <span className="font-fraunces font-black text-5xl text-orange-600 leading-none">₹{packPrice}</span>
                  <span className="text-sky-800 text-sm font-semibold pb-1">/pack of 4</span>
                </div>

                {/* Free Shipping pill */}
                <div className="flex items-center gap-2 text-sm text-sky-800 font-medium mb-6">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-sm" />
                  Free shipping on all orders
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock || isAdded}
                  className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2.5 transition-all shadow-xl pointer-events-auto ${isOutOfStock
                      ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                      : isAdded
                        ? "bg-emerald-500 text-white scale-[0.98]"
                        : "bg-orange-500 text-white hover:bg-orange-600 hover:scale-[1.02] cursor-pointer"
                    }`}
                >
                  {isOutOfStock ? (
                    <span>OUT OF STOCK</span>
                  ) : isAdded ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Buy Now — ₹{packPrice}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

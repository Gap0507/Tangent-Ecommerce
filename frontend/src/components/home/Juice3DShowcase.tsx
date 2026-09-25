"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Kaushan_Script, Poppins } from "next/font/google";
import gsap from "gsap";
import Can3DViewer from "./Can3DViewer";
import { IceCubes } from "./ice-cubes";
import AnimatedBackground from "./AnimatedBackground";

const script = Kaushan_Script({ weight: "400", subsets: ["latin"], display: "swap" });
const poppins = Poppins({ weight: ["400", "500", "600"], subsets: ["latin"], display: "swap" });

// Optimize loading of react-water-wave
const WaterWave = dynamic(() => import("react-water-wave"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] sm:h-[800px] overflow-hidden relative bg-[#82AF38]"></div>
  ),
});

const CANS = [
  {
    id: 1,
    name: "Watermelon Cranberry",
    image: "/can2.png",
    color: "#85C7D3",
    model: "/assets/3d/can/Tangent_Watermelon_Cranberry_v2_FINAL_4K.glb",
    rotation: [0, Math.PI / 1.85, 0],
    offset: [0, 0, 0] as [number, number, number],
  },
  {
    id: 2,
    name: "Watermelon Mint",
    image: "/can3.png",
    color: "#F28C8C",
    model: "/assets/3d/can/Tangent_Watermelon_Mint.glb",
    rotation: [0, Math.PI / 1.85, 0],
    offset: [0, 0, 0] as [number, number, number],
  },
  {
    id: 3,
    name: "Guava Chilli",
    image: "/can1.png",
    color: "#E8706B",
    model: "/assets/3d/can/Tangent_Guava_Chilli_FINAL_4K.glb",
    rotation: [0, Math.PI / 1.85, 0],
    offset: [0, 0, 0] as [number, number, number],
  },
  {
    id: 4,
    name: "Yuzu Mint",
    image: "/can4.png",
    color: "#F9D949",
    model: "/assets/3d/can/Tangent_Yuzu_Mint_FINAL_4K.glb",
    rotation: [0, Math.PI / 1.85, 0],
    offset: [0, 0, 0] as [number, number, number],
  },
];

/* Small SVG leaf used to decorate the paper note */
function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id="leafGrad" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#3f8f2f" />
          <stop offset="100%" stopColor="#a6dc4a" />
        </linearGradient>
      </defs>
      <path d="M6 58 C6 26 26 6 60 4 C58 38 38 58 6 58 Z" fill="url(#leafGrad)" />
      <path
        d="M8 56 C24 40 40 24 58 6"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  );
}

export function Juice3DShowcase() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wheelAngle, setWheelAngle] = useState(0);
  const wheelStateRef = useRef({ angle: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const activeCan = CANS[currentIndex];
  const [firstWord, ...otherWords] = activeCan.name.split(" ");
  const restOfName = otherWords.join(" ");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Rotate clockwise, bringing the can from bottom-left to top
    const nextIndex = (currentIndex - 1 + CANS.length) % CANS.length;
    setCurrentIndex(nextIndex);

    const targetAngle = wheelStateRef.current.angle + 90;
    gsap.to(wheelStateRef.current, {
      angle: targetAngle,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        setWheelAngle(wheelStateRef.current.angle);
      },
      onComplete: () => setIsAnimating(false),
    });
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // Rotate counter-clockwise, bringing can from bottom-right to top
    const prevIndex = (currentIndex + 1) % CANS.length;
    setCurrentIndex(prevIndex);

    const targetAngle = wheelStateRef.current.angle - 90;
    gsap.to(wheelStateRef.current, {
      angle: targetAngle,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        setWheelAngle(wheelStateRef.current.angle);
      },
      onComplete: () => setIsAnimating(false),
    });
  };

  const radius = isMobile ? 1000 : 1200;

  return (
    <section className="relative w-full h-[550px] sm:h-[calc(100vh-80px)] sm:min-h-[600px] sm:max-h-[750px] overflow-hidden">
      <div className="absolute inset-y-0 left-0 right-0 max-w-[1440px] mx-auto w-full h-full pointer-events-none z-10">
        <IceCubes
          containerWidth={isMobile ? 320 : 1220}
          cubeCount={isMobile ? 4 : 8}
          leafCount={isMobile ? 6 : 12}
        />
      </div>
      <WaterWave
        dropRadius={isMobile ? 8 : 10}
        perturbance={isMobile ? 0.006 : 0.01}
        imageUrl="/assets/images/drop.png"
        resolution={isMobile ? 256 : 512}
        style={{ width: "100%", height: "100%" }}
      >
        {() => (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Blurred background overlay similar to juicy */}
            <div
              className="absolute top-0 left-0 w-full h-full z-[0] bg-black/5"
              style={{ backdropFilter: "blur(0px)" }}
            />

            {/* GSAP Animated Background */}
            <AnimatedBackground backgroundColor={activeCan.color} />

            {/* 3D GLB Models on Circular Arc Path */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
              {CANS.map((can, i) => {
                const baseAngle = i * 90;
                const rawAngle = baseAngle + wheelAngle;
                const rad = (rawAngle * Math.PI) / 180;

                // Normalize angle between -180 and 180 degrees
                const normDeg = ((rawAngle % 360) + 540) % 360 - 180;

                // Only instantiate WebGL canvas for cans visible on arc (-110 deg to +110 deg)
                const isVisible = Math.abs(normDeg) <= 110;
                if (!isVisible) return null;

                // Trigonometric arc coordinates
                const x = radius * Math.sin(rad);
                const y = radius * (1 - Math.cos(rad)) - (isMobile ? 60 : 0);

                return (
                  <div
                    key={can.id}
                    className="absolute w-[300px] sm:w-[420px] h-[480px] sm:h-[680px] pointer-events-auto"
                    style={{
                      transform: `translate3d(${x}px, ${y}px, 0px)`,
                    }}
                  >
                    <Can3DViewer
                      modelPath={can.model}
                      isMobile={isMobile}
                      rotation={can.rotation}
                      positionOffset={can.offset}
                    />
                  </div>
                );
              })}
            </div>

            {/* Active Flavor Details - torn wet paper note */}
            <div
              key={activeCan.id}
              className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:bottom-20 sm:left-28 lg:left-44 z-30 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-700"
            >
              <div className="paper-wrap">
                <div
                  className={`paper-note w-[210px] sm:w-[330px] px-4 pt-4 pb-4 sm:px-8 sm:pt-9 sm:pb-9 ${poppins.className}`}
                >
                  <span className="block text-[7px] sm:text-[11px] uppercase tracking-[0.25em] sm:tracking-[0.3em] font-semibold text-[#2a6f80]">
                    Featured Flavor
                  </span>

                  <h2
                    className={`${script.className} mt-0.5 sm:mt-1 leading-[0.95] text-[22px] sm:text-[44px]`}
                  >
                    <span className="block text-[#1f7a8c]">{firstWord}</span>
                    {restOfName && (
                      <span
                        className="block ml-3 sm:ml-5 -rotate-2 origin-left"
                        style={{ color: activeCan.color }}
                      >
                        {restOfName}
                      </span>
                    )}
                  </h2>

                  <p className="mt-1 sm:mt-2.5 text-[8px] sm:text-[12px] leading-relaxed text-slate-700 max-w-[170px] sm:max-w-[260px]">
                    Zero added sugar. Crisp, sparkling infusion crafted with 100% natural
                    ingredients.
                  </p>

                  <div className="mt-1.5 sm:mt-4 flex items-center justify-between gap-2 sm:gap-3">
                    <button className="paper-btn relative inline-flex items-center gap-1.5 sm:gap-2 rounded-full px-3 py-1.5 sm:px-6 sm:py-2.5 text-white text-[10px] sm:text-sm font-semibold cursor-pointer group">
                      <span>Shop Now</span>
                      <ChevronRight
                        size={16}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                      <span className="paper-drop w-2.5 h-2.5 top-1 left-5" aria-hidden />
                      <span className="paper-drop w-2 h-2 bottom-1 right-8" aria-hidden />
                    </button>

                    {/* Navigation Buttons inside paper card */}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={handlePrev}
                        className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-[#1b6b7d] hover:bg-[#155665] flex items-center justify-center text-white transition-all shadow-md active:scale-95 cursor-pointer"
                        aria-label="Previous Flavor"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      <button
                        onClick={handleNext}
                        className="w-6 h-6 sm:w-9 sm:h-9 rounded-full bg-[#1b6b7d] hover:bg-[#155665] flex items-center justify-center text-white transition-all shadow-md active:scale-95 cursor-pointer"
                        aria-label="Next Flavor"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>

                  {/* droplets sitting on the paper */}
                  <span className="paper-drop w-4 h-4 sm:w-5 sm:h-5 top-[62%] right-6" aria-hidden />
                  <span className="paper-drop w-2.5 h-2.5 top-[18%] right-10" aria-hidden />
                  <span className="paper-drop w-2 h-2 bottom-8 left-8" aria-hidden />
                </div>

                {/* leaves sit outside the torn shape so they overlap its edge */}
                <Leaf className="absolute -top-4 left-3 w-10 sm:w-14 rotate-[25deg] drop-shadow-md" />
                <Leaf className="absolute -bottom-5 left-0 w-9 sm:w-12 -rotate-[35deg] drop-shadow-md" />
                <Leaf className="absolute top-[45%] -left-4 w-6 sm:w-8 rotate-[70deg] drop-shadow-md" />
                <span className="paper-drop w-5 h-5 sm:w-6 sm:h-6 bottom-6 -right-2" aria-hidden />
              </div>
            </div>
          </div>
        )}
      </WaterWave>
    </section>
  );
}
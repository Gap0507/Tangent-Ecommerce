"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import Can3DViewer from "./Can3DViewer";
import { IceCubes } from "./ice-cubes";
import AnimatedBackground from "./AnimatedBackground";

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
    rotation: [0, Math.PI / 3, 0],
  },
  {
    id: 2,
    name: "Watermelon Mint",
    image: "/can3.png",
    color: "#F28C8C",
    model: "/assets/3d/can/Tangent_Watermelon_Mint.glb",
    rotation: [0, Math.PI / 3, 0],
  },
  {
    id: 3,
    name: "Guava Chilli",
    image: "/can1.png",
    color: "#E8706B",
    model: "/assets/3d/can/Tangent_Guava_Chilli_FINAL_4K.glb",
    rotation: [0, Math.PI / 3, 0],
  },
  {
    id: 4,
    name: "Yuzu Mint",
    image: "/can4.png",
    color: "#F9D949",
    model: "/assets/3d/can/Tangent_Yuzu_Mint_FINAL_4K.glb",
    rotation: [0, Math.PI / 3, 0],
  },
];

export function Juice3DShowcase() {
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wheelAngle, setWheelAngle] = useState(0);
  const wheelStateRef = useRef({ angle: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const activeCan = CANS[currentIndex];

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
      onComplete: () => setIsAnimating(false)
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
      onComplete: () => setIsAnimating(false)
    });
  };

  const radius = isMobile ? 1000 : 1400;

  return (
    <section className="relative w-full h-[600px] sm:h-[800px] overflow-hidden">
      <div className="absolute inset-y-0 left-0 right-0 max-w-[1440px] mx-auto w-full h-full pointer-events-none z-10">
        <IceCubes containerWidth={isMobile ? 320 : 1220} cubeCount={isMobile ? 4 : 8} leafCount={isMobile ? 6 : 12} />
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

            {/* Background text */}
            <div className="absolute z-[0] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none text-center px-1">
              <h1
                className="text-[#F2F2F2] uppercase select-none leading-none inline-block opacity-40 mix-blend-overlay max-w-full"
                style={{
                  fontFamily: "var(--font-thunder)",
                  fontSize: isMobile ? "clamp(5.8rem, 23.5vw, 14rem)" : "clamp(8rem, 10rem + 12vw, 26rem)",
                  letterSpacing: "0.02em"
                }}
              >
                TANGENT
              </h1>
            </div>

            {/* 3D GLB Models on Circular Arc Path (Zero CSS rotation to prevent WebGL GPU clipping) */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
              {CANS.map((can, i) => {
                const baseAngle = i * 90;
                const currentAngleDeg = baseAngle + wheelAngle;
                const rad = (currentAngleDeg * Math.PI) / 180;

                // Trigonometric arc coordinates
                const x = radius * Math.sin(rad);
                const y = radius * (1 - Math.cos(rad));

                return (
                  <div
                    key={can.id}
                    className="absolute w-[300px] sm:w-[450px] h-[500px] sm:h-[750px] pointer-events-auto"
                    style={{
                      transform: `translate3d(${x}px, ${y}px, 0px)`,
                    }}
                  >
                    <Can3DViewer
                      modelPath={can.model}
                      isMobile={isMobile}
                      rotation={can.rotation}
                    />
                  </div>
                );
              })}
            </div>

            {/* Active Flavor Details & Shop Now Button */}
            <div
              key={activeCan.id}
              className="absolute bottom-24 left-5 sm:bottom-28 sm:left-48 z-30 pointer-events-auto flex flex-col items-start max-w-[280px] sm:max-w-[400px] transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
            >
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-white/70 font-semibold mb-1">
                Featured Flavor
              </span>
              <h2 className="text-xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-md leading-tight">
                {activeCan.name}
              </h2>
              <p className="text-xs sm:text-sm text-white/80 mt-1 sm:mt-2 font-medium line-clamp-2 drop-shadow-sm">
                Zero added sugar. Crisp, sparkling infusion crafted with 100% natural ingredients.
              </p>
              <button
                className="mt-3 sm:mt-4 px-5 py-2 sm:px-7 sm:py-3 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-base transition-all duration-300 shadow-xl hover:bg-white/90 hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Now</span>
                <ChevronRight size={16} className="sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-6 sm:bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-3 sm:gap-4 z-40">
              <button
                onClick={handlePrev}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
                aria-label="Previous Flavor"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
                aria-label="Next Flavor"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        )}
      </WaterWave>
    </section>
  );
}

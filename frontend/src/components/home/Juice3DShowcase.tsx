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
    image: "/can1.png",
    color: "#85C7D3", // Light Blue to match the can
    model: "/assets/3d/can/Tangent_Watermelon_Cranberry_FINAL_4K.glb",
    rotation: [0, Math.PI / 3, 0],
  },
  {
    id: 2,
    name: "Ginger Ale",
    image: "/can2.png",
    color: "#435B47", // Dark Green to match the can
    model: "/assets/3d/can/Tangent_Ginger_Lemon_FINAL_4K.glb",
    rotation: [0, 5 * Math.PI / 6, 0],
  },
  {
    id: 3,
    name: "Tonic Water",
    image: "/can3.png",
    color: "#D4AF37", // Gold to match the can
    model: "/assets/3d/can/Tangent_Tonic_Water_FINAL_4K.glb",
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

    const targetAngle = wheelStateRef.current.angle + 120;
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

    const targetAngle = wheelStateRef.current.angle - 120;
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
            <div className="absolute z-[0] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none text-center">
              <h1 
                className="text-[#F2F2F2] uppercase select-none leading-none inline-block opacity-40 mix-blend-overlay"
                style={{ 
                  fontFamily: "var(--font-thunder)",
                  fontSize: "clamp(8rem, 10rem + 12vw, 26rem)",
                  letterSpacing: "0.02em"
                }}
              >
                TANGENT
              </h1>
            </div>

            {/* 3D GLB Models on Circular Arc Path (Zero CSS rotation to prevent WebGL GPU clipping) */}
            <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
              {CANS.map((can, i) => {
                const baseAngle = i * 120;
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
            
            {/* Navigation Buttons */}
            <div className="absolute bottom-10 sm:bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
                aria-label="Previous Flavor"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
                aria-label="Next Flavor"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </WaterWave>
    </section>
  );
}

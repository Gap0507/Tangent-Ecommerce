"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Can3DViewer from "./Can3DViewer";
import { IceCubes } from "./ice-cubes";

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

  const activeCan = CANS[currentIndex];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CANS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CANS.length) % CANS.length);
  };

  return (
    <section 
      className="relative w-full h-[600px] sm:h-[800px] overflow-hidden transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: activeCan.color }}
    >
      <div className="absolute inset-y-0 left-0 right-0 max-w-[1440px] mx-auto w-full h-full pointer-events-none z-10">
        <IceCubes containerWidth={isMobile ? 320 : 1220} cubeCount={isMobile ? 4 : 8} leafCount={isMobile ? 6 : 12} />
      </div>
      <WaterWave
        dropRadius={isMobile ? 8 : 10}
        perturbance={isMobile ? 0.006 : 0.01}
        imageUrl="/assets/images/drop.png"
        resolution={isMobile ? 700 : 1900}
        style={{ width: "100%", height: "100%" }}
      >
        {() => (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Blurred background overlay similar to juicy */}
            <div
              className="absolute top-0 left-0 w-full h-full z-[0] bg-black/5"
              style={{ backdropFilter: "blur(0px)" }}
            />
            
            {/* Background color animation layer */}
            <div 
              className="absolute inset-0 z-[-2] transition-colors duration-1000 ease-in-out"
              style={{ backgroundColor: activeCan.color, mixBlendMode: 'overlay' }} 
            />

            {/* JUICY text in background */}
            <div className="absolute z-[-1] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full pointer-events-none text-center">
              <h1 
                className="text-[#F2F2F2] uppercase select-none leading-none inline-block"
                style={{ 
                  fontFamily: "var(--font-thunder)",
                  fontSize: "clamp(8rem, 10rem + 12vw, 26rem)",
                  letterSpacing: "0.02em"
                }}
              >
                JUICY
              </h1>
            </div>

            {/* Can Image Container */}
            <div 
              key={activeCan.id}
              className={`relative z-20 transition-transform duration-500 hover:scale-105 ${
                activeCan.model 
                  ? "w-[300px] sm:w-[450px] h-[500px] sm:h-[750px]" 
                  : "w-[160px] sm:w-[220px] h-[320px] sm:h-[440px]"
              }`}
            >
              {activeCan.model ? (
                <Can3DViewer modelPath={activeCan.model} isMobile={isMobile} rotation={activeCan.rotation} />
              ) : (
                <Image 
                  src={activeCan.image}
                  alt={activeCan.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              )}
            </div>
            
            {/* Navigation Buttons */}
            <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40">
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

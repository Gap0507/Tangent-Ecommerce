"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Maximize2, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProductGalleryProps {
  images: {
    main: string;
    gallery: string[];
  };
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex gap-4 md:gap-6 h-full lg:h-[520px]">
      {/* Left Thumbnail Strip */}
      <div className="hidden md:flex flex-col gap-3 w-[85px] relative">
        <button className="flex items-center justify-center w-full py-1 text-ink/40 hover:text-navy transition-colors">
          <ChevronUp className="w-5 h-5" />
        </button>
        
        <div className="flex-1 flex flex-col gap-3 overflow-y-auto hide-scrollbar py-1">
          {images.gallery.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-full aspect-square rounded-2xl overflow-hidden border-2 transition-all cursor-pointer bg-cream/50 ${
                activeIndex === idx ? "border-navy opacity-100" : "border-transparent opacity-60 hover:opacity-100 hover:border-navy/20"
              }`}
            >
              <Image src={img} alt={`${productName} view ${idx + 1}`} fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>

        <button className="flex items-center justify-center w-full py-1 text-ink/40 hover:text-navy transition-colors">
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image View */}
      <div 
        className="flex-1 relative rounded-[32px] overflow-hidden flex items-center justify-center group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Fullscreen Button */}
        <button className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-navy shadow-sm hover:scale-110 transition-transform cursor-pointer">
          <Maximize2 className="w-4 h-4" />
        </button>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image 
              src={images.gallery[activeIndex]} 
              alt={productName} 
              fill 
              className={`object-cover transition-transform duration-500 ${isHovered ? 'scale-105' : 'scale-100'}`} 
              unoptimized 
            />
          </motion.div>
        </AnimatePresence>

        {/* Mobile dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex md:hidden gap-2">
          {images.gallery.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                activeIndex === idx ? "bg-navy w-4" : "bg-navy/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Star, ShoppingBag, Rotate3d, Check, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const Can3DViewer = dynamic(() => import("@/components/home/Can3DViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-navy border-t-transparent rounded-full animate-spin"></div>
    </div>
  ),
});

export interface ProductItem {
  id: string;
  name: string;
  subtitle: string;
  category: "single" | "variety" | "bundles";
  imageSrc: string;
  glbPath?: string;
  rating: number;
  reviewsCount: number;
  badge?: string;
  description: string;
  flavorNotes: string[];
  packPrices: {
    size: string;
    cans: number;
    price: number;
    savings?: string;
  }[];
}

interface ProductCardProps {
  product: ProductItem;
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedPackIndex, setSelectedPackIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  const selectedPack = product.packPrices[selectedPackIndex];

  const handleAddToCart = () => {
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] border border-navy/5 h-full relative group"
      >
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {product.badge ? (
            <span className="bg-navy text-sand text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-full shadow-sm pointer-events-auto">
              {product.badge}
            </span>
          ) : (
            <span />
          )}

          {/* Removed 3D button as per request */}
        </div>

        {/* Product Image Container */}
        <div className="relative w-full aspect-[4/4] overflow-hidden bg-cream/30 p-4 flex items-center justify-center">
          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>

        {/* Content Details */}
        <div className="p-6 flex flex-col flex-1">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center text-[#E8AE29]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-[12px] font-bold text-navy ml-1">{product.rating.toFixed(1)}</span>
            </div>
            <span className="text-ink/40 text-[12px]">({product.reviewsCount} reviews)</span>
          </div>

          {/* Name & Subtitle */}
          <h3 className="font-fraunces font-black text-navy text-[22px] leading-tight mb-1">
            {product.name}
          </h3>
          <p className="text-ink/60 text-[13px] mb-4">{product.subtitle}</p>

          {/* Flavor Notes pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {product.flavorNotes.map((note, idx) => (
              <span key={idx} className="bg-cream text-navy/70 text-[11px] font-medium px-2.5 py-0.5 rounded-md border border-navy/5">
                {note}
              </span>
            ))}
          </div>

          {/* Pack Size Selector */}
          <div className="mt-auto pt-4 border-t border-navy/10">
            <p className="text-[11px] font-bold text-navy/60 uppercase tracking-wider mb-2">Select Size:</p>
            <div className="grid grid-cols-3 gap-1.5 mb-5">
              {product.packPrices.map((pack, idx) => {
                const isSelected = selectedPackIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedPackIndex(idx)}
                    className={`py-2 px-1 rounded-xl text-center transition-all cursor-pointer border ${
                      isSelected
                        ? "bg-navy text-white border-navy font-bold shadow-sm"
                        : "bg-cream/50 text-navy/80 border-navy/10 hover:bg-cream hover:border-navy/30"
                    }`}
                  >
                    <div className="text-[11px] leading-tight font-semibold whitespace-nowrap overflow-hidden text-ellipsis">{pack.size.replace('Pack of', 'Pack')}</div>
                    <div className={`text-[10px] mt-0.5 ${isSelected ? "text-sand" : "text-ink/50"}`}>
                      ${pack.price}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Price & Add to Cart Button */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-ink/50 block">Price:</span>
                <span className="font-fraunces font-black text-navy text-[24px]">
                  ${selectedPack.price.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isAdded}
                className={`flex-1 py-3 px-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                  isAdded
                    ? "bg-[#73A642] text-white"
                    : "bg-navy text-cream hover:bg-navy/90 hover:scale-[1.02]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Box</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3D Interactive Modal */}
      <AnimatePresence>
        {is3DModalOpen && product.glbPath && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-cream rounded-3xl p-6 md:p-8 max-w-[650px] w-full relative shadow-2xl border border-navy/10 flex flex-col items-center"
            >
              <button
                onClick={() => setIs3DModalOpen(false)}
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white text-navy hover:bg-navy hover:text-white transition-colors cursor-pointer z-20 shadow-md"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-4">
                <span className="bg-navy/10 text-navy text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  Interactive 3D Can Inspection
                </span>
                <h3 className="font-fraunces font-black text-navy text-[28px] mt-2">
                  {product.name}
                </h3>
                <p className="text-ink/60 text-[13px]">Drag anywhere on the model to rotate 360°</p>
              </div>

              {/* 3D Model Box */}
              <div className="w-full h-[380px] relative rounded-2xl bg-white/60 border border-navy/10 overflow-hidden cursor-grab active:cursor-grabbing">
                <Can3DViewer modelPath={product.glbPath} isMobile={false} />
              </div>

              <div className="mt-6 flex items-center justify-between w-full pt-4 border-t border-navy/10">
                <div className="flex items-center gap-2 text-ink/70 text-[13px]">
                  <ShieldCheck className="w-4 h-4 text-[#73A642]" />
                  <span>100% Recyclable Aluminum Can</span>
                </div>
                <button
                  onClick={() => {
                    handleAddToCart();
                    setIs3DModalOpen(false);
                  }}
                  className="bg-navy text-cream px-6 py-2.5 rounded-xl font-bold text-[13px] hover:bg-navy/90 transition-all cursor-pointer"
                >
                  Add ${selectedPack.price.toFixed(2)} to Cart
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

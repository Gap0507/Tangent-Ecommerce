"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, ShoppingBag, Sparkles, Check } from "lucide-react";
import { motion } from "motion/react";

const FLAVOR_OPTIONS = [
  {
    id: "wm-mint",
    name: "Watermelon Mint",
    image: "/can2blogcard.png",
    color: "#E75A5A",
  },
  {
    id: "wm-cranberry",
    name: "Watermelon Cranberry",
    image: "/can1blogcard.png",
    color: "#3679B9",
  },
  {
    id: "yuzu-mint",
    name: "Yuzu Mint",
    image: "/can4blog.png",
    color: "#E8AE29",
  },
  {
    id: "guava-chilli",
    name: "Guava Chilli",
    image: "/can3blogcard.png",
    color: "#6A9A4A",
  },
];

export function BuildVarietyPack() {
  const [packSize, setPackSize] = useState<12 | 24>(12);
  const [selectedCans, setSelectedCans] = useState<string[]>([]);
  const [isAdded, setIsAdded] = useState(false);
  const [baseUnitPrice, setBaseUnitPrice] = useState(149);

  React.useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data) && resData.data[0]?.price) {
          setBaseUnitPrice(resData.data[0].price);
        }
      })
      .catch((err) => console.error("Failed to load inventory price for custom builder", err));
  }, []);

  const price12 = baseUnitPrice * 12;
  const price24 = baseUnitPrice * 24;
  const price = packSize === 12 ? price12 : price24;

  const addCan = (flavorId: string) => {
    if (selectedCans.length < packSize) {
      setSelectedCans([...selectedCans, flavorId]);
    }
  };

  const removeCanAt = (index: number) => {
    const updated = [...selectedCans];
    updated.splice(index, 1);
    setSelectedCans(updated);
  };

  const clearAll = () => {
    setSelectedCans([]);
  };

  const handleAddCustomPack = () => {
    if (selectedCans.length === packSize) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  return (
    <section className="bg-navy text-cream py-16 md:py-24 px-6 md:px-12 relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sand/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-[650px] mx-auto mb-12">
          <span className="inline-flex items-center gap-2 bg-sand/20 text-sand text-[11px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Custom Box Builder
          </span>
          <h2 className="font-fraunces font-black text-white text-[36px] md:text-[52px] leading-tight mb-4">
            Build Your Own <span className="text-sand italic">Variety Pack</span>
          </h2>
          <p className="text-cream/70 text-[15px] md:text-[16px] leading-[1.6]">
            Select your favorite flavors to fill your custom box. Mix and match in any combination!
          </p>
        </div>

        {/* Builder Container */}
        <div className="bg-navy-light/60 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-cream/15 shadow-2xl flex flex-col lg:flex-row gap-10">
          
          {/* LEFT — Flavor Picker Options */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-[18px] text-cream">1. Choose Pack Size:</h3>
              <div className="flex items-center gap-2 bg-navy p-1 rounded-2xl border border-cream/10">
                <button
                  onClick={() => {
                    setPackSize(12);
                    if (selectedCans.length > 12) setSelectedCans(selectedCans.slice(0, 12));
                  }}
                  className={`px-4 py-1.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                    packSize === 12 ? "bg-sand text-navy shadow-sm" : "text-cream/70 hover:text-cream"
                  }`}
                >
                  12 Cans (₹{price12})
                </button>
                <button
                  onClick={() => setPackSize(24)}
                  className={`px-4 py-1.5 rounded-xl text-[13px] font-bold transition-all cursor-pointer ${
                    packSize === 24 ? "bg-sand text-navy shadow-sm" : "text-cream/70 hover:text-cream"
                  }`}
                >
                  24 Cans (₹{price24})
                </button>
              </div>
            </div>

            <h3 className="font-bold text-[18px] text-cream mb-4">2. Tap to Add Cans to Box:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {FLAVOR_OPTIONS.map((flavor) => (
                <button
                  key={flavor.id}
                  onClick={() => addCan(flavor.id)}
                  disabled={selectedCans.length >= packSize}
                  className="bg-navy/80 hover:bg-navy p-4 rounded-2xl border border-cream/15 flex flex-col items-center text-center transition-all hover:scale-105 hover:border-sand/50 cursor-pointer disabled:opacity-50 disabled:hover:scale-100 group"
                >
                  <div className="relative w-24 h-24 mb-3">
                    <Image src={flavor.image} alt={flavor.name} fill className="object-contain" unoptimized />
                  </div>
                  <span className="font-bold text-[13px] text-cream group-hover:text-sand mb-1">{flavor.name}</span>
                  <div className="mt-auto inline-flex items-center gap-1 text-[11px] font-bold text-sand bg-cream/10 px-2.5 py-1 rounded-full">
                    <Plus className="w-3 h-3" /> Add Can
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Live Box Slot Visualizer */}
          <div className="w-full lg:w-[420px] bg-navy/90 rounded-2xl p-6 border border-cream/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-cream/10 pb-4">
                <div>
                  <h4 className="font-fraunces font-bold text-white text-[20px]">Your Custom Box</h4>
                  <p className="text-[12px] text-cream/60">
                    Filled: <strong className="text-sand font-bold">{selectedCans.length}</strong> / {packSize} Cans
                  </p>
                </div>
                {selectedCans.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-cream/50 hover:text-cream text-[12px] flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Box
                  </button>
                )}
              </div>

              {/* Grid of Slots */}
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-6 max-h-[220px] overflow-y-auto pr-1">
                {Array.from({ length: packSize }).map((_, idx) => {
                  const filledFlavorId = selectedCans[idx];
                  const flavorObj = FLAVOR_OPTIONS.find((f) => f.id === filledFlavorId);

                  return (
                    <div
                      key={idx}
                      className={`aspect-square rounded-xl flex items-center justify-center relative border transition-all ${
                        flavorObj
                          ? "bg-cream/10 border-sand/40"
                          : "bg-navy/40 border-cream/15 border-dashed"
                      }`}
                    >
                      {flavorObj ? (
                        <div className="relative w-full h-full p-1 group/slot">
                          <Image src={flavorObj.image} alt={flavorObj.name} fill className="object-contain p-1" unoptimized />
                          <button
                            onClick={() => removeCanAt(idx)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover/slot:opacity-100 transition-opacity cursor-pointer shadow-md"
                          >
                            <Trash2 className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-cream/20 text-[10px] font-bold">{idx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Price & Add Custom Pack Button */}
            <div className="pt-4 border-t border-cream/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-cream/70 text-[13px]">Total Box Price:</span>
                <span className="font-fraunces font-black text-sand text-[28px]">₹{price}</span>
              </div>

              <button
                onClick={handleAddCustomPack}
                disabled={selectedCans.length < packSize}
                className={`w-full py-4 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  isAdded
                    ? "bg-[#73A642] text-white"
                    : selectedCans.length === packSize
                    ? "bg-sand text-navy hover:bg-sand-deep hover:scale-[1.02]"
                    : "bg-cream/15 text-cream/40 cursor-not-allowed"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Custom Pack Added!</span>
                  </>
                ) : selectedCans.length === packSize ? (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add Custom Pack to Cart</span>
                  </>
                ) : (
                  <span>Add {packSize - selectedCans.length} More Cans to Complete</span>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

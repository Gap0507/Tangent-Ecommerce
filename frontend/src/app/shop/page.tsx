"use client";

import React from "react";
import { ShopHero } from "@/components/shop/ShopHero";
import { ShopProductGrid } from "@/components/shop/ShopProductGrid";
import { BuildVarietyPack } from "@/components/shop/BuildVarietyPack";
import { VarietyPackShowcase } from "@/components/shop/VarietyPackShowcase";
import { BentoGallerySection } from "@/components/home/BentoGallerySection";

export default function ShopPage() {
  return (
    <div className="flex flex-col flex-1 bg-cream min-h-screen">
      <ShopHero />
      <ShopProductGrid />
      <BuildVarietyPack />
      <VarietyPackShowcase />
      <BentoGallerySection />
    </div>
  );
}

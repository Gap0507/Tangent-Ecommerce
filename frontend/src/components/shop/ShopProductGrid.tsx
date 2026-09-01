"use client";

import React from "react";
import { ProductCard, ProductItem } from "./ProductCard";

export const PRODUCTS_CATALOG: ProductItem[] = [
  {
    id: "watermelon-mint",
    name: "Watermelon & Mint",
    subtitle: "Crisp & Ultra-Hydrating Prebiotic Beverage",
    category: "single",
    imageSrc: "/can2blogcard.png",
    glbPath: "/assets/3d/can/Tangent_Watermelon_Mint.glb",
    rating: 5.0,
    reviewsCount: 142,
    badge: "BESTSELLER",
    description: "Cooling watermelon paired with crisp garden mint and prebiotic botanicals for ultimate refreshment.",
    flavorNotes: ["Juicy Watermelon", "Fresh Mint", "Prebiotic Fibre"],
    packPrices: [
      { size: "Pack of 4", cans: 4, price: 16.0 },
      { size: "Pack of 8", cans: 8, price: 28.0 },
      { size: "Pack of 24", cans: 24, price: 76.0, savings: "Save $20" },
    ],
  },
  {
    id: "watermelon-cranberry",
    name: "Watermelon Cranberry",
    subtitle: "Sweet Meets Tart Botanical Refreshment",
    category: "single",
    imageSrc: "/can1blogcard.png",
    glbPath: "/assets/3d/can/Tangent_Watermelon_Cranberry_v2_FINAL_4K.glb",
    rating: 4.9,
    reviewsCount: 98,
    badge: "POPULAR",
    description: "Rich watermelon balanced with sharp tart cranberries and vitamin C infusion.",
    flavorNotes: ["Sweet Watermelon", "Tart Cranberry", "Vitamin C"],
    packPrices: [
      { size: "Pack of 4", cans: 4, price: 16.0 },
      { size: "Pack of 8", cans: 8, price: 28.0 },
      { size: "Pack of 24", cans: 24, price: 76.0, savings: "Save $20" },
    ],
  },
  {
    id: "yuzu-mint",
    name: "Yuzu Mint",
    subtitle: "Zesty Japanese Citrus & Cool Herb",
    category: "single",
    imageSrc: "/can4blog.png",
    glbPath: "/assets/3d/can/Tangent_Yuzu_Mint_FINAL_4K.glb",
    rating: 4.9,
    reviewsCount: 116,
    badge: "FAN FAVORITE",
    description: "Exotic Japanese Yuzu citrus infused with soothing wild mint for an energetic zesty boost.",
    flavorNotes: ["Zesty Yuzu", "Japanese Citrus", "Cool Mint"],
    packPrices: [
      { size: "Pack of 4", cans: 4, price: 16.0 },
      { size: "Pack of 8", cans: 8, price: 28.0 },
      { size: "Pack of 24", cans: 24, price: 76.0, savings: "Save $20" },
    ],
  },
  {
    id: "guava-chilli",
    name: "Guava Chilli",
    subtitle: "Tropical Sweetness with a Fiery Kick",
    category: "single",
    imageSrc: "/can3blogcard.png",
    glbPath: "/assets/3d/can/Tangent_Guava_Chilli_FINAL_4K.glb",
    rating: 4.8,
    reviewsCount: 84,
    badge: "BOLD NEW",
    description: "Luscious pink guava blended with subtle bird's eye chilli warmth for a adventurous taste sensation.",
    flavorNotes: ["Pink Guava", "Bird's Eye Chilli", "Digestive Enzymes"],
    packPrices: [
      { size: "Pack of 4", cans: 4, price: 16.0 },
      { size: "Pack of 8", cans: 8, price: 28.0 },
      { size: "Pack of 24", cans: 24, price: 76.0, savings: "Save $20" },
    ],
  },
];

export function ShopProductGrid() {
  return (
    <section className="bg-cream py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {PRODUCTS_CATALOG.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

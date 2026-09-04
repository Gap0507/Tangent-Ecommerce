"use client";

import React, { useState, useEffect } from "react";
import { ProductCard, ProductItem } from "./ProductCard";

const createDefaultPackPrices = (unitPrice: number) => [
  { size: "Pack of 4", cans: 4, price: unitPrice * 4 },
  { size: "Pack of 8", cans: 8, price: unitPrice * 8 },
  { size: "Pack of 12", cans: 12, price: unitPrice * 12 },
  { size: "Pack of 24", cans: 24, price: unitPrice * 24 },
];

const BASE_CATALOG: ProductItem[] = [
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
    packPrices: createDefaultPackPrices(130),
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
    packPrices: createDefaultPackPrices(80),
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
    packPrices: createDefaultPackPrices(120),
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
    packPrices: createDefaultPackPrices(100),
  },
];

export function ShopProductGrid() {
  const [products, setProducts] = useState<ProductItem[]>(BASE_CATALOG);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
          const inventoryProducts = resData.data;
          setProducts((prev) =>
            prev.map((item) => {
              // Match by name or sku or id
              const dbProd = inventoryProducts.find(
                (p: any) =>
                  p.name.toLowerCase().includes(item.id.replace("-", " ")) ||
                  item.id.toLowerCase().includes(p.name.toLowerCase().replace(/\s+/g, "-")) ||
                  p.sku.toLowerCase().includes(item.id.substring(0, 4))
              );
              if (dbProd && dbProd.price) {
                const baseP = dbProd.price;
                return {
                  ...item,
                  packPrices: createDefaultPackPrices(baseP),
                };
              }
              return item;
            })
          );
        }
      })
      .catch((err) => console.error("Failed to load inventory prices for grid", err));
  }, []);

  return (
    <section className="bg-cream py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}


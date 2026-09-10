"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ProductDetails } from "@/data/products";

export function ProductTabs({ product }: { product: ProductDetails }) {
  const tabs = ["Details", "Ingredients", "Nutrition"];
  const [activeTab, setActiveTab] = useState("Details");

  const defaultNutrition = {
    protein: ["10.80", "27.00", "1.35"],
    fiber: ["4.00", "10.00", "-"],
    totalSugar: ["2.60", "6.50", "21.67"],
    addedSugar: ["1.40", "3.50", "-"],
    magnesium: ["0.59", "1.48", "0.15"],
    phosphorus: ["2.14", "5.35", "0.15"],
    zinc: ["1.22", "3.05", "0.15"],
    b1: ["0.65", "1.63", "9.60"],
    b3: ["0.11", "0.30", "21.40"],
    b5: ["0.55", "1.48", "10.00"],
    b7: ["0.21", "0.53", "10.60"],
    c: ["0.15", "0.38", "1.30"],
    b12: ["3.19", "7.97", "9.96"],
    b6: ["0.91", "2.28", "91.20"],
    mgBottom: ["0.50", "1.25", "65.78"],
  };

  const cranberryNutrition = {
    protein: ["10.92", "27.30", "1.37"],
    fiber: ["4.04", "10.10", "-"],
    totalSugar: ["2.62", "6.55", "21.83"],
    addedSugar: ["1.42", "3.55", "-"],
    magnesium: ["0.62", "1.55", "0.15"],
    phosphorus: ["2.15", "5.40", "0.15"],
    zinc: ["1.20", "3.00", "0.15"],
    b1: ["0.64", "1.60", "9.41"],
    b3: ["0.14", "0.35", "25.00"],
    b5: ["0.59", "1.48", "10.60"],
    b7: ["0.22", "0.55", "11.00"],
    c: ["0.14", "0.35", "1.17"],
    b12: ["3.28", "8.20", "10.25"],
    b6: ["0.87", "2.18", "87.20"],
    mgBottom: ["0.52", "1.30", "68.42"],
  };

  const guavaNutrition = {
    protein: ["10.90", "27.25", "1.36"],
    fiber: ["4.04", "10.10", "-"],
    totalSugar: ["2.63", "6.60", "22.00"],
    addedSugar: ["1.41", "3.53", "-"],
    magnesium: ["0.61", "1.53", "0.04"],
    phosphorus: ["2.11", "5.30", "0.09"],
    zinc: ["1.21", "3.03", "9.11"],
    b1: ["0.62", "1.55", "21.40"],
    b3: ["0.12", "0.30", "9.50"],
    b5: ["0.53", "1.33", "13.00"],
    b7: ["0.26", "0.65", "1.10"],
    c: ["0.13", "0.33", "10.03"],
    b12: ["3.21", "8.03", "89.20"],
    b6: ["0.89", "2.23", "76.30"],
    mgBottom: ["0.58", "1.45", ""],
  };

  const yuzuNutrition = {
    protein: ["10.80", "27.00", "1.35"],
    fiber: ["4.00", "10.00", "-"],
    totalSugar: ["2.61", "6.53", "21.77"],
    addedSugar: ["1.40", "3.50", "-"],
    magnesium: ["0.61", "1.53", "0.15"],
    phosphorus: ["2.12", "5.30", "0.15"],
    zinc: ["1.21", "3.03", "0.15"],
    b1: ["0.61", "1.53", "9.00"],
    b3: ["0.13", "0.33", "23.60"],
    b5: ["0.51", "1.30", "9.30"],
    b7: ["0.29", "0.73", "14.60"],
    c: ["0.16", "0.40", "1.30"],
    b12: ["3.27", "8.20", "10.30"],
    b6: ["0.86", "2.15", "86.00"],
    mgBottom: ["0.51", "1.30", "68.42"],
  };

  let n = defaultNutrition;
  if (product.id === "watermelon-cranberry") n = cranberryNutrition;
  if (product.id === "guava-chilli") n = guavaNutrition;
  if (product.id === "yuzu-mint") n = yuzuNutrition;

  return (
    <div className="w-full">
      <div className="flex border-b border-navy/10 overflow-x-auto hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 md:px-8 py-4 font-bold text-[14px] whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? "border-navy text-navy"
                : "border-transparent text-ink/50 hover:text-navy hover:border-navy/30"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-8 text-[14px] leading-relaxed text-ink/80">
        {activeTab === "Details" && (
          <div className="max-w-3xl">
            <h3 className="text-xl font-bold font-fraunces text-navy mb-4">Product Details</h3>
            <p className="mb-4">
              {product.description}
            </p>
            <ul className="list-disc pl-5 space-y-2">
              {product.valueProps.map((prop, idx) => (
                <li key={idx}>{prop}</li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === "Ingredients" && (
          <div className="max-w-4xl p-8 bg-[#bfe5e4]/40 rounded-2xl border border-[#bfe5e4]">
            <h3 className="text-xl font-bold text-navy mb-4 uppercase tracking-wide">Ingredients List:</h3>
            <p className="text-[#0a4b7c] font-bold leading-relaxed mb-6">
              Carbonated Water, Fructooligosaccharides (FOS), Acidity Regulator (INS 330), Natural Flavouring Substances, Monk Fruit Extract, Sweetener (INS 960), preservative (INS 202), Minerals (Potassium Chloride, Sodium Chloride, Calcium Diphosphate, Magnesium Sulphate Monohydrate, Zinc Sulphate), Permitted Natural Colouring Substance (INS 163), Vitamin C, Vitamin B3, Vitamin B6, Vitamin B5, Vitamin B1, Vitamin B12, Vitamin B7
            </p>
            <p className="text-[#00a3c4] font-black uppercase text-sm">
              THIS CONTAINS STEVIA GLYCOSIDES CONTAIN NON-CALORIC SWEETENER
            </p>
          </div>
        )}

        {activeTab === "Nutrition" && (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 max-w-[900px] mx-auto">
            {/* Left: Product Image */}
            <div className="w-full lg:w-1/3 flex items-center justify-center">
              <div className="relative w-[200px] sm:w-[240px] aspect-[1/1.8]">
                <Image
                  src={product.images.main}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                />
              </div>
            </div>
            
            {/* Right: Nutrition Table */}
            <div className="w-full lg:w-2/3">
              <h3 className="text-lg font-bold font-fraunces text-navy mb-3 uppercase text-[#a5aeb8]">NUTRITIONAL VALUE :</h3>
              <div className="bg-[#bfe5e4] rounded-t-lg py-1.5 px-2 font-bold text-center text-[#0a4b7c] text-[13px] bg-[#1a4b9c] text-white">
                NUTRITIONAL INFORMATION (approx.)
              </div>
              <div className="bg-[#e0f2f1] p-3 text-[#0a4b7c] font-bold text-[12px]">
                <div className="mb-2">Serving Size: 250 ml</div>
                <div className="mb-2">NUTRIENTS</div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="bg-[#59c3d9] text-[#0a4b7c] border-b border-[#a5d6d8]">
                        <th className="py-1 px-2 font-bold">Energy</th>
                        <th className="py-1 px-2 font-bold"></th>
                        <th className="py-1 px-2 font-bold text-center">100 ml</th>
                        <th className="py-1 px-2 font-bold text-center">Per Serve</th>
                        <th className="py-1 px-2 font-bold text-center">*% RDA</th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#d2eff0]">
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Protein</td>
                        <td className="py-1 px-2 text-right">kcal</td>
                        <td className="py-1 px-2 text-center">{n.protein[0]}</td>
                        <td className="py-1 px-2 text-center">{n.protein[1]}</td>
                        <td className="py-1 px-2 text-center">{n.protein[2]} 0.00</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Total</td>
                        <td className="py-1 px-2 text-right">g</td>
                        <td className="py-1 px-2 text-center">0.00</td>
                        <td className="py-1 px-2 text-center">0.00</td>
                        <td className="py-1 px-2 text-center"></td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td colSpan={5} className="py-1 px-2 font-bold">Carbohydrates</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2 pl-4">Dietary Fiber</td>
                        <td className="py-1 px-2 text-right">g</td>
                        <td className="py-1 px-2 text-center">{n.fiber[0]}</td>
                        <td className="py-1 px-2 text-center">{n.fiber[1]}</td>
                        <td className="py-1 px-2 text-center">{n.fiber[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2 pl-4">Total Sugar</td>
                        <td className="py-1 px-2 text-right">g</td>
                        <td className="py-1 px-2 text-center">{n.totalSugar[0]}</td>
                        <td className="py-1 px-2 text-center">{n.totalSugar[1]}</td>
                        <td className="py-1 px-2 text-center">{n.totalSugar[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2 pl-4">Added Sugar</td>
                        <td className="py-1 px-2 text-right">g</td>
                        <td className="py-1 px-2 text-center">{n.addedSugar[0]}</td>
                        <td className="py-1 px-2 text-center">{n.addedSugar[1]}</td>
                        <td className="py-1 px-2 text-center">{n.addedSugar[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Total Fat</td>
                        <td className="py-1 px-2 text-right">g</td>
                        <td className="py-1 px-2 text-center">0.00</td>
                        <td className="py-1 px-2 text-center">0.00</td>
                        <td className="py-1 px-2 text-center">0.00</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Cholesterol</td>
                        <td className="py-1 px-2 text-right">g</td>
                        <td className="py-1 px-2 text-center">0.00</td>
                        <td className="py-1 px-2 text-center">0.00</td>
                        <td className="py-1 px-2 text-center">0.00</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Calcium</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">0.00</td>
                        <td className="py-1 px-2 text-center">0.00</td>
                        <td className="py-1 px-2 text-center">-</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Magnesium</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">{n.magnesium[0]}</td>
                        <td className="py-1 px-2 text-center">{n.magnesium[1]}</td>
                        <td className="py-1 px-2 text-center">{n.magnesium[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Potassium</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">0.06</td>
                        <td className="py-1 px-2 text-center">0.15</td>
                        <td className="py-1 px-2 text-center">0.04</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Phosphorus</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">{n.phosphorus[0]}</td>
                        <td className="py-1 px-2 text-center">{n.phosphorus[1]}</td>
                        <td className="py-1 px-2 text-center">{n.phosphorus[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Sodium</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">0.36</td>
                        <td className="py-1 px-2 text-center">0.90</td>
                        <td className="py-1 px-2 text-center">0.09</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Zinc</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">{n.zinc[0]}</td>
                        <td className="py-1 px-2 text-center">{n.zinc[1]}</td>
                        <td className="py-1 px-2 text-center">{n.zinc[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Vitamin B1</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">{n.b1[0]}</td>
                        <td className="py-1 px-2 text-center">{n.b1[1]}</td>
                        <td className="py-1 px-2 text-center">{n.b1[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Vitamin B3</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">{n.b3[0]}</td>
                        <td className="py-1 px-2 text-center">{n.b3[1]}</td>
                        <td className="py-1 px-2 text-center">{n.b3[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Vitamin B5</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">{n.b5[0]}</td>
                        <td className="py-1 px-2 text-center">{n.b5[1]}</td>
                        <td className="py-1 px-2 text-center">{n.b5[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Vitamin B7</td>
                        <td className="py-1 px-2 text-right">mcg</td>
                        <td className="py-1 px-2 text-center">{n.b7[0]}</td>
                        <td className="py-1 px-2 text-center">{n.b7[1]}</td>
                        <td className="py-1 px-2 text-center">{n.b7[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Vitamin C</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">{n.c[0]}</td>
                        <td className="py-1 px-2 text-center">{n.c[1]}</td>
                        <td className="py-1 px-2 text-center">{n.c[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Vitamin B12</td>
                        <td className="py-1 px-2 text-right">mcg</td>
                        <td className="py-1 px-2 text-center">{n.b12[0]}</td>
                        <td className="py-1 px-2 text-center">{n.b12[1]}</td>
                        <td className="py-1 px-2 text-center">{n.b12[2]}</td>
                      </tr>
                      <tr className="border-b border-white/50">
                        <td className="py-1 px-2">Vitamin B6</td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">{n.b6[0]}</td>
                        <td className="py-1 px-2 text-center">{n.b6[1]}</td>
                        <td className="py-1 px-2 text-center">{n.b6[2]}</td>
                      </tr>
                      <tr>
                        <td className="py-1 px-2"></td>
                        <td className="py-1 px-2 text-right">mg</td>
                        <td className="py-1 px-2 text-center">{n.mgBottom[0]}</td>
                        <td className="py-1 px-2 text-center">{n.mgBottom[1]}</td>
                        <td className="py-1 px-2 text-center">{n.mgBottom[2]}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="text-right text-[10px] mt-4 font-bold text-[#0a4b7c]">
                  The *% Recommended Daily Allowance is calculated on the basis of 2000 kcal of an Average Adult.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

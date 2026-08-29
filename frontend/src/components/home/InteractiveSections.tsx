"use client";

import dynamic from "next/dynamic";
import { MomentsSection } from "./MomentsSection";
import { ProductShowcaseClient } from "./ProductShowcaseClient";

const Juice3DShowcase = dynamic(
  () => import("@/components/home/Juice3DShowcase").then((m) => m.Juice3DShowcase),
  { ssr: false }
);

const TasteOfWonder = dynamic(
  () => import("@/components/home/TasteOfWonder").then((m) => m.TasteOfWonder),
  { ssr: false }
);

const FlavorPicker = dynamic(
  () => import("@/components/home/FlavorPicker").then((m) => m.FlavorPicker),
  { ssr: false }
);

export function InteractiveSections() {
  return (
    <>
      <Juice3DShowcase />
      <MomentsSection />
      <ProductShowcaseClient />
      <TasteOfWonder />
      <FlavorPicker />
    </>
  );
}



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

const TangentStandard = dynamic(
  () => import("@/components/home/TangentStandard").then((m) => m.TangentStandard),
  { ssr: false }
);

const RealRefreshment = dynamic(
  () => import("@/components/home/RealRefreshment").then((m) => m.RealRefreshment),
  { ssr: false }
);

export function InteractiveSections() {
  return (
    <>
      <TasteOfWonder />
      <Juice3DShowcase />
      <FlavorPicker />
      <MomentsSection />
      <ProductShowcaseClient />
      <TangentStandard />
      <RealRefreshment />
    </>
  );
}





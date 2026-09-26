"use client";

import dynamic from "next/dynamic";
import { MomentsSection } from "./MomentsSection";
import { ProductShowcaseClient } from "./ProductShowcaseClient";

const Juice3DShowcase = dynamic(
  () => import("@/components/home/Juice3DShowcase").then((m) => m.Juice3DShowcase),
  { ssr: false, loading: () => <div className="h-[550px] sm:h-[calc(100vh-80px)] sm:min-h-[600px] sm:max-h-[750px] bg-[#82AF38]/20 animate-pulse" /> }
);

const TasteOfWonder = dynamic(
  () => import("@/components/home/TasteOfWonder").then((m) => m.TasteOfWonder),
  { ssr: false, loading: () => <div className="h-[500px] bg-cream animate-pulse" /> }
);

const FlavorPicker = dynamic(
  () => import("@/components/home/FlavorPicker").then((m) => m.FlavorPicker),
  { ssr: false, loading: () => <div className="min-h-[100vh] bg-[#FAF7F2] animate-pulse" /> }
);

const TangentStandard = dynamic(
  () => import("@/components/home/TangentStandard").then((m) => m.TangentStandard),
  { ssr: false, loading: () => <div className="h-[400px] bg-[#0A2540] animate-pulse" /> }
);

const RealRefreshment = dynamic(
  () => import("@/components/home/RealRefreshment").then((m) => m.RealRefreshment),
  { ssr: false, loading: () => <div className="min-h-[500px] bg-[#F9F6EE] animate-pulse" /> }
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





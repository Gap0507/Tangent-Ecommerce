"use client";

import dynamic from "next/dynamic";
import { MomentsSection } from "./MomentsSection";

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
      <TasteOfWonder />
      <MomentsSection />
      <FlavorPicker />
    </>
  );
}

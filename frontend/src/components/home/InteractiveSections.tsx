"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";
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

/**
 * Lazy wrapper — only mounts children once the sentinel enters
 * the viewport (with a 1000px rootMargin so it starts loading
 * just *before* the user scrolls to it).
 */
function LazySection({
  children,
  fallback,
  rootMargin = "1000px",
}: {
  children: ReactNode;
  fallback: ReactNode;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={ref}>{visible ? children : fallback}</div>;
}

export function InteractiveSections() {
  return (
    <>
      {/* TasteOfWonder is light (just images + gsap), load eagerly */}
      <TasteOfWonder />

      {/* Heavy 3D section — only load when approaching viewport */}
      <LazySection fallback={<div className="h-[550px] sm:h-[calc(100vh-80px)] sm:min-h-[600px] sm:max-h-[750px] bg-[#82AF38]/20 animate-pulse" />}>
        <Juice3DShowcase />
      </LazySection>

      <LazySection fallback={<div className="min-h-[100vh] bg-[#FAF7F2] animate-pulse" />}>
        <FlavorPicker />
      </LazySection>

      <MomentsSection />

      <LazySection fallback={<div className="h-screen bg-cream animate-pulse" />}>
        <ProductShowcaseClient />
      </LazySection>

      <LazySection fallback={<div className="h-[400px] bg-[#0A2540] animate-pulse" />}>
        <TangentStandard />
      </LazySection>

      <LazySection fallback={<div className="min-h-[500px] bg-[#F9F6EE] animate-pulse" />}>
        <RealRefreshment />
      </LazySection>
    </>
  );
}

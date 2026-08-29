"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";

const ProductShowcase = dynamic(
  () => import("./ProductShowcase").then((m) => m.ProductShowcase),
  { ssr: false, loading: () => <div className="h-screen bg-cream" /> }
);

export function ProductShowcaseClient() {
  useEffect(() => {
    // Force scroll to top on mount
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      
      // Secondary check to ensure it stays at top after hydration
      const timeout = setTimeout(() => {
        window.scrollTo(0, 0);
      }, 100);
      
      return () => clearTimeout(timeout);
    }
  }, []);

  return <ProductShowcase />;
}

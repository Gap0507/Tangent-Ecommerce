"use client";

import dynamic from "next/dynamic";

const ProductShowcase = dynamic(
  () => import("./ProductShowcase").then((m) => m.ProductShowcase),
  { ssr: false, loading: () => <div className="h-screen bg-cream" /> }
);

export function ProductShowcaseClient() {
  return <ProductShowcase />;
}

import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { ProductShowcaseClient } from "@/components/home/ProductShowcaseClient";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-cream">
      <Hero />
      <ProductShowcaseClient />
      <TrustStrip />
    </div>
  );
}

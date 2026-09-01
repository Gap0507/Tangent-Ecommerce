import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PRODUCTS_CATALOG_DETAILED } from "@/data/products";

// Components (to be implemented)
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductInfo } from "@/components/product/ProductInfo";
import { ProductFeatures } from "@/components/product/ProductFeatures";
import { ProductTabs } from "@/components/product/ProductTabs";
import { WhyLoveIt } from "@/components/product/WhyLoveIt";
import { CustomerReviews } from "@/components/product/CustomerReviews";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const product = PRODUCTS_CATALOG_DETAILED[resolvedParams.id];

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-navy font-sans">
      {/* Breadcrumbs */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-6 pt-10">
        <nav className="flex items-center gap-2 text-[13px] text-ink/60 font-medium">
          <Link href="/" className="hover:text-navy transition-colors flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/shop" className="hover:text-navy transition-colors">
            Shop All
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-navy">{product.name}</span>
        </nav>
      </div>

      {/* Main Product Section */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 pb-16 pt-4">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left: Gallery */}
          <div className="w-full lg:w-1/2">
            <ProductGallery images={product.images} productName={product.name} />
            
            {/* Features below gallery */}
            <div className="mt-8">
              <ProductFeatures features={product.features} />
            </div>
          </div>

          {/* Right: Info & Actions */}
          <div className="w-full lg:w-1/2 flex flex-col pt-2 lg:pt-8 pl-0 lg:pl-6">
            <ProductInfo product={product} />
          </div>
        </div>
      </section>

      {/* Tabs & Detailed Sections */}
      <section className="max-w-[1280px] mx-auto px-6 md:px-12 pb-24">
        <ProductTabs />
        <div className="pt-16 mt-8">
           <WhyLoveIt data={product.whyLoveIt} />
        </div>
      </section>

      {/* Reviews Section */}
      <section className="bg-cream/30 py-20 border-t border-navy/5 overflow-hidden w-full">
        <CustomerReviews reviews={product.reviews} />
      </section>

    </div>
  );
}

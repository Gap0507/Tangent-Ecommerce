import type { Metadata } from "next";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogFilters } from "@/components/blog/BlogFilters";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { BlogBanner } from "@/components/blog/BlogBanner";
import { BlogNewsletter } from "@/components/blog/BlogNewsletter";

export const metadata: Metadata = {
  title: "Blog | Tangent",
  description: "Dive into refreshing reads on wellness, ingredients, lifestyle and everything Tangent.",
};

export default function BlogPage() {
  return (
    <div className="flex flex-col flex-1 bg-cream">
      <BlogHero />
      <BlogGrid />
      <BlogBanner />
    </div>
  );
}

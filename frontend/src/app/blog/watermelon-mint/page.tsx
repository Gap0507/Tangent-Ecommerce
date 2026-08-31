import { Metadata } from "next";
import { BlogDetailsHero } from "@/components/blog/BlogDetailsHero";
import { BlogDetailsContent } from "@/components/blog/BlogDetailsContent";

export const metadata: Metadata = {
  title: "Why Watermelon & Mint Make the Perfect Pair | Tangent",
  description: "Cool, refreshing, and naturally hydrating — discover how this dynamic duo keeps you fresh all day.",
};

export default function BlogDetailsPage() {
  return (
    <div className="flex flex-col flex-1 bg-cream">
      <BlogDetailsHero />
      <BlogDetailsContent />
    </div>
  );
}

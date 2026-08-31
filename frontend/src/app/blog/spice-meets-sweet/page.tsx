import { Metadata } from "next";
import { Blog4DetailsHero } from "@/components/blog/Blog4DetailsHero";
import { Blog4DetailsContent } from "@/components/blog/Blog4DetailsContent";

export const metadata: Metadata = {
  title: "Spice Meets Sweet: A Bold Combo | Tangent",
  description: "Guava and chilli bring the heat and the sweet. Here's why bold flavors are the new cool.",
};

export default function Blog4DetailsPage() {
  return (
    <div className="flex flex-col flex-1 bg-cream">
      <Blog4DetailsHero />
      <Blog4DetailsContent />
    </div>
  );
}

import { Metadata } from "next";
import { Blog2DetailsHero } from "@/components/blog/Blog2DetailsHero";
import { Blog2DetailsContent } from "@/components/blog/Blog2DetailsContent";

export const metadata: Metadata = {
  title: "Hydration, But Make It Delicious | Tangent",
  description: "Drinks that hydrate and delight. Here's how Tangent keeps it balanced.",
};

export default function Blog2DetailsPage() {
  return (
    <div className="flex flex-col flex-1 bg-cream">
      <Blog2DetailsHero />
      <Blog2DetailsContent />
    </div>
  );
}

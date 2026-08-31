import { Metadata } from "next";
import { Blog3DetailsHero } from "@/components/blog/Blog3DetailsHero";
import { Blog3DetailsContent } from "@/components/blog/Blog3DetailsContent";

export const metadata: Metadata = {
  title: "The Zesty Power of Yuzu | Tangent",
  description: "A citrusy twist with Japanese roots. Here's why yuzu is more than just a flavor.",
};

export default function Blog3DetailsPage() {
  return (
    <div className="flex flex-col flex-1 bg-cream">
      <Blog3DetailsHero />
      <Blog3DetailsContent />
    </div>
  );
}

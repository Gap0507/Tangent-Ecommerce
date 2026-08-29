import { Hero } from "@/components/home/Hero";
import { InteractiveSections } from "@/components/home/InteractiveSections";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-cream">
      <Hero />
      <InteractiveSections />
    </div>
  );
}


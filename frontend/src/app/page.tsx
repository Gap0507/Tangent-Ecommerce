import HomeHero from "@/components/home/HomeHero";
import { InteractiveSections } from "@/components/home/InteractiveSections";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 bg-cream">
      <HomeHero />
      <InteractiveSections />
    </div>
  );
}


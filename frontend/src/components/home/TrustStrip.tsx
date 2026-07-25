import { Zap, Heart, Leaf } from "lucide-react";

const trustItems = [
  {
    icon: <Zap className="w-6 h-6 stroke-cream" />,
    title: "Clean Energy",
    description: "120mg of natural caffeine extracted from green coffee beans for a smooth lift."
  },
  {
    icon: <Heart className="w-6 h-6 stroke-cream" />,
    title: "Zero Sugar",
    description: "Lightly sweetened with stevia and monk fruit. No crash, no regrets."
  },
  {
    icon: <Leaf className="w-6 h-6 stroke-cream" />,
    title: "Real Ingredients",
    description: "Flavored with real fruit extracts and packed with daily essential vitamins."
  }
];

export function TrustStrip() {
  return (
    <section className="bg-pale-sky py-16 px-10 grid grid-cols-1 md:grid-cols-3 gap-[30px] max-w-[1080px] mx-auto rounded-t-[28px] md:rounded-t-[28px] rounded-b-none">
      {trustItems.map((item, index) => (
        <div key={index} className="text-center flex flex-col items-center gap-[14px]">
          <div className="w-[52px] h-[52px] rounded-full bg-navy flex items-center justify-center">
            {item.icon}
          </div>
          <h4 className="text-[16px] text-navy font-bold">{item.title}</h4>
          <p className="text-[13.5px] text-navy/65 max-w-[210px] leading-[1.5]">
            {item.description}
          </p>
        </div>
      ))}
    </section>
  );
}

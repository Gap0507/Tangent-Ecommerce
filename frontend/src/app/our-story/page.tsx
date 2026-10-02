import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StoryContent } from "./StoryContent";

export const metadata: Metadata = {
  title: "Our Story | Tangent",
  description: "Every big idea starts with a simple thought. Read about how Tangent is building a global lifestyle beverage brand that inspires people to choose better every day.",
  openGraph: {
    title: "Our Story | Tangent",
    description: "Every big idea starts with a simple thought. Read about how Tangent is building a global lifestyle beverage brand that inspires people to choose better every day.",
    url: "https://tangentfnb.com/our-story",
    images: [
      {
        url: "/all4bg.png",
        width: 1200,
        height: 630,
        alt: "Tangent Story",
      },
    ],
  },
};

export default function OurStoryPage() {
  return (
    <div className="flex flex-col flex-1 bg-cream min-h-screen text-navy font-sans">

      {/* Breadcrumbs */}
      <div className="max-w-[1280px] mx-auto px-6 md:px-12 pt-3 pb-1 w-full">
        <nav className="flex items-center gap-2 text-[12px] text-ink/60 font-medium">
          <Link href="/" className="hover:text-navy transition-colors flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-navy">Our Story</span>
        </nav>
      </div>

      {/* Combined Hero & Story Content Section */}
      <section className="relative w-full py-2 px-6 overflow-hidden max-w-[1200px] mx-auto min-h-[calc(100vh-130px)] flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center w-full">

          <div className="order-2 lg:order-1 flex flex-col justify-center relative z-10 max-w-[550px] mx-auto lg:mx-0">
            <p className="text-coral font-bold text-[12px] tracking-[.25em] uppercase mb-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              Our Story
            </p>
            <h1 className="font-fraunces font-black text-3xl md:text-4xl lg:text-5xl leading-[1.05] text-navy mb-3 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150 fill-mode-both">
              Every big idea starts with a simple thought.
            </h1>
            <p className="text-lg md:text-xl text-navy/80 font-medium mb-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              Why should taking care of yourself ever feel like a compromise?
            </p>

            <div className="flex flex-col gap-3 text-[14px] md:text-[15px] leading-[1.6] text-navy/85 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
              <p>
                We grew up surrounded by drinks that tasted good, but weren’t necessarily made with our well-being in mind. And when we looked for healthier alternatives, many felt like they were missing something—taste, excitement, or simply the joy of drinking them.
              </p>
              <p className="font-semibold text-[15px] md:text-[16px] text-navy">
                We believed there had to be another way.
              </p>
              <p>
                So we created <strong className="text-navy font-bold">Tangent</strong>.
              </p>
              <p>
                A drink born from the belief that <strong className="text-coral font-bold">health should never feel boring, and great taste should never come with guilt.</strong>
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 relative h-[250px] md:h-[350px] lg:h-[450px] w-full flex items-center justify-center bg-transparent animate-in fade-in zoom-in-95 duration-1000 delay-300 fill-mode-both">
            <div className="relative w-full h-full max-w-[450px]">
              <Image
                src="/all4can.png"
                alt="Tangent Variety Pack"
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Scroll Content Section */}
      <StoryContent />
    </div>
  );
}

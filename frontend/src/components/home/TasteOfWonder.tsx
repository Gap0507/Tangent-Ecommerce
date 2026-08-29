"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, Cuboid, Droplets, Zap, Smile, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: <Leaf className="w-5 h-5 text-navy" strokeWidth={1.5} />,
    title: "Real Ingredients",
    desc: "Made with real fruit extracts and natural goodness.",
  },
  {
    icon: <Cuboid className="w-5 h-5 text-navy" strokeWidth={1.5} />,
    title: "Zero Sugar",
    desc: "No added sugar. Just pure, guilt-free refreshment.",
  },
  {
    icon: <Droplets className="w-5 h-5 text-navy" strokeWidth={1.5} />,
    title: "Hydrating",
    desc: "Electrolytes and hydration that keep you going.",
  },
  {
    icon: <Zap className="w-5 h-5 text-navy" strokeWidth={1.5} />,
    title: "Natural Caffeine",
    desc: "From green coffee beans for smooth, sustained energy.",
  },
  {
    icon: <Smile className="w-5 h-5 text-navy" strokeWidth={1.5} />,
    title: "No Crash",
    desc: "Clean energy that keeps you sharp without the crash.",
  },
  {
    icon: <Heart className="w-5 h-5 text-navy" strokeWidth={1.5} />,
    title: "Vegan & Clean",
    desc: "Vegan friendly and made with clean, conscious ingredients.",
  },
];

export function TasteOfWonder() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const parasRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Image entrance — slides up with scale & fade
      if (imageRef.current) {
        gsap.fromTo(imageRef.current, 
          { y: 80, scale: 0.9, opacity: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            y: 0, scale: 1, opacity: 1, duration: 1.2, ease: "power3.out"
          }
        );
      }

      // 2. Heading — word-by-word reveal (Redwood-style)
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll(".reveal-word");
        gsap.fromTo(words, 
          { y: 40, opacity: 0, rotateX: 20 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.12, ease: "power4.out"
          }
        );
      }

      // 3. Blue accent bar — slides in width
      if (accentRef.current) {
        gsap.fromTo(accentRef.current, 
          { scaleX: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            scaleX: 1, transformOrigin: "left center", duration: 0.8, delay: 0.5, ease: "power3.out"
          }
        );
      }

      // 4. Paragraphs — staggered slide-up reveal per paragraph
      if (parasRef.current) {
        const paras = parasRef.current.querySelectorAll("p");
        gsap.fromTo(paras, 
          { y: 30, opacity: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 70%" },
            y: 0, opacity: 1, duration: 0.9, stagger: 0.2, delay: 0.4, ease: "power3.out"
          }
        );
      }

      // 5. Features bar container — slide up
      if (featuresRef.current) {
        gsap.fromTo(featuresRef.current, 
          { y: 40, opacity: 0 },
          {
            scrollTrigger: { trigger: featuresRef.current, start: "top 90%" },
            y: 0, opacity: 1, duration: 0.8, ease: "power2.out"
          }
        );

        // Individual feature items — staggered cascade
        gsap.fromTo(featuresRef.current.querySelectorAll(".feature-item"), 
          { opacity: 0, y: 25, scale: 0.95 },
          {
            scrollTrigger: { trigger: featuresRef.current, start: "top 90%" },
            opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 0.3
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative flex flex-col justify-center overflow-hidden bg-[#E9F3FC] py-12 px-6">
      <div className="max-w-[1300px] mx-auto w-full">
        
        {/* TOP: Image & Text Split */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-8">
          
          {/* Left: Cans Image */}
          <div className="flex-1 w-full max-w-[500px] flex justify-center">
            <div ref={imageRef} className="relative w-full aspect-[4/3] lg:aspect-[1.1]">
              <Image
                src="/all4can.png"
                alt="Tangent flavors exploding with freshness"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex-1 max-w-[600px]">
            <h2 ref={headingRef} className="font-fraunces font-black text-[clamp(44px,5vw,64px)] leading-[1.0] mb-4" style={{ perspective: "600px" }}>
              <span className="text-navy block overflow-hidden">
                <span className="reveal-word inline-block">Taste</span>{" "}
                <span className="reveal-word inline-block">of</span>
              </span>
              <span className="text-coral block overflow-hidden">
                <span className="reveal-word inline-block">wonder!</span>
              </span>
            </h2>
            
            <div ref={accentRef} className="w-16 h-[4px] bg-sky rounded-full mb-5" />
            
            <div ref={parasRef} className="space-y-4 text-ink/70 font-medium text-[14px] lg:text-[15.5px] leading-[1.6]">
              <p>
                Our brand is crafted for people who seek real refreshment with real ingredients. We bring together thoughtfully balanced fruit blends like Watermelon & Cranberry for a juicy, vibrant lift, and Lemon & Mint for a crisp, cooling refresh.
              </p>
              <p>
                Packed in both cans and bottles, our juices are made to fit seamlessly into modern routines—perfectly blending cravings for quality with everyday moments.
              </p>
              <p>
                Every sip reflects our commitment to clean flavors, natural freshness, and reliably moments of feel-good hydration simple, honest, and incredibly refreshing.
              </p>
            </div>
          </div>

        </div>

        {/* BOTTOM: Features Bar */}
        <div 
          ref={featuresRef} 
          className="bg-white/80 backdrop-blur-md rounded-[24px] p-5 lg:px-8 lg:py-6 shadow-[0_8px_32px_rgba(18,59,115,0.05)] border border-white"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8 xl:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-navy/5">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className={`feature-item flex flex-col items-center xl:items-start text-center xl:text-left ${
                  i !== 0 && i !== 2 && i !== 4 ? "pt-6 sm:pt-0 sm:pl-6 xl:pl-6" : "pt-6 sm:pt-0 xl:pl-6 xl:pt-0"
                } ${i === 0 ? "pt-0 xl:pl-0" : ""} ${i === 2 || i === 4 ? "xl:pl-6" : ""}`}
              >
                <div className="w-10 h-10 rounded-full bg-[#F0F5FA] flex items-center justify-center mb-3">
                  {feature.icon}
                </div>
                <h4 className="font-fraunces font-bold text-navy text-[15px] mb-1.5">
                  {feature.title}
                </h4>
                <p className="text-[12.5px] text-ink/60 leading-[1.5] max-w-[200px]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}


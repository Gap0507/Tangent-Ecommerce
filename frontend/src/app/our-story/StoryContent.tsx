"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function StoryContent() {
  const sectionRef1 = useRef<HTMLDivElement>(null);
  const sectionRef2 = useRef<HTMLDivElement>(null);
  const sectionRef3 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate Section 1 (The Why)
      if (sectionRef1.current) {
        gsap.fromTo(
          sectionRef1.current.children,
          { y: 50, opacity: 0 },
          {
            scrollTrigger: { trigger: sectionRef1.current, start: "top 80%" },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }

      // Animate Section 2 (Cans and Text)
      if (sectionRef2.current) {
        gsap.fromTo(
          sectionRef2.current.children,
          { y: 50, opacity: 0 },
          {
            scrollTrigger: { trigger: sectionRef2.current, start: "top 80%" },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
          }
        );
      }

      // Animate Section 3 (Final Vision Box)
      if (sectionRef3.current) {
        gsap.fromTo(
          sectionRef3.current,
          { y: 60, opacity: 0, scale: 0.95 },
          {
            scrollTrigger: { trigger: sectionRef3.current, start: "top 85%" },
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="max-w-[1000px] mx-auto px-6 pb-24 md:pb-32 overflow-hidden">
      
      {/* SECTION 1 */}
      <div ref={sectionRef1} className="min-h-[calc(100vh-130px)] flex flex-col justify-center max-w-[850px] mx-auto text-center mb-16">
        <div className="inline-flex items-center justify-center gap-3 mb-4">
          <span className="w-8 h-[2px] bg-coral/60 rounded-full"></span>
          <span className="text-coral font-bold text-[12px] tracking-[.2em] uppercase">The Why</span>
          <span className="w-8 h-[2px] bg-coral/60 rounded-full"></span>
        </div>
        <h2 className="font-fraunces font-black text-3xl md:text-4xl text-navy mb-5 leading-[1.15]">
          Something that <span className="text-coral">tastes good.</span> <br />
          Something that <span className="text-[#E5C05E]">feels good.</span> <br />
          Something that fits into the way people live today.
        </h2>
        <p className="text-[16px] md:text-[18px] leading-[1.6] text-navy/75 mb-8 max-w-[750px] mx-auto">
          We wanted to create something people could reach for every day after a workout, during a busy day at work, with a meal, on a journey, or simply when they wanted something refreshing.
        </p>
        
        <div className="relative py-6 px-8 md:py-8 md:px-10 rounded-[2rem] bg-gradient-to-b from-white to-[#DCEDFB]/40 border border-white/60 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E5C05E]/15 rounded-full blur-[80px] -z-10 -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-400/15 rounded-full blur-[80px] -z-10 translate-y-1/3 -translate-x-1/3"></div>
          <p className="text-xl md:text-2xl font-medium text-navy/90 leading-[1.5]">
            That became our purpose: <br className="hidden md:block" />
            <strong className="text-navy font-black font-fraunces mt-2 block text-2xl md:text-3xl">to make better choices easier and more enjoyable.</strong>
          </p>
        </div>
      </div>

      {/* SECTION 2 */}
      <div ref={sectionRef2} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-24">
        <div className="relative h-[400px] md:h-[500px] w-full flex items-center justify-center bg-transparent">
          <div className="relative w-full h-full">
            <Image
              src="/can2.png"
              alt="Tangent Watermelon Mint"
              fill
              className="object-contain drop-shadow-2xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="flex flex-col gap-6 text-[17px] leading-[1.8] text-navy/85">
          <p>
            With refreshing flavours, essential vitamins and minerals, and zero added sugar, Tangent is our attempt to bring together the things we believe belong in the same Can — <strong className="text-navy font-bold">taste, hydration and everyday wellness.</strong>
          </p>
          <p>
            But this is only the beginning.
          </p>
          <p>
            We started with a Can in our hands and a belief in our hearts. Today, we dream of taking that belief far beyond India — building a beverage brand that people around the world can connect with, trust, and enjoy.
          </p>
        </div>
      </div>

      {/* SECTION 3 */}
      <div ref={sectionRef3} className="max-w-[800px] mx-auto text-center bg-navy text-cream p-12 md:p-16 rounded-[2.5rem] shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <Image src="/all4bg.png" alt="Background Texture" fill className="object-cover" />
        </div>
        <div className="relative z-10">
          <p className="text-[20px] md:text-[24px] font-medium leading-[1.6] mb-8">
            Because we don't just want to sell drinks.<br />
            <strong className="text-sand font-bold text-2xl md:text-3xl mt-4 block font-fraunces">
              We want to change the way people think about everyday beverages.
            </strong>
          </p>
          <p className="text-[17px] md:text-[19px] leading-[1.8] text-cream/90 mb-12">
            And if every Tangent someone picks up helps them make one small, better choice for themselves — <strong className="text-white font-bold">then we're moving in the right direction.</strong>
          </p>

          <div className="w-24 h-1 bg-coral mx-auto mb-10 rounded-full"></div>

          <h3 className="font-fraunces font-black text-4xl md:text-5xl text-white mb-4">Tangent</h3>
          <p className="text-sand font-bold tracking-[.15em] uppercase text-sm md:text-base">
            Choose better. Feel better. Live better.
          </p>
        </div>
      </div>

    </section>
  );
}

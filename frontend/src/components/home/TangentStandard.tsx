"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function TangentStandard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Animate Text
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.children,
          { y: 40, opacity: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
          }
        );
      }

      // Animate Image
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          { x: 50, opacity: 0, scale: 0.9 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power3.out",
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#0A2540] overflow-hidden py-16 md:py-24 px-6 md:px-12 text-white">
      <div className="max-w-[1300px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">

          {/* TEXT CONTENT */}
          <div ref={textRef} className="flex flex-col justify-center">
            <p className="text-[#E5C05E] font-bold text-[14px] tracking-[.25em] uppercase mb-4">
              Our Vision
            </p>

            <h2 className="font-fraunces font-black text-[clamp(40px,5vw,64px)] leading-[1.05] mb-6">
              Redefining <br />
              <span className="text-[#E5C05E]">Refreshment.</span>
            </h2>

            <p className="text-white/90 text-[18px] md:text-[20px] leading-[1.8] mb-8 font-medium max-w-[600px]">
              To build Tangent into a global lifestyle beverage brand that inspires people to choose better every day—bringing together great taste, essential nutrition, and refreshing hydration in every sip.
            </p>

            <ul className="flex flex-col gap-4 mb-10 text-white/80 font-medium text-[16px] md:text-[18px]">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E5C05E]/20 flex items-center justify-center text-[#E5C05E]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                Uncompromising Taste
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E5C05E]/20 flex items-center justify-center text-[#E5C05E]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                Essential Daily Nutrition
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#E5C05E]/20 flex items-center justify-center text-[#E5C05E]">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                Clean, Refreshing Hydration
              </li>
            </ul>

            <div className="flex items-center mt-2">
              <a href="/our-story" className="inline-flex items-center justify-center px-8 py-4 bg-[#E5C05E] text-[#0A2540] font-bold rounded-full hover:bg-white transition-colors">
                Read Our Story
              </a>
            </div>
          </div>

          {/* IMAGE COMPOSITION */}
          <div ref={imageRef} className="relative flex justify-center items-center w-full h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px]">
            <div className="absolute inset-0 bg-[#E5C05E]/10 rounded-[3rem] rotate-6 scale-95 -z-10 blur-xl" />
            <div className="relative w-full h-full max-w-[450px]">
              <Image
                src="/can1.png"
                alt="Tangent Can"
                fill
                className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.4)]"
                sizes="(max-width: 768px) 100vw, 450px"
                priority
              />
            </div>
          </div>

        </div>
      </div>

      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#E5C05E]/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-sky-500/5 blur-[120px]" />
      </div>
    </section>
  );
}

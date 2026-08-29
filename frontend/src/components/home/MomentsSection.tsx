"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const moments = [
  {
    id: 1,
    image: "/can1card.png",
    title: "Focus at Work",
    desc: "Stay sharp during those deep work hours.",
  },
  {
    id: 2,
    image: "/can2card.png",
    title: "Weekend Vibes",
    desc: "Your perfect companion for laid-back weekends.",
  },
  {
    id: 3,
    image: "/can3card.png",
    title: "Post Workout",
    desc: "Rehydrate. Refresh. Reset.",
  },
  {
    id: 4,
    image: "/can4card.png",
    title: "Sunset Chaser",
    desc: "Unwind with a drink that hits different.",
  },
];

export function MomentsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // 1. Heading — word-by-word reveal
      if (headingRef.current) {
        const words = headingRef.current.querySelectorAll(".reveal-word");
        gsap.fromTo(words, 
          { y: 50, opacity: 0, rotateX: 15 },
          {
            scrollTrigger: { trigger: section, start: "top 80%" },
            y: 0, opacity: 1, rotateX: 0, duration: 0.8, stagger: 0.14, ease: "power4.out"
          }
        );
      }

      // 2. Gold accent bar — scale in from left
      if (accentRef.current) {
        gsap.fromTo(accentRef.current, 
          { scaleX: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 80%" },
            scaleX: 1, transformOrigin: "left center", duration: 0.7, delay: 0.5, ease: "power3.out"
          }
        );
      }

      // 3. Paragraph — slide up
      if (paraRef.current) {
        gsap.fromTo(paraRef.current, 
          { y: 25, opacity: 0 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: "power3.out"
          }
        );
      }

      // 4. CTA button — slide up with slight scale
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current, 
          { y: 20, opacity: 0, scale: 0.95 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            y: 0, opacity: 1, scale: 1, duration: 0.7, delay: 0.8, ease: "power3.out"
          }
        );
      }

      // 5. Cards — staggered cascade from right
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".moment-card");
        gsap.fromTo(cards, 
          { x: 60, opacity: 0, scale: 0.92 },
          {
            scrollTrigger: { trigger: section, start: "top 75%" },
            x: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: "back.out(1.2)"
          }
        );
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-navy overflow-hidden">
      <div className="flex flex-col lg:flex-row min-h-[420px]">

        {/* ── LEFT PANEL ── */}
        <div className="flex flex-col justify-center px-8 py-14 lg:px-16 lg:py-20 lg:w-[340px] xl:w-[400px] shrink-0">
          <h2 ref={headingRef} className="font-fraunces font-black text-cream text-[clamp(32px,4vw,52px)] leading-[1.05] mb-4" style={{ perspective: "600px" }}>
            <span className="overflow-hidden block">
              <span className="reveal-word inline-block">One</span>{" "}
              <span className="reveal-word inline-block">Can.</span>
            </span>
            <span className="text-sand overflow-hidden block">
              <span className="reveal-word inline-block">Many</span>{" "}
              <span className="reveal-word inline-block">Moments.</span>
            </span>
          </h2>

          {/* Gold underline accent */}
          <div ref={accentRef} className="w-10 h-[3px] bg-sand rounded-full mb-6" />

          <p ref={paraRef} className="text-cream/70 text-[15px] leading-[1.6] max-w-[280px] mb-8">
            Whether you&apos;re grinding, chilling, or chasing sunsets—Tangent keeps up with you.
          </p>

          <Link
            ref={ctaRef}
            href="/shop"
            className="inline-flex items-center gap-2 border-2 border-sand text-sand font-bold text-[14px] px-6 py-3 rounded-full w-fit hover:bg-sand hover:text-navy transition-all duration-250"
          >
            Explore Flavors
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>

        {/* ── RIGHT: CARDS ROW ── */}
        <div ref={cardsRef} className="flex-1 flex items-stretch overflow-x-auto scrollbar-none px-4 lg:px-8 pb-8 lg:pb-0 gap-4 lg:gap-5 lg:items-center">
          {moments.map((moment) => (
            <div
              key={moment.id}
              className="moment-card relative flex-none w-[220px] md:w-[230px] lg:w-[240px] xl:w-[260px] rounded-2xl overflow-hidden group cursor-pointer border border-white/10 hover:border-white/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_24px_48px_rgba(0,0,0,0.4)]"
              style={{ aspectRatio: "3/4" }}
            >
              {/* Card image */}
              <Image
                src={moment.image}
                alt={moment.title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 220px, 260px"
                unoptimized
              />

              {/* Bottom gradient + text */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />

              <div className="absolute bottom-0 left-0 right-0 z-20 p-5">
                <h3 className="font-fraunces font-bold text-white text-[18px] leading-[1.2] mb-1">
                  {moment.title}
                </h3>
                <p className="text-white/70 text-[13px] leading-[1.45] font-medium">
                  {moment.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}


"use client";

import Image from "next/image";
import { Leaf, Shield, Pipette } from "lucide-react";
import { motion } from "motion/react";

export function RealRefreshment() {
  return (
    <section className="relative w-full min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-center overflow-hidden bg-[#F9F6EE]">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/realrefreshmentsection.png"
          alt="Real Refreshment Background"
          fill
          className="object-cover object-right md:object-center"
          priority
          unoptimized
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-[500px]"
        >
          {/* Subtitle */}
          <p className="text-[9px] md:text-[10px] font-bold tracking-[.15em] uppercase text-[#73A642] mb-3">
            Real Ingredients. Real Refreshment.
          </p>

          {/* Main Heading */}
          <h2 className="font-fraunces font-black text-navy text-3xl md:text-4xl lg:text-5xl leading-[1.1] mb-5 drop-shadow-sm">
            Goodness Inside.<br />
            Refreshment You&apos;ll <span className="text-[#73A642] italic">Love.</span>
          </h2>

          {/* Paragraph */}
          <p className="text-ink/80 text-xs md:text-sm font-medium max-w-[400px] mb-8 leading-relaxed">
            We use real ingredients and natural botanicals to deliver a refreshment that&apos;s as good as it tastes.
          </p>

          {/* Features Row */}
          <div className="flex flex-wrap items-start gap-5 md:gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center text-center max-w-[100px]">
              <div className="w-12 h-12 rounded-full border border-[#FF6B6B] bg-[#FF6B6B]/10 flex items-center justify-center mb-3 text-[#FF6B6B]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                  <path d="M12 22c4-4 4-10 0-14" />
                  <path d="M12 22c-4-4-4-10 0-14" />
                </svg>
              </div>
              <span className="text-navy text-[11px] md:text-xs font-bold leading-snug">
                Real Fruit<br />Extracts
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center text-center max-w-[100px]">
              <div className="w-12 h-12 rounded-full border border-[#73A642] bg-[#73A642]/10 flex items-center justify-center mb-3 text-[#73A642]">
                <Leaf size={22} strokeWidth={2} />
              </div>
              <span className="text-navy text-[11px] md:text-xs font-bold leading-snug">
                Natural<br />Botanicals
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center text-center max-w-[100px]">
              <div className="w-12 h-12 rounded-full border border-[#4B83C4] bg-[#4B83C4]/10 flex items-center justify-center mb-3 text-[#4B83C4]">
                <Shield size={22} strokeWidth={2} />
              </div>
              <span className="text-navy text-[11px] md:text-xs font-bold leading-snug">
                No Compromise<br />on Quality
              </span>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col items-center text-center max-w-[100px]">
              <div className="w-12 h-12 rounded-full border border-[#E5B54B] bg-[#E5B54B]/10 flex items-center justify-center mb-3 text-[#E5B54B]">
                <Pipette size={22} strokeWidth={2} />
              </div>
              <span className="text-navy text-[11px] md:text-xs font-bold leading-snug">
                Thoughtfully<br />Crafted
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

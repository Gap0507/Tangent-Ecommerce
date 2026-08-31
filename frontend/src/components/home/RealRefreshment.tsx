"use client";

import Image from "next/image";
import { Leaf, Shield, Pipette } from "lucide-react";
import { motion } from "motion/react";

export function RealRefreshment() {
  return (
    <section className="relative w-full min-h-[900px] md:min-h-[500px] lg:min-h-[600px] flex items-start md:items-center overflow-hidden bg-[#F9F6EE] pt-16 pb-32 md:py-0">
      {/* Background Image - Mobile */}
      <div className="absolute inset-0 w-full h-full z-0 md:hidden">
        <Image
          src="/realrefreshmentmobile.png"
          alt="Real Refreshment Background Mobile"
          fill
          className="object-cover object-top"
          priority
          unoptimized
        />
      </div>

      {/* Background Image - Desktop */}
      <div className="absolute inset-0 w-full h-full z-0 hidden md:block">
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
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 lg:px-20 h-full flex flex-col justify-between md:justify-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-[65%] sm:w-[60%] md:w-full md:max-w-[500px] mt-24 md:mt-0"
        >
          {/* Subtitle */}
          <p className="text-[9px] md:text-[10px] font-bold tracking-[.15em] uppercase text-[#73A642] mb-3">
            Real Ingredients.<br className="md:hidden" /> Real Refreshment.
          </p>

          {/* Main Heading */}
          <h2 className="font-fraunces font-black text-navy text-[32px] md:text-4xl lg:text-5xl leading-[1.05] mb-4 drop-shadow-sm">
            Goodness<br />Inside.<br />
            Refreshment<br className="md:hidden" /> You&apos;ll <br className="md:hidden" /><span className="text-[#73A642] italic">Love.</span>
          </h2>

          {/* Paragraph */}
          <p className="text-navy text-[13px] md:text-sm font-medium max-w-[200px] md:max-w-[400px] mb-6 md:mb-8 leading-[1.4]">
            We use real ingredients and natural botanicals to deliver a refreshment that&apos;s as good as it tastes.
          </p>

          {/* Features Row/Column */}
          <div className="flex flex-col md:flex-row md:flex-wrap items-start gap-4 md:gap-8 mb-12 md:mb-0">
            {/* Feature 1 */}
            <div className="flex flex-row md:flex-col items-center md:text-center gap-3 md:gap-0 max-w-[200px] md:max-w-[100px]">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-[#FF6B6B] bg-[#FF6B6B]/10 flex items-center justify-center md:mb-3 text-[#FF6B6B]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-5 md:h-5">
                  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" />
                  <path d="M12 22c4-4 4-10 0-14" />
                  <path d="M12 22c-4-4-4-10 0-14" />
                </svg>
              </div>
              <span className="text-navy text-[11px] md:text-[11px] lg:text-xs font-bold leading-[1.2] text-left md:text-center">
                Real Fruit<br />Extracts
              </span>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-row md:flex-col items-center md:text-center gap-3 md:gap-0 max-w-[200px] md:max-w-[100px]">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-[#73A642] bg-[#73A642]/10 flex items-center justify-center md:mb-3 text-[#73A642]">
                <Leaf size={18} strokeWidth={2} className="md:w-5 md:h-5" />
              </div>
              <span className="text-navy text-[11px] md:text-[11px] lg:text-xs font-bold leading-[1.2] text-left md:text-center">
                Natural<br />Botanicals
              </span>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-row md:flex-col items-center md:text-center gap-3 md:gap-0 max-w-[200px] md:max-w-[100px]">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-[#4B83C4] bg-[#4B83C4]/10 flex items-center justify-center md:mb-3 text-[#4B83C4]">
                <Shield size={18} strokeWidth={2} className="md:w-5 md:h-5" />
              </div>
              <span className="text-navy text-[11px] md:text-[11px] lg:text-xs font-bold leading-[1.2] text-left md:text-center">
                No Compromise<br />on Quality
              </span>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-row md:flex-col items-center md:text-center gap-3 md:gap-0 max-w-[200px] md:max-w-[100px]">
              <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-full border border-[#E5B54B] bg-[#E5B54B]/10 flex items-center justify-center md:mb-3 text-[#E5B54B]">
                <Pipette size={18} strokeWidth={2} className="md:w-5 md:h-5" />
              </div>
              <span className="text-navy text-[11px] md:text-[11px] lg:text-xs font-bold leading-[1.2] text-left md:text-center">
                Thoughtfully<br />Crafted
              </span>
            </div>
          </div>
        </motion.div>


      </div>
    </section>
  );
}

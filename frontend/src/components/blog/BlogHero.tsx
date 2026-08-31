"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function BlogHero() {
  return (
    <section className="relative bg-cream pt-6 md:pt-8 lg:pt-10 pb-12 md:pb-20 px-6 md:px-12 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Soft yellow circle glow */}
        <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-[#FBEFBE]/40 rounded-full blur-3xl opacity-70"></div>
        
        {/* Some decorative leaves */}
        <div className="absolute top-[20%] right-[5%] w-[60px] h-[60px] rotate-[15deg]">
          <Image src="/assets/images/leaf/1.png" alt="" fill className="object-contain" unoptimized />
        </div>
        <div className="absolute top-[60%] right-[40%] w-[40px] h-[40px] rotate-[-25deg]">
          <Image src="/assets/images/leaf/2.png" alt="" fill className="object-contain" unoptimized />
        </div>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* LEFT — Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 max-w-[500px]"
          >
            <p className="text-[10px] md:text-[11px] font-bold tracking-[.18em] uppercase text-coral mb-4">
              BLOGS & INSIGHTS
            </p>

            <h1 className="font-fraunces font-black text-navy text-[48px] md:text-[64px] lg:text-[76px] leading-[1.0] mb-6">
              Fresh Ideas.<br />
              <span className="text-[#73A642]">Real Stories.</span>
            </h1>

            <p className="text-ink/70 text-[15px] md:text-[16px] leading-[1.6] max-w-[400px] mb-8">
              Dive into refreshing reads on wellness, ingredients, lifestyle and everything Tangent.
            </p>
          </motion.div>

          {/* RIGHT — Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 relative w-full max-w-[700px] h-[400px] md:h-[500px] lg:h-[550px] shrink-0"
          >
            <Image
              src="/bloghero.png"
              alt="Tangent Blog Hero"
              fill
              className="object-contain lg:object-right"
              unoptimized
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

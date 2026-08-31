"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function BlogBanner() {
  return (
    <section className="hidden md:block bg-cream py-12 md:py-20 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative bg-[#E8DFD3] rounded-3xl overflow-hidden py-12 md:py-16 px-8 md:px-16 flex flex-col md:flex-row items-center min-h-[300px]"
        >
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
             <Image src="/blogquote.png" alt="Quote Background" fill className="object-cover object-right" unoptimized />
          </div>

          <div className="relative z-10 max-w-[500px]">
            <div className="text-coral text-[60px] font-fraunces leading-[0.5] mb-2">&ldquo;</div>
            <h2 className="font-fraunces font-black text-navy text-[32px] md:text-[42px] leading-[1.1] mb-4">
              Good ingredients.<br />
              Great thoughts.<br />
              <span className="text-coral">Better you.</span>
            </h2>
            <p className="text-navy/70 text-[14px] md:text-[15px] leading-[1.6]">
              We believe in honest drinks and honest conversations.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

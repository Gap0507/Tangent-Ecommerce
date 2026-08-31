"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Link2 } from "lucide-react";
import { motion } from "motion/react";

export function Blog3DetailsHero() {
  return (
    <section className="bg-cream pt-10 md:pt-16 pb-12 md:pb-20 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* LEFT — Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 w-full max-w-[550px]"
          >
            {/* Back Link */}
            <Link 
              href="/blog"
              className="inline-flex items-center gap-2 text-ink/60 hover:text-navy text-[13px] font-medium mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blogs
            </Link>

            {/* Meta tags */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="bg-[#FBF1D9] text-[#B78822] text-[11px] font-bold tracking-wider uppercase px-4 py-1.5 rounded-full">
                Lifestyle
              </span>
              <div className="flex items-center gap-3 text-ink/50 text-[13px] font-medium">
                <span>May 15, 2024</span>
                <span className="w-1 h-1 rounded-full bg-ink/30"></span>
                <span>5 min read</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-fraunces font-black text-navy text-[42px] md:text-[56px] leading-[1.05] mb-6">
              The Zesty Power of <span className="text-[#E8AE29]">Yuzu</span>
            </h1>

            {/* Excerpt */}
            <p className="text-ink/80 text-[15px] md:text-[16px] leading-[1.7] mb-10 max-w-[480px]">
              A citrusy twist with Japanese roots. Here's why yuzu is more than just a flavor.
            </p>

            {/* Author & Share */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-navy/10 pt-8">
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#E8AE29] text-white flex items-center justify-center font-fraunces font-bold text-[20px]">
                  T
                </div>
                <div>
                  <p className="text-navy text-[14px] font-bold leading-tight mb-1">Tangent Team</p>
                  <p className="text-ink/60 text-[12px]">Stay refreshed. Stay real.</p>
                </div>
              </div>

              {/* Share */}
              <div className="flex items-center gap-3">
                <span className="text-navy text-[13px] font-bold mr-2">Share this post:</span>
                <button className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors">
                  <svg className="w-3.5 h-3.5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </button>
                <button className="w-8 h-8 rounded-full border border-navy/20 flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors">
                  <Link2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex-1 w-full max-w-[700px]"
          >
            <div className="relative w-full aspect-[4/3] md:aspect-[16/11] rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/blogdetails/can3yulu/main.png"
                alt="The Zesty Power of Yuzu"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}

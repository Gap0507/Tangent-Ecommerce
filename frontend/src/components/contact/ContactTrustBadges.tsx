"use client";

import { motion } from "motion/react";

const badges = [
  {
    title: "Real Ingredients",
    desc: "Made with real fruits and botanicals.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
      </svg>
    ),
    iconCustom: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M20 6c-2 0-4 1-5 3-2 3-1 7 2 9l3 2 3-2c3-2 4-6 2-9-1-2-3-3-5-3z" stroke="#73C2A0" strokeWidth="2" fill="#73C2A0" fillOpacity="0.15"/>
        <path d="M20 20v12" stroke="#73C2A0" strokeWidth="2" strokeLinecap="round"/>
        <path d="M16 24h8" stroke="#73C2A0" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: "No Shortcuts",
    desc: "No artificial flavors, colors or sweeteners.",
    icon: null,
  },
  {
    title: "Honest & Transparent",
    desc: "We keep it real, always.",
    icon: null,
  },
  {
    title: "Here for You",
    desc: "Your satisfaction means everything.",
    icon: null,
  },
];

export function ContactTrustBadges() {
  return (
    <section className="bg-navy py-12 md:py-16 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6"
        >
          {/* Real Ingredients */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-cream/10 flex items-center justify-center mb-4 text-[#73C2A0]">
              <svg viewBox="0 0 40 40" fill="none" className="w-7 h-7">
                <path d="M20 6c-2 0-4 1-5 3-2 3-1 7 2 9l3 2 3-2c3-2 4-6 2-9-1-2-3-3-5-3z" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15"/>
                <path d="M20 20v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M16 25h8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="font-fraunces font-bold text-cream text-[14px] md:text-[15px] mb-1.5">Real Ingredients</h3>
            <p className="text-cream/50 text-[11px] md:text-[12px] leading-[1.4] max-w-[160px]">Made with real fruits and botanicals.</p>
          </div>

          {/* No Shortcuts */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-cream/10 flex items-center justify-center mb-4 text-[#6FB1E0]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-fraunces font-bold text-cream text-[14px] md:text-[15px] mb-1.5">No Shortcuts</h3>
            <p className="text-cream/50 text-[11px] md:text-[12px] leading-[1.4] max-w-[160px]">No artificial flavors, colors or sweeteners.</p>
          </div>

          {/* Honest & Transparent */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-cream/10 flex items-center justify-center mb-4 text-[#A88BDB]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <h3 className="font-fraunces font-bold text-cream text-[14px] md:text-[15px] mb-1.5">Honest & Transparent</h3>
            <p className="text-cream/50 text-[11px] md:text-[12px] leading-[1.4] max-w-[160px]">We keep it real, always.</p>
          </div>

          {/* Here for You */}
          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-cream/10 flex items-center justify-center mb-4 text-[#E5B54B]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </div>
            <h3 className="font-fraunces font-bold text-cream text-[14px] md:text-[15px] mb-1.5">Here for You</h3>
            <p className="text-cream/50 text-[11px] md:text-[12px] leading-[1.4] max-w-[160px]">Your satisfaction means everything.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

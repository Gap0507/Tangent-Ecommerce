"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export function ContactStayConnected() {
  return (
    <section className="relative bg-cream overflow-hidden py-12 md:py-20 px-6 md:px-12">
      {/* Decorative leaves */}
      <div className="absolute top-[-10px] left-[30%] w-[60px] md:w-[80px] h-[60px] md:h-[80px] z-0 pointer-events-none rotate-[20deg]">
        <Image src="/assets/images/leaf/1.png" alt="" fill className="object-contain" unoptimized />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="relative bg-navy rounded-3xl px-8 md:px-14 py-8 md:py-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
        >
          {/* Decorative leaf inside card — top right */}
          <div className="absolute top-[-10px] right-[20%] w-[50px] md:w-[70px] h-[50px] md:h-[70px] pointer-events-none rotate-[-30deg] opacity-60">
            <Image src="/assets/images/leaf/2.png" alt="" fill className="object-contain" unoptimized />
          </div>

          {/* LEFT — Text + Social Icons */}
          <div className="flex-1 max-w-[400px]">
            <p className="text-[10px] font-bold tracking-[.18em] uppercase text-cream/50 mb-3">
              STAY IN THE LOOP
            </p>

            <h2 className="font-fraunces font-black text-cream text-[36px] md:text-[44px] lg:text-[50px] leading-[1.05] mb-4">
              Let&apos;s Stay<br />
              <span className="text-sand">Connected.</span>
            </h2>

            <p className="text-cream/60 text-[13px] md:text-[14px] leading-[1.6] mb-8 max-w-[340px]">
              Follow us on social media for refreshing updates, new flavors, offers and more.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* Instagram */}
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center hover:bg-cream/20 transition-colors"
              >
                <svg className="w-[18px] h-[18px] stroke-cream" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </Link>

              {/* Facebook */}
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center hover:bg-cream/20 transition-colors"
              >
                <svg className="w-[18px] h-[18px] stroke-cream" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </Link>

              {/* Twitter */}
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center hover:bg-cream/20 transition-colors"
              >
                <svg className="w-[18px] h-[18px] stroke-cream" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </Link>

              {/* LinkedIn */}
              <Link
                href="#"
                className="w-10 h-10 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center hover:bg-cream/20 transition-colors"
              >
                <svg className="w-[18px] h-[18px] stroke-cream" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* RIGHT — 4 Cans Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative w-full max-w-[550px] lg:max-w-[700px] h-[350px] md:h-[450px] lg:h-[550px] lg:-my-20"
          >
            <Image
              src="/all4can.png"
              alt="Tangent drink flavors"
              fill
              className="object-contain drop-shadow-[0_15px_35px_rgba(0,0,0,0.3)]"
              unoptimized
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

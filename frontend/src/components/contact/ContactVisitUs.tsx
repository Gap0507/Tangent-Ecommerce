"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { MapPin, Mail, Phone } from "lucide-react";

export function ContactVisitUs() {
  return (
    <section className="relative bg-cream py-16 md:py-24 px-6 md:px-12" style={{ overflowX: 'clip', overflowY: 'visible' }}>
      {/* Decorative leaves */}
      <div className="absolute top-[-20px] right-[-20px] w-[100px] md:w-[150px] h-[100px] md:h-[150px] z-0 pointer-events-none rotate-[15deg]">
        <Image src="/assets/images/leaf/1.png" alt="" fill className="object-contain" unoptimized />
      </div>

      {/* Decorative lemon — right side, overlapping top border */}
      <div className="absolute top-[-80px] md:top-[-120px] right-[-30px] w-[140px] md:w-[220px] h-[140px] md:h-[220px] z-0 pointer-events-none">
        <Image src="/lemonfresh.png" alt="" fill className="object-contain" unoptimized />
      </div>


      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch gap-10 lg:gap-16">
          {/* LEFT — Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="flex-1 min-h-[350px] md:min-h-[450px] rounded-2xl overflow-hidden shadow-lg border border-navy/10"
          >
            <iframe
              src="https://maps.google.com/maps?q=Dudhat+Food+and+Beverages+Pvt+Ltd,+Vatva,+Ahmedabad&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "350px" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Tangent Head Office Location"
            />
          </motion.div>

          {/* RIGHT — Come Say Hi */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex-1 flex flex-col justify-center max-w-[500px]"
          >
            <p className="text-[10px] font-bold tracking-[.18em] uppercase text-navy/60 mb-2">
              VISIT US
            </p>

            <h2 className="font-fraunces font-black text-navy text-[36px] md:text-[44px] lg:text-[50px] leading-[1.05] mb-5">
              Come Say Hi!
            </h2>

            <p className="text-ink/70 text-[14px] md:text-[15px] leading-[1.6] mb-8 max-w-[400px]">
              We&apos;d love to meet you. Visit our head office or reach out to us anytime.
            </p>

            {/* Address */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-coral/10 border border-coral/20 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-[18px] h-[18px] text-coral" />
              </div>
              <div>
                <p className="text-navy text-[14px] font-bold mb-1">Tangent Beverages Pvt. Ltd.</p>
                <a href="https://maps.app.goo.gl/o6dzxNeU23BfYuhA6" target="_blank" rel="noopener noreferrer" className="text-ink/60 text-[13px] leading-[1.5] hover:text-coral transition-colors block">
                  Dudhat Food and Beverages Pvt Ltd,<br />
                  Plot no 4802, phase IV, GICC, B/H Indo German Tool Room,<br />
                  Vatva, Ahmedabad-382445
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue/10 border border-blue/20 flex items-center justify-center shrink-0">
                <Mail className="w-[18px] h-[18px] text-blue" />
              </div>
              <div>
                <p className="text-navy text-[14px] font-bold">info@tangentfnb.com</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#73A642]/10 border border-[#73A642]/20 flex items-center justify-center shrink-0">
                <Phone className="w-[18px] h-[18px] text-[#73A642]" />
              </div>
              <div>
                <p className="text-navy text-[14px] font-bold">9724565952</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

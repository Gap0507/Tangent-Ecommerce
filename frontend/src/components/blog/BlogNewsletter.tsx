"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export function BlogNewsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter subscribed:", email);
    setEmail("");
  };

  return (
    <section className="relative bg-navy py-16 md:py-24 px-6 md:px-12 overflow-hidden">
      {/* Background decorations - using existing splash/fruit images to simulate the look */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 opacity-40 mix-blend-screen">
        <Image src="/realrefreshmentsection.png" alt="" fill className="object-cover" unoptimized />
      </div>
      
      {/* Left side decorative watermelon (like the reference) */}
      <div className="absolute bottom-[-20px] left-[-30px] w-[150px] md:w-[220px] h-[150px] md:h-[220px] pointer-events-none z-0 rotate-[15deg]">
        <Image src="/watermelonfruit.png" alt="" fill className="object-contain" unoptimized />
      </div>

      {/* Right side decorative lemon (like the reference) */}
      <div className="absolute bottom-[-10px] right-[-20px] w-[120px] md:w-[180px] h-[120px] md:h-[180px] pointer-events-none z-0">
        <Image src="/lemonfresh.png" alt="" fill className="object-contain" unoptimized />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-20">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="flex-1 md:max-w-[400px] text-center md:text-left"
          >
            <p className="text-[10px] font-bold tracking-[.18em] uppercase text-cream/50 mb-3">
              STAY IN THE LOOP
            </p>
            <h2 className="font-fraunces font-black text-cream text-[36px] md:text-[48px] leading-[1.05]">
              New Flavors.<br />
              <span className="text-[#73A642]">Fresh Thoughts.</span>
            </h2>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-[500px]"
          >
            <p className="text-cream/70 text-[14px] md:text-[15px] leading-[1.6] mb-6 text-center md:text-left">
              Subscribe to get the latest blog updates, wellness tips and exclusive offers.
            </p>
            
            <form onSubmit={handleSubmit} className="flex items-center w-full bg-white rounded-full p-1.5 shadow-lg">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-transparent border-none outline-none px-6 text-[14px] text-navy placeholder:text-navy/40 font-medium"
              />
              <button
                type="submit"
                className="w-12 h-12 shrink-0 bg-[#E5B54B] hover:bg-[#d6a538] rounded-full flex items-center justify-center transition-colors text-navy cursor-pointer"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

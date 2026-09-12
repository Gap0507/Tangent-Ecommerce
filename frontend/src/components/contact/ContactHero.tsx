"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Mail, Phone, Clock, CheckCircle2 } from "lucide-react";

export function ContactHero() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      
      if (data.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <section className="relative bg-cream overflow-hidden pt-[150px] pb-16 md:pt-12 md:pb-24 px-6 md:px-12">
      {/* ── Decorative Fruit & Leaf Elements ── */}
      {/* Top-left watermelon */}
      <div className="absolute top-[-30px] left-[-30px] w-[140px] md:w-[200px] h-[140px] md:h-[200px] z-0 pointer-events-none rotate-[-15deg]">
        <Image src="/watermelonfruit.png" alt="" fill className="object-contain" />
      </div>

      {/* Top-right lemon */}
      <div className="absolute top-[-20px] right-[-20px] w-[120px] md:w-[180px] h-[120px] md:h-[180px] z-0 pointer-events-none">
        <Image src="/lemonfresh.png" alt="" fill className="object-contain" />
      </div>

      {/* Bottom-left watermelon */}
      <div className="absolute bottom-[-40px] left-[-20px] md:bottom-[-60px] md:left-[-40px] w-[120px] md:w-[200px] h-[120px] md:h-[200px] z-0 pointer-events-none rotate-[20deg]">
        <Image src="/watermelonfruit.png" alt="" fill className="object-contain" />
      </div>

      {/* Top-right leaf */}
      <div className="absolute top-[40px] right-[60px] md:right-[120px] w-[60px] md:w-[90px] h-[60px] md:h-[90px] z-0 pointer-events-none rotate-[30deg]">
        <Image src="/assets/images/leaf/2.png" alt="" fill className="object-contain" />
      </div>

      {/* Bottom-right leaf */}
      <div className="absolute bottom-[20px] right-[-20px] md:bottom-[40px] md:right-[-40px] w-[70px] md:w-[120px] h-[70px] md:h-[120px] z-0 pointer-events-none rotate-[-20deg]">
        <Image src="/assets/images/leaf/1.png" alt="" fill className="object-contain" />
      </div>

      {/* Left leaf */}
      <div className="absolute top-[50%] left-[-15px] w-[60px] md:w-[80px] h-[60px] md:h-[80px] z-0 pointer-events-none rotate-[45deg]">
        <Image src="/assets/images/leaf/1.png" alt="" fill className="object-contain" />
      </div>

      {/* ── Main Content ── */}
      <div className="relative z-10 max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-center gap-8 lg:gap-8 xl:gap-12">
          {/* LEFT COLUMN — Text + Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex-1 max-w-[420px] lg:max-w-[380px] lg:ml-12 xl:ml-16"
          >
            <p className="text-[10px] font-bold tracking-[.18em] uppercase text-navy/60 mb-3">
              WE&apos;D LOVE TO HEAR FROM YOU
            </p>

            <h1 className="font-fraunces font-black text-navy text-[52px] md:text-[64px] lg:text-[72px] leading-[1.0] mb-5">
              Let&apos;s<br />Connect.
            </h1>

            <p className="text-ink/70 text-[14px] md:text-[15px] leading-[1.6] mb-8 max-w-[340px]">
              Have a question, feedback, or just want to say hi? We&apos;re here for you. Drop us a message and we&apos;ll get back to you soon.
            </p>

            {/* Contact Info Rows */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                  <Mail className="w-[18px] h-[18px] text-cream" />
                </div>
                <div>
                  <p className="text-navy text-[13px] font-bold">Email Us</p>
                  <p className="text-ink/60 text-[12px]">info@tangentfnb.com</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                  <Phone className="w-[18px] h-[18px] text-cream" />
                </div>
                <div>
                  <p className="text-navy text-[13px] font-bold">Call Us</p>
                  <p className="text-ink/60 text-[12px]">9724565952</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center shrink-0">
                  <Clock className="w-[18px] h-[18px] text-cream" />
                </div>
                <div>
                  <p className="text-navy text-[13px] font-bold">Working Hours</p>
                  <p className="text-ink/60 text-[12px]">Mon – Sat: 10 AM – 6 PM</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CENTER — Can Image (desktop only) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative w-[380px] h-[520px] shrink-0 self-end mb-[-80px]"
          >
            <Image
              src="/contactherocan.png"
              alt="Tangent Watermelon Mint Can"
              fill
              className="object-contain"
            />
          </motion.div>

          {/* RIGHT COLUMN — Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="w-full lg:w-[420px] shrink-0"
          >
            <div className="bg-navy rounded-2xl p-7 md:p-9 shadow-2xl">
              <h2 className="font-fraunces font-black text-cream text-[22px] md:text-[26px] mb-6">
                Send Us a Message
              </h2>

              {status === "success" ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="flex flex-col items-center justify-center py-8 text-center"
                >
                  <div className="w-20 h-20 bg-[#73A642]/20 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-10 h-10 text-[#73A642]" />
                  </div>
                  <h3 className="font-fraunces font-black text-cream text-[24px] mb-2">Message Sent!</h3>
                  <p className="text-cream/70 text-[14px]">Thanks for reaching out. We&apos;ll get back to you shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white text-navy text-[14px] px-5 py-3.5 rounded-lg outline-none placeholder:text-navy/40 font-medium"
                    required
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white text-navy text-[14px] px-5 py-3.5 rounded-lg outline-none placeholder:text-navy/40 font-medium"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white text-navy text-[14px] px-5 py-3.5 rounded-lg outline-none placeholder:text-navy/40 font-medium"
                  />
                  <textarea
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full bg-white text-navy text-[14px] px-5 py-3.5 rounded-lg outline-none placeholder:text-navy/40 font-medium resize-none"
                    required
                  />

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="inline-flex items-center justify-center gap-3 bg-[#1A2A3A] hover:bg-navy disabled:opacity-70 disabled:hover:scale-100 text-cream font-bold text-[14px] px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-[1.03] shadow-lg mt-2 border border-cream/20 cursor-pointer self-start"
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {status === "error" && (
                    <p className="text-red-400 text-[13px] font-bold mt-2">
                      {errorMessage}
                    </p>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

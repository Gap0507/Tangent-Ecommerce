"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X } from "lucide-react";

const faqs = [
  {
    question: "What makes Tangent drinks different?",
    answer:
      "Tangent drinks are crafted with 100% real fruit extracts and natural botanicals. We use zero added sugar, zero artificial flavors, and zero artificial colors. Every can is a refreshing blend of honest ingredients that taste amazing without the guilt.",
  },
  {
    question: "Do Tangent drinks contain added sugar?",
    answer:
      "No! All Tangent drinks are completely free of added sugar. We use natural fruit extracts and botanicals to deliver delicious flavors without any added sweeteners, making them a healthier alternative to traditional soft drinks.",
  },
  {
    question: "Where can I buy Tangent drinks?",
    answer:
      "You can purchase Tangent drinks directly from our website, or find them at select retail stores and online marketplaces across India. Check our Store Locator page for the nearest retail partner.",
  },
  {
    question: "Do you offer bulk or corporate orders?",
    answer:
      "Yes! We offer bulk and corporate ordering options for offices, events, and wholesale partners. Please reach out to us at hello@tangentsdrinks.com or fill out the contact form above with your requirements.",
  },
  {
    question: "How should I store Tangent drinks?",
    answer:
      "For the best taste experience, store your Tangent drinks in a cool, dry place away from direct sunlight. We recommend refrigerating before serving for maximum refreshment. Once opened, consume within 24 hours.",
  },
];

export function ContactFAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="relative bg-cream overflow-hidden py-16 md:py-24 px-6 md:px-12">
      {/* Decorative watermelon — bottom left */}
      <div className="absolute bottom-[-20px] left-[-20px] w-[100px] md:w-[160px] h-[100px] md:h-[160px] z-0 pointer-events-none rotate-[15deg]">
        <Image src="/watermelonfruit.png" alt="" fill className="object-contain" unoptimized />
      </div>

      {/* Decorative leaf — top right */}
      <div className="absolute top-[20px] right-[-10px] w-[60px] md:w-[90px] h-[60px] md:h-[90px] z-0 pointer-events-none rotate-[-25deg]">
        <Image src="/assets/images/leaf/2.png" alt="" fill className="object-contain" unoptimized />
      </div>

      <div className="relative z-10 max-w-[720px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-[10px] font-bold tracking-[.18em] uppercase text-navy/60 mb-3">
            FAQS
          </p>
          <h2 className="font-fraunces font-black text-navy text-[32px] md:text-[40px] lg:text-[46px] leading-[1.1]">
            Frequently Asked Questions
          </h2>
        </motion.div>

        <div className="flex flex-col">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="border-b border-navy/10"
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between py-5 text-left cursor-pointer group"
              >
                <span className="text-navy text-[14px] md:text-[15px] font-semibold pr-4 group-hover:text-blue transition-colors">
                  {faq.question}
                </span>
                <div className="w-7 h-7 rounded-full border border-navy/20 flex items-center justify-center shrink-0 group-hover:border-blue/40 transition-colors">
                  {openIdx === idx ? (
                    <X className="w-3.5 h-3.5 text-navy" />
                  ) : (
                    <Plus className="w-3.5 h-3.5 text-navy" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIdx === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <p className="text-ink/70 text-[13px] md:text-[14px] leading-[1.7] pb-5 pr-10">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

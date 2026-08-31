"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function Blog3DetailsContent() {
  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          
          {/* LEFT — Article Text */}
          <div className="flex-1 w-full max-w-[650px]">
            <article className="prose prose-lg prose-navy max-w-none text-ink/80 text-[15px] md:text-[16px] leading-[1.8]">
              <p className="mb-10">
                When you're looking for an alternative to everyday citrus, Yuzu steps up to the plate. This vibrant Japanese fruit is transforming the way we experience refreshment, offering a complex flavor profile that invigorates the senses.
              </p>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#E8AE29] text-[24px] md:text-[28px] mb-4">
                  What Exactly is Yuzu?
                </h2>
                <p>
                  Often described as a cross between a lemon, mandarin, and grapefruit, Yuzu delivers a sharp, tart, and highly aromatic experience. It's a powerhouse of Vitamin C and essential antioxidants, celebrated for both its culinary and wellness benefits.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#E8AE29] text-[24px] md:text-[28px] mb-4">
                  A Touch of Mint
                </h2>
                <p>
                  To balance the bold acidity of Yuzu, we introduce a crisp hint of mint. Mint not only provides a cooling sensation but aids digestion, making every sip as soothing as it is energizing.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#E8AE29] text-[24px] md:text-[28px] mb-4">
                  The Ultimate Refresher
                </h2>
                <p>
                  Together, Yuzu and Mint form a vibrant harmony. It's the perfect daytime pick-me-up, cutting through the heat with a sophisticated edge that you just won't find in a standard lemonade.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#E8AE29] text-[24px] md:text-[28px] mb-4">
                  Final Sip
                </h2>
                <p>
                  At Tangent, we believe in bold, real flavors. Our Yuzu Mint drink is crafted for those who want their hydration to be anything but ordinary. Zesty, cool, and totally revitalizing.
                </p>
              </div>

              <p className="font-bold text-navy">
                Real ingredients. Real refreshment.
              </p>
            </article>
          </div>

          {/* RIGHT — Supporting Images Stack */}
          <div className="lg:w-[450px] shrink-0 flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image src="/blogdetails/can3yulu/img1.png" alt="Yuzu fruit" fill className="object-cover" unoptimized />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image src="/blogdetails/can3yulu/img2.png" alt="Mint leaves" fill className="object-cover" unoptimized />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image src="/blogdetails/can3yulu/img3.png" alt="Yuzu drink" fill className="object-cover" unoptimized />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function Blog2DetailsContent() {
  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          
          {/* LEFT — Article Text */}
          <div className="flex-1 w-full max-w-[650px]">
            <article className="prose prose-lg prose-navy max-w-none text-ink/80 text-[15px] md:text-[16px] leading-[1.8]">
              <p className="mb-10">
                When it comes to natural refreshment, few combinations are as timeless and invigorating as watermelon and cranberry. Together, they create a burst of flavor that's not only delicious but also incredibly good for you.
              </p>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#3679B9] text-[24px] md:text-[28px] mb-4">
                  The Hydrating Power of Watermelon
                </h2>
                <p>
                  Watermelon is made up of over 90% water, making it one of the most hydrating fruits you can enjoy. It's packed with essential vitamins like A and C, and antioxidants like lycopene, which help fight free radicals and support heart health.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#3679B9] text-[24px] md:text-[28px] mb-4">
                  Cranberry: The Tart Twist
                </h2>
                <p>
                  Cranberry adds more than just a refreshing tartness. It aids digestion, soothes the senses, and leaves you feeling cool and energized. It's the perfect berry to balance the natural sweetness of watermelon.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#3679B9] text-[24px] md:text-[28px] mb-4">
                  Better Together
                </h2>
                <p>
                  When blended, watermelon and cranberry create a flavor that's light, crisp, and revitalizing. It's no wonder this combo is a summer favorite and the star of our Watermelon Cranberry drink.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#3679B9] text-[24px] md:text-[28px] mb-4">
                  Final Sip
                </h2>
                <p>
                  At Tangent, we believe in real ingredients and real benefits. Our new hydration drinks are crafted to keep you hydrated, refreshed, and feeling your best — naturally.
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
              <Image src="/blogdetails/can2watermeloncranberry/img1.png" alt="Watermelon slices" fill className="object-cover" unoptimized />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image src="/blogdetails/can2watermeloncranberry/img2.png" alt="Cranberry splash" fill className="object-cover" unoptimized />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image src="/blogdetails/can2watermeloncranberry/img3.png" alt="Watermelon Cranberry drink" fill className="object-cover" unoptimized />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

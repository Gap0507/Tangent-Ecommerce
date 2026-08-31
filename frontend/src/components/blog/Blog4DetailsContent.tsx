"use client";

import Image from "next/image";
import { motion } from "motion/react";

export function Blog4DetailsContent() {
  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          
          {/* LEFT — Article Text */}
          <div className="flex-1 w-full max-w-[650px]">
            <article className="prose prose-lg prose-navy max-w-none text-ink/80 text-[15px] md:text-[16px] leading-[1.8]">
              <p className="mb-10">
                It's time to disrupt the ordinary. The pairing of tropical guava and fiery chilli isn't just a flavor—it's an experience. We've taken the lush, sweet profile of guava and given it a daring kick that will redefine your refreshment routine.
              </p>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#6A9A4A] text-[24px] md:text-[28px] mb-4">
                  The Sweetness of Guava
                </h2>
                <p>
                  Guava is a tropical powerhouse, celebrated for its unique, floral sweetness and incredibly high levels of Vitamin C. It provides a smooth, luscious base that instantly transports you to a sun-drenched paradise.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#6A9A4A] text-[24px] md:text-[28px] mb-4">
                  The Kick of Chilli
                </h2>
                <p>
                  Chilli isn't just for savory dishes. The capsaicin in chilli peppers can boost metabolism and trigger endorphins. When paired with fruit, it cuts through the sweetness, leaving a lingering warmth that is completely addictive.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#6A9A4A] text-[24px] md:text-[28px] mb-4">
                  Better Together
                </h2>
                <p>
                  This combination is a masterclass in contrast. The initial burst of tropical fruit is seamlessly followed by a gentle, spicy warmth. It's bold, unexpected, and absolutely exhilarating to drink.
                </p>
              </div>

              <div className="mb-12">
                <h2 className="font-fraunces font-black text-[#6A9A4A] text-[24px] md:text-[28px] mb-4">
                  Final Sip
                </h2>
                <p>
                  At Tangent, we believe in pushing boundaries. Our Guava Chilli drink is crafted for the adventurous, providing hydration with an unforgettable edge. Step out of your comfort zone and take a sip.
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
              <Image src="/blogdetails/can4guavachilli/img1.png" alt="Guava slices" fill className="object-cover" unoptimized />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image src="/blogdetails/can4guavachilli/img2.png" alt="Chilli peppers" fill className="object-cover" unoptimized />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-lg"
            >
              <Image src="/blogdetails/can4guavachilli/img3.png" alt="Guava Chilli drink" fill className="object-cover" unoptimized />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import { BlogCard } from "./BlogCard";

const blogPosts = [
  {
    id: 1,
    imageSrc: "/can2blogcard.png",
    category: "Ingredients",
    date: "May 20, 2024",
    title: "Why Watermelon & Mint Make the Perfect Pair",
    excerpt: "Cool, refreshing, and naturally hydrating – discover how this dynamic duo keeps you fresh all day.",
    link: "/blog/watermelon-mint",
    bgColor: "",
  },
  {
    id: 2,
    imageSrc: "/can1blogcard.png",
    category: "Wellness",
    date: "May 10, 2024",
    title: "Hydration, But Make It Delicious",
    excerpt: "Drinks that hydrate and delight. Here's how Tangent keeps it balanced.",
    link: "/blog/hydration-delicious",
    bgColor: "",
  },
  {
    id: 3,
    imageSrc: "/can4blog.png",
    category: "Lifestyle",
    date: "May 15, 2024",
    title: "The Zesty Power of Yuzu",
    excerpt: "A citrusy twist with Japanese roots. Here's why yuzu is more than just a flavor.",
    link: "/blog/zesty-power-yuzu",
    bgColor: "",
  },
  {
    id: 4,
    imageSrc: "/can3blogcard.png",
    category: "Lifestyle",
    date: "May 05, 2026",
    title: "Spice Meets Sweet: A Bold Combo",
    excerpt: "Guava and chilli bring the heat and the sweet. Here's why bold flavors are the new cool.",
    link: "/blog/spice-meets-sweet",
    bgColor: "",
  },
];

export function BlogGrid() {
  return (
    <section className="bg-cream py-12 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlogCard {...post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

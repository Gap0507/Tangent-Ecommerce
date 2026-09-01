"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  type Variants,
} from "motion/react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type ImageItem = {
  id: number | string;
  title: string;
  desc: string;
  url: string;
  span: string;
};

interface InteractiveImageBentoGalleryProps {
  imageItems: ImageItem[];
  title: string;
  description: string;
}

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 15 },
  },
};

const ImageModal = ({
  item,
  onClose,
}: {
  item: ImageItem;
  onClose: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl p-2 md:p-4 bg-navy/90 rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full h-[60vh] md:h-[75vh]">
          <Image
            src={item.url}
            alt={item.title}
            fill
            className="h-auto max-h-[85vh] w-full rounded-lg object-contain"
            unoptimized
          />
        </div>
        <div className="p-4 bg-navy text-white rounded-b-lg">
          <h3 className="text-xl font-bold font-fraunces">{item.title}</h3>
          <p className="text-sm text-white/70 mt-1 font-medium">{item.desc}</p>
        </div>
      </motion.div>
      <button
        onClick={onClose}
        className="absolute right-6 top-6 text-white/80 transition-colors hover:text-white bg-black/40 p-2 rounded-full backdrop-blur-sm"
        aria-label="Close image view"
      >
        <X size={24} />
      </button>
    </motion.div>
  );
};

export const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ imageItems, title, description }) => {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null);
  const [dragConstraint, setDragConstraint] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateConstraints = () => {
      if (gridRef.current && containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const gridWidth = gridRef.current.scrollWidth;
        const newConstraint = Math.min(0, containerWidth - gridWidth - 32);
        setDragConstraint(newConstraint);
      }
    };

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);
    return () => window.removeEventListener("resize", calculateConstraints);
  }, [imageItems]);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [30, 0]);

  return (
    <section
      ref={targetRef}
      className="relative w-full overflow-hidden bg-cream py-16 sm:py-24 border-t border-navy/10"
    >
      <motion.div
        style={{ opacity, y }}
        className="container mx-auto px-4 text-center"
      >
        <p className="text-[12px] font-bold tracking-[.22em] uppercase text-coral mb-3">
          Gallery
        </p>
        <h2 className="text-3xl font-fraunces font-black text-navy tracking-tight sm:text-5xl">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg text-ink/70 font-medium">
          {description}
        </p>
      </motion.div>

      <div
        ref={containerRef}
        className="max-w-[1280px] mx-auto px-4 md:px-8 mt-12"
      >
        <motion.div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-4 auto-rows-[250px] md:auto-rows-[300px] gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {imageItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className={cn(
                "group relative flex min-h-[250px] md:min-h-[300px] w-full cursor-pointer items-end overflow-hidden rounded-2xl border border-navy/10 bg-white p-5 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                item.span
              )}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
              onClick={() => setSelectedItem(item)}
              onKeyDown={(e) => e.key === "Enter" && setSelectedItem(item)}
              tabIndex={0}
              aria-label={`View ${item.title}`}
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                unoptimized
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="relative z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="text-lg font-bold text-white font-fraunces">{item.title}</h3>
                <p className="mt-1 text-sm text-white/80 font-medium">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <ImageModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

const defaultImageItems: ImageItem[] = [
  {
    id: 1,
    title: "Focus at Work",
    desc: "Stay sharp during those deep work hours.",
    url: "/can1card.png",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    id: 2,
    title: "Weekend Vibes",
    desc: "Your perfect companion for laid-back weekends.",
    url: "/can2card.png",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 3,
    title: "Post Workout",
    desc: "Rehydrate. Refresh. Reset.",
    url: "/can3card.png",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    id: 4,
    title: "Sunset Chaser",
    desc: "Unwind with a drink that hits different.",
    url: "/can4card.png",
    span: "md:col-span-2 md:row-span-1",
  },
];

export function BentoGallerySection() {
  return (
    <InteractiveImageBentoGallery
      imageItems={defaultImageItems}
      title="Curated Moments"
      description="A collection of moments with Tangent. Drag to explore, click to expand."
    />
  );
}

export default BentoGallerySection;

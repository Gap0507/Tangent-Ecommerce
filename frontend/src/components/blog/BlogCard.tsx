"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export interface BlogCardProps {
  imageSrc: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  link: string;
  bgColor: string; // Tailored bg color class for the image wrapper
}

export function BlogCard({ imageSrc, category, date, title, excerpt, link, bgColor }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] h-full"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/4] overflow-hidden">
        <Image 
          src={imageSrc} 
          alt={title} 
          fill 
          className="object-cover object-center" 
          unoptimized
        />
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-[#EAF1E4] text-[#4A5D3A] text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full">
            {category}
          </span>
          <span className="text-ink/50 text-[12px] font-medium">{date}</span>
        </div>

        <h3 className="font-fraunces font-bold text-navy text-[20px] md:text-[22px] leading-[1.2] mb-3">
          {title}
        </h3>

        <p className="text-ink/70 text-[13px] md:text-[14px] leading-[1.6] mb-6 flex-1">
          {excerpt}
        </p>

        <Link 
          href={link}
          className="inline-flex items-center gap-2 text-navy text-[13px] font-bold group w-fit"
        >
          Read More
          <div className="w-6 h-6 rounded-full bg-navy text-cream flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1">
            <ArrowRight className="w-3 h-3" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}

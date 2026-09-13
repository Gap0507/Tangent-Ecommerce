"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, ShoppingCart, Menu } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { CartDropdown } from "@/components/cart/CartDropdown";

export function Navbar() {
  const { totalItems, isCartOpen, setIsCartOpen } = useCart();
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsCartOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsCartOpen(false);
    }, 250);
  };

  return (
    <>
      <div className="bg-navy text-cream text-center text-[13px] tracking-[.02em] py-[9px] px-4 font-medium">
        ₹49 flat rate shipping <span className="opacity-55 mx-2">•</span> Orders ₹1999+ ship FREE
      </div>

      <nav className="bg-cream grid grid-cols-3 items-center py-[18px] px-6 md:px-10 sticky top-0 z-50 border-b border-navy/10 relative">
        {/* Left Links */}
        <div className="flex items-center justify-start gap-8">
          <button
            className="md:hidden bg-transparent p-0.5 flex items-center cursor-pointer"
            aria-label="Open Menu"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6 stroke-navy" />
          </button>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/shop" className="text-[15px] font-semibold text-navy relative group">
              Shop All
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-coral transition-all duration-250 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="/track-order" className="text-[15px] font-semibold text-navy relative group">
              Track Order
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-coral transition-all duration-250 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="/contact-us" className="text-[15px] font-semibold text-navy relative group">
              Contact us
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-coral transition-all duration-250 ease-out group-hover:w-full"></span>
            </Link>
            <Link href="/blog" className="text-[15px] font-semibold text-navy relative group">
              Blog
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-coral transition-all duration-250 ease-out group-hover:w-full"></span>
            </Link>
          </div>
        </div>

        {/* Center Logo */}
        <div className="flex items-center justify-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/tangent-logo.avif"
              alt="Tangent Logo"
              width={180}
              height={46}
              className="h-[46px] w-auto object-contain"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>
        </div>

        {/* Right Icons & Cart Popover */}
        <div className="flex items-center justify-end gap-[26px]">

          {/* Cart Icon & Dropdown Trigger */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/cart"
              onClick={() => setIsCartOpen(false)}
              className="bg-transparent p-0.5 flex items-center group relative cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingCart className="w-[21px] h-[21px] stroke-navy group-hover:stroke-coral transition-colors" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-navy text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Cart Dropdown Modal */}
            <CartDropdown isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] bg-cream flex flex-col pt-8 px-8 pb-8 md:hidden overflow-y-auto animate-in fade-in duration-200">
          <div className="flex justify-between items-center mb-16">
            <Image
              src="/tangent-logo.avif"
              alt="Tangent Logo"
              width={140}
              height={36}
              className="h-[36px] w-auto object-contain"
            />
            <button
              className="p-2 rounded-full hover:bg-navy/5 transition-colors cursor-pointer"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close Menu"
            >
              <span className="text-navy font-bold text-2xl">✕</span>
            </button>
          </div>

          <div className="flex flex-col gap-8 flex-grow">
            <Link
              href="/shop"
              className="text-4xl font-black text-navy font-fraunces flex items-center justify-between group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Shop All</span>
              <span className="text-coral opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
            </Link>
            <div className="h-px w-full bg-navy/10"></div>

            <Link
              href="/track-order"
              className="text-4xl font-black text-navy font-fraunces flex items-center justify-between group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Track Order</span>
              <span className="text-coral opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
            </Link>
            <div className="h-px w-full bg-navy/10"></div>
            
            <Link
              href="/contact-us"
              className="text-4xl font-black text-navy font-fraunces flex items-center justify-between group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Contact Us</span>
              <span className="text-coral opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
            </Link>
            <div className="h-px w-full bg-navy/10"></div>

            <Link
              href="/blog"
              className="text-4xl font-black text-navy font-fraunces flex items-center justify-between group"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <span>Blog</span>
              <span className="text-coral opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">→</span>
            </Link>
            <div className="h-px w-full bg-navy/10"></div>
          </div>

          <div className="mt-auto pt-10">
            <p className="text-navy/60 text-[13px] font-bold mb-2 uppercase tracking-wider">Get in touch</p>
            <a href="mailto:info@tangentfnb.com" className="text-navy font-semibold text-[15px] block mb-1">info@tangentfnb.com</a>
            <a href="tel:9724565952" className="text-navy font-semibold text-[15px] block">+91 9724565952</a>
          </div>
        </div>
      )}
    </>
  );
}



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
        $3.49 flat rate shipping <span className="opacity-55 mx-2">•</span> Orders $40+ ship FREE
      </div>

      <nav className="bg-cream grid grid-cols-3 items-center py-[18px] px-6 md:px-10 sticky top-0 z-50 border-b border-navy/10">
        {/* Left Links */}
        <div className="flex items-center justify-start gap-8">
          <button className="md:hidden bg-transparent p-0.5 flex items-center" aria-label="Open Menu">
            <Menu className="w-6 h-6 stroke-navy" />
          </button>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/shop" className="text-[15px] font-semibold text-navy relative group">
              Shop All
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
              style={{ width: "auto" }}
              priority
            />
          </Link>
        </div>

        {/* Right Icons & Cart Popover */}
        <div className="flex items-center justify-end gap-[26px]">
          <button className="bg-transparent p-0.5 flex items-center group cursor-pointer" aria-label="User Account">
            <User className="w-[21px] h-[21px] stroke-navy group-hover:stroke-coral transition-colors" />
          </button>

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
    </>
  );
}



"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Truck, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "motion/react";

const FREE_SHIPPING_THRESHOLD = 40.0;

export function CartDropdown({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { items, removeFromCart, updateQuantity, totalItems, subtotal } = useCart();

  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgressPercentage = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute right-0 top-full mt-2 w-[380px] sm:w-[420px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.18)] border border-navy/10 z-50 p-6 text-navy overflow-hidden"
          onMouseEnter={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-navy/10">
            <h3 className="font-bold text-[16px] text-navy">
              {totalItems} {totalItems === 1 ? "Item" : "Items"} in Cart
            </h3>
            <Link
              href="/cart"
              onClick={onClose}
              className="text-[13px] font-semibold text-navy/70 hover:text-navy hover:underline transition-colors"
            >
              View Cart
            </Link>
          </div>


          {/* Cart Items List */}
          {items.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-14 h-14 rounded-full bg-cream flex items-center justify-center text-navy/40 mb-3">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <p className="font-bold text-[15px] text-navy mb-1">Your cart is empty</p>
              <p className="text-[13px] text-ink/50 max-w-[200px] mb-4">
                Explore our delicious flavors and add your favorite drinks!
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="bg-navy text-white text-[13px] font-bold px-5 py-2.5 rounded-full hover:bg-navy/90 transition-all"
              >
                Shop Flavors
              </Link>
            </div>
          ) : (
            <>
              <div className="max-h-[300px] overflow-y-auto py-3 space-y-4 pr-1 scrollbar-thin">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 pb-3 border-b border-black/5 last:border-0 last:pb-0"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-16 h-16 rounded-2xl bg-[#FAF7F2] border border-black/5 flex items-center justify-center shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-contain max-h-14"
                        unoptimized
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className="font-bold text-[14px] text-navy truncate pr-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-navy/40 hover:text-navy p-0.5 transition-colors cursor-pointer"
                          aria-label="Remove item"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[11px] text-ink/50 mb-2 font-medium">{item.size}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-1 bg-[#F5F2EB] border border-navy/10 rounded-lg w-fit px-1 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-navy/70 hover:text-navy cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-[12px] font-bold px-2">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-navy/70 hover:text-navy cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right shrink-0">
                      <span className="font-bold text-[15px] text-navy">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal */}
              <div className="pt-4 border-t border-navy/10 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[14px] text-navy">Subtotal</span>
                  <span className="font-black font-fraunces text-[20px] text-navy">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
                <p className="text-[10px] text-ink/40">(Inclusive of all taxes)</p>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/cart"
                onClick={onClose}
                className="block text-center w-full bg-[#0A2540] hover:bg-[#071a2d] text-white font-bold text-[14px] py-3.5 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer mb-3"
              >
                Proceed to Checkout
              </Link>


              {/* Free Shipping Progress */}
              <div className="bg-[#EDF5E6] border border-[#D6EA85]/60 rounded-2xl p-3">
                <div className="flex items-center gap-2 text-[11px] font-bold text-[#4B7322] mb-1.5">
                  <Truck className="w-4 h-4 shrink-0" />
                  {amountNeededForFreeShipping > 0 ? (
                    <span>
                      You are <span className="font-extrabold text-[#365615]">${amountNeededForFreeShipping.toFixed(2)}</span> away from free shipping!
                    </span>
                  ) : (
                    <span className="font-extrabold text-[#365615]">🎉 You unlocked Free Shipping!</span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-white/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#6A9A4A] rounded-full transition-all duration-300"
                    style={{ width: `${shippingProgressPercentage}%` }}
                  />
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Trash2, Plus, Minus, Lock, RotateCcw, Leaf, Tag, ShoppingBag, Truck, Check } from "lucide-react";
import { useCart } from "@/context/CartContext";

const FREE_SHIPPING_THRESHOLD = 40.0;

const RECOMMENDATIONS = [
  {
    id: "watermelon-cranberry",
    name: "Watermelon Cranberry",
    size: "Pack of 4",
    price: 16.0,
    image: "/can1.png",
    canImg: "/can1.png",
  },
  {
    id: "yuzu-mint",
    name: "Yuzu Mint",
    size: "Pack of 4",
    price: 16.0,
    image: "/can4.png",
    canImg: "/can4.png",
  },
  {
    id: "guava-chilli",
    name: "Guava Chilli",
    size: "Pack of 4",
    price: 16.0,
    image: "/can3.png",
    canImg: "/can3.png",
  },
  {
    id: "watermelon-mint",
    name: "Watermelon Mint",
    size: "Pack of 4",
    price: 16.0,
    image: "/can2.png",
    canImg: "/can2.png",
  },
];

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalItems, subtotal, addToCart } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [addedRecId, setAddedRecId] = useState<string | null>(null);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0;
  const shippingFee = isFreeShipping ? 0 : 3.49;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgressPercentage = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  const grandTotal = Math.max(0, subtotal - discount + (items.length > 0 ? shippingFee : 0));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "TANGENT10") {
      setDiscount(subtotal * 0.1);
      setCouponApplied(true);
    } else if (couponCode.trim().length > 0) {
      setDiscount(5.0);
      setCouponApplied(true);
    }
  };

  const handleAddRecToCart = (rec: typeof RECOMMENDATIONS[0]) => {
    addToCart({
      productId: rec.id,
      name: rec.name,
      size: rec.size,
      price: rec.price,
      quantity: 1,
      image: rec.canImg,
    });
    setAddedRecId(rec.id);
    setTimeout(() => setAddedRecId(null), 1800);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-navy py-8 md:py-12">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[13px] text-ink/60 font-medium mb-6">
          <Link href="/" className="hover:text-navy transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-40" />
          <span className="text-navy font-semibold">Your Cart</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-navy/10 gap-4">
          <div>
            <h1 className="font-fraunces font-black text-navy text-[36px] md:text-[46px] leading-tight">
              Your Cart
            </h1>
            <p className="text-ink/60 text-[14px] font-medium mt-1">
              You have <span className="font-bold text-navy">{totalItems} {totalItems === 1 ? "item" : "items"}</span> in your cart
            </p>
          </div>
          <Link
            href="/shop"
            className="text-[14px] font-bold text-navy/70 hover:text-navy flex items-center gap-1.5 transition-colors self-start sm:self-auto hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mb-16">
          
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 flex flex-col">
            
            {items.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-navy/10 shadow-sm flex flex-col items-center justify-center my-auto min-h-[360px]">
                <div className="w-20 h-20 rounded-full bg-cream flex items-center justify-center text-navy/40 mb-4">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h2 className="font-fraunces font-bold text-[24px] text-navy mb-2">Your cart is currently empty</h2>
                <p className="text-ink/60 text-[14px] max-w-[340px] mb-6">
                  Looks like you haven&apos;t added any delicious beverages to your cart yet.
                </p>
                <Link
                  href="/shop"
                  className="bg-navy text-white font-bold text-[14px] px-8 py-3.5 rounded-full hover:bg-navy/90 transition-all shadow-md"
                >
                  Explore Flavors
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-4 md:p-6 mb-6">
                
                {/* Table Header (Desktop) */}
                <div className="hidden md:grid grid-cols-12 text-[11px] font-bold uppercase tracking-wider text-ink/40 pb-4 border-b border-navy/10 px-2">
                  <div className="col-span-6">PRODUCT</div>
                  <div className="col-span-2 text-center">PRICE</div>
                  <div className="col-span-2 text-center">QUANTITY</div>
                  <div className="col-span-2 text-right">TOTAL</div>
                </div>

                {/* Item Rows */}
                <div className="divide-y divide-navy/5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="py-5 md:py-6 flex flex-col md:grid md:grid-cols-12 gap-4 items-center px-2"
                    >
                      {/* Product Thumbnail & Details (Col 6) */}
                      <div className="md:col-span-6 flex items-center gap-4 w-full">
                        <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#FAF7F2] border border-black/5 flex items-center justify-center shrink-0 overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={72}
                            height={72}
                            className="object-contain max-h-20"
                            unoptimized
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-fraunces font-bold text-navy text-[18px] md:text-[20px] leading-tight mb-1 truncate">
                            {item.name}
                          </h3>
                          <p className="text-[12px] text-ink/50 mb-2">{item.size}</p>
                          <span className="inline-block bg-[#F5F2EB] text-navy/80 text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-navy/10">
                            {item.size}
                          </span>
                        </div>
                      </div>

                      {/* Unit Price (Col 2) */}
                      <div className="md:col-span-2 text-left md:text-center w-full md:w-auto flex md:block justify-between items-center">
                        <span className="text-[12px] text-ink/50 md:hidden">Price:</span>
                        <span className="font-bold text-[15px] text-navy">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity Controls & Remove (Col 2) */}
                      <div className="md:col-span-2 flex flex-col items-center justify-center w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-[#F5F2EB] border border-navy/15 rounded-xl px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-6 h-6 flex items-center justify-center text-navy/70 hover:text-navy cursor-pointer transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[14px] font-bold px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-6 h-6 flex items-center justify-center text-navy/70 hover:text-navy cursor-pointer transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center gap-1 text-[11px] font-medium text-ink/50 hover:text-red-500 mt-2 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>

                      {/* Total Item Price (Col 2) */}
                      <div className="md:col-span-2 text-right w-full md:w-auto flex md:block justify-between items-center border-t md:border-0 pt-2 md:pt-0">
                        <span className="text-[12px] text-ink/50 md:hidden">Total:</span>
                        <span className="font-fraunces font-black text-[20px] text-navy">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Free Shipping Banner */}
            <div className="bg-[#EDF5E6] border border-[#D6EA85]/60 rounded-3xl p-5 shadow-sm">
              <div className="flex items-center gap-3 text-[13px] font-bold text-[#365615] mb-2">
                <div className="w-8 h-8 rounded-full bg-[#6A9A4A]/20 flex items-center justify-center shrink-0 text-[#4B7322]">
                  <Truck className="w-4 h-4" />
                </div>
                {amountNeededForFreeShipping > 0 ? (
                  <span>
                    You are <span className="font-black text-[#26420B]">${amountNeededForFreeShipping.toFixed(2)}</span> away from free shipping!
                  </span>
                ) : (
                  <span className="font-extrabold text-[#26420B]">🎉 Congratulations! You unlocked Free Shipping!</span>
                )}
              </div>
              <div className="w-full h-2 bg-white/80 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6A9A4A] rounded-full transition-all duration-300"
                  style={{ width: `${shippingProgressPercentage}%` }}
                />
              </div>
            </div>

          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-navy/10 shadow-sm sticky top-28">
              
              <h2 className="font-fraunces font-black text-navy text-[24px] mb-6">
                Order Summary
              </h2>

              {/* Summary Rows */}
              <div className="space-y-3.5 text-[14px] mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-ink/70">Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-navy">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-ink/70">Shipping</span>
                  <span className={`font-bold ${isFreeShipping ? "text-[#6A9A4A]" : "text-navy"}`}>
                    {isFreeShipping ? "FREE" : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-[#6A9A4A]">
                    <span>Discount</span>
                    <span className="font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-ink/60 text-[12px]">
                  <span>Tax</span>
                  <span>Inclusive of all taxes</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="pt-4 border-t border-navy/10 mb-6 flex justify-between items-end">
                <div>
                  <span className="font-fraunces font-black text-navy text-[22px]">Total</span>
                </div>
                <div className="text-right">
                  <span className="font-fraunces font-black text-navy text-[28px]">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-6">
                <button
                  disabled={items.length === 0}
                  className="w-full bg-[#0A2540] hover:bg-[#071a2d] text-white font-bold text-[15px] py-4 rounded-2xl transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>

                {showCouponInput ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#FAF7F2] border border-navy/15 rounded-xl px-3.5 py-2.5 text-[13px] text-navy focus:outline-none focus:border-navy"
                    />
                    <button
                      type="submit"
                      className="bg-navy text-white text-[13px] font-bold px-4 py-2.5 rounded-xl hover:bg-navy/90 transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowCouponInput(true)}
                    className="w-full bg-white border border-navy/20 hover:border-navy text-navy font-bold text-[14px] py-3 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer hover:bg-navy/5"
                  >
                    <span>Apply Coupon</span>
                    <Tag className="w-4 h-4 text-navy/60" />
                  </button>
                )}
                {couponApplied && (
                  <p className="text-[12px] font-bold text-[#6A9A4A] text-center">
                    ✓ Coupon code applied successfully!
                  </p>
                )}
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-navy/10 space-y-3">
                <div className="flex items-center gap-3 text-[12.5px] font-medium text-navy/80">
                  <div className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-navy shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                  <span>100% Secure Payment</span>
                </div>

                <div className="flex items-center gap-3 text-[12.5px] font-medium text-navy/80">
                  <div className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-navy shrink-0">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                  <span>Easy Returns & Refunds</span>
                </div>

                <div className="flex items-center gap-3 text-[12.5px] font-medium text-navy/80">
                  <div className="w-7 h-7 rounded-full bg-cream flex items-center justify-center text-navy shrink-0">
                    <Leaf className="w-3.5 h-3.5" />
                  </div>
                  <span>Real Ingredients. Real Refreshment.</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* You May Also Like Section (4 Recommendation Cards) */}
        <div className="pt-8 border-t border-navy/10">
          <h2 className="font-fraunces font-black text-navy text-[28px] md:text-[34px] mb-8">
            You May Also Like
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RECOMMENDATIONS.map((rec) => {
              const isAdded = addedRecId === rec.id;
              return (
                <div
                  key={rec.id}
                  className="group bg-white rounded-3xl border border-navy/10 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                >
                  {/* Visual Container */}
                  <Link href={`/shop/${rec.id}`} className="relative w-full aspect-[4/3] overflow-hidden bg-cream/40 flex items-center justify-center p-3 cursor-pointer">
                    <Image
                      src={rec.image}
                      alt={rec.name}
                      fill
                      className="object-contain object-center group-hover:scale-105 transition-transform duration-500 p-4"
                      unoptimized
                    />
                  </Link>

                  {/* Card Content */}
                  <div className="p-5 flex items-center justify-between mt-auto">
                    <div>
                      <Link href={`/shop/${rec.id}`} className="hover:text-[#6A9A4A] transition-colors">
                        <h3 className="font-fraunces font-bold text-navy text-[17px] leading-tight mb-1">
                          {rec.name}
                        </h3>
                      </Link>
                      <span className="font-fraunces font-black text-navy text-[18px]">
                        ${rec.price.toFixed(2)}
                      </span>
                    </div>

                    <button
                      onClick={() => handleAddRecToCart(rec)}
                      disabled={isAdded}
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer shadow-sm ${
                        isAdded
                          ? "bg-[#6A9A4A] text-white"
                          : "bg-white border border-navy/20 text-navy hover:bg-navy hover:text-white hover:border-navy"
                      }`}
                      aria-label={`Add ${rec.name} to cart`}
                    >
                      {isAdded ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <ShoppingBag className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { Star, ShoppingCart, Check, Zap, Shield, Plus, Minus } from "lucide-react";
import { ProductDetails, calculatePackPrices } from "@/data/products";
import { useCart } from "@/context/CartContext";

export function ProductInfo({ product }: { product: ProductDetails }) {
  const { addToCart } = useCart();
  const [selectedPackIdx, setSelectedPackIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [packPrices, setPackPrices] = useState(product.packPrices);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && Array.isArray(resData.data)) {
          const dbProd = resData.data.find(
            (p: any) =>
              p.name.toLowerCase().includes(product.id.replace("-", " ")) ||
              product.id.toLowerCase().includes(p.name.toLowerCase().replace(/\s+/g, "-")) ||
              p.sku.toLowerCase().includes(product.id.substring(0, 4))
          );
          if (dbProd && dbProd.price) {
            setPackPrices(calculatePackPrices(dbProd.price));
          }
        }
      })
      .catch((err) => console.error("Failed to load inventory price for product info", err));
  }, [product.id]);

  const selectedPack = packPrices[selectedPackIdx] || packPrices[0];
  const totalPrice = selectedPack.price * quantity;
  const originalTotal = selectedPack.originalPrice ? selectedPack.originalPrice * quantity : undefined;

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      size: selectedPack.size,
      price: selectedPack.price,
      quantity,
      image: product.images.main,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const decrement = () => setQuantity(Math.max(1, quantity - 1));
  const increment = () => setQuantity(quantity + 1);

  return (
    <div className="flex flex-col h-full">
      {/* Badge & Title */}
      <div className="mb-3">
        {product.badge && (
          <span className="inline-block bg-[#E5EDCD] text-navy text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
            {product.badge}
          </span>
        )}
        <h1 className="font-fraunces font-black text-navy text-[32px] md:text-[42px] leading-tight mb-1">
          {product.name}
        </h1>
        <p className="text-[#6A9A4A] font-bold text-[16px] md:text-[18px]">
          {product.subtitle}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex text-[#F9D949]">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
          ))}
        </div>
        <span className="text-[13px] font-bold">{product.rating} <span className="text-ink/50 font-normal">({product.reviewsCount} reviews)</span></span>
      </div>

      {/* Description */}
      <p className="text-ink/70 text-[14px] leading-[1.6] mb-4">
        {product.description}
      </p>

      {/* Value Props */}
      <ul className="flex flex-col gap-2 mb-5">
        {product.valueProps.map((prop, idx) => (
          <li key={idx} className="flex items-center gap-2.5 text-[13px] text-navy font-medium">
            <Check className="w-4 h-4 text-[#6A9A4A]" />
            {prop}
          </li>
        ))}
      </ul>

      {/* Pack Size Selection */}
      <div className="mb-5">
        <p className="text-[12px] font-bold text-navy mb-2.5">Pack Size</p>
        <div className="flex flex-wrap gap-2 md:gap-3">
          {packPrices.map((pack, idx) => {
            const isSelected = selectedPackIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setSelectedPackIdx(idx);
                  setQuantity(1);
                }}
                className={`relative px-4 py-2.5 rounded-xl border transition-all cursor-pointer flex-1 md:flex-none text-center ${
                  isSelected 
                    ? "bg-navy text-white border-navy" 
                    : "bg-transparent text-navy border-navy/20 hover:border-navy"
                }`}
              >
                <div className="text-[13px] font-bold">{pack.size}</div>
                {pack.savings && (
                  <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-[#6A9A4A]'}`}>
                    {pack.savings}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity & Price */}
      <div className="mb-5 flex gap-3">
         {/* Quantity Selector */}
         <div className="flex-1 flex items-center">
           <div className="flex items-center justify-between bg-white border border-navy/15 rounded-xl w-[120px] h-[48px] px-2">
             <button onClick={decrement} className="w-8 h-8 flex items-center justify-center text-navy/60 hover:text-navy cursor-pointer hover:bg-navy/5 rounded-lg transition-colors">
               <Minus className="w-4 h-4" />
             </button>
             <span className="font-bold text-[15px]">{quantity}</span>
             <button onClick={increment} className="w-8 h-8 flex items-center justify-center text-navy/60 hover:text-navy cursor-pointer hover:bg-navy/5 rounded-lg transition-colors">
               <Plus className="w-4 h-4" />
             </button>
           </div>
         </div>
         
         {/* Price Display */}
         <div className="flex-1 flex flex-col justify-center">
           <div className="flex items-end gap-2">
             {originalTotal && (
               <span className="text-[14px] text-ink/40 line-through font-medium pb-1">
                 ₹{originalTotal}
               </span>
             )}
             <span className="font-fraunces font-black text-[28px] leading-none text-navy">
               ₹{totalPrice}
             </span>
           </div>
           <p className="text-[10px] text-ink/40 mt-1">(Inclusive of all taxes)</p>
         </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-5">
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`flex-1 h-[54px] rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
            isAdded
              ? "bg-[#6A9A4A] text-white"
              : "bg-navy text-white hover:bg-navy/90"
          }`}
        >
          {isAdded ? (
            <>
              <Check className="w-5 h-5" /> Added to Cart
            </>
          ) : (
            <>
              Add to Cart <ShoppingCart className="w-4 h-4" />
            </>
          )}
        </button>
        <button className="flex-1 h-[54px] rounded-2xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all cursor-pointer bg-white text-navy border border-navy/15 hover:border-navy hover:bg-navy/5 shadow-sm">
          Buy Now <Zap className="w-4 h-4" />
        </button>
      </div>

      {/* Delivery Info */}
      <div className="bg-[#E5EDCD]/40 border border-[#E5EDCD] rounded-2xl p-4 flex items-start gap-4">
        <div className="mt-0.5">
           <Shield className="w-5 h-5 text-[#6A9A4A]" />
        </div>
        <div>
          <p className="font-bold text-[13px] text-navy">Estimated delivery: 2-4 business days</p>
          <p className="text-[12px] text-ink/60 mt-0.5">Free shipping on orders above ₹1999</p>
        </div>
      </div>

    </div>
  );
}


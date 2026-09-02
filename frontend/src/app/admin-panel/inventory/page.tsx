"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Package,
  AlertCircle,
  Eye,
  Pencil,
  Trash2,
  Lightbulb,
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  size: string;
  sku: string;
  price: number;
  stock: number;
  active: boolean;
  image: string;
}

const INITIAL_INVENTORY_DATA: InventoryItem[] = [
  {
    id: "watermelon-mint",
    name: "Watermelon Mint",
    size: "250ml",
    sku: "TNG-WM-250",
    price: 149,
    stock: 150,
    active: true,
    image: "/can2.png",
  },
  {
    id: "yuzu-mint",
    name: "Yuzu Mint",
    size: "250ml",
    sku: "TNG-YZ-250",
    price: 149,
    stock: 120,
    active: true,
    image: "/can4.png",
  },
  {
    id: "guava-chilli",
    name: "Guava Chilli",
    size: "250ml",
    sku: "TNG-GC-250",
    price: 149,
    stock: 80,
    active: true,
    image: "/can3.png",
  },
  {
    id: "watermelon-cranberry",
    name: "Watermelon Cranberry",
    size: "250ml",
    sku: "TNG-WC-250",
    price: 149,
    stock: 60,
    active: true,
    image: "/can1.png",
  },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY_DATA);

  const handleStockChange = (id: string, newStock: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: Math.max(0, newStock) } : item))
    );
  };

  const handleToggleActive = (id: string) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const totalProducts = inventory.length;
  const totalStock = inventory.reduce((acc, curr) => acc + curr.stock, 0);
  const outOfStockCount = inventory.filter((item) => item.stock === 0).length;
  const lowStockCount = inventory.filter((item) => item.stock > 0 && item.stock <= 60).length;

  return (
    <div className="space-y-6">
      
      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Products */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Total Products</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">{totalProducts}</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">Active SKUs</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#7E22CE] shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Total Stock */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Total Stock</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">{totalStock}</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">Units in stock</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#EDF5E6] flex items-center justify-center text-[#4B7322] shrink-0">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Out of Stock */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Out of Stock</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">{outOfStockCount}</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">Products</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Low Stock */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12.5px] font-bold text-ink/60 mb-1">Low Stock</p>
            <h3 className="font-fraunces font-black text-[28px] text-navy leading-none mb-1">{lowStockCount}</h3>
            <p className="text-[11.5px] text-ink/50 font-medium">{lowStockCount === 1 ? "Product" : "Products"}</p>
          </div>
          <div className="w-13 h-13 rounded-2xl bg-[#E8F2FD] flex items-center justify-center text-[#1E73BE] shrink-0">
            <Eye className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Inventory Table Container */}
      <div className="bg-white rounded-3xl border border-navy/10 shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-ink/40 border-b border-navy/10 pb-4">
                <th className="pb-3 px-2">PRODUCT</th>
                <th className="pb-3 px-2">SKU</th>
                <th className="pb-3 px-2">PRICE</th>
                <th className="pb-3 px-2 text-center">STOCK (UNITS)</th>
                <th className="pb-3 px-2 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {inventory.map((item) => {
                const isLowStock = item.stock <= 60 && item.stock > 0;
                const isOutOfStock = item.stock === 0;

                return (
                  <tr key={item.id} className="hover:bg-cream/20 transition-colors">
                    {/* Product Name & Thumbnail */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-black/5 p-1 flex items-center justify-center shrink-0">
                          <Image src={item.image} alt={item.name} width={40} height={40} className="object-contain max-h-10" unoptimized />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy text-[14px] leading-tight">{item.name}</h4>
                          <p className="text-[11.5px] text-ink/50">{item.size}</p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-4 px-2 font-mono font-medium text-navy/70 text-[12.5px] whitespace-nowrap">
                      {item.sku}
                    </td>

                    {/* Price */}
                    <td className="py-4 px-2 font-bold text-navy text-[14px] whitespace-nowrap">
                      ₹{item.price}
                    </td>

                    {/* Stock Units Input & Helper Text */}
                    <td className="py-4 px-2">
                      <div className="flex flex-col items-center justify-center">
                        <input
                          type="number"
                          value={item.stock}
                          onChange={(e) => handleStockChange(item.id, parseInt(e.target.value) || 0)}
                          className="w-24 bg-[#FAF7F2] border border-navy/15 rounded-xl text-center py-2 text-[14px] font-bold text-navy focus:outline-none focus:border-navy"
                        />
                        <span
                          className={`text-[11px] font-bold mt-1 ${
                            isOutOfStock
                              ? "text-red-500"
                              : isLowStock
                              ? "text-[#D97706]"
                              : "text-[#6A9A4A]"
                          }`}
                        >
                          {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </div>
                    </td>

                    {/* Active Toggle Switch */}
                    <td className="py-4 px-2">
                      <div className="flex flex-col items-center justify-center">
                        <button
                          onClick={() => handleToggleActive(item.id)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                            item.active ? "bg-[#34D399]" : "bg-gray-300"
                          }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                              item.active ? "translate-x-5" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span className="text-[11px] text-ink/50 font-medium mt-1">
                          {item.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Info Banner */}
      <div className="bg-[#FFFDF5] border border-[#FCD34D]/50 rounded-3xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-navy text-[14px]">Managing Stock</h4>
          <p className="text-[12.5px] text-navy/70 font-medium mt-0.5">
            Update the stock quantity to reflect the latest inventory. Toggle the status to hide a product on the store when it&apos;s out of stock.
          </p>
        </div>
      </div>

    </div>
  );
}

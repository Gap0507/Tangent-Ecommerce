"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  ShoppingBag,
  Package,
  AlertCircle,
  Lightbulb,
  Pencil,
  X,
  Save,
  CheckCircle2,
  Loader2
} from "lucide-react";

interface InventoryItem {
  _id: string;
  name: string;
  size?: string;
  sku: string;
  price: number;
  stock: number;
  isActive: boolean;
  image: string;
  description?: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success) {
        setInventory(data.data);
      }
    } catch (e) {
      console.error("Failed to fetch inventory", e);
    } finally {
      setLoading(false);
    }
  };

  const handleStockChange = async (id: string, newStock: number) => {
    const validStock = Math.max(0, newStock);
    setInventory((prev) =>
      prev.map((item) => (item._id === id ? { ...item, stock: validStock } : item))
    );

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: validStock })
      });
    } catch (e) {
      console.error("Failed to update stock", e);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setInventory((prev) =>
      prev.map((item) => (item._id === id ? { ...item, isActive: !currentStatus } : item))
    );

    try {
      await fetch(`/api/products/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });
    } catch (e) {
      console.error("Failed to toggle status", e);
    }
  };

  // Submit Modal Edit Form (Price, Name, SKU, Stock, etc.)
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    try {
      const res = await fetch(`/api/products/${editingItem._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingItem.name,
          sku: editingItem.sku,
          price: Number(editingItem.price),
          stock: Number(editingItem.stock),
          isActive: editingItem.isActive,
          image: editingItem.image,
          description: editingItem.description,
        })
      });

      const data = await res.json();
      if (data.success) {
        // Update local state
        setInventory((prev) =>
          prev.map((item) => (item._id === editingItem._id ? data.data : item))
        );
        setSaveSuccessMsg(`Product '${editingItem.name}' updated successfully!`);
        setEditingItem(null);
        setTimeout(() => setSaveSuccessMsg(""), 3500);
      } else {
        alert(data.error || "Failed to update product");
      }
    } catch (e: any) {
      alert("Error saving changes: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const totalProducts = inventory.length;
  const totalStock = inventory.reduce((acc, curr) => acc + curr.stock, 0);
  const outOfStockCount = inventory.filter((item) => item.stock === 0).length;
  const lowStockCount = inventory.filter((item) => item.stock > 0 && item.stock <= 60).length;

  if (loading) {
    return <div className="p-8 text-center text-navy font-bold animate-pulse">Loading inventory...</div>;
  }

  return (
    <div className="space-y-6">

      {/* Save Success Banner */}
      {saveSuccessMsg && (
        <div className="bg-[#F0FDF4] border border-[#166534]/20 text-[#166534] p-4 rounded-2xl flex items-center gap-3 font-semibold text-[14px] shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Top Header Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-navy">Inventory & Product Catalog</h2>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Card 1: Total Products */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-ink/50 mb-1">TOTAL PRODUCTS</p>
            <h3 className="text-3xl font-black text-navy">{totalProducts}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#F0F6FF] text-[#0F5394] flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Total Stock Units */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-ink/50 mb-1">TOTAL STOCK</p>
            <h3 className="text-3xl font-black text-navy">{totalStock}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#F0FDF4] text-[#166534] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Low Stock */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-ink/50 mb-1">LOW STOCK</p>
            <h3 className="text-3xl font-black text-[#D97706]">{lowStockCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#FFFBEB] text-[#D97706] flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Out of Stock */}
        <div className="bg-white rounded-3xl p-6 border border-navy/10 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[12px] font-bold text-ink/50 mb-1">OUT OF STOCK</p>
            <h3 className="text-3xl font-black text-red-500">{outOfStockCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Inventory Table */}
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
                <th className="pb-3 px-2 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-ink/50">No products found.</td>
                </tr>
              ) : inventory.map((item) => {
                const isLowStock = item.stock <= 60 && item.stock > 0;
                const isOutOfStock = item.stock === 0;

                return (
                  <tr key={item._id} className="hover:bg-cream/20 transition-colors">
                    {/* Product Name & Thumbnail */}
                    <td className="py-4 px-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-black/5 p-1 flex items-center justify-center shrink-0">
                          <Image src={item.image || "/can2.png"} alt={item.name} width={40} height={40} className="object-contain max-h-10" />
                        </div>
                        <div>
                          <h4 className="font-bold text-navy text-[14px] leading-tight">{item.name}</h4>
                          <p className="text-[11.5px] text-ink/50">{item.size || "250ml"}</p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-4 px-2 font-mono font-medium text-navy/70 text-[12.5px] whitespace-nowrap">
                      {item.sku}
                    </td>

                    {/* Price with Edit Button Indicator */}
                    <td className="py-4 px-2 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-navy text-[15px]">₹{item.price}</span>
                      </div>
                    </td>

                    {/* Stock Units Input & Helper Text */}
                    <td className="py-4 px-2">
                      <div className="flex flex-col items-center justify-center">
                        <span className="font-bold text-navy text-[15px]">{item.stock}</span>
                      </div>
                    </td>

                    {/* Active Toggle Switch */}
                    <td className="py-4 px-2">
                      <div className="flex flex-col items-center justify-center">
                        <button
                          onClick={() => handleToggleActive(item._id, item.isActive)}
                          className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${item.isActive ? "bg-[#34D399]" : "bg-gray-300"
                            }`}
                        >
                          <div
                            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${item.isActive ? "translate-x-5" : "translate-x-0"
                              }`}
                          />
                        </button>
                        <span className="text-[11px] text-ink/50 font-medium mt-1">
                          {item.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </td>

                    {/* Action Button: EDIT */}
                    <td className="py-4 px-2 text-center">
                      <button
                        onClick={() => setEditingItem({ ...item })}
                        className="inline-flex items-center gap-1.5 bg-[#091E33] hover:bg-navy text-white text-[12px] font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Product</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT PRODUCT MODAL POPUP */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-navy/10 relative overflow-hidden animate-in fade-in zoom-in-95">

            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-navy/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF7F2] border border-black/5 p-1 flex items-center justify-center shrink-0">
                  <Image src={editingItem.image || "/can2.png"} alt={editingItem.name} width={32} height={32} className="object-contain" />
                </div>
                <div>
                  <h3 className="font-fraunces font-black text-navy text-[20px]">Edit Product Details</h3>
                  <p className="text-[12px] text-ink/50 font-medium">Update pricing, stock & SKU information</p>
                </div>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="text-ink/40 hover:text-navy p-1.5 rounded-full hover:bg-cream transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="space-y-4">

              <div>
                <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  required
                  className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl px-4 py-3 text-[14px] text-navy font-bold focus:outline-none focus:border-navy"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* PRICE EDIT FIELD */}
                <div>
                  <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">
                    Price (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-navy">₹</span>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={editingItem.price}
                      onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                      required
                      className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl pl-8 pr-4 py-3 text-[14px] font-black text-navy focus:outline-none focus:border-navy"
                    />
                  </div>
                </div>

                {/* STOCK FIELD */}
                <div>
                  <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">
                    Stock (Units) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingItem.stock}
                    onChange={(e) => setEditingItem({ ...editingItem, stock: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl px-4 py-3 text-[14px] font-bold text-navy focus:outline-none focus:border-navy"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* SKU FIELD */}
                <div>
                  <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    value={editingItem.sku}
                    onChange={(e) => setEditingItem({ ...editingItem, sku: e.target.value })}
                    required
                    className="w-full bg-[#FAF7F2] border border-navy/15 rounded-2xl px-4 py-3 text-[13px] font-mono text-navy focus:outline-none focus:border-navy uppercase"
                  />
                </div>

                {/* STATUS TOGGLE */}
                <div>
                  <label className="block text-[12px] font-bold text-navy uppercase tracking-wider mb-1.5">
                    Visibility Status
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditingItem({ ...editingItem, isActive: !editingItem.isActive })}
                    className={`w-full py-3 px-4 rounded-2xl font-bold text-[13px] border flex items-center justify-between cursor-pointer transition-colors ${editingItem.isActive
                      ? "bg-[#F0FDF4] border-[#166534]/20 text-[#166534]"
                      : "bg-gray-100 border-gray-200 text-gray-600"
                      }`}
                  >
                    <span>{editingItem.isActive ? "Active (Listed)" : "Inactive (Hidden)"}</span>
                    <div className={`w-3 h-3 rounded-full ${editingItem.isActive ? "bg-[#34D399]" : "bg-gray-400"}`} />
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-navy/10 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-3 rounded-2xl border border-navy/15 text-navy font-bold text-[14px] hover:bg-cream transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 rounded-2xl bg-[#091E33] hover:bg-navy text-white font-bold text-[14px] transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Bottom Info Banner */}
      <div className="bg-[#FFFDF5] border border-[#FCD34D]/50 rounded-3xl p-5 shadow-sm flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-[#FEF3C7] flex items-center justify-center text-[#D97706] shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-navy text-[14px]">Managing Inventory & Pricing</h4>
          <p className="text-[12.5px] text-navy/70 font-medium mt-0.5">
            Click <strong>&quot;Edit Product&quot;</strong> to open the edit popup and update product prices, stock units, SKU codes, and visibility status.
          </p>
        </div>
      </div>

    </div>
  );
}

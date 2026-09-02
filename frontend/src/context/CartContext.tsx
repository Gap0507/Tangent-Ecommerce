"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCartTemporarily: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FREE_SHIPPING_THRESHOLD = 40.0;

// Initial mock cart items to match the user's reference UI nicely
const INITIAL_MOCK_ITEMS: CartItem[] = [
  {
    id: "watermelon-mint-1",
    productId: "watermelon-mint",
    name: "Watermelon Mint",
    size: "Pack of 4",
    price: 16.0,
    quantity: 1,
    image: "/can2.png",
  },
  {
    id: "yuzu-mint-1",
    productId: "yuzu-mint",
    name: "Yuzu Mint",
    size: "Pack of 4",
    price: 16.0,
    quantity: 1,
    image: "/can4.png",
  },
  {
    id: "guava-chilli-1",
    productId: "guava-chilli",
    name: "Guava Chilli",
    size: "Pack of 4",
    price: 16.0,
    quantity: 1,
    image: "/can3.png",
  },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_MOCK_ITEMS);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCartTemporarily = () => {
    setIsCartOpen(true);
  };

  const addToCart = (newItem: Omit<CartItem, "id">) => {
    setItems((prev) => {
      // Check if item with same productId and size already exists
      const existingIdx = prev.findIndex(
        (i) => i.productId === newItem.productId && i.size === newItem.size
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += newItem.quantity;
        return updated;
      } else {
        const newId = `${newItem.productId}-${Date.now()}`;
        return [...prev, { ...newItem, id: newId }];
      }
    });
    openCartTemporarily();
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        openCartTemporarily,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export type PageView =
  | "home"
  | "classes"
  | "products"
  | "free-videos"
  | "booklets"
  | "cart"
  | "about"
  | "profile";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  type: "class_monthly" | "class_term" | "video_package" | "booklet";
  grade?: string;
  teacher?: string;
  term?: string;
}

export interface PurchasedItem {
  id: string;
  name: string;
  type: "class" | "video_package" | "booklet";
  skyroomUrl?: string;
  downloadUrl?: string;
  expiresAt?: string;
  purchasedAt: string;
}

interface AppState {
  // Navigation
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;

  // Auth
  user: User | null;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  login: (user: User) => void;
  logout: () => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: () => number;

  // Purchased items
  purchases: PurchasedItem[];
  addPurchase: (item: PurchasedItem) => void;

  // Login redirect
  pendingAction: (() => void) | null;
  setPendingAction: (action: (() => void) | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentPage: "home",
      setCurrentPage: (page) => set({ currentPage: page }),

      // Auth
      user: null,
      showLoginModal: false,
      setShowLoginModal: (show) => set({ showLoginModal: show }),
      login: (user) => set({ user, showLoginModal: false }),
      logout: () => set({ user: null, currentPage: "home" }),

      // Cart
      cart: [],
      addToCart: (item) => {
        const cart = get().cart;
        const exists = cart.find((c) => c.id === item.id);
        if (!exists) {
          set({ cart: [...cart, item] });
        }
      },
      removeFromCart: (id) =>
        set({ cart: get().cart.filter((item) => item.id !== id) }),
      clearCart: () => set({ cart: [] }),
      cartTotal: () =>
        get().cart.reduce((total, item) => total + item.price, 0),

      // Purchases
      purchases: [],
      addPurchase: (item) =>
        set({ purchases: [...get().purchases, item] }),

      // Pending action
      pendingAction: null,
      setPendingAction: (action) => set({ pendingAction: action }),
    }),
    {
      name: "erfan-academy-storage",
      partialize: (state) => ({
        user: state.user,
        cart: state.cart,
        purchases: state.purchases,
      }),
    }
  )
);

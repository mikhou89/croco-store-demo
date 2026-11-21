"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ProductLite } from "./types";

export interface CartLine {
  key: string; // id + flavour
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  image: string | null;
  price: number;
  regularPrice: number | null;
  flavour?: string;
  qty: number;
}

interface StoreState {
  cart: CartLine[];
  wishlist: string[];
  ready: boolean;
  cartOpen: boolean;
  toast: string | null;
  setCartOpen: (o: boolean) => void;
  add: (p: Pick<ProductLite, "id" | "slug" | "name" | "brand" | "image" | "price" | "regularPrice">, qty?: number, flavour?: string) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  toggleWish: (id: string) => void;
  isWished: (id: string) => boolean;
  count: number;
  subtotal: number;
  savings: number;
}

const Ctx = createContext<StoreState | null>(null);
const KEY = "croco-demo-v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        setCart(Array.isArray(s.cart) ? s.cart : []);
        setWishlist(Array.isArray(s.wishlist) ? s.wishlist : []);
      }
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ cart, wishlist }));
    } catch {}
  }, [cart, wishlist, ready]);

  const flash = useCallback((m: string) => {
    setToast(m);
    clearTimeout(t.current);
    t.current = setTimeout(() => setToast(null), 2600);
  }, []);

  const add: StoreState["add"] = useCallback((p, qty = 1, flavour) => {
    const key = p.id + (flavour ? `::${flavour}` : "");
    setCart((c) => {
      const ex = c.find((l) => l.key === key);
      if (ex) return c.map((l) => (l.key === key ? { ...l, qty: Math.min(99, l.qty + qty) } : l));
      return [...c, { key, id: p.id, slug: p.slug, name: p.name, brand: p.brand, image: p.image, price: p.price, regularPrice: p.regularPrice, flavour, qty }];
    });
    setCartOpen(true);
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setCart((c) => (qty <= 0 ? c.filter((l) => l.key !== key) : c.map((l) => (l.key === key ? { ...l, qty: Math.min(99, qty) } : l))));
  }, []);
  const remove = useCallback((key: string) => setCart((c) => c.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setCart([]), []);
  const toggleWish = useCallback(
    (id: string) => {
      const has = wishlist.includes(id);
      setWishlist(has ? wishlist.filter((x) => x !== id) : [...wishlist, id]);
      flash(has ? "Retiré de vos favoris" : "Ajouté à vos favoris");
    },
    [wishlist, flash],
  );

  const value = useMemo<StoreState>(() => {
    const count = cart.reduce((a, l) => a + l.qty, 0);
    const subtotal = cart.reduce((a, l) => a + l.qty * l.price, 0);
    const savings = cart.reduce((a, l) => a + (l.regularPrice ? (l.regularPrice - l.price) * l.qty : 0), 0);
    return { cart, wishlist, ready, cartOpen, toast, setCartOpen, add, setQty, remove, clear, toggleWish, isWished: (id) => wishlist.includes(id), count, subtotal, savings };
  }, [cart, wishlist, ready, cartOpen, toast, add, setQty, remove, clear, toggleWish]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const s = useContext(Ctx);
  if (!s) throw new Error("useStore outside StoreProvider");
  return s;
}

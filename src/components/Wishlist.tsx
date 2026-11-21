"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProductLite } from "@/lib/types";
import { useStore } from "@/lib/store";
import { loadIndex } from "./Search";
import { ProductCard } from "./ProductCard";
import { HeartIcon } from "./Icons";

export function Wishlist() {
  const { wishlist, ready } = useStore();
  const [index, setIndex] = useState<ProductLite[] | null>(null);
  useEffect(() => { loadIndex().then(setIndex); }, []);
  const items = index ? wishlist.map((id) => index.find((p) => p.id === id)).filter((p): p is ProductLite => !!p) : [];
  return (
    <div className="container-x pt-8 md:pt-12">
      <h1 className="display text-5xl md:text-7xl">Mes favoris</h1>
      <p className="mt-2 text-muted">Sauvegardés sur cet appareil.</p>
      {!ready || !index ? (
        <p className="py-16 text-muted">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-card">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-bone"><HeartIcon size={28} /></div>
          <p className="display text-3xl mt-4">Aucun favori pour l&apos;instant</p>
          <p className="mt-2 text-muted">Touchez le cœur sur un produit pour le retrouver ici.</p>
          <Link href="/boutique/" className="btn btn-primary mt-6">Explorer la boutique</Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
          {items.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}

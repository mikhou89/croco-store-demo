"use client";

import Link from "next/link";
import { createContext, useContext, useEffect, useState } from "react";
import type { ProductLite } from "@/lib/types";
import { useStore } from "@/lib/store";
import { productImage } from "@/lib/format";
import { CloseIcon, ArrowRight, HeartIcon } from "./Icons";
import { DiscountTag, Price, StockBadge } from "./ProductBits";
import { QtyStepper } from "./QtyStepper";

const Ctx = createContext<{ open: (p: ProductLite) => void }>({ open: () => {} });
export const useQuickView = () => useContext(Ctx);

export function QuickViewProvider({ children }: { children: React.ReactNode }) {
  const [p, setP] = useState<ProductLite | null>(null);
  return (
    <Ctx.Provider value={{ open: setP }}>
      {children}
      {p && <QuickView p={p} onClose={() => setP(null)} />}
    </Ctx.Provider>
  );
}

function QuickView({ p, onClose }: { p: ProductLite; onClose: () => void }) {
  const { add, toggleWish, isWished } = useStore();
  const [qty, setQty] = useState(1);
  const [flavour, setFlavour] = useState(p.flavours[0]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", k);
    document.documentElement.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.documentElement.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[75] grid place-items-end md:place-items-center md:p-6" role="dialog" aria-modal="true" aria-label={`Aperçu : ${p.name}`}>
      <button className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" aria-label="Fermer" onClick={onClose} />
      <div className="relative grid w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-t-3xl md:rounded-3xl bg-white shadow-lift md:grid-cols-2 animate-pop">
        <button onClick={onClose} className="absolute right-3 top-3 z-10 grid size-10 place-items-center rounded-full bg-white/90 hover:bg-bone" aria-label="Fermer"><CloseIcon size={20} /></button>
        <div className="relative bg-[#f7f7f4] aspect-square md:aspect-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={productImage(p.image, 800)} alt={p.name} className="size-full object-contain p-8 mix-blend-multiply" />
          <DiscountTag price={p.price} regular={p.regularPrice} className="absolute left-4 top-4" />
        </div>
        <div className="p-6 md:p-8 flex flex-col">
          <p className="eyebrow text-muted">{p.brand ?? "Croco Store"}</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight">{p.shortName}</h2>
          <div className="mt-3"><StockBadge stock={p.stock} /></div>
          <div className="mt-4"><Price price={p.price} regular={p.regularPrice} size="lg" /></div>
          {p.summary && <p className="mt-4 text-[14.5px] text-ink/75 leading-relaxed line-clamp-4">{p.summary}</p>}
          {p.flavours.length > 0 && (
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold mb-2">Saveur</legend>
              <div className="flex flex-wrap gap-2">
                {p.flavours.map((f) => (
                  <button key={f} type="button" className="chip" aria-pressed={flavour === f} onClick={() => setFlavour(f)}>{f}</button>
                ))}
              </div>
            </fieldset>
          )}
          <div className="mt-6 flex items-center gap-3">
            <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, v))} />
            <button disabled={p.stock === "out_of_stock"} onClick={() => { add(p, qty, flavour); onClose(); }} className="btn btn-croco flex-1 disabled:opacity-40">Ajouter au panier</button>
            <button onClick={() => toggleWish(p.id)} className="grid size-12 place-items-center rounded-full border border-line hover:border-ink" aria-label="Favoris"><HeartIcon size={20} filled={isWished(p.id)} className={isWished(p.id) ? "text-croco" : ""} /></button>
          </div>
          <Link href={`/produit/${p.slug}/`} onClick={onClose} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold hover:text-croco">Voir la fiche complète <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
}

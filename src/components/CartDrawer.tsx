"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { productImage, tnd } from "@/lib/format";
import { SITE } from "@/lib/site";
import { CloseIcon, TrashIcon, TruckIcon, BagIcon, ArrowRight } from "./Icons";
import { QtyStepper } from "./QtyStepper";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const left = SITE.freeShippingFrom - subtotal;
  const pct = Math.min(100, (subtotal / SITE.freeShippingFrom) * 100);
  return (
    <div className="rounded-2xl bg-croco-50 p-3.5">
      <p className="flex items-center gap-2 text-[13.5px] font-medium text-forest">
        <TruckIcon size={18} />
        {left > 0 ? (<span>Plus que <b>{tnd(left)}</b> pour la livraison offerte</span>) : (<span><b>Livraison offerte</b> sur cette commande</span>)}
      </p>
      <div className="mt-2.5 h-1.5 rounded-full bg-white overflow-hidden">
        <div className="h-full rounded-full bg-croco transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, remove, subtotal, savings, count } = useStore();

  useEffect(() => {
    if (!cartOpen) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    document.addEventListener("keydown", k);
    document.documentElement.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", k); document.documentElement.style.overflow = ""; };
  }, [cartOpen, setCartOpen]);

  if (!cartOpen) return null;
  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="Panier">
      <button className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" aria-label="Fermer le panier" onClick={() => setCartOpen(false)} />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-white shadow-lift animate-slide-in">
        <div className="flex items-center justify-between px-5 h-16 border-b border-line">
          <p className="display text-2xl">Panier <span className="text-muted text-lg">({count})</span></p>
          <button className="p-2.5 -mr-2 rounded-full hover:bg-bone" onClick={() => setCartOpen(false)} aria-label="Fermer"><CloseIcon size={22} /></button>
        </div>
        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-bone"><BagIcon size={28} /></div>
            <p className="display text-3xl">Votre panier est vide</p>
            <p className="text-muted text-sm max-w-xs">Explorez nos best-sellers ou composez votre routine avec un pack.</p>
            <div className="flex gap-2 mt-2">
              <Link href="/boutique/" className="btn btn-primary" onClick={() => setCartOpen(false)}>La boutique</Link>
              <Link href="/packs/" className="btn btn-outline" onClick={() => setCartOpen(false)}>Les packs</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="px-5 pt-4"><FreeShippingMeter subtotal={subtotal} /></div>
            <ul className="flex-1 overflow-y-auto px-5 py-2 divide-y divide-line">
              {cart.map((l) => (
                <li key={l.key} className="flex gap-3.5 py-4">
                  <Link href={`/produit/${l.slug}/`} onClick={() => setCartOpen(false)} className="shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={productImage(l.image)} alt={l.name} width={84} height={84} className="size-[84px] rounded-xl bg-bone object-contain" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted truncate">{l.brand ?? "Croco Store"}</p>
                    <Link href={`/produit/${l.slug}/`} onClick={() => setCartOpen(false)} className="block text-sm font-medium leading-snug line-clamp-2 hover:text-croco">{l.name}</Link>
                    {l.flavour && <p className="text-xs text-muted mt-0.5">Saveur : {l.flavour}</p>}
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QtyStepper value={l.qty} onChange={(q) => setQty(l.key, q)} size="sm" />
                      <div className="text-right">
                        <p className="text-sm font-semibold">{tnd(l.price * l.qty)}</p>
                        {l.regularPrice && <p className="text-xs text-muted line-through">{tnd(l.regularPrice * l.qty)}</p>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => remove(l.key)} className="self-start p-1.5 rounded-full text-muted hover:text-danger hover:bg-bone" aria-label={`Retirer ${l.name}`}><TrashIcon size={17} /></button>
                </li>
              ))}
            </ul>
            <div className="border-t border-line p-5 space-y-3 bg-white">
              {savings > 0 && (
                <p className="flex justify-between text-sm"><span className="text-croco font-medium">Vos économies</span><span className="font-semibold text-croco">− {tnd(savings)}</span></p>
              )}
              <p className="flex justify-between text-base"><span className="font-medium">Sous-total</span><span className="font-bold">{tnd(subtotal)}</span></p>
              <Link href="/commande/" onClick={() => setCartOpen(false)} className="btn btn-croco w-full text-base h-14">Commander <ArrowRight size={18} /></Link>
              <Link href="/panier/" onClick={() => setCartOpen(false)} className="block text-center text-sm font-medium underline underline-offset-4">Voir le panier détaillé</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

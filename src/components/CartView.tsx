"use client";

import Link from "next/link";
import type { ProductLite } from "@/lib/types";
import { useStore } from "@/lib/store";
import { productImage, tnd } from "@/lib/format";
import { SITE } from "@/lib/site";
import { FreeShippingMeter } from "./CartDrawer";
import { QtyStepper } from "./QtyStepper";
import { ProductRail, SectionHead } from "./Section";
import { ArrowRight, ShieldIcon, TrashIcon, BagIcon } from "./Icons";

export function CartView({ suggestions }: { suggestions: ProductLite[] }) {
  const { cart, ready, setQty, remove, subtotal, savings, count } = useStore();
  if (!ready) return <div className="container-x py-24 text-center text-muted">Chargement du panier…</div>;
  return (
    <div className="container-x pt-8 md:pt-12">
      <h1 className="display text-5xl md:text-7xl">Panier</h1>
      {cart.length === 0 ? (
        <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow-card">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-bone"><BagIcon size={28} /></div>
          <p className="display text-3xl mt-4">Votre panier est vide</p>
          <div className="mt-6 flex justify-center gap-2"><Link href="/boutique/" className="btn btn-primary">La boutique</Link><Link href="/packs/" className="btn btn-outline">Les packs</Link></div>
        </div>
      ) : (
        <div className="mt-8 grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          <ul className="rounded-3xl bg-white shadow-card divide-y divide-line">
            {cart.map((l) => (
              <li key={l.key} className="flex gap-4 p-4 md:p-6">
                <Link href={`/produit/${l.slug}/`} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={productImage(l.image)} alt={l.name} className="size-24 md:size-28 rounded-2xl bg-bone object-contain p-1" />
                </Link>
                <div className="min-w-0 flex-1 flex flex-col">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">{l.brand ?? "Croco Store"}</p>
                  <Link href={`/produit/${l.slug}/`} className="font-medium leading-snug hover:text-croco">{l.name}</Link>
                  {l.flavour && <p className="text-sm text-muted">Saveur : {l.flavour}</p>}
                  <p className="text-sm text-muted mt-0.5">{tnd(l.price)} l&apos;unité</p>
                  <div className="mt-auto pt-3 flex items-center justify-between gap-3">
                    <QtyStepper value={l.qty} onChange={(q) => setQty(l.key, q)} size="sm" />
                    <p className="font-semibold">{tnd(l.price * l.qty)}</p>
                  </div>
                </div>
                <button onClick={() => remove(l.key)} className="self-start p-2 rounded-full text-muted hover:text-danger hover:bg-bone" aria-label={`Retirer ${l.name}`}><TrashIcon size={18} /></button>
              </li>
            ))}
          </ul>
          <aside className="rounded-3xl bg-white p-6 shadow-card lg:sticky lg:top-[100px] space-y-4">
            <FreeShippingMeter subtotal={subtotal} />
            <dl className="space-y-2 text-[15px]">
              <div className="flex justify-between"><dt>Articles ({count})</dt><dd>{tnd(subtotal + savings)}</dd></div>
              {savings > 0 && <div className="flex justify-between text-croco font-medium"><dt>Remises</dt><dd>− {tnd(savings)}</dd></div>}
              <div className="flex justify-between"><dt>Livraison</dt><dd>{subtotal >= SITE.freeShippingFrom ? "Offerte" : "Calculée à la commande"}</dd></div>
              <div className="flex justify-between border-t border-line pt-3 text-lg font-bold"><dt>Total</dt><dd>{tnd(subtotal)}</dd></div>
            </dl>
            <Link href="/commande/" className="btn btn-croco w-full h-14 text-base">Passer commande <ArrowRight size={18} /></Link>
            <p className="flex items-center gap-2 text-xs text-muted"><ShieldIcon size={16} /> Paiement à la livraison. Recevez, vérifiez, puis payez.</p>
          </aside>
        </div>
      )}
      {suggestions.length > 0 && (
        <section className="pt-16">
          <SectionHead eyebrow="À ne pas oublier" title="Complétez votre commande" />
          <ProductRail items={suggestions} />
        </section>
      )}
    </div>
  );
}

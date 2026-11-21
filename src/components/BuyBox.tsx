"use client";

import { useEffect, useRef, useState } from "react";
import type { ProductLite } from "@/lib/types";
import { useStore } from "@/lib/store";
import { productImage, tnd } from "@/lib/format";
import { SITE } from "@/lib/site";
import { BagIcon, HeartIcon, PhoneIcon, TruckIcon, ShieldIcon, WhatsAppIcon } from "./Icons";
import { Price, StockBadge, DiscountTag } from "./ProductBits";
import { QtyStepper } from "./QtyStepper";

export function BuyBox({ p }: { p: ProductLite }) {
  const { add, toggleWish, isWished, ready } = useStore();
  const [qty, setQty] = useState(1);
  const [flavour, setFlavour] = useState(p.flavours[0]);
  const [showBar, setShowBar] = useState(false);
  const cta = useRef<HTMLButtonElement>(null);
  const disabled = p.stock === "out_of_stock";

  useEffect(() => {
    const el = cta.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const wa = `https://wa.me/216${SITE.phone.replace(/\s/g, "")}?text=${encodeURIComponent(`Bonjour Croco Store, je souhaite commander : ${p.name}${flavour ? ` (${flavour})` : ""} x${qty}`)}`;
  const wished = ready && isWished(p.id);
  const savings = p.regularPrice ? (p.regularPrice - p.price) * qty : 0;

  return (
    <>
      <div className="flex items-center gap-3">
        <Price price={p.price} regular={p.regularPrice} size="lg" />
        <DiscountTag price={p.price} regular={p.regularPrice} />
      </div>
      {p.packValue && <p className="mt-1 text-sm text-croco font-medium">Vous économisez {tnd(p.packValue - p.price)} par rapport aux produits achetés séparément.</p>}
      <div className="mt-3"><StockBadge stock={p.stock} className="text-[13.5px]" /></div>
      {p.stock === "backorder" && <p className="mt-1 text-[13px] text-muted">Commande possible : expédition dès réception du réassort.</p>}

      {p.flavours.length > 0 && (
        <fieldset className="mt-6">
          <legend className="text-sm font-semibold mb-2.5">Saveur <span className="font-normal text-muted">· {flavour}</span></legend>
          <div className="flex flex-wrap gap-2">
            {p.flavours.map((f) => (
              <button key={f} type="button" className="chip" aria-pressed={flavour === f} onClick={() => setFlavour(f)}>{f}</button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-6 flex items-center gap-3">
        <QtyStepper value={qty} onChange={(v) => setQty(Math.max(1, v))} />
        <button ref={cta} disabled={disabled} onClick={() => add(p, qty, flavour)} className="btn btn-croco flex-1 h-14 text-base disabled:opacity-40">
          <BagIcon size={19} /> Ajouter au panier
        </button>
        <button onClick={() => toggleWish(p.id)} className={`grid size-14 shrink-0 place-items-center rounded-full border border-line bg-white hover:border-ink ${wished ? "text-croco" : ""}`} aria-label={wished ? "Retirer des favoris" : "Ajouter aux favoris"} aria-pressed={wished}>
          <HeartIcon size={21} filled={wished} />
        </button>
      </div>
      {savings > 0 && <p className="mt-2 text-[13px] text-croco font-medium">Économie de {tnd(savings)} sur le prix barré.</p>}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <a href={wa} target="_blank" rel="noopener" className="btn btn-outline h-12 text-sm"><WhatsAppIcon size={18} className="text-[#1f9d55]" /> WhatsApp</a>
        <a href={`tel:${SITE.phoneIntl}`} className="btn btn-outline h-12 text-sm"><PhoneIcon size={17} /> {SITE.phone}</a>
      </div>

      <ul className="mt-6 divide-y divide-line rounded-2xl bg-white ring-1 ring-line text-[13.5px]">
        <li className="flex items-center gap-3 p-4"><TruckIcon size={20} className="text-croco shrink-0" /> <span><b>Livraison partout en Tunisie</b>, offerte dès {SITE.freeShippingFrom} DT</span></li>
        <li className="flex items-center gap-3 p-4"><ShieldIcon size={20} className="text-croco shrink-0" /> <span><b>Paiement à la livraison</b> : recevez, vérifiez, puis payez</span></li>
      </ul>

      {/* sticky mobile add-to-cart */}
      <div className={`fixed inset-x-0 bottom-0 z-[46] border-t border-line bg-white/95 backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-transform duration-300 md:hidden ${showBar ? "translate-y-0" : "translate-y-full"}`}>
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={productImage(p.image)} alt="" className="size-12 rounded-lg bg-bone object-contain" />
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-medium truncate">{p.shortName}</p>
            <p className="text-[15px] font-bold">{tnd(p.price)}{flavour ? <span className="ml-1 text-xs font-normal text-muted">· {flavour}</span> : null}</p>
          </div>
          <button disabled={disabled} onClick={() => add(p, qty, flavour)} className="btn btn-croco h-12 px-5 text-sm">Ajouter</button>
        </div>
      </div>
    </>
  );
}

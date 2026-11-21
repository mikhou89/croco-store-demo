"use client";

import Link from "next/link";
import type { ProductLite } from "@/lib/types";
import { useStore } from "@/lib/store";
import { productImage, tndShort } from "@/lib/format";
import { DiscountTag, Price, StockBadge } from "./ProductBits";
import { EyeIcon, HeartIcon, PlusIcon } from "./Icons";
import { useQuickView } from "./QuickView";

export function ProductCard({ p, priority = false }: { p: ProductLite; priority?: boolean }) {
  const { add, toggleWish, isWished, ready } = useStore();
  const { open } = useQuickView();
  const wished = ready && isWished(p.id);
  const unavailable = p.stock === "out_of_stock";
  const needsChoice = p.flavours.length > 1;

  return (
    <article className="group relative flex flex-col rounded-[var(--radius-card)] bg-white shadow-card transition-shadow duration-300 hover:shadow-lift">
      <div className="relative aspect-square overflow-hidden rounded-t-[var(--radius-card)] bg-[#f7f7f4]">
        <Link href={`/produit/${p.slug}/`} aria-label={p.name} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={productImage(p.image)}
            srcSet={`${productImage(p.image, 400)} 400w, ${productImage(p.image, 800)} 800w`}
            sizes="(min-width:1280px) 300px, (min-width:768px) 33vw, 50vw"
            alt={p.name}
            width={400}
            height={400}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={`size-full object-contain p-[6%] mix-blend-multiply transition-all duration-500 group-hover:scale-[1.04] ${p.image2 ? "group-hover:opacity-0" : ""}`}
          />
          {p.image2 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={productImage(p.image2)} alt="" width={400} height={400} loading="lazy" decoding="async" className="absolute inset-0 size-full object-contain p-[6%] mix-blend-multiply opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          )}
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <DiscountTag price={p.price} regular={p.regularPrice} />
          {p.isPack && <span className="rounded-full bg-forest px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">Pack{p.packCount && p.packCount > 1 ? ` · ${p.packCount} produits` : ""}</span>}
          {p.isNew && <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink shadow-sm">Nouveau</span>}
        </div>
        <button
          onClick={() => toggleWish(p.id)}
          className={`absolute right-2.5 top-2.5 grid size-10 place-items-center rounded-full bg-white/90 backdrop-blur shadow-sm transition-colors hover:text-croco ${wished ? "text-croco" : "text-ink"}`}
          aria-label={wished ? `Retirer ${p.name} des favoris` : `Ajouter ${p.name} aux favoris`}
          aria-pressed={wished}
        >
          <HeartIcon size={18} filled={wished} />
        </button>
        <button
          onClick={() => open(p)}
          className="absolute inset-x-3 bottom-3 hidden md:flex items-center justify-center gap-2 rounded-full bg-white/95 backdrop-blur py-2.5 text-[13px] font-semibold opacity-0 translate-y-2 shadow-sm transition-all group-hover:opacity-100 group-hover:translate-y-0 focus:opacity-100 focus:translate-y-0 hover:bg-ink hover:text-white"
        >
          <EyeIcon size={16} /> Aperçu rapide
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3.5 md:p-4">
        <p className="text-[10.5px] md:text-[11px] font-semibold uppercase tracking-[0.1em] text-muted truncate">{p.brand ?? "Croco Store"}</p>
        <h3 className="mt-1 text-[13.5px] md:text-[14.5px] font-medium leading-snug line-clamp-2 min-h-[2.6em]">
          <Link href={`/produit/${p.slug}/`} className="hover:text-croco">{p.shortName}</Link>
        </h3>
        <StockBadge stock={p.stock} className="mt-1.5" />
        <div className="mt-auto pt-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <Price price={p.price} regular={p.regularPrice} size="sm" />
            {p.packValue && <p className="text-[11.5px] font-medium text-croco mt-0.5">Économie {tndShort(p.packValue - p.price)}</p>}
          </div>
          <button
            disabled={unavailable}
            onClick={() => (needsChoice ? open(p) : add(p, 1, p.flavours[0]))}
            className="grid size-11 shrink-0 place-items-center rounded-full bg-ink text-white transition-colors hover:bg-croco disabled:bg-line disabled:text-muted"
            aria-label={needsChoice ? `Choisir la saveur de ${p.name}` : `Ajouter ${p.name} au panier`}
          >
            <PlusIcon size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}

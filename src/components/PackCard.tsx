"use client";

import Link from "next/link";
import type { PackView } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { productImage, tnd, tndShort } from "@/lib/format";
import { Price, StockBadge } from "./ProductBits";
import { BagIcon, HeartIcon } from "./Icons";

export const GOAL_LABEL: Record<string, string> = {
  "prise-de-masse": "Prise de masse",
  "force-performance": "Force & performance",
  recuperation: "Récupération",
  "bien-etre": "Bien-être",
  seche: "Sèche",
  debutant: "Idéal pour débuter",
};

export function PackCard({ pack, tone = "light" }: { pack: PackView; tone?: "light" | "dark" }) {
  const { add, toggleWish, isWished, ready } = useStore();
  const p = pack.lite;
  const dark = tone === "dark";
  const saving = p.packValue ? p.packValue - p.price : 0;
  return (
    <article className={`group flex flex-col rounded-[1.5rem] p-4 md:p-5 transition-shadow ${dark ? "bg-white/[0.06] ring-1 ring-white/10 hover:bg-white/[0.09]" : "bg-white shadow-card hover:shadow-lift"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {pack.goals.slice(0, 2).map((g) => (
            <span key={g} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${dark ? "bg-white/10 text-white/80" : "bg-croco-50 text-croco-600"}`}>{GOAL_LABEL[g]}</span>
          ))}
        </div>
        <button onClick={() => toggleWish(p.id)} className={`grid size-9 shrink-0 place-items-center rounded-full ${dark ? "hover:bg-white/10" : "hover:bg-bone"} ${ready && isWished(p.id) ? "text-croco" : ""}`} aria-label="Ajouter aux favoris" aria-pressed={ready && isWished(p.id)}>
          <HeartIcon size={18} filled={ready && isWished(p.id)} />
        </button>
      </div>

      <Link href={`/produit/${p.slug}/`} className="mt-3 block">
        <div className={`relative grid grid-cols-[1.25fr_1fr] gap-2 rounded-2xl p-3 ${dark ? "bg-white" : "bg-[#f7f7f4]"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={productImage(p.image)} alt={p.name} loading="lazy" className="aspect-square w-full object-contain mix-blend-multiply" />
          <div className="grid grid-rows-3 gap-1.5">
            {pack.items.slice(0, 3).map((it, i) => (
              <div key={i} className="relative flex items-center justify-center rounded-xl bg-white/70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={productImage(it.image)} alt="" loading="lazy" className="max-h-16 w-auto object-contain mix-blend-multiply" />
                {it.qty > 1 && <span className="absolute right-1 top-1 rounded-full bg-ink px-1.5 text-[10px] font-bold text-white">×{it.qty}</span>}
              </div>
            ))}
          </div>
          {saving > 0 && <span className="absolute left-3 top-3 rounded-full bg-volt px-2.5 py-1 text-[11.5px] font-bold text-ink">−{tndShort(saving)}</span>}
        </div>
        <h3 className={`mt-4 text-[16px] font-semibold leading-snug line-clamp-2 ${dark ? "text-white" : ""}`}>{p.shortName}</h3>
      </Link>

      <ul className={`mt-3 space-y-1.5 text-[13px] ${dark ? "text-white/70" : "text-ink/70"}`}>
        {pack.items.map((it, i) => (
          <li key={i} className="flex gap-2">
            <span className={`mt-[7px] size-1.5 shrink-0 rotate-45 rounded-[1px] ${dark ? "bg-volt" : "bg-croco"}`} />
            <span className="line-clamp-1">{it.qty > 1 ? `${it.qty} × ` : ""}{it.name}</span>
          </li>
        ))}
      </ul>

      <div className={`mt-auto pt-4 flex items-end justify-between gap-3 ${dark ? "text-white" : ""}`}>
        <div>
          <Price price={p.price} regular={null} size="md" />
          {p.packValue ? (
            <p className={`text-[12px] mt-0.5 ${dark ? "text-white/60" : "text-muted"}`}>au lieu de <span className="line-through">{tnd(p.packValue)}</span> à l&apos;unité</p>
          ) : (
            <StockBadge stock={p.stock} className={dark ? "!text-white/60" : ""} />
          )}
        </div>
        <button onClick={() => add(p, 1)} disabled={p.stock === "out_of_stock"} className={`btn h-11 px-4 text-sm ${dark ? "btn-volt" : "btn-primary"}`} aria-label={`Ajouter ${p.name} au panier`}>
          <BagIcon size={17} /> Ajouter
        </button>
      </div>
    </article>
  );
}


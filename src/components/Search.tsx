"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ProductLite } from "@/lib/types";
import { asset, productImage, tndShort } from "@/lib/format";
import { SearchIcon, CloseIcon, ArrowRight } from "./Icons";

let indexPromise: Promise<ProductLite[]> | null = null;
export function loadIndex() {
  indexPromise ??= fetch(asset("/search-index.json")).then((r) => r.json());
  return indexPromise;
}

export const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function searchProducts(index: ProductLite[], q: string) {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return index
    .map((p) => {
      const hay = norm(`${p.name} ${p.brand ?? ""} ${p.categories.join(" ")} ${p.subcategories.join(" ")}`);
      if (!terms.every((t) => hay.includes(t))) return null;
      let score = 0;
      for (const t of terms) {
        if (norm(p.shortName).startsWith(t)) score += 6;
        if (norm(p.name).includes(t)) score += 3;
        if (norm(p.brand ?? "").includes(t)) score += 2;
      }
      if (p.stock === "in_stock" || p.stock === "low_stock") score += 1;
      score += p.bestRank !== null ? Math.max(0, 2 - p.bestRank / 80) : 0;
      return { p, score };
    })
    .filter(Boolean)
    .sort((a, b) => b!.score - a!.score)
    .map((x) => x!.p);
}

const POPULAR = ["Créatine", "Whey", "Gainer", "Pré-workout", "Multivitamines", "Oméga 3", "GSN", "Biotech USA"];

export function SearchBox({ variant = "bar", onDone, autoFocus }: { variant?: "bar" | "sheet"; onDone?: () => void; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState<ProductLite[] | null>(null);
  const [active, setActive] = useState(-1);
  const router = useRouter();
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      input.current?.focus();
      loadIndex().then(setIndex);
    }
  }, [autoFocus]);

  useEffect(() => {
    const h = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const results = useMemo(() => (index && q.trim().length > 1 ? searchProducts(index, q).slice(0, 6) : []), [index, q]);
  const brandHits = useMemo(() => {
    if (!index || q.trim().length < 2) return [];
    const m = new Map<string, string>();
    index.forEach((p) => p.brand && p.brandSlug && norm(p.brand).includes(norm(q.trim())) && m.set(p.brandSlug, p.brand));
    return [...m.entries()].slice(0, 3);
  }, [index, q]);

  const go = (term: string) => {
    setOpen(false);
    onDone?.();
    router.push(`/boutique/?q=${encodeURIComponent(term)}`);
  };

  const dark = variant === "bar";
  return (
    <div ref={wrap} className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (active >= 0 && results[active]) {
            setOpen(false);
            onDone?.();
            router.push(`/produit/${results[active].slug}/`);
          } else if (q.trim()) go(q.trim());
        }}
        className={`flex items-center gap-2 rounded-full border transition-colors ${dark ? "border-white/15 bg-white/[0.07] focus-within:bg-white focus-within:border-white" : "border-line bg-white"} px-4 h-12 group`}
      >
        <SearchIcon size={19} className={dark ? "text-white/60 group-focus-within:text-ink" : "text-muted"} />
        <input
          ref={input}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1); }}
          onFocus={() => { setOpen(true); loadIndex().then(setIndex); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(results.length - 1, a + 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)); }
            if (e.key === "Escape") setOpen(false);
          }}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          placeholder="Rechercher une whey, une créatine, une marque…"
          aria-label="Rechercher un produit"
          aria-expanded={open}
          aria-controls="search-suggestions"
          aria-autocomplete="list"
          role="combobox"
          className={`min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-current/50 [&::-webkit-search-cancel-button]:hidden ${dark ? "text-white placeholder:text-white/50 group-focus-within:text-ink group-focus-within:placeholder:text-muted" : "text-ink placeholder:text-muted"}`}
        />
        {q && (
          <button type="button" onClick={() => { setQ(""); input.current?.focus(); }} aria-label="Effacer" className={`p-1 rounded-full ${dark ? "text-white/60 group-focus-within:text-muted" : "text-muted"}`}>
            <CloseIcon size={16} />
          </button>
        )}
      </form>

      {open && (
        <div id="search-suggestions" role="listbox" className={`${variant === "bar" ? "absolute left-0 right-0 top-[calc(100%+10px)] rounded-2xl shadow-lift border border-line overflow-hidden" : "fixed inset-x-0 top-[73px] bottom-0 overflow-y-auto border-t border-line"} z-50 bg-white text-ink animate-pop`}>
          {q.trim().length < 2 ? (
            <div className="p-5">
              <p className="eyebrow text-muted mb-3">Recherches populaires</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR.map((t) => (
                  <button key={t} type="button" className="chip" onClick={() => go(t)}>{t}</button>
                ))}
              </div>
            </div>
          ) : !index ? (
            <p className="p-5 text-sm text-muted">Chargement…</p>
          ) : results.length === 0 && brandHits.length === 0 ? (
            <p className="p-5 text-sm text-muted">Aucun produit ne correspond à « {q} ». Essayez « whey » ou « créatine ».</p>
          ) : (
            <div className="py-2">
              {brandHits.length > 0 && (
                <div className="px-5 py-2 flex flex-wrap gap-2">
                  {brandHits.map(([slug, name]) => (
                    <Link key={slug} href={`/marque/${slug}/`} onClick={() => { setOpen(false); onDone?.(); }} className="chip">Marque · {name}</Link>
                  ))}
                </div>
              )}
              {results.map((p, i) => (
                <Link
                  key={p.id}
                  href={`/produit/${p.slug}/`}
                  role="option"
                  aria-selected={i === active}
                  onClick={() => { setOpen(false); onDone?.(); }}
                  className={`flex items-center gap-3 px-5 py-2.5 hover:bg-bone ${i === active ? "bg-bone" : ""}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={productImage(p.image)} alt="" width={48} height={48} className="size-12 rounded-lg bg-bone object-contain" loading="lazy" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted truncate">{p.brand ?? "Croco Store"}</span>
                    <span className="block text-sm font-medium truncate">{p.shortName}</span>
                  </span>
                  <span className="text-sm font-semibold whitespace-nowrap">{tndShort(p.price)}</span>
                </Link>
              ))}
              <button type="button" onClick={() => go(q.trim())} className="flex w-full items-center justify-between px-5 py-3 mt-1 border-t border-line text-sm font-semibold hover:bg-bone">
                Voir tous les résultats pour « {q.trim()} » <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

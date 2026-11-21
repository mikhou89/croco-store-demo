"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductLite } from "@/lib/types";
import { discountPct } from "@/lib/format";
import { ProductCard } from "./ProductCard";
import { CloseIcon, FilterIcon, SearchIcon, ChevronDown } from "./Icons";
import { searchProducts } from "./Search";

type Sort = "popular" | "price-asc" | "price-desc" | "new" | "discount" | "name";
const SORTS: [Sort, string][] = [
  ["popular", "Popularité"],
  ["price-asc", "Prix croissant"],
  ["price-desc", "Prix décroissant"],
  ["new", "Nouveautés"],
  ["discount", "Meilleures remises"],
  ["name", "Nom A → Z"],
];
const PAGE = 24;

interface Facet { key: string; label: string; count: number }
interface State { q: string; sub: string[]; brand: string[]; min: string; max: string; inStock: boolean; promo: boolean; packs: "all" | "only" | "none"; sort: Sort }

export function Catalog({ items, facetLabel, facets, title, intro, hideFacetKey }: {
  items: ProductLite[];
  /** label of the "type" facet: "Catégorie" in the shop, "Sous-catégorie" in a category */
  facetLabel: string;
  facets: { key: string; label: string; field: "categories" | "subcategories" }[];
  title?: string;
  intro?: string;
  hideFacetKey?: string;
}) {
  const [s, setS] = useState<State>({ q: "", sub: [], brand: [], min: "", max: "", inStock: false, promo: false, packs: "all", sort: "popular" });
  const [sheet, setSheet] = useState(false);
  const [shown, setShown] = useState(PAGE);
  const [hydrated, setHydrated] = useState(false);

  // read URL once (works with static export, no server needed)
  useEffect(() => {
    const u = new URLSearchParams(window.location.search);
    setS((x) => ({
      ...x,
      q: u.get("q") ?? "",
      sub: u.get("sub")?.split(",").filter(Boolean) ?? [],
      brand: u.get("marque")?.split(",").filter(Boolean) ?? [],
      min: u.get("min") ?? "",
      max: u.get("max") ?? "",
      inStock: u.get("stock") === "1",
      promo: u.get("promo") === "1",
      packs: (u.get("packs") as State["packs"]) ?? "all",
      sort: (u.get("sort") as Sort) ?? (u.get("q") ? "popular" : "popular"),
    }));
    setHydrated(true);
  }, []);

  // write URL (shareable filtered views)
  useEffect(() => {
    if (!hydrated) return;
    const u = new URLSearchParams();
    if (s.q) u.set("q", s.q);
    if (s.sub.length) u.set("sub", s.sub.join(","));
    if (s.brand.length) u.set("marque", s.brand.join(","));
    if (s.min) u.set("min", s.min);
    if (s.max) u.set("max", s.max);
    if (s.inStock) u.set("stock", "1");
    if (s.promo) u.set("promo", "1");
    if (s.packs !== "all") u.set("packs", s.packs);
    if (s.sort !== "popular") u.set("sort", s.sort);
    const qs = u.toString();
    window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
    setShown(PAGE);
  }, [s, hydrated]);

  useEffect(() => {
    document.documentElement.style.overflow = sheet ? "hidden" : "";
  }, [sheet]);

  const fieldOf = (k: string) => facets.find((f) => f.key === k)?.field ?? "subcategories";

  // apply all filters except one (for live facet counts)
  const filtered = useMemo(() => {
    const base = s.q.trim() ? searchProducts(items, s.q) : items;
    const min = parseFloat(s.min), max = parseFloat(s.max);
    const pass = (p: ProductLite, except?: "sub" | "brand") =>
      (except === "sub" || !s.sub.length || s.sub.some((k) => (p[fieldOf(k)] as string[]).includes(k))) &&
      (except === "brand" || !s.brand.length || (p.brandSlug && s.brand.includes(p.brandSlug))) &&
      (isNaN(min) || p.price >= min) &&
      (isNaN(max) || p.price <= max) &&
      (!s.inStock || p.stock === "in_stock" || p.stock === "low_stock") &&
      (!s.promo || !!p.regularPrice) &&
      (s.packs === "all" || (s.packs === "only" ? p.isPack : !p.isPack));
    return { base, pass };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, s]);

  const results = useMemo(() => {
    const r = filtered.base.filter((p) => filtered.pass(p));
    const avail = (p: ProductLite) => Number(p.stock === "backorder" || p.stock === "out_of_stock");
    const by: Record<Sort, (a: ProductLite, b: ProductLite) => number> = {
      popular: (a, b) => avail(a) - avail(b) || (a.bestRank ?? 9999) - (b.bestRank ?? 9999),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      new: (a, b) => b.date.localeCompare(a.date),
      discount: (a, b) => discountPct(b.price, b.regularPrice) - discountPct(a.price, a.regularPrice),
      name: (a, b) => a.shortName.localeCompare(b.shortName, "fr"),
    };
    return s.q.trim() && s.sort === "popular" ? r : [...r].sort(by[s.sort]);
  }, [filtered, s.sort, s.q]);

  const subFacets: Facet[] = useMemo(
    () => facets.filter((f) => f.key !== hideFacetKey).map((f) => ({ key: f.key, label: f.label, count: filtered.base.filter((p) => filtered.pass(p, "sub") && (p[f.field] as string[]).includes(f.key)).length })),
    [facets, filtered, hideFacetKey],
  );
  const brandFacets: Facet[] = useMemo(() => {
    const m = new Map<string, Facet>();
    filtered.base.forEach((p) => {
      if (!p.brandSlug || !p.brand) return;
      const f = m.get(p.brandSlug) ?? { key: p.brandSlug, label: p.brand, count: 0 };
      if (filtered.pass(p, "brand")) f.count++;
      m.set(p.brandSlug, f);
    });
    return [...m.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  }, [filtered]);
  const priceMax = useMemo(() => Math.ceil(Math.max(0, ...items.map((p) => p.price)) / 10) * 10, [items]);

  const toggle = (key: "sub" | "brand", v: string) => setS((x) => ({ ...x, [key]: x[key].includes(v) ? x[key].filter((y) => y !== v) : [...x[key], v] }));
  const activeCount = s.sub.length + s.brand.length + (s.min || s.max ? 1 : 0) + Number(s.inStock) + Number(s.promo) + Number(s.packs !== "all");
  const reset = () => setS((x) => ({ ...x, sub: [], brand: [], min: "", max: "", inStock: false, promo: false, packs: "all" }));
  const hasPacks = items.some((p) => p.isPack) && items.some((p) => !p.isPack);

  const filters = (
    <div className="space-y-7">
      <div className="space-y-3">
        <Toggle label="En stock uniquement" checked={s.inStock} onChange={(v) => setS((x) => ({ ...x, inStock: v }))} />
        <Toggle label="En promotion" checked={s.promo} onChange={(v) => setS((x) => ({ ...x, promo: v }))} />
        {hasPacks && <Toggle label="Masquer les packs" checked={s.packs === "none"} onChange={(v) => setS((x) => ({ ...x, packs: v ? "none" : "all" }))} />}
      </div>
      {subFacets.length > 1 && (
        <FacetGroup title={facetLabel} facets={subFacets} selected={s.sub} onToggle={(k) => toggle("sub", k)} />
      )}
      <div>
        <p className="text-sm font-semibold mb-3">Prix (TND)</p>
        <div className="flex items-center gap-2">
          <input inputMode="numeric" value={s.min} onChange={(e) => setS((x) => ({ ...x, min: e.target.value.replace(/[^\d]/g, "") }))} placeholder="0" aria-label="Prix minimum" className="w-full rounded-xl border border-line bg-white px-3 h-11 text-sm outline-none focus:border-ink" />
          <span className="text-muted">–</span>
          <input inputMode="numeric" value={s.max} onChange={(e) => setS((x) => ({ ...x, max: e.target.value.replace(/[^\d]/g, "") }))} placeholder={String(priceMax)} aria-label="Prix maximum" className="w-full rounded-xl border border-line bg-white px-3 h-11 text-sm outline-none focus:border-ink" />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[[0, 50], [50, 100], [100, 200], [200, 0]].map(([a, b]) => {
            const active = s.min === (a ? String(a) : "") && s.max === (b ? String(b) : "");
            return (
              <button key={`${a}-${b}`} className="chip !min-h-9 !py-1.5 text-[13px]" aria-pressed={active} onClick={() => setS((x) => ({ ...x, min: active ? "" : a ? String(a) : "", max: active ? "" : b ? String(b) : "" }))}>
                {b ? (a ? `${a}–${b}` : `< ${b}`) : `> ${a}`}
              </button>
            );
          })}
        </div>
      </div>
      {brandFacets.length > 1 && <FacetGroup title="Marque" facets={brandFacets} selected={s.brand} onToggle={(k) => toggle("brand", k)} collapsible />}
    </div>
  );

  return (
    <div className="container-x">
      {title && (
        <div className="pt-8 md:pt-12 pb-6">
          <h1 className="display text-5xl md:text-7xl">{s.q ? <>Résultats pour « {s.q} »</> : title}</h1>
          {intro && !s.q && <p className="mt-3 max-w-2xl text-muted md:text-lg">{intro}</p>}
        </div>
      )}

      {/* toolbar */}
      <div className="sticky top-16 md:top-[76px] z-30 -mx-4 px-4 md:mx-0 md:px-0 bg-bone/95 backdrop-blur py-3 flex items-center gap-2 md:gap-3 border-b border-line">
        <button onClick={() => setSheet(true)} className="chip lg:hidden shrink-0" aria-haspopup="dialog">
          <FilterIcon size={17} /> Filtres{activeCount ? ` (${activeCount})` : ""}
        </button>
        <div className="relative hidden sm:block flex-1 max-w-xs">
          <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input value={s.q} onChange={(e) => setS((x) => ({ ...x, q: e.target.value }))} placeholder="Filtrer par nom…" aria-label="Filtrer par nom" type="search" className="w-full rounded-full border border-line bg-white pl-9 pr-4 h-10 text-sm outline-none focus:border-ink" />
        </div>
        <p className="text-sm text-muted ml-auto lg:ml-0 lg:mr-auto whitespace-nowrap" aria-live="polite"><b className="text-ink">{results.length}</b><span className="hidden sm:inline"> produit{results.length > 1 ? "s" : ""}</span></p>
        <label className="relative shrink-0">
          <span className="sr-only">Trier par</span>
          <select value={s.sort} onChange={(e) => setS((x) => ({ ...x, sort: e.target.value as Sort }))} className="appearance-none rounded-full border border-line bg-white pl-4 pr-9 h-10 max-w-[46vw] sm:max-w-none text-sm font-medium outline-none focus:border-ink cursor-pointer">
            {SORTS.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
        </label>
      </div>

      {/* active chips */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 pt-4">
          {s.sub.map((k) => <ActiveChip key={k} label={facets.find((f) => f.key === k)?.label ?? k} onClear={() => toggle("sub", k)} />)}
          {s.brand.map((k) => <ActiveChip key={k} label={brandFacets.find((f) => f.key === k)?.label ?? k} onClear={() => toggle("brand", k)} />)}
          {(s.min || s.max) && <ActiveChip label={`${s.min || 0} – ${s.max || "∞"} TND`} onClear={() => setS((x) => ({ ...x, min: "", max: "" }))} />}
          {s.inStock && <ActiveChip label="En stock" onClear={() => setS((x) => ({ ...x, inStock: false }))} />}
          {s.promo && <ActiveChip label="En promotion" onClear={() => setS((x) => ({ ...x, promo: false }))} />}
          {s.packs !== "all" && <ActiveChip label="Sans packs" onClear={() => setS((x) => ({ ...x, packs: "all" }))} />}
          <button onClick={reset} className="text-sm font-semibold underline underline-offset-4 px-2">Tout effacer</button>
        </div>
      )}

      <div className="grid lg:grid-cols-[250px_1fr] gap-8 pt-6">
        <aside className="hidden lg:block sticky top-[150px] self-start max-h-[calc(100vh-170px)] overflow-y-auto pr-2 no-scrollbar" aria-label="Filtres">{filters}</aside>
        <div>
          {results.length === 0 ? (
            <div className="rounded-3xl bg-white p-10 text-center shadow-card">
              <p className="display text-3xl">Aucun produit trouvé</p>
              <p className="mt-2 text-muted">Essayez d&apos;élargir vos filtres ou une autre recherche.</p>
              <button onClick={() => { reset(); setS((x) => ({ ...x, q: "" })); }} className="btn btn-primary mt-6">Réinitialiser</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-5">
                {results.slice(0, shown).map((p, i) => <ProductCard key={p.id} p={p} priority={i < 4} />)}
              </div>
              {shown < results.length && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <p className="text-sm text-muted">{Math.min(shown, results.length)} sur {results.length} produits</p>
                  <div className="h-1 w-48 rounded-full bg-line overflow-hidden"><div className="h-full bg-ink" style={{ width: `${(shown / results.length) * 100}%` }} /></div>
                  <button onClick={() => setShown((x) => x + PAGE)} className="btn btn-outline mt-2">Afficher plus de produits</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* mobile filter sheet */}
      {sheet && (
        <div className="fixed inset-0 z-[65] lg:hidden" role="dialog" aria-modal="true" aria-label="Filtres">
          <button className="absolute inset-0 bg-ink/50" aria-label="Fermer" onClick={() => setSheet(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[88vh] flex flex-col rounded-t-3xl bg-bone animate-pop">
            <div className="flex items-center justify-between px-5 h-16 border-b border-line">
              <p className="display text-2xl">Filtres</p>
              <button className="p-2 rounded-full hover:bg-white" onClick={() => setSheet(false)} aria-label="Fermer"><CloseIcon size={22} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <div className="relative mb-6 sm:hidden">
                <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input value={s.q} onChange={(e) => setS((x) => ({ ...x, q: e.target.value }))} placeholder="Filtrer par nom…" type="search" aria-label="Filtrer par nom" className="w-full rounded-full border border-line bg-white pl-9 pr-4 h-12 text-[15px] outline-none focus:border-ink" />
              </div>
              {filters}
            </div>
            <div className="flex gap-3 border-t border-line bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button onClick={reset} className="btn btn-outline flex-1">Effacer</button>
              <button onClick={() => setSheet(false)} className="btn btn-primary flex-[2]">Voir {results.length} produits</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-[14.5px] font-medium min-h-[36px]">
      {label}
      <span className="relative">
        <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <span className="block h-6 w-11 rounded-full bg-line transition-colors peer-checked:bg-croco peer-focus-visible:ring-2 peer-focus-visible:ring-croco peer-focus-visible:ring-offset-2" />
        <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

function FacetGroup({ title, facets, selected, onToggle, collapsible }: { title: string; facets: Facet[]; selected: string[]; onToggle: (k: string) => void; collapsible?: boolean }) {
  const [all, setAll] = useState(false);
  const list = collapsible && !all ? facets.slice(0, 8) : facets;
  return (
    <fieldset>
      <legend className="text-sm font-semibold mb-2">{title}</legend>
      <ul className="space-y-0.5">
        {list.map((f) => (
          <li key={f.key}>
            <label className={`flex cursor-pointer items-center gap-3 rounded-lg py-1.5 text-[14px] ${f.count === 0 && !selected.includes(f.key) ? "opacity-40" : ""}`}>
              <input type="checkbox" checked={selected.includes(f.key)} onChange={() => onToggle(f.key)} className="size-[18px] rounded accent-[var(--color-croco)]" />
              <span className="flex-1 truncate">{f.label}</span>
              <span className="text-xs text-muted tabular-nums">{f.count}</span>
            </label>
          </li>
        ))}
      </ul>
      {collapsible && facets.length > 8 && (
        <button className="mt-2 text-sm font-semibold underline underline-offset-4" onClick={() => setAll((a) => !a)}>{all ? "Voir moins" : `Voir les ${facets.length} marques`}</button>
      )}
    </fieldset>
  );
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button onClick={onClear} className="inline-flex items-center gap-1.5 rounded-full bg-ink pl-3.5 pr-2.5 py-1.5 text-[13px] font-medium text-white">
      {label} <CloseIcon size={14} />
    </button>
  );
}


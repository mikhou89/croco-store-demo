"use client";

import { useEffect, useMemo, useState } from "react";
import type { PackView } from "@/lib/catalog";
import { PackCard } from "./PackCard";
import { ChevronDown } from "./Icons";

type Sort = "saving" | "price-asc" | "price-desc";

export function PacksExplorer({ packs, goals }: { packs: PackView[]; goals: { slug: string; name: string; count: number; blurb: string }[] }) {
  const [goal, setGoal] = useState<string>("all");
  const [sort, setSort] = useState<Sort>("saving");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const g = new URLSearchParams(window.location.search).get("objectif");
    if (g) setGoal(g);
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    window.history.replaceState(null, "", goal === "all" ? window.location.pathname : `?objectif=${goal}`);
  }, [goal, ready]);

  const list = useMemo(() => {
    const avail = (p: PackView) => Number(p.lite.stock === "backorder" || p.lite.stock === "out_of_stock");
    const saving = (p: PackView) => (p.lite.packValue ? p.lite.packValue - p.lite.price : 0);
    return packs
      .filter((p) => goal === "all" || p.goals.includes(goal))
      .sort((a, b) => avail(a) - avail(b) || (sort === "saving" ? saving(b) - saving(a) : sort === "price-asc" ? a.lite.price - b.lite.price : b.lite.price - a.lite.price));
  }, [packs, goal, sort]);
  const current = goals.find((g) => g.slug === goal);

  return (
    <section className="container-x pt-10" id="packs">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3">
        {[{ slug: "all", name: "Tous les packs", count: packs.length, blurb: "" }, ...goals].map((g) => (
          <button
            key={g.slug}
            onClick={() => setGoal(g.slug)}
            aria-pressed={goal === g.slug}
            className={`rounded-2xl p-4 text-left transition-colors ring-1 ${goal === g.slug ? "bg-forest text-white ring-forest" : "bg-white ring-line hover:ring-ink"}`}
          >
            <span className="display block text-xl md:text-2xl leading-none">{g.name}</span>
            <span className={`mt-1.5 block text-xs ${goal === g.slug ? "text-white/60" : "text-muted"}`}>{g.count} pack{g.count > 1 ? "s" : ""}</span>
          </button>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted max-w-2xl">{current ? current.blurb : "Classés par objectif selon leur contenu réel."} <b className="text-ink">{list.length}</b> pack{list.length > 1 ? "s" : ""}.</p>
        <label className="relative">
          <span className="sr-only">Trier</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="appearance-none rounded-full border border-line bg-white pl-4 pr-9 h-10 text-sm font-medium cursor-pointer">
            <option value="saving">Plus grosses économies</option>
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
        </label>
      </div>
      <div key={goal} className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-fade-up">
        {list.map((p) => <div key={p.lite.id} className="flex"><PackCard pack={p} /></div>)}
      </div>
    </section>
  );
}


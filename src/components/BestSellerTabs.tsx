"use client";
import { useState } from "react";
import type { ProductLite } from "@/lib/types";
import { ProductRail } from "./Section";

export function BestSellerTabs({ tabs }: { tabs: { key: string; label: string; items: ProductLite[] }[] }) {
  const [k, setK] = useState(tabs[0]?.key);
  const cur = tabs.find((t) => t.key === k) ?? tabs[0];
  return (
    <>
      <div className="-mx-4 px-4 md:mx-0 md:px-0 mb-6 flex gap-2 overflow-x-auto no-scrollbar" role="tablist" aria-label="Catégories best-sellers">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={t.key === cur.key} data-active={t.key === cur.key} className="chip shrink-0" onClick={() => setK(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div key={cur.key} className="animate-fade-up" role="tabpanel">
        <ProductRail items={cur.items} />
      </div>
    </>
  );
}

import Link from "next/link";
import type { ProductLite } from "@/lib/types";
import { ProductCard } from "./ProductCard";
import { ArrowRight } from "./Icons";

export function SectionHead({ eyebrow, title, href, cta = "Tout voir", tone = "light", children }: { eyebrow?: string; title: React.ReactNode; href?: string; cta?: string; tone?: "light" | "dark"; children?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 mb-6 md:mb-8">
      <div className="max-w-2xl">
        {eyebrow && <p className={`eyebrow mb-2 ${tone === "dark" ? "text-volt" : "text-croco"}`}>{eyebrow}</p>}
        <h2 className={`display text-[2.4rem] md:text-[3.4rem] ${tone === "dark" ? "text-white" : ""}`}>{title}</h2>
        {children}
      </div>
      {href && (
        <Link href={href} className={`group inline-flex items-center gap-2 text-sm font-semibold ${tone === "dark" ? "text-white" : ""}`}>
          {cta} <span className={`grid size-9 place-items-center rounded-full border transition-colors ${tone === "dark" ? "border-white/30 group-hover:bg-white group-hover:text-ink" : "border-line group-hover:bg-ink group-hover:text-white"}`}><ArrowRight size={16} /></span>
        </Link>
      )}
    </div>
  );
}

/** Horizontal snap rail on mobile, grid on desktop. */
export function ProductRail({ items, cols = 4 }: { items: ProductLite[]; cols?: 4 | 5 }) {
  return (
    <div className={`-mx-4 px-4 md:mx-0 md:px-0 flex md:grid gap-3 md:gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory no-scrollbar ${cols === 5 ? "md:grid-cols-3 lg:grid-cols-5" : "md:grid-cols-3 lg:grid-cols-4"}`}>
      {items.map((p) => (
        <div key={p.id} className="w-[46%] sm:w-[34%] md:w-auto shrink-0 snap-start">
          <ProductCard p={p} />
        </div>
      ))}
    </div>
  );
}

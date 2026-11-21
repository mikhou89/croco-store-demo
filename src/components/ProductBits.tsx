import type { StockStatus } from "@/lib/types";
import { discountPct, tnd, tndShort } from "@/lib/format";

export const STOCK_LABEL: Record<StockStatus, { label: string; tone: string; dot: string }> = {
  in_stock: { label: "En stock", tone: "text-croco", dot: "bg-croco" },
  low_stock: { label: "Derniers articles", tone: "text-amber", dot: "bg-amber" },
  backorder: { label: "Réapprovisionnement en cours", tone: "text-muted", dot: "bg-muted/60" },
  out_of_stock: { label: "Rupture de stock", tone: "text-danger", dot: "bg-danger" },
};

export function StockBadge({ stock, className = "" }: { stock: StockStatus; className?: string }) {
  const s = STOCK_LABEL[stock];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium ${s.tone} ${className}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} /> {s.label}
    </span>
  );
}

export function Price({ price, regular, size = "md" }: { price: number; regular: number | null; size?: "sm" | "md" | "lg" }) {
  const fmt = size === "lg" ? tnd : tndShort;
  const main = size === "lg" ? "text-3xl md:text-[2.1rem]" : size === "md" ? "text-[17px]" : "text-[15px]";
  return (
    <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`font-bold tracking-tight tabular-nums ${main} ${regular ? "text-croco-600" : ""}`}>{fmt(price)}</span>
      {regular && <span className={`text-muted line-through tabular-nums ${size === "lg" ? "text-lg" : "text-[13px]"}`}>{fmt(regular)}</span>}
    </span>
  );
}

export function DiscountTag({ price, regular, className = "" }: { price: number; regular: number | null; className?: string }) {
  const pct = discountPct(price, regular);
  if (!pct) return null;
  return <span className={`rounded-full bg-volt px-2.5 py-1 text-[11.5px] font-bold text-ink ${className}`}>−{pct} %</span>;
}

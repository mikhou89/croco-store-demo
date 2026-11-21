"use client";
import { MinusIcon, PlusIcon } from "./Icons";

export function QtyStepper({ value, onChange, size = "md", min = 1 }: { value: number; onChange: (v: number) => void; size?: "sm" | "md"; min?: number }) {
  const h = size === "sm" ? "h-9" : "h-12";
  const w = size === "sm" ? "w-9" : "w-12";
  return (
    <div className={`inline-flex items-center rounded-full border border-line bg-white ${h}`} role="group" aria-label="Quantité">
      <button type="button" className={`grid ${w} h-full place-items-center rounded-full hover:bg-bone disabled:opacity-30`} onClick={() => onChange(value - 1)} disabled={min > 0 && value <= min && size !== "sm"} aria-label="Diminuer la quantité">
        <MinusIcon size={16} />
      </button>
      <span className="min-w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">{value}</span>
      <button type="button" className={`grid ${w} h-full place-items-center rounded-full hover:bg-bone`} onClick={() => onChange(Math.min(99, value + 1))} aria-label="Augmenter la quantité">
        <PlusIcon size={16} />
      </button>
    </div>
  );
}

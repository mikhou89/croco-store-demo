import Link from "next/link";
import { asset } from "@/lib/format";

export function Logo({ tone = "light", compact = false }: { tone?: "light" | "dark"; compact?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5 shrink-0" aria-label="Croco Store, accueil">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset("/img/site/croco-mascot.png")} alt="" width={46} height={39} className="h-9 w-auto md:h-10 transition-transform duration-300 group-hover:-rotate-6" />
      {!compact && (
        <span className={`flex flex-col leading-none ${tone === "light" ? "text-white" : "text-ink"}`}>
          <span className="display text-[1.55rem] tracking-[0.02em]">Croco</span>
          <span className={`text-[0.6rem] font-semibold tracking-[0.42em] uppercase ${tone === "light" ? "text-croco-300" : "text-croco"}`}>Store</span>
        </span>
      )}
    </Link>
  );
}

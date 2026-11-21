"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { DEMO_NOTICE, SITE } from "@/lib/site";
import { BagIcon, BoxIcon, CheckIcon, CloseIcon, GridIcon, HeartIcon, HomeIcon, InfoIcon } from "./Icons";

export function Toast() {
  const { toast } = useStore();
  if (!toast) return null;
  return (
    <div role="status" className="fixed left-1/2 bottom-24 md:bottom-8 z-[80] -translate-x-1/2 animate-pop">
      <p className="flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white shadow-lift"><CheckIcon size={16} className="text-volt" /> {toast}</p>
    </div>
  );
}

/** Discreet, always-available "concept / demo" indicator. */
export function DemoBadge() {
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState(true);
  useEffect(() => {
    try { setSeen(sessionStorage.getItem("croco-demo-seen") === "1"); } catch {}
  }, []);
  const close = () => { setOpen(false); setSeen(true); try { sessionStorage.setItem("croco-demo-seen", "1"); } catch {} };
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-3 bottom-[84px] md:bottom-5 md:left-5 z-[45] flex items-center gap-2 rounded-full bg-white/95 backdrop-blur px-3.5 py-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-ink shadow-card border border-line hover:border-ink"
        aria-label="À propos de cette démo"
      >
        <span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-croco opacity-60" /><span className="relative size-2 rounded-full bg-croco" /></span>
        <span className="hidden sm:inline">Concept de refonte · </span>Démo
      </button>
      {(open || !seen) && (
        <div className="fixed inset-0 z-[90] grid place-items-end md:place-items-center p-0 md:p-6" role="dialog" aria-modal="true" aria-labelledby="demo-title">
          <button className="absolute inset-0 bg-ink/60 backdrop-blur-sm" aria-label="Fermer" onClick={close} />
          <div className="relative w-full md:max-w-lg rounded-t-3xl md:rounded-3xl bg-white p-6 md:p-8 shadow-lift animate-pop">
            <button onClick={close} className="absolute right-4 top-4 p-2 rounded-full hover:bg-bone" aria-label="Fermer"><CloseIcon size={20} /></button>
            <p className="eyebrow text-croco flex items-center gap-2"><InfoIcon size={16} /> Proposition de refonte</p>
            <h2 id="demo-title" className="display text-4xl mt-3">Croco Store, nouvelle génération</h2>
            <p className="mt-3 text-[15px] text-ink/80 leading-relaxed">{DEMO_NOTICE}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {["Navigation, recherche et filtres entièrement fonctionnels", "Panier, favoris et tunnel de commande en mode démonstration", "Optimisé mobile, comme une application"].map((t) => (
                <li key={t} className="flex gap-2"><CheckIcon size={18} className="text-croco shrink-0" /> {t}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <button onClick={close} className="btn btn-primary flex-1">Explorer la démo</button>
              <a href={SITE.liveUrl} target="_blank" rel="noopener" className="btn btn-outline flex-1">Voir le site actuel</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** App-style bottom navigation on mobile. */
export function BottomNav() {
  const pathname = usePathname();
  const { count, setCartOpen, wishlist, ready } = useStore();
  const hide = pathname.startsWith("/produit/") || pathname.startsWith("/commande");
  if (hide) return null;
  const item = (href: string, label: string, icon: React.ReactNode, active: boolean, badge?: number) => (
    <Link href={href} className={`relative flex flex-1 flex-col items-center gap-1 pt-2 pb-1.5 text-[10.5px] font-medium ${active ? "text-ink" : "text-muted"}`} aria-current={active ? "page" : undefined}>
      {icon}
      {label}
      {!!badge && <span className="absolute top-1 left-1/2 ml-2 grid min-w-4 h-4 place-items-center rounded-full bg-croco px-1 text-[9.5px] font-bold text-white">{badge}</span>}
      {active && <span className="absolute top-0 h-0.5 w-8 rounded-full bg-croco" />}
    </Link>
  );
  return (
    <nav className="fixed bottom-0 inset-x-0 z-[44] md:hidden border-t border-line bg-white/95 backdrop-blur pb-[env(safe-area-inset-bottom)]" aria-label="Navigation mobile">
      <div className="flex">
        {item("/", "Accueil", <HomeIcon size={22} />, pathname === "/")}
        {item("/boutique/", "Boutique", <GridIcon size={22} />, pathname.startsWith("/boutique") || pathname.startsWith("/categorie") || pathname.startsWith("/marque"))}
        {item("/packs/", "Packs", <BoxIcon size={22} />, pathname.startsWith("/packs"))}
        {item("/favoris/", "Favoris", <HeartIcon size={22} />, pathname.startsWith("/favoris"), ready ? wishlist.length : 0)}
        <button onClick={() => setCartOpen(true)} className="relative flex flex-1 flex-col items-center gap-1 pt-2 pb-1.5 text-[10.5px] font-medium text-muted">
          <BagIcon size={22} />Panier
          {ready && count > 0 && <span className="absolute top-1 left-1/2 ml-2 grid min-w-4 h-4 place-items-center rounded-full bg-croco px-1 text-[9.5px] font-bold text-white">{count}</span>}
        </button>
      </div>
    </nav>
  );
}

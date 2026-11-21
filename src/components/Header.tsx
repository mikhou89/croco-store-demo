"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";
import { useStore } from "@/lib/store";
import { productImage, tndShort } from "@/lib/format";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";
import { SearchBox } from "./Search";
import { BagIcon, ChevronDown, ChevronRight, CloseIcon, HeartIcon, MenuIcon, SearchIcon, PhoneIcon, ArrowRight } from "./Icons";

export interface MegaFeature { slug: string; image: string | null; brand: string | null; shortName: string; price: number }

const ANNOUNCEMENTS = [
  `Livraison offerte dès ${SITE.freeShippingFrom} DT d'achat`,
  "Paiement à la livraison · Recevez, vérifiez, puis payez",
  `Besoin d'un conseil ? Appelez le ${SITE.phone}`,
];

export function AnnouncementBar() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ANNOUNCEMENTS.length), 4500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-ink text-white/85 text-[12.5px]">
      <div className="container-x flex h-9 items-center justify-between gap-4">
        <p key={i} className="animate-fade-up truncate font-medium tracking-wide md:hidden mx-auto">{ANNOUNCEMENTS[i]}</p>
        <ul className="hidden md:flex items-center gap-6 font-medium tracking-wide">
          {ANNOUNCEMENTS.slice(0, 2).map((a) => (
            <li key={a} className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-volt" />{a}</li>
          ))}
        </ul>
        <div className="hidden md:flex items-center gap-5">
          <a href={`tel:${SITE.phoneIntl}`} className="flex items-center gap-1.5 hover:text-white"><PhoneIcon size={14} /> {SITE.phone}</a>
          <a href={SITE.coachingUrl} target="_blank" rel="noopener" className="hover:text-white">Croco Coaching</a>
        </div>
      </div>
    </div>
  );
}

export function Header({ categories, features }: { categories: Category[]; features: Record<string, MegaFeature[]> }) {
  const { count, setCartOpen, wishlist, ready } = useStore();
  const [mega, setMega] = useState(false);
  const [hoverCat, setHoverCat] = useState(categories[0]?.slug);
  const [drawer, setDrawer] = useState(false);
  const [searchSheet, setSearchSheet] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMega(false); setDrawer(false); setSearchSheet(false); }, [pathname]);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 8);
    h();
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = drawer || searchSheet ? "hidden" : "";
  }, [drawer, searchSheet]);

  const current = categories.find((c) => c.slug === hoverCat) ?? categories[0];

  return (
    <>
      <AnnouncementBar />
      <header className={`sticky top-0 z-40 bg-forest text-white transition-shadow ${scrolled ? "shadow-[0_8px_30px_-12px_rgb(0_0_0/0.5)]" : ""}`} onMouseLeave={() => setMega(false)}>
        <div className="container-x flex h-16 md:h-[76px] items-center gap-3 md:gap-8">
          <button className="md:hidden -ml-2 p-2.5 rounded-full hover:bg-white/10" aria-label="Ouvrir le menu" onClick={() => setDrawer(true)}>
            <MenuIcon size={22} />
          </button>
          <Logo />
          <nav aria-label="Navigation principale" className="hidden lg:flex items-center gap-1 text-[14.5px] font-medium">
            <button
              className={`flex items-center gap-1 rounded-full px-4 py-2.5 hover:bg-white/10 ${mega ? "bg-white/10" : ""}`}
              aria-expanded={mega}
              aria-controls="mega-menu"
              onMouseEnter={() => setMega(true)}
              onClick={() => setMega((m) => !m)}
            >
              Boutique <ChevronDown size={16} className={`transition-transform ${mega ? "rotate-180" : ""}`} />
            </button>
            <NavLink href="/packs/" onEnter={() => setMega(false)}>Packs</NavLink>
            <NavLink href="/boutique/?promo=1" onEnter={() => setMega(false)}>Promotions</NavLink>
            <NavLink href="/boutique/?sort=new" onEnter={() => setMega(false)}>Nouveautés</NavLink>
            <NavLink href="/marques/" onEnter={() => setMega(false)}>Marques</NavLink>
          </nav>
          <div className="hidden md:block flex-1 max-w-xl ml-auto" onMouseEnter={() => setMega(false)}>
            <SearchBox />
          </div>
          <div className="ml-auto md:ml-0 flex items-center gap-0.5">
            <button className="md:hidden p-2.5 rounded-full hover:bg-white/10" aria-label="Rechercher" onClick={() => setSearchSheet(true)}>
              <SearchIcon size={22} />
            </button>
            <Link href="/favoris/" className="relative hidden sm:inline-flex p-2.5 rounded-full hover:bg-white/10" aria-label={`Favoris (${wishlist.length})`}>
              <HeartIcon size={22} />
              {ready && wishlist.length > 0 && <Dot n={wishlist.length} />}
            </Link>
            <button className="relative p-2.5 rounded-full hover:bg-white/10" aria-label={`Panier (${count} articles)`} onClick={() => setCartOpen(true)}>
              <BagIcon size={22} />
              {ready && count > 0 && <Dot n={count} />}
            </button>
          </div>
        </div>

        {/* Mega menu (desktop) */}
        {mega && (
          <div id="mega-menu" className="absolute inset-x-0 top-full hidden lg:block bg-white text-ink border-t border-line shadow-lift animate-pop" onMouseEnter={() => setMega(true)}>
            <div className="container-x grid grid-cols-[260px_1fr_360px] gap-10 py-8">
              <ul className="border-r border-line pr-6 space-y-0.5">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`/categorie/${c.slug}/`}
                      onMouseEnter={() => setHoverCat(c.slug)}
                      onFocus={() => setHoverCat(c.slug)}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] font-medium ${hoverCat === c.slug ? "bg-bone" : "hover:bg-bone"}`}
                    >
                      {c.name} <span className="text-xs text-muted">{c.count}</span>
                    </Link>
                  </li>
                ))}
                <li className="pt-2 mt-2 border-t border-line">
                  <Link href="/packs/" className="flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[15px] font-semibold text-croco hover:bg-croco-50">Packs <ChevronRight size={16} /></Link>
                </li>
              </ul>
              {current && (
                <div>
                  <p className="display text-4xl">{current.name}</p>
                  <p className="mt-2 text-muted max-w-md">{current.blurb}</p>
                  <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1 max-w-lg">
                    {current.subs.map((s) => (
                      <Link key={s.slug} href={`/categorie/${current.slug}/?sub=${s.slug}`} className="flex items-center justify-between rounded-lg py-2 pr-2 text-[15px] hover:text-croco border-b border-line">
                        {s.name} <span className="text-xs text-muted">{s.count}</span>
                      </Link>
                    ))}
                  </div>
                  <Link href={`/categorie/${current.slug}/`} className="mt-6 inline-flex items-center gap-2 font-semibold text-sm hover:text-croco">
                    Tout voir ({current.count} produits) <ArrowRight size={16} />
                  </Link>
                </div>
              )}
              <div>
                <p className="eyebrow text-muted mb-3">Les plus vendus</p>
                <div className="space-y-2">
                  {(features[current?.slug ?? ""] ?? []).map((f) => (
                    <Link key={f.slug} href={`/produit/${f.slug}/`} className="flex items-center gap-3 rounded-xl p-2 hover:bg-bone">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={productImage(f.image)} alt="" width={64} height={64} className="size-16 rounded-lg bg-bone object-contain" loading="lazy" />
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted truncate">{f.brand}</span>
                        <span className="block text-sm font-medium line-clamp-2">{f.shortName}</span>
                        <span className="text-sm font-semibold">{tndShort(f.price)}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile search sheet */}
      {searchSheet && (
        <div className="fixed inset-0 z-[60] bg-white md:hidden overflow-y-auto" role="dialog" aria-modal="true" aria-label="Recherche">
          <div className="flex items-center gap-1 p-3 h-[73px]">
            <div className="min-w-0 flex-1"><SearchBox variant="sheet" autoFocus onDone={() => setSearchSheet(false)} /></div>
            <button className="shrink-0 px-2 py-3 text-sm font-semibold" onClick={() => setSearchSheet(false)}>Annuler</button>
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="absolute inset-0 bg-ink/50 backdrop-blur-[2px]" aria-label="Fermer le menu" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-[86%] max-w-sm bg-white flex flex-col animate-drawer shadow-lift">
            <div className="flex items-center justify-between bg-forest px-4 h-16">
              <Logo />
              <button className="p-2.5 text-white rounded-full hover:bg-white/10" aria-label="Fermer" onClick={() => setDrawer(false)}><CloseIcon size={22} /></button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2 p-4">
                <Link href="/packs/" className="rounded-2xl bg-forest text-white p-4"><span className="display text-2xl">Packs</span><span className="block text-xs text-white/70 mt-1">Économisez sur vos routines</span></Link>
                <Link href="/boutique/?promo=1" className="rounded-2xl bg-volt p-4"><span className="display text-2xl">Promos</span><span className="block text-xs text-ink/70 mt-1">Prix barrés vérifiés</span></Link>
              </div>
              <p className="eyebrow text-muted px-5 pt-2 pb-1">Catégories</p>
              <ul>
                {categories.map((c) => (
                  <li key={c.slug}>
                    <details className="group border-b border-line">
                      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[16px] font-medium">
                        {c.name}
                        <ChevronDown size={18} className="text-muted transition-transform group-open:rotate-180" />
                      </summary>
                      <ul className="pb-3">
                        <li><Link href={`/categorie/${c.slug}/`} className="block px-7 py-2.5 text-[15px] font-semibold text-croco">Tout voir ({c.count})</Link></li>
                        {c.subs.map((s) => (
                          <li key={s.slug}><Link href={`/categorie/${c.slug}/?sub=${s.slug}`} className="block px-7 py-2.5 text-[15px] text-ink/80">{s.name}</Link></li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
              <ul className="py-2">
                {[["/boutique/?sort=new", "Nouveautés"], ["/marques/", "Marques"], ["/favoris/", "Mes favoris"], ["/livraison/", "Livraison & paiement"], ["/contact/", "Contact"]].map(([h, l]) => (
                  <li key={h}><Link href={h} className="flex items-center justify-between px-5 py-3.5 text-[15px]">{l}<ChevronRight size={16} className="text-muted" /></Link></li>
                ))}
              </ul>
            </div>
            <a href={`tel:${SITE.phoneIntl}`} className="m-4 btn btn-outline"><PhoneIcon size={18} /> Conseil : {SITE.phone}</a>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, children, onEnter }: { href: string; children: React.ReactNode; onEnter?: () => void }) {
  return (
    <Link href={href} onMouseEnter={onEnter} className="rounded-full px-4 py-2.5 hover:bg-white/10">
      {children}
    </Link>
  );
}

function Dot({ n }: { n: number }) {
  return (
    <span className="absolute right-0.5 top-0.5 grid min-w-[18px] h-[18px] place-items-center rounded-full bg-volt px-1 text-[10.5px] font-bold text-ink animate-pop">
      {n > 99 ? "99+" : n}
    </span>
  );
}


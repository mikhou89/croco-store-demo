import Link from "next/link";
import { bestSellers, brands, categories, newest, packs, packView, products, toLite } from "@/lib/catalog";
import { asset, discountPct, productImage } from "@/lib/format";
import { SITE, VERIFIED_PROMISES } from "@/lib/site";
import { SectionHead, ProductRail } from "@/components/Section";
import { BestSellerTabs } from "@/components/BestSellerTabs";
import { PackCard } from "@/components/PackCard";
import { ArrowRight, BadgeIcon, ChatIcon, ShieldIcon, TruckIcon, PhoneIcon, BoltIcon } from "@/components/Icons";

const ICONS = { truck: TruckIcon, shield: ShieldIcon, badge: BadgeIcon, chat: ChatIcon };

export default function Home() {
  const available = (p: (typeof products)[number]) => p.stock !== "backorder" && p.stock !== "out_of_stock";
  const tabs = [
    { key: "all", label: "Tous", items: bestSellers(8, (p) => !p.isPack).map(toLite) },
    ...["proteines", "creatine", "gainers-prise-de-masse", "boosters-et-pre-workout", "sante-et-bien-etre"].map((c) => ({
      key: c,
      label: categories.find((x) => x.slug === c)!.name,
      items: bestSellers(8, (p) => p.categories.includes(c) && !p.isPack).map(toLite),
    })),
  ];
  const allPacks = packs();
  const featuredPacks = [...allPacks]
    .filter(available)
    .sort((a, b) => (b.packValue ?? 0) - b.price - ((a.packValue ?? 0) - a.price))
    .slice(0, 4)
    .map(packView);
  const promos = [...products]
    .filter((p) => p.regularPrice && !p.isPack && available(p))
    .sort((a, b) => discountPct(b.price, b.regularPrice) - discountPct(a.price, a.regularPrice))
    .slice(0, 8)
    .map(toLite);
  const fresh = newest(8, (p) => !p.isPack).map(toLite);
  const promoCount = products.filter((p) => p.regularPrice).length;
  const catTiles = categories.map((c) => ({ ...c, img: bestSellers(1, (p) => p.categories.includes(c.slug) && !p.isPack && p.images.length > 0)[0]?.images[0] ?? null }));

  return (
    <>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-forest text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset("/img/site/hero-gsn.webp")}
          srcSet={`${asset("/img/site/hero-gsn-m.webp")} 1000w, ${asset("/img/site/hero-gsn.webp")} 2000w`}
          sizes="100vw"
          alt="Gamme GSN : Nitro Whey, Big Mass Gainer et Pure Whey"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-right opacity-60 md:opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-forest via-forest/85 to-forest/10" />
        <div className="container-x relative grid min-h-[620px] md:min-h-[640px] content-end md:content-center pb-12 pt-40 md:py-24">
          <div className="max-w-2xl animate-fade-up">
            <p className="eyebrow text-volt flex items-center gap-2"><BoltIcon size={15} /> Nutrition sportive · Livraison partout en Tunisie</p>
            <h1 className="display mt-4 text-[3.4rem] leading-[0.88] sm:text-7xl md:text-[6.2rem]">
              Au service de <span className="text-volt">votre</span> transformation.
            </h1>
            <p className="mt-5 max-w-lg text-[16.5px] md:text-lg text-white/80 leading-relaxed">
              Protéines, créatine, gainers et vitamines de {brands.length} marques reconnues. Des packs pensés par objectif, payés à la livraison.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/boutique/" className="btn btn-volt h-14 px-8 text-base">Découvrir la boutique <ArrowRight size={18} /></Link>
              <Link href="/packs/" className="btn btn-ghost h-14 px-8 text-base text-white">Trouver mon pack</Link>
            </div>
          </div>
          <dl className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/15 pt-6">
            {[
              [products.length, "produits en ligne"],
              [brands.length, "marques"],
              [allPacks.length, "packs prêts à l'emploi"],
            ].map(([n, l]) => (
              <div key={l as string}>
                <dt className="sr-only">{l}</dt>
                <dd className="display text-4xl md:text-5xl text-white">{n}</dd>
                <dd className="text-[12.5px] md:text-sm text-white/65">{l}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- PROMISES STRIP ---------------- */}
      <section className="border-b border-line bg-white">
        <div className="container-x grid grid-cols-2 lg:grid-cols-4 divide-line">
          {VERIFIED_PROMISES.map((v) => {
            const I = ICONS[v.icon];
            return (
              <div key={v.title} className="flex items-center gap-3 py-5 lg:py-6 pr-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-croco-50 text-croco"><I size={21} /></span>
                <p className="text-[13.5px] font-semibold leading-tight">{v.title}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="container-x pt-16 md:pt-24">
        <SectionHead eyebrow="Par objectif" title="Que cherchez-vous ?" href="/boutique/" cta="Toute la boutique" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
          {catTiles.map((c, i) => (
            <Link
              key={c.slug}
              href={`/categorie/${c.slug}/`}
              className={`group relative overflow-hidden rounded-[1.5rem] p-4 md:p-6 min-h-[190px] md:min-h-[260px] flex flex-col justify-between ${i % 3 === 0 ? "bg-forest text-white" : i % 3 === 1 ? "bg-sand" : "bg-croco-50"}`}
            >
              <div className="relative z-10">
                <p className="display text-[1.7rem] md:text-[2.3rem] max-w-[11ch]">{c.name}</p>
                <p className={`mt-1 text-[12.5px] font-medium ${i % 3 === 0 ? "text-white/60" : "text-muted"}`}>{c.count} produits</p>
              </div>
              <span className="absolute right-3 bottom-3 md:right-4 md:bottom-4 w-[50%] md:w-[46%] aspect-square rounded-2xl bg-white p-2 shadow-card transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={productImage(c.img)} alt="" loading="lazy" className="size-full object-contain" />
              </span>
              <span className={`relative z-10 grid size-10 place-items-center rounded-full transition-colors ${i % 3 === 0 ? "bg-white/10 group-hover:bg-volt group-hover:text-ink" : "bg-white group-hover:bg-ink group-hover:text-white"}`}><ArrowRight size={17} /></span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- BEST SELLERS ---------------- */}
      <section className="container-x pt-16 md:pt-24">
        <SectionHead eyebrow="Les plus vendus" title="Best-sellers" href="/boutique/?sort=popular" />
        <BestSellerTabs tabs={tabs} />
      </section>

      {/* ---------------- PACKS ---------------- */}
      <section className="mt-16 md:mt-24 bg-forest py-16 md:py-24 text-white">
        <div className="container-x">
          <SectionHead tone="dark" eyebrow="Packs exclusifs" title={<>Votre routine complète, <span className="text-volt">à prix pack</span></>} href="/packs/" cta={`Les ${allPacks.length} packs`}>
            <p className="mt-3 text-white/70 max-w-xl">Économies calculées à partir des prix unitaires actuellement affichés sur la boutique.</p>
          </SectionHead>
          <div className="-mx-4 px-4 md:mx-0 md:px-0 flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto snap-x no-scrollbar">
            {featuredPacks.map((p) => (
              <div key={p.lite.id} className="w-[82%] sm:w-[48%] md:w-auto shrink-0 snap-start flex"><PackCard pack={p} tone="dark" /></div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
            {[["prise-de-masse", "Prise de masse"], ["force-performance", "Force & performance"], ["recuperation", "Récupération"], ["bien-etre", "Bien-être"], ["debutant", "Débuter"]].map(([g, l]) => (
              <Link key={g} href={`/packs/?objectif=${g}`} className="rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium hover:bg-white hover:text-ink">{l}</Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PROMOS ---------------- */}
      <section className="container-x pt-16 md:pt-24">
        <SectionHead eyebrow={`${promoCount} produits en promotion`} title="Les meilleures remises" href="/boutique/?promo=1&sort=discount" />
        <ProductRail items={promos} />
      </section>

      {/* ---------------- BRAND CAMPAIGNS ---------------- */}
      <section className="container-x pt-16 md:pt-24">
        <div className="grid md:grid-cols-2 gap-4 md:gap-5">
          {[
            { slug: "biotech-usa", img: "/img/site/biotech.webp", name: "BioTechUSA", line: "Iso Whey Zero, créatine, vitamines" },
            { slug: "muscletech", img: "/img/site/muscletech.webp", name: "MuscleTech", line: "Nitro-Tech Whey Protein et plus" },
          ].map((b) => {
            const n = brands.find((x) => x.slug === b.slug)?.count ?? 0;
            return (
              <Link key={b.slug} href={`/marque/${b.slug}/`} className="group relative overflow-hidden rounded-[1.5rem] bg-ink aspect-[2.36/1]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(b.img)} alt={`Campagne ${b.name}`} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-3 text-white">
                  <div>
                    <p className="display text-3xl md:text-4xl">{b.name}</p>
                    <p className="text-sm text-white/75">{b.line} · {n} produits</p>
                  </div>
                  <span className="grid size-11 place-items-center rounded-full bg-white text-ink group-hover:bg-volt"><ArrowRight size={18} /></span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ---------------- NEW ---------------- */}
      <section className="container-x pt-16 md:pt-24">
        <SectionHead eyebrow="Fraîchement arrivés" title="Nouveautés" href="/boutique/?sort=new" />
        <ProductRail items={fresh} />
      </section>

      {/* ---------------- BRANDS ---------------- */}
      <section className="pt-16 md:pt-24">
        <div className="container-x"><SectionHead eyebrow="Marques officielles" title={`${brands.length} marques, un seul store`} href="/marques/" cta="Toutes les marques" /></div>
        <div className="relative overflow-hidden border-y border-line bg-white py-6">
          <div className="flex w-max animate-marquee gap-3 pr-3 hover:[animation-play-state:paused]">
            {[...brands, ...brands].map((b, i) => (
              <Link key={i} href={`/marque/${b.slug}/`} tabIndex={i >= brands.length ? -1 : 0} aria-hidden={i >= brands.length} className="flex items-baseline gap-2 rounded-full border border-line px-6 py-3 hover:border-ink hover:bg-bone whitespace-nowrap">
                <span className="display text-xl">{b.name}</span><span className="text-xs text-muted">{b.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- WHY + DELIVERY ---------------- */}
      <section className="container-x pt-16 md:pt-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-5">
          <div className="rounded-[1.75rem] bg-white p-6 md:p-10 shadow-card">
            <p className="eyebrow text-croco">Pourquoi Croco Store</p>
            <h2 className="display text-[2.4rem] md:text-5xl mt-2">Le sérieux d&apos;un spécialiste</h2>
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              {VERIFIED_PROMISES.map((v) => {
                const I = ICONS[v.icon];
                return (
                  <div key={v.title}>
                    <span className="grid size-12 place-items-center rounded-2xl bg-forest text-volt"><I size={22} /></span>
                    <p className="mt-4 font-semibold">{v.title}</p>
                    <p className="mt-1 text-sm text-muted leading-relaxed">{v.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-croco p-6 md:p-10 text-white flex flex-col">
            <p className="eyebrow text-volt">Livraison & paiement</p>
            <h2 className="display text-[2.4rem] md:text-5xl mt-2">Commandez sereinement</h2>
            <ol className="mt-8 space-y-5">
              {[
                ["Commandez en ligne", "Ajoutez vos produits ou un pack, puis validez en 1 minute."],
                ["Livraison partout en Tunisie", `Offerte dès ${SITE.freeShippingFrom} DT d'achat.`],
                ["Payez à la réception", "Recevez, vérifiez, puis payez en espèces."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="display grid size-10 shrink-0 place-items-center rounded-full bg-white/15 text-xl">{i + 1}</span>
                  <span><span className="block font-semibold">{t}</span><span className="text-sm text-white/75">{d}</span></span>
                </li>
              ))}
            </ol>
            <div className="mt-auto pt-8 flex flex-col sm:flex-row gap-3">
              <Link href="/livraison/" className="btn bg-white text-ink hover:bg-volt">Détails livraison</Link>
              <a href={`tel:${SITE.phoneIntl}`} className="btn btn-ghost text-white"><PhoneIcon size={18} /> {SITE.phone}</a>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- COACHING ---------------- */}
      <section className="container-x pt-5">
        <a href={SITE.coachingUrl} target="_blank" rel="noopener" className="group flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-[1.75rem] bg-ink p-6 md:p-10 text-white">
          <div className="flex items-center gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/img/site/croco-mascot.png")} alt="" width={86} height={73} loading="lazy" className="w-16 md:w-20" />
            <div>
              <p className="display text-3xl md:text-4xl">Croco Coaching</p>
              <p className="text-white/70 mt-1">Besoin d&apos;un programme ? Notre espace coaching vous accompagne.</p>
            </div>
          </div>
          <span className="btn btn-volt self-start md:self-auto">Découvrir le coaching <ArrowRight size={18} /></span>
        </a>
      </section>
    </>
  );
}

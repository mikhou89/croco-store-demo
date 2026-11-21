import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, complementary, getProduct, packsContaining, packView, products, related, toLite } from "@/lib/catalog";
import { productImage, tnd } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Gallery } from "@/components/Gallery";
import { BuyBox } from "@/components/BuyBox";
import { DiscountTag } from "@/components/ProductBits";
import { ProductRail, SectionHead } from "@/components/Section";
import { PackCard, GOAL_LABEL } from "@/components/PackCard";
import { InfoIcon } from "@/components/Icons";

export const dynamicParams = false;
export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const desc = (p.meta || p.summary).slice(0, 158);
  return {
    title: `${p.name} : prix en Tunisie`,
    description: desc,
    alternates: { canonical: `/produit/${p.slug}/` },
    openGraph: { title: p.name, description: desc, images: p.images[0] ? [productImage(p.images[0], 800)] : [] },
  };
}

const AVAIL: Record<string, string> = {
  in_stock: "https://schema.org/InStock",
  low_stock: "https://schema.org/LimitedAvailability",
  backorder: "https://schema.org/BackOrder",
  out_of_stock: "https://schema.org/OutOfStock",
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const lite = toLite(p);
  const cat = categories.find((c) => p.categories.includes(c.slug));
  const sub = cat?.subs.find((s) => p.subcategories.includes(s.slug));
  const rel = related(p).map(toLite);
  const comp = complementary(p).map(toLite);
  const inPacks = packsContaining(p).filter((x) => x.stock !== "out_of_stock").slice(0, 4).map(packView);
  const pack = p.packItems.length ? packView(p) : null;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    image: p.images.map((i) => productImage(i, 800)),
    description: p.summary || p.meta,
    sku: p.id,
    ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
    offers: { "@type": "Offer", priceCurrency: "TND", price: p.price.toFixed(3), availability: AVAIL[p.stock], url: `/produit/${p.slug}/` },
  };

  const sections = [
    { id: "description", title: "Description", html: p.description },
    { id: "utilisation", title: "Conseils d'utilisation", html: p.usage },
    { id: "composition", title: "Composition", html: p.composition },
  ].filter((s) => s.html.trim());

  return (
    <>
      <div className="container-x pt-6">
        <Breadcrumbs
          items={[
            ...(p.isPack ? ([["Packs", "/packs/"]] as [string, string][]) : []),
            ...(cat && !p.isPack ? ([[cat.name, `/categorie/${cat.slug}/`]] as [string, string][]) : []),
            ...(sub && cat && !p.isPack ? ([[sub.name, `/categorie/${cat.slug}/?sub=${sub.slug}`]] as [string, string][]) : []),
            [p.shortName, null],
          ]}
        />
      </div>

      <section className="container-x pt-5 md:pt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <Gallery
          images={p.images}
          alt={p.name}
          badge={
            <>
              <DiscountTag price={p.price} regular={p.regularPrice} />
              {p.isPack && <span className="rounded-full bg-forest px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">Pack</span>}
              {p.isNew && <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider shadow-sm">Nouveau</span>}
            </>
          }
        />
        <div>
          {p.brand && p.brandSlug ? (
            <Link href={`/marque/${p.brandSlug}/`} className="eyebrow text-croco hover:underline">{p.brand}</Link>
          ) : (
            <p className="eyebrow text-croco">Croco Store</p>
          )}
          <h1 className="mt-2 text-[1.75rem] md:text-[2.4rem] font-semibold leading-[1.1] tracking-tight">{p.shortName}</h1>
          {p.summary && <p className="mt-4 text-[15.5px] leading-relaxed text-ink/75">{p.summary}</p>}
          {pack && pack.goals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {pack.goals.map((g) => <Link key={g} href={`/packs/?objectif=${g}`} className="rounded-full bg-croco-50 px-3 py-1 text-xs font-semibold text-croco-600">{GOAL_LABEL[g]}</Link>)}
            </div>
          )}
          <div className="mt-6 border-t border-line pt-6">
            <BuyBox p={lite} />
          </div>
        </div>
      </section>

      {pack && (
        <section className="container-x pt-14">
          <div className="rounded-[1.75rem] bg-white p-5 md:p-8 shadow-card">
            <h2 className="display text-3xl md:text-4xl">Contenu du pack</h2>
            <ul className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {pack.items.map((it, n) => (
                <li key={n}>
                  {it.slug ? (
                    <Link href={`/produit/${it.slug}/`} className="flex items-center gap-3 rounded-2xl bg-bone p-3 hover:ring-1 hover:ring-ink">
                      <PackItem it={it} />
                    </Link>
                  ) : (
                    <div className="flex items-center gap-3 rounded-2xl bg-bone p-3"><PackItem it={it} /></div>
                  )}
                </li>
              ))}
            </ul>
            {p.packValue ? (
              <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span>Valeur à l&apos;unité : <span className="line-through text-muted">{tnd(p.packValue)}</span></span>
                <span className="font-semibold">Prix du pack : {tnd(p.price)}</span>
                <span className="rounded-full bg-volt px-2.5 py-0.5 font-bold">Économie {tnd(p.packValue - p.price)}</span>
              </p>
            ) : null}
            {p.packChecked === false && (
              <p className="mt-4 flex items-start gap-2 rounded-2xl bg-volt/25 p-3 text-[13px]"><InfoIcon size={16} className="shrink-0 mt-px" /> La composition configurée sur crocostore.tn diffère de la description du pack : contenu exact à confirmer avec Croco Store. Aucune économie n&apos;est affichée.</p>
            )}
            <p className="mt-3 flex items-start gap-2 text-xs text-muted"><InfoIcon size={15} className="shrink-0 mt-px" /> Contenu et prix unitaires tels qu&apos;affichés sur crocostore.tn. La description du pack peut mentionner des cadeaux (échantillons, shaker) non listés ici.</p>
          </div>
        </section>
      )}

      {sections.length > 0 && (
        <section className="container-x pt-14 grid lg:grid-cols-[220px_1fr] gap-8">
          <nav className="hidden lg:block sticky top-[110px] self-start" aria-label="Sections de la fiche">
            <ul className="space-y-1 border-l border-line">
              {sections.map((s) => <li key={s.id}><a href={`#${s.id}`} className="block -ml-px border-l-2 border-transparent pl-4 py-1.5 text-sm text-muted hover:text-ink hover:border-ink">{s.title}</a></li>)}
            </ul>
          </nav>
          <div className="space-y-4 max-w-3xl">
            {sections.map((s, n) => (
              <details key={s.id} id={s.id} open={n === 0 || undefined} className="group scroll-mt-32 rounded-[1.5rem] bg-white shadow-card [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-5 md:px-8">
                  <h2 className="display text-2xl md:text-3xl">{s.title}</h2>
                  <span className="grid size-9 place-items-center rounded-full bg-bone text-xl leading-none transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="prose-croco px-5 pb-7 md:px-8" dangerouslySetInnerHTML={{ __html: s.html }} />
              </details>
            ))}
            <p className="text-xs text-muted px-2">Informations issues de la fiche produit crocostore.tn. Les compléments alimentaires ne remplacent pas une alimentation variée et équilibrée.</p>
          </div>
        </section>
      )}

      {inPacks.length > 0 && (
        <section className="container-x pt-16">
          <SectionHead eyebrow="Économisez avec un pack" title="Disponible aussi en pack" href="/packs/" cta="Tous les packs" />
          <div className="-mx-4 px-4 md:mx-0 md:px-0 flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto snap-x no-scrollbar">
            {inPacks.map((x) => <div key={x.lite.id} className="w-[82%] sm:w-[48%] md:w-auto shrink-0 snap-start flex"><PackCard pack={x} /></div>)}
          </div>
        </section>
      )}

      {comp.length > 0 && (
        <section className="container-x pt-16">
          <SectionHead eyebrow="Complétez votre routine" title="Souvent associés" />
          <ProductRail items={comp} />
        </section>
      )}

      {rel.length > 0 && (
        <section className="container-x pt-16">
          <SectionHead eyebrow={sub?.name ?? cat?.name ?? "Boutique"} title="Produits similaires" href={cat ? `/categorie/${cat.slug}/` : "/boutique/"} />
          <ProductRail items={rel.slice(0, 8)} />
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}

function PackItem({ it }: { it: { name: string; brand: string | null; image: string | null; qty: number; price: number | null } }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={productImage(it.image)} alt="" loading="lazy" className="size-16 shrink-0 rounded-xl bg-white object-contain p-1" />
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted truncate">{it.brand}</span>
        <span className="block text-sm font-medium leading-snug line-clamp-2">{it.qty > 1 ? `${it.qty} × ` : ""}{it.name}</span>
        {it.price !== null && <span className="text-xs text-muted">{tnd(it.price)} l&apos;unité</span>}
      </span>
    </>
  );
}

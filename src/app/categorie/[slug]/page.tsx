import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { categories, getCategory, inCategory, toLite } from "@/lib/catalog";
import { Catalog } from "@/components/Catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamicParams = false;
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = getCategory((await params).slug);
  if (!c) return {};
  return { title: `${c.name} en Tunisie`, description: `${c.blurb} ${c.count} produits, prix en TND, paiement à la livraison.` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const c = getCategory((await params).slug);
  if (!c) notFound();
  const items = inCategory(c.slug).map(toLite);
  return (
    <>
      <div className="container-x pt-6"><Breadcrumbs items={[["Boutique", "/boutique/"], [c.name, null]]} /></div>
      {c.subs.length > 0 && (
        <div className="container-x pt-6 -mb-2">
          <div className="-mx-4 px-4 md:mx-0 md:px-0 flex gap-2 overflow-x-auto no-scrollbar">
            {c.subs.map((s) => (
              <Link key={s.slug} href={`/categorie/${c.slug}/?sub=${s.slug}`} className="chip shrink-0">{s.name} <span className="text-muted text-xs">{s.count}</span></Link>
            ))}
          </div>
        </div>
      )}
      <Catalog items={items} title={c.name} intro={c.blurb} facetLabel="Type de produit" facets={c.subs.map((s) => ({ key: s.slug, label: s.name, field: "subcategories" as const }))} />
    </>
  );
}

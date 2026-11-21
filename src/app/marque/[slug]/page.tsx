import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brands, categories, getBrand, products, toLite } from "@/lib/catalog";
import { Catalog } from "@/components/Catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const dynamicParams = false;
export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const b = getBrand((await params).slug);
  if (!b) return {};
  return { title: `${b.name} : produits et prix en Tunisie`, description: `Les ${b.count} produits ${b.name} disponibles chez Croco Store, prix en TND, paiement à la livraison.` };
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const b = getBrand((await params).slug);
  if (!b) notFound();
  const items = products.filter((p) => p.brandSlug === b.slug).map(toLite);
  return (
    <>
      <div className="container-x pt-6"><Breadcrumbs items={[["Marques", "/marques/"], [b.name, null]]} /></div>
      <Catalog
        items={items}
        title={b.name}
        intro={`${b.count} produit${b.count > 1 ? "s" : ""} ${b.name} disponibles chez Croco Store.`}
        facetLabel="Catégorie"
        facets={[...categories.map((c) => ({ key: c.slug, label: c.name, field: "categories" as const })), { key: "packs", label: "Packs", field: "categories" as const }]}
      />
    </>
  );
}

import type { Metadata } from "next";
import { allLite, categories } from "@/lib/catalog";
import { Catalog } from "@/components/Catalog";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Boutique : tous les compléments alimentaires",
  description: "Protéines, créatine, gainers, acides aminés, pré-workout, brûleurs, vitamines et packs. Filtrez par marque, prix et disponibilité.",
};

export default function Shop() {
  return (
    <>
      <div className="container-x pt-6"><Breadcrumbs items={[["Boutique", null]]} /></div>
      <Catalog
        items={allLite()}
        title="La boutique"
        intro="Toute la nutrition sportive Croco Store. Filtrez par objectif, marque, prix ou disponibilité."
        facetLabel="Catégorie"
        facets={[...categories.map((c) => ({ key: c.slug, label: c.name, field: "categories" as const })), { key: "packs", label: "Packs", field: "categories" as const }]}
      />
    </>
  );
}

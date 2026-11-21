import type { Metadata } from "next";
import Link from "next/link";
import { brands, bestSellers } from "@/lib/catalog";
import { productImage } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowRight } from "@/components/Icons";

export const metadata: Metadata = { title: "Toutes les marques", description: "GSN, Real Pharm, BioTechUSA, Ultimate Nutrition, Optimum Nutrition… toutes les marques de nutrition sportive de Croco Store." };

export default function Brands() {
  return (
    <div className="container-x">
      <div className="pt-6"><Breadcrumbs items={[["Marques", null]]} /></div>
      <h1 className="display text-5xl md:text-7xl pt-8 md:pt-12">Nos marques</h1>
      <p className="mt-3 text-muted md:text-lg max-w-2xl">{brands.length} marques de nutrition sportive, des leaders internationaux aux spécialistes européens.</p>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
        {brands.map((b) => {
          const top = bestSellers(3, (p) => p.brandSlug === b.slug && p.images.length > 0);
          const img = top[0]?.images[0] ?? null;
          return (
            <Link key={b.slug} href={`/marque/${b.slug}/`} className="group relative flex flex-col justify-between overflow-hidden rounded-[1.5rem] bg-white p-5 shadow-card hover:shadow-lift min-h-[200px]">
              <div className="relative z-10">
                <p className="display text-2xl md:text-3xl leading-none">{b.name}</p>
                <p className="mt-2 text-sm text-muted">{b.count} produit{b.count > 1 ? "s" : ""}</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {img && <img src={productImage(img)} alt="" loading="lazy" className="absolute -right-3 -bottom-3 w-1/2 object-contain mix-blend-multiply opacity-90 transition-transform duration-500 group-hover:scale-110" />}
              <span className="relative z-10 grid size-10 place-items-center rounded-full bg-bone group-hover:bg-ink group-hover:text-white"><ArrowRight size={17} /></span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

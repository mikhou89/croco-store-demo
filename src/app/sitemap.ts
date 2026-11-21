import type { MetadataRoute } from "next";
import { brands, categories, products } from "@/lib/catalog";

export const dynamic = "force-static";
const BASE = (process.env.NEXT_PUBLIC_SITE_URL || "https://croco-store-demo.vercel.app") + (process.env.NEXT_PUBLIC_BASE_PATH || "");

export default function sitemap(): MetadataRoute.Sitemap {
  const urls = ["/", "/boutique/", "/packs/", "/marques/", "/livraison/", "/contact/"]
    .concat(categories.map((c) => `/categorie/${c.slug}/`))
    .concat(brands.map((b) => `/marque/${b.slug}/`))
    .concat(products.map((p) => `/produit/${p.slug}/`));
  return urls.map((u) => ({ url: BASE + u }));
}

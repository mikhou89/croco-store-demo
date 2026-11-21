import productsJson from "@/data/products.json";
import catalogJson from "@/data/catalog.json";
import type { Brand, Category, Product, ProductLite } from "./types";

export const products = productsJson as Product[];
export const categories = catalogJson.categories as Category[];
export const brands = catalogJson.brands as Brand[];
export const packGoals = catalogJson.packGoals as { slug: string; name: string }[];
export const capturedAt = catalogJson.capturedAt as string;

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byId = new Map(products.map((p) => [p.id, p]));

export const getProduct = (slug: string) => bySlug.get(slug);
export const getProductById = (id: string) => byId.get(id);
export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getBrand = (slug: string) => brands.find((b) => b.slug === slug);

export function toLite(p: Product): ProductLite {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    shortName: p.shortName,
    brand: p.brand,
    brandSlug: p.brandSlug,
    categories: p.categories,
    subcategories: p.subcategories,
    price: p.price,
    regularPrice: p.regularPrice,
    stock: p.stock,
    image: p.images[0] ?? null,
    image2: p.images[1] ?? null,
    isPack: p.isPack,
    isNew: p.isNew,
    bestRank: p.bestRank,
    date: p.dateAdded,
    flavours: p.flavours,
    summary: p.summary.length > 220 ? p.summary.slice(0, 217).trimEnd() + "…" : p.summary,
    goals: p.goals,
    packValue: p.packValue,
    packCount: p.packItems.reduce((a, i) => a + i.qty, 0) || undefined,
  };
}

export const allLite = () => products.map(toLite);

export const inCategory = (slug: string) =>
  products.filter((p) => p.categories.includes(slug) || p.subcategories.includes(slug));

const availableFirst = (a: Product, b: Product) =>
  Number(a.stock === "backorder" || a.stock === "out_of_stock") - Number(b.stock === "backorder" || b.stock === "out_of_stock");

/** Ranked by the live store's "Meilleures ventes" page order. */
export const bestSellers = (n: number, filter: (p: Product) => boolean = () => true) =>
  products
    .filter((p) => p.bestRank !== null && filter(p))
    .sort((a, b) => availableFirst(a, b) || a.bestRank! - b.bestRank!)
    .slice(0, n);

export const newest = (n: number, filter: (p: Product) => boolean = () => true) =>
  [...products]
    .filter(filter)
    .sort((a, b) => availableFirst(a, b) || b.dateAdded.localeCompare(a.dateAdded))
    .slice(0, n);

export const packs = () => products.filter((p) => p.packItems.length > 0);

export function related(p: Product, n = 8) {
  const mainCat = categories.find((c) => p.categories.includes(c.slug));
  const key = mainCat?.subs.find((s) => p.subcategories.includes(s.slug))?.slug ?? mainCat?.slug ?? p.categories[0];
  return products
    .filter((x) => x.id !== p.id && !x.isPack && (x.subcategories.includes(key) || x.categories.includes(key)))
    .sort((a, b) => availableFirst(a, b) || Number(b.brand === p.brand) - Number(a.brand === p.brand) || (a.bestRank ?? 999) - (b.bestRank ?? 999))
    .slice(0, n);
}

/** Packs that contain this product = genuine "complete your routine" suggestions. */
export function packsContaining(p: Product) {
  return products.filter((x) => x.packItems.some((i) => i.id === p.id));
}

/** Complementary categories, chosen by sports-nutrition logic (not invented data). */
const COMPLEMENTS: Record<string, string[]> = {
  proteines: ["creatine", "accessoires-nutrition", "acides-amines"],
  "gainers-prise-de-masse": ["creatine", "sante-et-bien-etre", "accessoires-nutrition"],
  creatine: ["proteines", "boosters-et-pre-workout", "accessoires-nutrition"],
  "acides-amines": ["proteines", "creatine"],
  "boosters-et-pre-workout": ["creatine", "acides-amines"],
  "bruleurs-de-graisse": ["proteines", "sante-et-bien-etre"],
  "sante-et-bien-etre": ["creatine", "proteines"],
  "accessoires-nutrition": ["proteines", "creatine"],
};
export function complementary(p: Product, n = 4) {
  const cats = COMPLEMENTS[categories.find((c) => p.categories.includes(c.slug))?.slug ?? ""] ?? ["creatine", "proteines"];
  const out: Product[] = [];
  for (const c of cats) {
    const best = bestSellers(20, (x) => x.categories.includes(c) && !x.isPack && x.stock !== "backorder" && x.stock !== "out_of_stock" && x.id !== p.id);
    const pick = best.find((x) => !out.includes(x));
    if (pick) out.push(pick);
    if (out.length >= n) break;
  }
  return out;
}

export interface PackView {
  lite: ProductLite;
  goals: string[];
  items: { slug: string | null; name: string; brand: string | null; image: string | null; qty: number; price: number | null }[];
}
export function packView(p: Product): PackView {
  return {
    lite: toLite(p),
    goals: p.goals ?? [],
    items: p.packItems.map((i) => {
      const x = byId.get(i.id);
      return { slug: x?.slug ?? null, name: x?.shortName ?? i.label, brand: x?.brand ?? null, image: x?.images[0] ?? null, qty: i.qty, price: x?.price ?? null };
    }),
  };
}

export type StockStatus = "in_stock" | "low_stock" | "backorder" | "out_of_stock";

export interface PackItem {
  id: string;
  qty: number;
  label: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  brand: string | null;
  brandSlug: string | null;
  categories: string[];
  subcategories: string[];
  price: number;
  regularPrice: number | null;
  stock: StockStatus;
  flavours: string[];
  images: string[];
  summary: string;
  meta: string;
  description: string;
  usage: string;
  composition: string;
  isPack: boolean;
  isNew: boolean;
  bestRank: number | null;
  dateAdded: string;
  sourceUrl: string;
  packItems: PackItem[];
  goals?: string[];
  packValue?: number | null;
  packChecked?: boolean;
}

/** Light version of a product, safe to ship to the browser for listings & search. */
export interface ProductLite {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  brand: string | null;
  brandSlug: string | null;
  categories: string[];
  subcategories: string[];
  price: number;
  regularPrice: number | null;
  stock: StockStatus;
  image: string | null;
  image2: string | null;
  isPack: boolean;
  isNew: boolean;
  bestRank: number | null;
  date: string;
  flavours: string[];
  summary: string;
  goals?: string[];
  packValue?: number | null;
  packCount?: number;
}

export interface Category {
  slug: string;
  name: string;
  blurb: string;
  count: number;
  subs: { slug: string; name: string; count: number }[];
}

export interface Brand {
  name: string;
  slug: string;
  count: number;
}

import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { bestSellers, toLite } from "@/lib/catalog";

export const metadata: Metadata = { title: "Votre panier" };

export default function CartPage() {
  const suggestions = bestSellers(4, (p) => p.categories.includes("accessoires-nutrition") || (p.categories.includes("creatine") && !p.isPack)).map(toLite);
  return <CartView suggestions={suggestions} />;
}

import type { Metadata } from "next";
import { Wishlist } from "@/components/Wishlist";

export const metadata: Metadata = { title: "Mes favoris" };
export default function Page() {
  return <Wishlist />;
}

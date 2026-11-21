import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = { title: "Commande (démonstration)" };

export default function CheckoutPage() {
  return <Checkout />;
}

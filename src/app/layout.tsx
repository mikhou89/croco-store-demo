import type { Metadata, Viewport } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { bestSellers, categories } from "@/lib/catalog";
import { Header, type MegaFeature } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { BottomNav, DemoBadge, Toast } from "@/components/Chrome";
import { QuickViewProvider } from "@/components/QuickView";
import { SITE } from "@/lib/site";
import { asset } from "@/lib/format";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://croco-store-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: { default: "Croco Store · Nutrition sportive & compléments en Tunisie (concept)", template: "%s · Croco Store" },
  description:
    "Protéines, créatine, gainers, pré-workout, vitamines et packs : la nutrition sportive livrée partout en Tunisie. Concept de refonte du site Croco Store.",
  // Demo: keep it out of search engines so it never competes with the real crocostore.tn
  robots: { index: false, follow: false },
  openGraph: { type: "website", locale: "fr_TN", siteName: "Croco Store (concept)", images: [asset("/img/site/hero-gsn.webp")] },
  icons: { icon: asset("/img/site/croco-mascot.png") },
};

export const viewport: Viewport = { themeColor: "#10221b", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const features: Record<string, MegaFeature[]> = Object.fromEntries(
    categories.map((c) => [
      c.slug,
      bestSellers(3, (p) => p.categories.includes(c.slug) && !p.isPack).map((p) => ({ slug: p.slug, image: p.images[0] ?? null, brand: p.brand, shortName: p.shortName, price: p.price })),
    ]),
  );
  const org = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: SITE.name,
    url: SITE.liveUrl,
    telephone: SITE.phoneIntl,
    address: { "@type": "PostalAddress", addressCountry: "TN" },
    paymentAccepted: "Cash",
    currenciesAccepted: "TND",
  };
  return (
    <html lang="fr-TN">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Aller au contenu</a>
        <StoreProvider>
          <QuickViewProvider>
            <Header categories={categories} features={features} />
            <main id="main">{children}</main>
            <Footer categories={categories} />
            <CartDrawer />
            <BottomNav />
            <DemoBadge />
            <Toast />
          </QuickViewProvider>
        </StoreProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org) }} />
      </body>
    </html>
  );
}

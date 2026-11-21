import Link from "next/link";
import type { Category } from "@/lib/types";
import { DEMO_NOTICE, SITE } from "@/lib/site";
import { Logo } from "./Logo";
import { PhoneIcon } from "./Icons";
import { Newsletter } from "./Newsletter";

export function Footer({ categories }: { categories: Category[] }) {
  return (
    <footer className="bg-forest text-white/75 mt-24 pb-20 md:pb-0">
      <div className="container-x py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed">{SITE.tagline} Nutrition sportive, compléments et accessoires, livrés partout en Tunisie.</p>
            <a href={`tel:${SITE.phoneIntl}`} className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-white/15 px-4 py-3 hover:border-white/40">
              <PhoneIcon size={20} className="text-volt" />
              <span><span className="block text-xs text-white/60">Besoin d&apos;aide ?</span><span className="font-semibold text-white">{SITE.phone}</span></span>
            </a>
          </div>
          <FooterCol title="Boutique" links={[...categories.map((c) => [`/categorie/${c.slug}/`, c.name] as [string, string]), ["/packs/", "Packs"]]} />
          <FooterCol
            title="Aide"
            links={[
              ["/livraison/", "Livraison & paiement"],
              ["/contact/", "Contact"],
              ["/marques/", "Toutes les marques"],
              ["/favoris/", "Mes favoris"],
              [SITE.coachingUrl, "Croco Coaching"],
              ["/a-propos-de-la-demo/", "À propos de cette démo"],
            ]}
          />
          <div>
            <p className="display text-2xl text-white">Rejoignez la team Croco</p>
            <p className="mt-2 text-sm">Promos, nouveautés et conseils pour booster vos performances.</p>
            <Newsletter />
          </div>
        </div>
        <div className="mt-14 border-t border-white/10 pt-6 flex flex-col md:flex-row gap-4 md:items-center md:justify-between text-xs text-white/50">
          <p>© {SITE.legalName} 2025 · Croco Store. Marques et visuels produits : leurs propriétaires respectifs.</p>
          <p className="max-w-xl md:text-right">{DEMO_NOTICE}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="eyebrow text-white/50 mb-4">{title}</p>
      <ul className="space-y-2.5 text-[15px]">
        {links.map(([h, l]) => (
          <li key={h}>
            {h.startsWith("http") ? (
              <a href={h} target="_blank" rel="noopener" className="hover:text-white">{l}</a>
            ) : (
              <Link href={h} className="hover:text-white">{l}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { brands, capturedAt, packs, products } from "@/lib/catalog";
import { DEMO_NOTICE, SITE } from "@/lib/site";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CheckIcon, InfoIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "À propos de cette démo" };

export default function About() {
  const d = new Date(capturedAt).toLocaleDateString("fr-TN", { day: "numeric", month: "long", year: "numeric" });
  const verified = [
    `${products.length} produits, ${brands.length} marques et ${packs().length} packs`,
    "Noms, prix TND, prix barrés et remises",
    "Disponibilité (en stock, derniers articles, réapprovisionnement)",
    "Saveurs, photos et descriptions produits",
    "Contenu exact de chaque pack",
    `Téléphone ${SITE.phone}, livraison offerte dès ${SITE.freeShippingFrom} DT, paiement à la livraison`,
  ];
  const toConfirm = [
    "Numéro WhatsApp (le site actuel affiche des visuels WhatsApp sans lien)",
    "Frais de livraison sous 100 DT, transporteur et délai de retour",
    "E-mail de contact, adresse du magasin et mentions légales (champs non remplis sur le site actuel)",
    "Liens réseaux sociaux (actuellement « # » sur le site)",
    "Prix éventuellement différents selon la saveur",
    "Avis clients : aucun avis vérifiable, donc aucun n'est affiché",
  ];
  return (
    <div className="container-x max-w-4xl">
      <div className="pt-6"><Breadcrumbs items={[["À propos de cette démo", null]]} /></div>
      <h1 className="display text-5xl md:text-7xl pt-8 md:pt-12">À propos de cette démo</h1>
      <p className="mt-4 text-lg text-ink/80 leading-relaxed">{DEMO_NOTICE}</p>
      <div className="mt-10 grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-card">
          <p className="eyebrow text-croco">Données reprises du site (relevé du {d})</p>
          <ul className="mt-4 space-y-3 text-[15px]">{verified.map((t) => <li key={t} className="flex gap-2.5"><CheckIcon size={19} className="text-croco shrink-0" />{t}</li>)}</ul>
        </div>
        <div className="rounded-3xl bg-white p-6 md:p-8 shadow-card">
          <p className="eyebrow text-amber">À confirmer avec Croco Store</p>
          <ul className="mt-4 space-y-3 text-[15px]">{toConfirm.map((t) => <li key={t} className="flex gap-2.5"><InfoIcon size={19} className="text-amber shrink-0" />{t}</li>)}</ul>
        </div>
      </div>
      <div className="mt-4 rounded-3xl bg-forest p-6 md:p-8 text-white">
        <p className="display text-3xl">Ce qui fonctionne dans la démo</p>
        <p className="mt-3 text-white/75 leading-relaxed">Recherche avec suggestions, filtres par catégorie, marque, prix et disponibilité, tri, aperçu rapide, favoris, panier, tunnel de commande. Le panier et les favoris restent sur l&apos;appareil du visiteur. Aucune connexion avec la base de données ou la caisse du site réel.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/boutique/" className="btn btn-volt">Tester la boutique</Link>
          <a href={SITE.liveUrl} target="_blank" rel="noopener" className="btn btn-ghost text-white">Site actuel</a>
        </div>
      </div>
    </div>
  );
}

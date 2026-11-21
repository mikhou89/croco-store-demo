import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SITE } from "@/lib/site";
import { TruckIcon, ShieldIcon, BoxIcon, PhoneIcon, InfoIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Livraison & paiement", description: "Livraison partout en Tunisie, offerte dès 100 DT. Paiement en espèces à la livraison." };

const BLOCKS = [
  { icon: TruckIcon, title: "Livraison partout en Tunisie", text: `Livraison à domicile sur tout le territoire. Offerte dès ${SITE.freeShippingFrom} DT d'achat. En dessous, les frais varient selon le poids de la commande et la destination.` },
  { icon: BoxIcon, title: "Préparation sous 48 h", text: "Les commandes sont généralement préparées et expédiées sous 48 h après confirmation, avec un lien de suivi du colis. Emballage soigné en cartons adaptés." },
  { icon: ShieldIcon, title: "Paiement à la livraison", text: "Recevez, vérifiez, puis payez en espèces. Paiement également possible en magasin." },
  { icon: PhoneIcon, title: "Un conseil avant de commander ?", text: `Appelez-nous au ${SITE.phone}. Assistance et coaching gratuits pour nos clients.` },
];

export default function Delivery() {
  return (
    <div className="container-x">
      <div className="pt-6"><Breadcrumbs items={[["Livraison & paiement", null]]} /></div>
      <h1 className="display text-5xl md:text-7xl pt-8 md:pt-12 max-w-3xl">Livraison & paiement</h1>
      <div className="mt-10 grid md:grid-cols-2 gap-4">
        {BLOCKS.map((b) => (
          <div key={b.title} className="rounded-3xl bg-white p-6 md:p-8 shadow-card">
            <span className="grid size-12 place-items-center rounded-2xl bg-forest text-volt"><b.icon size={22} /></span>
            <h2 className="mt-5 text-xl font-semibold">{b.title}</h2>
            <p className="mt-2 text-muted leading-relaxed">{b.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl bg-white p-6 md:p-8 shadow-card">
        <h2 className="text-xl font-semibold">Retours & échanges</h2>
        <p className="mt-2 text-muted leading-relaxed max-w-3xl">Les produits non ouverts, dans leur emballage d&apos;origine, peuvent être retournés. Les frais de retour sont à la charge du client, sauf erreur de notre part ou produit défectueux. Contactez le service client avant tout envoi.</p>
        <p className="mt-4 flex items-start gap-2 rounded-2xl bg-volt/25 p-4 text-sm"><InfoIcon size={18} className="shrink-0 mt-px" /> À confirmer avec Croco Store : le délai de retour, le transporteur et l&apos;e-mail du service client (non renseignés sur la page actuelle du site).</p>
      </div>
    </div>
  );
}

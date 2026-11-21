/**
 * Business facts used in the demo. Every value is either verified on https://crocostore.tn/
 * (captured 21 Nov 2026) or explicitly flagged as "to confirm" with the owner.
 */
export const SITE = {
  name: "Croco Store",
  legalName: "Croco Land Industrie", // footer: "© Croco Land Industrie 2025 – Tous droits réservés"
  tagline: "Au service de votre transformation.", // live footer
  liveUrl: "https://crocostore.tn/",
  coachingUrl: "https://coaching.crocostore.tn/", // linked from the live menu ("Croco Coaching")
  phone: "25 188 091", // live header/footer ("Besoin d'aide ?")
  phoneIntl: "+21625188091",
  // WhatsApp: the live site shows WhatsApp visuals but no wa.me link. Number to be confirmed by the owner.
  whatsappToConfirm: true,
  freeShippingFrom: 100, // live banner: "Frais de livraison ? … À partir de 100 DT, c'est gratuit !"
};

/** Claims shown on the live site's own banners / "À propos" page (sources listed on /a-propos-de-la-demo). */
export const VERIFIED_PROMISES = [
  { title: "Livraison offerte dès 100 DT", text: "Livraison partout en Tunisie, offerte à partir de 100 DT d'achat.", icon: "truck" },
  { title: "Paiement à la livraison", text: "Recevez, vérifiez, puis payez. En espèces à la livraison ou en magasin.", icon: "shield" },
  { title: "Produits 100 % originaux", text: "Des produits authentiques, sélectionnés pour les débutants comme pour les confirmés.", icon: "badge" },
  { title: "Conseil & coaching", text: "Conseils personnalisés et coaching gratuit pour nos clients, avec Croco Coaching.", icon: "chat" },
] as const;

export const DEMO_NOTICE =
  "Concept de refonte non officiel, réalisé à titre de démonstration gratuite. Les produits, prix et stocks proviennent de crocostore.tn (relevé du 21/11/2026). Aucune commande ni paiement n'est traité.";

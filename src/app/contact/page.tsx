import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/lib/site";
import { PhoneIcon, WhatsAppIcon, ChatIcon } from "@/components/Icons";

export const metadata: Metadata = { title: "Contact", description: `Contactez Croco Store au ${SITE.phone} pour un conseil nutrition ou une commande.` };

export default function Contact() {
  return (
    <div className="container-x">
      <div className="pt-6"><Breadcrumbs items={[["Contact", null]]} /></div>
      <h1 className="display text-5xl md:text-7xl pt-8 md:pt-12">Parlons de vos objectifs</h1>
      <div className="mt-10 grid lg:grid-cols-[1fr_1.2fr] gap-5">
        <div className="space-y-3">
          <a href={`tel:${SITE.phoneIntl}`} className="flex items-center gap-4 rounded-3xl bg-forest p-6 text-white hover:bg-ink">
            <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-volt"><PhoneIcon size={22} /></span>
            <span><span className="block text-sm text-white/60">Téléphone</span><span className="text-2xl font-semibold">{SITE.phone}</span></span>
          </a>
          <a href={`https://wa.me/216${SITE.phone.replace(/\s/g, "")}`} target="_blank" rel="noopener" className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-card hover:shadow-lift">
            <span className="grid size-12 place-items-center rounded-2xl bg-[#e7f7ee] text-[#1f9d55]"><WhatsAppIcon size={24} /></span>
            <span><span className="block text-sm text-muted">WhatsApp</span><span className="text-lg font-semibold">Écrire sur WhatsApp</span></span>
          </a>
          <a href={SITE.coachingUrl} target="_blank" rel="noopener" className="flex items-center gap-4 rounded-3xl bg-white p-6 shadow-card hover:shadow-lift">
            <span className="grid size-12 place-items-center rounded-2xl bg-croco-50 text-croco"><ChatIcon size={22} /></span>
            <span><span className="block text-sm text-muted">Programme & suivi</span><span className="text-lg font-semibold">Croco Coaching</span></span>
          </a>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}

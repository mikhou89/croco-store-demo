"use client";
import { useState } from "react";
import { CheckIcon } from "./Icons";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <div className="rounded-3xl bg-white p-8 shadow-card grid place-items-center text-center">
        <div className="grid size-14 place-items-center rounded-full bg-croco text-white"><CheckIcon size={26} /></div>
        <p className="display text-3xl mt-4">Message prêt</p>
        <p className="mt-2 text-muted max-w-sm">Démonstration : le message n&apos;a pas été envoyé. Sur le site final, il arriverait au service client.</p>
      </div>
    );
  return (
    <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="rounded-3xl bg-white p-6 md:p-8 shadow-card space-y-4">
      <p className="text-xl font-semibold">Envoyer un message</p>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block"><span className="text-sm font-medium">Nom</span><input required autoComplete="name" className="mt-1.5 w-full rounded-xl border border-line px-4 h-12 outline-none focus:border-ink" /></label>
        <label className="block"><span className="text-sm font-medium">Téléphone ou e-mail</span><input required className="mt-1.5 w-full rounded-xl border border-line px-4 h-12 outline-none focus:border-ink" /></label>
      </div>
      <label className="block">
        <span className="text-sm font-medium">Sujet</span>
        <select className="mt-1.5 w-full rounded-xl border border-line px-4 h-12 bg-white"><option>Conseil produit</option><option>Suivi de commande</option><option>Service client</option></select>
      </label>
      <label className="block"><span className="text-sm font-medium">Message</span><textarea required rows={5} className="mt-1.5 w-full rounded-xl border border-line px-4 py-3 outline-none focus:border-ink" /></label>
      <button className="btn btn-primary w-full sm:w-auto">Envoyer</button>
    </form>
  );
}

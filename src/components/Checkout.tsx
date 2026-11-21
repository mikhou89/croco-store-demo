"use client";

import Link from "next/link";
import { useState } from "react";
import { useStore, type CartLine } from "@/lib/store";
import { productImage, tnd } from "@/lib/format";
import { SITE } from "@/lib/site";
import { CheckIcon, InfoIcon, ShieldIcon, TruckIcon, ArrowLeft } from "./Icons";

// The 24 governorates of Tunisia
const GOUVERNORATS = ["Ariana", "Béja", "Ben Arous", "Bizerte", "Gabès", "Gafsa", "Jendouba", "Kairouan", "Kasserine", "Kébili", "Le Kef", "Mahdia", "La Manouba", "Médenine", "Monastir", "Nabeul", "Sfax", "Sidi Bouzid", "Siliana", "Sousse", "Tataouine", "Tozeur", "Tunis", "Zaghouan"];

export function Checkout() {
  const { cart, subtotal, savings, ready, clear } = useStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [done, setDone] = useState<{ lines: CartLine[]; total: number; name: string } | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", gov: "", city: "", address: "", note: "" });
  const [touched, setTouched] = useState(false);
  const phoneOk = /^[2-9]\d{7}$/.test(form.phone.replace(/\s/g, ""));
  const valid = form.name.trim().length > 2 && phoneOk && form.gov && form.address.trim().length > 4;
  const free = subtotal >= SITE.freeShippingFrom;

  if (!ready) return <div className="container-x py-24 text-center text-muted">Chargement…</div>;

  if (done)
    return (
      <div className="container-x max-w-2xl py-14 md:py-24 text-center">
        <div className="mx-auto grid size-20 place-items-center rounded-full bg-croco text-white animate-pop"><CheckIcon size={38} /></div>
        <h1 className="display text-5xl md:text-6xl mt-6">Merci {done.name.split(" ")[0]} !</h1>
        <p className="mt-4 text-lg text-ink/80">Voici l&apos;écran de confirmation que verrait un client.</p>
        <div className="mt-6 rounded-2xl bg-volt/30 ring-1 ring-volt p-4 text-sm text-left flex gap-3">
          <InfoIcon size={20} className="shrink-0" />
          <p><b>Démonstration :</b> aucune commande n&apos;a été transmise à Croco Store, aucune donnée n&apos;a été enregistrée et aucun paiement n&apos;a eu lieu.</p>
        </div>
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-card text-left">
          <p className="font-semibold">Récapitulatif</p>
          <ul className="mt-3 space-y-2 text-sm">
            {done.lines.map((l) => <li key={l.key} className="flex justify-between gap-3"><span className="truncate">{l.qty} × {l.name}{l.flavour ? ` (${l.flavour})` : ""}</span><span className="whitespace-nowrap">{tnd(l.qty * l.price)}</span></li>)}
          </ul>
          <p className="mt-4 flex justify-between border-t border-line pt-3 font-bold"><span>Total à payer à la livraison</span><span>{tnd(done.total)}</span></p>
        </div>
        <Link href="/" className="btn btn-primary mt-8">Retour à l&apos;accueil</Link>
      </div>
    );

  if (cart.length === 0)
    return (
      <div className="container-x py-24 text-center">
        <p className="display text-4xl">Votre panier est vide</p>
        <Link href="/boutique/" className="btn btn-primary mt-6">Voir la boutique</Link>
      </div>
    );

  const field = (k: keyof typeof form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, error?: string | false) => (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        value={form[k]}
        onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
        className={`mt-1.5 w-full rounded-xl border bg-white px-4 h-12 text-[15px] outline-none focus:border-ink ${touched && error ? "border-danger" : "border-line"}`}
        aria-invalid={touched && !!error}
        {...props}
      />
      {touched && error && <span className="mt-1 block text-xs text-danger">{error}</span>}
    </label>
  );

  return (
    <div className="container-x pt-6 md:pt-10 pb-10">
      <Link href="/panier/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink"><ArrowLeft size={16} /> Retour au panier</Link>
      <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white ring-1 ring-line p-3.5 text-[13px]">
        <InfoIcon size={18} className="text-croco shrink-0" /> Tunnel de commande de démonstration : rien n&apos;est envoyé ni enregistré.
      </div>
      <div className="mt-8 grid lg:grid-cols-[1fr_400px] gap-8 items-start">
        <form
          className="space-y-8"
          onSubmit={(e) => {
            e.preventDefault();
            setTouched(true);
            if (!valid) return;
            if (step === 1) { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); return; }
            setDone({ lines: cart, total: subtotal, name: form.name });
            clear();
            window.scrollTo({ top: 0 });
          }}
        >
          <ol className="flex items-center gap-3 text-sm font-semibold">
            {["Livraison", "Confirmation"].map((s, i) => (
              <li key={s} className={`flex items-center gap-2 ${step >= i + 1 ? "text-ink" : "text-muted"}`}>
                <span className={`grid size-7 place-items-center rounded-full text-xs ${step > i + 1 ? "bg-croco text-white" : step === i + 1 ? "bg-ink text-white" : "bg-line"}`}>{step > i + 1 ? <CheckIcon size={14} /> : i + 1}</span>
                {s}
                {i === 0 && <span className="w-8 h-px bg-line" />}
              </li>
            ))}
          </ol>

          {step === 1 ? (
            <section className="rounded-3xl bg-white p-5 md:p-8 shadow-card space-y-4">
              <h1 className="display text-3xl md:text-4xl">Vos coordonnées</h1>
              <div className="grid sm:grid-cols-2 gap-4">
                {field("name", "Nom et prénom", { autoComplete: "name", placeholder: "Ex. Ahmed Ben Ali" }, form.name.trim().length <= 2 && "Indiquez votre nom")}
                {field("phone", "Téléphone", { autoComplete: "tel", inputMode: "tel", placeholder: "Ex. 22 123 456" }, !phoneOk && "Numéro tunisien à 8 chiffres")}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium">Gouvernorat</span>
                  <select value={form.gov} onChange={(e) => setForm((f) => ({ ...f, gov: e.target.value }))} className={`mt-1.5 w-full rounded-xl border bg-white px-4 h-12 text-[15px] ${touched && !form.gov ? "border-danger" : "border-line"}`}>
                    <option value="">Choisir…</option>
                    {GOUVERNORATS.map((g) => <option key={g}>{g}</option>)}
                  </select>
                </label>
                {field("city", "Ville / délégation", { autoComplete: "address-level2" })}
              </div>
              {field("address", "Adresse de livraison", { autoComplete: "street-address", placeholder: "Rue, numéro, étage…" }, form.address.trim().length <= 4 && "Indiquez une adresse")}
              <label className="block">
                <span className="text-sm font-medium">Note pour le livreur (optionnel)</span>
                <textarea value={form.note} onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))} rows={2} className="mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-ink" />
              </label>
            </section>
          ) : (
            <section className="rounded-3xl bg-white p-5 md:p-8 shadow-card space-y-5">
              <h1 className="display text-3xl md:text-4xl">Livraison & paiement</h1>
              <div className="rounded-2xl bg-bone p-4 text-sm">
                <p className="font-semibold">{form.name} · {form.phone}</p>
                <p className="text-muted">{form.address}{form.city ? `, ${form.city}` : ""}, {form.gov}</p>
                <button type="button" onClick={() => setStep(1)} className="mt-1 text-sm font-semibold underline underline-offset-4">Modifier</button>
              </div>
              <div className="rounded-2xl ring-2 ring-ink p-4 flex gap-3">
                <TruckIcon size={22} className="shrink-0" />
                <div><p className="font-semibold">Livraison à domicile</p><p className="text-sm text-muted">Partout en Tunisie · {free ? "offerte" : "frais selon le poids et la destination"}</p></div>
              </div>
              <div className="rounded-2xl ring-2 ring-croco bg-croco-50 p-4 flex gap-3">
                <ShieldIcon size={22} className="shrink-0 text-croco" />
                <div><p className="font-semibold">Paiement à la livraison (espèces)</p><p className="text-sm text-muted">Recevez, vérifiez, puis payez.</p></div>
              </div>
            </section>
          )}

          <button className="btn btn-croco w-full h-14 text-base">{step === 1 ? "Continuer" : `Confirmer la commande · ${tnd(subtotal)}`}</button>
        </form>

        <aside className="rounded-3xl bg-white p-6 shadow-card lg:sticky lg:top-[100px]">
          <p className="display text-2xl">Votre commande</p>
          <ul className="mt-4 space-y-3 max-h-[320px] overflow-y-auto">
            {cart.map((l) => (
              <li key={l.key} className="flex items-center gap-3">
                <span className="relative shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={productImage(l.image)} alt="" className="size-14 rounded-xl bg-bone object-contain" />
                  <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">{l.qty}</span>
                </span>
                <span className="min-w-0 flex-1 text-sm leading-snug line-clamp-2">{l.name}{l.flavour ? ` · ${l.flavour}` : ""}</span>
                <span className="text-sm font-medium whitespace-nowrap">{tnd(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[15px]">
            {savings > 0 && <div className="flex justify-between text-croco"><dt>Remises incluses</dt><dd>− {tnd(savings)}</dd></div>}
            <div className="flex justify-between"><dt>Livraison</dt><dd>{free ? "Offerte" : "À confirmer"}</dd></div>
            <div className="flex justify-between text-lg font-bold pt-1"><dt>Total</dt><dd>{tnd(subtotal)}</dd></div>
          </dl>
        </aside>
      </div>
    </div>
  );
}

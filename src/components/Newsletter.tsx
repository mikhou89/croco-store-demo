"use client";
import { useState } from "react";
import { CheckIcon } from "./Icons";

export function Newsletter() {
  const [done, setDone] = useState(false);
  if (done)
    return (
      <p className="mt-5 flex items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm text-white">
        <CheckIcon size={18} className="text-volt" /> Démo : aucune adresse n&apos;est enregistrée.
      </p>
    );
  return (
    <form className="mt-5 flex gap-2" onSubmit={(e) => { e.preventDefault(); setDone(true); }}>
      <label className="sr-only" htmlFor="nl">Adresse e-mail</label>
      <input id="nl" type="email" required placeholder="Votre e-mail" className="min-w-0 flex-1 rounded-full bg-white/10 px-5 h-12 text-white placeholder:text-white/50 outline-none focus:bg-white/15 border border-white/10" />
      <button className="btn btn-volt px-5">S&apos;abonner</button>
    </form>
  );
}

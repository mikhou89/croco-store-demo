import type { Metadata } from "next";
import { packGoals, packs, packView } from "@/lib/catalog";
import { tnd } from "@/lib/format";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PacksExplorer } from "@/components/PacksExplorer";
import { BoxIcon, CheckIcon, InfoIcon } from "@/components/Icons";

export const metadata: Metadata = {
  title: "Packs nutrition sportive : prise de masse, force, récupération",
  description: "Packs Croco Store classés par objectif : prise de masse, force & performance, récupération, bien-être, débutant. Économies calculées sur les prix unitaires.",
};

const BLURB: Record<string, string> = {
  "prise-de-masse": "Packs contenant un gainer ou une formule masse, pour augmenter l'apport calorique.",
  "force-performance": "Packs avec créatine, pré-workout ou boosters pour la force et l'intensité.",
  recuperation: "Packs avec whey, isolat, glutamine ou EAA pour soutenir la récupération.",
  "bien-etre": "Packs de vitamines, minéraux et oméga-3 pour les besoins quotidiens.",
  seche: "Packs brûleur de graisse et L-carnitine pour accompagner une sèche.",
  debutant: "Packs présentés par Croco Store comme adaptés aux débutants (starter, essentiel).",
};

export default function PacksPage() {
  const all = packs().map(packView);
  const goals = packGoals
    .map((g) => ({ ...g, count: all.filter((p) => p.goals.includes(g.slug)).length, blurb: BLURB[g.slug] }))
    .filter((g) => g.count > 0);
  const withSaving = all.filter((p) => p.lite.packValue);
  const best = Math.max(...withSaving.map((p) => p.lite.packValue! - p.lite.price));

  return (
    <>
      <section className="bg-forest text-white">
        <div className="container-x pt-6 pb-14 md:pb-20">
          <div className="[&_*]:!text-white/70"><Breadcrumbs items={[["Packs", null]]} /></div>
          <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-10 items-end">
            <div>
              <p className="eyebrow text-volt flex items-center gap-2"><BoxIcon size={16} /> Packs Croco Store</p>
              <h1 className="display mt-4 text-[3.2rem] md:text-[5.5rem] leading-[0.9]">Le bon pack pour <span className="text-volt">votre objectif</span></h1>
              <p className="mt-5 text-lg text-white/75 max-w-xl">{all.length} combinaisons prêtes à l&apos;emploi, classées selon leur contenu réel. Un seul achat, une routine complète.</p>
            </div>
            <ul className="space-y-3 text-[15px]">
              {[
                `${withSaving.length} packs moins chers que leurs produits achetés séparément`,
                `Jusqu'à ${tnd(best)} d'économie sur un seul pack`,
                "Contenu détaillé produit par produit",
              ].map((t) => (
                <li key={t} className="flex gap-3 rounded-2xl bg-white/[0.07] p-4"><CheckIcon size={20} className="text-volt shrink-0" /> {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <PacksExplorer packs={all} goals={goals} />
      <div className="container-x mt-10">
        <p className="flex items-start gap-2 rounded-2xl bg-white p-4 text-[13px] text-muted ring-1 ring-line max-w-3xl">
          <InfoIcon size={17} className="shrink-0 mt-px" />
          Économies = somme des prix unitaires actuellement affichés sur crocostore.tn pour chaque produit du pack, moins le prix du pack. Aucune économie n&apos;est affichée lorsque le pack n&apos;est pas moins cher. Classement par objectif déduit des produits contenus dans chaque pack.
        </p>
      </div>
    </>
  );
}

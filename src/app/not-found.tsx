import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x py-24 text-center">
      <p className="display text-[7rem] leading-none text-croco">404</p>
      <h1 className="display text-4xl mt-2">Page introuvable</h1>
      <p className="mt-3 text-muted">Cette page n&apos;existe pas ou plus.</p>
      <div className="mt-8 flex justify-center gap-2"><Link href="/" className="btn btn-primary">Accueil</Link><Link href="/boutique/" className="btn btn-outline">Boutique</Link></div>
    </div>
  );
}

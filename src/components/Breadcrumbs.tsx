import Link from "next/link";
import { ChevronRight } from "./Icons";

export function Breadcrumbs({ items }: { items: [string, string | null][] }) {
  const all: [string, string | null][] = [["Accueil", "/"], ...items];
  const ld = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map(([name, href], i) => ({ "@type": "ListItem", position: i + 1, name, ...(href ? { item: href } : {}) })),
  };
  return (
    <nav aria-label="Fil d'Ariane" className="text-[13px] text-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {all.map(([name, href], i) => (
          <li key={i} className="flex items-center gap-1 min-w-0">
            {i > 0 && <ChevronRight size={13} className="shrink-0" />}
            {href && i < all.length - 1 ? <Link href={href} className="hover:text-ink truncate">{name}</Link> : <span aria-current="page" className="text-ink truncate max-w-[60vw]">{name}</span>}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </nav>
  );
}

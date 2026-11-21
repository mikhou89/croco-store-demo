/** Tunisian dinar, formatted the way the live store does: 1 234,500 TND */
export function tnd(value: number) {
  return (
    new Intl.NumberFormat("fr-TN", { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(value).replace(/ | /g, " ") + " TND"
  );
}

/** Compact variant for cards: 89 TND / 69,900 TND */
export function tndShort(value: number) {
  const isInt = Math.abs(value - Math.round(value)) < 0.0005;
  return isInt ? `${Math.round(value)} TND` : tnd(value);
}

export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}${path}`;

export const productImage = (id: string | null, size: 400 | 800 = 400) =>
  id ? asset(`/img/p/${id}-${size}.webp`) : asset("/img/placeholder.svg");

export function discountPct(price: number, regular: number | null) {
  if (!regular || regular <= price) return 0;
  return Math.round(((regular - price) / regular) * 100);
}

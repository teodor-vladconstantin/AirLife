// Sale pricing: a product has `price` (list price) and optionally `sale_price` + `sale_ends_at`.
// Everything the shop shows or sells uses the effective price; `compare_at` is the struck-through list price.
export interface PriceFields {
  price: number | string;
  sale_price?: number | string | null;
  sale_ends_at?: string | null;
}

export function salePricing(r: PriceFields): { price: number; compare_at?: number } {
  const price = Number(r.price);
  const sale = r.sale_price == null ? null : Number(r.sale_price);
  const live = sale != null && sale > 0 && sale < price && (!r.sale_ends_at || new Date(r.sale_ends_at).getTime() > Date.now());
  return live ? { price: sale, compare_at: price } : { price };
}

// Visible in the shop: not hidden by an admin and has a real photo (no placeholders).
export const isShopVisible = (r: { hidden?: boolean | null; image_url?: string | null }) =>
  !r.hidden && !!r.image_url && !r.image_url.includes("placeholder");

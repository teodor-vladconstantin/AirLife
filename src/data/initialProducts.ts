export interface StaticProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categorySlug: string;
  image_url: string;
  features: string[];
  stock: number;
  sku: string;
  crossSellIds?: string[];
  slug?: string;
  compare_at?: number;
}

// The static demo products (placeholder.svg, no real photo) were removed on 2026-11-18. Products now live only in Supabase.
// Keep this empty: the shop hides anything without a real photo (src/lib/pricing.ts: isShopVisible).
export const INITIAL_PRODUCTS: StaticProduct[] = [];

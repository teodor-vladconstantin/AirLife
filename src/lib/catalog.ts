// Server-side data loaders for the App Router pages (no browser APIs, no persisted session).
import { createClient } from "@supabase/supabase-js";
import type { Database, Tables } from "@/integrations/supabase/types";
import { INITIAL_PRODUCTS, StaticProduct } from "@/data/initialProducts";
import { isShopVisible, salePricing } from "@/lib/pricing";
import { CATEGORIES_DATA } from "@/data/categoriesData";

export const db = () =>
  createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_at?: number;
  category: string;
  image_url: string | null;
  features: string[];
  stock: number;
  slug: string | null;
  sku: string | null;
  brand: string | null;
  gallery: string[];
  specs: Record<string, string>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const toStatic = (r: Tables<"products">, categorySlug = ""): StaticProduct => ({
  id: r.id,
  slug: r.slug ?? undefined,
  name: r.name,
  description: r.description,
  ...salePricing(r),
  category: r.category,
  categorySlug,
  image_url: r.image_url || "/placeholder.svg",
  features: Array.isArray(r.features) ? (r.features as string[]) : [],
  stock: r.stock,
  sku: r.sku ?? r.id.substring(0, 8),
});

export async function loadProduct(productId: string): Promise<{ product: Product; related: StaticProduct[] } | null> {
  const s = INITIAL_PRODUCTS.find((p) => p.id === productId);
  if (s) {
    return {
      product: { id: s.id, name: s.name, description: s.description, price: s.price, category: s.category, image_url: s.image_url, features: s.features, stock: s.stock, slug: null, sku: s.sku, brand: null, gallery: [], specs: {} },
      related: INITIAL_PRODUCTS.filter((p) => p.id !== s.id && (s.crossSellIds?.includes(p.id) || p.category === s.category)).slice(0, 3),
    };
  }
  try {
    const client = db();
    const { data: d } = await client.from("products").select("*").eq(UUID_RE.test(productId) ? "id" : "slug", productId).maybeSingle();
    if (!d || !isShopVisible(d)) return null;
    const { data: rel } = await client.from("products").select("*").eq("category", d.category).neq("id", d.id).limit(12);
    const related = (rel ?? []).filter(isShopVisible).slice(0, 3).map((r) => toStatic(r));
    return {
      product: {
        id: d.id, name: d.name, description: d.description, ...salePricing(d), category: d.category, image_url: d.image_url,
        features: Array.isArray(d.features) ? (d.features as string[]) : [], stock: d.stock, slug: d.slug, sku: d.sku, brand: d.brand,
        gallery: d.gallery ?? [], specs: (d.specs ?? {}) as Record<string, string>,
      },
      related: related.length ? related : INITIAL_PRODUCTS.filter((p) => p.category === d.category).slice(0, 3),
    };
  } catch {
    return null;
  }
}

export async function loadCategoryProducts(slug: string): Promise<StaticProduct[]> {
  const info = CATEGORIES_DATA[slug];
  const local = INITIAL_PRODUCTS.filter((p) => p.categorySlug === slug);
  try {
    const { data, error } = await db().from("products").select("*").eq("category", info?.name || "");
    if (error || !data?.length) return local;
    const combined = data.filter(isShopVisible).map((r) => toStatic(r, slug));
    for (const s of local) if (!combined.some((c) => c.name.toLowerCase() === s.name.toLowerCase())) combined.push(s);
    return combined;
  } catch {
    return local;
  }
}

export async function loadAllProducts() {
  const { data } = await db().from("products").select("*").order("created_at", { ascending: false }).then((r) => r, () => ({ data: null }));
  const dbRows = (data ?? []).filter(isShopVisible).map((p) => ({ ...p, ...salePricing(p), features: Array.isArray(p.features) ? (p.features as string[]) : [] }));
  const seen = new Set(dbRows.map((p) => p.name.toLowerCase()));
  return [...dbRows, ...INITIAL_PRODUCTS.filter((p) => !seen.has(p.name.toLowerCase()))];
}

export async function loadPosts() {
  const { data } = await db().from("blog_posts").select("id,slug,title,excerpt,cover_image,category,published_at").eq("status", "published").order("published_at", { ascending: false }).then((r) => r, () => ({ data: null }));
  return data ?? [];
}

export async function loadPost(slug: string) {
  const client = db();
  const { data: post } = await client.from("blog_posts").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (!post) return null;
  const { data: related } = post.category
    ? await client.from("blog_posts").select("slug,title").eq("status", "published").eq("category", post.category).neq("slug", slug).limit(3)
    : { data: [] };
  return { post, related: related ?? [] };
}

// Home grid + sitemap: only categories that really have products to show.
export interface CategorySummary { slug: string; name: string; title: string; description: string; image: string; count: number }
export async function loadCategorySummaries(): Promise<CategorySummary[]> {
  const rows = await loadAllProducts();
  return Object.values(CATEGORIES_DATA).flatMap((c) => {
    const items = rows.filter((p) => p.category === c.name);
    if (!items.length) return [];
    return [{ slug: c.slug, name: c.name, title: c.h1, description: c.metaDescription, image: items[0].image_url as string, count: items.length }];
  });
}

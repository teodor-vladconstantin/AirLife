import Index from "@/views/Index";
import { loadCategorySummaries, loadProductCards } from "@/lib/catalog";

export const revalidate = 300;

// Names stored in products.brand that are product lines or typos, not brands.
const NOT_BRANDS = new Set(["Aria Connect", "Aria Flat 500", "Ecovent.ro", "Evovent"]);

export default async function Page() {
  const [categories, cards] = await Promise.all([loadCategorySummaries(), loadProductCards()]);
  const featured = cards.filter((c) => c.stock > 0 && c.image_url).slice(0, 8);
  const counts = new Map<string, number>();
  for (const c of cards) if (c.brand && !NOT_BRANDS.has(c.brand)) counts.set(c.brand, (counts.get(c.brand) ?? 0) + 1);
  const brands = [...counts].filter(([, n]) => n >= 4).sort((a, b) => b[1] - a[1]).slice(0, 24).map(([name, count]) => ({ name, count }));
  return <Index categories={categories} featured={featured} brands={brands} />;
}

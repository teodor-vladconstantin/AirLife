import Index from "@/views/Index";
import { loadCategorySummaries, loadProductCards } from "@/lib/catalog";

export const revalidate = 300;

export default async function Page() {
  const [categories, cards] = await Promise.all([loadCategorySummaries(), loadProductCards()]);
  const featured = cards.filter((c) => c.stock > 0 && c.image_url).slice(0, 8);
  return <Index categories={categories} featured={featured} />;
}

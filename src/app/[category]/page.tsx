import { notFound } from "next/navigation";
import CategoryPage from "@/views/CategoryPage";
import { loadCategoryProducts } from "@/lib/catalog";
import { CATEGORIES_DATA } from "@/data/categoriesData";

export const revalidate = 300;
export const dynamicParams = false; // unknown slugs -> 404
export const generateStaticParams = () => Object.keys(CATEGORIES_DATA).map((category) => ({ category }));

export default async function Page({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!CATEGORIES_DATA[category]) notFound();
  return <CategoryPage forcedSlug={category} products={await loadCategoryProducts(category)} />;
}

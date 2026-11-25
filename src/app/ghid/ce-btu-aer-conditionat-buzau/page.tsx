import GhidBtu from "@/views/guides/GhidBtu";
import { loadCategoryProducts } from "@/lib/catalog";
import { btuOf, type BtuProduct } from "@/lib/btu";

export const revalidate = 3600;

export default async function Page() {
  const rows = await loadCategoryProducts("aer-conditionat");
  const products = rows.flatMap((p): BtuProduct[] => {
    const btu = btuOf(p.name);
    return btu && p.stock > 0 && p.image_url ? [{ path: p.slug ?? p.id, name: p.name, price: p.price, image: p.image_url, btu }] : [];
  });
  return <GhidBtu products={products} />;
}

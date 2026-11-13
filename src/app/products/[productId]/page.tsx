import { notFound } from "next/navigation";
import ProductDetails from "@/views/ProductDetails";
import { loadProduct } from "@/lib/catalog";

export const revalidate = 300;

export const generateStaticParams = () => []; // cache pages on first hit (ISR)
export default async function Page({ params }: { params: Promise<{ productId: string }> }) {
  const initial = await loadProduct((await params).productId);
  if (!initial) notFound();
  return <ProductDetails initial={initial} />;
}

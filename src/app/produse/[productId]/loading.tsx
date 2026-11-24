import { ProductSkeleton } from "@/components/shop/Skeletons";

export default function Loading() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-6 md:py-10">
      <ProductSkeleton />
    </main>
  );
}

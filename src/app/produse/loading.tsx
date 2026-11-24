import { ListSkeleton } from "@/components/shop/Skeletons";

export default function Loading() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-6 h-10 w-48 animate-pulse rounded-md bg-muted" aria-hidden />
      <ListSkeleton />
    </main>
  );
}

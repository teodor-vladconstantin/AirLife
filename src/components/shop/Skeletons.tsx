import { Skeleton } from "@/components/ui/skeleton";

// Placeholders shown while a page or a list is loading (same proportions as the real cards, so nothing jumps).
export const CardSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-border bg-card">
    <Skeleton className="aspect-square w-full rounded-none" />
    <div className="space-y-2 p-3 sm:p-4">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-9 w-full" />
    </div>
  </div>
);

export const ListSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4" role="status" aria-label="Se încarcă produsele">
    {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
  </div>
);

export const ProductSkeleton = () => (
  <div className="grid gap-8 md:grid-cols-2 lg:gap-12" role="status" aria-label="Se încarcă produsul">
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-2xl" />
      <div className="flex gap-2"><Skeleton className="h-16 w-16 rounded-lg" /><Skeleton className="h-16 w-16 rounded-lg" /><Skeleton className="h-16 w-16 rounded-lg" /></div>
    </div>
    <div className="space-y-5">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-4/5" />
      <Skeleton className="h-10 w-40" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-20 w-full" />
      <div className="flex gap-2"><Skeleton className="h-11 flex-1" /><Skeleton className="h-11 flex-1" /></div>
      <Skeleton className="h-40 w-full rounded-xl" />
    </div>
  </div>
);

import { Loader2 } from "lucide-react";

// Shown by Next.js while a page is being fetched on navigation.
export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Se încarcă">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

import Index from "@/views/Index";
import { loadCategorySummaries } from "@/lib/catalog";

export const revalidate = 300;

export default async function Page() {
  return <Index categories={await loadCategorySummaries()} />;
}

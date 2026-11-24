"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES_DATA } from "@/data/categoriesData";
import { isShopVisible } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Product counts per category, loaded once per visit (only categories with products are listed).
let counts: Record<string, number> | null = null;
let pending: Promise<void> | null = null;
async function loadCounts() {
  if (counts) return;
  pending ??= (async () => {
    const acc: Record<string, number> = {};
    for (let from = 0; ; from += 1000) {
      const { data, error } = await supabase.from("products").select("category,image_url,hidden").not("slug", "is", null).range(from, from + 999);
      if (error || !data) break;
      for (const r of data) if (isShopVisible(r)) acc[r.category] = (acc[r.category] ?? 0) + 1;
      if (data.length < 1000) break;
    }
    if (Object.keys(acc).length) counts = acc;
  })();
  await pending;
  pending = null;
}

export function useCategories() {
  const [c, setC] = useState<Record<string, number> | null>(counts);
  useEffect(() => { if (!c) loadCounts().then(() => setC(counts)).catch(() => {}); }, [c]);
  const all = Object.values(CATEGORIES_DATA);
  return (c ? all.filter((x) => c[x.name]) : all).map((x) => ({ slug: x.slug, name: x.name, count: c?.[x.name] }));
}

export function CategoryMenu() {
  const cats = useCategories();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <span>Magazin</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[min(44rem,92vw)] p-4">
        <Link to="/produse" className="mb-3 block rounded-md bg-primary/5 px-3 py-2 text-sm font-semibold text-primary hover:bg-primary/10">Toate produsele →</Link>
        <ul className="grid gap-x-4 gap-y-0.5 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <li key={c.slug}>
              <Link to={`/${c.slug}`} className="flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm hover:bg-secondary">
                <span>{c.name}</span>
                {c.count != null && <span className="text-xs text-muted-foreground">{c.count}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

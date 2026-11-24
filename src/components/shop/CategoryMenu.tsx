"use client";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES_DATA } from "@/data/categoriesData";
import { isShopVisible } from "@/lib/pricing";
import { buildMenu } from "@/data/shopMenu";
import { DEFAULT_FILTERS, toQuery } from "@/lib/shop";
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

// Menu structure (3 sections with sub-sections) with live product counts; empty categories are hidden once the counts are known.
export function useShopMenu() {
  const [c, setC] = useState<Record<string, number> | null>(counts);
  useEffect(() => { if (!c) loadCounts().then(() => setC(counts)).catch(() => {}); }, [c]);
  return buildMenu(c);
}

// Link to the product list filtered by every category of a section.
export const sectionHref = (names: string[]) => `/produse${toQuery({ ...DEFAULT_FILTERS, categories: names })}`;

export function CategoryMenu() {
  const menu = useShopMenu();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1">
          <span>Magazin</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[min(58rem,94vw)] p-5">
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-3">
          {menu.map((s) => (
            <section key={s.key} aria-labelledby={`menu-${s.key}`}>
              <Link to={sectionHref(s.names)} className="group block border-b border-border pb-2">
                <h3 id={`menu-${s.key}`} className="text-sm font-bold text-foreground group-hover:text-primary">{s.title}</h3>
                {s.description && <p className="text-xs text-muted-foreground">{s.description}</p>}
              </Link>
              <div className="mt-3 space-y-3">
                {s.groups.map((g) => (
                  <div key={g.title}>
                    <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-primary">{g.title}</p>
                    <ul className="mt-1">
                      {g.links.map((l) => (
                        <li key={l.slug}>
                          <Link to={`/${l.slug}`} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-secondary">
                            <span>{l.name}</span>
                            {l.count != null && <span className="text-xs text-muted-foreground">{l.count}</span>}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <Link to="/produse" className="mt-5 block rounded-md bg-primary/5 px-3 py-2 text-center text-sm font-semibold text-primary hover:bg-primary/10">Vezi toate produsele →</Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

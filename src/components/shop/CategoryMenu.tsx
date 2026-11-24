"use client";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, Fan, Snowflake, Wind } from "lucide-react";
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

const ICONS = { climatizare: Snowflake, ventilatie: Fan, "aer-sanatos": Wind } as const;

export function CategoryMenu() {
  const menu = useShopMenu();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-1 font-semibold">
          <span>Magazin</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[min(62rem,94vw)] overflow-hidden p-0">
        <div className="grid md:grid-cols-3 md:divide-x md:divide-border">
          {menu.map((s) => {
            const Icon = ICONS[s.key as keyof typeof ICONS] ?? Wind;
            return (
              <section key={s.key} aria-labelledby={`menu-${s.key}`} className="flex flex-col p-6 md:odd:bg-transparent md:[&:nth-child(2)]:bg-secondary/30">
                <Link to={sectionHref(s.names)} className="group flex items-start gap-3 border-b-2 border-primary/25 pb-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-6 w-6" /></span>
                  <span>
                    <h3 id={`menu-${s.key}`} className="text-lg font-extrabold leading-tight text-foreground group-hover:text-primary">{s.title}</h3>
                    {s.description && <span className="mt-0.5 block text-sm text-muted-foreground">{s.description}</span>}
                  </span>
                </Link>

                <div className="mt-5 flex-1 space-y-5">
                  {s.groups.map((g) => (
                    <div key={g.title}>
                      <p className="mb-1.5 flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary">
                        {g.title}
                        <span className="h-px flex-1 bg-border" aria-hidden />
                      </p>
                      <ul>
                        {g.links.map((l) => (
                          <li key={l.slug}>
                            <Link to={`/${l.slug}`} className="flex items-center justify-between gap-3 rounded-md px-2 py-2 text-[15px] font-medium text-foreground transition-colors hover:bg-primary/10 hover:text-primary">
                              <span>{l.name}</span>
                              {l.count != null && <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{l.count}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <Link to={sectionHref(s.names)} className="mt-5 inline-flex items-center gap-1.5 border-t border-border pt-4 text-sm font-bold text-primary hover:underline">
                  Vezi tot din {s.title.toLowerCase()} <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            );
          })}
        </div>
        <Link to="/produse" className="flex items-center justify-center gap-2 border-t border-border bg-primary px-4 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90">
          Vezi toate produsele <ArrowRight className="h-4 w-4" />
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

"use client";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SHOP_MENU } from "@/data/shopMenu";
import { CATEGORIES_DATA } from "@/data/categoriesData";
import { DEFAULT_FILTERS, toQuery } from "@/lib/shop";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// "Where does the button lead?": any page, any product category, a whole menu section, one product, or a custom link.
const PAGES = [
  { v: "/", l: "Pagina principală" }, { v: "/produse", l: "Toate produsele" }, { v: "/produse?oferta=1", l: "Produse la ofertă" },
  { v: "/blog", l: "Blog" }, { v: "/contact", l: "Contact" },
];
const SERVICES = [
  { v: "/servicii", l: "Toate serviciile" }, { v: "/servicii/montaj-aer-conditionat-buzau", l: "Montaj aer condiționat" },
  { v: "/servicii/igienizare-aer-conditionat-buzau", l: "Igienizare" }, { v: "/servicii/service-aer-conditionat-buzau", l: "Service și reparații" },
  { v: "/aer-conditionat-buzau", l: "Aer condiționat Buzău (servicii)" },
];
const sections = SHOP_MENU.map((s) => {
  const names = s.groups.flatMap((g) => g.slugs.map((sl) => CATEGORIES_DATA[sl]?.name).filter(Boolean)) as string[];
  return { key: s.key, title: s.title, all: `/produse${toQuery({ ...DEFAULT_FILTERS, categories: names })}`, cats: s.groups.flatMap((g) => g.slugs).filter((sl) => CATEGORIES_DATA[sl]).map((sl) => ({ v: `/${sl}`, l: CATEGORIES_DATA[sl].name })) };
});
const KNOWN = new Set([...PAGES, ...SERVICES, ...sections.flatMap((s) => [{ v: s.all }, ...s.cats])].map((o) => o.v));

export function DestinationPicker({ value, onChange }: { value: string; onChange: (path: string) => void }) {
  const custom = !KNOWN.has(value);
  const [mode, setMode] = useState<"list" | "custom" | "product">(custom ? "custom" : "list");
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<{ name: string; slug: string }[]>([]);

  useEffect(() => {
    const term = q.trim().replace(/[,()%*\\]/g, " ");
    if (mode !== "product" || term.length < 2) { setHits([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase.from("products").select("name,slug").not("slug", "is", null).eq("hidden", false).ilike("name", `%${term.split(/\s+/).join("%")}%`).limit(8);
      setHits((data ?? []) as { name: string; slug: string }[]);
    }, 250);
    return () => clearTimeout(t);
  }, [q, mode]);

  return (
    <div className="space-y-2">
      <Select value={mode === "list" && KNOWN.has(value) ? value : mode === "product" ? "__product__" : "__custom__"}
        onValueChange={(v) => { if (v === "__custom__") { setMode("custom"); } else if (v === "__product__") { setMode("product"); } else { setMode("list"); onChange(v); } }}>
        <SelectTrigger aria-label="Duce la"><SelectValue /></SelectTrigger>
        <SelectContent className="max-h-80">
          <SelectGroup><SelectLabel>Pagini</SelectLabel>{PAGES.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}</SelectGroup>
          <SelectGroup><SelectLabel>Servicii</SelectLabel>{SERVICES.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}</SelectGroup>
          {sections.map((s) => (
            <SelectGroup key={s.key}>
              <SelectLabel>{s.title}</SelectLabel>
              <SelectItem value={s.all}>Toată secțiunea: {s.title}</SelectItem>
              {s.cats.map((o) => <SelectItem key={o.v} value={o.v}>{o.l}</SelectItem>)}
            </SelectGroup>
          ))}
          <SelectGroup><SelectLabel>Altceva</SelectLabel>
            <SelectItem value="__product__">Un produs anume…</SelectItem>
            <SelectItem value="__custom__">Alt link (îl scriu eu)…</SelectItem></SelectGroup>
        </SelectContent>
      </Select>

      {mode === "custom" && (
        <div>
          <Input aria-label="Link propriu" value={value} onChange={(e) => onChange(e.target.value)} placeholder="/produse?brand=Heiko" />
          {value && !/^\/(?!\/)/.test(value) && <p className="mt-1 text-xs text-destructive">Linkul trebuie să înceapă cu / (o pagină din site).</p>}
        </div>
      )}
      {mode === "product" && (
        <div className="space-y-1">
          <div className="relative"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Caută produs pentru link" className="pl-9" placeholder="Caută produsul…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          {hits.length > 0 && (
            <ul className="divide-y rounded-md border bg-popover text-sm">
              {hits.map((h) => <li key={h.slug}><button type="button" className="w-full px-3 py-2 text-left hover:bg-secondary" onClick={() => { onChange(`/produse/${h.slug}`); setQ(""); setHits([]); }}>{h.name}</button></li>)}
            </ul>
          )}
          {value.startsWith("/produse/") && <p className="text-xs text-muted-foreground">Duce la: <code>{value}</code></p>}
        </div>
      )}
    </div>
  );
}

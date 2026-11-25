"use client";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { untypedDb } from "@/lib/untypedDb";
import { buildMenu } from "@/data/shopMenu";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES_DATA } from "@/data/categoriesData";

// "Where does this apply?": the whole shop, chosen categories, one supplier, or hand-picked products.
export type ScopeMode = "all" | "categories" | "supplier" | "products";
export interface Scope { mode: ScopeMode; categories: string[]; supplierId: string; products: { id: string; name: string }[] }
export const EMPTY_SCOPE: Scope = { mode: "all", categories: [], supplierId: "", products: [] };

const MODES: { value: ScopeMode; label: string }[] = [
  { value: "all", label: "Tot magazinul" },
  { value: "categories", label: "Categorii" },
  { value: "supplier", label: "Un furnizor" },
  { value: "products", label: "Produse alese" },
];

export const scopeValid = (s: Scope) =>
  s.mode === "all" || (s.mode === "categories" && s.categories.length > 0) || (s.mode === "supplier" && !!s.supplierId) || (s.mode === "products" && s.products.length > 0);

export const describeScope = (s: Scope, supplierName?: string) =>
  s.mode === "all" ? "toate produsele"
    : s.mode === "categories" ? (s.categories.length === 1 ? `categoria ${s.categories[0]}` : `${s.categories.length} categorii`)
    : s.mode === "supplier" ? `produsele furnizorului ${supplierName ?? ""}`.trim()
    : `${s.products.length} produse alese`;

type Row = { id: string; price: number };
const chunk = <T,>(a: T[], n: number) => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n));

// Every product (id + normal price) that falls in the scope.
export async function resolveScope(s: Scope): Promise<Row[]> {
  const out: Row[] = [];
  const page = async (build: (from: number) => PromiseLike<{ data: Row[] | null; error: unknown }>) => {
    for (let from = 0; ; from += 1000) {
      const { data, error } = await build(from);
      if (error) throw error;
      out.push(...(data ?? []));
      if ((data ?? []).length < 1000) break;
    }
  };
  if (s.mode === "all") await page((from) => supabase.from("products").select("id,price").order("id").range(from, from + 999) as never);
  else if (s.mode === "categories") await page((from) => supabase.from("products").select("id,price").in("category", s.categories).order("id").range(from, from + 999) as never);
  else {
    let ids = s.products.map((p) => p.id);
    if (s.mode === "supplier") {
      ids = [];
      for (let from = 0; ; from += 1000) {
        const { data, error } = await untypedDb.from("supplier_products").select("product_id").eq("supplier_id", s.supplierId).order("id").range(from, from + 999);
        if (error) throw error;
        ids.push(...(data ?? []).map((r: { product_id: string }) => r.product_id));
        if ((data ?? []).length < 1000) break;
      }
    }
    for (const part of chunk(ids, 150)) {
      const { data, error } = await supabase.from("products").select("id,price").in("id", part);
      if (error) throw error;
      out.push(...((data ?? []) as Row[]));
    }
  }
  return out;
}

export function ScopePicker({ value, onChange }: { value: Scope; onChange: (s: Scope) => void }) {
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [count, setCount] = useState<number | null>(null);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<{ id: string; name: string }[]>([]);
  const menu = buildMenu(null);
  const set = (p: Partial<Scope>) => onChange({ ...value, ...p });

  useEffect(() => { untypedDb.from("suppliers").select("id,name").order("name").then(({ data }: { data: { id: string; name: string }[] | null }) => setSuppliers(data ?? [])); }, []);

  // how many products the choice reaches (shown before anything is applied)
  useEffect(() => {
    if (!scopeValid(value)) { setCount(null); return; }
    let live = true;
    const t = setTimeout(() => { resolveScope(value).then((r) => live && setCount(r.length)).catch(() => live && setCount(null)); }, 200);
    return () => { live = false; clearTimeout(t); };
  }, [value]);

  useEffect(() => {
    const term = q.trim().replace(/[,()%*\\]/g, " ");
    if (value.mode !== "products" || term.length < 2) { setHits([]); return; }
    const t = setTimeout(async () => {
      const { data } = await supabase.from("products").select("id,name").ilike("name", `%${term.split(/\s+/).join("%")}%`).limit(8);
      setHits(data ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [q, value.mode]);

  const toggleCats = (names: string[], on: boolean) => set({ categories: on ? [...new Set([...value.categories, ...names])] : value.categories.filter((c) => !names.includes(c)) });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Unde se aplică">
        {MODES.map((m) => (
          <button key={m.value} type="button" role="radio" aria-checked={value.mode === m.value} onClick={() => set({ mode: m.value })}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${value.mode === m.value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/50"}`}>
            {m.label}
          </button>
        ))}
      </div>

      {value.mode === "categories" && (
        <div className="max-h-72 space-y-4 overflow-auto rounded-lg border bg-card p-3">
          {menu.map((s) => {
            const names = s.groups.flatMap((g) => g.links.map((l) => CATEGORIES_DATA[l.slug].name));
            const all = names.every((n) => value.categories.includes(n));
            return (
              <div key={s.key}>
                <label className="flex cursor-pointer items-center gap-2 border-b pb-1 text-sm font-bold">
                  <Checkbox checked={all} onCheckedChange={(c) => toggleCats(names, c === true)} aria-label={`Toată secțiunea ${s.title}`} />{s.title}
                </label>
                <div className="mt-2 grid gap-1 sm:grid-cols-2">
                  {s.groups.flatMap((g) => g.links).map((l) => {
                    const name = CATEGORIES_DATA[l.slug].name;
                    return (
                      <label key={l.slug} className="flex cursor-pointer items-center gap-2 rounded px-1 py-1 text-sm hover:bg-secondary">
                        <Checkbox checked={value.categories.includes(name)} onCheckedChange={(c) => toggleCats([name], c === true)} />{name}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {value.mode === "supplier" && (
        suppliers.length ? (
          <Select value={value.supplierId} onValueChange={(v) => set({ supplierId: v })}>
            <SelectTrigger aria-label="Furnizor"><SelectValue placeholder="Alege furnizorul" /></SelectTrigger>
            <SelectContent>{suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
          </Select>
        ) : <p className="text-sm text-muted-foreground">Nu ai furnizori încă (tab-ul Furnizori).</p>
      )}

      {value.mode === "products" && (
        <div className="space-y-2">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Caută produs" className="pl-9" placeholder="Caută un produs și adaugă-l…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          {hits.length > 0 && (
            <ul className="divide-y rounded-md border bg-popover text-sm">
              {hits.filter((h) => !value.products.some((p) => p.id === h.id)).map((h) => (
                <li key={h.id}><button type="button" className="w-full px-3 py-2 text-left hover:bg-secondary" onClick={() => { set({ products: [...value.products, h] }); setQ(""); setHits([]); }}>{h.name}</button></li>
              ))}
            </ul>
          )}
          <ul className="flex flex-wrap gap-2">
            {value.products.map((p) => (
              <li key={p.id} className="flex max-w-full items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs"><span className="truncate">{p.name}</span>
                <button type="button" aria-label={`Scoate ${p.name}`} onClick={() => set({ products: value.products.filter((x) => x.id !== p.id) })}><X className="h-3 w-3" /></button></li>
            ))}
          </ul>
        </div>
      )}

      <Label className="block text-xs font-normal text-muted-foreground" role="status">
        {scopeValid(value) ? (count == null ? "Se numără produsele…" : <>Se aplică la <strong className="text-foreground">{count}</strong> produse.</>) : "Alege unde se aplică."}
      </Label>
    </div>
  );
}

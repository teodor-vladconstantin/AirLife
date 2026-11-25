"use client";
import { trackFilter } from "@/lib/analytics";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ProductCard } from "@/components/shop/ProductCard";
import {
  DEFAULT_FILTERS, PAGE_SIZE, SORTS, activeFilterCount, applyFilters, facets, formatPrice, parseFilters, toQuery,
  type Facets, type Filters, type ProductCardData, type SortKey,
} from "@/lib/shop";

// Tells the list when the address changes without a page load (menu, brand strip and search links that point to
// /produse?... while the list is already open). Wrapped in <Suspense> by the caller so static pages stay static.
function UrlSync({ onChange }: { onChange: (p: URLSearchParams) => void }) {
  const key = useSearchParams()?.toString() ?? "";
  useEffect(() => { onChange(new URLSearchParams(key)); }, [key, onChange]);
  return null;
}

function Group({ title, children, open = true }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-border py-4 first:pt-0 last:border-0">
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-foreground">
        {title}
        <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
      </summary>
      <div className="mt-3 space-y-2">{children}</div>
    </details>
  );
}

function Check({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 shrink-0 rounded border-border accent-[hsl(var(--primary))]" />
      <span className="min-w-0 flex-1 break-words">{label}</span>
      {count != null && <span className="text-xs text-muted-foreground">({count})</span>}
    </label>
  );
}

// Filter groups (availability, sale, price, brand, category). Used in the side column on large screens and in the drawer on phones.
function FilterPanel({ f, fx, set, hideCategory }: { f: Filters; fx: Facets; set: (patch: Partial<Filters>) => void; hideCategory: boolean }) {
  const [allBrands, setAllBrands] = useState(false);
  const toggle = (list: string[], v: string) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const brands = allBrands ? fx.brands : fx.brands.slice(0, 8);
  return (
    <div>
      <Group title="Disponibilitate">
        <Check checked={f.inStock} onChange={() => set({ inStock: !f.inStock })} label="Doar în stoc" count={fx.inStock} />
        <Check checked={f.onSale} onChange={() => set({ onSale: !f.onSale })} label="La ofertă" count={fx.onSale} />
      </Group>
      <Group title="Preț">
        <div className="flex items-center gap-2">
          <Input type="number" inputMode="numeric" min={0} aria-label="Preț minim" placeholder={`Min ${fx.priceMin}`} value={f.min ?? ""} onChange={(e) => set({ min: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value)) })} />
          <span className="text-muted-foreground">-</span>
          <Input type="number" inputMode="numeric" min={0} aria-label="Preț maxim" placeholder={`Max ${fx.priceMax}`} value={f.max ?? ""} onChange={(e) => set({ max: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value)) })} />
        </div>
        <p className="text-xs text-muted-foreground">Între {formatPrice(fx.priceMin)} și {formatPrice(fx.priceMax)}</p>
      </Group>
      {fx.brands.length > 0 && (
        <Group title="Brand">
          {brands.map((b) => <Check key={b.name} checked={f.brands.includes(b.name)} onChange={() => set({ brands: toggle(f.brands, b.name) })} label={b.name} count={b.count} />)}
          {fx.brands.length > 8 && (
            <button type="button" className="text-sm font-medium text-primary hover:underline" onClick={() => setAllBrands((v) => !v)}>
              {allBrands ? "Arată mai puține" : `Arată toate (${fx.brands.length})`}
            </button>
          )}
        </Group>
      )}
      {!hideCategory && fx.categories.length > 1 && (
        <Group title="Categorie">
          {fx.categories.map((c) => <Check key={c.name} checked={f.categories.includes(c.name)} onChange={() => set({ categories: toggle(f.categories, c.name) })} label={c.name} count={c.count} />)}
        </Group>
      )}
    </div>
  );
}

function pageList(page: number, pages: number): (number | "…")[] {
  const set = new Set([1, pages, page - 1, page, page + 1].filter((n) => n >= 1 && n <= pages));
  const sorted = [...set].sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((n, i) => { if (i && n - sorted[i - 1] > 1) out.push("…"); out.push(n); });
  return out;
}

interface Props {
  cards: ProductCardData[];
  hideCategory?: boolean; // category pages: the category is fixed by the page
  heading?: string; // visually hidden title for the list region
}

export function CollectionView({ cards, hideCategory = false, heading = "Produse" }: Props) {
  // Server render and first client render use the default view (first page, newest first); the address is read right after mount.
  const [f, setF] = useState<Filters>(DEFAULT_FILTERS);
  const [drawer, setDrawer] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  // the last address this component wrote itself: a change that matches it is not re-applied
  const written = useRef<string | null>(null);
  const fromUrl = useCallback((p: URLSearchParams) => {
    if (written.current !== null && written.current === p.toString()) return;
    written.current = null;
    setF(parseFilters(p));
  }, []);

  const update = useCallback((patch: Partial<Filters>, keepPage = false) => {
    Object.entries(patch).forEach(([k, v]) => { if (k !== "page" && v != null && v !== "" && v !== false && !(Array.isArray(v) && !v.length)) trackFilter(k, String(v)); });
    setF((prev) => {
      const next = { ...prev, ...patch, page: keepPage ? (patch.page ?? prev.page) : 1 };
      written.current = new URLSearchParams(toQuery(next)).toString();
      window.history.replaceState(null, "", `${window.location.pathname}${toQuery(next)}`);
      return next;
    });
  }, []);

  const filtered = useMemo(() => applyFilters(cards, f), [cards, f]);
  const fx = useMemo(() => facets(cards, f), [cards, f]);
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(f.page, pages);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const active = activeFilterCount(f, hideCategory);
  const goto = (n: number) => { update({ page: n }, true); top.current?.scrollIntoView({ behavior: "smooth", block: "start" }); };
  const clear = () => update({ ...DEFAULT_FILTERS, min: undefined, max: undefined, sort: f.sort });

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...(f.q ? [{ key: "q", label: `Căutare: ${f.q}`, remove: () => update({ q: "" }) }] : []),
    ...(hideCategory ? [] : f.categories.map((c) => ({ key: `c-${c}`, label: c, remove: () => update({ categories: f.categories.filter((x) => x !== c) }) }))),
    ...f.brands.map((b) => ({ key: `b-${b}`, label: b, remove: () => update({ brands: f.brands.filter((x) => x !== b) }) })),
    ...(f.min != null || f.max != null ? [{ key: "price", label: `Preț: ${f.min != null ? formatPrice(f.min) : "0 RON"} - ${f.max != null ? formatPrice(f.max) : "fără limită"}`, remove: () => update({ min: undefined, max: undefined }) }] : []),
    ...(f.inStock ? [{ key: "stock", label: "În stoc", remove: () => update({ inStock: false }) }] : []),
    ...(f.onSale ? [{ key: "sale", label: "La ofertă", remove: () => update({ onSale: false }) }] : []),
  ];

  return (
    <div ref={top} className="scroll-mt-24">
      <Suspense fallback={null}><UrlSync onChange={fromUrl} /></Suspense>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative hidden flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input value={f.q} onChange={(e) => update({ q: e.target.value })} placeholder="Caută în produse" aria-label="Caută în produse" className="pl-9" />
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <Button variant="outline" className="lg:hidden" onClick={() => setDrawer(true)}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filtre{active > 0 ? ` (${active})` : ""}
          </Button>
          <label className="flex min-w-0 flex-1 items-center gap-2 text-sm sm:flex-none">
            <span className="hidden whitespace-nowrap text-muted-foreground sm:inline">Sortează:</span>
            <Select value={f.sort} onValueChange={(v) => update({ sort: v as SortKey })}>
              <SelectTrigger aria-label="Sortează produsele" className="h-11 min-w-0 flex-1 sm:w-56 sm:flex-none"><SelectValue /></SelectTrigger>
              <SelectContent>{SORTS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
          </label>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {chips.map((c) => (
            <button key={c.key} type="button" onClick={c.remove} className="inline-flex items-center gap-1 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium hover:bg-accent" aria-label={`Scoate filtrul ${c.label}`}>
              {c.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button type="button" onClick={clear} className="text-xs font-medium text-primary hover:underline">Șterge toate filtrele</button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="hidden lg:block" aria-label="Filtre">
          <FilterPanel f={f} fx={fx} set={update} hideCategory={hideCategory} />
        </aside>

        <section aria-label={heading} className="min-w-0">
          <p className="mb-4 text-sm text-muted-foreground" role="status" aria-live="polite">
            {filtered.length === 0 ? "Niciun produs" : `${filtered.length.toLocaleString("ro-RO")} ${filtered.length === 1 ? "produs" : "produse"}`}
            {pages > 1 && ` · pagina ${page} din ${pages}`}
          </p>
          {visible.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <p className="text-lg font-semibold text-foreground">Nu am găsit produse</p>
              <p className="mt-1 text-sm text-muted-foreground">Încearcă alte filtre sau o altă căutare.</p>
              {active > 0 && <Button className="mt-4" onClick={clear}>Șterge filtrele</Button>}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {visible.map((p, i) => <ProductCard key={p.id} product={p} priority={page === 1 && i < 4} />)}
            </div>
          )}
          {pages > 1 && (
            <nav className="mt-10 flex flex-wrap items-center justify-center gap-1" aria-label="Paginare">
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => goto(page - 1)} aria-label="Pagina anterioară"><ChevronLeft className="h-4 w-4" /></Button>
              {pageList(page, pages).map((n, i) => n === "…"
                ? <span key={`e${i}`} className="px-2 text-muted-foreground">…</span>
                : <Button key={n} variant={n === page ? "default" : "outline"} size="icon" onClick={() => goto(n)} aria-label={`Pagina ${n}`} aria-current={n === page ? "page" : undefined}>{n}</Button>)}
              <Button variant="outline" size="icon" disabled={page >= pages} onClick={() => goto(page + 1)} aria-label="Pagina următoare"><ChevronRight className="h-4 w-4" /></Button>
            </nav>
          )}
        </section>
      </div>

      <Sheet open={drawer} onOpenChange={setDrawer}>
        <SheetContent side="left" className="flex w-full max-w-sm flex-col">
          <SheetHeader><SheetTitle>Filtre</SheetTitle></SheetHeader>
          <div className="-mx-6 flex-1 overflow-y-auto px-6 py-4">
            <FilterPanel f={f} fx={fx} set={update} hideCategory={hideCategory} />
          </div>
          <SheetFooter className="flex-col gap-2 sm:flex-col">
            <Button className="w-full" onClick={() => setDrawer(false)}>Vezi {filtered.length.toLocaleString("ro-RO")} {filtered.length === 1 ? "produs" : "produse"}</Button>
            {active > 0 && <Button variant="ghost" className="w-full" onClick={clear}>Șterge toate filtrele</Button>}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

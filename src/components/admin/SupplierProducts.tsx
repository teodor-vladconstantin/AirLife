"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Plus, Search, Trash2, Upload } from "lucide-react";
import { untypedDb } from "@/lib/untypedDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { effectiveMarkup, parseOffer, realMarkup, recommendedPrice, toCsv, type SupplierProductRow } from "@/lib/suppliers";

type Row = SupplierProductRow & { products: { id: string; name: string; slug: string | null; sku: string | null; price: number; stock: number; hidden: boolean } };
const PAGE = 50;
const SEL = "id,supplier_id,product_id,supplier_sku,purchase_price,list_price,markup_percent,products!inner(id,name,slug,sku,price,stock,hidden)";
const money = (n: number | null) => (n == null ? "–" : `${n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

// Editable number: commits on blur / Enter, only when the value changed and is a valid non-negative number (empty = clear).
function NumCell({ value, onCommit, placeholder, label }: { value: number | null; onCommit: (v: number | null) => void; placeholder?: string; label: string }) {
  const [t, setT] = useState(value == null ? "" : String(value));
  useEffect(() => setT(value == null ? "" : String(value)), [value]);
  const commit = () => {
    const s = t.trim().replace(",", ".");
    const v = s === "" ? null : Number(s);
    if (v !== null && (!Number.isFinite(v) || v < 0)) { setT(value == null ? "" : String(value)); return; }
    if (v !== value) onCommit(v);
  };
  return <Input aria-label={label} inputMode="decimal" className="h-9 px-2 text-right" value={t} placeholder={placeholder} onChange={(e) => setT(e.target.value)} onBlur={commit} onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }} />;
}

export function SupplierProducts({ supplierId, supplierName, defaultMarkup, onChanged }: { supplierId: string; supplierName: string; defaultMarkup: number | null; onChanged: () => void }) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [missing, setMissing] = useState(false);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    let query = untypedDb.from("supplier_products").select(SEL, { count: "exact" }).eq("supplier_id", supplierId).order("supplier_sku", { nullsFirst: false }).order("id").range(page * PAGE, page * PAGE + PAGE - 1);
    const term = q.trim().replace(/[,()%*\\]/g, " ");
    if (term) query = /^[A-Za-z]{0,3}\d[\w-]*$/.test(term) ? query.ilike("supplier_sku", `%${term}%`) : query.ilike("products.name", `%${term.split(/\s+/).join("%")}%`);
    if (missing) query = query.is("purchase_price", null);
    const { data, count, error } = await query;
    if (error) { toast({ title: "Nu am putut încărca produsele", variant: "destructive" }); setRows([]); return; }
    setRows((data ?? []) as unknown as Row[]);
    setTotal(count ?? 0);
    setSel(new Set());
  }, [supplierId, page, q, missing, toast]);

  useEffect(() => { setPage(0); }, [supplierId, q, missing]);
  useEffect(() => { const t = setTimeout(() => void load(), q ? 250 : 0); return () => clearTimeout(t); }, [load, q]);

  const patchRow = async (r: Row, patch: Partial<SupplierProductRow>) => {
    const { error } = await untypedDb.from("supplier_products").update({ ...patch, updated_at: new Date().toISOString() }).eq("id", r.id);
    if (error) return toast({ title: "Nu am putut salva", variant: "destructive" });
    setRows((prev) => prev && prev.map((x) => (x.id === r.id ? { ...x, ...patch } : x)));
    onChanged();
  };
  const setSellPrice = async (r: Row, price: number | null) => {
    if (price == null) return;
    const { error } = await untypedDb.from("products").update({ price }).eq("id", r.product_id);
    if (error) return toast({ title: "Nu am putut salva prețul de vânzare", variant: "destructive" });
    setRows((prev) => prev && prev.map((x) => (x.id === r.id ? { ...x, products: { ...x.products, price } } : x)));
  };

  const chosen = (rows ?? []).filter((r) => sel.has(r.id));
  const applyRecommended = async () => {
    const todo = chosen.map((r) => ({ r, p: recommendedPrice(r.purchase_price, effectiveMarkup(r, defaultMarkup)) })).filter((x) => x.p != null) as { r: Row; p: number }[];
    if (!todo.length) return toast({ title: "Nimic de aplicat", description: "Selectează produse cu preț de achiziție și adaos.", variant: "destructive" });
    if (!window.confirm(`Setezi prețul de vânzare = preț recomandat pentru ${todo.length} produse? Prețurile actuale se înlocuiesc.`)) return;
    const res = await Promise.all(todo.map(({ r, p }) => untypedDb.from("products").update({ price: p }).eq("id", r.product_id)));
    const failed = res.filter((x) => x.error).length;
    toast({ title: failed ? `Gata, dar ${failed} nu s-au salvat` : `Prețuri actualizate (${todo.length})`, variant: failed ? "destructive" : undefined });
    void load();
  };
  const setMarkupForSelected = async () => {
    const v = window.prompt(`Adaos contractual (%) pentru ${chosen.length} produse (gol = adaosul implicit al furnizorului):`);
    if (v === null) return;
    const n = v.trim() === "" ? null : Number(v.replace(",", "."));
    if (n !== null && (!Number.isFinite(n) || n < 0)) return toast({ title: "Valoare invalidă", variant: "destructive" });
    const { error } = await untypedDb.from("supplier_products").update({ markup_percent: n, updated_at: new Date().toISOString() }).in("id", chosen.map((r) => r.id));
    if (error) return toast({ title: "Nu am putut salva", variant: "destructive" });
    void load();
  };
  const removeSelected = async () => {
    if (!window.confirm(`Scoți ${chosen.length} produse de la ${supplierName}? Produsele rămân în magazin, doar legătura cu furnizorul se șterge.`)) return;
    const { error } = await untypedDb.from("supplier_products").delete().in("id", chosen.map((r) => r.id));
    if (error) return toast({ title: "Nu am putut șterge", variant: "destructive" });
    void load(); onChanged();
  };

  const allRows = async (): Promise<Row[]> => {
    const out: Row[] = [];
    for (let from = 0; ; from += 1000) {
      const { data, error } = await untypedDb.from("supplier_products").select(SEL).eq("supplier_id", supplierId).order("id").range(from, from + 999);
      if (error || !data) break;
      out.push(...(data as unknown as Row[]));
      if (data.length < 1000) break;
    }
    return out;
  };
  const exportCsv = async () => {
    const list = await allRows();
    const csv = toCsv([["sku", "produs", "purchase_price", "list_price", "markup_percent", "pret_vanzare", "pret_recomandat"], ...list.map((r) => {
      const m = effectiveMarkup(r, defaultMarkup);
      return [r.supplier_sku ?? r.products.sku, r.products.name, r.purchase_price, r.list_price, m, r.products.price, recommendedPrice(r.purchase_price, m)];
    })]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `${supplierName.toLowerCase().replace(/\W+/g, "-")}-produse.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const importOffer = async (f: File) => {
    const { lines, error } = parseOffer(await f.text());
    if (error) return toast({ title: "Fișier invalid", description: error, variant: "destructive" });
    const bySku = new Map<string, Row>();
    for (const r of await allRows()) for (const k of [r.supplier_sku, r.products.sku]) if (k) bySku.set(k.toLowerCase(), r);
    let ok = 0; const unmatched: string[] = [];
    for (const l of lines) {
      const r = bySku.get(l.sku.toLowerCase());
      if (!r) { unmatched.push(l.sku); continue; }
      const patch: Record<string, number | null | string> = { updated_at: new Date().toISOString() };
      if ("purchase_price" in l) patch.purchase_price = l.purchase_price ?? null;
      if ("list_price" in l) patch.list_price = l.list_price ?? null;
      if ("markup_percent" in l) patch.markup_percent = l.markup_percent ?? null;
      const { error: e } = await untypedDb.from("supplier_products").update(patch).eq("id", r.id);
      if (!e) ok++;
    }
    toast({ title: `Ofertă importată: ${ok} produse actualizate`, description: unmatched.length ? `${unmatched.length} coduri negăsite: ${unmatched.slice(0, 8).join(", ")}${unmatched.length > 8 ? "…" : ""}` : undefined });
    void load(); onChanged();
  };

  const pages = Math.max(1, Math.ceil(total / PAGE));
  const grid = "grid gap-2 lg:grid-cols-[28px_minmax(0,2.4fr)_repeat(6,minmax(0,1fr))] lg:items-center";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Caută produs sau cod" className="pl-9" placeholder="Caută după nume sau cod…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button size="sm" variant={missing ? "default" : "outline"} onClick={() => setMissing((v) => !v)}>Fără preț de achiziție</Button>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}><Plus className="mr-1 h-4 w-4" />Adaugă produse</Button>
        <Button size="sm" variant="outline" onClick={() => file.current?.click()}><Upload className="mr-1 h-4 w-4" />Import ofertă (CSV)</Button>
        <Button size="sm" variant="outline" onClick={exportCsv}><Download className="mr-1 h-4 w-4" />Export CSV</Button>
        <input ref={file} type="file" accept=".csv,text/csv" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) void importOffer(f); e.target.value = ""; }} />
      </div>
      <p className="text-xs text-muted-foreground">Import: CSV cu coloana <code>sku</code> (sau <code>cod</code>) și cel puțin una dintre <code>purchase_price</code>, <code>list_price</code>, <code>markup_percent</code>. Prețuri fără TVA, cum sunt la furnizor.</p>

      {adding && <AddProducts supplierId={supplierId} onDone={() => { setAdding(false); void load(); onChanged(); }} />}

      {chosen.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-2 text-sm">
          <span className="font-medium">{chosen.length} selectate</span>
          <Button size="sm" onClick={applyRecommended}>Preț vânzare = recomandat</Button>
          <Button size="sm" variant="outline" onClick={setMarkupForSelected}>Setează adaos</Button>
          <Button size="sm" variant="ghost" onClick={removeSelected}><Trash2 className="mr-1 h-4 w-4 text-destructive" />Scoate de la furnizor</Button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <div className={`${grid} hidden border-b bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground lg:grid`}>
          <Checkbox aria-label="Selectează toate" checked={!!rows?.length && sel.size === rows.length} onCheckedChange={(c) => setSel(c === true ? new Set((rows ?? []).map((r) => r.id)) : new Set())} />
          <span>Produs</span><span className="text-right">Preț achiziție</span><span className="text-right">Preț listă</span><span className="text-right">Adaos contract %</span><span className="text-right">Preț recomandat</span><span className="text-right">Preț vânzare</span><span className="text-right">Adaos real %</span>
        </div>
        {rows === null && <p className="p-4 text-sm text-muted-foreground">Se încarcă…</p>}
        {rows?.length === 0 && <p className="p-4 text-sm text-muted-foreground">{q || missing ? "Niciun produs pentru filtrul ales." : "Furnizorul nu are produse încă. Folosește „Adaugă produse”."}</p>}
        {rows?.map((r) => {
          const m = effectiveMarkup(r, defaultMarkup);
          const rec = recommendedPrice(r.purchase_price, m);
          const real = realMarkup(r.products.price, r.purchase_price);
          const low = real != null && m != null && real + 0.005 < m;
          const L = ({ children }: { children: string }) => <span className="text-xs text-muted-foreground lg:hidden">{children}</span>;
          return (
            <div key={r.id} className={`${grid} border-b px-3 py-3 last:border-0`}>
              <Checkbox aria-label={`Selectează ${r.products.name}`} checked={sel.has(r.id)} onCheckedChange={(c) => setSel((s) => { const n = new Set(s); if (c === true) n.add(r.id); else n.delete(r.id); return n; })} />
              <div className="min-w-0"><p className="line-clamp-2 break-words text-sm font-medium">{r.products.name}</p><p className="text-xs text-muted-foreground">{r.supplier_sku ?? r.products.sku ?? "–"}{r.products.hidden ? " · ascuns" : ""} · stoc {r.products.stock}</p></div>
              <div><L>Preț achiziție</L><NumCell label="Preț achiziție" value={r.purchase_price} onCommit={(v) => patchRow(r, { purchase_price: v })} /></div>
              <div><L>Preț listă</L><NumCell label="Preț listă" value={r.list_price} onCommit={(v) => patchRow(r, { list_price: v })} /></div>
              <div><L>Adaos contract %</L><NumCell label="Adaos contract %" value={r.markup_percent} placeholder={defaultMarkup != null ? String(defaultMarkup) : "–"} onCommit={(v) => patchRow(r, { markup_percent: v })} /></div>
              <div className="flex items-center justify-between lg:justify-end"><L>Preț recomandat</L><span className="text-sm tabular-nums">{money(rec)}</span></div>
              <div><L>Preț vânzare</L><NumCell label="Preț vânzare" value={r.products.price} onCommit={(v) => setSellPrice(r, v)} /></div>
              <div className="flex items-center justify-between lg:justify-end"><L>Adaos real %</L><span className={`text-sm font-semibold tabular-nums ${low ? "text-destructive" : real != null ? "text-primary" : ""}`} title={low ? "Sub adaosul din contract" : undefined}>{real == null ? "–" : `${real.toLocaleString("ro-RO")}%`}</span></div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} produse · pagina {page + 1} din {pages}</span>
        <span className="flex gap-2">
          <Button size="sm" variant="outline" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Înapoi</Button>
          <Button size="sm" variant="outline" disabled={page + 1 >= pages} onClick={() => setPage((p) => p + 1)}>Înainte</Button>
        </span>
      </div>
    </div>
  );
}

// Link existing shop products to this supplier (search by name or code).
function AddProducts({ supplierId, onDone }: { supplierId: string; onDone: () => void }) {
  const { toast } = useToast();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<{ id: string; name: string; sku: string | null; linked: boolean }[]>([]);
  const [pick, setPick] = useState<Set<string>>(new Set());

  useEffect(() => {
    const term = q.trim().replace(/[,()%*\\]/g, " ");
    if (term.length < 2) { setHits([]); return; }
    const t = setTimeout(async () => {
      const like = `%${term.split(/\s+/).join("%")}%`;
      const { data } = await untypedDb.from("products").select("id,name,sku").or(`name.ilike.${like},sku.ilike.${like}`).limit(15);
      const ids = (data ?? []).map((p: { id: string }) => p.id);
      const { data: linked } = ids.length ? await untypedDb.from("supplier_products").select("product_id").eq("supplier_id", supplierId).in("product_id", ids) : { data: [] };
      const set = new Set((linked ?? []).map((l: { product_id: string }) => l.product_id));
      setHits((data ?? []).map((p: { id: string; name: string; sku: string | null }) => ({ ...p, linked: set.has(p.id) })));
    }, 250);
    return () => clearTimeout(t);
  }, [q, supplierId]);

  const add = async () => {
    const rows = hits.filter((h) => pick.has(h.id)).map((h) => ({ supplier_id: supplierId, product_id: h.id, supplier_sku: h.sku }));
    if (!rows.length) return;
    const { error } = await untypedDb.from("supplier_products").upsert(rows, { onConflict: "supplier_id,product_id", ignoreDuplicates: true });
    if (error) return toast({ title: "Nu am putut adăuga", variant: "destructive" });
    toast({ title: `Adăugate: ${rows.length}` });
    onDone();
  };
  return (
    <div className="space-y-2 rounded-lg border border-border bg-card p-3">
      <Input aria-label="Caută produs de adăugat" autoFocus placeholder="Caută un produs din magazin (nume sau cod)…" value={q} onChange={(e) => setQ(e.target.value)} />
      <ul className="divide-y text-sm">
        {hits.map((h) => (
          <li key={h.id} className="flex items-center gap-3 py-2">
            <Checkbox aria-label={`Alege ${h.name}`} disabled={h.linked} checked={pick.has(h.id)} onCheckedChange={(c) => setPick((s) => { const n = new Set(s); if (c === true) n.add(h.id); else n.delete(h.id); return n; })} />
            <span className="min-w-0 flex-1 truncate">{h.name} <span className="text-xs text-muted-foreground">{h.sku}</span></span>
            {h.linked && <span className="text-xs text-muted-foreground">deja la acest furnizor</span>}
          </li>
        ))}
      </ul>
      <Button size="sm" onClick={add} disabled={!pick.size}>Adaugă {pick.size || ""} produse</Button>
    </div>
  );
}

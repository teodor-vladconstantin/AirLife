"use client";
import { useCallback, useEffect, useState } from "react";
import { Download, Plus, Search, Trash2 } from "lucide-react";
import { untypedDb } from "@/lib/untypedDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { toCsv, type SupplierProductRow } from "@/lib/suppliers";
import { applySupplierDiscount } from "@/lib/supplierPricing";

type Row = SupplierProductRow & { products: { id: string; name: string; slug: string | null; sku: string | null; price: number; stock: number; hidden: boolean } };
const PAGE = 50;
const SEL = "id,supplier_id,product_id,supplier_sku,purchase_price,products!inner(id,name,slug,sku,price,stock,hidden)";
const money = (n: number | null) => (n == null ? "–" : `${n.toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);

export function SupplierProducts({ supplierId, supplierName, discount, onChanged }: { supplierId: string; supplierName: string; discount: number | null; onChanged: () => void }) {
  const { toast } = useToast();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const [missing, setMissing] = useState(false);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);

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

  const chosen = (rows ?? []).filter((r) => sel.has(r.id));
  // Recomputes the purchase prices now (the daily supplier sync does it too), e.g. after adding products.
  const recalcAll = async () => {
    const r = await applySupplierDiscount(supplierId, discount);
    toast({ title: r.failed ? `Recalculat la ${r.updated}, ${r.failed} au eșuat` : `Prețuri de achiziție actualizate: ${r.updated}`, variant: r.failed ? "destructive" : undefined });
    void load(); onChanged();
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
    const csv = toCsv([["sku", "produs", "pret_vanzare", "pret_achizitie"], ...list.map((r) => [r.supplier_sku ?? r.products.sku, r.products.name, r.products.price, r.purchase_price])]);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = `${supplierName.toLowerCase().replace(/\W+/g, "-")}-produse.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const pages = Math.max(1, Math.ceil(total / PAGE));
  const grid = "grid gap-2 lg:grid-cols-[28px_minmax(0,2.8fr)_repeat(3,minmax(0,1fr))] lg:items-center";

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Caută produs sau cod" className="pl-9" placeholder="Caută după nume sau cod…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button size="sm" variant={missing ? "default" : "outline"} onClick={() => setMissing((v) => !v)}>Fără preț de achiziție</Button>
        <Button size="sm" variant="outline" onClick={recalcAll} disabled={discount == null}>Recalculează prețurile de achiziție</Button>
        <Button size="sm" variant="outline" onClick={() => setAdding((v) => !v)}><Plus className="mr-1 h-4 w-4" />Adaugă produse</Button>
        <Button size="sm" variant="outline" onClick={exportCsv}><Download className="mr-1 h-4 w-4" />Export CSV</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {discount != null
          ? <>Vindem la <strong>același preț ca furnizorul</strong>. <strong>Prețul de achiziție</strong> = prețul de vânzare minus discountul contractual de <strong>{discount}%</strong>. La Ecovent și Novingair ambele se actualizează zilnic din catalogul lor, deci un preț de vânzare pus manual este suprascris.</>
          : <>Setează <strong>discountul contractual</strong> în fișa furnizorului (mai sus): prețul de achiziție se va calcula automat din prețul de vânzare.</>}
      </p>

      {adding && <AddProducts supplierId={supplierId} onDone={() => { setAdding(false); void recalcAll(); }} />}

      {chosen.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 p-2 text-sm">
          <span className="font-medium">{chosen.length} selectate</span>
          <Button size="sm" variant="ghost" onClick={removeSelected}><Trash2 className="mr-1 h-4 w-4 text-destructive" />Scoate de la furnizor</Button>
        </div>
      )}

      <div className="rounded-lg border border-border bg-card">
        <div className={`${grid} hidden border-b bg-muted/50 px-3 py-2 text-xs font-semibold text-muted-foreground lg:grid`}>
          <Checkbox aria-label="Selectează toate" checked={!!rows?.length && sel.size === rows.length} onCheckedChange={(c) => setSel(c === true ? new Set((rows ?? []).map((r) => r.id)) : new Set())} />
          <span>Produs</span><span className="text-right">Preț vânzare</span><span className="text-right">Preț achiziție</span><span className="text-right">Câștig (lei)</span>
        </div>
        {rows === null && <p className="p-4 text-sm text-muted-foreground">Se încarcă…</p>}
        {rows?.length === 0 && <p className="p-4 text-sm text-muted-foreground">{q || missing ? "Niciun produs pentru filtrul ales." : "Furnizorul nu are produse încă. Folosește „Adaugă produse”."}</p>}
        {rows?.map((r) => {
          const L = ({ children }: { children: string }) => <span className="text-xs text-muted-foreground lg:hidden">{children}</span>;
          const gain = r.purchase_price == null ? null : r.products.price - r.purchase_price;
          return (
            <div key={r.id} className={`${grid} border-b px-3 py-3 last:border-0`}>
              <Checkbox aria-label={`Selectează ${r.products.name}`} checked={sel.has(r.id)} onCheckedChange={(c) => setSel((s) => { const n = new Set(s); if (c === true) n.add(r.id); else n.delete(r.id); return n; })} />
              <div className="min-w-0"><p className="line-clamp-2 break-words text-sm font-medium">{r.products.name}</p><p className="text-xs text-muted-foreground">{r.supplier_sku ?? r.products.sku ?? "–"}{r.products.hidden ? " · ascuns" : ""} · stoc {r.products.stock}</p></div>
              <div className="flex items-center justify-between lg:justify-end"><L>Preț vânzare</L><span className="text-sm font-semibold tabular-nums">{money(r.products.price)}</span></div>
              <div className="flex items-center justify-between lg:justify-end"><L>Preț achiziție</L><span className="text-sm font-semibold tabular-nums">{money(r.purchase_price)}</span></div>
              <div className="flex items-center justify-between lg:justify-end"><L>Câștig (lei)</L><span className={`text-sm font-semibold tabular-nums ${gain != null && gain < 0 ? "text-destructive" : gain != null ? "text-primary" : ""}`}>{money(gain)}</span></div>
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

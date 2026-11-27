"use client";
import { useCallback, useEffect, useState } from "react";
import { ExternalLink, Plus, Trash2 } from "lucide-react";
import { untypedDb } from "@/lib/untypedDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { SupplierProducts } from "./SupplierProducts";
import { applySupplierDiscount } from "@/lib/supplierPricing";

interface Supplier {
  id: string; name: string; contact_name: string | null; contact_email: string | null; contact_phone: string | null; website: string | null;
  default_markup_percent: number | null; offer_label: string | null; offer_url: string | null; offer_valid_until: string | null; notes: string | null;
}
type Stat = { count: number; noPurchase: number };

const toForm = (s: Supplier) => ({
  name: s.name, contact_name: s.contact_name ?? "", contact_email: s.contact_email ?? "", contact_phone: s.contact_phone ?? "", website: s.website ?? "",
  default_markup_percent: s.default_markup_percent == null ? "" : String(s.default_markup_percent), offer_label: s.offer_label ?? "", offer_url: s.offer_url ?? "",
  offer_valid_until: s.offer_valid_until ?? "", notes: s.notes ?? "",
});

export function SuppliersManager() {
  const { toast } = useToast();
  const [list, setList] = useState<Supplier[] | null>(null);
  const [stats, setStats] = useState<Record<string, Stat>>({});
  const [missingTables, setMissingTables] = useState(false);
  const [selId, setSelId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [rev, setRev] = useState(0); // bumps after a repricing so the product table reloads
  const [newName, setNewName] = useState("");
  const [form, setForm] = useState<ReturnType<typeof toForm> | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await untypedDb.from("suppliers").select("*").order("name");
    if (error) { setMissingTables(true); setList([]); return; }
    setMissingTables(false);
    setList(data as Supplier[]);
    const acc: Record<string, Stat> = {};
    for (let from = 0; ; from += 1000) {
      const { data: rows } = await untypedDb.from("supplier_products").select("supplier_id,purchase_price").order("id").range(from, from + 999);
      if (!rows) break;
      for (const r of rows as { supplier_id: string; purchase_price: number | null }[]) {
        const s = (acc[r.supplier_id] ??= { count: 0, noPurchase: 0 });
        s.count++;
        if (r.purchase_price == null) s.noPurchase++;
      }
      if (rows.length < 1000) break;
    }
    setStats(acc);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const sel = list?.find((s) => s.id === selId) ?? null;
  useEffect(() => { setForm(sel ? toForm(sel) : null); }, [sel?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (list && !selId && list[0]) setSelId(list[0].id); }, [list, selId]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newName.trim();
    if (name.length < 2) return;
    const { data, error } = await untypedDb.from("suppliers").insert({ name }).select().single();
    if (error) return toast({ title: error.code === "23505" ? "Există deja un furnizor cu acest nume" : "Nu am putut crea furnizorul", variant: "destructive" });
    setNewName(""); setCreating(false);
    await load();
    setSelId((data as Supplier).id);
  };

  const save = async () => {
    if (!sel || !form) return;
    const discount = form.default_markup_percent.trim() === "" ? null : Number(form.default_markup_percent.replace(",", "."));
    if (form.name.trim().length < 2 || (discount !== null && !(discount >= 0 && discount < 100))) return toast({ title: "Verifică numele și discountul", variant: "destructive" });
    const n = (v: string) => v.trim() || null;
    const { error } = await untypedDb.from("suppliers").update({
      name: form.name.trim(), contact_name: n(form.contact_name), contact_email: n(form.contact_email), contact_phone: n(form.contact_phone), website: n(form.website),
      default_markup_percent: discount, offer_label: n(form.offer_label), offer_url: n(form.offer_url), offer_valid_until: n(form.offer_valid_until), notes: n(form.notes),
      updated_at: new Date().toISOString(),
    }).eq("id", sel.id);
    if (error) return toast({ title: error.code === "23505" ? "Există deja un furnizor cu acest nume" : "Nu am putut salva", variant: "destructive" });
    toast({ title: "Furnizor salvat" });
    // The discount belongs to the supplier: when it changes, the purchase price of all of its products is recomputed.
    if (discount !== null && discount !== sel.default_markup_percent) {
      const r = await applySupplierDiscount(sel.id, discount);
      setRev((v) => v + 1);
      toast({ title: r.failed ? `Prețuri de achiziție actualizate la ${r.updated} produse, ${r.failed} au eșuat` : `Prețurile de achiziție s-au actualizat la ${r.updated} produse`, description: `Preț achiziție = preț vânzare − ${discount}%` });
    }
    void load();
  };

  const remove = async () => {
    if (!sel || !window.confirm(`Ștergi furnizorul ${sel.name}? Se șterg legăturile cu produsele și prețurile de achiziție; produsele din magazin rămân.`)) return;
    const { error } = await untypedDb.from("suppliers").delete().eq("id", sel.id);
    if (error) return toast({ title: "Nu am putut șterge", variant: "destructive" });
    setSelId(null);
    void load();
  };

  const set = (k: keyof NonNullable<typeof form>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => (f ? { ...f, [k]: e.target.value } : f));
  const expired = sel?.offer_valid_until && new Date(sel.offer_valid_until).getTime() < Date.now();

  return (
    <div className="space-y-6">
      {missingTables && <p className="rounded-lg border border-primary/30 bg-accent p-3 text-sm text-foreground">Tabelele pentru furnizori nu există încă. Rulează migrarea <code>20251220000000_suppliers.sql</code> în Supabase (SQL Editor). Ea creează și furnizorii Ecovent și Novingair și leagă produsele.</p>}

      <div className="flex flex-wrap items-center gap-2">
        {list?.map((s) => (
          <button key={s.id} type="button" onClick={() => setSelId(s.id)} aria-pressed={s.id === selId}
            className={`rounded-lg border px-4 py-2 text-left text-sm transition-colors ${s.id === selId ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary/40"}`}>
            <span className="block font-semibold">{s.name}</span>
            <span className="text-xs text-muted-foreground">{stats[s.id]?.count ?? 0} produse{stats[s.id]?.noPurchase ? ` · ${stats[s.id].noPurchase} fără preț de achiziție` : ""}</span>
          </button>
        ))}
        {creating ? (
          <form onSubmit={create} className="flex gap-2"><Input autoFocus aria-label="Numele furnizorului" placeholder="Nume furnizor" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-48" /><Button type="submit">Adaugă</Button><Button type="button" variant="ghost" onClick={() => setCreating(false)}>Renunță</Button></form>
        ) : (
          <Button variant="outline" onClick={() => setCreating(true)} disabled={missingTables}><Plus className="mr-1 h-4 w-4" />Furnizor nou</Button>
        )}
      </div>

      {sel && form && (
        <>
          <Card>
            <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0"><CardTitle>{sel.name}</CardTitle>
              <Button variant="ghost" size="sm" onClick={remove}><Trash2 className="mr-1 h-4 w-4 text-destructive" />Șterge furnizorul</Button></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div><Label htmlFor="sp-name">Nume *</Label><Input id="sp-name" value={form.name} onChange={set("name")} /></div>
                <div><Label htmlFor="sp-cn">Persoană de contact</Label><Input id="sp-cn" value={form.contact_name} onChange={set("contact_name")} /></div>
                <div><Label htmlFor="sp-em">Email de contact</Label><Input id="sp-em" type="email" value={form.contact_email} onChange={set("contact_email")} /></div>
                <div><Label htmlFor="sp-ph">Telefon</Label><Input id="sp-ph" value={form.contact_phone} onChange={set("contact_phone")} /></div>
                <div><Label htmlFor="sp-web">Site</Label><Input id="sp-web" value={form.website} onChange={set("website")} placeholder="https://" /></div>
                <div><Label htmlFor="sp-mk">Discount contractual (%)</Label><Input id="sp-mk" inputMode="decimal" value={form.default_markup_percent} onChange={set("default_markup_percent")} placeholder="ex: 20" /><p className="mt-1 text-xs text-muted-foreground">Se aplică tuturor produselor furnizorului: vindem la prețul lui, iar prețul de achiziție = preț de vânzare minus discount.</p></div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div><Label htmlFor="sp-ol">Oferta de preț (denumire)</Label><Input id="sp-ol" value={form.offer_label} onChange={set("offer_label")} placeholder="ex: Listă de preț 2026" /></div>
                <div><Label htmlFor="sp-ou">Link ofertă</Label><div className="flex gap-2"><Input id="sp-ou" value={form.offer_url} onChange={set("offer_url")} placeholder="https://" />{sel.offer_url && <a href={sel.offer_url} target="_blank" rel="noopener noreferrer" aria-label="Deschide oferta" className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border hover:bg-secondary"><ExternalLink className="h-4 w-4" /></a>}</div></div>
                <div><Label htmlFor="sp-ov">Ofertă valabilă până la</Label><DatePicker id="sp-ov" value={form.offer_valid_until} onChange={(v) => setForm((f) => (f ? { ...f, offer_valid_until: v } : f))} placeholder="Fără dată" />{expired && <p className="mt-1 text-xs text-destructive">Oferta a expirat.</p>}</div>
              </div>
              <div><Label htmlFor="sp-notes">Note (condiții, termene de livrare, contract)</Label><Textarea id="sp-notes" rows={3} value={form.notes} onChange={set("notes")} /></div>
              <Button onClick={save}>Salvează furnizorul</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Produsele furnizorului</CardTitle></CardHeader>
            <CardContent>
              <SupplierProducts key={`${sel.id}-${rev}`} supplierId={sel.id} supplierName={sel.name} discount={sel.default_markup_percent} onChanged={load} />
            </CardContent>
          </Card>
        </>
      )}
      {list?.length === 0 && !missingTables && <p className="text-sm text-muted-foreground">Nu ai furnizori încă. Adaugă primul cu „Furnizor nou”.</p>}
    </div>
  );
}

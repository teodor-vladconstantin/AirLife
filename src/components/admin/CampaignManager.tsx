"use client";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { useConfirm } from "@/components/admin/confirm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES_DATA } from "@/data/categoriesData";
import { UTM_CHANNELS, utmUrl } from "@/lib/utm";
import { Trash2, Copy, Megaphone, Percent, Link2 } from "lucide-react";

type Campaign = Tables<"campaigns">;
const CATEGORY_NAMES = Object.values(CATEGORIES_DATA).map((c) => c.name);
const PAGES = [
  { v: "/", l: "Pagina principală" }, { v: "/produse", l: "Toate produsele" }, { v: "/aer-conditionat", l: "Aer condiționat" },
  { v: "/aer-conditionat-buzau", l: "Aer condiționat Buzău (servicii)" }, { v: "/servicii/montaj-aer-conditionat-buzau", l: "Montaj" },
  { v: "/servicii/igienizare-aer-conditionat-buzau", l: "Igienizare" }, { v: "/ventilatoare-baie", l: "Ventilatoare baie" },
  { v: "/dezumidificatoare", l: "Dezumidificatoare" }, { v: "/recuperatoare-caldura", l: "Recuperatoare" }, { v: "/blog", l: "Blog" },
];
const inputDate = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);

// Applies (or clears) a percentage sale on every product of a category (or all), through products.sale_price.
async function applySale(category: string, percent: number | null, endsAt: string | null) {
  let q = supabase.from("products").select("id,price");
  if (category !== "all") q = q.eq("category", category);
  const { data, error } = await q;
  if (error) throw error;
  const rows = data ?? [];
  const results = await Promise.all(rows.map((r) =>
    supabase.from("products").update(
      percent == null ? { sale_price: null, sale_ends_at: null }
        : { sale_price: Math.round(Number(r.price) * (1 - percent / 100) * 100) / 100, sale_ends_at: endsAt },
    ).eq("id", r.id)));
  const bad = results.find((x) => x.error);
  if (bad?.error) throw bad.error;
  return rows.length;
}

export const CampaignManager = () => {
  const { toast } = useToast();
  const [confirm, confirmDialog] = useConfirm();
  const [list, setList] = useState<Campaign[]>([]);
  const [f, setF] = useState({ name: "", headline: "", cta_label: "Vezi ofertele", cta_url: "/produse", starts_at: inputDate(new Date()), ends_at: "", active: true, discount: "", category: "all" });
  const [saleCat, setSaleCat] = useState("all");
  const [salePct, setSalePct] = useState("");
  const [saleEnd, setSaleEnd] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase.from("campaigns").select("*").order("created_at", { ascending: false });
    setList(data ?? []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const fail = (e: unknown) => toast({ title: "Eroare", description: (e as Error).message, variant: "destructive" });

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.from("campaigns").insert({
        name: f.name.trim(), headline: f.headline.trim(), cta_label: f.cta_label.trim() || null, cta_url: f.cta_url || null,
        starts_at: new Date(f.starts_at).toISOString(), ends_at: f.ends_at ? new Date(f.ends_at).toISOString() : null, active: f.active,
      });
      if (error) throw error;
      const pct = parseFloat(f.discount);
      if (pct > 0 && pct < 100) {
        const n = await applySale(f.category, pct, f.ends_at ? new Date(f.ends_at).toISOString() : null);
        toast({ title: "Campanie creată", description: `Reducere de ${pct}% aplicată la ${n} produse.` });
      } else toast({ title: "Campanie creată" });
      setF({ ...f, name: "", headline: "", discount: "" });
      load();
    } catch (err) { fail(err); } finally { setBusy(false); }
  };

  const toggle = async (c: Campaign) => { const { error } = await supabase.from("campaigns").update({ active: !c.active }).eq("id", c.id); if (error) return fail(error); load(); };
  const remove = async (c: Campaign) => {
    if (!(await confirm({ title: `Ștergi campania „${c.name}”?`, description: "Bannerul dispare de pe site.", confirmLabel: "Șterge", destructive: true }))) return;
    const { error } = await supabase.from("campaigns").delete().eq("id", c.id); if (error) return fail(error); load();
  };

  const sale = async (clear: boolean) => {
    const pct = parseFloat(salePct);
    if (!clear && !(pct > 0 && pct < 100)) return toast({ title: "Introdu un procent între 1 și 99", variant: "destructive" });
    if (!(await confirm({ title: clear ? "Scoți ofertele din categoria aleasă?" : `Aplici -${pct}% pe ${saleCat === "all" ? "toate produsele" : saleCat}?`, description: clear ? "Prețurile revin la valoarea normală." : "Prețul normal rămâne păstrat și apare tăiat pe site.", confirmLabel: clear ? "Scoate ofertele" : "Aplică reducerea" }))) return;
    setBusy(true);
    try {
      const n = await applySale(saleCat, clear ? null : pct, !clear && saleEnd ? new Date(saleEnd).toISOString() : null);
      toast({ title: clear ? "Oferte scoase" : "Reducere aplicată", description: `${n} produse actualizate.` });
    } catch (err) { fail(err); } finally { setBusy(false); }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Megaphone className="w-5 h-5" />Campanie nouă (banner pe site)</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={create} className="space-y-3">
              <div className="space-y-1"><Label>Nume intern (devine utm_campaign)</Label><Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="iarna-2026" required /></div>
              <div className="space-y-1"><Label>Text banner</Label><Input value={f.headline} onChange={(e) => setF({ ...f, headline: e.target.value })} placeholder="-10% la aparatele de aer condiționat, până pe 31 decembrie" required /></div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Text buton</Label><Input value={f.cta_label} onChange={(e) => setF({ ...f, cta_label: e.target.value })} /></div>
                <div className="space-y-1"><Label>Duce la</Label>
                  <Select value={f.cta_url} onValueChange={(v) => setF({ ...f, cta_url: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{PAGES.map((p) => <SelectItem key={p.v} value={p.v}>{p.l}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1"><Label>Începe</Label><DateTimePicker value={f.starts_at} onChange={(v) => setF({ ...f, starts_at: v })} clearable={false} /></div>
                <div className="space-y-1"><Label>Se termină (gol = fără sfârșit)</Label><DateTimePicker value={f.ends_at} onChange={(v) => setF({ ...f, ends_at: v })} placeholder="Fără sfârșit" /></div>
              </div>
              <div className="rounded-md border p-3 space-y-2 bg-secondary/30">
                <p className="text-sm font-medium flex items-center gap-2"><Percent className="w-4 h-4" />Reducere automată (opțional)</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Select value={f.category} onValueChange={(v) => setF({ ...f, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="all">Toate produsele</SelectItem>{CATEGORY_NAMES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input type="number" min="1" max="99" value={f.discount} onChange={(e) => setF({ ...f, discount: e.target.value })} placeholder="% reducere" />
                </div>
                <p className="text-xs text-muted-foreground">Se aplică la creare, până la data de sfârșit a campaniei.</p>
              </div>
              <div className="flex items-center gap-3"><Switch checked={f.active} onCheckedChange={(v) => setF({ ...f, active: v })} /><Label>Activă</Label></div>
              <Button type="submit" disabled={busy} className="w-full">Creează campania</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Percent className="w-5 h-5" />Reduceri rapide pe categorie</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">Setează sau scoate prețul redus la toate produsele unei categorii. Prețul normal rămâne păstrat și apare tăiat pe site.</p>
            <Select value={saleCat} onValueChange={setSaleCat}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">Toate produsele</SelectItem>{CATEGORY_NAMES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="space-y-1"><Label>Reducere (%)</Label><Input type="number" min="1" max="99" value={salePct} onChange={(e) => setSalePct(e.target.value)} /></div>
              <div className="space-y-1"><Label>Până la</Label><DateTimePicker value={saleEnd} onChange={setSaleEnd} placeholder="Fără dată de sfârșit" /></div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => sale(false)} disabled={busy} className="flex-1">Aplică reducerea</Button>
              <Button onClick={() => sale(true)} disabled={busy} variant="outline" className="flex-1">Scoate ofertele</Button>
            </div>
            <p className="text-xs text-muted-foreground">Pentru un singur produs, setează „Preț redus” din tab-ul Produse. Coduri de reducere și plata online vin odată cu integrarea Stripe.</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Campanii</h3>
        {list.length === 0 && <p className="text-sm text-muted-foreground">Nicio campanie încă.</p>}
        {list.map((c) => (
          <Card key={c.id}><CardContent className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="break-words font-semibold">{c.name} {!c.active && <span className="text-xs text-amber-700 ml-1">oprită</span>}</p>
              <p className="text-sm text-muted-foreground truncate">{c.headline}</p>
              <p className="text-xs text-muted-foreground">{new Date(c.starts_at).toLocaleString("ro-RO")} → {c.ends_at ? new Date(c.ends_at).toLocaleString("ro-RO") : "fără sfârșit"}</p>
            </div>
            <Switch checked={c.active} onCheckedChange={() => toggle(c)} aria-label="Activă" />
            <Button size="icon" variant="destructive" onClick={() => remove(c)}><Trash2 className="w-4 h-4" /></Button>
          </CardContent></Card>
        ))}
      </div>

      <UtmBuilder />
      {confirmDialog}
    </div>
  );
};

export const UtmBuilder = () => {
  const { toast } = useToast();
  const [page, setPage] = useState("/");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const copy = async (url: string) => { try { await navigator.clipboard.writeText(url); toast({ title: "Link copiat" }); } catch { toast({ title: "Nu am putut copia", variant: "destructive" }); } };
  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Link2 className="w-5 h-5" />Linkuri cu UTM pe fiecare canal</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">Folosește aceste linkuri în postări, bio, reclame și emailuri. Statisticile apar în GA4 la Surse de trafic.</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Select value={page} onValueChange={setPage}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{PAGES.map((p) => <SelectItem key={p.v} value={p.v}>{p.l}</SelectItem>)}</SelectContent>
          </Select>
          <Input value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="campanie (ex. montaj-buzau)" />
          <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="conținut (opțional, ex. postare-1)" />
        </div>
        <div className="space-y-2">
          {UTM_CHANNELS.map((ch) => {
            const url = utmUrl(page, ch, campaign || "general", content || undefined);
            return (
              <div key={ch.key} className="flex flex-col gap-1 text-xs sm:flex-row sm:items-center sm:gap-2">
                <span className="font-medium sm:w-48 sm:flex-shrink-0">{ch.label}</span>
                <code className="min-w-0 break-all rounded bg-secondary px-2 py-1 sm:flex-1 sm:truncate">{url}</code>
                <Button size="icon" variant="ghost" className="self-end sm:self-auto" onClick={() => copy(url)} aria-label="Copiază"><Copy className="w-4 h-4" /></Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

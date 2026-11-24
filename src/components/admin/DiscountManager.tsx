"use client";
import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { untypedDb } from "@/lib/untypedDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type Code = { code: string; kind: "percent" | "fixed"; value: number; min_order: number; starts_at: string | null; ends_at: string | null; max_uses: number | null; used_count: number; active: boolean };
const EMPTY = { code: "", kind: "percent" as Code["kind"], value: "", min_order: "", ends_at: "", max_uses: "" };

export function DiscountManager() {
  const { toast } = useToast();
  const [rows, setRows] = useState<Code[] | null>(null);
  const [missing, setMissing] = useState(false);
  const [f, setF] = useState(EMPTY);

  const load = useCallback(async () => {
    const { data, error } = await untypedDb.from("discount_codes").select("*").order("created_at", { ascending: false });
    if (error) { setMissing(true); setRows([]); return; }
    setMissing(false);
    setRows((data ?? []) as Code[]);
  }, []);
  useEffect(() => { void load(); }, [load]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(f.value);
    const code = f.code.trim().toUpperCase().replace(/\s+/g, "");
    if (code.length < 3 || !(value > 0) || (f.kind === "percent" && value > 100)) return toast({ title: "Verifică codul și valoarea", description: "Codul are minim 3 caractere; procentul nu poate trece de 100.", variant: "destructive" });
    const { error } = await untypedDb.from("discount_codes").insert({
      code, kind: f.kind, value, min_order: Number(f.min_order) || 0,
      ends_at: f.ends_at ? new Date(`${f.ends_at}T23:59:59`).toISOString() : null,
      max_uses: f.max_uses ? Number(f.max_uses) : null,
    });
    if (error) return toast({ title: error.code === "23505" ? "Codul există deja" : "Nu am putut salva", variant: "destructive" });
    setF(EMPTY);
    toast({ title: "Cod creat" });
    void load();
  };
  const toggle = async (c: Code) => { await untypedDb.from("discount_codes").update({ active: !c.active }).eq("code", c.code); void load(); };
  const remove = async (c: Code) => { if (window.confirm(`Ștergi codul ${c.code}?`)) { await untypedDb.from("discount_codes").delete().eq("code", c.code); void load(); } };

  return (
    <div className="space-y-6">
      {missing && <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm">Tabelul de coduri nu există încă. Rulează migrarea <code>20251219000000_shop_features.sql</code> în Supabase.</p>}
      <Card>
        <CardHeader><CardTitle>Cod nou</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={create} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div><Label htmlFor="dc-code">Cod *</Label><Input id="dc-code" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="VARA10" className="uppercase" /></div>
            <div><Label htmlFor="dc-kind">Tip *</Label>
              <select id="dc-kind" value={f.kind} onChange={(e) => setF({ ...f, kind: e.target.value as Code["kind"] })} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="percent">Procent (%)</option><option value="fixed">Sumă fixă (RON)</option>
              </select></div>
            <div><Label htmlFor="dc-val">Valoare *</Label><Input id="dc-val" type="number" min={0} step="0.01" value={f.value} onChange={(e) => setF({ ...f, value: e.target.value })} /></div>
            <div><Label htmlFor="dc-min">Comandă minimă (RON)</Label><Input id="dc-min" type="number" min={0} value={f.min_order} onChange={(e) => setF({ ...f, min_order: e.target.value })} /></div>
            <div><Label htmlFor="dc-end">Valabil până la</Label><Input id="dc-end" type="date" value={f.ends_at} onChange={(e) => setF({ ...f, ends_at: e.target.value })} /></div>
            <div><Label htmlFor="dc-max">Utilizări maxime</Label><Input id="dc-max" type="number" min={1} value={f.max_uses} onChange={(e) => setF({ ...f, max_uses: e.target.value })} /></div>
            <div className="sm:col-span-2 lg:col-span-3"><Button type="submit">Creează codul</Button></div>
          </form>
        </CardContent>
      </Card>

      {rows === null && <p className="text-sm text-muted-foreground">Se încarcă…</p>}
      {rows?.length === 0 && !missing && <p className="text-sm text-muted-foreground">Nu ai coduri încă.</p>}
      <div className="space-y-2">
        {rows?.map((c) => (
          <div key={c.code} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm">
            <span className="font-mono font-bold">{c.code}</span>
            <span>{c.kind === "percent" ? `${c.value}%` : `${c.value} RON`}</span>
            {c.min_order > 0 && <span className="text-muted-foreground">min. {c.min_order} RON</span>}
            {c.ends_at && <span className="text-muted-foreground">până la {new Date(c.ends_at).toLocaleDateString("ro-RO")}</span>}
            <span className="text-muted-foreground">{c.used_count}{c.max_uses ? ` / ${c.max_uses}` : ""} utilizări</span>
            <span className="ml-auto flex gap-2">
              <Button size="sm" variant={c.active ? "outline" : "default"} onClick={() => toggle(c)}>{c.active ? "Dezactivează" : "Activează"}</Button>
              <Button size="icon" variant="ghost" onClick={() => remove(c)} aria-label={`Șterge ${c.code}`}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

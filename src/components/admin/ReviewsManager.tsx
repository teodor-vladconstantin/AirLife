"use client";
import { useCallback, useEffect, useState } from "react";
import { Check, Trash2, X } from "lucide-react";
import { untypedDb } from "@/lib/untypedDb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stars } from "@/components/shop/ProductReviews";
import { useToast } from "@/hooks/use-toast";

type Row = { id: string; product_id: string; author_name: string; rating: number; title: string | null; body: string; status: "pending" | "approved" | "rejected"; verified_purchase: boolean; created_at: string; products: { name: string } | null };
const FILTERS = [["pending", "În așteptare"], ["approved", "Aprobate"], ["rejected", "Respinse"]] as const;

export function ReviewsManager() {
  const { toast } = useToast();
  const [status, setStatus] = useState<Row["status"]>("pending");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [missing, setMissing] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await untypedDb.from("product_reviews").select("id,product_id,author_name,rating,title,body,status,verified_purchase,created_at,products(name)").eq("status", status).order("created_at", { ascending: false }).limit(100);
    if (error) { setMissing(true); setRows([]); return; }
    setMissing(false);
    setRows((data ?? []) as unknown as Row[]);
  }, [status]);
  useEffect(() => { void load(); }, [load]);

  const setTo = async (id: string, next: Row["status"]) => {
    const { error } = await untypedDb.from("product_reviews").update({ status: next }).eq("id", id);
    if (error) return toast({ title: "Nu am putut salva", variant: "destructive" });
    toast({ title: next === "approved" ? "Recenzie aprobată" : "Recenzie respinsă" });
    void load();
  };
  const remove = async (id: string) => {
    if (!window.confirm("Ștergi definitiv recenzia?")) return;
    const { error } = await untypedDb.from("product_reviews").delete().eq("id", id);
    if (error) return toast({ title: "Nu am putut șterge", variant: "destructive" });
    void load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(([k, label]) => <Button key={k} size="sm" variant={status === k ? "default" : "outline"} onClick={() => setStatus(k)}>{label}</Button>)}
      </div>
      {missing && <p className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm">Tabelul de recenzii nu există încă. Rulează migrarea <code>20251219000000_shop_features.sql</code> în Supabase.</p>}
      {rows === null && <p className="text-sm text-muted-foreground">Se încarcă…</p>}
      {rows?.length === 0 && !missing && <p className="text-sm text-muted-foreground">Nicio recenzie în această listă.</p>}
      {rows?.map((r) => (
        <Card key={r.id}>
          <CardContent className="space-y-2 pt-6">
            <div className="flex flex-wrap items-center gap-2"><Stars value={r.rating} /><span className="font-semibold">{r.author_name}</span><span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString("ro-RO")}</span>{r.verified_purchase && <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">achiziție verificată</span>}</div>
            <p className="text-xs text-muted-foreground">Produs: {r.products?.name ?? r.product_id}</p>
            {r.title && <p className="font-medium">{r.title}</p>}
            <p className="whitespace-pre-line text-sm">{r.body}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              {r.status !== "approved" && <Button size="sm" onClick={() => setTo(r.id, "approved")}><Check className="mr-1 h-4 w-4" />Aprobă</Button>}
              {r.status !== "rejected" && <Button size="sm" variant="outline" onClick={() => setTo(r.id, "rejected")}><X className="mr-1 h-4 w-4" />Respinge</Button>}
              <Button size="sm" variant="ghost" onClick={() => remove(r.id)} aria-label="Șterge recenzia"><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

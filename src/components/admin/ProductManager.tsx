"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { FilePick } from "@/components/admin/FilePick";
import { useConfirm } from "@/components/admin/confirm";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CATEGORIES_DATA } from "@/data/categoriesData";
import { slugify } from "@/lib/markdown";
import { salePricing } from "@/lib/pricing";
import { Plus, Trash2, Pencil, Search, X, EyeOff } from "lucide-react";

type Product = Tables<"products">;
const CATEGORY_NAMES = Object.values(CATEGORIES_DATA).map((c) => c.name);

interface Form {
  name: string; slug: string; sku: string; brand: string; category: string; description: string;
  price: string; sale_price: string; sale_ends_at: string; stock: string; hidden: boolean;
  image_url: string; gallery: string[]; features: string; specs: string;
}

const EMPTY: Form = {
  name: "", slug: "", sku: "", brand: "", category: CATEGORY_NAMES[0], description: "", price: "", sale_price: "",
  sale_ends_at: "", stock: "0", hidden: false, image_url: "", gallery: [], features: "", specs: "",
};

const toLocalInput = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 16) : "");

const toForm = (p: Product): Form => ({
  name: p.name, slug: p.slug ?? "", sku: p.sku ?? "", brand: p.brand ?? "", category: p.category, description: p.description,
  price: String(p.price), sale_price: p.sale_price == null ? "" : String(p.sale_price), sale_ends_at: toLocalInput(p.sale_ends_at),
  stock: String(p.stock ?? 0), hidden: p.hidden, image_url: p.image_url ?? "", gallery: p.gallery ?? [],
  features: Array.isArray(p.features) ? (p.features as string[]).join(", ") : "",
  specs: Object.entries((p.specs ?? {}) as Record<string, string>).map(([k, v]) => `${k}: ${v}`).join("\n"),
});

const parseSpecs = (t: string) =>
  Object.fromEntries(t.split("\n").map((l) => l.split(/:(.*)/s).map((x) => x.trim())).filter(([k, v]) => k && v));

export const ProductManager = () => {
  const { toast } = useToast();
  const [confirm, confirmDialog] = useConfirm();
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [limit, setLimit] = useState(50); // the catalog has hundreds of products: render them in steps
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [form, setForm] = useState<Form>(EMPTY);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) return toast({ title: "Eroare", description: "Nu s-au putut încărca produsele", variant: "destructive" });
    setProducts(data ?? []);
  }, [toast]);
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(
    () => products.filter((p) => (cat === "all" || p.category === cat) && (!q || `${p.name} ${p.sku ?? ""}`.toLowerCase().includes(q.toLowerCase()))),
    [products, q, cat],
  );

  const open = (p: Product | "new") => { setEditing(p); setForm(p === "new" ? EMPTY : toForm(p)); };
  const set = <K extends keyof Form>(k: K, v: Form[K]) => setForm((f) => ({ ...f, [k]: v }));

  const upload = async (file: File): Promise<string | null> => {
    const name = `products/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("media").upload(name, file);
    if (error) { toast({ title: "Eroare upload imagine", description: error.message, variant: "destructive" }); return null; }
    return supabase.storage.from("media").getPublicUrl(name).data.publicUrl;
  };
  const onMain = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setUploading(true); const url = await upload(f); setUploading(false);
    if (url) set("image_url", url);
  };
  const onGallery = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []); if (!files.length) return;
    setUploading(true);
    const urls: string[] = [];
    for (const f of files) { const u = await upload(f); if (u) urls.push(u); }
    setUploading(false);
    set("gallery", [...form.gallery, ...urls]);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = parseFloat(form.price);
    const sale = form.sale_price === "" ? null : parseFloat(form.sale_price);
    if (sale != null && sale >= price) return toast({ title: "Prețul redus trebuie să fie mai mic decât prețul normal", variant: "destructive" });
    if (!form.image_url && !form.hidden) return toast({ title: "Adaugă o imagine sau ascunde produsul", description: "Produsele fără imagine nu se afișează în magazin.", variant: "destructive" });
    let specs: Record<string, string> = {};
    try { specs = parseSpecs(form.specs); } catch { /* ignore */ }
    const row = {
      name: form.name.trim(), slug: form.slug.trim() || slugify(form.name), sku: form.sku.trim() || null, brand: form.brand.trim() || null,
      category: form.category, description: form.description, price, sale_price: sale,
      sale_ends_at: form.sale_ends_at ? new Date(form.sale_ends_at).toISOString() : null,
      stock: parseInt(form.stock) || 0, hidden: form.hidden, image_url: form.image_url || null, gallery: form.gallery,
      features: form.features.split(",").map((x) => x.trim()).filter(Boolean), specs,
    };
    setSaving(true);
    const { error } = editing === "new"
      ? await supabase.from("products").insert(row)
      : await supabase.from("products").update(row).eq("id", (editing as Product).id);
    setSaving(false);
    if (error) return toast({ title: "Eroare", description: error.message, variant: "destructive" });
    toast({ title: editing === "new" ? "Produs adăugat" : "Produs actualizat" });
    setEditing(null); load();
  };

  const remove = async (p: Product) => {
    if (!(await confirm({ title: `Ștergi definitiv „${p.name}”?`, description: "Nu se poate anula. Dacă vrei doar să nu se mai vadă în magazin, ascunde-l.", confirmLabel: "Șterge produsul", destructive: true }))) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast({ title: "Eroare", description: error.message, variant: "destructive" });
    toast({ title: "Produs șters" }); load();
  };

  const quickToggle = async (p: Product) => {
    const { error } = await supabase.from("products").update({ hidden: !p.hidden }).eq("id", p.id);
    if (error) return toast({ title: "Eroare", description: error.message, variant: "destructive" });
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <Input value={q} onChange={(e) => { setQ(e.target.value); setLimit(50); }} placeholder="Caută după nume sau SKU" className="pl-9" />
          </div>
          <Select value={cat} onValueChange={(v) => { setCat(v); setLimit(50); }}>
            <SelectTrigger className="w-full sm:w-56"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toate categoriile</SelectItem>
              {CATEGORY_NAMES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => open("new")}><Plus className="w-4 h-4 mr-2" />Produs nou</Button>
      </div>
      <p className="text-xs text-muted-foreground">{shown.length} din {products.length} produse. Produsele ascunse sau fără imagine nu apar în magazin.</p>

      <div className="grid grid-cols-1 gap-3">
        {shown.slice(0, limit).map((p) => {
          const { price, compare_at } = salePricing(p);
          return (
            <Card key={p.id} className={p.hidden ? "opacity-60" : ""}>
              <CardContent className="flex flex-wrap items-center gap-3 p-4 sm:flex-nowrap sm:gap-4">
                <div className="w-16 h-16 rounded bg-white border flex items-center justify-center flex-shrink-0">
                  {p.image_url ? <img src={p.image_url} alt="" className="max-h-full max-w-full object-contain" /> : <EyeOff className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="break-words font-semibold sm:truncate">{p.name}</p>
                  <p className="break-words text-xs text-muted-foreground">{p.category}{p.sku ? ` · ${p.sku}` : ""} · stoc {p.stock}</p>
                  <p className="text-sm mt-0.5">
                    <span className="font-semibold text-primary">{price} RON</span>
                    {compare_at && <span className="ml-2 line-through text-muted-foreground">{compare_at} RON</span>}
                    {p.hidden && <span className="ml-2 text-xs font-medium text-muted-foreground">ascuns</span>}
                  </p>
                </div>
                <div className="flex w-full items-center justify-end gap-1 sm:w-auto">
                  <Button size="icon" variant="ghost" title={p.hidden ? "Arată în magazin" : "Ascunde din magazin"} onClick={() => quickToggle(p)}><EyeOff className="w-4 h-4" /></Button>
                  <Button size="icon" variant="outline" title="Editează" onClick={() => open(p)}><Pencil className="w-4 h-4" /></Button>
                  <Button size="icon" variant="destructive" title="Șterge" onClick={() => remove(p)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      {shown.length > limit && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setLimit((n) => n + 50)}>Arată mai multe ({shown.length - limit} rămase)</Button>
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing === "new" ? "Produs nou" : "Editează produsul"}</DialogTitle></DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div className="space-y-2"><Label>Nume</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} required /></div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Categorie</Label>
                <Select value={form.category} onValueChange={(v) => set("category", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATEGORY_NAMES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2"><Label>Adresa URL (slug)</Label><Input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder={slugify(form.name) || "se generează din nume"} /></div>
              <div className="space-y-2"><Label>SKU</Label><Input value={form.sku} onChange={(e) => set("sku", e.target.value)} /></div>
              <div className="space-y-2"><Label>Brand</Label><Input value={form.brand} onChange={(e) => set("brand", e.target.value)} /></div>
            </div>
            <div className="space-y-2"><Label>Descriere</Label><Textarea rows={5} value={form.description} onChange={(e) => set("description", e.target.value)} required /></div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Preț (RON)</Label><Input type="number" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} required /></div>
              <div className="space-y-2"><Label>Preț redus (RON)</Label><Input type="number" step="0.01" value={form.sale_price} onChange={(e) => set("sale_price", e.target.value)} placeholder="gol = fără ofertă" /></div>
              <div className="space-y-2"><Label>Oferta se termină</Label><DateTimePicker value={form.sale_ends_at} onChange={(v) => set("sale_ends_at", v)} placeholder="Fără dată de sfârșit" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Stoc</Label><Input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} required /></div>
              <div className="flex items-center gap-3 pt-7"><Switch checked={form.hidden} onCheckedChange={(v) => set("hidden", v)} /><Label>Ascuns din magazin</Label></div>
            </div>
            <div className="space-y-2">
              <Label>Imagine principală</Label>
              <div><FilePick label="Alege imaginea" onChange={onMain} disabled={uploading} /></div>
              {form.image_url && (
                <div className="flex items-center gap-3">
                  <img src={form.image_url} alt="Imagine principală" className="h-24 rounded border bg-white p-1" />
                  <Input value={form.image_url} onChange={(e) => set("image_url", e.target.value)} />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label>Galerie (poți alege mai multe)</Label>
              <div><FilePick label="Adaugă poze în galerie" multiple onChange={onGallery} disabled={uploading} /></div>
              <div className="flex flex-wrap gap-2">
                {form.gallery.map((g, i) => (
                  <div key={g} className="relative">
                    <img src={g} alt={`Galerie ${i + 1}`} className="h-16 w-16 object-contain rounded border bg-white p-1" />
                    <button type="button" aria-label="Scoate poza" onClick={() => set("gallery", form.gallery.filter((x) => x !== g))} className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-0.5"><X className="w-3 h-3" /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2"><Label>Caracteristici (separate prin virgulă)</Label><Input value={form.features} onChange={(e) => set("features", e.target.value)} placeholder="Inverter, Wi-Fi, A++" /></div>
            <div className="space-y-2"><Label>Specificații (o linie pe rând, „Nume: valoare”)</Label><Textarea rows={4} value={form.specs} onChange={(e) => set("specs", e.target.value)} placeholder={"Putere: 2,6 kW\nZgomot: 22 dB"} /></div>
            {uploading && <p className="text-xs text-muted-foreground">Se încarcă imaginile...</p>}
            <Button type="submit" className="w-full" disabled={saving || uploading}>{saving ? "Se salvează..." : "Salvează"}</Button>
          </form>
        </DialogContent>
      </Dialog>
      {confirmDialog}
    </div>
  );
};

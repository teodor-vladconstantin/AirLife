"use client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "@/lib/router";
import type { User } from "@supabase/supabase-js";
import { Loader2, MapPin, Package, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { newId, readProfile, saveProfile, withDefault, type Profile, type SavedAddress } from "@/lib/account";

const EMPTY: SavedAddress = { id: "", label: "Acasă", name: "", phone: "", county: "", city: "", address: "", postalCode: "" };

const Account = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>({ name: "", phone: "", addresses: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState<SavedAddress | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { navigate("/auth"); return; }
      setUser(user);
      setProfile(readProfile(user));
      setLoading(false);
    });
  }, [navigate]);

  const persist = async (next: Profile, ok: string) => {
    setSaving(true);
    try {
      const u = await saveProfile(next);
      setUser(u);
      setProfile(readProfile(u));
      toast({ title: ok });
      return true;
    } catch {
      toast({ title: "Nu am putut salva", description: "Încearcă din nou.", variant: "destructive" });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const saveAddress = async () => {
    if (!editing) return;
    const a = editing;
    if (a.name.trim().length < 3 || a.phone.trim().length < 10 || a.county.trim().length < 2 || a.city.trim().length < 2 || a.address.trim().length < 5 || a.postalCode.trim().length < 5) {
      toast({ title: "Completează toate câmpurile adresei", variant: "destructive" });
      return;
    }
    const exists = profile.addresses.some((x) => x.id === a.id);
    let list = exists ? profile.addresses.map((x) => (x.id === a.id ? a : x)) : [...profile.addresses, { ...a, id: newId() }];
    if (!list.some((x) => x.isDefault)) list = withDefault(list, list[0].id);
    if (await persist({ ...profile, addresses: list }, "Adresă salvată")) setEditing(null);
  };

  const field = (k: keyof SavedAddress, label: string, ph = "") => (
    <div>
      <Label htmlFor={`a-${k}`}>{label}</Label>
      <Input id={`a-${k}`} value={String(editing?.[k] ?? "")} placeholder={ph} onChange={(e) => setEditing((p) => (p ? { ...p, [k]: e.target.value } : p))} />
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col"><Navbar />
        <main className="flex-1 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Se încarcă" /></main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-background py-8 md:py-12">
        <div className="container mx-auto max-w-3xl space-y-6 px-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contul meu</h1>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>

          <Link to="/my-orders" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/40">
            <Package className="h-5 w-5 text-primary" />
            <span className="flex-1"><span className="block font-semibold">Comenzile mele</span><span className="text-sm text-muted-foreground">Istoric, status și urmărire colet</span></span>
            <span aria-hidden>›</span>
          </Link>

          <Card>
            <CardHeader><CardTitle>Date personale</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="p-name">Nume complet</Label><Input id="p-name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Ex: Ion Popescu" /></div>
                <div><Label htmlFor="p-phone">Telefon</Label><Input id="p-phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="07xxxxxxxx" /></div>
              </div>
              <Button disabled={saving} onClick={() => persist(profile, "Date salvate")}>{saving ? "Se salvează…" : "Salvează"}</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Adrese de livrare</CardTitle>
              {!editing && <Button size="sm" variant="outline" onClick={() => setEditing({ ...EMPTY, name: profile.name, phone: profile.phone })}><Plus className="mr-1 h-4 w-4" /> Adaugă</Button>}
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.addresses.length === 0 && !editing && <p className="text-sm text-muted-foreground">Nu ai nicio adresă salvată. Adaugă una ca să finalizezi mai repede comenzile.</p>}
              {!editing && profile.addresses.map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1 text-sm">
                    <p className="font-semibold">{a.label} {a.isDefault && <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">Implicită</span>}</p>
                    <p>{a.name} · {a.phone}</p>
                    <p className="text-muted-foreground">{a.address}, {a.city}, {a.county}, {a.postalCode}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    {!a.isDefault && <Button size="icon" variant="ghost" aria-label="Setează ca implicită" onClick={() => persist({ ...profile, addresses: withDefault(profile.addresses, a.id) }, "Adresă implicită schimbată")}><Star className="h-4 w-4" /></Button>}
                    <Button size="icon" variant="ghost" aria-label="Modifică adresa" onClick={() => setEditing(a)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" aria-label="Șterge adresa" onClick={() => {
                      const rest = profile.addresses.filter((x) => x.id !== a.id);
                      persist({ ...profile, addresses: rest.length && !rest.some((x) => x.isDefault) ? withDefault(rest, rest[0].id) : rest }, "Adresă ștearsă");
                    }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
              {editing && (
                <div className="space-y-4 rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field("label", "Denumire adresă", "Acasă, Birou…")}
                    {field("name", "Nume destinatar")}
                    {field("phone", "Telefon")}
                    {field("postalCode", "Cod poștal")}
                    {field("county", "Județ")}
                    {field("city", "Oraș")}
                  </div>
                  {field("address", "Adresă (stradă, număr, bloc, apartament)")}
                  <div className="flex gap-2">
                    <Button disabled={saving} onClick={saveAddress}>{saving ? "Se salvează…" : "Salvează adresa"}</Button>
                    <Button variant="ghost" onClick={() => setEditing(null)}>Renunță</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}>Deconectare</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;

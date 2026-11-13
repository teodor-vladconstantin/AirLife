"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "@/lib/router";
import { useQuote } from "@/contexts/QuoteContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const RequestQuote = () => {
  const { items, total, submitQuote } = useQuote();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
  const [postalCode, setPostalCode] = useState("");

  useEffect(() => {
    if (items.length === 0) {
      toast({ title: "Coș gol", description: "Adaugă produse pentru a cere o ofertă." });
      navigate("/products");
    }
  }, [items]);

  const handleSubmit = async () => {
    if (!name || !email || !phone) {
      toast({ title: "Completează datele", description: "Completează nume, email și telefon.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitQuote({
        name,
        email,
        phone,
        notes,
        shipping_address: {
          address: address || undefined,
          city: city || undefined,
          county: county || undefined,
          postalCode: postalCode || undefined,
        },
      });
      if (res.error) throw res.error;
      // prefer showing the friendly order number (AL00000...) instead of UUID
      toast({ title: "Cerere trimisă", description: `Număr cerere: ${(res as { orderNumber?: string }).orderNumber || res.id}` });
      navigate(`/order-confirmation/${res.id}`);
    } catch (err: any) {
      console.error(err);
      toast({ title: "Eroare", description: err.message || "Nu s-a putut trimite cererea.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Cere ofertă</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Produse selectate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {items.map((it) => (
                  <div key={it.id} className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{it.name}</div>
                      <div className="text-muted-foreground">Cantitate: {it.quantity}</div>
                    </div>
                    <div className="font-semibold">{(it.price * it.quantity).toFixed(2)} RON</div>
                  </div>
                ))}

                <div className="pt-4 border-t flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{total.toFixed(2)} RON</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalii contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nume complet</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Telefon</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Observații (opțional)</label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Adresă de livrare (opțional)</label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Strada, număr, bloc, scara" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold mb-1">Oraș</label>
                  <Input value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Județ</label>
                  <Input value={county} onChange={(e) => setCounty(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Cod Poștal</label>
                <Input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
              </div>

              

              <div className="flex gap-2">
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Se trimite..." : "Trimite cerere"}
                </Button>
                <Button variant="ghost" onClick={() => navigate(-1)}>
                  Înapoi
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RequestQuote;

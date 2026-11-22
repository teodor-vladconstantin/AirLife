"use client";
import { useEffect, useRef, useState } from "react";
import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BtuTable } from "@/components/BtuTable";
import SEO from "@/components/SEO";
import { FaqSection } from "@/components/FaqSection";
import { faqSchema, authorSchema } from "@/lib/blogSchema";
import { bylineName } from "@/data/author";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calculator, ArrowRight, Send } from "lucide-react";
import { useTurnstile } from "@/components/Turnstile";
import { trackCalculatorBtu, trackLead, trackError } from "@/lib/analytics";
import { pickRecommended, type BtuProduct } from "@/lib/btu";

const SIZES = [9000, 12000, 18000, 24000, 36000];

// BTU is sized on room VOLUME: ~140 BTU/h per m³ (sources range 136-160), plus ~500 BTU per person beyond two and ~700 per heat-emitting appliance.
const BTU_PER_M3 = 140;
const estimate = (area: number, sun: number, height: number, people: number, appliances: number) => {
  const volume = area * height;
  const btu = volume * BTU_PER_M3 * sun + Math.max(people - 2, 0) * 500 + appliances * 700;
  return { volume, btu: Math.round(btu / 100) * 100, size: SIZES.find((s) => s >= btu * 0.95) ?? SIZES[SIZES.length - 1] };
};

const FAQS = [
  { q: "Cum se calculează BTU pentru aer condiționat?", a: "BTU se calculează după volumul camerei, nu după suprafață: înmulțești lungimea, lățimea și înălțimea (în metri) și obții metri cubi. Necesarul este de aproximativ 140 BTU pe metru cub, la care adaugi pentru soare, persoane și aparate electrice." },
  { q: "Ce BTU ai nevoie pentru 50 mc?", a: "O cameră de 50 mc (de exemplu 20 mp cu tavan de 2,5 m) are nevoie de aproximativ 7.000 BTU, deci un aparat de 9.000 BTU este suficient. La ultimul etaj sau cu ferestre mari spre sud, mergi la 12.000 BTU." },
  { q: "Ce BTU ai nevoie pentru 75 mc?", a: "O cameră de 75 mc (de exemplu 30 mp cu tavan de 2,5 m) are nevoie de aproximativ 10.500 BTU, deci alegi un aparat de 12.000 BTU. La ultimul etaj sau cu expunere intensă la soare, treci la 18.000 BTU." },
  { q: "Ce BTU ai nevoie pentru 125 mc?", a: "O cameră de 125 mc (de exemplu un living open-space de 50 mp cu tavan de 2,5 m) are nevoie de aproximativ 17.500 BTU, deci alegi un aparat de 18.000 BTU, sau 24.000 BTU dacă izolația e slabă ori camera e foarte însorită." },
  { q: "Ce se întâmplă dacă aparatul are prea mulți BTU?", a: "Un aparat prea mare pornește și se oprește des, nu dezumidifică bine și consumă mai mult. Un aparat inverter atenuează problema, dar supradimensionarea tot costă mai mult la achiziție și la montaj." },
  { q: "Ce se întâmplă dacă aparatul are prea puțini BTU?", a: "Aparatul lucrează aproape tot timpul la putere maximă în zilele caniculare, nu atinge temperatura setată și se uzează mai repede." },
  { q: "Cum se transformă BTU în kW?", a: "1 kW înseamnă aproximativ 3.412 BTU/h. Un aparat de 12.000 BTU are deci o putere de răcire de circa 3,5 kW." },
];

const GhidBtu = ({ products = [] }: { products?: BtuProduct[] }) => {
  const [area, setArea] = useState(25);
  const [sun, setSun] = useState(1);
  const [height, setHeight] = useState(2.5);
  const [people, setPeople] = useState(2);
  const [appliances, setAppliances] = useState(1);
  const r = estimate(area, sun, height, people, appliances);
  const num = (set: (n: number) => void) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => set(Number(e.target.value));
  const field = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";
  const recommended = pickRecommended(products, r.btu);

  // calculator_btu_used: after the visitor stops changing inputs for 1.5 s (skips the initial render, max 5 per page view).
  const mounted = useRef(false);
  const fired = useRef(0);
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (fired.current >= 5) return;
    const t = setTimeout(() => { fired.current += 1; trackCalculatorBtu({ volume_m3: r.volume, area_m2: area, btu_needed: r.btu, btu_recommended: r.size }); }, 1500);
    return () => clearTimeout(t);
  }, [area, sun, height, people, appliances]); // eslint-disable-line react-hooks/exhaustive-deps

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [honey, setHoney] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [tsToken, tsWidget, tsReset, tsOn] = useTurnstile();
  const submitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.trim().length < 6 && !email.includes("@")) { setStatus("error"); return; }
    if (tsOn && !tsToken) { setStatus("error"); return; }
    setStatus("sending");
    try {
      const res = await fetch("/api/btu-offer", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim(), email: email.trim(), areaM2: area, volumeM3: r.volume, btuNeeded: r.btu, btuRecommended: r.size, website: honey, token: tsToken }),
      });
      if (!res.ok) throw new Error(String(res.status));
      trackLead("btu_offer", "calculator-btu");
      setStatus("done");
    } catch (err) {
      trackError("btu_offer", (err as Error).message);
      setStatus("error");
      tsReset();
    }
  };

  const structuredData = {
    "@context": "https://schema.org", "@type": "Article",
    headline: "Ce BTU ai nevoie pentru aerul condiționat: calculator pe volum (metri cubi)",
    description: "Calculator BTU pe volum (metri cubi): află ce putere de aer condiționat îți trebuie pentru camera ta (9.000, 12.000, 18.000 sau 24.000 BTU).",
    author: authorSchema(), inLanguage: "ro-RO",
    publisher: { "@type": "Organization", name: "AirLife", logo: { "@type": "ImageObject", url: "https://airlife.ro/logo.png" } },
    datePublished: "2026-11-20", dateModified: "2026-11-20", mainEntityOfPage: "https://airlife.ro/ghid/ce-btu-aer-conditionat-buzau",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Ce BTU ai nevoie? Calculator pe volum (mc) | AirLife"
        description="Calculator BTU pentru aer condiționat, pe volum: 9.000 BTU pentru până la 65 mc, 12.000 pentru 65–85 mc, 18.000 pentru 85–130 mc. Ține cont de soare și locuitori."
        canonical="https://airlife.ro/ghid/ce-btu-aer-conditionat-buzau"
        ogType="article"
        structuredData={[structuredData, faqSchema(FAQS)]}
      />
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li><Link to="/" className="hover:text-primary transition-colors">Acasă</Link></li><li>/</li>
              <li className="text-foreground font-medium">Ghid BTU aer condiționat</li>
            </ol>
          </nav>

          <header className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-4"><BookOpen className="w-3.5 h-3.5" /> Ghid</div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Ce BTU ai nevoie pentru aerul condiționat?</h1>
            <p className="text-xs text-muted-foreground mb-4">{bylineName()} • actualizat 20 noiembrie 2026</p>
            <p className="text-lg text-foreground/90">
              <strong>BTU se calculează după volumul camerei, în metri cubi (lungime × lățime × înălțime), nu după suprafață: aproximativ 140 BTU pe metru cub. Până la 65 mc ajung 9.000 BTU, între 65 și 85 mc 12.000 BTU, între 85 și 130 mc 18.000 BTU, iar între 130 și 170 mc 24.000 BTU.</strong>{" "}
              Valorile sunt pentru expunere normală la soare; calculatorul de mai jos le ajustează pentru camera ta.
            </p>
          </header>

          <Card className="border-primary/30 mb-8">
            <CardContent className="p-6 md:p-8">
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-5"><Calculator className="w-5 h-5 text-primary" /> Calculator BTU</h2>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <label className="space-y-1"><span className="font-medium">Suprafața (mp)</span><input className={field} type="number" min={5} max={200} value={area} onChange={num((n) => setArea(Math.min(Math.max(n, 5), 200)))} /></label>
                <label className="space-y-1"><span className="font-medium">Înălțimea tavanului (m)</span><input className={field} type="number" min={2} max={5} step={0.1} value={height} onChange={num((n) => setHeight(Math.min(Math.max(n, 2), 5)))} /></label>
                <label className="space-y-1"><span className="font-medium">Expunere la soare</span>
                  <select className={field} value={sun} onChange={num(setSun)}>
                    <option value={0.9}>Nord / umbrită</option><option value={1}>Normală</option><option value={1.15}>Sud / vest, ferestre mari</option><option value={1.3}>Ultimul etaj / mansardă</option>
                  </select>
                </label>
                <label className="space-y-1"><span className="font-medium">Persoane în cameră</span><input className={field} type="number" min={1} max={20} value={people} onChange={num((n) => setPeople(Math.min(Math.max(n, 1), 20)))} /></label>
                <label className="space-y-1"><span className="font-medium">Aparate care degajă căldură (PC, TV, cuptor)</span><input className={field} type="number" min={0} max={10} value={appliances} onChange={num((n) => setAppliances(Math.min(Math.max(n, 0), 10)))} /></label>
              </div>
              <div className="mt-6 rounded-xl bg-primary/5 border border-primary/20 p-4" aria-live="polite">
                <p className="text-sm text-muted-foreground">Volum: <strong>{r.volume.toLocaleString("ro-RO", { maximumFractionDigits: 1 })} mc</strong> • Necesar estimat: <strong>{r.btu.toLocaleString("ro-RO")} BTU</strong></p>
                <p className="text-xl font-bold text-foreground">Recomandare: aparat de {r.size.toLocaleString("ro-RO")} BTU</p>
              </div>
              {recommended.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-base font-bold text-foreground mb-3">Aparate potrivite din stoc</h3>
                  <div className="grid sm:grid-cols-3 gap-3">
                    {recommended.map((p) => (
                      <Link key={p.path} to={`/products/${p.path}`} className="rounded-xl border border-border p-3 hover:border-primary transition-colors text-center">
                        <img src={p.image} alt={p.name} loading="lazy" className="h-28 w-full object-contain mb-2" />
                        <span className="block text-sm font-semibold text-foreground leading-snug">{p.name}</span>
                        <span className="block text-primary font-bold mt-1">{p.price.toFixed(0)} RON</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <form onSubmit={submitOffer} className="mt-6 rounded-xl border border-border p-4 space-y-3">
                <h3 className="text-base font-bold text-foreground">Primește oferta</h3>
                {status === "done" ? (
                  <p className="text-sm text-primary font-medium" role="status">Mulțumim! Te contactăm în cel mai scurt timp{email ? " și ți-am trimis și un email cu recomandarea" : ""}.</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">Lasă telefonul sau emailul și îți trimitem oferta pentru un aparat de {r.size.toLocaleString("ro-RO")} BTU, cu montaj.</p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input className={field} type="tel" autoComplete="tel" placeholder="Telefon" aria-label="Telefon" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      <input className={field} type="email" autoComplete="email" placeholder="Email" aria-label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <input type="text" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={honey} onChange={(e) => setHoney(e.target.value)} />
                    {tsWidget}
                    {status === "error" && <p className="text-sm text-destructive" role="alert">Completează telefonul sau emailul (și verificarea anti-spam), apoi încearcă din nou.</p>}
                    <Button type="submit" disabled={status === "sending"} className="flex items-center gap-2"><Send className="w-4 h-4" /> {status === "sending" ? "Se trimite..." : "Primește oferta"}</Button>
                    <p className="text-xs text-muted-foreground">Folosim datele doar ca să îți trimitem oferta. Detalii în <Link to="/politica-de-confidentialitate" className="underline">Politica de confidențialitate</Link>.</p>
                  </>
                )}
              </form>
              <p className="text-xs text-muted-foreground mt-3">Estimare orientativă. Pentru spații cu izolație slabă sau cu mai multe încăperi, cere o ofertă personalizată.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link to="/aer-conditionat"><Button className="flex items-center gap-2">Vezi aparatele <ArrowRight className="w-4 h-4" /></Button></Link>
                <Link to="/contact"><Button variant="outline">Cere ofertă</Button></Link>
              </div>
            </CardContent>
          </Card>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Tabel BTU pe volum</h2>
            <BtuTable />
          </section>

          <section className="space-y-3 mb-8 text-sm text-muted-foreground">
            <h2 className="text-2xl font-bold text-foreground">Ce mărește necesarul de BTU</h2>
            <ul className="space-y-2">
              <li>• <strong>Ferestre mari spre sud sau vest:</strong> aportul solar poate adăuga 10–15% la necesar.</li>
              <li>• <strong>Ultimul etaj sau mansardă:</strong> acoperișul încălzit adaugă până la 30%.</li>
              <li>• <strong>Tavan peste 2,5 m:</strong> volumul de aer de răcit crește proporțional, deci la aceeași suprafață necesarul de BTU crește.</li>
              <li>• <strong>Mai mult de două persoane și aparate electrice:</strong> adaugă aproximativ 500 BTU pentru fiecare persoană în plus față de două și circa 700 BTU pentru fiecare aparat care degajă căldură.</li>
            </ul>
            <p>Un aparat inverter se potrivește mai bine cu putere ușor mare decât cu putere mică, pentru că își reglează singur turația. Vezi și <Link to="/ghid/cost-montaj-aer-conditionat-buzau" className="text-primary font-semibold hover:underline">cât costă montajul</Link> și <Link to="/aer-conditionat-buzau" className="text-primary font-semibold hover:underline">serviciile din Buzău</Link>.</p>
          </section>

          <FaqSection title="Întrebări frecvente" faq={FAQS} />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default GhidBtu;

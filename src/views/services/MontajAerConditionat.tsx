"use client";
import { useState } from "react";
import { faqSchema } from "@/lib/blogSchema";
import { submitRequest } from "@/lib/requests";
import { useTurnstile } from "@/components/Turnstile";
import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { AREA_SERVED, FGAS_TEXT, SERVICE_COVERAGE } from "@/data/localSeo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Wrench,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  HelpCircle,
  PhoneCall,
  Calendar,
  AlertCircle,
  FileCheck,
} from "lucide-react";
import { trackServiceQuoteRequest, trackClickToCall } from "@/lib/analytics";

const FAQS = [
  {
    "q": "De ce este obligatorie vidarea cu pompă de vid?",
    "a": "Vidarea îndepărtează aerul și umiditatea din țevile de cupru înainte de a deschide freonul. Fără vidare, umiditatea poate reacționa cu uleiul din compresor, ducând la acidifiere și defectarea prematură a compresorului."
  },
  {
    "q": "Cât durează un montaj tipic?",
    "a": "O instalare standard durează între 2 și 3,5 ore, în funcție de grosimea peretelui și traseul frigorific."
  },
  {
    "q": "Asigurați și accesorii HVAC dacă lipsesc din pachet?",
    "a": "Da, prin magazinul nostru online punem la dispoziție console, suporturi cu amortizoare, trasee frigorifice și soluții de drenaj condens."
  },
  {
    "q": SERVICE_COVERAGE.montaj.q,
    "a": SERVICE_COVERAGE.montaj.a
  }
];

const MontajAerConditionat = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tsToken, tsWidget, tsReset, tsOn] = useTurnstile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      toast({
        title: "Câmpuri obligatorii",
        description: "Vă rugăm să introduceți numele și numărul de telefon.",
        variant: "destructive",
      });
      return;
    }

    if (tsOn && !tsToken) {
      toast({ title: "Confirmă că ești om", description: "Așteaptă verificarea de sub formular și încearcă din nou.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
    submitRequest("Montaj Aer Condiționat", { name, phone, details: `Localitate: ${location || "-"}. ${details}` }, tsToken)
      .then(() => {
        trackServiceQuoteRequest("Montaj Aer Condiționat");
        toast({
          title: "Cerere trimisă cu succes!",
          description: "Vă vom contacta în cel mai scurt timp pentru confirmarea detaliilor și a programării.",
        });
        setName("");
        setPhone("");
        setLocation("");
        setDetails("");
      })
      .catch(() => toast({ title: "Eroare", description: "Cererea nu a putut fi trimisă. Sună-ne la +40 722 15 35 25.", variant: "destructive" }))
      .finally(() => { setIsSubmitting(false); tsReset(); });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": "https://airlife.ro/servicii/montaj-aer-conditionat-buzau#service",
    "url": "https://airlife.ro/servicii/montaj-aer-conditionat-buzau",
    "name": "Montaj Aer Condiționat",
    "serviceType": "Instalare Sisteme de Climatizare",
    "provider": { "@id": "https://airlife.ro/#localbusiness" },
    "areaServed": AREA_SERVED,
    "description": "Serviciu autorizat de instalare aer condiționat. Include fixare console, perforare perete, vidare traseu frigorific și probe funcționale."
  };

  const breadcrumbsData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Acasă",
        "item": "https://airlife.ro/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Servicii",
        "item": "https://airlife.ro/servicii"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Montaj Aer Condiționat",
        "item": "https://airlife.ro/servicii/montaj-aer-conditionat-buzau"
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Montaj Aer Condiționat Buzău | Instalare cu Vidare | AirLife"
        description="Montaj aer condiționat în Buzău și tot județul: instalare curată, vidare cu pompă de vid, materiale de calitate și probă completă de funcționare."
        canonical="https://airlife.ro/servicii/montaj-aer-conditionat-buzau"
        structuredData={[structuredData, breadcrumbsData, faqSchema(FAQS)]}
      />

      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Acasă</Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">Montaj Aer Condiționat</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" /> Buzău și tot județul
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Montaj Aer Condiționat Buzău
            </h1>
            <p className="lead text-lg text-muted-foreground leading-relaxed">
              Montajul de aer condiționat în Buzău include fixarea unităților, traseul frigorific, vidarea cu pompă de vid și proba completă de funcționare. Lucrăm cu echipa proprie sau parteneri, în municipiul Buzău și în tot județul, cu respectarea normelor producătorului pentru păstrarea garanției.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
              <ShieldCheck className="w-4 h-4" /> {FGAS_TEXT}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Ce include montajul */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Wrench className="w-6 h-6 text-primary" />
                  Ce include serviciul standard de montaj
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Cum se montează unitatea interioară?</h3>
                    <p>Amplasăm și fixăm unitatea interioară pe perete, conform cerințelor de circulație a aerului.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Ce perforări se fac în perete?</h3>
                    <p>O perforare în peretele exterior (cărămidă, BCA sau beton uzual) pentru trecerea traseului frigorific.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Cum se fixează unitatea exterioară?</h3>
                    <p>Instalăm consola suport și prindem rigid unitatea pe peretele exterior, într-un loc accesibil.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Cum se conectează traseul frigorific și drenajul?</h3>
                    <p>Conectăm traseul frigorific și drenajul de condens, izolate termic corespunzător.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Ce se face înainte de punerea în funcțiune?</h3>
                    <p>Vidăm instalația cu pompă de vid, ca să eliminăm umiditatea și aerul rezidual din traseu. Motivele sunt explicate în întrebările frecvente.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Ce probe se fac la final?</h3>
                    <p>Probe complete de funcționare (răcire și încălzire), verificarea etanșeității și instruirea clientului pentru utilizare.</p>
                  </div>
                </div>
              </section>

              {/* Tabele pentru motoare de răspuns (AEO/GEO) */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm space-y-4">
                <h2 className="text-2xl font-bold text-foreground">Ce BTU alegi pentru montaj în Buzău</h2>
                <p className="text-muted-foreground">
                  Capacitatea se alege după volumul camerei, în metri cubi: până la 65 mc ajung 9.000 BTU, între 65 și 85 mc 12.000 BTU, între 85 și 130 mc 18.000 BTU.
                  Vezi tabelul complet și calculatorul în <Link to="/ghid/ce-btu-aer-conditionat-buzau" className="text-primary font-semibold hover:underline">ghidul despre BTU</Link>.
                </p>
              </section>

              {/* Cum funcționează procesul */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Cum decurge procesul de programare și execuție
                </h2>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <span className="text-primary font-bold text-lg block mb-1">Pasul 1</span>
                    <strong className="block text-foreground mb-1">Cerere &amp; Detalii</strong>
                    <span className="text-muted-foreground">Ne trimiți solicitarea online sau telefonic cu modelul aparatului și etajul locuinței.</span>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <span className="text-primary font-bold text-lg block mb-1">Pasul 2</span>
                    <strong className="block text-foreground mb-1">Stabilire Dată</strong>
                    <span className="text-muted-foreground">Convenim de comun acord data și intervalul orar pentru intervenție.</span>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <span className="text-primary font-bold text-lg block mb-1">Pasul 3</span>
                    <strong className="block text-foreground mb-1">Montaj &amp; Probă</strong>
                    <span className="text-muted-foreground">Efectuăm montajul curat, vidăm instalația, testăm parametrii și lăsăm spațiul curat.</span>
                  </div>
                </div>
              </section>

              {/* Ce afectează prețul */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-primary" />
                  Ce factori influențează costul montajului
                </h2>
                <p className="text-muted-foreground mb-4">
                  Prețul final depinde de aparat și de instalare. O instalare standard acoperă majoritatea apartamentelor de bloc, însă costul poate varia în funcție de:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li><strong>Capacitatea aparatului:</strong> 9.000 – 12.000 BTU vs. 18.000 – 24.000 BTU (care necesită traseu frigorific cu diametru mai mare).</li>
                  <li><strong>Lungimea traseului frigorific:</strong> dacă distanța dintre unitatea interioară și cea exterioară depășește kitul standard (de regulă 3 metri liniari).</li>
                  <li><strong>Perforări suplimentare</strong> sau carotare în grinzi / pereți din beton armat gros.</li>
                  <li><strong>Accesibilitatea unității exterioare:</strong> montaj la înălțime sau în poziții care necesită echipamente speciale de siguranță.</li>
                </ul>
              </section>

              {/* Ce trebuie să pregătească clientul */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-primary" />
                  Ce trebuie să pregătești înainte de sosirea noastră
                </h2>
                <p className="text-muted-foreground mb-3">Pentru ca montajul să se desfășoare eficient:</p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Eliberează zona de sub locul unde va fi instalată unitatea internă (mutați sau acoperiți mobilierul textil sensibil).</li>
                  <li>Asigură acces la o priză funcțională de 220V în apropiere pentru sculele de lucru și alimentarea aparatului.</li>
                  <li>Verifică permisiunea de acces pe balcon sau fațadă (acord asociație de proprietari dacă este cazul).</li>
                </ul>
              </section>

              {/* Zona deservită & Garanție */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  Arie de acoperire și garanția lucrării
                </h2>
                <p className="text-muted-foreground mb-3">
                  Montăm cu echipa AirLife sau parteneri în municipiul Buzău și în tot județul: Râmnicu Sărat, Nehoiu, Pogoanele, Mărăcineni, Vernești, Țintești, Săgeata și comunele din jur. Aparatele și accesoriile le livrăm în toată țara. <Link to="/aer-conditionat-buzau" className="text-primary font-semibold hover:underline">Vezi zona de acoperire în Buzău</Link>.
                </p>
                <p className="text-muted-foreground">
                  Lucrările de montaj beneficiază de garanție de execuție, iar aparatul tău își păstrează garanția legală de la producător mulțumită vidării corecte și respectării fișei tehnice.
                </p>
              </section>

              {/* FAQ */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-primary" />
                  Întrebări frecvente despre montaj
                </h2>
                <div className="space-y-4">
                  {FAQS.map((f) => (
                    <div key={f.q}>
                      <h3 className="font-semibold text-foreground">{f.q}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{f.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar / Appointment Form */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <Card className="border-primary/30 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Cere o programare
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Completează datele și te contactăm pentru stabilirea datei și estimarea exactă a costului.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">Nume și Prenume *</label>
                      <Input
                        required
                        placeholder="ex. Ion Popescu"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">Număr de Telefon *</label>
                      <Input
                        required
                        type="tel"
                        placeholder="ex. 07xxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">Localitate</label>
                      <Input
                        placeholder="ex. Buzău, Micro 14"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">Detalii (model AC, etaj, cerințe)</label>
                      <Textarea
                        rows={3}
                        placeholder="ex. Aparat 12000 BTU, etaj 2, doresc și suport antivibrant"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                      />
                    </div>

                    {tsWidget}

                    <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
                      {isSubmitting ? "Se trimite..." : "Solicită Programare"}
                    </Button>
                  </form>

                  <div className="mt-6 pt-4 border-t border-border text-center">
                    <span className="text-xs text-muted-foreground block mb-2">Preferi să vorbești direct?</span>
                    <a
                      href="tel:+40722153525"
                      onClick={() => trackClickToCall("Montaj Sidebar")}
                      className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-sm"
                    >
                      <PhoneCall className="w-4 h-4" /> Solicită Asistență Telefonică
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Cross-linking to Ecommerce */}
              <Card className="bg-secondary/30">
                <CardContent className="p-5 text-sm space-y-3">
                  <h4 className="font-semibold text-foreground">Cauți un aparat de montat?</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Alege-l din magazinul nostru. Îl livrăm prin curier, iar montajul îl programăm tot noi.
                  </p>
                  <Link to="/aer-conditionat" className="text-primary font-semibold text-xs inline-block hover:underline">
                    Vezi aparatele de aer condiționat &rarr;
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MontajAerConditionat;

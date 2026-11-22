"use client";
import { useState } from "react";
import { faqSchema } from "@/lib/blogSchema";
import { submitRequest } from "@/lib/requests";
import { useTurnstile } from "@/components/Turnstile";
import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { AREA_SERVED, SERVICE_COVERAGE } from "@/data/localSeo";
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
  AlertOctagon,
  Gauge,
} from "lucide-react";
import { trackServiceQuoteRequest, trackClickToCall } from "@/lib/analytics";

const FAQS = [
  {
    "q": "Cât costă o constatare?",
    "a": "Deplasarea și constatarea tehnică au un tarif fix. Dacă decizi să efectuezi reparația cu noi, valoarea constatării se poate deduce parțial sau integral din costul final al manoperei."
  },
  {
    "q": "Ce mărci de aparate reparați?",
    "a": "Deservim majoritatea mărcilor de pe piață: Daikin, Gree, Midea, Mitsubishi, Cooper&Hunter, Yamato, Vortex, Beko, Whirlpool, LG, Samsung și altele."
  },
  {
    "q": SERVICE_COVERAGE.service.q,
    "a": SERVICE_COVERAGE.service.a
  }
];

const ServiceAerConditionat = () => {
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
    submitRequest("Service Aer Conditionat", { name, phone, details: `Localitate: ${location || "-"}. ${details}` }, tsToken)
      .then(() => {
        trackServiceQuoteRequest("Service Aer Conditionat");
        toast({
          title: "Solicitare service recepționată!",
          description: "Un tehnician vă va contacta pentru diagnosticare și stabilirea intervenției.",
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
    "@id": "https://airlife.ro/servicii/service-aer-conditionat-buzau#service",
    "url": "https://airlife.ro/servicii/service-aer-conditionat-buzau",
    "name": "Service Aer Condiționat",
    "serviceType": "Reparații și Mentenanță Climatizare",
    "provider": { "@id": "https://airlife.ro/#localbusiness" },
    "areaServed": AREA_SERVED,
    "description": "Diagnosticare și reparații sisteme de aer condiționat: remediere pierderi freon, completare agent frigorific, înlocuire condensatori, remediere scurgeri de apă și erori electronice."
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
        "name": "Service Aer Condiționat",
        "item": "https://airlife.ro/servicii/service-aer-conditionat-buzau"
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Service Aer Condiționat Buzău | Reparații și Freon | AirLife"
        description="Service aer condiționat în Buzău și județ: diagnosticare, verificare freon, remediere scurgeri de apă și înlocuire componente defecte."
        canonical="https://airlife.ro/servicii/service-aer-conditionat-buzau"
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
              <li className="text-foreground font-medium">Service Aer Condiționat</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" /> Buzău și tot județul
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Service Aer Condiționat Buzău
            </h1>
            <p className="lead text-lg text-muted-foreground leading-relaxed">
              Service de aer condiționat în Buzău: diagnosticare, identificare pierderi de freon, remedierea scurgerilor de apă, înlocuire de condensatori și senzori, interpretare coduri de eroare. Intervenim cu echipa proprie sau parteneri în municipiul Buzău și în tot județul.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Defecțiuni comune */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <AlertOctagon className="w-6 h-6 text-primary" />
                  Defecțiuni frecvente pe care le remediem
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">De ce aparatul suflă aer, dar nu răcește?</h3>
                    <p>De regulă din cauza unei pierderi de freon, a unui condensator de pornire defect sau a unui compresor blocat.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">De ce picură sau curge apă din unitatea interioară?</h3>
                    <p>Cauzele frecvente sunt furtunul de evacuare a condensului înfundat, tăvița fisurată sau un montaj fără pantă adecvată.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Ce înseamnă codurile de eroare de pe afișaj (E1, E4, EC, F0)?</h3>
                    <p>Codurile diferă de la un producător la altul. Le citim și le interpretăm pentru depanarea plăcii electronice sau a senzorilor.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">De ce face unitatea exterioară vibrații sau zgomote puternice?</h3>
                    <p>Din cauza unei elice deformate, a unor rulmenți uzați sau a lipsei amortizoarelor de vibrații dintre unitate și console.</p>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">Ce înseamnă gheața de pe conducte sau de pe vaporizator?</h3>
                    <p>E un semn clar de scădere a presiunii agentului frigorific sau de debit de aer strangulat.</p>
                  </div>
                </div>
              </section>

              {/* Ce include diagnosticarea */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Gauge className="w-6 h-6 text-primary" />
                  Ce presupune o constatare tehnică la fața locului
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <strong className="block text-foreground mb-1">Măsurare presiuni de lucru</strong>
                    <span className="text-muted-foreground">Conectăm manometrele digitale pentru a verifica presiunea de evaporare și condensare (R32 / R410A).</span>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <strong className="block text-foreground mb-1">Testare etanșeitate traseu</strong>
                    <span className="text-muted-foreground">Localizăm micro-fisurile sau pierderile la îmbinările holenderelor cu detector electronic de scurgeri.</span>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <strong className="block text-foreground mb-1">Verificare componente electrice</strong>
                    <span className="text-muted-foreground">Testăm tensiunea de alimentare, condensatorul de capacitate, siguranțele și senzorii de temperatură.</span>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50">
                    <strong className="block text-foreground mb-1">Deviz clar înainte de execuție</strong>
                    <span className="text-muted-foreground">Îți comunicăm costul total al pieselor și manoperei. Reparația începe numai după acordul tău.</span>
                  </div>
                </div>
              </section>

              {/* Încărcare cu freon: realitate vs mit */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  Politica noastră: Fără încărcare oarbă cu freon!
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Sistemul frigorific al unui aer condiționat este un circuit închis ermetic. Freonul nu „se consumă” și nu „expiră”. Dacă aparatul tău nu mai are agent frigorific, înseamnă că există o neetanșeitate sau o pierdere.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Completarea cu freon fără remedierea pierderii duce inevitabil la o nouă descărcare în câteva săptămâni. De aceea, la AirLife identificăm și reetanșăm întotdeauna traseul înainte de vidare și recântărirea agentului frigorific conform specificațiilor de pe eticheta aparatului.
                </p>
              </section>

              {/* Zona deservită */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Timp de răspuns și arie de operare
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Intervenim în municipiul Buzău și în tot județul Buzău, cu echipa AirLife sau parteneri. În perioadele caniculare, programările se fac în ordinea recepționării solicitărilor, acordând prioritate urgențelor medicale sau spațiilor comerciale sensibile. <Link to="/aer-conditionat-buzau" className="text-primary font-semibold hover:underline">Vezi zona de acoperire în Buzău</Link>.
                </p>
              </section>

              {/* FAQ */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-primary" />
                  Întrebări frecvente despre service
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

            {/* Sidebar / Form */}
            <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <Card className="border-primary/30 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Solicită Service
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Descrie problema pe scurt și un specialist te va contacta pentru o evaluare rapidă.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">Nume și Prenume *</label>
                      <Input
                        required
                        placeholder="ex. George Radu"
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
                      <label className="text-xs font-semibold text-foreground block mb-1">Locație (Adresă / Cartier)</label>
                      <Input
                        placeholder="ex. Buzău, Micro 14"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">Simptom defecțiune (ce se întâmplă?)</label>
                      <Textarea
                        rows={3}
                        placeholder="ex. Aparatul pornește dar nu dă aer rece, pe afișaj apare E3"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                      />
                    </div>

                    {tsWidget}

                    <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
                      {isSubmitting ? "Se trimite..." : "Cere Intervenție Service"}
                    </Button>
                  </form>

                  <div className="mt-6 pt-4 border-t border-border text-center">
                    <span className="text-xs text-muted-foreground block mb-2">Problemă urgentă?</span>
                    <a
                      href="tel:+40722153525"
                      onClick={() => trackClickToCall("Service Sidebar")}
                      className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-sm"
                    >
                      <PhoneCall className="w-4 h-4" /> Sună pentru Programare
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Cross-link to accessories and consumables */}
              <Card className="bg-secondary/30">
                <CardContent className="p-5 text-sm space-y-3">
                  <h4 className="font-semibold text-foreground">Aparatul e prea vechi pentru reparat?</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Uneori un aparat nou costă mai puțin decât repararea. Compară în magazin, iar noi îl montăm.
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

export default ServiceAerConditionat;

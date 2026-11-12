import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Sparkles,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
  HelpCircle,
  PhoneCall,
  Calendar,
  AlertTriangle,
  HeartPulse,
} from "lucide-react";
import { trackServiceQuoteRequest, trackClickToCall } from "@/lib/analytics";

const IgienizareAerConditionatBuzau = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);
    trackServiceQuoteRequest("Igienizare Aer Conditionat Buzau");

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Cerere trimisă cu succes!",
        description: "Vă vom contacta în scurt timp pentru stabilirea datei de igienizare.",
      });
      setName("");
      setPhone("");
      setLocation("");
      setDetails("");
    }, 600);
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Igienizare Aer Condiționat",
    "serviceType": "Curățare și Dezinfectare Climatizare",
    "provider": {
      "@type": "HVACBusiness",
      "name": "AirLife",
      "url": "https://airlife.ro",
      "areaServed": {
        "@type": "City",
        "name": "Buzău"
      }
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Buzău"
      },
      {
        "@type": "AdministrativeArea",
        "name": "Județul Buzău"
      }
    ],
    "description": "Serviciu profesional de igienizare și dezinfectare a aparatelor de aer condiționat. Curățare vaporizator, turbină de ventilație, tăviță condens și tratament biocid autorizat.",
    "offers": {
      "@type": "Offer",
      "priceCurrency": "RON",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "priceType": "https://schema.org/StartingAtPrice",
        "description": "Prețul depinde de numărul de aparate și starea de contaminare a unității."
      }
    }
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
        "name": "Igienizare Aer Condiționat",
        "item": "https://airlife.ro/servicii/igienizare-aer-conditionat"
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Igienizare Aer Condiționat | Curățare Profesională & Dezinfectare AirLife"
        description="Igienizare profesională aer condiționat. Curățare profundă a vaporizatorului, turbinei și tăviței de condens. Eliminare mirosuri, bacterii și mucegai cu soluții avizate."
        canonical="https://airlife.ro/servicii/igienizare-aer-conditionat"
        structuredData={[structuredData, breadcrumbsData]}
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
              <li className="text-foreground font-medium">Igienizare Aer Condiționat</li>
            </ol>
          </nav>

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" /> Serviciu de igienizare și județ
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Igienizare &amp; Curățare Aer Condiționat
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Respiră aer curat și proaspăt. Îndepărtăm praful acumulat, mucegaiul, ciupercile microscopice și bacteriile
              din interiorul unității de aer condiționat folosind husă specială de protecție și soluții profesionale.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* De ce este vitală igienizarea */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <HeartPulse className="w-6 h-6 text-primary" />
                  De ce este esențială curățarea periodică a aparatului
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  În timpul funcționării pe modul de răcire, vaporizatorul unității interne acumulează condens continuu. Umiditatea combinată cu particulele fine de praf creează mediul optim pentru dezvoltarea coloniilor de mucegai și bacterii (inclusiv specia Legionella), care sunt recirculate în încăpere de fiecare dată când pornești aparatul.
                </p>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 text-sm">
                    <strong className="block text-foreground mb-1 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> Semne că ai nevoie de igienizare:
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs mt-2">
                      <li>Miros neplăcut la pornirea aparatului</li>
                      <li>Flux de aer scăzut, deși turația e maximă</li>
                      <li>Strănut, alergii sau iritații oculare în cameră</li>
                      <li>Consum crescut de curent electric</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border/50 text-sm">
                    <strong className="block text-foreground mb-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-primary" /> Beneficiile igienizării complete:
                    </strong>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs mt-2">
                      <li>Aer sănătos și curat pentru întreaga familie</li>
                      <li>Eficiență termică restabilită</li>
                      <li>Reducerea zgomotului produs de turbină</li>
                      <li>Durată de viață prelungită a compresorului</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Ce include procesul */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-primary" />
                  Ce include serviciul de igienizare profesională
                </h2>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Demontarea măștii frontale și a filtrelor:</strong> spălarea și dezinfectarea minuțioasă a filtrelor de aer.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Instalarea husei de protecție pentru pereți și mobilier:</strong> apa și soluțiile reziduale sunt colectate direct în recipient dedicat, fără a murdări spațiul.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Curățarea profundă a fagurelui vaporizatorului:</strong> pulverizare sub presiune cu detergenți speciali degresanți și dezinfectanți.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Spălarea turbinei de ventilație:</strong> îndepărtarea crustei de praf aderent de pe palele ventilatorului.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Curățarea și deblocarea tăviței de condens:</strong> prevenirea revărsării apei și eliminarea depunerilor vâscoase.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Tratament antibacterian final &amp; parfumare proaspătă:</strong> aplicarea unui film protector cu remanență împotriva bacteriilor.</span>
                  </div>
                </div>
              </section>

              {/* Cât de des trebuie făcută */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
                  <Clock className="w-6 h-6 text-primary" />
                  Cât de des este recomandată igienizarea
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Pentru locuințele rezidențiale, recomandăm igienizarea <strong>cel puțin o dată pe an</strong>, ideal primăvara înainte de începerea sezonului cald sau toamna dacă aparatul este folosit și pentru încălzire. În spații comerciale, birouri sau cabinete medicale, igienizarea se recomandă semestrial.
                </p>
              </section>

              {/* Zona deservită */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  Acoperire locală în județul
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ne deplasăm operativ în tot orașul Buzău (Micro 3, Micro 5, Micro 14, Dorobanți, Centru, Broșteni, Orizont) și în localitățile limitrofe. Intervenția durează între 45 și 75 de minute per aparat.
                </p>
              </section>

              {/* FAQ */}
              <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-primary" />
                  Întrebări frecvente despre igienizare
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Riscă să se murdărească peretele sau parchetul?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Nu. Folosim o husă etanșă cu drenaj impermeabil montată direct sub unitatea internă, care conduce lichidul spălat direct într-un recipient special.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Soluțiile folosite sunt toxice pentru animale sau copii?</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Folosim soluții profesionale biodegradabile avizate pentru climatizare. După clătire și uscare, aparatul este gata de utilizare în deplină siguranță.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar / Form */}
            <div className="space-y-6">
              <Card className="sticky top-24 border-primary/30 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-foreground flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Programează o igienizare
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Completează formularul pentru o igienizare rapidă și eficientă a aparatului tău.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">Nume și Prenume *</label>
                      <Input
                        required
                        placeholder="ex. Elena Ionescu"
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
                      <label className="text-xs font-semibold text-foreground block mb-1">Adresă / Cartier</label>
                      <Input
                        placeholder="ex. Buzău, Str. Unirii"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">Număr de aparate și observații</label>
                      <Textarea
                        rows={3}
                        placeholder="ex. 1 aparat living, miroase ușor la pornire"
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                      />
                    </div>

                    <Button type="submit" disabled={isSubmitting} className="w-full mt-2">
                      {isSubmitting ? "Se trimite..." : "Solicită Programare"}
                    </Button>
                  </form>

                  <div className="mt-6 pt-4 border-t border-border text-center">
                    <span className="text-xs text-muted-foreground block mb-2">Urgență sau întrebări?</span>
                    <a
                      href="tel:+40722153525"
                      onClick={() => trackClickToCall("Igienizare Buzau Sidebar")}
                      className="inline-flex items-center gap-2 text-primary hover:underline font-semibold text-sm"
                    >
                      <PhoneCall className="w-4 h-4" /> Apelează Suportul Local
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Cross-linking to Ecommerce Consumables */}
              <Card className="bg-secondary/30">
                <CardContent className="p-5 text-sm space-y-3">
                  <h4 className="font-semibold text-foreground">Preferi să întreții singur filtrele?</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    În magazinul nostru găsești spray-uri de curățare, spume active și pastile antibacteriene pentru tăvița de condens.
                  </p>
                  <Link to="/curatare-si-intretinere" className="text-primary font-semibold text-xs inline-block hover:underline">
                    Vezi Produse de Curățare &rarr;
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

export default IgienizareAerConditionatBuzau;

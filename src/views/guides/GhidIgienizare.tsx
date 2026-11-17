"use client";
import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { FaqSection } from "@/components/FaqSection";
import { faqSchema } from "@/lib/blogSchema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Sparkles, Clock, BookOpen, ArrowRight } from "lucide-react";

const FAQS = [
  {
    "q": "Cât de des trebuie curățat aerul condiționat?",
    "a": "Filtrele le poți spăla singur la 3–4 săptămâni în sezonul de utilizare. Igienizarea profesională a vaporizatorului și a turbinei se face cel puțin o dată pe an, ideal înainte de sezonul cald, și mai des dacă folosești aparatul și pentru încălzire."
  },
  {
    "q": "Pot curăța singur aparatul de aer condiționat?",
    "a": "Da, filtrele și carcasa. Vaporizatorul și turbina, unde se adună mucegaiul și bacteriile, necesită spumă specială, husă de colectare și clătire sub presiune, așa că pentru ele e mai sigur un tehnician."
  },
  {
    "q": "Care sunt semnele că aerul condiționat are nevoie de igienizare?",
    "a": "Miros de mucegai sau de umezeală la pornire, debit de aer mai slab, picurare de apă din unitatea interioară sau puncte negre pe turbină. Toate arată depuneri care trebuie curățate."
  },
  {
    "q": "Ce dezinfectant se folosește pentru aerul condiționat?",
    "a": "Se folosesc spume și soluții dedicate climatizării, care nu corodează lamelele de aluminiu, plus tratament biocid pentru tăvița de condens. Evită dezinfectanții de uz casnic cu clor, care pot deteriora vaporizatorul."
  }
];

const GhidIgienizare = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Când și Cum se Curăță un Aer Condiționat: Ghid Pas cu Pas",
    "description":
      "Ghid detaliat despre curățarea și dezinfectarea aparatului de aer condiționat. De la spălarea filtrelor la curățarea vaporizatorului și a tăviței de condens.",
    "author": {
      "@type": "Organization",
      "name": "AirLife"
    },
    "publisher": {
      "@type": "Organization",
      "name": "AirLife",
      "logo": {
        "@type": "ImageObject",
        "url": "https://airlife.ro/placeholder.svg"
      }
    },
    "datePublished": "2025-02-01",
    "dateModified": "2026-10-27",
    "mainEntityOfPage": "https://airlife.ro/ghid/igienizare-aer-conditionat"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Când și Cum se Curăță un Aer Condiționat | Ghid AirLife"
        description="Ghid pentru igienizarea aerului condiționat: cum se curăță filtrele, vaporizatorul și turbina și când ai nevoie de tehnician."
        canonical="https://airlife.ro/ghid/igienizare-aer-conditionat"
        structuredData={[structuredData, faqSchema(FAQS)]}
      />

      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <article className="container mx-auto px-4 max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Acasă
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Ghiduri
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">Ghid Igienizare Aer Condiționat</li>
            </ol>
          </nav>

          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Ghid Practic HVAC
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Când și Cum se Curăță un Aer Condiționat: Ghid Pas cu Pas
            </h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Publicat de Echipa Tehnică AirLife</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Timp de citire: 6 minute
              </span>
            </div>
          </header>

          <div className="space-y-8 text-foreground/90 leading-relaxed text-base">
            <p className="text-lg text-muted-foreground font-normal">
              Aparatul de aer condiționat este plămânul casei tale pe timp de vară și în perioadele de tranziție. Însă, fără o igienizare meticuloasă la intervale regulate, vaporizatorul și tăvița de condens pot deveni focare de mucegai și bacterii recirculate în încăpere.
            </p>

            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  1. Semne clare că aparatul tău are nevoie de igienizare
                </h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Miros de aer stătut sau oțetit:</strong> apare chiar în primele 2-3 minute după ce pornești climatizarea.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Scăderea debitului de aer:</strong> chiar și la treapta maximă a ventilatorului, fluxul de aer suflat este slab din cauza depunerilor de praf pe turbină.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Puncte negre vizibile pe fanta de evacuare:</strong> reprezintă colonii de spori de mucegai formate pe palele deflectorului de aer.</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  2. Ce poți curăța singur acasă (Întreținere lunară)
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Filtrele grosiere din plasă plastică ale unității interioare pot și trebuie curățate de către utilizator la fiecare <strong>3–4 săptămâni</strong> de funcționare continuă:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 pl-2">
                    <li>Oprește aparatul din telecomandă și scoate-l din priză sau decuplează siguranța dedicată.</li>
                    <li>Ridică masca frontală rabatabilă a unității până când se blochează în poziție deschisă.</li>
                    <li>Extrage cu grijă cele două filtre de plasă trăgând ușor în sus și apoi spre tine.</li>
                    <li>Spală-le sub jet de apă călduță (nu fierbinte), folosind un săpun neutru sau detergent delicat.</li>
                    <li>Lasă filtrele să se usuce complet la umbră (nu pe calorifer sau la soare direct) înainte de a le reinstala.</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  3. Curățarea profesională a vaporizatorului și turbinei
                </h2>
                <p className="text-sm text-muted-foreground">
                  În timp ce filtrele opresc scamele mari, praful microscopic trece prin ele și se lipește de condensul de pe lamelele de aluminiu ale vaporizatorului și pe cilindrul turbinei. Această zonă necesită:
                </p>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Spumă activă specială:</strong> pătrunde între nervurile înguste de aluminiu și lichefiază depunerile uleioase fără a coroda metalul.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Husă de colectare etanșă:</strong> montată sub aparat pentru a clăti sub presiune fără stropi pe pereți.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span><strong>Tratament antibacterian pe tăviță:</strong> pastile biocide pentru a împiedica blocarea furtunului de evacuare pe parcursul verii.</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <FaqSection title="Întrebări frecvente" faq={FAQS} />

            {/* CTA Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 my-10">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Vrei o igienizare profesională?
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  Echipa AirLife realizează igienizarea profesională completă cu husă impermeabilă, degresare vaporizator și tratament biocid, la cerere, în zonele acoperite de echipa noastră sau de parteneri.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
                <Link to="/servicii/igienizare-aer-conditionat" className="w-full sm:w-auto">
                  <Button className="w-full flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Serviciu Igienizare
                  </Button>
                </Link>
                <Link to="/curatare-si-intretinere" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    Produse de Curățare <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default GhidIgienizare;

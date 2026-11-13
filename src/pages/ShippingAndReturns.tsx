import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { company } from "@/data/company";
import { Truck, RotateCcw, ShieldCheck, CheckCircle2 } from "lucide-react";

const ShippingAndReturns = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Politica de Livrare și Retur | AirLife.ro",
    "description":
      "Informații detaliate despre livrarea prin curier rapid și procedura de retur în 14 zile calendaristice pe AirLife.ro conform legislației române.",
    "url": "https://airlife.ro/livrare-si-retur",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Politica de Livrare și Retur | AirLife.ro"
        description="Află condițiile de livrare rapidă (20 RON sau Gratuit peste 1000 RON) și procedura legală de retur în 14 zile conform OUG 34/2014 pe AirLife.ro."
        canonical="https://airlife.ro/livrare-si-retur"
        structuredData={structuredData}
      />

      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Acasă
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">Livrare și Retur</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground text-center">
            Livrare și Retur
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Transparență completă privind procesul de expediere și condițiile de returnare a produselor achiziționate de pe AirLife.ro.
          </p>

          <div className="space-y-8">
            {/* Secțiunea Livrare */}
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Truck className="w-6 h-6" />
                  <h2 className="text-2xl font-bold text-foreground">1. Livrarea Produselor</h2>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Livrarea produselor comandate pe AirLife.ro se efectuează pe întreg teritoriul României prin intermediul serviciilor de curierat rapid (FAN Courier, DPD, Sameday).
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 my-4">
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <strong className="block text-foreground mb-1">Costul de Transport:</strong>
                      <ul className="space-y-1 text-xs">
                        <li>• <strong>20,00 RON</strong> tarif fix pentru comenzi cu valoare sub 1000 RON.</li>
                        <li>• <strong>GRATUIT</strong> pentru orice comandă ce depășește valoarea de <strong>1000 RON</strong>.</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <strong className="block text-foreground mb-1">Termen de Livrare:</strong>
                      <p className="text-xs">
                        Produsele aflate în stoc se livrează în mod uzual în termen de <strong>24 – 48 de ore lucrătoare</strong> de la confirmarea comenzii. În perioadele aglomerate sau cu condiții meteo deosebite, termenul poate fi prelungit punctual.
                      </p>
                    </div>
                  </div>
                  <p>
                    La recepționarea coletului, recomandăm verificarea integrității ambalajului exterior în prezența curierului. În cazul constatării unor deteriorări vizibile, solicitați întocmirea unui proces-verbal de constatare.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Secțiunea Retur */}
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <RotateCcw className="w-6 h-6" />
                  <h2 className="text-2xl font-bold text-foreground">2. Dreptul Legal de Retur (14 Zile)</h2>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Conform prevederilor <strong>O.U.G. nr. 34/2014</strong> privind drepturile consumatorilor în cadrul contractelor încheiate cu profesioniștii, cumpărătorul persoană fizică are dreptul de a se retrage din contract, fără a preciza motivele, în termen de <strong>14 zile calendaristice</strong> începând de la ziua în care intră în posesia fizică a produsului.
                  </p>

                  <h3 className="font-semibold text-foreground text-base mt-4 mb-2">
                    Condiții pentru acceptarea returului:
                  </h3>
                  <ul className="space-y-2 text-xs">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Produsul trebuie să fie în aceeași stare în care a fost livrat, în ambalajul original complet, cu toate accesoriile și documentele însoțitoare.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Dacă produsul prezintă urme de montaj, zgârieturi, lovituri sau componente arse, valoarea lui diminuată din cauza manipulării necorespunzătoare poate fi scăzută din suma restituită, în limitele legii.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Produsele chimice de curățare (spray-uri, spume, dezinfectanți) pot fi returnate doar dacă sunt sigilate și nefolosite, din motive de protecție a sănătății și igienă.</span>
                    </li>
                  </ul>

                  <p className="text-xs">Excepțiile legale de la retragere (produse desigilate din motive de igienă, servicii prestate integral etc.) și formularul-tip de retragere sunt în <Link to="/termeni-si-conditii" className="text-primary underline">Termeni și Condiții</Link>.</p>

                  <h3 className="font-semibold text-foreground text-base mt-4 mb-2">
                    Procedura de exercitare a returului:
                  </h3>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs">
                    <li>Trimiteți o notificare scrisă de retur pe adresa de e-mail <strong>contact@airlife.ro</strong>, menționând numărul comenzii și contul IBAN pentru restituire.</li>
                    <li>Ambalați produsul corespunzător pentru a fi protejat pe durata transportului.</li>
                    <li>Expediați coletul prin orice firmă de curierat rapid (fără ramburs) la adresa {company.legalName}, {company.address} (confirmăm adresa exactă de retur în răspunsul la notificare). Costul de transport al returului îl suportă consumatorul, dacă nu s-a convenit altfel înainte de comandă. Conform legii, cheltuielile directe legate de returnarea produselor sunt suportate de către consumator.</li>
                    <li>După recepționarea și verificarea stării produsului, contravaloarea acestuia va fi restituită în termen de maximum <strong>14 zile</strong> în contul bancar indicat.</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Asistență & Contact */}
            <Card className="bg-secondary/30 border-border">
              <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-foreground">Ai nevoie de clarificări?</h3>
                    <p className="text-xs text-muted-foreground">
                      Echipa noastră de asistență este gata să te ajute cu orice întrebare legată de comandă sau livrare.
                    </p>
                  </div>
                </div>
                <Link to="/contact">
                  <span className="text-primary hover:underline font-semibold text-sm">
                    Contactează Asistența &rarr;
                  </span>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingAndReturns;

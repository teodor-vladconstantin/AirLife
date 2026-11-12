import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Award, AlertTriangle, CheckCircle2 } from "lucide-react";

const Warranty = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Condiții de Garanție | AirLife.ro",
    "description":
      "Termenii și condițiile de garanție legală și comercială pentru produsele HVAC și serviciile de montaj asigurate de AirLife.ro.",
    "url": "https://airlife.ro/garantie",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Condiții de Garanție | AirLife.ro"
        description="Află termenii de garanție legală de conformitate (OUG 140/2021) pentru echipamentele și accesoriile HVAC, precum și garanția pentru manopera de montaj."
        canonical="https://airlife.ro/garantie"
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
              <li className="text-foreground font-medium">Garanție</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground text-center">
            Condiții de Garanție
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            AirLife comercializează produse conforme legislației române și europene în vigoare, asigurând suport tehnic și transparență deplină.
          </p>

          <div className="space-y-8">
            {/* Garanția Legală de Conformitate */}
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <ShieldCheck className="w-6 h-6" />
                  <h2 className="text-2xl font-bold text-foreground">1. Garanția Legală de Conformitate</h2>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Toate produsele comercializate pe site-ul AirLife.ro beneficiază de condiții de garanție conforme legislației în vigoare: <strong>O.U.G. nr. 140/2021</strong> privind anumite aspecte referitoare la contractele de vânzare de bunuri și <strong>O.G. nr. 21/1992</strong> privind protecția consumatorilor.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-4 my-4">
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <strong className="block text-foreground mb-1">Persoane Fizice:</strong>
                      <p className="text-xs">
                        Garanție legală de conformitate de <strong>24 de luni (2 ani)</strong> de la data livrării produsului, pentru defecte de fabricație sau neconformități existente la momentul livrării.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                      <strong className="block text-foreground mb-1">Persoane Juridice:</strong>
                      <p className="text-xs">
                        Garanția comercială pentru achizițiile pe persoană juridică (PJ) este de <strong>12 luni</strong>, cu excepția cazului în care producătorul oferă un termen extins.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cerințe pentru Echipamente de Climatizare */}
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Award className="w-6 h-6" />
                  <h2 className="text-2xl font-bold text-foreground">2. Montaj Autorizat &amp; Validitatea Garanției</h2>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Pentru aparatele de aer condiționat și echipamentele complexe de climatizare, producătorii solicită ca montajul și punerea în funcțiune să fie realizate de o <strong>echipă tehnică autorizată</strong> (cu atestat de manipulare gaze fluorurate / freon).
                  </p>
                  <p>
                    Păstrați factura fiscală și procesul-verbal de montaj sau fișa de instalare completată și ștampilată de instalator, deoarece acestea constituie dovada necesară în cazul unei solicitări de service în perioada de garanție a aparatului.
                  </p>
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-foreground space-y-1">
                    <strong className="block">Efectuezi montajul cu echipa AirLife?</strong>
                    <span>
                      Dacă apelezi la serviciul nostru de montaj, beneficiezi automat de completarea documentației oficiale de instalare și de garanția manoperei de montaj.
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Situații de Excludere */}
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3 text-amber-500 mb-2">
                  <AlertTriangle className="w-6 h-6" />
                  <h2 className="text-2xl font-bold text-foreground">3. Situații care duc la Pierderea Garanției</h2>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                  <p>Garanția nu acoperă defecțiunile provocate de:</p>
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>Montaj necorespunzător realizat de personal necalificat (ex. traseu frigorific nevidat, diametre incorecte, scurtcircuite electrice).</li>
                    <li>Variații de tensiune electrică, supratensiuni atmosferice (trăsnete) sau lipsa împământării electrice a clădirii.</li>
                    <li>Utilizarea în medii agresive chimic, cu praf industrial abundent sau coroziune anormală.</li>
                    <li>Lovituri mecanice, spargeri de componente, căderi sau intervenții/reparații neautorizate efectuate asupra produsului.</li>
                    <li>Consumabile supuse uzurii firești (filtre de praf sau cărbune activ, garnituri, baterii telecomandă).</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Procedura în caz de defecțiune */}
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">4. Cum Soliciți Intervenția în Garanție</h2>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>În cazul apariției unei disfuncționalități în perioada de garanție:</p>
                  <ol className="list-decimal list-inside space-y-2 text-xs">
                    <li>Trimiteți un e-mail la <strong>support@airlife.ro</strong> cu datele din factura fiscală, modelul aparatului și o scurtă descriere a comportamentului reclamat (inclusiv eventuale coduri de eroare).</li>
                    <li>Vă vom îndruma către centrul de service autorizat al producătorului sau vom programa o constatare tehnică direct la sediul/locația dumneavoastră dacă vă aflați în aria de acoperire a echipei AirLife.</li>
                    <li>Remedierea neconformității se realizează gratuit în termenul legal prevăzut de OUG 140/2021 (maximum 15 zile calendaristice de la aducerea la cunoștință a defecțiunii).</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Warranty;

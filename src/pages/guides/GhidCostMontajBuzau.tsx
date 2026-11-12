import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertOctagon, Wrench, Clock, BookOpen, ArrowRight } from "lucide-react";

const GhidCostMontajBuzau = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Cât Costă Montajul unui Aer Condiționat în Buzău: Ghid Complet de Prețuri și Greșeli de Evitat",
    "description":
      "Află ce include o instalare standard de aer condiționat în Buzău, care sunt costurile suplimentare justificate și de ce vidarea cu pompă este obligatorie.",
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
    "datePublished": "2025-02-05",
    "dateModified": "2026-10-27",
    "mainEntityOfPage": "https://airlife.ro/ghid/cost-montaj-aer-conditionat-buzau"
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Cât Costă Montajul unui Aer Condiționat în Buzău | Ghid Transparent AirLife"
        description="Ghid de prețuri pentru montaj aer condiționat în Buzău: ce conține un montaj standard, ce factori cresc prețul (metri traseu, înălțime, carotare) și cum eviți montajul neconform."
        canonical="https://airlife.ro/ghid/cost-montaj-aer-conditionat-buzau"
        structuredData={structuredData}
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
              <li className="text-foreground font-medium">Ghid Cost Montaj Aer Condiționat Buzău</li>
            </ol>
          </nav>

          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" /> Ghid Local Buzău
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Cât Costă Montajul unui Aer Condiționat în Buzău? Ghid Transparent de Prețuri
            </h1>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Echipa Tehnică AirLife Buzău</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> Timp de citire: 7 minute
              </span>
            </div>
          </header>

          <div className="space-y-8 text-foreground/90 leading-relaxed text-base">
            <p className="text-lg text-muted-foreground font-normal">
              Alegerea unui aparat de aer condiționat eficient este doar prima jumătate a ecuației de confort. A doua jumătate — la fel de importantă — o reprezintă calitatea montajului. Un montaj executat neglijent poate scurta viața compresorului cu ani buni și poate anula garanția producătorului.
            </p>

            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  1. Ce include o instalare standard în Buzău
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    În piața locală din Buzău, o instalare standard (pentru unități 9.000 – 12.000 BTU) include în mod normal:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Montarea suportului de perete pentru unitatea internă și a consolelor pentru unitatea externă.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>O singură străpungere de perete exterior (BCA, cărămidă sau panou sandwich/beton uzual).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Traseu frigorific izolat de până la 3 metri liniari și furtun evacuare condens.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Vidarea instalației cu pompă de vid (pas critic obligatoriu).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>Probe de funcționare și instruire utilizator.</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  2. Ce factori generează costuri suplimentare justificate
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    Dacă locuința ta are o compartimentare atipică, pot apărea operațiuni suplimentare:
                  </p>
                  <ul className="space-y-2">
                    <li>• <strong>Metri suplimentari de traseu frigorific:</strong> dacă distanța dintre unități depășește 3 metri (costă materialul suplimentar: țevi de cupru, izolație, cablu de semnal și matisaj).</li>
                    <li>• <strong>Mascare cu canal de cablu PVC:</strong> dacă traseul frigorific trece pe interior prin cameră și nu dorești țevi la vedere.</li>
                    <li>• <strong>Străpungeri adiționale:</strong> în cazul trecerii prin grinzi, diafragme de beton armat gros sau pereți intermediari.</li>
                    <li>• <strong>Montaj la înălțime mare sau schelă:</strong> dacă unitatea exterioară nu poate fi accesată de la geam sau balcon.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  3. Greșeala fatală: instalarea fără pompă de vidare
                </h2>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-foreground">
                    <strong className="flex items-center gap-2 mb-1 text-destructive">
                      <AlertOctagon className="w-4 h-4" /> Refuză montajul dacă instalatorul nu folosește pompa de vid!
                    </strong>
                    <p className="text-xs text-muted-foreground">
                      Unii „meșteri” grăbiți aleg metoda greșită a „purjării” freonului (deschid parțial robinetul pentru a împinge aerul cu gaz). Această practică este interzisă de legislația de mediu și distruge aparatul: umiditatea rămasă reacționează cu uleiul sintetic POE din compresor, producând acid clorhidric/fluorhidric care arde bobinajul motorului în 1-2 ani.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* CTA Box */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 my-10">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Vrei un montaj curat și corect în Buzău?
                </h3>
                <p className="text-sm text-muted-foreground max-w-xl">
                  La AirLife folosim întotdeauna pompă de vid, scule cu aspirare de praf și materiale de calitate. Vezi pagina dedicată pentru programări.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0 w-full sm:w-auto">
                <Link to="/servicii/montaj-aer-conditionat-buzau" className="w-full sm:w-auto">
                  <Button className="w-full flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> Programează Montaj Buzău
                  </Button>
                </Link>
                <Link to="/accesorii-aer-conditionat" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    Accesorii Montaj <ArrowRight className="w-4 h-4" />
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

export default GhidCostMontajBuzau;

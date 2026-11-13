import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cookie, Shield, CheckCircle2 } from "lucide-react";
import { setCookieConsent } from "@/lib/analytics";
import { useToast } from "@/hooks/use-toast";

const CookiePolicy = () => {
  const { toast } = useToast();

  const handleResetConsent = (accept: boolean) => {
    setCookieConsent(accept);
    toast({
      title: "Preferințe salvate",
      description: accept
        ? "Ai acceptat toate modulele cookie."
        : "Ai selectat doar modulele cookie strict necesare.",
    });
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Politica de Utilizare a Cookie-urilor | AirLife.ro",
    "description":
      "Informații despre tipurile de cookie-uri utilizate pe AirLife.ro, scopul acestora și modul în care vă puteți gestiona preferințele.",
    "url": "https://airlife.ro/politica-de-cookies",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Politica de Utilizare a Cookie-urilor | AirLife.ro"
        description="Află cum utilizează AirLife.ro modulele cookie și tehnologiile similare pentru funcționarea coșului de cumpărături și îmbunătățirea experienței tale."
        canonical="https://airlife.ro/politica-de-cookies"
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
              <li className="text-foreground font-medium">Politica de Cookies</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground text-center">
            Politica de Cookies
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            Această politică explică ce sunt modulele cookie, cum le utilizăm pe platforma AirLife.ro și cum puteți controla preferințele dumneavoastră.
          </p>

          <div className="space-y-8">
            {/* Ce sunt cookie-urile */}
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Cookie className="w-6 h-6" />
                  <h2 className="text-2xl font-bold text-foreground">1. Ce sunt modulele cookie?</h2>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                  <p>
                    Un modul cookie este un fișier text de mici dimensiuni stocat pe dispozitivul dumneavoastră (computer, tabletă, telefon mobil) atunci când vizitați un site web. Cookie-urile permit site-ului să vă recunoască dispozitivul și să rețină anumite informații despre sesiunea dumneavoastră de navigare (de exemplu: produsele adăugate în coșul de cumpărături, limba preferată sau autentificarea în cont).
                  </p>
                  <p>
                    Pe lângă cookie-uri, putem utiliza tehnologii similare precum <strong>Web Storage (localStorage)</strong> pentru a asigura sincronizarea coșului de cumpărături fără a trimite date inutile la fiecare interogare de rețea.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Categorii de cookie-uri */}
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-6">
                <div className="flex items-center gap-3 text-primary mb-2">
                  <Shield className="w-6 h-6" />
                  <h2 className="text-2xl font-bold text-foreground">2. Categoriile de cookie-uri utilizate</h2>
                </div>

                <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <strong className="block text-foreground text-base mb-1">
                      A. Cookie-uri Strict Necesare (Esențiale)
                    </strong>
                    <p className="text-xs mb-2">
                      Aceste fișiere sunt indispensabile pentru funcționarea tehnică a magazinului online. Fără ele, funcții de bază precum navigarea între pagini, memorarea produselor în coșul de cumpărături și finalizarea securizată a comenzii nu pot fi asigurate. Aceste cookie-uri nu necesită acordul dumneavoastră prealabil.
                    </p>
                    <span className="text-[11px] text-muted-foreground italic">
                      Exemple: token de sesiune, stare coș cumpărături, preferință consimțământ cookies.
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <strong className="block text-foreground text-base mb-1">
                      B. Cookie-uri de Performanță și Analiză (Opționale)
                    </strong>
                    <p className="text-xs mb-2">
                      Aceste cookie-uri (de exemplu Google Analytics 4) colectează informații agregate și anonimizate despre modul în care vizitatorii utilizează site-ul: paginile cele mai vizitate, timpul petrecut pe pagină și eventualele erori tehnice întâmpinate. Ele sunt activate doar cu acordul dumneavoastră explicit.
                    </p>
                    <span className="text-[11px] text-muted-foreground italic">
                      Exemple: Google Analytics 4 (_ga, _ga_*) și PostHog, servere în UE (identificator de vizitator, evenimente de navigare, înregistrări ale sesiunii și hărți de interacțiune). Se activează numai după ce apeși „Accept toate”. Furnizori: Google Ireland Ltd. și PostHog Inc.
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <strong className="block text-foreground text-base mb-1">C. Monitorizare tehnică</strong>
                    <p className="text-xs mb-2">
                      Folosim Sentry pentru a detecta erorile site-ului (tip de eroare, pagină, browser). Nu folosim cookie-uri de publicitate sau de urmărire între site-uri. Pornește numai după ce apeși „Accept toate”.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Gestionare preferințe */}
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">3. Gestionează preferințele tale pe AirLife</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Puteți modifica opțiunea dumneavoastră privind cookie-urile de analiză în orice moment:
                </p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleResetConsent(false)}>
                    Păstrează doar cookie-urile esențiale
                  </Button>
                  <Button size="sm" onClick={() => handleResetConsent(true)}>
                    Acceptă toate cookie-urile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Cum se dezactivează din browser */}
            <Card className="border-border">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-bold text-foreground">4. Controlul din browser</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Puteți configura browserul dumneavoastră să blocheze sau să șteargă toate cookie-urile. Rețineți însă că dezactivarea cookie-urilor strict necesare poate afecta funcționalitatea coșului de cumpărături.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <strong className="text-foreground block mb-0.5">Google Chrome:</strong>
                    <span>Setări &gt; Confidențialitate și securitate &gt; Cookie-uri de la terți</span>
                  </div>
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <strong className="text-foreground block mb-0.5">Mozilla Firefox:</strong>
                    <span>Opțiuni &gt; Confidențialitate &amp; Securitate &gt; Cookie-uri</span>
                  </div>
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <strong className="text-foreground block mb-0.5">Microsoft Edge:</strong>
                    <span>Setări &gt; Module cookie și permisiuni de site</span>
                  </div>
                  <div className="p-3 bg-secondary/40 rounded-lg">
                    <strong className="text-foreground block mb-0.5">Apple Safari:</strong>
                    <span>Preferințe &gt; Confidențialitate &gt; Gestionare date site web</span>
                  </div>
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

export default CookiePolicy;

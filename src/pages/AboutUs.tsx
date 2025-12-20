import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Eye, Award, Leaf, Users, HeartHandshake, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center animate-in fade-in duration-700">Despre AirLife</h1>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto animate-in fade-in duration-700">
            Soluții HVAC eco-friendly pentru un viitor mai curat și mai sănătos.
          </p>

          {/* Mission Card */}
          <Card className="mb-6 animate-in fade-in duration-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Misiunea Noastră
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                La AirLife, misiunea noastră este să oferim soluții HVAC de înaltă calitate care să
                îmbunătățească calitatea aerului și confortul termic, menținând în același timp un
                impact redus asupra mediului înconjurător.
              </p>
              <p>
                Ne angajăm să aducem pe piața românească produse eco-friendly care combină eficiența
                energetică cu tehnologia de ultimă generație, pentru a crea spații de locuit și de
                lucru mai sănătoase pentru toți clienții noștri.
              </p>
            </CardContent>
          </Card>

          {/* Vision Card */}
          <Card className="mb-6 animate-in fade-in duration-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Viziunea Noastră
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Viziunea noastră este să devenim liderul pieței de soluții HVAC sustenabile în România,
                recunoscut pentru inovație, calitate și angajamentul față de protecția mediului.
              </p>
              <p>
                Credem într-un viitor în care fiecare casă și birou poate beneficia de aer curat și
                confort termic optim, fără a compromite sănătatea planetei noastre. Ne propunem să
                educăm și să inspirăm comunitatea să adopte soluții eco-friendly pentru un trai mai bun.
              </p>
            </CardContent>
          </Card>

          {/* Values Section */}
          <h2 className="text-3xl font-bold mb-6 text-center animate-in fade-in duration-700">Valorile Noastre</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="animate-in fade-in duration-700 transition-opacity will-change-opacity hover:opacity-90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Award className="h-5 w-5 text-primary" />
                  Calitate
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Selectăm doar produse de la producători de renume mondial, oferind garanții complete
                  și suport tehnic dedicat pentru fiecare produs comercializat.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in duration-700 transition-opacity will-change-opacity hover:opacity-90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Leaf className="h-5 w-5 text-primary" />
                  Sustenabilitate
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Mediul înconjurător este o prioritate. Toate produsele noastre sunt selectate pentru
                  eficiența energetică ridicată și impactul minim asupra mediului.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in duration-700 transition-opacity will-change-opacity hover:opacity-90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-primary" />
                  Servicii Pentru Clienți
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Clienții noștri sunt în centrul a tot ce facem. Oferim consultanță personalizată,
                  livrare rapidă și suport post-vânzare pentru a asigura satisfacția totală.
                </p>
              </CardContent>
            </Card>

            <Card className="animate-in fade-in duration-700 transition-opacity will-change-opacity hover:opacity-90">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Inovație
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Suntem în permanență în căutarea celor mai noi tehnologii și soluții inovatoare pentru
                  a oferi clienților noștri cele mai avansate produse de pe piață.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Company Info */}
          <Card className="mb-8 animate-in fade-in duration-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5 text-primary" />
                De Ce AirLife?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                AirLife este mai mult decât un magazin online de echipamente HVAC. Suntem partenerii
                dvs. în crearea unui mediu de viață și lucru mai sănătos și mai confortabil.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span>Produse certificate și garantate de la producători de renume</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span>Consultanță gratuită pentru alegerea produsului potrivit</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span>Livrare rapidă în toată România</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span>Suport tehnic dedicat și service autorizat</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <span>Prețuri competitive și oferte speciale</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-primary/10 to-secondary/30 rounded-lg p-8 animate-in fade-in duration-700">
            <h3 className="text-2xl font-bold mb-4">Gata să Începem?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Descoperă gama completă de produse HVAC eco-friendly și alege soluția perfectă pentru
              căminul sau biroul tău.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/products">
                <Button size="lg">Vezi Produsele</Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline">Contactează-ne</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;

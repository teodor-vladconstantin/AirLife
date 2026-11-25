import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Contact</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Pentru cereri de ofertă și informații:</p>
                <a href="mailto:contact@airlife.ro" className="text-primary hover:underline font-semibold">
                  contact@airlife.ro
                </a>
                <p className="text-muted-foreground mt-4 mb-2">Pentru suport tehnic:</p>
                <a href="mailto:support@airlife.ro" className="text-primary hover:underline font-semibold">
                  support@airlife.ro
                </a>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Telefon
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Serviciu Clienți:</p>
                <a href="tel:+40XXXXXXXXX" className="text-primary hover:underline font-semibold text-lg">
                  +40 XXX XXX XXX
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Luni - Vineri: 09:00 - 18:00
                  <br />
                  Sâmbătă: 10:00 - 14:00
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Adresă
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold mb-2">AirLife SRL</p>
              <p className="text-muted-foreground">
                Str. Exemplu, Nr. 123
                <br />
                Sector X, București
                <br />
                Cod Poștal: 010101
                <br />
                România
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                CUI: ROXXXXXXXX
                <br />
                Reg. Com.: J40/XXXX/2024
              </p>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Program de Lucru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Luni - Vineri:</span>
                  <span className="font-semibold">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Sâmbătă:</span>
                  <span className="font-semibold">10:00 - 14:00</span>
                </div>
                <div className="flex justify-between">
                  <span>Duminică:</span>
                  <span className="font-semibold">Închis</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informații Utile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Livrare / Montaj</h3>
                <p>
                  Detaliile de livrare și montaj vor fi specificate în oferta pe care ți-o vom trimite. Pentru estimări generale, putem livra și programa montaj în funcție de disponibilitate.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Retur și Garanție</h3>
                <p>
                  Aveți dreptul de retur în 14 zile de la primirea produsului. Toate produsele beneficiază de garanție conform
                  specificațiilor producătorului.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Întrebări Frecvente</h3>
                <p>
                  Pentru întrebări frecvente despre cereri, livrare, montaj și garanție, vă rugăm să consultați secțiunea FAQ
                  sau să ne contactați direct.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

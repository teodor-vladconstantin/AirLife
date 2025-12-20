import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Termeni și Condiții</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. Informații Generale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Bine ați venit pe site-ul AirLife. Prin accesarea și utilizarea acestui site, acceptați să respectați și să fiți
                obligat de următorii termeni și condiții de utilizare.
              </p>
              <p>
                AirLife își rezervă dreptul de a modifica acești termeni și condiții în orice moment, fără notificare prealabilă.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Comandă și Plată</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Plasarea unei comenzi pe site-ul nostru constituie o ofertă de cumpărare. Toate comenzile sunt supuse acceptării noastre.
              </p>
              <p>
                Prețurile afișate sunt în LEI (RON) și includ TVA. Costul livrării va fi afișat separat la finalizarea comenzii.
              </p>
              <p>
                Acceptăm următoarele metode de plată: ramburs (plată cash la livrare) și transfer bancar.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Livrare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Livrarea se face prin curier rapid în toată România, în 2-5 zile lucrătoare de la confirmarea comenzii.
              </p>
              <p>
                Livrarea este gratuită pentru comenzi de peste 500 RON. Pentru comenzi sub această valoare, costul livrării este de 20 RON.
              </p>
              <p>
                Clientul va fi contactat telefonic pentru confirmarea comenzii și stabilirea intervalului de livrare.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Drept de Retur</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Conform legislației în vigoare (OUG 34/2014), aveți dreptul să returnați produsele în termen de 14 zile calendaristice
                de la primirea acestora, fără a fi nevoie să indicați motivul.
              </p>
              <p>
                Produsele returnate trebuie să fie în ambalajul original, nedesfăcute și nefolosite. Costul returnării este suportat de
                client, cu excepția cazurilor în care produsul este defect.
              </p>
              <p>
                Pentru a exercita dreptul de retur, vă rugăm să ne contactați la adresa de email: contact@airlife.ro
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Garanție</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Toate produsele comercializate beneficiază de garanție conform legislației în vigoare și specificațiilor producătorului.
              </p>
              <p>
                Perioada de garanție este menționată în certificatul de garanție care însoțește fiecare produs.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. Proprietate Intelectuală</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Conținutul acestui site, inclusiv, dar fără a se limita la texte, grafice, imagini și logo-uri, este proprietatea
                AirLife și este protejat de legile privind drepturile de autor.
              </p>
              <p>
                Este interzisă reproducerea, distribuirea sau utilizarea în orice mod a conținutului fără acordul scris prealabil al
                AirLife.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Pentru orice întrebări referitoare la acești termeni și condiții, vă rugăm să ne contactați:</p>
              <p>
                Email: contact@airlife.ro
                <br />
                Telefon: +40 XXX XXX XXX
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsAndConditions;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Politică de Confidențialitate</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>1. Introducere</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                AirLife respectă confidențialitatea datelor dumneavoastră personale și se angajează să le protejeze în conformitate
                cu Regulamentul General privind Protecția Datelor (GDPR).
              </p>
              <p>
                Această politică de confidențialitate descrie ce date personale colectăm, cum le folosim și care sunt drepturile
                dumneavoastră în legătură cu acestea.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>2. Date Personale Colectate</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Colectăm următoarele tipuri de date personale:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Date de identificare: nume, prenume</li>
                <li>Date de contact: adresă de email, număr de telefon</li>
                <li>Date de livrare: adresă completă de livrare</li>
                <li>Date privind comenzile/cererile: produse solicitate, prețuri, metoda de plată</li>
                <li>Date de autentificare: email și parolă (criptată)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>3. Scopul Prelucrării Datelor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Prelucrăm datele dumneavoastră personale în următoarele scopuri:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Procesarea cererilor de ofertă și, dacă este cazul, livrarea/instalarea produselor</li>
                <li>Comunicarea cu clienții (confirmări, notificări despre statusul cererii/comenzii)</li>
                <li>Gestionarea contului de utilizator</li>
                <li>Îmbunătățirea serviciilor și experienței utilizatorilor</li>
                <li>Respectarea obligațiilor legale (contabilitate, fiscalitate)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>4. Temeiul Legal al Prelucrării</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Prelucrăm datele dumneavoastră pe baza următoarelor temeiuri legale:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Executarea contractului de vânzare-cumpărare</li>
                <li>Consimțământul dumneavoastră explicit</li>
                <li>Interesul legitim al operatorului</li>
                <li>Obligații legale (legislație fiscală, contabilă)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>5. Partajarea Datelor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Datele dumneavoastră pot fi partajate cu următoarele categorii de destinatari:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Companii de curierat (pentru livrarea produselor când este cazul)</li>
                <li>Procesatori de plăți (pentru tranzacții online)</li>
                <li>Furnizori de servicii IT (hosting, mentenanță)</li>
                <li>Autorități publice (când este cerut de lege)</li>
              </ul>
              <p className="mt-4">
                Nu vindem și nu închiriem datele dumneavoastră personale către terțe părți pentru scopuri de marketing.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>6. Perioada de Stocare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Păstrăm datele dumneavoastră personale pe perioada necesară îndeplinirii scopurilor pentru care au fost colectate:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Date de comandă/cerere: 5 ani (conform legislației fiscale)</li>
                <li>Cont utilizator: până la ștergerea contului</li>
                <li>Date de marketing: până la retragerea consimțământului</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>7. Drepturile Dumneavoastră</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>În conformitate cu GDPR, aveți următoarele drepturi:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Dreptul de acces la date</li>
                <li>Dreptul la rectificare</li>
                <li>Dreptul la ștergerea datelor ("dreptul de a fi uitat")</li>
                <li>Dreptul la restricționarea prelucrării</li>
                <li>Dreptul la portabilitatea datelor</li>
                <li>Dreptul de a vă opune prelucrării</li>
                <li>Dreptul de a depune o plângere la autoritatea de supraveghere (ANSPDCP)</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>8. Securitatea Datelor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră împotriva accesului
                neautorizat, pierderii, distrugerii sau modificării.
              </p>
              <p>
                Acestea includ: criptarea datelor, conexiuni securizate (SSL/TLS), autentificare cu parolă, backup-uri regulate.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>9. Cookie-uri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Site-ul nostru utilizează cookie-uri pentru a îmbunătăți experiența utilizatorului și pentru a analiza traficul pe site.
              </p>
              <p>
                Puteți gestiona preferințele cookie-urilor din setările browserului dumneavoastră.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>10. Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Pentru orice întrebări privind această politică de confidențialitate sau pentru a vă exercita drepturile, vă rugăm să ne contactați:
              </p>
              <p>
                Email: privacy@airlife.ro
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

export default PrivacyPolicy;

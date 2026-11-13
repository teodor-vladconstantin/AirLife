"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackContactSubmit, trackClickToCall } from "@/lib/analytics";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({
        title: "Câmpuri obligatorii",
        description: "Vă rugăm să completați numele, adresa de email și mesajul.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    trackContactSubmit(subject || "Mesaj general de contact");

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Mesaj expediat!",
        description: "Îți mulțumim pentru mesaj. Echipa AirLife te va contacta în cel mai scurt timp posibil.",
      });
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }, 600);
  };

  const contactStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact AirLife",
    "url": "https://airlife.ro/contact",
    "mainEntity": {
      "@type": "HVACBusiness",
      "name": "AirLife",
      "email": "contact@airlife.ro",
      "telephone": PHONE_TEL,
      "areaServed": {
        "@type": "Country",
        "name": "România"
      },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Str. Centrală nr. 169",
        "addressLocality": "Mărăcineni",
        "addressRegion": "Buzău",
        "postalCode": "127325",
        "addressCountry": "RO"
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Contact & Suport | AirLife"
        description="Contactează echipa AirLife. Informații despre comenzi, livrare accesorii HVAC și programări pentru montaj sau igienizare aer condiționat."
        canonical="https://airlife.ro/contact"
        structuredData={contactStructuredData}
      />

      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground tracking-tight">
              Contact &amp; Asistență Clienți
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Ai o întrebare despre produsele noastre sau dorești o programare pentru montaj ori igienizare? Scrie-ne și îți răspundem cu plăcere.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Details Column */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <Phone className="h-5 w-5 text-primary" />
                    Telefon
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <span className="text-xs text-muted-foreground block">Programări montaj, igienizare și service:</span>
                  <a
                    href={`tel:${PHONE_TEL}`}
                    onClick={() => trackClickToCall("contact-page")}
                    className="text-primary hover:underline font-semibold text-lg"
                  >
                    {PHONE_DISPLAY}
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <Mail className="h-5 w-5 text-primary" />
                    Adrese de E-mail
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <span className="text-xs text-muted-foreground block">Comenzi, oferte, garanții &amp; suport:</span>
                    <a href="mailto:contact@airlife.ro" className="text-primary hover:underline font-semibold">
                      contact@airlife.ro
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <MapPin className="h-5 w-5 text-primary" />
                    Sediu
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground leading-relaxed">
                  <p className="font-semibold text-foreground mb-1">AirLife (Sediu)</p>
                  <p>Str. Centrală nr. 169, sat Mărăcineni, jud. Buzău, 127325, România</p>
                  <p className="text-xs mt-2 italic">
                    *Serviciu de intervenție direct la domiciliul sau sediul clientului (Service Area Business) în toată țara.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <Clock className="h-5 w-5 text-primary" />
                    Program de Lucru
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-2">
                  <div className="flex justify-between">
                    <span>Luni – Vineri:</span>
                    <span className="font-semibold text-foreground">09:00 – 18:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sâmbătă:</span>
                    <span className="font-semibold text-foreground">10:00 – 14:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duminică:</span>
                    <span className="font-semibold text-foreground">Închis</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form Column */}
            <div className="lg:col-span-2">
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    Trimite-ne un Mesaj
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Completează formularul de mai jos și un membru al echipei noastre îți va răspunde în maximum 24 de ore lucrătoare.
                  </p>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="p-8 text-center bg-primary/10 rounded-xl border border-primary/20 space-y-3 animate-in fade-in">
                      <CheckCircle2 className="w-12 h-12 text-primary mx-auto" />
                      <h3 className="text-xl font-bold text-foreground">Mesaj Trimis cu Succes!</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Am primit solicitarea ta și o analizăm cu atenție. Te vom contacta pe email sau telefonic în cel mai scurt timp.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                        Trimite alt mesaj
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-foreground block mb-1">
                            Nume și Prenume *
                          </label>
                          <Input
                            required
                            placeholder="ex. Andrei Popa"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-foreground block mb-1">
                            Adresă de E-mail *
                          </label>
                          <Input
                            required
                            type="email"
                            placeholder="ex. andrei@exemplu.ro"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold text-foreground block mb-1">
                            Număr de Telefon (opțional)
                          </label>
                          <Input
                            type="tel"
                            placeholder="ex. 07xxxxxxxx"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-foreground block mb-1">
                            Subiect
                          </label>
                          <Input
                            placeholder="ex. Întrebare produs / Montaj"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-foreground block mb-1">
                          Mesajul tău *
                        </label>
                        <Textarea
                          required
                          rows={5}
                          placeholder="Descrie pe scurt produsul dorit sau cererea ta de asistență..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </div>

                      <p className="text-[11px] text-muted-foreground">
                        *Prin trimiterea acestui formular confirmi că ești de acord cu prelucrarea datelor cu caracter personal conform{" "}
                        <a href="/politica-de-confidentialitate" className="text-primary underline">
                          Politicii de Confidențialitate
                        </a>
                        .
                      </p>

                      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        <Send className="w-4 h-4 mr-2" />
                        {isSubmitting ? "Se trimite..." : "Trimite Solicitarea"}
                      </Button>
                    </form>
                  )}
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

export default Contact;

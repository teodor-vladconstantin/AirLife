"use client";
import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, Sparkles, Activity, MapPin, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

const servicesList = [
  {
    title: "Montaj Aer Condiționat",
    path: "/servicii/montaj-aer-conditionat",
    icon: Wrench,
    badge: "Instalare Profesională",
    description:
      "Montaj cu pompă de vidare, scule profesionale, kit de instalare calitativ și poziționare optimă pentru randament maxim și păstrarea garanției aparatului.",
    highlights: ["Vidare traseu frigorific", "Console rezistente", "Probă răcire / încălzire"],
  },
  {
    title: "Igienizare & Curățare Aer Condiționat",
    path: "/servicii/igienizare-aer-conditionat",
    icon: Sparkles,
    badge: "Sănătate & Confort",
    description:
      "Curățare profundă cu husă specială de protecție fără a murdări pereții. Dezinfectare vaporizator, spălare turbină și tratament antibacterian împotriva mucegaiului.",
    highlights: ["Husă colectoare etanșă", "Soluții biocide avizate", "Eliminare mirosuri neplăcute"],
  },
  {
    title: "Service & Reparații Climatizare",
    path: "/servicii/service-aer-conditionat",
    icon: Activity,
    badge: "Intervenție Rapidă",
    description:
      "Diagnosticare presiuni freon R32 și R410A, detectare pierderi, remediere scurgeri condens, înlocuire condensatori și piese defecte.",
    highlights: ["Diagnosticare precisă", "Detectare pierderi freon", "Reparații garantate"],
  },
];

const Services = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    "name": "AirLife Servicii Climatizare",
    "url": "https://airlife.ro/servicii",
    "areaServed": {
      "@type": "City",
      "name": "România"
    },
    "description": "Servicii complete de montaj, igienizare și service aer condiționat în toată țara."
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Servicii Aer Condiționat: Montaj, Igienizare, Service | AirLife"
        description="Servicii complete de climatizare: montaj autorizat cu vidare, igienizare profesională a vaporizatorului și turbinei, depanare și reparații aer condiționat."
        canonical="https://airlife.ro/servicii"
        structuredData={structuredData}
      />

      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" /> Disponibil în toată țara
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Servicii Climatizare &amp; HVAC
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Echipa AirLife oferă servicii tehnice dedicate pentru sistemele de aer condiționat rezidențiale și comerciale.
              Lucrăm curat, folosim scule profesionale și respectăm normele tehnice ale fiecărui producător.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {servicesList.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="flex flex-col justify-between border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card"
                >
                  <CardContent className="p-6 flex flex-col h-full justify-between">
                    <div>
                      <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 text-primary mb-4">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground block w-fit mb-2">
                        {service.badge}
                      </span>
                      <h2 className="text-xl font-bold mb-3 text-foreground">{service.title}</h2>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        {service.description}
                      </p>

                      <ul className="space-y-2 mb-6 text-xs text-muted-foreground">
                        {service.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Link to={service.path} className="w-full">
                      <Button variant="outline" className="w-full justify-between group">
                        Detalii &amp; Programare
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Local Authority Box */}
          <div className="bg-card border border-border p-8 rounded-2xl shadow-sm mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="p-4 rounded-full bg-primary/10 text-primary flex-shrink-0">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  De ce să alegi serviciile AirLife?
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Ne asigurăm că fiecare client primește o estimare corectă înainte de începerea lucrării, folosim numai materiale de calitate (țevi de cupru calibrate, console tratate anticoroziv) și vidăm obligatoriu fiecare instalație nouă.
                </p>
                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Fără surprize la preț
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Intervenție curată &amp; ordonată
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-primary" /> Garanție de execuție a manoperei
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;

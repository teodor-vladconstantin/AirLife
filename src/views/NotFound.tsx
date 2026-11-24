"use client";
import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";
import { ArrowRight, Phone } from "lucide-react";

const LINKS = [
  { to: "/aer-conditionat", label: "Aer condiționat" },
  { to: "/ventilatoare-baie", label: "Ventilatoare baie" },
  { to: "/dezumidificatoare", label: "Dezumidificatoare" },
  { to: "/servicii", label: "Montaj și service" },
  { to: "/blog", label: "Ghiduri și sfaturi" },
  { to: "/contact", label: "Contact" },
];

const NotFound = () => (
  <div className="min-h-screen flex flex-col">
    <SEO title="Pagina nu a fost găsită | AirLife" description="Nu am găsit pagina căutată. Pornește de la magazin sau scrie-ne." noindex />
    <Navbar />
    <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 flex items-center">
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <img src="/logo-mark.png" alt="" width={96} height={96} className="mx-auto mb-6 h-24 w-auto" />
        <p className="text-sm font-semibold uppercase tracking-widest text-primary mb-3">Eroare 404</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">Nu am găsit pagina.</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Verifică adresa și încearcă din nou. Sau pornește de aici: produsul căutat e probabil la un click distanță.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto font-semibold">
              Înapoi acasă <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/produse">
            <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold">Vezi produsele</Button>
          </Link>
        </div>
        <ul className="flex flex-wrap justify-center gap-2 mb-10">
          {LINKS.map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="inline-block px-3 py-1.5 rounded-full bg-secondary text-sm text-foreground hover:bg-primary/10 hover:text-primary transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
          <Phone className="w-4 h-4" /> Ai nevoie de ajutor? Sună la {PHONE_DISPLAY}
        </a>
      </div>
    </main>
    <Footer />
  </div>
);

export default NotFound;

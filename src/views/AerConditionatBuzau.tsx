"use client";
import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { FaqSection } from "@/components/FaqSection";
import { faqSchema } from "@/lib/blogSchema";
import { AREA_SERVED, BUZAU_LOCALITIES, COVERAGE_FAQ, PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";
import { MapPin, Wrench, Sparkles, Settings, ShoppingCart, PhoneCall } from "lucide-react";

const URL = "https://airlife.ro/aer-conditionat-buzau";

const FAQS = [
  COVERAGE_FAQ,
  { q: "Cât durează montajul unui aer condiționat în Buzău?", a: "Un montaj standard durează între 2 și 3,5 ore, în funcție de grosimea peretelui și lungimea traseului frigorific. Vidăm obligatoriu fiecare instalație cu pompă de vid." },
  { q: "Cât durează o igienizare la domiciliu?", a: "Între 45 și 75 de minute per aparat. Curățăm vaporizatorul, turbina și tăvița de condens, cu husă de protecție ca să nu murdărim pereții." },
  { q: "Cât de des trebuie igienizat aerul condiționat?", a: "Cel puțin o dată pe an pentru locuințe, ideal primăvara înainte de sezonul cald. În birouri și spații comerciale, de două ori pe an." },
  { q: "Pot cumpăra aparatul de la voi și să mi-l montați tot voi?", a: "Da. Comanzi aparatul de pe airlife.ro, iar montajul în Buzău sau în județ îl programăm cu echipa AirLife sau parteneri. Livrarea prin curier este gratuită peste 1000 RON." },
  { q: "Care este programul?", a: `Luni-vineri 09:00-18:00, sâmbătă 10:00-14:00. Ne găsești la ${PHONE_DISPLAY} sau prin formularul de pe paginile de servicii.` },
];

const SERVICES = [
  { to: "/servicii/montaj-aer-conditionat-buzau", icon: Wrench, title: "Montaj aer condiționat Buzău", desc: "Instalare cu vidare, console, traseu frigorific și probă completă de funcționare." },
  { to: "/servicii/igienizare-aer-conditionat-buzau", icon: Sparkles, title: "Igienizare aer condiționat Buzău", desc: "Curățare vaporizator, turbină și tăviță de condens, tratament antibacterian." },
  { to: "/servicii/service-aer-conditionat-buzau", icon: Settings, title: "Service aer condiționat Buzău", desc: "Diagnosticare, freon, scurgeri de apă, coduri de eroare și piese." },
];

const AerConditionatBuzau = () => {
  const schema = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${URL}#webpage`,
      url: URL,
      name: "Aer condiționat Buzău: montaj, igienizare, service",
      isPartOf: { "@id": "https://airlife.ro/#website" },
      about: { "@id": "https://airlife.ro/#localbusiness" },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: SERVICES.map((s, i) => ({ "@type": "ListItem", position: i + 1, item: { "@id": `https://airlife.ro${s.to}#service` } })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Acasă", item: "https://airlife.ro/" },
        { "@type": "ListItem", position: 2, name: "Aer condiționat Buzău", item: URL },
      ],
    },
    faqSchema(FAQS),
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Aer Condiționat Buzău: Montaj, Igienizare, Service | AirLife"
        description="Aer condiționat în Buzău: montaj cu vidare, igienizare și service la domiciliu, în municipiu și tot județul. Aparate cu livrare rapidă."
        canonical={URL}
        structuredData={schema}
      />
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Acasă</Link> / <span className="text-foreground font-medium">Aer condiționat Buzău</span>
          </nav>

          <header className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <MapPin className="w-4 h-4" /> Municipiul Buzău și tot județul
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">Aer Condiționat Buzău</h1>
            <p className="lead text-lg text-muted-foreground leading-relaxed">
              AirLife face montaj, igienizare și service aer condiționat în municipiul Buzău și în tot județul Buzău, cu echipa AirLife sau parteneri.
              Aparatele le găsești în magazinul nostru online, iar montajul îl programăm tot noi.
            </p>
          </header>

          <section className="grid md:grid-cols-3 gap-6">
            {SERVICES.map(({ to, icon: Icon, title, desc }) => (
              <Link key={to} to={to} className="bg-card p-6 rounded-xl border border-border shadow-sm hover:border-primary transition-colors">
                <Icon className="w-7 h-7 text-primary mb-3" />
                <h2 className="text-lg font-bold text-foreground mb-1">{title}</h2>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </Link>
            ))}
          </section>

          <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Servicii de aer condiționat în Buzău, pe scurt</h2>
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <caption className="sr-only">Serviciile AirLife pentru aer condiționat în Buzău: durată și ce include</caption>
                <thead className="bg-secondary/50 text-left"><tr><th scope="col" className="p-3">Serviciu</th><th scope="col" className="p-3">Durată tipică</th><th scope="col" className="p-3">Ce include</th></tr></thead>
                <tbody>
                  <tr className="border-t border-border"><th scope="row" className="p-3 text-left font-normal"><Link to="/servicii/montaj-aer-conditionat-buzau" className="text-primary font-semibold hover:underline">Montaj</Link></th><td className="p-3">2 – 3,5 ore</td><td className="p-3">Unitate interioară și exterioară, traseu frigorific, vidare cu pompă de vid, probă completă</td></tr>
                  <tr className="border-t border-border"><th scope="row" className="p-3 text-left font-normal"><Link to="/servicii/igienizare-aer-conditionat-buzau" className="text-primary font-semibold hover:underline">Igienizare</Link></th><td className="p-3">45 – 75 de minute pe aparat</td><td className="p-3">Curățare vaporizator, turbină și tăviță de condens, cu husă de protecție</td></tr>
                  <tr className="border-t border-border"><th scope="row" className="p-3 text-left font-normal"><Link to="/servicii/service-aer-conditionat-buzau" className="text-primary font-semibold hover:underline">Service</Link></th><td className="p-3">După constatare</td><td className="p-3">Diagnosticare, freon, scurgeri de apă, coduri de eroare, piese</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-3">Prețul exact îl stabilim după ce știm modelul și locul montajului. Vezi <Link to="/ghid/cost-montaj-aer-conditionat-buzau" className="text-primary font-semibold hover:underline">de ce depinde costul montajului</Link>.</p>
          </section>

          <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-3 text-foreground">Unde intervenim în județul Buzău</h2>
            <p className="text-muted-foreground mb-4">
              În oraș venim în toate cartierele: Micro 3, Micro 5, Micro 14, Dorobanți, Centru, Broșteni, Orizont. În județ ajungem în orașele și comunele de mai jos și în localitățile din jurul lor.
            </p>
            <ul className="flex flex-wrap gap-2">
              {BUZAU_LOCALITIES.map((l) => (
                <li key={l} className="px-3 py-1 rounded-full bg-secondary text-sm text-foreground">{l}</li>
              ))}
            </ul>
          </section>

          <section className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm">
            <h2 className="text-2xl font-bold mb-3 text-foreground flex items-center gap-2"><ShoppingCart className="w-6 h-6 text-primary" /> Aparate de aer condiționat pentru Buzău</h2>
            <p className="text-muted-foreground mb-4">
              Alegi aparatul din magazin (inverter cu Wi-Fi, 9000-21000 BTU), iar noi îl montăm. BTU se alege după volumul camerei (metri cubi): până la 65 mc ajunge de regulă un aparat de 9000 BTU; pentru 65-85 mc, 12000 BTU.
            </p>
            <div className="flex flex-wrap gap-4 text-sm font-semibold">
              <Link to="/aer-conditionat" className="text-primary hover:underline">Vezi aparatele de aer condiționat &rarr;</Link>
              <Link to="/ghid/cost-montaj-aer-conditionat-buzau" className="text-primary hover:underline">Cât costă montajul &rarr;</Link>
              <Link to="/ghid/ce-btu-aer-conditionat-buzau" className="text-primary hover:underline">Ce BTU ai nevoie (calculator) &rarr;</Link>
            </div>
          </section>

          <FaqSection title="Întrebări frecvente: aer condiționat în Buzău" faq={FAQS} />

          <div className="text-center">
            <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">
              <PhoneCall className="w-4 h-4" /> Sună pentru programare: {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AerConditionatBuzau;

import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wrench, Sparkles, Activity, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

const services = [
  {
    title: "Montaj Aer Condiționat",
    slug: "montaj-aer-conditionat",
    icon: Wrench,
    badge: "Instalare Autorizată",
    desc: "Instalare curată cu pompă de vidare, scule speciale, kituri rezistente și probe funcționale complete.",
    features: ["Vidare obligatorie traseu", "Console cu protecție UV", "Garanție manoperă"],
  },
  {
    title: "Igienizare & Curățare",
    slug: "igienizare-aer-conditionat",
    icon: Sparkles,
    badge: "Curățare Profundă",
    desc: "Spălare cu husă etanșă pentru pereți, degresare vaporizator, curățare turbină și tratament antibacterian.",
    features: ["Fără stropi pe perete", "Soluții biocide sigure", "Eliminare mirosuri"],
  },
  {
    title: "Service & Reparații",
    slug: "service-aer-conditionat",
    icon: Activity,
    badge: "Diagnosticare & Remediere",
    desc: "Identificare pierderi freon R32/R410A, reparare scurgeri de apă, înlocuire condensatori și senzori defecți.",
    features: ["Diagnosticare precisă", "Încărcare freon cu vidare", "Piese originale"],
  },
];

export const HomeServicesSection = () => {
  return (
    <section className="py-20 bg-secondary/20 border-y border-border/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold mb-3">
            <MapPin className="w-3.5 h-3.5" /> Servicii de montaj și mentenanță
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Montaj &amp; Mentenanță Climatizare
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Ai nevoie de montaj, igienizare profesională sau reparație pentru aparatul tău de aer condiționat? Contactează echipa AirLife.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <Card
                key={i}
                className="flex flex-col justify-between border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg bg-card"
              >
                <CardContent className="p-6 flex flex-col h-full justify-between">
                  <div>
                    <div className="inline-flex items-center justify-center p-3 rounded-xl bg-primary/10 text-primary mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground block w-fit mb-2">
                      {svc.badge}
                    </span>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{svc.title}</h3>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                      {svc.desc}
                    </p>

                    <ul className="space-y-1.5 mb-6 text-xs text-muted-foreground">
                      {svc.features.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={`/servicii/${svc.slug}`}>
                    <Button variant="outline" size="sm" className="w-full justify-between group">
                      Programare &amp; Detalii
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Link to="/servicii">
            <Button variant="link" className="text-primary font-semibold text-sm">
              Vezi toate serviciile oferite &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HomeServicesSection;

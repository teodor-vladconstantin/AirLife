import { Link } from "@/lib/router";
import { Wrench, Sparkles, Activity, ArrowRight, CheckCircle2 } from "lucide-react";

const services = [
  {
    title: "Montaj aer condiționat",
    slug: "montaj-aer-conditionat-buzau",
    icon: Wrench,
    badge: "Instalare Autorizată",
    desc: "Instalare cu echipa proprie sau parteneri, echipamente profesionale și probe funcționale complete.",
    features: ["Vidare obligatorie traseu", "Console cu protecție UV", "Garanție manoperă"],
  },
  {
    title: "Igienizare & Curățare",
    slug: "igienizare-aer-conditionat-buzau",
    icon: Sparkles,
    badge: "Curățare Profundă",
    desc: "Spălare cu husă etanșă pentru pereți, degresare vaporizator, curățare turbină și tratament antibacterian.",
    features: ["Fără stropi pe perete", "Soluții biocide sigure", "Eliminare mirosuri"],
  },
  {
    title: "Service & Reparații",
    slug: "service-aer-conditionat-buzau",
    icon: Activity,
    badge: "Diagnosticare & Remediere",
    desc: "Identificare pierderi freon, reparare scurgeri de apă, înlocuire condensatori și senzori defecți.",
    features: ["Diagnosticare precisă", "Încărcare freon cu vidare", "Piese potrivite aparatului"],
  },
];

export const HomeServicesSection = () => {
  return (
    <section className="section bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="section-head">
          <span className="eyebrow">Servicii în Buzău și tot județul</span>
          <h2 className="text-title mb-3">Montaj și mentenanță climatizare</h2>
          <p className="text-lead">Ai nevoie de montaj, igienizare profesională sau reparație pentru aparatul tău de aer condiționat? Echipa AirLife intervine în municipiul Buzău și în tot județul.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 md:gap-6">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <Link
                key={svc.slug}
                to={`/servicii/${svc.slug}`}
                className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="w-fit rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">{svc.badge}</span>
                <h3 className="text-subtitle">{svc.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{svc.desc}</p>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {svc.features.map((f) => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />{f}</li>
                  ))}
                </ul>
                <span className="mt-auto inline-flex items-center gap-1 pt-2 text-sm font-semibold text-primary">
                  Detalii și programare
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HomeServicesSection;

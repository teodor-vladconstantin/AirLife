import { Shield, Zap, Heart, Wrench } from "lucide-react";

const features = [
  {
    icon: Wrench,
    title: "Montaj & Service",
    description: "Instalare curată cu echipa proprie sau parteneri și asistență promptă.",
  },
  {
    icon: Zap,
    title: "Eficiență & Randament Maxim",
    description: "Aparate și componente calitative, care funcționează la randamentul nominal.",
  },
  {
    icon: Shield,
    title: "Garanție Conform Legii",
    description: "Garanție legală de conformitate 24 luni pentru persoane fizice și garanție de execuție la montaj.",
  },
  {
    icon: Heart,
    title: "Aer Curat & Sănătate",
    description: "Produse profesionale de igienizare și dezinfectare a vaporizatorului pentru eliminarea mucegaiului.",
  },
];

const Features = () => {
  return (
    <section className="section bg-background">
      <div className="container mx-auto px-4">
        <div className="section-head">
          <h2 className="text-title mb-3">De ce să lucrezi cu AirLife?</h2>
          <p className="text-lead">Prioritizăm corectitudinea tehnică, transparența costurilor și respectul pentru casa ta.</p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex flex-col items-center gap-2 text-center">
                <span className="mb-1 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="text-subtitle">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

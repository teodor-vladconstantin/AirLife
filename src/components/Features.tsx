import { Shield, Zap, Heart, Wrench } from "lucide-react";

const features = [
  {
    icon: Wrench,
    title: "Montaj & Service în Buzău",
    description: "Instalare curată cu pompă de vidare și asistență promptă în municipiul Buzău și zonele limitrofe.",
  },
  {
    icon: Zap,
    title: "Eficiență & Randament Maxim",
    description: "Accesorii și consumabile calitative care asigură funcționarea aparatului la randamentul nominal.",
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
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            De Ce Să Lucrezi cu AirLife?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Prioritizăm corectitudinea tehnică, transparența costurilor și respectul pentru casa ta.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center group p-6 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-xl mb-5 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

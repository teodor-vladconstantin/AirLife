import { Leaf, Shield, Zap, Heart } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "Tehnologii verzi care protejează mediul și reduc amprenta de carbon"
  },
  {
    icon: Zap,
    title: "Eficiență Energetică",
    description: "Economisește până la 40% din costurile de energie cu produsele noastre"
  },
  {
    icon: Shield,
    title: "Garanție Extinsă",
    description: "10 ani garanție completă și service gratuit în primul an"
  },
  {
    icon: Heart,
    title: "Sănătate & Confort",
    description: "Aer curat și temperatură perfectă pentru bunăstarea ta"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            De Ce AirLife?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Investește în sănătatea ta și a planetei
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="text-center group animate-in fade-in duration-700"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl mb-6 transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl">
                  <Icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;

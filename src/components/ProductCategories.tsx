import { Link } from "@/lib/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Wrench, Shield, Filter, ArrowRight } from "lucide-react";
import airConditioner from "@/assets/air-conditioner.jpg";
import dehumidifier from "@/assets/dehumidifier.jpg";
import airPurifier from "@/assets/air-purifier.jpg";

const categories = [
  {
    title: "Curățare & Igienizare",
    slug: "curatare-si-intretinere",
    description: "Spray-uri cu spumă activă, soluții dezinfectante pentru vaporizator și huse de curățare pe perete.",
    icon: Sparkles,
    image: airConditioner.src,
    features: ["Spumă Activă", "Anti-mucegai", "Husă Protecție"],
  },
  {
    title: "Accesorii Aer Condiționat",
    slug: "accesorii-aer-conditionat",
    description: "Console rabatabile rezistente, tampoane antivibrante din cauciuc și elemente de fixare sigure.",
    icon: Wrench,
    image: dehumidifier.src,
    features: ["Console 450mm", "Tampoane M8", "Fără Vibrații"],
  },
  {
    title: "Consumabile HVAC",
    slug: "consumabile-hvac",
    description: "Furtun condens spiralat antistrivire, bandă de matisare protecție UV și izolații pentru trasee frigorifice.",
    icon: Shield,
    image: airPurifier.src,
    features: ["Furtun Ø16mm", "Bandă UV", "Drenaj Sigur"],
  },
  {
    title: "Filtre Purificatoare & AC",
    slug: "filtre-purificatoare",
    description: "Filtre cu cărbune activ și filtre HEPA pentru reținerea alergenilor și neutralizarea mirosurilor neplăcute.",
    icon: Filter,
    image: airPurifier.src,
    features: ["Carbon Activ", "HEPA", "Aer Pur"],
  },
];

const ProductCategories = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">
            Magazin Online HVAC
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Categorii de Produse
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Accesorii calitative și soluții de curățare pentru un sistem de climatizare fiabil și un aer sănătos în casă.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card
                key={index}
                className="group flex flex-col justify-between overflow-hidden border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-lg bg-card/60 backdrop-blur-sm"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-secondary">
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-3 left-3 bg-primary text-primary-foreground p-2.5 rounded-xl shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {category.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {category.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-medium rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link to={`/${category.slug}`} className="w-full block">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-between text-xs group-hover:border-primary/40 group-hover:bg-primary/5"
                    >
                      Explorează Categoria
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;

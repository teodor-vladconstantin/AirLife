import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Droplets, Sparkles } from "lucide-react";
import airConditioner from "@/assets/air-conditioner.jpg";
import dehumidifier from "@/assets/dehumidifier.jpg";
import airPurifier from "@/assets/air-purifier.jpg";

const categories = [
  {
    title: "Aer Condiționat",
    description: "Climatizare eficientă cu tehnologie eco-friendly. Confort maxim, consum minim.",
    icon: Wind,
    image: airConditioner,
    features: ["A+++", "Inverter", "Wi-Fi"]
  },
  {
    title: "Dezumidificatoare",
    description: "Controlează umiditatea pentru un mediu sănătos. Previn mucegaiul și alergiile.",
    icon: Droplets,
    image: dehumidifier,
    features: ["Silențios", "Auto-stop", "Eficient"]
  },
  {
    title: "Purificatoare Aer",
    description: "Elimină poluanții, alergenii și virușii. Aer pur pentru toată familia.",
    icon: Sparkles,
    image: airPurifier,
    features: ["HEPA", "Ionizare", "Smart"]
  }
];

const ProductCategories = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Gama Noastră de Produse
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Soluții complete pentru confortul și sănătatea ta
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <Card 
                key={index} 
                className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-card/50 backdrop-blur-sm animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={category.image} 
                    alt={category.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground p-3 rounded-full">
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-foreground">{category.title}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  
                  <div className="flex gap-2 mb-6">
                    {category.features.map((feature, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <Link to="/products" className="w-full">
                    <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/5">
                      Vezi Produsele
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

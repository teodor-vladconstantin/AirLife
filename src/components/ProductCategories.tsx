import { Link } from "@/lib/router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { CategorySummary } from "@/lib/catalog";

// Cards come from the database: only categories that have real products with photos.
const ProductCategories = ({ categories }: { categories: CategorySummary[] }) => {
  if (!categories.length) return null;
  return (
    <section className="py-20 bg-gradient-to-b from-background to-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-in fade-in duration-700">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 block">Magazin online HVAC</span>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">Categorii de produse</h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Aparate, ventilație și accesorii pentru un aer curat acasă sau la birou. Livrare prin curier în toată țara.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => (
            <Card key={c.slug} className="group flex flex-col justify-between overflow-hidden border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-lg bg-card">
              <div>
                <div className="relative h-48 bg-white flex items-center justify-center p-4 border-b border-border/40">
                  <img src={c.image} alt={c.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{c.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3">{c.description}</p>
                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[11px] font-medium rounded-md">
                    {c.count} {c.count === 1 ? "produs" : "produse"}
                  </span>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Link to={`/${c.slug}`} className="w-full block">
                  <Button variant="outline" size="sm" className="w-full justify-between text-xs group-hover:border-primary/40 group-hover:bg-primary/5">
                    Explorează categoria
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;

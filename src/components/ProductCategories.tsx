import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { CategorySummary } from "@/lib/catalog";

const FEATURED = 6;

// Cards come from the database: only categories that have real products with photos.
// Home shows the 6 biggest; the rest live in the menu and on /produse.
const ProductCategories = ({ categories }: { categories: CategorySummary[] }) => {
  if (!categories.length) return null;
  const sorted = [...categories].sort((a, b) => b.count - a.count);
  const shown = sorted.filter((c) => c.image).slice(0, FEATURED);
  const rest = sorted.filter((c) => !shown.includes(c));
  return (
    <section className="section bg-background">
      <div className="container mx-auto px-4">
        <div className="section-head">
          <span className="eyebrow">Magazin online HVAC</span>
          <h2 className="text-title mb-3">Categorii de produse</h2>
          <p className="text-lead">Aparate, ventilație și accesorii pentru un aer curat acasă sau la birou. Livrare prin curier în toată țara.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3">
          {shown.map((c) => (
            <Link
              key={c.slug}
              to={`/${c.slug}`}
              className="group flex flex-col"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-secondary/70 p-4">
                <img src={c.image} alt={`${c.name} - AirLife Buzău`} className="h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="flex flex-1 flex-col gap-1 pt-3">
                <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary md:text-base">{c.title}</h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{c.description}</p>
                <p className="mt-auto pt-1 text-xs font-medium text-primary">{c.count} {c.count === 1 ? "produs" : "produse"}</p>
              </div>
            </Link>
          ))}
        </div>

        {rest.length > 0 && (
          <nav aria-label="Toate categoriile" className="mt-8">
            <p className="mb-3 text-center text-sm font-semibold text-foreground">Alte categorii</p>
            <ul className="flex flex-wrap justify-center gap-2">
              {rest.map((c) => (
                <li key={c.slug}>
                  <Link to={`/${c.slug}`} className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground hover:border-primary hover:text-primary">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-8 text-center">
          <Link to="/produse" className="inline-block">
            <Button variant="outline" size="lg" className="group">
              Vezi toate produsele
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;

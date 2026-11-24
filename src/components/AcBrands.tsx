import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/router";
import { DEFAULT_FILTERS, toQuery } from "@/lib/shop";
import type { BrandSummary } from "@/lib/catalog";
import { BRAND_LOGOS } from "@/data/brandLogos";

// Brands of the air conditioners in the shop; each opens the product list filtered by that brand.
const AcBrands = ({ brands }: { brands: BrandSummary[] }) => {
  if (!brands.length) return null;
  return (
    <section className="bg-background py-16 md:py-20" aria-labelledby="ac-brands-h">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-primary">Aer condiționat</span>
          <h2 id="ac-brands-h" className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Branduri de aer condiționat</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">Alege un brand și vezi toate modelele disponibile. Livrare în toată țara, montaj în Buzău și în tot județul.</p>
        </div>
        <ul className="mx-auto grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {brands.map((b) => (
            <li key={b.name}>
              <Link
                to={`/produse${toQuery({ ...DEFAULT_FILTERS, categories: b.categories, brands: [b.name] })}`}
                className="group flex h-full min-h-28 flex-col items-center justify-center rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary/40 hover:shadow-md"
                aria-label={`${b.name}: ${b.count} ${b.count === 1 ? "model" : "modele"} de aer condiționat`}
              >
                {BRAND_LOGOS[b.name] ? (
                  <img src={BRAND_LOGOS[b.name]} alt={b.name} loading="lazy" decoding="async" className="h-10 w-auto max-w-full object-contain md:h-12" />
                ) : (
                  <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary md:text-2xl">{b.name}</span>
                )}
                <span className="mt-1 text-xs text-muted-foreground">{b.count} {b.count === 1 ? "model" : "modele"}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted-foreground">
          Mărcile și siglele aparțin proprietarilor lor și sunt afișate doar pentru a identifica produsele din magazin. AirLife nu este afiliat cu aceste mărci.
        </p>
        <div className="mt-6 text-center">
          <Link to="/aer-conditionat" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
            Vezi toate aparatele de aer condiționat <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AcBrands;

import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import type { ProductCardData } from "@/lib/shop";

// Featured grid (newest products in stock): lets visitors reach a product from the first screen of the home page.
const FeaturedProducts = ({ products }: { products: ProductCardData[] }) => {
  if (!products.length) return null;
  return (
    <section className="section bg-background" aria-labelledby="featured-h">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-end justify-between gap-4 md:mb-8">
          <h2 id="featured-h" className="text-title">Produse noi</h2>
          <Link to="/produse" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-primary hover:underline">
            Vezi toate <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-6 lg:grid-cols-4">
          {products.map((p, i) => (
            <div key={p.id} className={i >= 4 ? "hidden min-w-0 lg:block" : "min-w-0"}>
              <ProductCard product={p} priority={i < 2} />
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/produse" className="inline-block">
            <Button variant="outline" size="lg">Vezi toate produsele</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

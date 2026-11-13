"use client";
import { useEffect } from "react";
import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { CATEGORIES_DATA } from "@/data/categoriesData";
import type { StaticProduct } from "@/data/initialProducts";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";
import {
  Package,
  CheckCircle2,
  HelpCircle,
  Wrench,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CategoryPageProps {
  forcedSlug: string;
  products: StaticProduct[];
}

const CategoryPage = ({ forcedSlug, products }: CategoryPageProps) => {
  const activeSlug = forcedSlug;
  const categoryInfo = CATEGORIES_DATA[activeSlug];

  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSlug]);

  const handleAddToCart = async (product: StaticProduct) => {
    if (product.stock <= 0) return;
    try {
      await addToCart(product, 1);
      trackAddToCart({
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
        quantity: 1,
      });
      toast({
        title: "Adăugat în coș",
        description: `${product.name} a fost adăugat în coșul tău.`,
      });
    } catch {
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga produsul în coș.",
        variant: "destructive",
      });
    }
  };

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Categoria nu a fost găsită</h1>
          <p className="text-muted-foreground mb-6">
            Categoria solicitată nu există sau a fost mutată.
          </p>
          <Link to="/products">
            <Button>Vezi Toate Produsele</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": categoryInfo.h1,
    "description": categoryInfo.description,
    "url": `https://airlife.ro/${categoryInfo.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products.map((prod, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://airlife.ro/products/${prod.slug ?? prod.id}`,
        "name": prod.name,
      })),
    },
  };

  const breadcrumbsData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Acasă",
        "item": "https://airlife.ro/",
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Produse",
        "item": "https://airlife.ro/products",
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": categoryInfo.name,
        "item": `https://airlife.ro/${categoryInfo.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={categoryInfo.title}
        description={categoryInfo.metaDescription}
        canonical={`https://airlife.ro/${categoryInfo.slug}`}
        structuredData={[structuredData, breadcrumbsData]}
      />

      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">
                  Acasă
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Produse
                </Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium">{categoryInfo.name}</li>
            </ol>
          </nav>

          {/* Category Header */}
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              {categoryInfo.h1}
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              {categoryInfo.description}
            </p>
          </div>

          {/* Products Grid */}
          <div className="mb-16">
            {products.length === 0 ? (
              <Card className="p-8 text-center bg-card border-border max-w-2xl mx-auto">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-xl font-bold text-foreground mb-2">
                  Stoc în curs de reaprovizionare
                </h3>
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  Pregătim gama de echipamente și produse pentru această categorie. Pentru comenzi speciale sau consultanță tehnică dedicată, contactează echipa AirLife.
                </p>
                <div className="flex justify-center gap-3">
                  <Link to="/contact">
                    <Button variant="default">Contactează-ne</Button>
                  </Link>
                  <Link to="/products">
                    <Button variant="outline">Toate Produsele</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="flex flex-col justify-between border-border hover:border-primary/40 transition-all duration-300 hover:shadow-md bg-card overflow-hidden"
                  >
                    <div>
                      <div className="relative aspect-video bg-white flex items-center justify-center p-4 border-b border-border/40">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                        <span className="absolute top-2 right-2 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground border border-border">
                          {product.stock > 0 ? "În Stoc" : "La Comandă"}
                        </span>
                      </div>

                      <CardContent className="p-5">
                        <span className="text-xs font-semibold text-primary block mb-1">
                          {product.category}
                        </span>
                        <h2 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                          <Link
                            to={`/products/${product.slug ?? product.id}`}
                            className="hover:text-primary transition-colors"
                            onClick={() =>
                              trackViewItem({
                                item_id: product.id,
                                item_name: product.name,
                                price: product.price,
                                item_category: product.category,
                              })
                            }
                          >
                            {product.name}
                          </Link>
                        </h2>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
                          {product.description}
                        </p>

                        {product.features && product.features.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {product.features.slice(0, 3).map((f, i) => (
                              <span
                                key={i}
                                className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="flex items-center justify-between mb-4 pt-3 border-t border-border/50">
                        <div>
                          <span className="text-2xl font-bold text-primary">
                            {product.price.toFixed(2)} RON
                          </span>
                          <span className="block text-[11px] text-muted-foreground">Preț fără TVA (neplătitor TVA)</span>
                        </div>
                        <div className="text-right text-[11px] text-muted-foreground flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" />
                          <span>Stoc: {product.stock} buc</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link to={`/products/${product.slug ?? product.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            Detalii
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="flex-1 text-xs"
                          disabled={product.stock <= 0}
                          onClick={() => handleAddToCart(product)}
                        >
                          Adaugă în Coș
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Category Buying Guide */}
          <div className="bg-card border border-border p-6 md:p-8 rounded-2xl mb-12 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-primary" />
              {categoryInfo.buyingGuide.title}
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {categoryInfo.buyingGuide.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contextual Link to Local Services in */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Servicii HVAC
              </span>
              <h3 className="text-xl font-bold text-foreground mt-1 mb-2">
                Ai nevoie de ajutor cu montajul sau igienizarea?
              </h3>
              <p className="text-sm text-muted-foreground max-w-xl">
                Echipa Airlife asigură montaj autorizat, igienizare profesională și mentenanță periodică pentru sistemele de aer condiționat în toată țara.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
              {activeSlug.includes("curatare") ? (
                <Link to="/servicii/igienizare-aer-conditionat" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Serviciu Igienizare
                  </Button>
                </Link>
              ) : (
                <Link to="/servicii/montaj-aer-conditionat" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto flex items-center gap-2">
                    <Wrench className="w-4 h-4" /> Serviciu Montaj
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CategoryPage;

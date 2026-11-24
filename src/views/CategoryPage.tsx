"use client";
import { useEffect } from "react";
import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { CATEGORIES_DATA } from "@/data/categoriesData";
import { faqSchema } from "@/lib/blogSchema";
import type { ProductCardData } from "@/lib/shop";
import { CollectionView } from "@/components/shop/CollectionView";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  CheckCircle2,
  HelpCircle,
  Wrench,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

interface CategoryPageProps {
  forcedSlug: string;
  cards: ProductCardData[];
}

const CategoryPage = ({ forcedSlug, cards }: CategoryPageProps) => {
  const activeSlug = forcedSlug;
  const categoryInfo = CATEGORIES_DATA[activeSlug];


  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeSlug]);

  if (!categoryInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Categoria nu a fost găsită</h1>
          <p className="text-muted-foreground mb-6">
            Categoria solicitată nu există sau a fost mutată.
          </p>
          <Link to="/produse">
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
      "itemListElement": cards.slice(0, 100).map((prod, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "url": `https://airlife.ro/produse/${prod.slug}`,
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
        "item": "https://airlife.ro/produse",
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
        noindex={cards.length === 0}
        structuredData={categoryInfo.faq ? [structuredData, breadcrumbsData, faqSchema(categoryInfo.faq)] : [structuredData, breadcrumbsData]}
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
                <Link to="/produse" className="hover:text-primary transition-colors">
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
            {cards.length === 0 ? (
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
                  <Link to="/produse">
                    <Button variant="outline">Toate Produsele</Button>
                  </Link>
                </div>
              </Card>
            ) : (
              <CollectionView cards={cards} hideCategory heading={categoryInfo.name} />
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

          {categoryInfo.faq && (
            <section className="bg-card border border-border p-6 md:p-8 rounded-2xl mb-12 shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-4">Întrebări frecvente: {categoryInfo.name}</h2>
              <div className="space-y-4">
                {categoryInfo.faq.map((f) => (
                  <div key={f.q}>
                    <h3 className="font-semibold text-foreground">{f.q}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{f.a}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

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
                Echipa AirLife asigură montaj autorizat, igienizare profesională și mentenanță periodică pentru sistemele de aer condiționat în Buzău și în tot județul Buzău.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0 w-full sm:w-auto">
              {activeSlug.includes("curatare") ? (
                <Link to="/servicii/igienizare-aer-conditionat-buzau" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> Serviciu Igienizare
                  </Button>
                </Link>
              ) : (
                <Link to="/servicii/montaj-aer-conditionat-buzau" className="w-full sm:w-auto">
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

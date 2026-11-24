"use client";
import { Link } from "@/lib/router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { CollectionView } from "@/components/shop/CollectionView";
import type { ProductCardData } from "@/lib/shop";

const Products = ({ cards }: { cards: ProductCardData[] }) => {
  const listSchema = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Produse HVAC AirLife",
      url: "https://airlife.ro/produse",
      isPartOf: { "@id": "https://airlife.ro/#website" },
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: Math.min(cards.length, 100),
        itemListElement: cards.slice(0, 100).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `https://airlife.ro/produse/${p.slug}`, name: p.name })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Acasă", item: "https://airlife.ro/" },
        { "@type": "ListItem", position: 2, name: "Produse", item: "https://airlife.ro/produse" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={listSchema} />
      <Navbar />
      <main className="flex-1 bg-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Acasă</Link> / <span className="font-medium text-foreground">Produse</span>
          </nav>
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Produse</h1>
          <CollectionView cards={cards} heading="Toate produsele" />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;

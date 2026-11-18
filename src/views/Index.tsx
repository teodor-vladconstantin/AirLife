"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeServicesSection from "@/components/HomeServicesSection";
import ProductCategories from "@/components/ProductCategories";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { AREA_SERVED } from "@/data/localSeo";

const Index = () => {
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://airlife.ro/#website",
        "url": "https://airlife.ro/",
        "name": "AirLife",
        "description": "Magazin online HVAC și servicii de climatizare în Buzău",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://airlife.ro/products?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "HVACBusiness",
        "@id": "https://airlife.ro/#localbusiness",
        "name": "AirLife",
        "url": "https://airlife.ro/",
        "telephone": "+40722153525",
        "image": "https://airlife.ro/placeholder.svg",
        "priceRange": "$$",
        "areaServed": AREA_SERVED,
        "description": "Montaj, igienizare și service aer condiționat în Buzău și județul Buzău. Magazin online HVAC cu livrare în toată țara."
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="AirLife Buzău | Magazin HVAC și Servicii Aer Condiționat"
        description="Montaj, igienizare și service aer condiționat în Buzău și tot județul, cu echipa AirLife sau parteneri. Magazin online HVAC cu livrare în toată țara."
        canonical="https://airlife.ro/"
        structuredData={homeStructuredData}
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HomeServicesSection />
        <ProductCategories />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

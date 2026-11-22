"use client";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeServicesSection from "@/components/HomeServicesSection";
import ProductCategories from "@/components/ProductCategories";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import type { CategorySummary } from "@/lib/catalog";

const Index = ({ categories = [] }: { categories?: CategorySummary[] }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="AirLife Buzău | Magazin HVAC și Servicii Aer Condiționat"
        description="Magazin online HVAC cu livrare în toată țara: aer condiționat, dezumidificatoare, ventilatoare și accesorii. Montaj, igienizare și service în Buzău."
        canonical="https://airlife.ro/"
      />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HomeServicesSection />
        <ProductCategories categories={categories} />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

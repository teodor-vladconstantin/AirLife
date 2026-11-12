import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeServicesSection from "@/components/HomeServicesSection";
import ProductCategories from "@/components/ProductCategories";
import Features from "@/components/Features";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Index = () => {
  const homeStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://airlife.ro/#website",
        "url": "https://airlife.ro/",
        "name": "AirLife",
        "description": "Magazin online HVAC și servicii locale de climatizare în Buzău",
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
        "image": "https://airlife.ro/placeholder.svg",
        "priceRange": "$$",
        "areaServed": [
          {
            "@type": "City",
            "name": "Buzău"
          },
          {
            "@type": "AdministrativeArea",
            "name": "Județul Buzău"
          }
        ],
        "description": "Magazin online accesorii & consumabile HVAC și servicii profesionale de montaj, igienizare și service aer condiționat în Buzău."
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="AirLife | Magazin Online HVAC & Servicii Aer Condiționat Buzău"
        description="AirLife.ro — Magazin online HVAC cu accesorii, consumabile și soluții de climatizare. Servicii complete de montaj, igienizare și service aer condiționat în Buzău."
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

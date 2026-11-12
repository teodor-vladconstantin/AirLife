import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import NotFound from "@/pages/NotFound";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Phone } from "lucide-react";
import { getLocalPage, PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";
import { trackClickToCall } from "@/lib/analytics";

const LocalService = () => {
  const { service = "", locality = "" } = useParams();
  const page = getLocalPage(service, locality);
  if (!page) return <NotFound />;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: page.h1,
      areaServed: { "@type": "Place", name: page.h1.split(" în ")[1] },
      provider: { "@type": "HVACBusiness", name: "AirLife", telephone: PHONE_TEL, url: "https://airlife.ro/" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: page.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SEO title={page.title} description={page.description} canonical={`https://airlife.ro${page.path}`} structuredData={structuredData} />
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-3xl space-y-10">
          <header className="space-y-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{page.h1}</h1>
            <p className="text-muted-foreground text-lg">{page.intro}</p>
            <p>{page.localNote}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <a href={`tel:${PHONE_TEL}`} onClick={() => trackClickToCall(`local-${page.path}`)}>
                  <Phone className="w-4 h-4 mr-2" />
                  {PHONE_DISPLAY}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/request-quote">Cere ofertă online</Link>
              </Button>
            </div>
          </header>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Ce include</h2>
            <ul className="space-y-2">
              {page.includes.map((i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  {i}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cum decurge</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {page.steps.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Întrebări frecvente</h2>
            <div className="space-y-4">
              {page.faqs.map((f) => (
                <div key={f.q}>
                  <h3 className="font-medium">{f.q}</h3>
                  <p className="text-muted-foreground">{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <LeadMagnetForm
            magnet="checklist-intretinere-ac"
            title="Checklist gratuit de întreținere pentru aer condiționat"
            description="Ce verifici înainte de sezon și când chemi un specialist. PDF trimis pe email."
            source={`local:${page.path}`}
          />

          <nav aria-label="Pagini asemănătoare">
            <h2 className="text-xl font-semibold mb-3">Vezi și</h2>
            <ul className="grid sm:grid-cols-2 gap-2">
              {page.related.map((r) => (
                <li key={r.path}>
                  <Link to={r.path} className="text-primary hover:underline">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LocalService;

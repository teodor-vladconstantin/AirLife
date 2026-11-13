import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { company } from "@/data/company";

export type LegalSection = { title: string; body: ReactNode };

const LegalLayout = ({ title, seoTitle, description, canonical, sections }: {
  title: string; seoTitle: string; description: string; canonical: string; sections: LegalSection[];
}) => (
  <div className="min-h-screen flex flex-col">
    <SEO title={seoTitle} description={description} canonical={canonical} />
    <Navbar />
    <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground mb-8">Ultima actualizare: {company.effectiveDate}</p>
        {sections.map((s, i) => (
          <Card key={s.title} className="mb-6">
            <CardHeader><CardTitle>{i + 1}. {s.title}</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-muted-foreground leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_a]:text-primary [&_a]:underline">
              {s.body}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default LegalLayout;

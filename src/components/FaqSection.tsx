// Visible FAQ list; pair it with faqSchema(faq) in the page's structuredData.
export const FaqSection = ({ title, faq }: { title: string; faq: { q: string; a: string }[] }) => (
  <section className="bg-card border border-border p-6 md:p-8 rounded-2xl shadow-sm">
    <h2 className="text-2xl font-bold text-foreground mb-4">{title}</h2>
    <div className="space-y-4">
      {faq.map((f) => (
        <div key={f.q}>
          <h3 className="font-semibold text-foreground">{f.q}</h3>
          <p className="text-sm text-muted-foreground mt-1">{f.a}</p>
        </div>
      ))}
    </div>
  </section>
);

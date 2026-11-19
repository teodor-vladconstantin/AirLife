import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = { title: "Comanda a fost înregistrată | AirLife", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ o?: string }> }) {
  const { o } = await searchParams;
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 flex items-center">
        <div className="container mx-auto px-4 py-20 max-w-xl text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Mulțumim. Comanda e înregistrată.</h1>
          {o && <p className="text-lg text-muted-foreground mb-2">Număr comandă: <strong className="text-foreground">{o}</strong></p>}
          <p className="text-muted-foreground mb-8">Îți trimitem confirmarea pe email. Dacă ai plătit prin card, primești și chitanța de la Stripe. Te sunăm doar dacă avem nevoie de o clarificare.</p>
          <Link href="/products" className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold">Înapoi la produse</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";
import { trackClickToCall } from "@/lib/analytics";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";

// One primary action (call); message and installation booking are quiet text links.
const CTASection = () => {
  return (
    <section className="section bg-foreground text-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-title mb-3 !text-background">Pregătit pentru un aer curat și confortabil?</h2>
          <p className="mb-8 text-base leading-relaxed text-background/80 md:text-lg">
            Fie că ai nevoie de aparate de aer condiționat și ventilație livrate rapid sau de montaj și igienizare profesională, echipa AirLife îți stă la dispoziție.
          </p>

          <a href={`tel:${PHONE_TEL}`} onClick={() => trackClickToCall("home-cta")} className="inline-block w-full sm:w-auto">
            <Button size="lg" className="w-full bg-background text-foreground hover:bg-background/90 sm:w-auto">
              <PhoneCall className="mr-2 h-4 w-4 text-primary" />
              Sună acum: {PHONE_DISPLAY}
            </Button>
          </a>

          <p className="mt-5 text-sm text-background/80">
            <Link to="/contact" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:text-background">Trimite un mesaj</Link>
            <span aria-hidden className="mx-3">·</span>
            <Link to="/servicii/montaj-aer-conditionat-buzau" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:text-background">Programare montaj</Link>
          </p>
          <dl className="mt-8 grid gap-4 border-t border-background/20 pt-6 text-sm text-background/80 sm:grid-cols-3">
            <div><dt className="font-semibold text-background">Program Asistență</dt><dd>Luni – Vineri: 09:00 – 18:00<br />Sâmbătă: 10:00 – 14:00</dd></div>
            <div><dt className="font-semibold text-background">Livrare Curier</dt><dd>Gratuit peste 1000 RON</dd></div>
            <div><dt className="font-semibold text-background">Servicii Montaj</dt><dd>Buzău și tot județul</dd></div>
          </dl>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

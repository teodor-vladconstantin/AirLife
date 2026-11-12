import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Wrench, PhoneCall } from "lucide-react";
import { trackClickToCall } from "@/lib/analytics";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-primary to-emerald-700 relative overflow-hidden text-primary-foreground">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center animate-in fade-in duration-700">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
          >
            Pregătit pentru un Aer Curat și Confortabil?
          </h2>
          <p
            className="text-base md:text-lg mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.2)" }}
          >
            Fie că ai nevoie de produse și accesorii HVAC livrate rapid sau de montaj și igienizare profesională în Buzău, echipa AirLife îți stă la dispoziție.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <a href={`tel:${PHONE_TEL}`} onClick={() => trackClickToCall("home-cta")} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <PhoneCall className="mr-2 w-4 h-4 text-primary" />
                Sună acum: {PHONE_DISPLAY}
              </Button>
            </a>
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-white text-foreground hover:bg-white/90 font-semibold shadow-md transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <Mail className="mr-2 w-4 h-4 text-primary" />
                Trimite un Mesaj
              </Button>
            </Link>
            <Link to="/servicii/montaj-aer-conditionat-buzau">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10 hover:text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <Wrench className="mr-2 w-4 h-4" />
                Programare Montaj Buzău
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/20 text-xs opacity-90">
            <div>
              <div className="font-bold text-sm mb-0.5">Program Asistență</div>
              <div>Luni – Vineri: 09:00 – 18:00</div>
            </div>
            <div>
              <div className="font-bold text-sm mb-0.5">Livrare Curier</div>
              <div>20 RON / Gratuit peste 500 RON</div>
            </div>
            <div>
              <div className="font-bold text-sm mb-0.5">Servicii Locale</div>
              <div>Buzău &amp; Localități Limitrofe</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

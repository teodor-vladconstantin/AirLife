import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, ShieldCheck, MapPin, Truck } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Soluții climatizare și HVAC AirLife"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/20 border border-primary/40 rounded-full mb-6 animate-in fade-in duration-700 backdrop-blur-sm">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-white">
            Magazin HVAC Online &amp; Servicii Locale
          </span>
        </div>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 text-white leading-tight animate-in fade-in duration-700 max-w-4xl mx-auto"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
        >
          Climatizare Eficientă,<br />
          <span className="text-primary">Aer Curat în Fiecare Zi</span>
        </h1>

        <p
          className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto animate-in fade-in duration-700 leading-relaxed"
          style={{ textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
        >
          Accesorii și consumabile HVAC cu livrare rapidă în toată țara, plus montaj profesional, igienizare și service autorizat în municipiul Buzău.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in duration-700">
          <Link to="/products">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 group w-full sm:w-auto font-semibold px-8"
            >
              Vezi Produsele Online
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/servicii">
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white/60 text-white hover:bg-white/10 hover:text-white transition-all duration-300 hover:-translate-y-0.5 w-full sm:w-auto font-semibold px-8"
            >
              <Wrench className="mr-2 w-4 h-4" />
              Servicii
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto mt-16 pt-10 border-t border-white/20">
          <div className="text-center animate-in fade-in duration-700">
            <div className="flex justify-center mb-2">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div className="text-lg font-bold text-white mb-0.5">Buzău &amp; Județ</div>
            <div className="text-xs text-white/80">Montaj &amp; igienizare locală</div>
          </div>
          <div className="text-center animate-in fade-in duration-700">
            <div className="flex justify-center mb-2">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <div className="text-lg font-bold text-white mb-0.5">Livrare Rapidă</div>
            <div className="text-xs text-white/80">Gratuit peste 500 RON</div>
          </div>
          <div className="text-center animate-in fade-in duration-700">
            <div className="flex justify-center mb-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <div className="text-lg font-bold text-white mb-0.5">Garanție Legală</div>
            <div className="text-xs text-white/80">24 luni persoane fizice</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

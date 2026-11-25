import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, MapPin, Truck } from "lucide-react";
import hero1920 from "@/assets/hero-image-1920.webp";
import hero1024 from "@/assets/hero-image-1024.webp";

const Hero = () => {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-foreground md:min-h-[70vh]">
      <div className="absolute inset-0">
        <img
          src={hero1920.src}
          srcSet={`${hero1024.src} 1024w, ${hero1920.src} 1920w`}
          sizes="100vw"
          width={1920}
          height={1080}
          alt="Soluții climatizare și HVAC în Buzău - AirLife"
          className="h-full w-full object-cover"
          loading="eager"
          // React 18 has no fetchPriority prop; the lowercase attribute is passed to the DOM as is
          {...{ fetchpriority: "high" }}
        />
        <div className="absolute inset-0 bg-black/65" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16 text-center md:py-24">
        <p className="mb-4 flex items-center justify-center gap-2 text-sm font-medium text-white animate-in fade-in duration-700">
          <MapPin className="h-4 w-4 text-brandlight" />
          Magazin HVAC Online &amp; Servicii în Buzău
        </p>

        <h1
          className="text-display mx-auto mb-4 max-w-3xl text-white animate-in fade-in duration-700"
          style={{ textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}
        >
          Magazin HVAC și Servicii <br />
          <span className="text-brandlight">Aer Condiționat Buzău</span>
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-white md:text-lg animate-in fade-in duration-700">
          Aparate de aer condiționat și ventilație cu livrare rapidă în toată țara, plus montaj, igienizare și service aer condiționat în Buzău și tot județul.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row animate-in fade-in duration-700">
          <Link to="/produse" className="w-full sm:w-auto">
            <Button size="lg" className="group w-full sm:w-auto">
              Vezi produsele
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link to="/servicii" className="w-full sm:w-auto">
            <Button size="lg" variant="ghost" className="w-full text-white hover:bg-white/10 hover:text-white sm:w-auto">
              Servicii montaj
            </Button>
          </Link>
        </div>

        <ul className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-2 border-t border-white/20 pt-5 text-xs text-white sm:gap-4 sm:pt-6 sm:text-base">
          <li><MapPin className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-brandlight" /><span className="block font-semibold">Buzău &amp; Județ</span><span className="hidden text-sm sm:block">Montaj &amp; igienizare</span></li>
          <li><Truck className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-brandlight" /><span className="block font-semibold">Livrare Rapidă</span><span className="hidden text-sm sm:block">Gratuit peste 1000 RON</span></li>
          <li><ShieldCheck className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-brandlight" /><span className="block font-semibold">Garanție Legală</span><span className="hidden text-sm sm:block">24 luni persoane fizice</span></li>
        </ul>
      </div>
    </section>
  );
};

export default Hero;

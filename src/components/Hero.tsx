import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-secondary to-background">
      <div className="absolute inset-0">
        <img 
          src={heroImage} 
          alt="Eco-friendly HVAC solutions" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 animate-in fade-in duration-700">
          <Leaf className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">100% Eco-Friendly</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight animate-in fade-in duration-700" style={{textShadow: '0 2px 16px rgba(0,0,0,0.32)'}}>
          Aer Curat,<br />
          <span className="text-primary">Viață Pură</span>
        </h1>

        <p className="text-xl md:text-2xl text-white mb-12 max-w-3xl mx-auto animate-in fade-in duration-700" style={{textShadow: '0 2px 12px rgba(0,0,0,0.24)'}}>
          Soluții HVAC sustenabile pentru o casă mai sănătoasă și un mediu mai curat.
          Economisește energie, respiră aer pur.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-in fade-in duration-700">
          <Link to="/products">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              Descoperă Produsele
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 transition-all duration-300 hover:-translate-y-1">
            Află Mai Multe
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 pt-12 border-t border-border/50">
          <div className="text-center animate-in fade-in duration-700">
            <div className="text-3xl font-bold text-primary mb-2" style={{textShadow: '0 2px 12px rgba(0,0,0,0.24)'}}>95%</div>
            <div className="text-sm text-white" style={{textShadow: '0 2px 8px rgba(0,0,0,0.18)'}}>Eficiență Energetică</div>
          </div>
          <div className="text-center animate-in fade-in duration-700">
            <div className="text-3xl font-bold text-primary mb-2" style={{textShadow: '0 2px 12px rgba(0,0,0,0.24)'}}>10+</div>
            <div className="text-sm text-white" style={{textShadow: '0 2px 8px rgba(0,0,0,0.18)'}}>Ani Garanție</div>
          </div>
          <div className="text-center animate-in fade-in duration-700">
            <div className="text-3xl font-bold text-primary mb-2" style={{textShadow: '0 2px 12px rgba(0,0,0,0.24)'}}>5000+</div>
            <div className="text-sm text-white" style={{textShadow: '0 2px 8px rgba(0,0,0,0.18)'}}>Clienți Fericiți</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

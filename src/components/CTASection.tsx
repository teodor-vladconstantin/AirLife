import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-primary-foreground animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{textShadow: '0 2px 16px rgba(0,0,0,0.32)'}}>
            Începe Să Respiri Mai Sănătos Astăzi
          </h2>
          <p className="text-xl mb-10 opacity-90" style={{textShadow: '0 2px 12px rgba(0,0,0,0.24)'}}>
            Contactează-ne pentru o consultație gratuită și descoperă soluția perfectă pentru casa ta
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button size="lg" className="bg-white text-black hover:bg-white hover:text-black transition-all duration-300 hover:-translate-y-1">
              <Mail className="mr-2 w-5 h-5" />
              Trimite Mesaj
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-black hover:bg-white hover:text-black transition-all duration-300 hover:-translate-y-1">
              <Phone className="mr-2 w-5 h-5" />
              Sună Acum
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-8 justify-center text-sm opacity-90" style={{textShadow: '0 2px 8px rgba(0,0,0,0.18)'}}>
            <div>
              <div className="font-semibold mb-1">Program</div>
              <div>Luni - Vineri: 9:00 - 18:00</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Livrare</div>
              <div>Gratuită în toată România</div>
            </div>
            <div>
              <div className="font-semibold mb-1">Instalare</div>
              <div>Profesională inclusă</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;

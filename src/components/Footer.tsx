import { Leaf } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">AirLife</span>
            </div>
            <p className="text-sm opacity-80">
              Soluții HVAC eco-friendly pentru un viitor mai curat și mai sănătos.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Produse</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-primary transition-colors">Aer Condiționat</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Dezumidificatoare</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Purificatoare</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Companie</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-primary transition-colors">Despre Noi</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Service</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:text-primary transition-colors">Termeni și Condiții</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Politica de Confidențialitate</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; 2025 AirLife.ro. Toate drepturile rezervate.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

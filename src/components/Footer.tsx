import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

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
              <li><Link to="/products" className="hover:text-primary transition-colors">Toate Produsele</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Aer Condiționat</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Dezumidificatoare</Link></li>
              <li><Link to="/products" className="hover:text-primary transition-colors">Purificatoare Aer</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Companie</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/about" className="hover:text-primary transition-colors">Despre Noi</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/my-orders" className="hover:text-primary transition-colors">Solicitările Mele</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link to="/terms" className="hover:text-primary transition-colors">Termeni și Condiții</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Politica de Confidențialitate</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Date de Contact</Link></li>
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

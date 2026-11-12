import { Leaf, MapPin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";
import { trackClickToCall } from "@/lib/analytics";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-14 border-t border-border/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">AirLife</span>
            </Link>
            <p className="text-sm opacity-80 max-w-sm leading-relaxed">
              Magazin online HVAC și servicii locale dedicate pentru sisteme de climatizare în Buzău. Accesorii, consumabile și montaj profesional executat curat, cu pompă de vidare.
            </p>
            <div className="space-y-2 text-xs opacity-75 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Buzău, România (Arie servicii: municipiul Buzău și județ)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href={`tel:${PHONE_TEL}`} onClick={() => trackClickToCall("footer")} className="hover:underline">
                  {PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:contact@airlife.ro" className="hover:underline">
                  contact@airlife.ro
                </a>
              </div>
            </div>
          </div>

          {/* Categorii Magazin */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white uppercase tracking-wider">Magazin HVAC</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  Toate Produsele
                </Link>
              </li>
              <li>
                <Link to="/curatare-si-intretinere" className="hover:text-primary transition-colors">
                  Curățare &amp; Igienizare
                </Link>
              </li>
              <li>
                <Link to="/accesorii-aer-conditionat" className="hover:text-primary transition-colors">
                  Accesorii Aer Condiționat
                </Link>
              </li>
              <li>
                <Link to="/consumabile-hvac" className="hover:text-primary transition-colors">
                  Consumabile HVAC
                </Link>
              </li>
              <li>
                <Link to="/filtre-purificatoare" className="hover:text-primary transition-colors">
                  Filtre Purificatoare
                </Link>
              </li>
            </ul>
          </div>

          {/* Servicii Locale Buzău */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white uppercase tracking-wider">Servicii Buzău</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link to="/servicii" className="hover:text-primary transition-colors">
                  Toate Serviciile
                </Link>
              </li>
              <li>
                <Link to="/servicii/montaj-aer-conditionat-buzau" className="hover:text-primary transition-colors">
                  Montaj Aer Condiționat
                </Link>
              </li>
              <li>
                <Link to="/servicii/igienizare-aer-conditionat-buzau" className="hover:text-primary transition-colors">
                  Igienizare &amp; Dezinfectare
                </Link>
              </li>
              <li>
                <Link to="/servicii/service-aer-conditionat-buzau" className="hover:text-primary transition-colors">
                  Service &amp; Reparații
                </Link>
              </li>
              <li>
                <Link to="/ghid/cost-montaj-aer-conditionat-buzau" className="hover:text-primary transition-colors">
                  Ghid Cost Montaj
                </Link>
              </li>
            </ul>
          </div>

          {/* Informații Legale & Suport */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white uppercase tracking-wider">Informații &amp; Legal</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/despre-noi" className="hover:text-primary transition-colors">
                  Despre Noi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors">
                  Contact &amp; Suport
                </Link>
              </li>
              <li>
                <Link to="/livrare-si-retur" className="hover:text-primary transition-colors">
                  Livrare și Retur
                </Link>
              </li>
              <li>
                <Link to="/garantie" className="hover:text-primary transition-colors">
                  Condiții de Garanție
                </Link>
              </li>
              <li>
                <Link to="/termeni-si-conditii" className="hover:text-primary transition-colors">
                  Termeni și Condiții
                </Link>
              </li>
              <li>
                <Link to="/politica-de-confidentialitate" className="hover:text-primary transition-colors">
                  Confidențialitate (GDPR)
                </Link>
              </li>
              <li>
                <Link to="/politica-de-cookies" className="hover:text-primary transition-colors">
                  Politica de Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-background/20 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs opacity-75 gap-4">
          <p>&copy; {new Date().getFullYear()} AirLife.ro — Toate drepturile rezervate.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px]">Buzău, România</span>
            <span>•</span>
            <Link to="/politica-de-cookies" className="hover:underline">
              Setări Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

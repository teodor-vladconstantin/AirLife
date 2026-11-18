import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "@/lib/router";
import SubscribeForm from "@/components/SubscribeForm";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";
import { trackClickToCall } from "@/lib/analytics";
import { company, SAL_URL, ANPC_URL } from "@/data/company";
import { SOCIAL } from "@/data/social";

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin };

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-14 border-t border-border/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/logo-white.png" alt="AirLife" width={161} height={36} className="h-9 w-auto" loading="lazy" />
            </Link>
            <p className="text-sm opacity-80 max-w-sm leading-relaxed">
              Magazin online HVAC și servicii dedicate pentru sisteme de climatizare. Aparate de aer condiționat, ventilație și montaj în Buzău și tot județul.
            </p>
            <div className="space-y-2 text-xs opacity-75 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <span>Buzău, România (servicii în municipiu și județ)</span>
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
            <ul className="flex items-center gap-3 pt-2">
              {SOCIAL.map((s) => {
                const Icon = SOCIAL_ICONS[s.key];
                return (
                  <li key={s.key}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer me"
                      aria-label={`AirLife pe ${s.label}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-primary transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  </li>
                );
              })}
            </ul>
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
            </ul>
          </div>

          {/* Servicii Locale */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white uppercase tracking-wider">Servicii</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link to="/aer-conditionat-buzau" className="hover:text-primary transition-colors">
                  Aer Condiționat Buzău
                </Link>
              </li>
              <li>
                <Link to="/servicii/montaj-aer-conditionat" className="hover:text-primary transition-colors">
                  Montaj Aer Condiționat
                </Link>
              </li>
              <li>
                <Link to="/servicii/igienizare-aer-conditionat" className="hover:text-primary transition-colors">
                  Igienizare &amp; Dezinfectare
                </Link>
              </li>
              <li>
                <Link to="/servicii/service-aer-conditionat" className="hover:text-primary transition-colors">
                  Service &amp; Reparații
                </Link>
              </li>
              <li>
                <Link to="/ghid/cost-montaj-aer-conditionat" className="hover:text-primary transition-colors">
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

        {/* Newsletter (double opt-in) */}
        <div className="border-t border-background/20 py-8 grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h3 className="font-semibold text-white">Sfaturi de întreținere și oferte sezoniere</h3>
            <p className="text-sm opacity-80 mt-1">Câteva emailuri pe an: ce verifici înainte de sezon și oferte utile.</p>
          </div>
          <SubscribeForm source="footer" dark />
        </div>

        {/* Bottom row */}
        <div className="border-t border-background/20 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs opacity-75 gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <p>&copy; {new Date().getFullYear()} AirLife.ro. Toate drepturile rezervate.</p>
            <p className="text-[11px]">{company.legalName} | CUI {company.cui} | {company.regCom}</p>
            <p className="text-[11px]">
              <a href={SAL_URL} target="_blank" rel="noopener noreferrer" aria-label="ANPC Soluționarea Alternativă a Litigiilor">
                <img src="/legal/anpc-sal-badge.png" alt="ANPC SAL - Soluționarea Alternativă a Litigiilor" width={250} height={62} className="inline-block h-auto w-[250px] max-w-full rounded bg-white" loading="lazy" />
              </a>
              {" | "}
              <a href={ANPC_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">ANPC</a>
            </p>
          </div>
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

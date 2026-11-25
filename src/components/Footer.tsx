"use client";
import PaymentBadges from "@/components/PaymentBadges";
import { MapPin, Mail, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "@/lib/router";
import SubscribeForm from "@/components/SubscribeForm";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";
import { trackClickToCall } from "@/lib/analytics";
import { company, SAL_URL, ANPC_URL } from "@/data/company";
import { SOCIAL } from "@/data/social";

// lucide has no TikTok glyph
const TikTok = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.6 6.7a4.8 4.8 0 0 1-3.8-4.2V2h-3.5v13.4a2.9 2.9 0 1 1-2-2.8V9.1a6.4 6.4 0 1 0 5.5 6.3V8.9a8.2 8.2 0 0 0 4.8 1.5V6.9c-.4 0-.7 0-1-.2z" />
  </svg>
);

const SOCIAL_ICONS = { facebook: Facebook, instagram: Instagram, linkedin: Linkedin, tiktok: TikTok };

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
                <MapPin className="w-4 h-4 text-brandlight flex-shrink-0" />
                <span>Buzău, România (servicii în municipiu și județ)</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brandlight flex-shrink-0" />
                <a href={`tel:${PHONE_TEL}`} onClick={() => trackClickToCall("footer")} className="inline-block py-1.5 hover:underline">
                  {PHONE_DISPLAY}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brandlight flex-shrink-0" />
                <a href="mailto:contact@airlife.ro" className="inline-block py-1.5 hover:underline">
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
                <Link to="/produse" className="hover:text-brandlight transition-colors">
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
                <Link to="/aer-conditionat-buzau" className="hover:text-brandlight transition-colors">
                  Aer Condiționat Buzău
                </Link>
              </li>
              <li>
                <Link to="/servicii/montaj-aer-conditionat-buzau" className="hover:text-brandlight transition-colors">
                  Montaj Aer Condiționat
                </Link>
              </li>
              <li>
                <Link to="/servicii/igienizare-aer-conditionat-buzau" className="hover:text-brandlight transition-colors">
                  Igienizare &amp; Dezinfectare
                </Link>
              </li>
              <li>
                <Link to="/servicii/service-aer-conditionat-buzau" className="hover:text-brandlight transition-colors">
                  Service &amp; Reparații
                </Link>
              </li>
              <li>
                <Link to="/ghid/cost-montaj-aer-conditionat-buzau" className="hover:text-brandlight transition-colors">
                  Ghid cost montaj
                </Link>
              </li>
              <li>
                <Link to="/ghid/ce-btu-aer-conditionat-buzau" className="hover:text-brandlight transition-colors">
                  Calculator BTU
                </Link>
              </li>
            </ul>
          </div>

          {/* Informații Legale & Suport */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white uppercase tracking-wider">Informații &amp; Legal</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <Link to="/blog" className="hover:text-brandlight transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/despre-noi" className="hover:text-brandlight transition-colors">
                  Despre Noi
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brandlight transition-colors">
                  Contact &amp; Suport
                </Link>
              </li>
              <li>
                <Link to="/urmarire-comanda" className="hover:text-brandlight transition-colors">
                  Urmărește comanda
                </Link>
              </li>
              <li>
                <Link to="/livrare-si-retur" className="hover:text-brandlight transition-colors">
                  Livrare și Retur
                </Link>
              </li>
              <li>
                <Link to="/garantie" className="hover:text-brandlight transition-colors">
                  Condiții de Garanție
                </Link>
              </li>
              <li>
                <Link to="/termeni-si-conditii" className="hover:text-brandlight transition-colors">
                  Termeni și Condiții
                </Link>
              </li>
              <li>
                <Link to="/politica-de-confidentialitate" className="hover:text-brandlight transition-colors">
                  Confidențialitate (GDPR)
                </Link>
              </li>
              <li>
                <Link to="/politica-de-cookies" className="hover:text-brandlight transition-colors">
                  Politica de Cookies
                </Link>
              </li>
              <li>
                <Link to="/subprocesatori" className="hover:text-brandlight transition-colors">
                  Subprocesatori
                </Link>
              </li>
              <li>
                <Link to="/formular-retragere" className="hover:text-brandlight transition-colors">
                  Formular de retragere
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
            <p>&copy; {new Date().getFullYear()} Teta ABC SRL. Toate drepturile rezervate.</p>
            <p className="text-[11px]">CUI {company.cui} | {company.regCom}</p>
            <PaymentBadges dark className="justify-center pt-1 text-[11px] sm:justify-start" />
            <p className="text-[11px]">
              <a href={SAL_URL} target="_blank" rel="noopener noreferrer" className="inline-block py-1" aria-label="ANPC Soluționarea Alternativă a Litigiilor">
                <img src="/legal/anpc-sal-badge.png" alt="ANPC SAL - Soluționarea Alternativă a Litigiilor" width={250} height={62} className="inline-block h-auto w-[250px] max-w-full rounded bg-white" loading="lazy" />
              </a>
              {" | "}
              <a href={ANPC_URL} target="_blank" rel="noopener noreferrer" className="hover:underline">ANPC</a>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px]">Buzău, România</span>
            <span>•</span>
            <Link to="/politica-de-cookies" className="inline-block py-1.5 hover:underline">
              Setări Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

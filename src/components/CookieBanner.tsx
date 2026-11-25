import { useState, useEffect } from "react";
import { Link } from "@/lib/router";
import { Button } from "@/components/ui/button";
import { setCookieConsent } from "@/lib/analytics";

export const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("airlife_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    setCookieConsent(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Preferințe cookies"
      style={{ bottom: "var(--bar-contact, 0px)" }}
      className="fixed inset-x-0 z-50 border-t border-border bg-background p-3 shadow-lg animate-in slide-in-from-bottom duration-300 md:inset-x-auto md:bottom-4 md:left-4 md:max-w-sm md:rounded-xl md:border md:p-4"
    >
      <p className="mb-3 text-sm leading-snug text-muted-foreground">
        Folosim cookie-uri esențiale și, cu acordul tău, de analiză.{" "}
        <Link to="/politica-de-cookies" className="font-medium text-primary underline">Detalii</Link>
      </p>
      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" size="sm" onClick={handleDecline}>Doar esențiale</Button>
        <Button size="sm" onClick={handleAccept}>Accept toate</Button>
      </div>
    </div>
  );
};

export default CookieBanner;

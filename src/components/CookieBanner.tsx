import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border p-4 shadow-2xl animate-in slide-in-from-bottom duration-500">
      <div className="container mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Respectăm confidențialitatea datelor tale</p>
            <p>
              Folosim cookie-uri esențiale pentru funcționarea magazinului și, cu acordul tău, cookie-uri de analiză pentru a
              îmbunătăți experiența de navigare. Citește mai multe în{" "}
              <Link to="/politica-de-cookies" className="text-primary underline hover:text-primary/80">
                Politica de Cookies
              </Link>{" "}
              și{" "}
              <Link to="/politica-de-confidentialitate" className="text-primary underline hover:text-primary/80">
                Politica de Confidențialitate
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
          <Button variant="outline" size="sm" onClick={handleDecline} className="flex-1 sm:flex-none">
            Doar esențiale
          </Button>
          <Button size="sm" onClick={handleAccept} className="flex-1 sm:flex-none">
            Accept toate
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;

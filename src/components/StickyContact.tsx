"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useBarOffset } from "@/lib/bars";
import { MessageCircle, PhoneCall } from "lucide-react";
import { trackClickToCall, trackClickWhatsApp } from "@/lib/analytics";
import { PHONE_TEL, whatsappLink } from "@/data/localSeo";

// Mobile-only call + WhatsApp bar, shown on shop/info pages (not on checkout, order pages or admin).
const HIDDEN = ["/admin", "/checkout", "/comanda-confirmata", "/order-confirmation", "/auth", "/coming-soon"];

export default function StickyContact() {
  const path = usePathname() ?? "/";
  const [bar, setBar] = useState<HTMLDivElement | null>(null);
  useBarOffset(bar, "--bar-contact");
  if (HIDDEN.some((p) => path.startsWith(p))) return null;
  return (
    <>
      <div className="h-14 md:hidden" aria-hidden />
      <div ref={setBar} className="fixed bottom-0 inset-x-0 z-40 md:hidden grid grid-cols-2 border-t border-border bg-background shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <a href={`tel:${PHONE_TEL}`} onClick={() => trackClickToCall("sticky-mobile")} className="flex items-center justify-center gap-2 h-14 font-semibold text-foreground">
          <PhoneCall className="w-5 h-5 text-primary" /> Sună
        </a>
        <a
          href={whatsappLink(`Bună! Am o întrebare despre ${typeof document !== "undefined" ? document.title : "AirLife"}`)}
          target="_blank" rel="noopener noreferrer"
          onClick={() => trackClickWhatsApp("sticky-mobile")}
          className="flex items-center justify-center gap-2 h-14 font-semibold text-primary-foreground bg-primary"
        >
          <MessageCircle className="w-5 h-5" /> WhatsApp
        </a>
      </div>
    </>
  );
}

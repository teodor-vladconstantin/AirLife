"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UTM_CHANNELS, utmUrl } from "@/lib/utm";
import { X } from "lucide-react";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";
import { trackClickToCall } from "@/lib/analytics";

type Campaign = { id: string; name: string; headline: string; cta_label: string | null; cta_url: string | null; utm_campaign: string | null };

// Slim bar above the navbar showing the newest live campaign (admin > Oferte și campanii). Fails silently if the table is missing.
const CampaignBanner = () => {
  const [c, setC] = useState<Campaign | null>(null);
  useEffect(() => {
    let alive = true;
    supabase.from("campaigns").select("id,name,headline,cta_label,cta_url,utm_campaign").order("created_at", { ascending: false }).limit(1)
      .then(({ data }) => {
        const row = data?.[0];
        if (!alive || !row) return;
        try { if (sessionStorage.getItem(`airlife_banner_${row.id}`)) return; } catch { /* storage blocked */ }
        setC(row);
      }, () => undefined);
    return () => { alive = false; };
  }, []);
  if (!c) {
    return (
      <div className="bg-promo text-xs text-promo-foreground sm:text-sm">
        <div className="container mx-auto flex items-center justify-center gap-x-6 px-4 py-2 sm:justify-between">
          <span>Livrare gratuită peste 1000 RON</span>
          <a href={`tel:${PHONE_TEL}`} onClick={() => trackClickToCall("announcement-bar")} className="hidden font-semibold hover:underline sm:inline">
            Sună: {PHONE_DISPLAY}
          </a>
        </div>
      </div>
    );
  }

  const banner = UTM_CHANNELS.find((x) => x.key === "site_banner")!;
  const href = c.cta_url ? utmUrl(c.cta_url, banner, c.utm_campaign || c.name).replace("https://airlife.ro", "") : null;
  const dismiss = () => { try { sessionStorage.setItem(`airlife_banner_${c.id}`, "1"); } catch { /* ignore */ } setC(null); };

  return (
    <div className="bg-promo text-promo-foreground text-sm">
      <div className="container mx-auto px-4 py-2 flex items-center justify-center gap-3 relative">
        <span className="font-medium text-center">{c.headline}</span>
        {href && c.cta_label && (
          <a href={href} className="underline underline-offset-2 font-semibold whitespace-nowrap hover:opacity-80">{c.cta_label} &rarr;</a>
        )}
        <button type="button" aria-label="Închide" onClick={dismiss} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CampaignBanner;

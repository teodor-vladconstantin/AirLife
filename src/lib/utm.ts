// UTM convention for every channel that links to airlife.ro. One place, so reports in GA4 / PostHog stay clean.
//   utm_source  = where the click came from (facebook, instagram, linkedin, newsletter, ...)
//   utm_medium  = type of channel (social, email, paid_social, cpc, ...)
//   utm_campaign= what we are promoting (lowercase, ascii, hyphens), e.g. "montaj-buzau-iarna"
//   utm_content = optional: which post / creative / button
export interface UtmChannel { key: string; label: string; source: string; medium: string }

export const UTM_CHANNELS: UtmChannel[] = [
  { key: "facebook", label: "Facebook (postare, profil)", source: "facebook", medium: "social" },
  { key: "instagram", label: "Instagram (bio, story)", source: "instagram", medium: "social" },
  { key: "linkedin", label: "LinkedIn", source: "linkedin", medium: "social" },
  { key: "newsletter", label: "Newsletter (email)", source: "newsletter", medium: "email" },
  { key: "meta_ads", label: "Reclame Meta (Facebook + Instagram)", source: "meta", medium: "paid_social" },
  { key: "google_ads", label: "Google Ads", source: "google", medium: "cpc" },
  { key: "google_business", label: "Google Business Profile", source: "google", medium: "organic_local" },
  { key: "whatsapp", label: "WhatsApp", source: "whatsapp", medium: "messaging" },
  { key: "youtube", label: "YouTube", source: "youtube", medium: "social" },
  { key: "site_banner", label: "Banner pe site", source: "site", medium: "banner" },
];

export const utmSlug = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const SITE = "https://airlife.ro";

export function utmUrl(path: string, channel: UtmChannel, campaign: string, content?: string): string {
  const u = new URL(path.startsWith("http") ? path : SITE + (path.startsWith("/") ? path : "/" + path));
  u.searchParams.set("utm_source", channel.source);
  u.searchParams.set("utm_medium", channel.medium);
  u.searchParams.set("utm_campaign", utmSlug(campaign) || "general");
  if (content) u.searchParams.set("utm_content", utmSlug(content));
  return u.toString();
}

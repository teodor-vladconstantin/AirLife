// GA4 + Google Ads + Meta Pixel + PostHog + Sentry for AirLife. Everything is env-gated: no key, no-op.
// Nothing loads and nothing is sent before the visitor accepts cookies (GDPR). Events fired before the choice
// are buffered in memory and flushed on accept (dropped on decline). Consent Mode v2 defaults to denied.
import type { PostHog } from "posthog-js";

let posthog: PostHog | null = null;
let analyticsStarted = false;
const phExceptionQueue: unknown[] = [];

// G-XXXX (gtag.js) or GTM-XXXX (container)
const GA4_ID = process.env.NEXT_PUBLIC_GTAG_ID as string | undefined;
const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY as string | undefined;
const PH_HOST = (process.env.NEXT_PUBLIC_POSTHOG_HOST as string | undefined) || "https://eu.i.posthog.com";
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN as string | undefined;
// GTM-XXXX container, loaded alongside GA4. It reads the same Consent Mode state.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID as string | undefined;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID as string | undefined;
// Google Ads: AW-XXXXXXXXX and the purchase conversion label (Ads > Goals > Conversions > Tag setup).
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID as string | undefined;
const ADS_PURCHASE_LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL as string | undefined;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
    _fbq?: Window["fbq"];
  }
}

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity?: number;
  item_category?: string;
}

const CONSENT_KEY = "airlife_cookie_consent";
const readConsent = (): string | null => {
  try { return localStorage.getItem(CONSENT_KEY); } catch { return null; }
};

export const getCookieConsent = (): boolean => typeof window !== "undefined" && readConsent() === "accepted";

export const setCookieConsent = (accepted: boolean) => {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(CONSENT_KEY, accepted ? "accepted" : "declined"); } catch { /* storage blocked */ }
  applyConsent(accepted);
};

let sentryStarted = false;
const startSentry = () => {
  if (!SENTRY_DSN || sentryStarted) return;
  sentryStarted = true;
  import("@sentry/react").then((Sentry) =>
    Sentry.init({ dsn: SENTRY_DSN, environment: process.env.NODE_ENV, tracesSampleRate: 0.1 }),
  );
};

// Google tag (GA4 + Ads) and/or GTM container: scripts are added only after accept.
let googleStarted = false;
const startGoogle = () => {
  if (googleStarted || typeof window === "undefined") return;
  const isGtm = !!GA4_ID?.startsWith("GTM-");
  const gtagId = GA4_ID && !isGtm ? GA4_ID : ADS_ID;
  const containerId = isGtm ? GA4_ID : GTM_ID;
  if (!gtagId && !containerId) return;
  googleStarted = true;
  if (gtagId) {
    window.gtag?.("js", new Date());
    if (GA4_ID && !isGtm) window.gtag?.("config", GA4_ID);
    if (ADS_ID) window.gtag?.("config", ADS_ID);
    const el = document.createElement("script");
    el.async = true;
    el.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
    document.head.appendChild(el);
  }
  if (containerId) {
    (window.dataLayer as unknown[]).push({ "gtm.start": Date.now(), event: "gtm.js" });
    const g = document.createElement("script");
    g.async = true;
    g.src = `https://www.googletagmanager.com/gtm.js?id=${containerId}`;
    document.head.appendChild(g);
  }
};

// Meta Pixel: loaded only after accept. No ID -> no-op.
let pixelStarted = false;
let pixelPath = "";
const startMetaPixel = () => {
  if (!META_PIXEL_ID || pixelStarted || typeof window === "undefined") return;
  pixelStarted = true;
  if (!window.fbq) {
    const n = function (...args: unknown[]) {
      if (n.callMethod) n.callMethod(...args);
      else (n.queue as unknown[]).push(args);
    } as NonNullable<Window["fbq"]>;
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = [];
    window.fbq = n;
    window._fbq = n;
    const el = document.createElement("script");
    el.async = true;
    el.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(el);
  }
  window.fbq!("init", META_PIXEL_ID);
  window.fbq!("track", "PageView");
  pixelPath = window.location.pathname;
};

// SPA navigation: send PageView when the route changes (the first one is sent on init).
export const trackPageView = (path: string) => {
  if (!pixelStarted || !window.fbq || path === pixelPath) return;
  pixelPath = path;
  window.fbq("track", "PageView");
};

const META_EVENTS: Record<string, string> = {
  view_item: "ViewContent",
  add_to_cart: "AddToCart",
  begin_checkout: "InitiateCheckout",
  purchase: "Purchase",
  generate_lead: "Lead",
};

const sendMetaEvent = (eventName: string, params: Record<string, unknown>) => {
  const metaName = META_EVENTS[eventName];
  if (!metaName || !pixelStarted || !window.fbq) return;
  const items = (params.items as AnalyticsItem[] | undefined) ?? [];
  const data: Record<string, unknown> = {};
  if (params.value != null) { data.value = params.value; data.currency = params.currency ?? "RON"; }
  if (items.length) {
    data.content_type = "product";
    data.content_ids = items.map((i) => i.item_id);
    data.contents = items.map((i) => ({ id: i.item_id, quantity: i.quantity ?? 1, item_price: i.price }));
    if (items.length === 1) data.content_name = items[0].item_name;
  }
  window.fbq("track", metaName, data);
};

// PostHog: imported and initialised only after accept.
let phLoading: Promise<PostHog> | null = null;
const loadPostHog = (): Promise<PostHog> | null => {
  if (!PH_KEY || typeof window === "undefined") return null;
  phLoading ??= import("posthog-js").then(({ default: ph }) => {
    ph.init(PH_KEY, { api_host: PH_HOST, capture_pageview: "history_change", capture_exceptions: true, person_profiles: "identified_only" });
    posthog = ph;
    phExceptionQueue.splice(0).forEach((error) => ph.captureException(error));
    return ph;
  });
  return phLoading;
};

// Events fired before the visitor chose: kept in memory, flushed on accept.
const pending: Array<[string, Record<string, unknown>]> = [];

const dispatch = (eventName: string, params: Record<string, unknown>) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
  window.gtag?.("event", eventName, params);
  sendMetaEvent(eventName, params);
  loadPostHog()?.then((ph) => ph.capture(eventName, params));
};

const applyConsent = (accepted: boolean) => {
  if (typeof window === "undefined") return;
  const state = accepted ? "granted" : "denied";
  window.gtag?.("consent", "update", { analytics_storage: state, ad_storage: state, ad_user_data: state, ad_personalization: state });
  if (accepted) {
    startGoogle(); startSentry(); startMetaPixel();
    posthog?.opt_in_capturing();
    pending.splice(0).forEach(([n, p]) => dispatch(n, p));
    loadPostHog();
  } else {
    pending.length = 0;
    posthog?.opt_out_capturing();
  }
};

export const initAnalytics = () => {
  if (typeof window === "undefined" || analyticsStarted) return;
  analyticsStarted = true;
  // Consent Mode v2 defaults. This only queues commands in memory; no third-party script loads until accept.
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    // gtag requires the real `arguments` object, not a rest array
    // eslint-disable-next-line prefer-rest-params
    (window.dataLayer as unknown[]).push(arguments);
  } as Window["gtag"];
  window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  if (getCookieConsent()) {
    window.gtag("consent", "update", { analytics_storage: "granted", ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted" });
    applyConsent(true);
  }
};

export const capturePostHogException = (error: unknown) => {
  if (!PH_KEY || !getCookieConsent()) return;
  if (posthog) posthog.captureException(error);
  else phExceptionQueue.push(error);
};

const sendEvent = (eventName: string, params: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return;
  const c = readConsent();
  if (c === "accepted") return dispatch(eventName, params);
  if (c === null && pending.length < 30) pending.push([eventName, params]);
};

export const trackViewItem = (item: AnalyticsItem) => {
  sendEvent("view_item", {
    currency: "RON",
    value: item.price,
    items: [
      {
        item_id: item.item_id,
        item_name: item.item_name,
        price: item.price,
        item_category: item.item_category || "HVAC",
        quantity: item.quantity || 1,
      },
    ],
  });
};

export const trackAddToCart = (item: AnalyticsItem, quantity = 1) => {
  sendEvent("add_to_cart", {
    currency: "RON",
    value: item.price * quantity,
    items: [
      {
        item_id: item.item_id,
        item_name: item.item_name,
        price: item.price,
        item_category: item.item_category || "HVAC",
        quantity,
      },
    ],
  });
};

export const trackBeginCheckout = (items: AnalyticsItem[], totalAmount: number) => {
  sendEvent("begin_checkout", {
    currency: "RON",
    value: totalAmount,
    items: items.map((item) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      price: item.price,
      item_category: item.item_category || "HVAC",
      quantity: item.quantity || 1,
    })),
  });
};

export const trackPurchase = (
  orderNumber: string,
  items: AnalyticsItem[],
  totalAmount: number,
  shippingCost = 0
) => {
  sendEvent("purchase", {
    transaction_id: orderNumber,
    value: totalAmount,
    currency: "RON",
    shipping: shippingCost,
    items: items.map((item) => ({
      item_id: item.item_id,
      item_name: item.item_name,
      price: item.price,
      item_category: item.item_category || "HVAC",
      quantity: item.quantity || 1,
    })),
  });
  if (ADS_ID && ADS_PURCHASE_LABEL) {
    sendEvent("conversion", { send_to: `${ADS_ID}/${ADS_PURCHASE_LABEL}`, value: totalAmount, currency: "RON", transaction_id: orderNumber });
  }
};

export const trackClickToCall = (location: string) => {
  sendEvent("click_phone", { cta_location: location });
};

export const trackClickWhatsApp = (location: string) => {
  sendEvent("click_whatsapp", { cta_location: location });
};

// Calculator BTU: room volume (m3), area (m2) when known, needed BTU and the recommended unit size.
export const trackCalculatorBtu = (data: { volume_m3: number; area_m2?: number; btu_needed: number; btu_recommended: number }) => {
  sendEvent("calculator_btu_used", data);
};

export const trackContactSubmit = (subject: string) => {
  sendEvent("contact_form_submission", {
    form_subject: subject,
  });
  trackLead("contact", subject);
};

export const trackServiceQuoteRequest = (serviceName: string) => {
  sendEvent("service_quote_request", {
    service_name: serviceName,
  });
  trackLead("service_quote", serviceName);
};

// Product quote request (the checkout path): GA4 key event generate_lead with cart value.
// Checkout / payment / captcha problems: a GA4 + PostHog event, plus a Sentry message when the visitor accepted cookies.
export const trackError = (kind: string, detail?: string) => {
  sendEvent("checkout_error", { error_type: kind, ...(detail ? { detail: detail.slice(0, 100) } : {}) });
  if (sentryStarted) import("@sentry/react").then((S) => S.captureMessage(`checkout_error: ${kind}`, { level: "warning", tags: { kind }, extra: { detail } }));
};

export const trackQuoteRequest = (value: number) => {
  sendEvent("generate_lead", { currency: "RON", value, lead_magnet: "product_quote", lead_source: "request-quote" });
};

export const trackLead = (magnet: string, source: string) => {
  sendEvent("generate_lead", { lead_magnet: magnet, lead_source: source });
  sendEvent("lead_submitted", { lead_magnet: magnet, lead_source: source });
};

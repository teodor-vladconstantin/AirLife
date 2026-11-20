// GA4 + PostHog + Sentry for AirLife. Everything is env-gated: no key, no-op.
// GA4 follows Ecommerce Schema & Consent Mode v2; PostHog is opt-in after consent.
import type { PostHog } from "posthog-js";

// PostHog and Sentry are loaded on demand so they stay out of the entry bundle.
let posthog: PostHog | null = null;
let analyticsStarted = false;
const phQueue: Array<[string, Record<string, unknown>]> = [];
const phExceptionQueue: unknown[] = [];

// G-XXXX (gtag.js) or GTM-XXXX (container)
const GA4_ID = process.env.NEXT_PUBLIC_GTAG_ID as string | undefined;
const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY as string | undefined;
const PH_HOST = (process.env.NEXT_PUBLIC_POSTHOG_HOST as string | undefined) || "https://eu.i.posthog.com";
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN as string | undefined;
// GTM-XXXX container, loaded alongside GA4. It reads the same Consent Mode state, so tags in it only fire after consent.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID as string | undefined;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID as string | undefined;

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

export const getCookieConsent = (): boolean => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("airlife_cookie_consent") === "accepted";
};

export const setCookieConsent = (accepted: boolean) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("airlife_cookie_consent", accepted ? "accepted" : "declined");
  applyConsent(accepted);
};

let sentryStarted = false;
// Error monitoring starts only after cookie consent (it sends IP/browser data to a processor).
const startSentry = () => {
  if (!SENTRY_DSN || sentryStarted) return;
  sentryStarted = true;
  import("@sentry/react").then((Sentry) =>
    Sentry.init({ dsn: SENTRY_DSN, environment: process.env.NODE_ENV, tracesSampleRate: 0.1 }),
  );
};

// Meta Pixel: loaded only after the visitor accepts cookies (marketing/analytics). No ID -> no-op.
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

const applyConsent = (accepted: boolean) => {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: accepted ? "granted" : "denied",
      ad_storage: "denied", // no ads yet; flip when Google Ads is connected
    });
  }
  if (accepted) { startSentry(); startMetaPixel(); }
  if (posthog) accepted ? posthog.opt_in_capturing() : posthog.opt_out_capturing();
};

export const initAnalytics = () => {
  if (typeof window === "undefined" || analyticsStarted) return;
  analyticsStarted = true;

  if (GA4_ID) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      // gtag requires the real `arguments` object, not a rest array
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments);
    } as Window["gtag"];
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500,
    });
    window.gtag("js", new Date());
    const isGtm = GA4_ID.startsWith("GTM-");
    if (!isGtm) window.gtag("config", GA4_ID);
    const el = document.createElement("script");
    el.async = true;
    el.src = `https://www.googletagmanager.com/${isGtm ? "gtm" : "gtag/js"}${isGtm ? ".js" : ""}?id=${GA4_ID}`;
    document.head.appendChild(el);
  }

  if (GTM_ID && GTM_ID !== GA4_ID) {
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        (window.dataLayer as unknown[]).push(arguments);
      } as Window["gtag"];
      window.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", wait_for_update: 500 });
    }
    (window.dataLayer as unknown[]).push({ "gtm.start": Date.now(), event: "gtm.js" });
    const g = document.createElement("script");
    g.async = true;
    g.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
    document.head.appendChild(g);
  }

  if (PH_KEY) {
    import("posthog-js").then(({ default: ph }) => {
      ph.init(PH_KEY, {
        api_host: PH_HOST,
        opt_out_capturing_by_default: true,
        capture_pageview: "history_change",
        capture_exceptions: true,
        person_profiles: "identified_only",
      });
      posthog = ph;
      applyConsent(getCookieConsent());
      phQueue.splice(0).forEach(([name, params]) => ph.capture(name, params));
      phExceptionQueue.splice(0).forEach((error) => ph.captureException(error));
    });
  }

  applyConsent(getCookieConsent());
};

export const capturePostHogException = (error: unknown) => {
  if (!PH_KEY) return;
  if (posthog) posthog.captureException(error);
  else phExceptionQueue.push(error);
};

const sendEvent = (eventName: string, params: Record<string, unknown> = {}) => {
  if (typeof window === "undefined") return;
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
  sendMetaEvent(eventName, params);
  if (PH_KEY) (posthog ? posthog.capture(eventName, params) : phQueue.push([eventName, params]));
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
};

export const trackClickToCall = (location: string) => {
  sendEvent("click_to_call", {
    cta_location: location,
  });
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
};

// GA4 + PostHog + Sentry for AirLife. Everything is env-gated: no key, no-op.
// GA4 follows Ecommerce Schema & Consent Mode v2; PostHog is opt-in after consent.
import posthog from "posthog-js";
import * as Sentry from "@sentry/react";

// G-XXXX (gtag.js) or GTM-XXXX (container)
const GA4_ID = import.meta.env.VITE_GTAG_ID as string | undefined;
const PH_KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined;
const PH_HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) || "https://eu.i.posthog.com";
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
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

const applyConsent = (accepted: boolean) => {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      analytics_storage: accepted ? "granted" : "denied",
      ad_storage: "denied", // no ads yet; flip when Google Ads is connected
    });
  }
  if (PH_KEY) accepted ? posthog.opt_in_capturing() : posthog.opt_out_capturing();
};

export const initAnalytics = () => {
  if (typeof window === "undefined") return;

  if (SENTRY_DSN) {
    Sentry.init({
      dsn: SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
    });
  }

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

  if (PH_KEY) {
    posthog.init(PH_KEY, {
      api_host: PH_HOST,
      opt_out_capturing_by_default: true,
      capture_pageview: "history_change",
      person_profiles: "identified_only",
    });
  }

  applyConsent(getCookieConsent());
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
  if (PH_KEY) posthog.capture(eventName, params);
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
};

export const trackServiceQuoteRequest = (serviceName: string) => {
  sendEvent("service_quote_request", {
    service_name: serviceName,
  });
};

export const trackLead = (magnet: string, source: string) => {
  sendEvent("generate_lead", { lead_magnet: magnet, lead_source: source });
};

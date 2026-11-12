import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogType?: "website" | "article" | "product";
  ogImage?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_DOMAIN = "https://airlife.ro";
const DEFAULT_IMAGE = `${DEFAULT_DOMAIN}/og-image.jpg`;

export const SEO = ({
  title,
  description,
  canonical,
  ogType = "website",
  ogImage = DEFAULT_IMAGE,
  noindex = false,
  structuredData,
}: SEOProps) => {
  const location = useLocation();
  const canonicalUrl = canonical || `${DEFAULT_DOMAIN}${location.pathname}`;
  // Prerender (SSR): hand the props to scripts/prerender.ts, effects do not run on the server.
  if (typeof window === "undefined") {
    (globalThis as { __SEO__?: unknown }).__SEO__ = { title, description, canonical: canonicalUrl, ogImage, structuredData };
  }

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper function to update or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let tag = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attrName, attrVal);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 2. Standard Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow");

    // 3. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 4. Open Graph Tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:image", ogImage);
    setMetaTag("property", "og:locale", "ro_RO");
    setMetaTag("property", "og:site_name", "AirLife");

    // 5. Twitter Card Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", ogImage);

    // 6. JSON-LD Structured Data
    const SCRIPT_ID = "page-structured-data";
    let scriptTag = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (structuredData) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = SCRIPT_ID;
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(structuredData);
    } else if (scriptTag) {
      scriptTag.remove();
    }

    // 7. Fire analytics page_view event if window.dataLayer or gtag is available
    if (typeof window !== "undefined") {
      const win = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      if (Array.isArray(win.dataLayer)) {
        win.dataLayer.push({
          event: "page_view",
          page_title: title,
          page_location: window.location.href,
          page_path: location.pathname,
        });
      }
    }

    return () => {
      // Optional cleanup on unmount if needed
    };
  }, [title, description, canonicalUrl, ogType, ogImage, noindex, structuredData, location.pathname]);

  return null;
};

export default SEO;

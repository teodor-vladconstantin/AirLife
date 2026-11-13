"use client";
import { useEffect } from "react";
import { useLocation } from "@/lib/router";

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
  const { pathname } = useLocation();
  const canonicalUrl = canonical || `${DEFAULT_DOMAIN}${pathname}`;

  // React 19 hoists <title>/<meta>/<link> into <head>, on the server too, so crawlers see them in the first HTML.
  useEffect(() => {
    const win = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    win.dataLayer?.push?.({ event: "page_view", page_title: title, page_location: window.location.href, page_path: pathname });
  }, [title, pathname]);

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="ro_RO" />
      <meta property="og:site_name" content="AirLife" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).split("<").join(String.fromCharCode(92) + "u003c") }} />
      )}
    </>
  );
};

export default SEO;

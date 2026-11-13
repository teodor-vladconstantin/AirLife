import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "./providers";
import "../index.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://airlife.ro"),
  authors: [{ name: "AirLife" }],
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "48x48" }], apple: "/apple-touch-icon.png" },
  other: { "geo.region": "RO" },
};
export const viewport: Viewport = { themeColor: "#16a34a" };

const orgSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": "https://airlife.ro/#organization", name: "AirLife", url: "https://airlife.ro/", logo: "https://airlife.ro/favicon.ico",
      contactPoint: { "@type": "ContactPoint", contactType: "customer service", areaServed: "RO", availableLanguage: ["Romanian"] },
    },
    {
      "@type": "HVACBusiness", "@id": "https://airlife.ro/#localbusiness", name: "AirLife - Servicii Climatizare", telephone: "+40722153525", email: "contact@airlife.ro", url: "https://airlife.ro/",
      address: { "@type": "PostalAddress", streetAddress: "Str. Centrală nr. 169", addressLocality: "Mărăcineni", addressRegion: "Buzău", postalCode: "127325", addressCountry: "RO" },
      openingHoursSpecification: [
        { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "14:00" },
      ],
      image: "https://airlife.ro/og-image.jpg", areaServed: { "@type": "Country", name: "România" },
      description: "Servicii de montaj, igienizare profesională și service pentru sisteme de aer condiționat la nivel național.",
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ro">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

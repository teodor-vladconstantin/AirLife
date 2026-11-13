/** @type {import('next').NextConfig} */
export default {
  // Keep the existing VITE_* variables in .env / Vercel working: they are exposed to the browser under NEXT_PUBLIC_*.
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_COMING_SOON: process.env.NEXT_PUBLIC_COMING_SOON ?? process.env.VITE_COMING_SOON ?? "",
    NEXT_PUBLIC_GTAG_ID: process.env.NEXT_PUBLIC_GTAG_ID ?? process.env.VITE_GTAG_ID ?? "",
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? process.env.VITE_POSTHOG_KEY ?? "",
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? process.env.VITE_POSTHOG_HOST ?? "",
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN ?? process.env.VITE_SENTRY_DSN ?? "",
  },
  async redirects() {
    const r = (source, destination) => ({ source, destination, permanent: true });
    return [
      r("/servicii/montaj-aer-conditionat-buzau", "/servicii/montaj-aer-conditionat"),
      r("/servicii/igienizare-aer-conditionat-buzau", "/servicii/igienizare-aer-conditionat"),
      r("/servicii/service-aer-conditionat-buzau", "/servicii/service-aer-conditionat"),
      r("/ghid/cost-montaj-aer-conditionat-buzau", "/ghid/cost-montaj-aer-conditionat"),
      r("/servicii/montaj-aer-conditionat/:locality", "/servicii/montaj-aer-conditionat"),
      r("/servicii/igienizare-aer-conditionat/:locality", "/servicii/igienizare-aer-conditionat"),
      r("/servicii/service-aer-conditionat/:locality", "/servicii/service-aer-conditionat"),
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

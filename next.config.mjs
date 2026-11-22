import { withPostHogConfig } from "@posthog/nextjs-config";

const vercelRelease = process.env.VERCEL_GIT_REPO_SLUG && process.env.VERCEL_GIT_COMMIT_SHA
  ? {
      releaseName: process.env.VERCEL_GIT_REPO_SLUG,
      releaseVersion: process.env.VERCEL_GIT_COMMIT_SHA,
    }
  : {};

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
  async rewrites() {
    return [{ source: "/feed/google.xml", destination: "/merchant-feed.xml" }];
  },
  async redirects() {
    const r = (source, destination) => ({ source, destination, permanent: true });
    return [
      r("/request-quote", "/products"),
      // Local slugs (-buzau) are canonical; the old slugs 301 to them.
      r("/servicii/montaj-aer-conditionat", "/servicii/montaj-aer-conditionat-buzau"),
      r("/servicii/igienizare-aer-conditionat", "/servicii/igienizare-aer-conditionat-buzau"),
      r("/servicii/service-aer-conditionat", "/servicii/service-aer-conditionat-buzau"),
      r("/servicii/montaj-aer-conditionat/:locality", "/servicii/montaj-aer-conditionat-buzau"),
      r("/servicii/igienizare-aer-conditionat/:locality", "/servicii/igienizare-aer-conditionat-buzau"),
      r("/servicii/service-aer-conditionat/:locality", "/servicii/service-aer-conditionat-buzau"),
      r("/ghid/ce-btu-aer-conditionat", "/ghid/ce-btu-aer-conditionat-buzau"),
      r("/ghid/cost-montaj-aer-conditionat", "/ghid/cost-montaj-aer-conditionat-buzau"),
      r("/ghid/igienizare-aer-conditionat", "/ghid/igienizare-aer-conditionat-buzau"),
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

export default withPostHogConfig(nextConfig, {
  personalApiKey: process.env.POSTHOG_API_KEY ?? "",
  projectId: process.env.POSTHOG_PROJECT_ID,
  host: process.env.POSTHOG_HOST,
  sourcemaps: {
    enabled: Boolean(process.env.POSTHOG_API_KEY && process.env.POSTHOG_PROJECT_ID),
    deleteAfterUpload: true,
    ...vercelRelease,
  },
});

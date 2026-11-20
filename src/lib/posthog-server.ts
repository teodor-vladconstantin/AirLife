import { PostHog } from "posthog-node";

const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!token && process.env.NODE_ENV !== "production") {
  console.warn("NEXT_PUBLIC_POSTHOG_KEY variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_KEY is configured");
}

if (!host && process.env.NODE_ENV !== "production") {
  console.warn("NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured");
}

export const posthog = token && host
  ? new PostHog(token, {
      host,
      flushAt: 1,
      flushInterval: 0,
      requestTimeout: 2000,
      fetchRetryCount: 0,
      enableExceptionAutocapture: process.env.NEXT_RUNTIME === "nodejs",
    })
  : null;

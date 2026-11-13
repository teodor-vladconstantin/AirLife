import type { MetadataRoute } from "next";

const PRIVATE = ["/admin", "/checkout", "/order-confirmation", "/my-orders", "/auth"];
const BOTS = ["*", "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "PerplexityBot", "Google-Extended"];

export default function robots(): MetadataRoute.Robots {
  if (process.env.NEXT_PUBLIC_COMING_SOON === "true") return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow: PRIVATE })), sitemap: "https://airlife.ro/sitemap.xml" };
}

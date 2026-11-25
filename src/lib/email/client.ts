import { Resend } from "resend";

// Server-only: the key lives in .env.local / Vercel env, never in client code.
export const resend = new Resend(process.env.RESEND_API_KEY);

// Marketing goes out from the news. subdomain so its reputation stays separate from transactional mail.
export const NEWS_FROM = "AirLife <hello@news.airlife.ro>";
export const REPLY_TO = "contact@airlife.ro";

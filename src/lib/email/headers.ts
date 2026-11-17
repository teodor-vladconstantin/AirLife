import { siteUrl } from "./db";

// Gmail and Yahoo require both headers on bulk mail: the first gives the unsubscribe URL,
// the second tells the client it may POST to it directly (RFC 8058).
export const unsubscribeHeaders = (token: string) => ({
  "List-Unsubscribe": `<${siteUrl()}/api/unsubscribe?token=${token}>`,
  "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
});

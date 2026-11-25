import { render } from "@react-email/components";
import type { ReactElement } from "react";
import { resend, NEWS_FROM, REPLY_TO } from "./client";
import { unsubscribeHeaders } from "./headers";

export type Msg = { id: string; to: string; token: string; subject: string; element: ReactElement };

// Resend allows up to 100 emails per batch call. Returns the ids whose batch failed, so callers can retry later.
// idemPrefix makes a re-run of the same job a no-op on Resend's side (idempotency keys last 24h).
export async function sendMany(msgs: Msg[], idemPrefix: string) {
  const failedIds: string[] = [];
  for (let i = 0; i < msgs.length; i += 100) {
    const chunk = msgs.slice(i, i + 100);
    const payload = await Promise.all(
      chunk.map(async (m) => ({
        from: NEWS_FROM,
        to: m.to,
        replyTo: REPLY_TO,
        subject: m.subject,
        html: await render(m.element),
        text: await render(m.element, { plainText: true }),
        headers: unsubscribeHeaders(m.token),
      })),
    );
    const { error } = await resend.batch.send(payload, { idempotencyKey: `${idemPrefix}-${i / 100}` });
    if (error) failedIds.push(...chunk.map((m) => m.id));
  }
  return { sent: msgs.length - failedIds.length, failedIds };
}

// Shared guard for the two machine-called routes: Vercel Cron sends "Authorization: Bearer $CRON_SECRET".
export const authorized = (req: Request) =>
  !!process.env.CRON_SECRET && req.headers.get("authorization") === `Bearer ${process.env.CRON_SECRET}`;

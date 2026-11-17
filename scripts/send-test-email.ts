// Usage: npx tsx --env-file=.env.local scripts/send-test-email.ts you@example.com
import { render } from "@react-email/components";
import { resend, NEWS_FROM, REPLY_TO } from "../src/lib/email/client";
import Seasonal from "../src/emails/Seasonal";
import { unsubscribeHeaders } from "../src/lib/email/headers";

const to = process.argv[2];
if (!to) throw new Error("Pass the recipient address as the first argument.");

const unsubscribeUrl = "https://airlife.ro/unsubscribe?token=test"; // real token comes with step 4
const element = Seasonal({ variant: "iarna", unsubscribeUrl });
const { data, error } = await resend.emails.send({
  from: NEWS_FROM,
  to,
  replyTo: REPLY_TO,
  subject: "Aerul condiționat, pregătit pentru iarnă",
  html: await render(element),
  text: await render(element, { plainText: true }),
  headers: unsubscribeHeaders("test"),
});
console.log(error ?? data);
if (error) process.exit(1);

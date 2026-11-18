// Server only. Verifies a Cloudflare Turnstile token. No TURNSTILE_SECRET_KEY set = verification is skipped,
// so the forms keep working until the keys are added in Vercel (NEXT_PUBLIC_TURNSTILE_SITE_KEY + TURNSTILE_SECRET_KEY).
export const turnstileConfigured = () => !!process.env.TURNSTILE_SECRET_KEY;

export async function verifyTurnstile(token: string | undefined | null, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, ...(ip ? { remoteip: ip } : {}) }),
    });
    const out = (await res.json()) as { success?: boolean };
    return out.success === true;
  } catch {
    return false; // Cloudflare unreachable: fail closed
  }
}

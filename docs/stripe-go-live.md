# Stripe: trecere din Sandbox în Live

Starea la 2026-11-19: Sandbox complet conectat (webhook `airlife-checkout`, `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` în Vercel Production, redeploy făcut).

## De ce NU sincronizăm produse în Stripe
`src/app/api/checkout/route.ts` creează Checkout Session cu `price_data` + `product_data`
(nume, imagine, preț din DB, stoc verificat server-side). Un catalog în Stripe ar fi duplicat
și s-ar desincroniza de prețuri/stoc. Nu e nevoie de el pentru plată.

## Pași pentru Live (în ordine)
1. Stripe → View task: completează verificarea contului (blochează plățile reale).
2. Stripe Live → Developers → Webhooks → Add destination:
   - URL `https://airlife.ro/api/stripe/webhook`, payload Snapshot
   - evenimente: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`
3. Cheile live în Vercel Production (copiezi din clipboard, nu se tastează):
   ```
   npx vercel env rm STRIPE_SECRET_KEY production --yes
   npx vercel env rm STRIPE_WEBHOOK_SECRET production --yes
   powershell -NoProfile -c "[Console]::Out.Write((Get-Clipboard -Raw).Trim())" | npx vercel env add STRIPE_SECRET_KEY production --yes     # sk_live_...
   powershell -NoProfile -c "[Console]::Out.Write((Get-Clipboard -Raw).Trim())" | npx vercel env add STRIPE_WEBHOOK_SECRET production --yes  # whsec_... (live)
   ```
4. Redeploy: `git commit --allow-empty -m redeploy && git push origin next-migration:main`.
5. Test cu o comandă reală mică (rambursabilă) și verifică în admin că devine "paid".

## Branding Checkout (FĂCUT 2026-11-19, Settings > Business > Branding, contul AirLife)
- Logo: `public/logo.png`; icon: `public/icon-512.png`; "Prefer logo over icon" bifat
- Brand color (fundal): `#E3F5EA`; Accent (butoane): `#0D7337`
- E setare de cont: se aplică și în live, nu trebuie refăcut la trecerea în live.

## Verificat în Sandbox (2026-11-19)
- Sesiune Checkout se creează (200), webhook `checkout.session.expired` procesat (AL000006 cancelled, stoc restabilit).
- Rămâne de văzut o plată reală cu card de test (4242...) -> comanda "paid".

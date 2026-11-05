# AirLife

Magazin online (airlife.ro) pentru climatizare, purificare si dezumidificare a aerului, destinat clientilor din Romania. Include catalog de produse, cos si comenzi, cereri de oferta, pagini de servicii si ghiduri, pagini legale (termeni, confidentialitate, cookies, garantie, livrare/retur) si panou de administrare.

Proiectul a fost pornit in Lovable; o parte din cod este generata cu ajutorul unui asistent AI.

## Stack

- Vite + React 18 + TypeScript
- Tailwind CSS + shadcn/ui (Radix UI)
- React Router, TanStack Query
- Supabase (autentificare, baza de date Postgres cu RLS, migratii in `supabase/migrations`)
- Deploy: Vercel (`vercel.json`)

## Rulare locala

Cerinte: Node.js 18+ si npm.

```sh
npm install
cp .env.example .env   # completeaza valorile Supabase
npm run dev            # http://localhost:8080 (portul din vite.config.ts)
```

Alte comenzi: `npm run build`, `npm run preview`, `npm run lint`.

## Configurare

Variabilele de mediu sunt descrise in `.env.example`. Cheia Supabase folosita in frontend este cheia publica (anon); accesul la date este controlat prin politicile RLS din migratii. Nu pune in repo chei `service_role`, chei Stripe secrete sau parole de baza de date.

## Stare

Integrarea de plati Stripe este doar planificata (vezi `STRIPE_INTEGRATION.md`).

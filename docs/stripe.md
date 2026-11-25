# Plata online cu Stripe (proiect AirLife)

Același cont Stripe și aceeași firmă (TETA ABC SRL), dar într-un proiect separat „AirLife”, nu în proiectul Joben. Nu se creează un cont nou. Codul e gata și oprit până pui cheile.

## Ce face codul
- `POST /api/checkout`: citește prețurile din baza de date (nu din browser), verifică stocul, creează comanda și rezervă stocul. La plata cu cardul creează o sesiune Stripe Checkout (RON, limba română, expiră în 30 de minute) și întoarce linkul. La ramburs și transfer bancar doar înregistrează comanda.
- `POST /api/stripe/webhook`: la plată reușită marchează comanda `paid` + `confirmed`. La sesiune expirată anulează comanda și dă stocul înapoi.
- `/comanda-confirmata`: pagina de după plată.
- Checkout-ul: cu `NEXT_PUBLIC_PAYMENTS` nesetat rămâne fluxul vechi, „Cere ofertă”. Cu `on` apare plata cu cardul.

## Ce faci tu (în ordine)
1. În contul Stripe existent creezi proiectul/sandbox-ul „AirLife” (separat de Joben). Contul, datele firmei și IBAN-ul rămân cele deja configurate.
2. Dezvoltatori → Chei API → copiezi cheia **secretă de test** (`sk_test_...`) în Vercel, proiectul `airlife`: `STRIPE_SECRET_KEY`.
3. Dezvoltatori → Webhooks → adaugi endpoint `https://airlife.ro/api/stripe/webhook` cu evenimentele `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`. Copiezi „Signing secret” (`whsec_...`) în Vercel: `STRIPE_WEBHOOK_SECRET`.
4. În Vercel adaugi `NEXT_PUBLIC_PAYMENTS=on`, apoi un redeploy (un commit nou pe `main`).
5. Test cu cardul `4242 4242 4242 4242`, orice dată viitoare, orice CVC. Verifici în admin → Comenzi că apare plătită.
6. Setări Stripe → Emailuri către clienți: activezi chitanțele. Branding: logo AirLife și verde `#07ad4a`.
7. Mergi live: activezi contul, pui cheia `sk_live_...` și un webhook nou pentru live.

## Înainte de live
- Firma e neplătitoare de TVA, deci prețurile au deja „fără TVA” (e în Termeni). Fără taxe automate în Stripe.
- Verifică paginile Livrare și retur, Garanție, Termeni: dreptul de retragere de 14 zile e deja acolo.
- Comisioanele Stripe pentru carduri europene sunt în dashboard. Nu le adăugăm la preț.

# Integrare Stripe — Ghid rapid pentru MVP

Acest document conține pașii esențiali, variabilele de mediu, endpoint-urile recomandate și exemple de cod pentru integrarea Stripe (test → live) pentru MVP-ul magazinului.

Scop: permită clienților să plătească cu Stripe Checkout în test mode, salvarea comenzilor în DB la `checkout.session.completed` și un workflow simplu pentru lansare rapidă.

---

## 1. Ce îmi trebuie de la echipă / business

- Acces la un cont Stripe (test mode).
- Cheile de test (pe care le pui în `env` sau mi le trimiți securizat):
  - `STRIPE_PUBLISHABLE_KEY` (ex: pk_test_...)
  - `STRIPE_SECRET_KEY` (ex: sk_test_...)
  - `STRIPE_WEBHOOK_SECRET` (îl obții când înregistrezi webhook-ul în Dashboard sau prin ngrok)
- Domeniul/site (pentru `success_url` / `cancel_url`) — la dev: `http://localhost:3000` + ngrok; producție: domeniu HTTPS.
- Moneda de vânzare (ex: `ron` sau `eur`) — Stripe are suport regional; dacă RON nu e suportat de cont, folosește EUR.

---

## 2. Alegere rapidă pentru MVP

Opțiuni:
- Variantă rapidă (MVP): folosești `price_data` direct la crearea sesiunii Checkout. Nu trebuie să creezi produse/price în Stripe.
- Variantă recomandată pentru producție: sincronizezi produse cu Stripe (creare Product + Price) și folosești `price` (price_id) în `line_items`.

Recomandare MVP: pentru lansare ianuarie folosește `price_data` sau implementăm logicul mixt: dacă `product.stripe_price_id` există, folosim `price`, altfel creăm `price` dinamic și salvăm id-ul.

---

## 3. Variabile de mediu (exemplu)

```
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=... (Supabase)
SMTP_URL=... (opțional: SendGrid/Postmark/SMTP)
```

Păstrează-le în mediu, nu în cod.

---

## 4. Endpoint-uri recomandate (server)

- `POST /api/create-checkout-session`
  - Payload minim: `{ items: [{ productId, quantity }], successUrl, cancelUrl, customerEmail? }` sau doar `productId` dacă folosești DB server-side.
  - Răspuns: `200 { id: session.id, url?: session.url }` (client redirecționează la `session.url` sau folosește `stripe.redirectToCheckout`).

- `POST /api/webhook`
  - Endpoint public pentru Stripe webhooks. Trebuie să verifice semnătura (`STRIPE_WEBHOOK_SECRET`) și să trateze evenimente precum `checkout.session.completed`.

---

## 5. Exemplu minimal Node (Express-like) — creare sesiune folosind `price_data`

```js
// server/controllers/checkout.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(req, res) {
  const { items, successUrl, cancelUrl } = req.body;

  const line_items = items.map(item => ({
    price_data: {
      currency: 'eur', // sau 'ron' dacă contul suportă
      unit_amount: Math.round(item.unit_amount), // în cenți/bani
      product_data: { name: item.name, images: item.images || [] }
    },
    quantity: item.quantity
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items,
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { myCustom: 'value' }
  });

  res.json({ id: session.id, url: session.url });
}
```

---

## 6. Exemplu webhook handler (verificare semnătură)

```js
// server/controllers/webhook.js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function stripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    // 1) Persistă comanda în DB (Supabase): user, items, total, stripe_session_id, paid = true
    // 2) Reducere stoc (dacă folosiți)
    // 3) Trimite email confirmare (opțional)
  }

  res.json({ received: true });
}
```

Note: pentru express+raw body set `app.post('/api/webhook', express.raw({type: 'application/json'}), stripeWebhook)`.

---

## 7. Testare locală (ngrok)

1. Rulezi serverul local (ex: `http://localhost:3000`).
2. Pornești ngrok: `ngrok http 3000` → obții un URL public `https://abcd.ngrok.io`.
3. În Dashboard Stripe → Developers → Webhooks: adaugă `https://abcd.ngrok.io/api/webhook` (event: checkout.session.completed). Vei primi `STRIPE_WEBHOOK_SECRET`.
4. Testezi checkout în Test Mode (card 4242 4242 4242 4242 etc.).

---

## 8. Model date (comenzi) minim recomandat

- orders
  - id
  - user_id (nullable pentru guest)
  - items (JSON array)
  - total_amount
  - currency
  - shipping_address (JSON)
  - stripe_session_id
  - paid (boolean)
  - status (pending/paid/fulfilled/cancelled)
  - created_at

Pentru AWB/expediere (opțional MVP): `tracking_number`, `shipping_provider`, `shipping_status`.

---

## 9. Seeder produse (opțional)

- Dacă nu vrei să creezi manual produsele în admin, adaugă un `seed/products.json` și un script server `npm run seed` care populează DB la dev.

---

## 10. Email transactional

- Recomand implementare de bază: la `checkout.session.completed` trimite un email cu detaliile comenzii.
- Provider recomandat: SendGrid / Postmark / Mailgun (Postmark e bun pentru transactional și simplitate).

---

## 11. Checklist MVP rapid (ToDo imediat)

- [ ] Configurare env cu `STRIPE_*` keys (test)
- [ ] Endpoint `POST /api/create-checkout-session` (folosind `price_data` sau `price_id`)
- [ ] Endpoint `POST /api/webhook` și înregistrare webhook în Stripe (test)
- [ ] Seeder demo produse sau import din admin
- [ ] Test end-to-end: adaugă în coș → checkout (test card) → webhook → comanda în DB
- [ ] Admin: vizualizare comenzi

---

## 12. Migrare la producție (pași finali)

- Schimbă cheile în env la live keys
- Actualizează webhook URL în Dashboard la domeniul live și salvează `STRIPE_WEBHOOK_SECRET` live
- Testează o tranzacție mică reală
- Monitorizare (Sentry + alerts) pentru webhook failures

---

## Resurse utile

- Stripe Checkout docs: https://stripe.com/docs/payments/checkout
- Webhooks docs: https://stripe.com/docs/webhooks
- Stripe Node quickstart: https://stripe.com/docs/quickstart


---

Dacă vrei, pot genera imediat:
- endpoint-urile de server (ex: `src/server/api/stripe.js`) și un seeder demo pentru produse, sau
- implementare „mixtă” (dacă `product.stripe_price_id` există, folosim `price`, altfel creăm preț dinamic și salvăm id-ul).

Spune-mi ce variantă preferi și pun imediat codul (test mode).
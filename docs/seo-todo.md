# AirLife: SEO / analytics, ce a rămas de făcut

Actualizat: 12 noiembrie 2026. Tot ce ține de cod, schema, prerender, conținut, Merchant Center, Search Console, GA4 și PostHog este făcut și live. Ce urmează:

## La tine (nu pot face eu)
- [ ] **Autor articole:** completează `src/data/author.ts` (nume + funcție). Până atunci articolele apar semnate „Echipa AirLife".
- [ ] **Dovezi reale (E-E-A-T):** poze de la lucrări, recenzii de clienți, CUI/J în footer, certificări (dacă există).
- [ ] **Google Business Profile:** verificare cu videoclip (profilul „AirLife" e creat, service area Buzău County, neverificat). Pentru editarea profilului ai nevoie de un cont care nu e blocat de politica Workspace (joben.eu dă „Service not allowed").
- [ ] **Keyword Planner:** contul Google Ads 698-496-8893 (duku.constantin@gmail.com) e blocat în vrăjitorul „Create your first campaign" (precompletat cu edadent.ro). Treci în Expert Mode și creează contul fără campanie, apoi spune-mi ca să extrag volumele pentru clustere.
- [ ] **Bing Webmaster Tools:** loghează-te în Chrome-ul controlat de Claude la bing.com/webmasters, apoi adaug `airlife.ro` prin import din Search Console. (IndexNow acoperă între timp.)

## Verificări de făcut peste câteva zile
- [ ] **Search Console:** paginile cerute la indexare (pilon blog, montaj, igienizare, service, /aer-conditionat, /blog) apar indexate? Homepage-ul a fost doar re-cerut (neconfirmat).
- [ ] **Merchant Center:** 2 produse respinse cu „Image not processed" (ventilator A80i-FS-K, ventilator baie A100 FS NL). Imaginile răspund corect (200, webp), deci probabil se rezolvă singure; re-verifică. Politica de retur în review (până la 10 zile).
- [ ] **Viteza reală:** rulează Lighthouse local sau PageSpeed (cota API s-a terminat azi) pe / și /servicii/montaj-aer-conditionat, după code-splitting (intrarea JS: 1,43 MB → ~400 KB).
- [ ] **PostHog:** după ce apar vizite cu consimțământ, verifică dacă apar replay și heatmaps (proiect AirLife, EU, phc_kKD7vU…). Opțional: oprește „Capture console logs" din Settings → Session replay.

## Mici îmbunătățiri de cod
- [ ] Ordinea fixă a clusterelor pe pagina `/blog` (pilon → sateliți), acum apar în ordinea articolelor.
- [ ] Descrierea articolului-pilon `cum-alegi-aerul-conditionat-ghid-complet` are 168 de caractere (limită 165), se scurtează din /admin.
- [ ] Un produs are titlu foarte lung (A80i-FS-K), cosmetic.
- [ ] Limba sursei de produse din Merchant e acum „Romanian"; dacă adaugi produse noi, feed-ul se regenerează la fiecare build.

## Backlog conținut (cerere confirmată, neacoperit)
Vezi `docs/seo-keywords.md`: cât costă igienizarea, cel mai bun purificator pentru apartament/copii, multisplit, de ce îngheață/nu merge dezumidificatorul, cum măsori umiditatea, montaj ventilator de baie, recuperator pentru apartament (preț și montaj, după ce ai prețuri reale).

## Comenzi utile
- `npm run build` (cu `VITE_COMING_SOON=false`) apoi `npm run seo:audit`
- `npm run indexnow` după fiecare deploy cu conținut nou
- Articole noi: migrație SQL în `supabase/migrations/` sau din /admin

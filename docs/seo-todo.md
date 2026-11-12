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
- [x] **Viteza (Lighthouse mobil, 12 nov):** homepage performanță 72, SEO 100, best-practices 100, accesibilitate 91, CLS 0, FCP 1,8 s, TBT 160 ms; /servicii/montaj-aer-conditionat performanță 74, LCP 5,3 s. LCP rămâne slab pe homepage (8,3 s simulat).
- [ ] **PostHog:** după ce apar vizite cu consimțământ, verifică dacă apar replay și heatmaps (proiect AirLife, EU, phc_kKD7vU…). Opțional: oprește „Capture console logs" din Settings → Session replay.

## Performanță: următorul pas (risc mediu, de făcut cu test)
- [ ] **LCP homepage ~8 s:** elementul LCP este `<h1>`-ul din hero. HTML-ul prerenderat apare devreme, dar `createRoot` îl înlocuiește după încărcarea JS, iar înlocuirea resetează măsurătoarea. Soluție: `hydrateRoot` cu randare completă a aplicației în prerender (StaticRouter + aceleași provideri, inclusiv CookieBanner), ca DOM-ul să fie reutilizat. Cere test pe toate rutele (mismatch de hidratare). Până atunci hero-ul e WebP cu srcset și fetchpriority high.
- [ ] Un produs are titlu foarte lung (A80i-FS-K), cosmetic.

## Făcute în sesiunea 12 nov (la finalul zilei)
- [x] Ordine fixă a clusterelor pe `/blog` (pilon primul), în `src/data/blogClusters.ts`.
- [x] Descrierea pilonului scurtată (133 caractere), live.
- [x] Hero WebP (1024/1920) cu srcset, și corectat HTML-ul prerenderat care trimitea la `/src/assets/...` (cale inexistentă în producție).

## Backlog conținut (cerere confirmată, neacoperit)
Vezi `docs/seo-keywords.md`: cât costă igienizarea, cel mai bun purificator pentru apartament/copii, multisplit, de ce îngheață/nu merge dezumidificatorul, cum măsori umiditatea, montaj ventilator de baie, recuperator pentru apartament (preț și montaj, după ce ai prețuri reale).

## Comenzi utile
- `npm run build` (cu `VITE_COMING_SOON=false`) apoi `npm run seo:audit`
- `npm run indexnow` după fiecare deploy cu conținut nou
- Articole noi: migrație SQL în `supabase/migrations/` sau din /admin

# AirLife: principii de design (desktop + mobil)

Reguli pentru orice pagină nouă sau modificată. Valorile concrete stau în `src/index.css` (tokeni și clase `.section`, `.text-title`, `.text-lead`, `.text-price`) și în `src/components/ui/button.tsx`. Nu se hardcodează spațieri, culori sau dimensiuni de text în pagini.

Brand: verde `#08AC48` (logo), verde închis `#0F2A1D` pentru text, fundaluri albe/mint, font Inter. Fără albastru, fără culoare de accent în afara verdelui.

## 1. Ierarhie: un singur element dominant pe ecran
- Pe fiecare ecran (viewport) există **o singură acțiune primară** (buton verde plin). Restul sunt secundare (outline) sau text.
- Ierarhia se face prin **mărime, greutate, contrast și spațiu alb**. Bordurile și fundalurile colorate se folosesc „sparingly", pentru că adaugă zgomot ([NN/g, Visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/)).
- Un card = un link. Nu punem în card și un buton separat către aceeași destinație.
- Aplicat: hero (un buton plin), CTA (un buton, două linkuri text), carduri de categorie și servicii (card întreg clickabil), produs („Adaugă în coș" primar, „Cumpără acum" secundar).

## 2. Mai puține opțiuni, dezvăluire progresivă
- Mai multe opțiuni înseamnă decizie mai lentă (legea lui Hick, [Telerik](https://www.telerik.com/blogs/ux-laws-build-better-mobile-experiences)). Nu e o limită numerică fixă, deci tratăm ca regulă de prudență: **meniu principal ≤ 5 elemente**.
- Ce nu e esențial se pliază: meniul mobil (Produse/Servicii pliabile), footer pe 2 coloane pe telefon.
- **Dar nu ascundem informația de decizie în tab-uri sau sub-pagini**: utilizatorii o ignoră ([Baymard, Product page](https://baymard.com/research-articles/current-state-ecommerce-product-page-ux)). Pe produs, descrierea, specificațiile și livrarea sunt secțiuni una sub alta.
- Fără informații duplicate pe același ecran (telefon în antet și în bara de jos, două căsuțe de căutare).

## 3. Spațiere: scară 4/8px, ritm constant
- Spațiu între secțiuni: `.section` (3rem pe mobil, 5rem de la 768px). Între titlu de secțiune și conținut: `.section-head`.
- Elemente înrudite stau aproape, elemente diferite stau departe (proximitate): etichetă lângă câmp, preț lângă buton.
- Margini laterale 16px pe mobil. Conținut de citit: coloană de ~45–75 caractere (regulă tipografică generală, nu cerință NN/g).

## 4. Tipografie: patru roluri, nu mărimi ad-hoc
`.text-display` (H1 hero) · `.text-title` (H2 de secțiune) · `.text-subtitle` (H3) · `.text-lead` (paragraf introductiv) · `.text-price` (preț).
- Corp de text ≥ 14px, **câmpuri de formular 16px** (sub 16px, iOS face zoom).
- Contrast text/fundal ≥ 4.5:1 (WCAG AA). Text alb peste imagine doar cu overlay întunecat.
- Un singur preț dominant pe produs; prețul vechi și „TVA inclus" sunt vizibil mai mici.

## 5. Atingere și ergonomie pe telefon
- Ținte de atingere **≥ 44px** (NN/g recomandă minim ~1cm × 1cm, [touch target size](https://www.nngroup.com/articles/touch-target-size/)). Butoane: 44px implicit, 48px `lg`.
- Acțiunile frecvente stau în zona de jos, ușor de atins cu degetul mare ([Smashing, Thumb zone](https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users)): bara „Sună/WhatsApp", butonul „Adaugă în coș".
- **Prețul și acțiunea principală sunt vizibile fără scroll** pe pagina de produs (testat pe 390×844).
- Butonul primar dintr-un formular e pe toată lățimea pe telefon.
- Fără scroll orizontal la 360 / 390 / 768px.

## 5b. Desktop
- Conținutul stă în `container` (max 1400px), cu text de citit pe max ~65–75 caractere.
- Acțiunea primară rămâne în primul ecran (1440×900) pe produs, hero și checkout.
- Hover și focus vizibile pe orice element interactiv (`focus-visible:ring`).

## 6. Consistență
- Un singur set de butoane (`Button`: default / outline / ghost; size sm 40 · default 44 · lg 48), un singur colț rotunjit (`rounded-lg`).
- Aceleași carduri, badge-uri și iconițe pe toate paginile. Iconițe doar din `lucide-react`.
- Markerii de încredere (plată securizată, Visa/Mastercard) vin din `PaymentBadges`, nu se desenează din nou.

## 7. Conținut și SEO (nu se sacrifică pentru design)
- Textul cu „Buzău", descrierile de servicii/categorii și linkurile interne rămân în pagină. Se pot reorganiza vizual, nu scurta.
- Informația se poate plia vizual (accordion) doar dacă rămâne în DOM.

## Listă de verificare înainte de merge
1. O singură acțiune primară pe viewport? (desktop și mobil)
2. Prețul și butonul sunt vizibile fără scroll pe produs (390×844)?
3. Ținte ≥ 44px, inputuri 16px, fără overflow orizontal?
4. Fără valori hardcodate: se folosesc tokenii și clasele din `index.css`?
5. Textul de SEO și linkurile de categorie sunt intacte?
6. `next build`, `tsc` și `eslint --quiet` curate (în afară de `src/proxy.ts`, preexistent)?

-- BTU is sized on room volume (m³), not floor area. Rewrites the BTU guide and the posts that quoted m² thresholds.
-- Run by pasting into the Supabase SQL editor (see tracking-ids in memory).

UPDATE public.blog_posts SET
  title = 'Ce BTU să alegi pentru aerul condiționat: ghid după volumul camerei',
  excerpt = 'Capacitatea potrivită se calculează după volumul camerei, în metri cubi, apoi se ajustează pentru orientare, etaj și geamuri. Iată cum alegi corect, fără să plătești în plus.',
  meta_description = 'Cum alegi capacitatea aerului condiționat în funcție de volumul camerei (metri cubi), etaj și orientare. Reguli simple și greșeli de evitat, de la specialiștii AirLife Buzău.',
  content = $md$Prima întrebare la cumpărarea unui aparat de aer condiționat este câți BTU să aibă. Un aparat prea mic nu face față în zilele fierbinți, iar unul prea mare pornește și se oprește des, consumă mai mult și răcește neuniform.

## Regula de bază: după volumul camerei

Capacitatea se calculează după **volumul** camerei, în metri cubi, nu după suprafață. Înmulțești lungimea, lățimea și înălțimea (în metri), iar necesarul este de aproximativ **140 BTU pe metru cub**. Sursele folosesc factori între 136 și 160 BTU/mc, deci rezultatul este orientativ.

Pentru o cameră fără factori speciali se folosesc de obicei:

- **9000 BTU** pentru camere de până la aproximativ 65 mc (în jur de 26 mp cu tavan de 2,5 m)
- **12000 BTU** pentru camere de aproximativ 65–85 mc (26–34 mp)
- **18000 BTU** pentru spații de aproximativ 85–130 mc (34–52 mp)
- **24000 BTU** sau mai mult pentru spații mai mari sau open space

Exemplu: o cameră de 5 × 4 m cu tavan de 2,5 m are 50 mc, deci necesită circa 7000 BTU și îi ajunge un aparat de 9000 BTU. Dacă tavanul are 3 m, volumul crește la 60 mc și necesarul la 8400 BTU.

Sunt valori orientative. Pentru o recomandare exactă ne uităm la camera ta. Poți folosi și [calculatorul BTU](/ghid/ce-btu-aer-conditionat).

## Ce mai contează în afară de volum

- **Orientarea:** o cameră cu ferestre spre sud sau vest se încălzește mult mai tare vara.
- **Etajul:** ultimul etaj, sub acoperiș, are nevoie de mai multă putere.
- **Geamurile:** suprafețele vitrate mari lasă să intre multă căldură.
- **Echipamentele și persoanele:** un birou cu calculatoare sau o cameră aglomerată adaugă sarcină termică (aproximativ 500 BTU pentru fiecare persoană în plus față de două).
- **Izolația:** o casă slab izolată pierde mai repede aerul răcit.

## Inverter, clasă energetică și Wi-Fi

Compresorul **inverter** își ajustează turația în loc să pornească și să se oprească, ceea ce înseamnă un consum mai mic și o temperatură mai stabilă. O clasă energetică bună reduce factura, iar controlul **Wi-Fi** îți permite să pornești aparatul înainte să ajungi acasă.

## Greșeli frecvente

1. Alegerea după preț, fără a calcula capacitatea.
2. Calcularea după suprafață, fără să ții cont de înălțimea tavanului.
3. Montarea unității interioare direct deasupra patului sau a locului de lucru, unde curentul de aer deranjează.
4. Neglijarea întreținerii: filtrele murdare scad randamentul.

Poți vedea aparatele noastre la [Aer condiționat](/aer-conditionat), iar pentru montaj profesional în Buzău vezi [montajul de aer condiționat](/servicii/montaj-aer-conditionat-buzau) sau [scrie-ne](/contact).$md$
WHERE slug = 'ce-btu-sa-alegi-pentru-aer-conditionat';

-- Ghidul complet: capacitate pe volum.
UPDATE public.blog_posts SET
  meta_description = replace(meta_description, 'BTU după suprafață', 'BTU după volumul camerei'),
  content = replace(content,
    'Capacitatea se alege după suprafață, dar și după etaj, orientare și geamuri. Ca punct de plecare, pentru o cameră de până la 25 mp se alege de obicei 9000 BTU, pentru 25–35 mp 12000 BTU, iar pentru spații mai mari 18000 BTU sau mai mult.',
    'Capacitatea se alege după volumul camerei (metri cubi), dar și după etaj, orientare și geamuri. Ca punct de plecare, pentru o cameră de până la 65 mc se alege de obicei 9000 BTU, pentru 65–85 mc 12000 BTU, iar pentru spații mai mari 18000 BTU sau mai mult.')
WHERE slug = 'cum-alegi-aerul-conditionat-ghid-complet';

-- Întrebare frecventă din același ghid.
UPDATE public.blog_posts SET content = replace(content,
  '**Ce BTU îmi trebuie pentru 20 mp?** De regulă 9000 BTU, dacă încăperea nu este foarte însorită sau la etaj superior.',
  '**Ce BTU îmi trebuie pentru o cameră de 50 mc (20 mp cu tavan de 2,5 m)?** De regulă 9000 BTU, dacă încăperea nu este foarte însorită sau la etaj superior.')
WHERE content LIKE '%Ce BTU îmi trebuie pentru 20 mp?%';

-- Linkuri/etichete către ghidul BTU din celelalte articole.
UPDATE public.blog_posts SET content = replace(replace(replace(content,
  'Vezi [cum alegi BTU după suprafață]', 'Vezi [cum alegi BTU după volumul camerei]'),
  'capacitatea se alege după suprafață, ca la orice aparat', 'capacitatea se alege după volumul camerei, ca la orice aparat'),
  '2. Suprafața camerei și capacitatea potrivită', '2. Volumul camerei și capacitatea potrivită')
WHERE content LIKE '%cum alegi BTU după suprafață%' OR content LIKE '%capacitatea se alege după suprafață, ca la orice aparat%' OR content LIKE '%2. Suprafața camerei și capacitatea potrivită%';

-- Textul din baza live difera de seed.
UPDATE public.blog_posts SET content = replace(content, 'puterea se alege după suprafață, ca la orice aparat', 'puterea se alege după volumul camerei, ca la orice aparat')
WHERE slug = 'aer-conditionat-fara-unitate-exterioara-avantaje-dezavantaje';

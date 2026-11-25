-- Blog topic clusters (category = cluster) + 11 long-tail articles chosen from Google autocomplete (RO) demand.
-- Figures are ranges from the public sources listed at the end of each article. Edit or unpublish from /admin.

-- 1) Clusters for the existing posts
UPDATE public.blog_posts SET category = 'Alegere aer condiționat'
WHERE slug IN ('ce-btu-sa-alegi-pentru-aer-conditionat','ce-influenteaza-pretul-montajului-aerului-conditionat','cat-consuma-un-aer-conditionat-inverter','aer-conditionat-fara-unitate-exterioara-avantaje-dezavantaje');
UPDATE public.blog_posts SET category = 'Întreținere și probleme'
WHERE slug IN ('cat-de-des-trebuie-igienizat-aerul-conditionat','de-ce-pica-apa-din-aerul-conditionat');
UPDATE public.blog_posts SET category = 'Umiditate și ventilație'
WHERE slug IN ('dezumidificator-cand-ai-nevoie-umiditate-ideala','recuperator-de-caldura-descentralizat-cand-merita');

-- 2) Sources for the articles published earlier
UPDATE public.blog_posts SET content = content || E'\n\n## Surse\n\n- [Hornbach România: cât consumă un aer condiționat și cum calculezi costul](https://www.hornbach.ro/proiecte/cat-consuma-un-aer-conditionat-si-cum-calculati-costul-real-pe-factura/)\n- [Folositor.ro: cât curent consumă aerul condiționat](https://folositor.ro/ghid/cat-curent-consuma-aerul-conditionat)\n- Fișa tehnică și eticheta energetică a modelului tău rămân sursa exactă pentru consum.'
WHERE slug = 'cat-consuma-un-aer-conditionat-inverter';
UPDATE public.blog_posts SET content = content || E'\n\n## Surse\n\n- [Hornbach România: de ce curge apa din aerul condiționat](https://www.hornbach.ro/proiecte/de-ce-curge-apa-din-aerul-conditionat-si-alte-probleme-frecvente-ale-acestor-aparate/)\n- [LG România: suport produs, scurgeri de apă](https://www.lg.com/ro/suport/ajutor-produs/CT20202048-20154981143239)\n- Manualul aparatului tău, la capitolul întreținere și scurgere condens.'
WHERE slug = 'de-ce-pica-apa-din-aerul-conditionat';
UPDATE public.blog_posts SET content = content || E'\n\n## Surse\n\n- [Hornbach România: dezumidificarea aerului](https://www.hornbach.ro/proiecte/dezumidificarea-aerului/)\n- [Hornbach România: ce face un dezumidificator](https://www.hornbach.ro/proiecte/ce-face-un-dezumidificator/)\n- [Spotmedia: de ce umiditatea ridicată îți afectează sănătatea](https://spotmedia.ro/stiri/sanatate/de-ce-umiditatea-ridicata-iti-afecteaza-sanatatea-si-cum-o-poti-controla)'
WHERE slug = 'dezumidificator-cand-ai-nevoie-umiditate-ideala';

UPDATE public.blog_posts SET meta_title = 'Dezumidificator: când ai nevoie și umiditatea ideală' WHERE slug = 'dezumidificator-cand-ai-nevoie-umiditate-ideala';

-- 3) New articles
INSERT INTO public.blog_posts (slug, title, excerpt, category, meta_title, meta_description, status, published_at, content)
VALUES
(
  'cum-alegi-aerul-conditionat-ghid-complet',
  'Cum alegi aerul condiționat: ghid complet în 6 pași',
  'Capacitate, inverter, eficiență, tip de montaj, funcții și întreținere: tot ce verifici înainte să cumperi, într-un singur ghid.',
  'Alegere aer condiționat',
  'Cum alegi aerul condiționat: ghid complet în 6 pași',
  'Ghid complet pentru alegerea aerului condiționat: BTU după suprafață, inverter, eficiență, unitate exterioară, funcții și costuri. Cu linkuri către ghidurile detaliate.',
  'published',
  now(),
  $md$Alegi corect un aer condiționat dacă iei, în ordine, șase decizii: **capacitatea**, **tipul de compresor**, **eficiența**, **tipul de montaj**, **funcțiile** și **cine îl montează și îl întreține**. Mai jos ai fiecare pas, cu linkuri către ghidurile detaliate.

## 1. Capacitatea potrivită (BTU)

Capacitatea se alege după suprafață, dar și după etaj, orientare și geamuri. Ca punct de plecare, pentru o cameră de până la 25 mp se alege de obicei 9000 BTU, pentru 25–35 mp 12000 BTU, iar pentru spații mai mari 18000 BTU sau mai mult. Detalii și excepții în [ghidul despre BTU](/blog/ce-btu-sa-alegi-pentru-aer-conditionat).

## 2. Inverter sau fără inverter

Compresorul inverter își ajustează turația și ține temperatura mai stabilă, iar la utilizare frecventă consumă mai puțin. Diferențele complete sunt în [inverter sau fără inverter](/blog/aer-conditionat-inverter-sau-fara-inverter).

## 3. Eficiența și costul de funcționare

Uită-te la eticheta energetică și la valorile SEER (răcire) și SCOP (încălzire): cu cât sunt mai mari, cu atât aparatul este mai eficient. Cum îți calculezi costul pe factură vezi în [cât consumă un inverter de 12000 BTU](/blog/cat-consuma-un-aer-conditionat-inverter).

## 4. Cu unitate exterioară sau fără

Varianta clasică este splitul cu unitate exterioară. Dacă nu poți monta nimic pe fațadă, există [aparate fără unitate exterioară](/blog/aer-conditionat-fara-unitate-exterioara-avantaje-dezavantaje), cu limitele lor.

## 5. Funcții care contează

- **Încălzire:** utilă în sezonul rece, vezi [aer condiționat iarna](/blog/aer-conditionat-iarna-incalzire-si-consum).
- **Wi-Fi:** pornești aparatul din telefon înainte să ajungi acasă.
- **Zgomot și filtre:** verifică nivelul de zgomot din fișa tehnică și cât de ușor se scot filtrele.

## 6. Montaj și întreținere

Montajul corect (vidare, traseu, pantă la scurgere) contează cât aparatul. Ce intră în preț găsești în [ce influențează prețul montajului](/blog/ce-influenteaza-pretul-montajului-aerului-conditionat) și în [ce conține kitul de montaj](/blog/ce-contine-kitul-de-montaj-aer-conditionat). După montaj, [igienizarea la timp](/blog/cat-de-des-trebuie-igienizat-aerul-conditionat) păstrează aerul curat și consumul mic.

## Întrebări frecvente

**Ce BTU îmi trebuie pentru 20 mp?** De regulă 9000 BTU, dacă încăperea nu este foarte însorită sau la etaj superior. Verifică [ghidul BTU](/blog/ce-btu-sa-alegi-pentru-aer-conditionat).

**Merită inverterul?** Pentru folosire frecventă, da: temperatura este mai stabilă și consumul mai mic față de un aparat cu turație fixă.

**Pot cumpăra aparatul și monta separat?** Da. Pentru montaj vezi [serviciul de montaj AirLife](/servicii/montaj-aer-conditionat).

Vezi [aparatele de aer condiționat din magazin](/aer-conditionat).

## Surse

- [Hornbach România: ce înseamnă inverter la aerul condiționat](https://www.hornbach.ro/proiecte/ce-inseamna-inverter-la-aerul-conditionat/)
- Fișa tehnică și eticheta energetică a modelului ales.$md$
),
(
  'aer-conditionat-inverter-sau-fara-inverter',
  'Aer condiționat inverter sau fără inverter: diferențe și ce alegi',
  'Inverterul modulează turația compresorului, ține temperatura stabilă și consumă mai puțin la folosire frecventă. Iată când merită și când nu.',
  'Alegere aer condiționat',
  'Aer condiționat inverter sau fără inverter: ce alegi',
  'Diferențele dintre aerul condiționat inverter și cel clasic: consum, stabilitatea temperaturii, zgomot și preț. Când merită inverterul și când nu.',
  'published',
  now(),
  $md$Diferența de bază: un aparat **fără inverter** are compresor cu turație fixă, care pornește și se oprește, iar unul **inverter** își modulează turația, de regulă între aproximativ 30% și 100% din putere. De aici vin celelalte diferențe.

## Ce înseamnă în practică

- **Temperatura:** un aparat cu turație fixă oscilează în jurul valorii setate, de regulă cu 1–2 °C. Inverterul o ține mai aproape de valoarea dorită.
- **Consum:** ghidurile publice estimează că inverterul consumă cu până la aproximativ 30% mai puțin la folosire regulată, iar unele surse indică economii mai mari. Nu există o metodologie unitară, deci tratează cifrele ca orientative.
- **Zgomot:** inverterul rulează mult timp la turație mică, deci se aude mai puțin după ce camera ajunge la temperatură.
- **Solicitarea compresorului:** mai puține porniri și opriri.
- **Preț de achiziție:** inverterul costă mai mult la cumpărare.

## Când merită inverterul

Dacă îl folosești zilnic în sezon, în dormitor sau birou, sau și pentru încălzire, diferența de consum se recuperează în timp. Vezi cum îți calculezi costul în [cât consumă un inverter de 12000 BTU](/blog/cat-consuma-un-aer-conditionat-inverter).

## Când ai putea alege fără inverter

Pentru o cameră folosită foarte rar, câteva zile pe an, diferența de preț la achiziție poate conta mai mult decât economia de consum.

## Întrebări frecvente

**Inverterul se strică mai greu?** Nu există o garanție generală. Contează calitatea aparatului și un montaj corect, vezi [ghidul de alegere](/blog/cum-alegi-aerul-conditionat-ghid-complet).

**Fac diferența la încălzire?** Da, ambele tipuri pot încălzi dacă au pompă de căldură, dar verifică intervalul de funcționare din fișa tehnică, vezi [aer condiționat iarna](/blog/aer-conditionat-iarna-incalzire-si-consum).

Vezi [aparatele inverter din magazin](/aer-conditionat).

## Surse

- [Hornbach România: ce înseamnă inverter la aerul condiționat](https://www.hornbach.ro/proiecte/ce-inseamna-inverter-la-aerul-conditionat/)
- [Panasonic: inverter vs non-inverter](https://www.panasonic.com/kh/hvac/learn-more/inverter-vs-non-inverter.html)
- [Daikin: aparate cu inverter](https://www.daikin.co.uk/en_gb/residential/inspiration/articles/inverter-air-conditioners.html)$md$
),
(
  'aer-conditionat-iarna-incalzire-si-consum',
  'Aer condiționat iarna: cum încălzește, ce consum are și ce setezi',
  'Un aer condiționat cu pompă de căldură poate încălzi iarna, dar are un interval de temperaturi în care funcționează bine. Iată ce verifici.',
  'Alegere aer condiționat',
  'Aer condiționat iarna: încălzire, consum, setări',
  'Cum încălzește aerul condiționat iarna, până la ce temperatură funcționează, de ce apar aburi sau apă la unitatea exterioară și ce setezi.',
  'published',
  now(),
  $md$Un aer condiționat cu **pompă de căldură** poate încălzi iarna: preia căldură din aerul de afară și o aduce în casă. Nu orice aparat încălzește la fel de bine la frig, așa că verifică intervalul de funcționare din fișa tehnică.

## Până la ce temperatură funcționează

Multe modele inverter anunță un interval de funcționare care începe în jurul valorii de -15 °C, dar sursele nu spun clar dacă se referă la răcire, la încălzire sau la ambele. De aceea, caută în fișa tehnică intervalul **pentru modul de încălzire**. Pentru zone foarte reci există variante „cold climate", despre care îl întrebi pe instalator.

## Cât consumă

Consumul depinde de temperatura de afară, de izolația casei și de setare. Calculul rămâne același ca vara: kWh consumați, înmulțiți cu prețul din factură. Formula și un exemplu sunt în [cât consumă un inverter](/blog/cat-consuma-un-aer-conditionat-inverter).

## Ce e normal iarna

- **Aburi sau apă la unitatea exterioară:** în timpul ciclurilor de dezghețare, aparatul topește gheața formată pe schimbătorul exterior. Este un comportament normal.
- **Scurgere de condens afară:** evacuarea trebuie să fie liberă, ca să nu înghețe.
- **Aer mai puțin cald decât la un calorifer:** fluxul este blând, nu fierbinte.

## Ce setezi

O temperatură de 20–22 °C este un punct de plecare rezonabil. Evită să crești temperatura brusc cu multe grade, fiindcă aparatul va rula la putere mare mult timp.

## Întrebări frecvente

**Pot folosi aparatul ca unică sursă de căldură?** Depinde de aparat, de zonă și de casă. Verifică limita de temperatură din fișa tehnică și discută cu un instalator.

**De ce apare apă sub unitatea exterioară?** De regulă din dezghețare sau din condens. Dacă apa cade în casă, vezi [de ce pică apă din aer condiționat](/blog/de-ce-pica-apa-din-aerul-conditionat).

Pentru alegerea modelului, citește [ghidul complet](/blog/cum-alegi-aerul-conditionat-ghid-complet).

## Surse

- [Hornbach România: ce înseamnă inverter la aerul condiționat](https://www.hornbach.ro/proiecte/ce-inseamna-inverter-la-aerul-conditionat/)
- Fișa tehnică a modelului: interval de funcționare în modul încălzire.$md$
),
(
  'ce-contine-kitul-de-montaj-aer-conditionat',
  'Ce conține kitul de montaj pentru aer condiționat și ce nu este inclus',
  'Kitul de montaj acoperă traseul standard. Ce intră în el, ce se plătește separat și cum eviți surprizele de la ofertă.',
  'Alegere aer condiționat',
  'Ce conține kitul de montaj aer condiționat',
  'Ce include de regulă un kit de montaj pentru aer condiționat (țevi, cablu, tub condens, console) și ce se plătește separat. Ghid pentru oferte clare.',
  'published',
  now(),
  $md$Kitul de montaj este setul de materiale pentru un traseu **standard** între unitatea interioară și cea exterioară. Conținutul exact diferă de la un furnizor la altul, de aceea cere lista scrisă înainte de lucrare.

## Ce intră de regulă într-un kit

- **Țevi de cupru izolate** pentru traseul frigorific, de regulă pentru aproximativ 3 metri liniari.
- **Cablu de legătură** între unități.
- **Tub de scurgere** pentru condens.
- **Console sau suporturi** pentru unitatea exterioară.
- **Bandă de izolare și mici materiale** de fixare.

## Ce se plătește de obicei separat

- **Metri suplimentari** de traseu peste lungimea din kit.
- **Perforări suplimentare** sau carotare în beton armat.
- **Traseu ascuns** în perete sau tubulatură estetică.
- **Alimentare electrică dedicată** sau siguranță, dacă lipsește.
- **Montaj la înălțime** care cere echipament special.

Factorii care schimbă prețul sunt explicați în [ce influențează prețul montajului](/blog/ce-influenteaza-pretul-montajului-aerului-conditionat).

## Cum eviți surprizele

1. Măsoară sau estimează distanța dintre unități.
2. Cere o ofertă care listează kitul și lucrările suplimentare.
3. Întreabă dacă vidarea cu pompă de vid este inclusă, este pasul care protejează compresorul.

## Întrebări frecvente

**Pot cumpăra kitul separat?** Da, dacă ai deja aparatul. Vezi [accesoriile pentru aer condiționat](/accesorii-aer-conditionat).

**Cine face montajul?** Echipa AirLife oferă [montaj aer condiționat](/servicii/montaj-aer-conditionat). Pentru alegerea aparatului, vezi [ghidul complet](/blog/cum-alegi-aerul-conditionat-ghid-complet).

## Surse

- Fișa tehnică și instrucțiunile de montaj ale producătorului aparatului.
- [Montaj aer condiționat AirLife: ce include serviciul standard](/servicii/montaj-aer-conditionat)$md$
),
(
  'cum-cureti-filtrele-aerului-conditionat',
  'Cum cureți filtrele aerului condiționat singur, pas cu pas',
  'Filtrele se scot, se spală cu apă călduță și se usucă. Iată cât de des și ce nu faci niciodată.',
  'Întreținere și probleme',
  'Cum cureți filtrele aerului condiționat, pas cu pas',
  'Curățarea filtrelor de aer condiționat: pași, frecvență, ce nu folosești și când ai nevoie de igienizare profesională.',
  'published',
  now(),
  $md$Filtrele aerului condiționat le poți curăța singur în câteva minute. Un filtru curat lasă aerul să circule, aparatul răcește mai bine și consumă mai puțin.

## Cât de des

În sezonul de folosire intensă, verifică filtrele la fiecare 2–4 săptămâni; mai des dacă ai animale, praf sau faci curățenie multă în casă. Manualul aparatului are și indicațiile producătorului.

## Pași

1. **Oprește aparatul** și scoate-l din priză sau de la siguranță.
2. **Deschide panoul frontal** și scoate filtrele.
3. **Aspiră praful** cu o perie moale sau cu aspiratorul.
4. **Spală-le cu apă călduță** și puțin detergent delicat, dacă sunt foarte murdare.
5. **Usucă-le la umbră**, nu la soare sau lângă calorifer.
6. **Montează-le la loc** și închide panoul.

## Ce nu faci

- Nu folosi apă fierbinte, fiindcă poate deforma filtrul.
- Nu folosi solvenți sau soluții agresive.
- Nu porni aparatul fără filtre.

## Când nu mai ajunge curățarea filtrelor

Dacă simți un miros neplăcut sau aparatul scurge apă, problema este de obicei mai adânc: schimbătorul, turbina sau tava de condens. Atunci ai nevoie de [igienizare profesională](/servicii/igienizare-aer-conditionat). Vezi și [cât de des se igienizează](/blog/cat-de-des-trebuie-igienizat-aerul-conditionat) și [mirosul urât din aer condiționat](/blog/miros-urat-aer-conditionat-cauze).

## Întrebări frecvente

**Pot curăța filtrele cu aspiratorul?** Da, pentru praf ușor. Pentru murdărie persistentă le speli cu apă călduță.

**Filtrele se schimbă?** Filtrele simple se spală. Filtrele speciale (carbon, ionizare) au indicații proprii în manual.

## Surse

- Manualul de utilizare al aparatului.
- [Hornbach România: probleme frecvente ale aerului condiționat](https://www.hornbach.ro/proiecte/de-ce-curge-apa-din-aerul-conditionat-si-alte-probleme-frecvente-ale-acestor-aparate/)$md$
),
(
  'miros-urat-aer-conditionat-cauze',
  'De ce miroase urât aerul condiționat: cauze și ce faci',
  'Mirosul de umezeală vine, de regulă, din mucegai și murdărie acumulate în aparat. Iată cauzele și ce rezolvi singur.',
  'Întreținere și probleme',
  'De ce miroase urât aerul condiționat: cauze și soluții',
  'Cauzele mirosului neplăcut la aerul condiționat (umezeală, mucegai, filtre murdare, scurgere) și ce poți face: curățare, uscare, igienizare.',
  'published',
  now(),
  $md$Dacă aerul condiționat miroase a umezeală sau a „ciorapi uzi" când îl pornești, cauza este de obicei **umezeala și mucegaiul acumulate în unitatea interioară**.

## Cauzele frecvente

- **Umezeală pe schimbătorul de căldură.** Când răcește, aparatul condensează apă; dacă rămâne umed între utilizări, apar mucegai și bacterii.
- **Filtre murdare.** Praful reține umezeală și mirosuri.
- **Scurgere de condens blocată.** Apa rămâne în tavă și stagnează.
- **Mirosuri din cameră.** Fum, mâncare sau animale pot fi preluate de aparat.

## Ce poți face singur

1. [Curăță filtrele](/blog/cum-cureti-filtrele-aerului-conditionat).
2. Verifică dacă scurgerea nu este blocată, vezi [de ce pică apă din aer condiționat](/blog/de-ce-pica-apa-din-aerul-conditionat).
3. După o perioadă de răcire, pornește aparatul în modul ventilator timp de 20–30 de minute, ca să se usuce interiorul. Verifică în manual dacă modelul are funcție de autocurățare sau de uscare.

## Când chemi un specialist

Dacă mirosul revine după curățarea filtrelor, este nevoie de [igienizare profesională](/servicii/igienizare-aer-conditionat): schimbătorul, turbina și tava de condens se curăță cu soluții dedicate, de obicei o dată pe an, vezi [cât de des](/blog/cat-de-des-trebuie-igienizat-aerul-conditionat).

## Întrebări frecvente

**Este periculos mirosul?** Mirosul de mucegai e un semn de umezeală și murdărie. Dacă ai alergii sau probleme respiratorii, nu amâna curățarea.

**Ajută un spray din comerț?** Poate masca mirosul, dar nu rezolvă cauza, care trebuie curățată.

## Surse

- Manualul aparatului: întreținere și funcția de uscare.
- [Hornbach România: probleme frecvente ale aerului condiționat](https://www.hornbach.ro/proiecte/de-ce-curge-apa-din-aerul-conditionat-si-alte-probleme-frecvente-ale-acestor-aparate/)$md$
),
(
  'purificator-aer-alergii-cum-alegi',
  'Purificator de aer pentru alergii: cum alegi (HEPA, CADR, suprafață)',
  'Pentru alergii cauți filtru HEPA și un CADR potrivit camerei. Iată cum citești specificațiile și ce nu poate face un purificator.',
  'Aer curat',
  'Purificator de aer pentru alergii: cum alegi | AirLife',
  'Cum alegi un purificator de aer pentru alergii: filtru HEPA, CADR, suprafața camerei, carbon activ, zgomot și costul filtrelor. Ce poate și ce nu poate face.',
  'published',
  now(),
  $md$Pentru alergii cauți un purificator cu **filtru HEPA** și cu un **debit de aer curățat (CADR)** potrivit camerei. Restul, zgomotul, costul filtrelor, funcțiile, contează la confort.

## Filtrul HEPA

Filtrul HEPA reține particulele fine din aer, printre care polen și praf. Gradul H13 înseamnă o eficiență mare de filtrare; vezi [ce este filtrul HEPA și când se schimbă](/blog/filtru-hepa-ce-este-cand-se-schimba). Filtrul cu **carbon activ** ajută la mirosuri, nu la polen.

## CADR și suprafața camerei

CADR arată cât aer curățat produce aparatul pe unitatea de timp. Cu cât camera este mai mare, cu atât ai nevoie de un CADR mai mare. Atenție: producătorii nu calculează la fel suprafața recomandată. De exemplu, Philips indică pentru un model cu CADR de 165 m³/h camere de până la 42 m², iar un alt producător folosește un coeficient de 0,07–0,12 între CADR și suprafață. Compară deci modele care raportează după același standard și verifică suprafața declarată în fișa tehnică.

## Ce mai verifici

- **Zgomot** la turația pe care o vei folosi noaptea.
- **Costul filtrelor** și intervalul de schimbare.
- **Indicator de filtru** care te anunță când schimbi.
- **Senzor de calitate a aerului**, util dacă vrei funcționare automată.

## Ce NU face un purificator

Nu elimină sursa alergenului (acarieni în saltele, mucegai pe pereți) și nu înlocuiește aerisirea sau tratamentul recomandat de medic. Dacă ai și umezeală mare, vezi [când ai nevoie de dezumidificator](/blog/dezumidificator-cand-ai-nevoie-umiditate-ideala).

## Întrebări frecvente

**Ce CADR îmi trebuie pentru 20 mp?** Depinde de metoda producătorului; folosește suprafața recomandată din fișa tehnică, nu doar CADR-ul.

**Cât de des schimb filtrul?** Producătorii indică adesea 12–24 de luni pentru HEPA, dar verifică modelul tău.

Vezi [purificatoarele de aer](/purificatoare-aer) și [filtrele](/filtre-purificatoare) din magazin.

## Surse

- [Philips: fișă tehnică purificator](https://www.documents.philips.com/assets/20210907/d4e69d0965c0456b8c48ad9c009d340c.pdf)
- [Mijia: purificator de aer Max (formula suprafeței)](https://www.mi.com/ro/product/mijia-air-purifier-max/)
- [Compari.ro: cum alegi un dezumidificator și un purificator](https://www.compari.ro/buyingguide/dezumidificator.html)$md$
),
(
  'filtru-hepa-ce-este-cand-se-schimba',
  'Filtru HEPA: ce este, ce înseamnă H13 și cât de des se schimbă',
  'HEPA reține particule foarte fine. Gradul H13 înseamnă eficiență mare, iar schimbarea se face după indicația producătorului.',
  'Aer curat',
  'Filtru HEPA: ce este, H13 și când se schimbă',
  'Ce este filtrul HEPA, ce înseamnă H13 și H14, la ce ajută și cât de des se schimbă. Fără mituri: citește indicațiile producătorului.',
  'published',
  now(),
  $md$Un filtru **HEPA** (High Efficiency Particulate Air) este un filtru cu eficiență mare pentru particule fine din aer. În purificatoarele de aer este componenta principală.

## Ce înseamnă H13 și H14

Gradele HEPA sunt definite de norma europeană EN 1822. H13 înseamnă o eficiență de cel puțin 99,95% pentru particulele cele mai greu de reținut, iar H14 de cel puțin 99,995%. Un grad mai mare nu este automat mai bun pentru orice aparat: un filtru mai dens poate reduce debitul de aer, așa că aparatul trebuie proiectat pentru el.

## La ce ajută

Reține praful fin și polenul. Nu reține gazele și mirosurile, pentru ele există filtrul cu **carbon activ**. Alegerea completă a unui purificator este în [purificator pentru alergii](/blog/purificator-aer-alergii-cum-alegi).

## Cât de des se schimbă

Nu există un interval universal. Producătorii indică adesea 12–24 de luni pentru filtrul HEPA și mai des pentru cel cu carbon, de exemplu 12 luni. Dacă aparatul are indicator de filtru, urmărește-l. Intervalul real depinde de cât de poluat este aerul și cât folosești aparatul.

## Întrebări frecvente

**Pot spăla filtrul HEPA?** Doar dacă producătorul îl declară lavabil. Un filtru HEPA obișnuit nu se spală.

**Unde găsesc filtre compatibile?** Vezi [filtrele pentru purificatoare](/filtre-purificatoare).

## Surse

- [Philips: durata de viață recomandată a filtrelor](https://www.documents.philips.com/assets/20210529/d0156b94dc7d43c6ba2ead370111a88b.pdf)
- [Bosch Home Comfort: purificatoare Air](https://www.bosch-homecomfort.com/ro/ro/ocs/rezidential/air-4000-20166601-p/)
- Norma europeană EN 1822 (clasificarea filtrelor HEPA și ULPA).$md$
),
(
  'ventilator-baie-cum-alegi',
  'Cum alegi un ventilator de baie: debit, senzor de umiditate, clapetă antiretur',
  'Debitul se alege după suprafața băii, iar senzorul de umiditate, timerul și clapeta antiretur fac diferența în utilizare.',
  'Umiditate și ventilație',
  'Cum alegi un ventilator de baie: debit și funcții',
  'Ventilator de baie: debit în m³/h după suprafață, senzor de umiditate, timer, clapetă antiretur, diametru și zgomot. Ghid de alegere.',
  'published',
  now(),
  $md$Pentru un ventilator de baie alegi întâi **debitul** (m³/h), apoi funcțiile: **senzor de umiditate**, **timer** și **clapetă antiretur**. Ele decid cât de comod și eficient este în utilizare.

## Debitul

Un furnizor indică un debit de cel puțin 100 m³/h pentru o baie de aproximativ 5 mp cu înălțime standard, iar un tabel de norme citat de un producător dă 90–150 m³/h pentru băi de 8–12 mp, în funcție de numărul de schimburi de aer pe oră. Cifrele sunt orientative, de aceea verifică și specificațiile modelului.

## Funcțiile utile

- **Senzor de umiditate:** pornește ventilatorul singur când aerul devine umed, deci nu depinzi de comutator.
- **Timer:** ventilatorul continuă să meargă după ce ai stins lumina, de obicei câteva minute, ca să scoată umezeala rămasă.
- **Clapetă antiretur:** împiedică întoarcerea aerului și a mirosurilor de pe coloana comună, mai ales în blocuri.

## Diametru și zgomot

Diametrele uzuale sunt 100 mm și 125 mm. Dacă înlocuiești un ventilator existent, păstrează același racord. Verifică nivelul de zgomot în dB(A) din fișa tehnică.

## De ce contează ventilația

Un ventilator corect dimensionat reduce umezeala care duce la mucegai; vezi [mucegai în baie: cauze și prevenire](/blog/mucegai-in-baie-cauze-si-prevenire). Pentru o ventilație controlată a întregii locuințe, citește [recuperatorul de căldură descentralizat](/blog/recuperator-de-caldura-descentralizat-cand-merita).

## Întrebări frecvente

**Pot monta singur ventilatorul?** Depinde de instalația electrică și de traseul de evacuare. Dacă nu ești sigur, cheamă un specialist.

**Ventilatorul trebuie să meargă tot timpul?** Nu neapărat; cu senzor sau timer funcționează când este nevoie.

Vezi [ventilatoarele de baie din magazin](/ventilatoare-baie).

## Surse

- [Hornbach România: aerisire baie fără geam](https://www.hornbach.ro/proiecte/aerisire-baie-fara-geam-solutii/)
- [Blauberg: selecția ventilatoarelor](https://blaubergventilatoren.net/fans-selection/)
- [Hornbach: ventilator baie cu timer și clapetă antiretur](https://www.hornbach.ro/p/ventilator-incastrabil-rotheigner-air-quiet-100nf-o-100-mm-cu-timer-si-filtru-anti-retur/6690125/)$md$
),
(
  'mucegai-in-baie-cauze-si-prevenire',
  'Mucegai în baie: de ce apare și cum îl previi',
  'Mucegaiul apare unde umezeala rămâne. Cauza se rezolvă cu ventilație și, la nevoie, cu dezumidificare.',
  'Umiditate și ventilație',
  'Mucegai în baie: cauze, prevenire și curățare',
  'De ce apare mucegaiul în baie (umezeală, ventilație slabă, condens), cum îl previi cu ventilator și dezumidificator și când chemi un specialist.',
  'published',
  now(),
  $md$Mucegaiul din baie apare acolo unde **umezeala rămâne mult timp**: după duș, pe pereți reci, în rosturi și pe tavan. Dacă tratezi doar pata și lași umezeala, revine.

## De ce apare

- **Ventilație slabă** sau inexistentă, mai ales la băile fără geam.
- **Abur după duș** care se condensează pe suprafețe reci.
- **Infiltrații sau scurgeri** de la țevi sau etanșări.
- **Umiditate generală mare** în locuință.

## Cum previi

1. **Ventilează în timpul și după duș.** Un ventilator cu timer sau senzor de umiditate scoate umezeala, vezi [cum alegi un ventilator de baie](/blog/ventilator-baie-cum-alegi).
2. **Șterge suprafețele** foarte umede și lasă ușa deschisă după folosire.
3. **Măsoară umiditatea.** Dacă stă constant peste 60%, vezi [când ai nevoie de dezumidificator](/blog/dezumidificator-cand-ai-nevoie-umiditate-ideala).
4. **Repară sursa de apă**, dacă există scurgeri.

## Ce faci cu mucegaiul existent

Suprafețele mici se curăță cu produse dedicate, cu mănuși și ventilație. Dacă mucegaiul acoperă suprafețe mari, revine repede sau apare din infiltrații, ai nevoie de un specialist care să trateze cauza.

## Întrebări frecvente

**Dezumidificatorul elimină mucegaiul?** Previne apariția lui, dar nu îndepărtează mucegaiul deja format.

**Este suficientă aerisirea cu fereastra?** Ajută, dar la băi fără geam sau în sezonul rece, un ventilator dedicat este mai sigur.

Vezi [dezumidificatoarele](/dezumidificatoare) și [ventilatoarele de baie](/ventilatoare-baie).

## Surse

- [Hornbach România: aerisire baie fără geam](https://www.hornbach.ro/proiecte/aerisire-baie-fara-geam-solutii/)
- [Hornbach România: ce face un dezumidificator](https://www.hornbach.ro/proiecte/ce-face-un-dezumidificator/)
- [Spotmedia: umiditatea ridicată și sănătatea](https://spotmedia.ro/stiri/sanatate/de-ce-umiditatea-ridicata-iti-afecteaza-sanatatea-si-cum-o-poti-controla)$md$
),
(
  'cat-consuma-un-dezumidificator',
  'Cât consumă un dezumidificator: W, kWh și cost pe lună',
  'Un dezumidificator cu compresor consumă de obicei 200–700 W. Iată formula și un exemplu de calcul.',
  'Umiditate și ventilație',
  'Cât consumă un dezumidificator: W, kWh, cost lunar',
  'Consumul unui dezumidificator: de obicei 200–700 W (0,2–0,7 kWh pe oră). Formula de calcul, exemplu și cum reduci costul.',
  'published',
  now(),
  $md$Un dezumidificator cu compresor consumă, de regulă, **între aproximativ 200 și 700 W**, adică 0,2–0,7 kWh pe oră, în funcție de capacitate și model. Valoarea exactă este puterea nominală din fișa tehnică.

## Cum calculezi

**kWh = putere (W) × ore ÷ 1000.** Exemplu: un aparat de 300 W care merge 8 ore consumă 2,4 kWh pe zi. Înmulțești cu prețul kWh din factura ta și cu numărul de zile.

## Ordine de mărime după capacitate

Sursele indică, orientativ, 300–460 W pentru modelele mici, 500–590 W pentru cele medii și 600–700 W sau mai mult pentru cele mari. Alte surse dau valori mai mici pentru modele de 12–16 litri pe zi (în jur de 230–300 W). Diferențele vin din modele și metode de măsurare, deci nu te baza pe o singură cifră.

## Cum reduci costul

- **Alege capacitatea potrivită** camerei, nici prea mic, nici prea mare.
- **Folosește higrostatul** ca aparatul să se oprească la umiditatea țintă.
- **Închide ușile și ferestrele** cât timp funcționează.
- **Rezolvă sursa umezelii**, altfel aparatul lucrează continuu.

## Întrebări frecvente

**Merge tot timpul?** Nu, cu higrostat se oprește când atinge umiditatea setată, în jur de 40–50%, vezi [umiditatea ideală](/blog/dezumidificator-cand-ai-nevoie-umiditate-ideala).

**Dezumidificator sau aer condiționat?** Aerul condiționat poate dezumidifica, dar nu e conceput pentru asta. Vezi [ghidul de alegere](/blog/cum-alegi-aerul-conditionat-ghid-complet).

Vezi [dezumidificatoarele din magazin](/dezumidificatoare).

## Surse

- [Antena 3 CNN: câtă energie consumă un dezumidificator](https://www.antena3.ro/continut-platit/cata-energie-electrica-consuma-un-dezumidificator-657292.html)
- [Deye România: consumul dezumidificatoarelor](https://deye.com/ro/blog/do-dehumidifiers-use-a-lot-of-electricity/)
- [Repsol: consum dezumidificator](https://www.repsol.pt/particulares/assessoramento/consumo-desumidificador/)
- [Compari.ro: ghid de cumpărare dezumidificator](https://www.compari.ro/buyingguide/dezumidificator.html)$md$
)
ON CONFLICT (slug) DO NOTHING;

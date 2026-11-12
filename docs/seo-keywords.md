# AirLife: keyword research și clustere de conținut

**Metodă.** Sugestiile Google Autocomplete pentru România (hl=ro, gl=ro), extinse cu litere și prefixe de întrebare (cum, ce, cât, de ce, când, cel mai bun, preț), pentru 16 teme-sămânță. Acestea arată **cerere reală de căutare**, dar nu volume. Pentru volume și dificultate, conectează Ahrefs/Semrush și rulează aceleași teme. Refacerea listei: scriptul de autocomplete din istoricul sesiunii (16 seeds x ~27 variante).

## Cum este organizat blogul

Categoria articolului = clusterul. Fiecare cluster are un articol-pilon și sateliți care se leagă între ei; pagina de blog le grupează pe cluster, iar fiecare articol afișează „Citește și" din același cluster.

| Cluster | Pilon | Sateliți |
|---|---|---|
| **Alegere aer condiționat** | `/blog/cum-alegi-aerul-conditionat-ghid-complet` | ce BTU, inverter sau fără inverter, consum inverter, iarna/încălzire, kit de montaj, prețul montajului, fără unitate exterioară |
| **Întreținere și probleme** | `/ghid/igienizare-aer-conditionat` (+ serviciul de igienizare) | cât de des igienizezi, cum cureți filtrele, miros urât, de ce pică apă |
| **Aer curat** | `/purificatoare-aer` | purificator pentru alergii (HEPA, CADR), filtru HEPA (H13, schimbare) |
| **Umiditate și ventilație** | `/dezumidificatoare` | umiditate ideală, cât consumă un dezumidificator, ventilator de baie, mucegai în baie, recuperator de căldură |

## Cererea găsită, pe temă (extras)

- **Alegere / consum:** aer condiționat 12000 BTU / 18000 BTU / 9000 BTU; inverter cu sau fără; consum 12000 BTU, pe lună, iarna, în standby; calculator consum; fără unitate exterioară (preț, păreri, 4 în 1).
- **Montaj:** cât costă montajul, cât durează, ce conține kitul de montaj, firme de montaj, cu montaj inclus.
- **Igienizare / service:** cât costă igienizarea, ce înseamnă igienizare, cel mai bun spray, preț service, freon.
- **Iarna:** aer condiționat pe cald iarna, funcționare iarna, consum iarna, condens iarna, temperatură iarna.
- **Purificatoare:** cel mai bun purificator, pentru alergii, pentru apartament, pentru copii, pentru praf, ce face, beneficii.
- **HEPA:** ce înseamnă filtru HEPA, filtru HEPA aer condiționat.
- **Dezumidificatoare:** cât consumă (pe oră, pe lună), cât costă, ce dezumidificator să aleg, de ce curge apă, de ce îngheață, când se folosește.
- **Umiditate:** umiditate ideală / normală / optimă, cauze, măsurare, bebeluși, vara, iarna.
- **Ventilație:** ventilator baie cu senzor de umiditate / timer / antiretur, preț, montaj; recuperator de căldură (ce este, preț, apartament, montaj).
- **Mucegai baie:** de ce apare, soluții, rosturi, tavan, miros.

## Ce NU atacăm (concurență prea mare sau nepotrivit)

Interogări de brand și retail (Daikin, Gree, Altex, Dedeman, eMAG), „aer condiționat auto", „pret aer condiționat X" fără avantaj de preț. Intenția acolo este comparare de preț și brand, iar AirLife nu o poate câștiga.

## Backlog următor (cerere confirmată, încă neacoperită)

1. Cât costă o igienizare de aer condiționat (fără prețuri inventate: factori și intervale reale, după ce ai prețurile tale).
2. Cel mai bun purificator pentru apartament / pentru copii (după ce ai produsele și recenziile).
3. Aer condiționat cu 2 unități interioare (multisplit): când merită.
4. De ce îngheață / nu merge dezumidificatorul.
5. Cum măsori umiditatea în casă (higrometru) și ce nivel setezi vara/iarna.
6. Ventilator de baie: cum se montează și ce diametru alegi.
7. Recuperator de căldură pentru apartament: preț și montaj (după ce ai prețuri și instalări reale).

## Reguli de conținut (E-E-A-T)

- Fiecare articol: răspuns direct în primul paragraf, secțiune „Întrebări frecvente" (devine `FAQPage`) și secțiune „Surse" cu linkuri.
- Cifrele se dau ca intervale și cu surse; nu inventăm prețuri, recenzii sau certificări.
- Autorul se setează în `src/data/author.ts` (nume + funcție). Cât timp numele e gol, articolele apar semnate „Echipa AirLife", iar schema folosește Organization.

# Sincronizarea stocului cu furnizorii

Data: 2026-11-26. Design aprobat; precomenzile Novingair se tratează ca indisponibile.

## Scop

Stocul de pe airlife.ro urmează zilnic disponibilitatea din cataloagele publice ale furnizorilor.
Se modifică doar `products.stock`. Prețurile și vizibilitatea rămân neatinse.

## Surse

| Furnizor (`suppliers.name`) | Adresă | Disponibil când | Potrivire |
|---|---|---|---|
| Ecovent | `https://ecovent.ro/products.json?limit=250&page=N`, până la prima pagină goală | `variant.available` | `variant.sku` |
| Novingair | `https://ventilatie-recuperare.ro/wp-json/wc/store/v1/products?per_page=100&page=N`, o dată simplu și o dată cu `type=variation` | `is_in_stock && !is_on_backorder` | `sku` |

SKU-ul se compară cu `supplier_products.supplier_sku`, fără spații la capete și fără diferență între litere mari și mici.
Verificat pe 2026-11-26: Ecovent 673/673, Novingair 51/51, fără SKU-uri duplicate la Ecovent.

## Reguli

| La furnizor | La noi |
|---|---|
| indisponibil (inclusiv precomandă) | `stock = 0` |
| disponibil | `stock = 10` |
| SKU negăsit | neschimbat |

Se scriu doar rândurile al căror stoc se schimbă. Stocul pus manual în admin la aceste produse este suprascris.
Un produs legat de mai mulți furnizori este disponibil dacă îl are cel puțin unul. Dacă niciunul dintre cei citiți
nu îl are, iar alt furnizor al lui a fost sărit, rămâne neschimbat.

## Protecții, pe fiecare furnizor

Nu se modifică nimic pentru furnizorul respectiv dacă:

1. o pagină din catalog dă eroare (la 429 se așteaptă `retry-after`, maximum 90 s, și se reîncearcă o dată);
2. se potrivesc sub 90% din produsele noastre;
3. peste 30% din produsele aflate în stoc ar trece pe 0.

Protecția 3 ar bloca prima rulare la Novingair (28 din 51 sunt în precomandă, adică 55%).
Prima rulare se face de aceea manual, cu `force`, după verificarea raportului. `force` sare doar peste protecția 3.

## Componente

- `src/lib/stockSync.ts`: citirea cataloagelor, funcția pură de planificare (rânduri + disponibilitate → modificări sau motiv de oprire), aplicarea modificărilor.
- `src/app/api/cron/automations/route.ts`: apelează sincronizarea înainte de `stockAlerts`; `maxDuration = 300`.
- E-mail către `contact@airlife.ro` când un furnizor este sărit, există SKU-uri negăsite sau se schimbă stocul, cu lista produselor.
- `scripts/stock-sync.ts`: rulare manuală. Implicit doar raportează; `--apply` scrie; `--force` pentru prima rulare.
- `scripts/stock-sync-check.ts`: test cu `assert` pentru funcția de planificare.

## Activare

Cron-ul sincronizează doar dacă `STOCK_SYNC_ENABLED=1` în Vercel. Variabila se setează după acordul scris al
furnizorilor (`robots.txt` la Novingair interzice accesul automat la `/wp-json/`) și după prima rulare manuală.

## În afara scopului

Cantități reale, prețuri de achiziție, eticheta „La comandă”, listă în admin, import de produse noi.

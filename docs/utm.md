# UTM: linkuri pe fiecare canal

Regula: `utm_source` = de unde vine click-ul, `utm_medium` = tipul canalului, `utm_campaign` = ce promovăm (litere mici, fără diacritice, cu cratime), `utm_content` = opțional (ce postare / ce reclamă).
Generatorul din admin (tab „Oferte” > „Linkuri cu UTM pe fiecare canal”) face linkurile gata de copiat. Sursele sunt în `src/lib/utm.ts`.

| Canal | source | medium | Link pentru profil / bio |
|---|---|---|---|
| Facebook | facebook | social | https://airlife.ro/?utm_source=facebook&utm_medium=social&utm_campaign=profil |
| Instagram | instagram | social | https://airlife.ro/?utm_source=instagram&utm_medium=social&utm_campaign=profil |
| LinkedIn | linkedin | social | https://airlife.ro/?utm_source=linkedin&utm_medium=social&utm_campaign=profil |
| Newsletter | newsletter | email | adăugat automat în emailuri (`src/emails/brand.ts`) |
| Reclame Meta | meta | paid_social | ex. ...&utm_campaign=montaj-buzau&utm_content=video-1 |
| Google Ads | google | cpc | idem |
| Google Business Profile | google | organic_local | https://airlife.ro/?utm_source=google&utm_medium=organic_local&utm_campaign=gbp |
| WhatsApp | whatsapp | messaging | idem |
| Banner pe site | site | banner | adăugat automat de campaniile din admin |

Linkurile interne (meniu, footer) nu primesc UTM: ar strica atribuirea sesiunii.
Instagram permite editarea linkului din bio doar din aplicația mobilă.

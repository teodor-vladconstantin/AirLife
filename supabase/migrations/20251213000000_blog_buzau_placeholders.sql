-- Draft placeholders for local long-tail articles (Buzău). They stay hidden (status = 'draft') until written
-- and published from /admin. Content is markdown; replace the TODO text before publishing.
INSERT INTO public.blog_posts (slug, title, excerpt, content, category, meta_title, meta_description, status)
VALUES
  ('aer-conditionat-inverter-vs-clasic-consum-buzau',
   'Aer condiționat inverter vs clasic: consum și costuri în Buzău',
   'Cât consumă un aparat inverter față de unul clasic și când merită diferența de preț.',
   E'TODO: răspuns direct în primul paragraf (2-3 propoziții).\n\n## Diferența dintre inverter și clasic\n\nTODO\n\n## Consum comparat\n\nTODO: intervale cu sursă, fără cifre inventate.\n\n## Întrebări frecvente\n\nTODO: 3 întrebări locale.\n\n## Surse\n\nTODO',
   'Alegere aer condiționat',
   'Aer condiționat inverter vs clasic: consum în Buzău | AirLife',
   'Inverter sau clasic? Compară consumul și costurile pentru o locuință din Buzău și alege aparatul potrivit.',
   'draft'),
  ('cat-costa-montajul-aer-conditionat-buzau',
   'Cât costă montajul unui aer condiționat în Buzău',
   'De ce depinde prețul montajului și ce include o instalare standard.',
   E'TODO: răspuns direct în primul paragraf.\n\n## Ce include montajul standard\n\nTODO\n\n## De ce depinde prețul\n\nTODO\n\n## Întrebări frecvente\n\nTODO: 3 întrebări locale.\n\n## Surse\n\nTODO',
   'Alegere aer condiționat',
   'Cât costă montajul aerului condiționat în Buzău | AirLife',
   'Ce include montajul și de ce depinde prețul final al instalării unui aer condiționat în Buzău și în județ.',
   'draft'),
  ('cand-igienizezi-aer-conditionat-buzau',
   'Când și cât de des igienizezi aerul condiționat în Buzău',
   'Frecvența recomandată pentru igienizare în locuințe și birouri și semnele că ai întârziat.',
   E'TODO: răspuns direct în primul paragraf.\n\n## Cât de des se igienizează\n\nTODO\n\n## Semne că e nevoie de igienizare\n\nTODO\n\n## Întrebări frecvente\n\nTODO: 3 întrebări locale.\n\n## Surse\n\nTODO',
   'Întreținere și probleme',
   'Igienizare aer condiționat în Buzău: când și cât de des | AirLife',
   'Cât de des igienizezi aerul condiționat și cum programezi igienizarea la domiciliu în Buzău.',
   'draft')
ON CONFLICT (slug) DO NOTHING;

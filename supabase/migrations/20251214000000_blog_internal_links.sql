-- Blog posts still link to the old service/guide URLs (they 308 to the -buzau slugs) and to /request-quote (308 to /products).
-- Point the links straight at the final URLs so crawlers and visitors skip the redirect. Idempotent: already-fixed links do not match.
UPDATE public.blog_posts
SET content = regexp_replace(
      regexp_replace(
        regexp_replace(content, '/servicii/(montaj|igienizare|service)-aer-conditionat(?![-a-z])', '/servicii/\1-aer-conditionat-buzau', 'g'),
        '/ghid/(ce-btu|cost-montaj|igienizare)-aer-conditionat(?![-a-z])', '/ghid/\1-aer-conditionat-buzau', 'g'),
      '/request-quote', '/products', 'g')
WHERE content ~ '/servicii/(montaj|igienizare|service)-aer-conditionat(?![-a-z])'
   OR content ~ '/ghid/(ce-btu|cost-montaj|igienizare)-aer-conditionat(?![-a-z])'
   OR content LIKE '%/request-quote%';

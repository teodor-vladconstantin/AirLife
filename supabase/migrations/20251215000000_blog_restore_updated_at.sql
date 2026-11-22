-- Repairs the side effect of 20251214000000_blog_internal_links.sql: the blog_posts_updated_at trigger set
-- updated_at to the migration date on every post it touched, so those posts showed a false "Actualizat" date
-- (and a fresh dateModified in schema/sitemap) although only internal links changed.
-- The trigger is switched off while this runs, so this migration does not bump the dates again.
ALTER TABLE public.blog_posts DISABLE TRIGGER blog_posts_updated_at;

-- 1) Restore the update date of the affected posts (the real earlier update dates were overwritten and cannot be
--    recovered; the publish date is the honest fallback, and the page hides "Actualizat" when it equals it).
UPDATE public.blog_posts
SET updated_at = published_at
WHERE status = 'published'
  AND published_at IS NOT NULL
  AND updated_at::date = DATE '2026-11-22';

-- 2) The two posts whose canonical is a guide are no longer linked from other posts: link the guide directly.
UPDATE public.blog_posts
SET content = replace(replace(content,
      '/blog/ce-btu-sa-alegi-pentru-aer-conditionat', '/ghid/ce-btu-aer-conditionat-buzau'),
      '/blog/ce-influenteaza-pretul-montajului-aerului-conditionat', '/ghid/cost-montaj-aer-conditionat-buzau')
WHERE content LIKE '%/blog/ce-btu-sa-alegi-pentru-aer-conditionat%'
   OR content LIKE '%/blog/ce-influenteaza-pretul-montajului-aerului-conditionat%';

ALTER TABLE public.blog_posts ENABLE TRIGGER blog_posts_updated_at;

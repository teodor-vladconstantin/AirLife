-- The shop section moved from /products to /produse (the old URLs 308 to the new ones). Update the links inside blog posts.
-- The blog_posts_updated_at trigger is switched off so the posts do not get a false "Actualizat" date (see 20251215000000).
ALTER TABLE public.blog_posts DISABLE TRIGGER blog_posts_updated_at;

UPDATE public.blog_posts
SET content = replace(replace(replace(content,
      'airlife.ro/products', 'airlife.ro/produse'),
      '](/products', '](/produse'),
      'href="/products', 'href="/produse')
WHERE content LIKE '%/products%';

ALTER TABLE public.blog_posts ENABLE TRIGGER blog_posts_updated_at;

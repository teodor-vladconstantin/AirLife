import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import NotFound from "@/pages/NotFound";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { renderMarkdown } from "@/lib/markdown";
import { PHONE_DISPLAY, PHONE_TEL } from "@/data/localSeo";

const BlogPost = () => {
  const { slug = "" } = useParams();
  const [post, setPost] = useState<Tables<"blog_posts"> | null | undefined>(undefined); // undefined = loading

  useEffect(() => {
    setPost(undefined);
    supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle()
      .then(({ data }) => setPost(data));
  }, [slug]);

  if (post === undefined) return <div className="min-h-screen flex items-center justify-center">Se încarcă...</div>;
  if (post === null) return <NotFound />;

  const url = `https://airlife.ro/blog/${post.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.meta_description || post.excerpt || undefined,
    image: post.cover_image || undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: url,
    author: { "@type": "Organization", name: "AirLife" },
    publisher: { "@type": "Organization", name: "AirLife", url: "https://airlife.ro/" },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={post.meta_title || `${post.title} | AirLife`}
        description={post.meta_description || post.excerpt || post.title}
        canonical={url}
        ogType="article"
        ogImage={post.cover_image || undefined}
        structuredData={structuredData}
      />
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <article className="container mx-auto px-4 max-w-3xl space-y-8">
          <nav className="text-sm text-muted-foreground">
            <Link to="/blog" className="hover:underline">Blog</Link>
            {post.category && <> · {post.category}</>}
          </nav>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{post.title}</h1>
          {post.published_at && (
            <time dateTime={post.published_at} className="block text-sm text-muted-foreground">
              {new Date(post.published_at).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" })}
            </time>
          )}
          {post.cover_image && <img src={post.cover_image} alt={post.title} className="w-full rounded-xl" />}
          <div className="prose prose-neutral prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />

          <div className="rounded-xl border bg-card p-6 space-y-3">
            <p className="font-semibold">Ai nevoie de montaj, igienizare sau service?</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild><a href={`tel:${PHONE_TEL}`}>{PHONE_DISPLAY}</a></Button>
              <Button asChild variant="outline"><Link to="/request-quote">Cere ofertă online</Link></Button>
            </div>
          </div>

          <LeadMagnetForm
            magnet="checklist-intretinere-ac"
            title="Checklist gratuit de întreținere pentru aer condiționat"
            description="Ce verifici înainte de sezon și când chemi un specialist. PDF trimis pe email."
            source={`blog:${post.slug}`}
          />
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPost;

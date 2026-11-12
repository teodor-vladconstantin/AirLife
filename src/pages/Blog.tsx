import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import LeadMagnetForm from "@/components/LeadMagnetForm";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { inCluster, orderedClusters } from "@/data/blogClusters";

type Post = Pick<Tables<"blog_posts">, "id" | "slug" | "title" | "excerpt" | "cover_image" | "category" | "published_at">;

const Blog = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    supabase
      .from("blog_posts")
      .select("id,slug,title,excerpt,cover_image,category,published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .then(({ data }) => setPosts(data ?? []));
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title="Blog | Sfaturi aer condiționat | AirLife"
        description="Ghiduri practice despre alegerea, montajul, igienizarea și service-ul aerului condiționat. Sfaturi de la specialiștii AirLife."
        canonical="https://airlife.ro/blog"
      />
      <Navbar />
      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-5xl space-y-10">
          <header className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-3">Blog AirLife</h1>
            <p className="text-muted-foreground text-lg">Sfaturi practice despre aerul condiționat, de la echipa care îl montează și îl întreține.</p>
          </header>

          {posts === null && <p className="text-muted-foreground">Se încarcă...</p>}
          {posts?.length === 0 && <p className="text-muted-foreground">Articolele apar în curând.</p>}

          {orderedClusters(posts ?? []).map((cat) => (
            <section key={cat} className="space-y-4">
              <h2 className="text-2xl font-bold">{cat}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inCluster(posts ?? [], cat).map((p) => (
              <Link key={p.id} to={`/blog/${p.slug}`}>
                <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                  {p.cover_image && <img src={p.cover_image} alt={p.title} loading="lazy" className="w-full h-40 object-cover" />}
                  <CardContent className="p-5 space-y-2">
                    <h3 className="font-semibold text-lg leading-snug">{p.title}</h3>
                    {p.excerpt && <p className="text-sm text-muted-foreground">{p.excerpt}</p>}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
            </section>
          ))}

          <LeadMagnetForm
            magnet="checklist-intretinere-ac"
            title="Checklist gratuit de întreținere pentru aer condiționat"
            description="Ce verifici înainte de sezon și când chemi un specialist. PDF trimis pe email."
            source="blog-index"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;

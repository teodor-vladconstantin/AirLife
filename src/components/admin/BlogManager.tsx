import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import { renderMarkdown, slugify } from "@/lib/markdown";

type Post = Tables<"blog_posts">;
type Draft = Pick<
  Post,
  "title" | "slug" | "excerpt" | "content" | "cover_image" | "category" | "meta_title" | "meta_description" | "status"
>;

const EMPTY: Draft = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  category: "",
  meta_title: "",
  meta_description: "",
  status: "draft",
};

export const BlogManager = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null); // post id, or "new"
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [preview, setPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
    if (error) return toast({ title: "Eroare", description: error.message, variant: "destructive" });
    setPosts(data ?? []);
  };
  useEffect(() => {
    load();
  }, []);

  const edit = (p: Post | null) => {
    setEditingId(p ? p.id : "new");
    setDraft(p ? { ...EMPTY, ...p } : EMPTY);
    setPreview(false);
  };

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const uploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const name = `blog/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${file.name.split(".").pop()}`;
    const { error } = await supabase.storage.from("media").upload(name, file);
    setUploading(false);
    if (error) return toast({ title: "Eroare upload", description: error.message, variant: "destructive" });
    set("cover_image", supabase.storage.from("media").getPublicUrl(name).data.publicUrl);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const existing = posts.find((p) => p.id === editingId);
    const row = {
      ...draft,
      slug: slugify(draft.slug || draft.title),
      cover_image: draft.cover_image || null,
      published_at: draft.status === "published" ? (existing?.published_at ?? new Date().toISOString()) : null,
    };
    const { error } =
      editingId === "new"
        ? await supabase.from("blog_posts").insert(row)
        : await supabase.from("blog_posts").update(row).eq("id", editingId!);
    if (error) return toast({ title: "Eroare", description: error.message, variant: "destructive" });
    toast({ title: draft.status === "published" ? "Articol publicat" : "Ciornă salvată" });
    setEditingId(null);
    load();
  };

  const remove = async (p: Post) => {
    if (!window.confirm(`Ștergi definitiv „${p.title}”?`)) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", p.id);
    if (error) return toast({ title: "Eroare", description: error.message, variant: "destructive" });
    load();
  };

  if (editingId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{editingId === "new" ? "Articol nou" : "Editează articol"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="b_title">Titlu</Label>
                <Input id="b_title" required value={draft.title} onChange={(e) => set("title", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="b_slug">Slug (URL)</Label>
                <Input
                  id="b_slug"
                  placeholder={slugify(draft.title) || "se-genereaza-din-titlu"}
                  value={draft.slug}
                  onChange={(e) => set("slug", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="b_cat">Categorie</Label>
                <Input id="b_cat" value={draft.category ?? ""} onChange={(e) => set("category", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="b_status">Stare</Label>
                <select
                  id="b_status"
                  className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  value={draft.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  <option value="draft">Ciornă (nepublic)</option>
                  <option value="published">Publicat</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="b_excerpt">Rezumat (apare în listă)</Label>
              <Textarea id="b_excerpt" rows={2} value={draft.excerpt ?? ""} onChange={(e) => set("excerpt", e.target.value)} />
            </div>

            <div>
              <Label htmlFor="b_cover">Imagine copertă</Label>
              <Input id="b_cover" type="file" accept="image/*" onChange={uploadCover} disabled={uploading} />
              {draft.cover_image && <img src={draft.cover_image} alt="Copertă" className="mt-2 max-h-32 rounded" />}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="b_content">Conținut (Markdown: ## titlu, **bold**, - listă, [text](url))</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => setPreview((p) => !p)}>
                  {preview ? "Editează" : "Previzualizare"}
                </Button>
              </div>
              {preview ? (
                <div
                  className="prose prose-neutral max-w-none rounded-md border p-4"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(draft.content) }}
                />
              ) : (
                <Textarea
                  id="b_content"
                  rows={18}
                  className="font-mono text-sm"
                  value={draft.content}
                  onChange={(e) => set("content", e.target.value)}
                />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="b_mt">Meta title (SEO, ~60 caractere)</Label>
                <Input id="b_mt" maxLength={70} value={draft.meta_title ?? ""} onChange={(e) => set("meta_title", e.target.value)} />
              </div>
              <div>
                <Label htmlFor="b_md">Meta description (SEO, ~155 caractere)</Label>
                <Input
                  id="b_md"
                  maxLength={170}
                  value={draft.meta_description ?? ""}
                  onChange={(e) => set("meta_description", e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Salvează</Button>
              <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                Anulează
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => edit(null)}>
        <Plus className="h-4 w-4 mr-2" />
        Articol nou
      </Button>
      <Card>
        <CardContent className="p-0 divide-y">
          {posts.length === 0 && <p className="p-6 text-muted-foreground">Niciun articol încă.</p>}
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between gap-4 p-4">
              <div className="min-w-0">
                <p className="font-medium truncate">{p.title}</p>
                <p className="text-xs text-muted-foreground">
                  /blog/{p.slug} · {p.status === "published" ? "Publicat" : "Ciornă"}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                {p.status === "published" && (
                  <Button asChild size="icon" variant="ghost">
                    <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" aria-label="Vezi">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
                <Button size="icon" variant="ghost" onClick={() => edit(p)} aria-label="Editează">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(p)} aria-label="Șterge">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

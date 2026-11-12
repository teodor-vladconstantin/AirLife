// Shared by the React page and scripts/prerender.ts (so no "@/" aliases here).
import { AUTHOR, SITE } from "../data/author";

interface PostLike {
  slug: string;
  title: string;
  excerpt?: string | null;
  content: string;
  cover_image?: string | null;
  meta_description?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
}

const plain = (s: string) => s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "").trim();

/** Q/A pairs from the "## Întrebări frecvente" section written as **Question?** answer. */
export const faqFromMarkdown = (md: string) => {
  const at = md.search(/^##\s+Întrebări frecvente/m);
  if (at < 0) return [];
  const section = md.slice(at).split(/\n##\s/)[0];
  return [...section.matchAll(/\*\*([^*\n]+\?)\*\*\s*([^\n]+)/g)].map((m) => ({ q: plain(m[1]), a: plain(m[2]) }));
};

export const authorSchema = () =>
  AUTHOR.name
    ? { "@type": "Person", name: AUTHOR.name, jobTitle: AUTHOR.jobTitle || undefined, url: AUTHOR.url || undefined, worksFor: { "@type": "Organization", name: "AirLife" } }
    : { "@type": "Organization", name: "AirLife", url: `${SITE}/` };

export const postSchemas = (p: PostLike) => {
  const url = `${SITE}/blog/${p.slug}`;
  const faq = faqFromMarkdown(p.content);
  return [
    {
      "@context": "https://schema.org", "@type": "Article", headline: p.title,
      description: p.meta_description || p.excerpt || undefined, image: p.cover_image || `${SITE}/og-image.jpg`,
      datePublished: p.published_at, dateModified: p.updated_at || p.published_at, inLanguage: "ro-RO",
      mainEntityOfPage: url, author: authorSchema(),
      publisher: { "@type": "Organization", name: "AirLife", url: `${SITE}/`, logo: { "@type": "ImageObject", url: `${SITE}/og-image.jpg` } },
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Acasă", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
        { "@type": "ListItem", position: 3, name: p.title, item: url },
      ],
    },
    ...(faq.length
      ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }]
      : []),
  ];
};

export const roDate = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" }) : "");

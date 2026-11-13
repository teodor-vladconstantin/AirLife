import { marked } from "marked";
import DOMPurify from "dompurify";

// ponytail: server render skips DOMPurify (needs a DOM); post content is admin-only. Add isomorphic-dompurify if authors ever include untrusted users.
export const renderMarkdown = (md: string): string => {
  const html = marked.parse(md, { async: false }) as string;
  return typeof window === "undefined" ? html : DOMPurify.sanitize(html);
};

// "Cât costează montajul?" -> "cat-costa-montajul"
export const slugify = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

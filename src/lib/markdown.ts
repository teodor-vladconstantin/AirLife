import { marked } from "marked";
import DOMPurify from "dompurify";

export const renderMarkdown = (md: string): string =>
  DOMPurify.sanitize(marked.parse(md, { async: false }) as string);

// "Cât costează montajul?" -> "cat-costa-montajul"
export const slugify = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

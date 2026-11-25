import { CheckCircle2 } from "lucide-react";
import { extraFeatures, parseDescription } from "@/lib/description";

// One consistent layout for every product description: lead paragraph, subheadings, check lists, spec tables, tags.
export function ProductDescription({ description, features }: { description: string; features: string[] }) {
  const blocks = parseDescription(description);
  const extra = extraFeatures(features, blocks);
  return (
    <div className="max-w-3xl space-y-4 text-[15px] leading-7 text-muted-foreground">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case "h":
            // a heading right after another heading is a subtitle: lighter, no extra gap
            return blocks[i - 1]?.kind === "h"
              ? <h4 key={i} className="!mt-1 text-base font-semibold leading-snug text-foreground/80">{b.text}</h4>
              : <h3 key={i} className="pt-4 text-lg font-semibold leading-snug text-foreground first:pt-0">{b.text}</h3>;
          case "p":
            return <p key={i} className={b.lead ? "text-base text-foreground/90" : undefined}>{b.text}</p>;
          case "list":
            return (
              <ul key={i} className="space-y-2">
                {b.items.map((x, k) => (
                  <li key={k} className="flex items-start gap-2.5"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{x}</span></li>
                ))}
              </ul>
            );
          case "kv":
            return (
              <dl key={i} className="divide-y divide-border rounded-lg border border-border text-sm">
                {b.rows.map(([k, v], r) => (
                  <div key={r} className="grid grid-cols-[minmax(6rem,2fr)_3fr] gap-3 px-4 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium text-foreground">{v}</dd></div>
                ))}
              </dl>
            );
          case "tags":
            return (
              <ul key={i} className="flex flex-wrap gap-2">
                {b.items.map((x, k) => <li key={k} className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-foreground">{x}</li>)}
              </ul>
            );
        }
      })}
      {extra.length > 0 && (
        <>
          <h3 className="pt-4 text-lg font-semibold leading-snug text-foreground">Caracteristici</h3>
          <ul className="space-y-2">
            {extra.map((x, k) => (
              <li key={k} className="flex items-start gap-2.5"><CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" /><span>{x}</span></li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

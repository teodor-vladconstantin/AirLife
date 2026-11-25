import { Link } from "@/lib/router";
import { DEFAULT_FILTERS, toQuery } from "@/lib/shop";
import { BRAND_LOGOS } from "@/data/brandLogos";

// Brands sold in the shop, drifting right to left. Each one opens the product list filtered by that brand.
// A logo file listed in src/data/brandLogos.ts is shown when there is one, otherwise the brand name as a wordmark.
// Brands are shown only to identify the products sold; AirLife is not affiliated with them (note under the strip).
export type MarqueeBrand = { name: string; count: number };

const BrandMarquee = ({ brands }: { brands: MarqueeBrand[] }) => {
  if (brands.length < 4) return null;
  const set = (hidden: boolean) =>
    brands.map((b) => {
      const logo = BRAND_LOGOS[b.name];
      return (
        <li key={`${hidden ? "b" : "a"}-${b.name}`} aria-hidden={hidden || undefined} className="shrink-0">
          <Link
            to={`/produse${toQuery({ ...DEFAULT_FILTERS, brands: [b.name] })}`}
            tabIndex={hidden ? -1 : undefined}
            aria-label={hidden ? undefined : `${b.name}: ${b.count} ${b.count === 1 ? "produs" : "produse"}`}
            className="flex min-h-11 items-center px-6 text-foreground/55 transition-colors hover:text-foreground md:px-8"
          >
            {logo ? (
              <img src={logo} alt={hidden ? "" : b.name} loading="lazy" decoding="async" className="h-8 w-auto max-w-[8rem] object-contain grayscale md:h-9" />
            ) : (
              <span className="whitespace-nowrap text-xl font-bold tracking-tight md:text-2xl">{b.name}</span>
            )}
          </Link>
        </li>
      );
    });

  return (
    <section aria-labelledby="brands-h" className="border-y border-border bg-background py-8 md:py-10">
      <p id="brands-h" className="mb-4 px-4 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mărci disponibile în magazin</p>
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <ul className="flex w-max animate-marquee items-center hover:[animation-play-state:paused] motion-reduce:animate-none">
          {set(false)}
          {set(true)}
        </ul>
      </div>
      <p className="mx-auto mt-5 max-w-2xl px-4 text-center text-xs leading-relaxed text-muted-foreground">
        Mărcile și siglele aparțin proprietarilor lor și sunt afișate doar pentru a identifica produsele din magazin. AirLife nu este afiliat cu aceste mărci.
      </p>
    </section>
  );
};

export default BrandMarquee;

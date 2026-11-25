"use client";
import { useEffect, useId, useRef, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { useLocation, useNavigate } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import { isShopVisible } from "@/lib/pricing";
import { formatPrice } from "@/lib/shop";

interface Hit { id: string; slug: string; name: string; brand: string | null; price: number; image_url: string }

// Product search with live suggestions. Enter (or "Vezi toate") opens /produse?q=… with the full filterable list.
export function SearchBox({ className = "", autoFocus = false, onDone }: { className?: string; autoFocus?: boolean; onDone?: () => void }) {
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const box = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    const term = q.trim().replace(/[,()%*\\]/g, " ").replace(/\s+/g, " ");
    if (term.length < 2) { setHits([]); setLoading(false); return; }
    let live = true;
    setLoading(true);
    const t = setTimeout(async () => {
      const like = `%${term.split(" ").join("%")}%`;
      const { data } = await supabase
        .from("products")
        .select("id,slug,name,brand,price,image_url,hidden,stock")
        .not("slug", "is", null)
        .or(`name.ilike.${like},brand.ilike.${like}`)
        .order("stock", { ascending: false })
        .limit(24);
      if (!live) return;
      setLoading(false);
      setHits((data ?? []).filter(isShopVisible).slice(0, 6) as Hit[]);
      setActive(-1);
    }, 220);
    return () => { live = false; clearTimeout(t); };
  }, [q]);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!box.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const go = (to: string) => {
    setOpen(false);
    onDone?.();
    // already on the product list: update its filters in place (the list reads the address on popstate)
    if (pathname === "/produse" && to.startsWith("/produse?")) {
      window.history.pushState(null, "", to);
      window.dispatchEvent(new PopStateEvent("popstate"));
      return;
    }
    navigate(to);
  };
  const submit = () => {
    const term = q.trim();
    if (active >= 0 && hits[active]) return go(`/produse/${hits[active].slug}`);
    go(term ? `/produse?q=${encodeURIComponent(term)}` : "/produse");
  };
  const show = open && q.trim().length >= 2;

  return (
    <div ref={box} className={`relative ${className}`}>
      <form role="search" onSubmit={(e) => { e.preventDefault(); submit(); }}>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
          }}
          placeholder="Caută produse…"
          aria-label="Caută produse"
          role="combobox"
          aria-expanded={show}
          aria-controls={listId}
          aria-autocomplete="list"
          className="h-11 w-full rounded-full border border-transparent bg-secondary/70 pl-10 pr-4 text-base outline-none placeholder:text-muted-foreground focus-visible:border-primary/40 focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-ring xl:h-10"
        />
      </form>
      {show && (
        <ul id={listId} role="listbox" className="absolute left-0 top-full z-50 mt-2 max-h-[70vh] w-full min-w-[22rem] max-w-[calc(100vw-2rem)] overflow-auto rounded-xl border border-border bg-popover p-1 shadow-lg">
          {hits.map((h, i) => (
            <li key={h.id} role="option" aria-selected={i === active}>
              <button type="button" onClick={() => go(`/produse/${h.slug}`)} className={`flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-secondary ${i === active ? "bg-secondary" : ""}`}>
                <img src={h.image_url} alt="" width={40} height={40} loading="lazy" className="h-10 w-10 shrink-0 rounded bg-white object-contain" />
                <span className="min-w-0 flex-1">
                  <span className="line-clamp-2 text-sm font-medium text-foreground">{h.name}</span>
                  {h.brand && <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">{h.brand}</span>}
                </span>
                <span className="shrink-0 text-sm font-semibold text-foreground">{formatPrice(h.price)}</span>
              </button>
            </li>
          ))}
          {loading && hits.length === 0 && <li className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground" role="presentation"><Loader2 className="h-4 w-4 animate-spin" /> Se caută…</li>}
          {!loading && hits.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground" role="presentation">Niciun produs găsit pentru „{q.trim()}”.</li>}
          <li role="presentation">
            <button type="button" onClick={() => go(`/produse?q=${encodeURIComponent(q.trim())}`)} className="w-full rounded-lg p-2 text-center text-sm font-semibold text-primary hover:bg-secondary">
              Vezi toate rezultatele
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

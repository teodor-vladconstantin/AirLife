"use client";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useBarOffset } from "@/lib/bars";
import { Link, useNavigate } from "@/lib/router";
import type { loadProduct, Product, ReviewData } from "@/lib/catalog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductReviews, Stars } from "@/components/shop/ProductReviews";
import { StockAlertForm } from "@/components/shop/StockAlertForm";
import { WishlistButton } from "@/components/shop/WishlistButton";
import { ProductCard } from "@/components/shop/ProductCard";
import { CATEGORIES_DATA } from "@/data/categoriesData";
import { discountPct, formatPrice, type ProductCardData } from "@/lib/shop";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { gtinOf } from "@/lib/pricing";
import { trackViewItem, trackAddToCart as trackAddToCartAnalytics, trackClickToCall, trackClickWhatsApp } from "@/lib/analytics";
import { PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/data/localSeo";
import {
  Loader2,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  ShoppingCart,
  PhoneCall,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

type Loaded = NonNullable<Awaited<ReturnType<typeof loadProduct>>>;

const NO_REVIEWS: ReviewData = { reviews: [], count: 0, average: 0 };

const ProductDetails = ({ initial, reviews = NO_REVIEWS }: { initial: Loaded; reviews?: ReviewData }) => {
  const { product, related: relatedProducts } = initial;
  const [quantity, setQuantity] = useState(1);
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [recent, setRecent] = useState<ProductCardData[]>([]);
  const [stickyBar, setStickyBar] = useState(false);
  const [busy, setBusy] = useState<"add" | "buy" | null>(null);
  const buyRef = useRef<HTMLDivElement>(null);
  const [buyBar, setBuyBar] = useState<HTMLDivElement | null>(null);
  useBarOffset(buyBar, "--bar-buy");

  const toCard = (p: { id: string; slug?: string | null; name: string; brand?: string | null; category: string; price: number; compare_at?: number; stock: number; image_url: string | null }): ProductCardData => ({
    id: p.id, slug: p.slug ?? p.id, name: p.name, brand: p.brand ?? null, category: p.category, price: p.price, compare_at: p.compare_at,
    stock: p.stock, image_url: p.image_url || "/placeholder.svg", created_at: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    setIdx(0);
    setQuantity(1);
    trackViewItem({ item_id: product.id, item_name: product.name, price: product.price, item_category: product.category });
    // "Văzute recent": kept only in this browser (no account needed)
    try {
      const prev: ProductCardData[] = JSON.parse(localStorage.getItem("airlife_recent") || "[]");
      const list = Array.isArray(prev) ? prev.filter((p) => p && p.id !== product.id) : [];
      setRecent(list.slice(0, 4));
      localStorage.setItem("airlife_recent", JSON.stringify([toCard(product), ...list].slice(0, 8)));
    } catch { /* storage blocked: skip */ }
  }, [product.id]);

  // the sticky mobile buy bar shows whenever the main buy buttons are not on screen (below the fold or already scrolled past)
  useEffect(() => {
    const el = buyRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setStickyBar(!e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [product.id]);

  const images = product.gallery.length ? product.gallery : [product.image_url || "/placeholder.svg"];
  const go = (d: number) => setIdx((i) => (i + d + images.length) % images.length);

  useEffect(() => {
    if (!zoom) return;
    const n = images.length;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + n) % n);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % n);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [zoom, images.length]);

  const handleAddToCart = async (): Promise<boolean> => {
    if (!product || product.stock === 0) return false;

    if (quantity > product.stock) {
      toast({
        title: "Stoc insuficient",
        description: `Disponibil doar ${product.stock} bucăți`,
        variant: "destructive",
      });
      return false;
    }

    try {
      await addToCart(product, quantity);

      trackAddToCartAnalytics({
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        item_category: product.category,
      }, quantity);

      toast({
        title: "Adăugat în coș!",
        description: `${quantity} x ${product.name} a fost adăugat în coș.`,
      });
    } catch {
      toast({
        title: "Eroare",
        description: "Nu s-a putut adăuga în coș",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // "Cumpără acum": straight to checkout
  const handleBuyNow = async () => {
    setBusy("buy");
    if (await handleAddToCart()) navigate("/checkout"); // stays "busy" while the checkout page loads
    else setBusy(null);
  };
  const addWithSpinner = async () => {
    setBusy("add");
    try { await handleAddToCart(); } finally { setBusy(null); }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const productPath = product.slug ?? product.id;
  // Description unique per variant (name + price + delivery), then the product copy.
  const cut = (s: string, n: number) => {
    if (s.length <= n) return s;
    const head = s.slice(0, n - 1);
    const stop = Math.max(head.lastIndexOf(". "), head.lastIndexOf("! "), head.lastIndexOf("? "));
    if (stop > 90) return head.slice(0, stop + 1);
    return head.replace(/\s+\S*$/, "").replace(/[,;:\s-]+$/, "") + "…";
  };
  const seoTitle = product.name.length <= 50 ? `${product.name} | AirLife` : product.name; // never cut the name: BTU/model tell variants apart
  const seoDescription = cut(`${product.name}: ${product.price.toFixed(0)} RON, livrare în toată țara. ${product.description.replace(/\s+/g, " ")}`, 158);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `https://airlife.ro/produse/${productPath}#product`,
    "url": `https://airlife.ro/produse/${productPath}`,
    "name": product.name,
    "description": product.description,
    "image": product.gallery.length ? product.gallery : product.image_url ? (product.image_url.startsWith("http") ? product.image_url : `https://airlife.ro${product.image_url}`) : "https://airlife.ro/placeholder.svg",
    "sku": product.sku ?? product.id.substring(0, 12),
    ...(product.sku ? { "mpn": product.sku } : {}),
    ...(gtinOf(product.specs) ? { "gtin": gtinOf(product.specs) } : {}),
    "brand": {
      "@type": "Brand",
      "name": product.brand ?? "AirLife"
    },
    // only real, approved reviews
    ...(reviews.count > 0 ? {
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": reviews.average, "reviewCount": reviews.count, "bestRating": 5, "worstRating": 1 },
      "review": reviews.reviews.slice(0, 10).map((r) => ({
        "@type": "Review",
        "author": { "@type": "Person", "name": r.author_name },
        "datePublished": r.created_at.slice(0, 10),
        "reviewRating": { "@type": "Rating", "ratingValue": r.rating, "bestRating": 5, "worstRating": 1 },
        ...(r.title ? { "name": r.title } : {}),
        "reviewBody": r.body,
      })),
    } : {}),
    "offers": {
      "@type": "Offer",
      "url": `https://airlife.ro/produse/${productPath}`,
      "priceCurrency": "RON",
      "price": product.price.toFixed(2),
      "priceValidUntil": `${new Date().getFullYear() + 1}-12-31`,
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": { "@id": "https://airlife.ro/#organization" },
      // Mirrors /livrare-si-retur and the checkout rule: 20 RON under 1000 RON, free above; 14-day return, buyer pays return shipping.
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": { "@type": "MonetaryAmount", "value": product.price >= 1000 ? "0" : "20", "currency": "RON" },
        "shippingDestination": { "@type": "DefinedRegion", "addressCountry": "RO" },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": { "@type": "QuantitativeValue", "minValue": 0, "maxValue": 1, "unitCode": "DAY" },
          "transitTime": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": 2, "unitCode": "DAY" }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "applicableCountry": "RO",
        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
        "merchantReturnDays": 14,
        "returnMethod": "https://schema.org/ReturnByMail",
        "returnFees": "https://schema.org/ReturnShippingFees",
        "merchantReturnLink": "https://airlife.ro/livrare-si-retur"
      }
    }
  };

  const breadcrumbsData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Acasă",
        "item": "https://airlife.ro/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Produse",
        "item": "https://airlife.ro/produse"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://airlife.ro/produse/${productPath}`
      }
    ]
  };

  const categorySlug = Object.values(CATEGORIES_DATA).find((c) => c.name === product.category)?.slug;
  const pct = discountPct({ price: product.price, compare_at: product.compare_at } as ProductCardData);
  const saving = product.compare_at ? product.compare_at - product.price : 0;
  const out = product.stock <= 0;
  const intro = cut(product.description.replace(/\s+/g, " "), 240);
  const specRows: [string, string][] = [
    ...(product.brand ? ([["Brand", product.brand]] as [string, string][]) : []),
    ...(product.sku ? ([["Cod produs", product.sku]] as [string, string][]) : []),
    ["Categorie", product.category],
    ...Object.entries(product.specs),
  ];
  const stockLine = out ? "Indisponibil momentan" : product.stock <= 3 ? `Ultimele ${product.stock} bucăți în stoc` : "În stoc";
  const stockDot = out ? "bg-muted-foreground" : product.stock <= 3 ? "bg-foreground/60" : "bg-primary";
  const cards = relatedProducts.slice(0, 4).map(toCard);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`https://airlife.ro/produse/${productPath}`}
        ogType="product"
        structuredData={[structuredData, breadcrumbsData]}
      />

      <Navbar />

      <main className="flex-1 bg-background py-6 md:py-10 pb-24 md:pb-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <nav aria-label="Breadcrumb" className="mb-5 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2 flex-wrap">
              <li><Link to="/" className="hover:text-primary transition-colors">Acasă</Link></li>
              <li aria-hidden>/</li>
              <li><Link to="/produse" className="hover:text-primary transition-colors">Produse</Link></li>
              {categorySlug && (
                <>
                  <li aria-hidden>/</li>
                  <li><Link to={`/${categorySlug}`} className="hover:text-primary transition-colors">{product.category}</Link></li>
                </>
              )}
              <li aria-hidden>/</li>
              <li aria-current="page" className="text-foreground font-medium truncate max-w-[16rem] sm:max-w-md">{product.name}</li>
            </ol>
          </nav>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12 mb-12">
            {/* Gallery */}
            <div className="space-y-3 md:sticky md:top-24 md:self-start">
              <div
                className="relative aspect-square bg-white rounded-2xl border border-border/60 p-6 flex items-center justify-center overflow-hidden select-none"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "ArrowLeft") go(-1);
                  if (e.key === "ArrowRight") go(1);
                }}
                onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
                onTouchEnd={(e) => {
                  if (touchX === null) return;
                  const dx = e.changedTouches[0].clientX - touchX;
                  if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
                  setTouchX(null);
                }}
              >
                {(pct > 0 || out) && (
                  <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold ${out ? "bg-muted text-muted-foreground" : "bg-primary text-primary-foreground"}`}>
                    {out ? "Indisponibil" : `-${pct}%`}
                  </span>
                )}
                <img
                  src={images[idx]}
                  alt={`${product.name} Buzău - poza ${idx + 1}`}
                  fetchPriority="high"
                  decoding="async"
                  className={`max-h-full max-w-full object-contain cursor-zoom-in ${out ? "opacity-70" : ""}`}
                  onClick={() => setZoom(true)}
                />
                {images.length > 1 && (
                  <>
                    <button type="button" onClick={() => go(-1)} aria-label="Poza anterioară" className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 border border-border shadow flex items-center justify-center hover:bg-background">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button type="button" onClick={() => go(1)} aria-label="Poza următoare" className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 border border-border shadow flex items-center justify-center hover:bg-background">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <span className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full bg-foreground/70 text-background">
                      {idx + 1} / {images.length}
                    </span>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((g, i) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setIdx(i)}
                      aria-label={`Poza ${i + 1}`}
                      aria-current={i === idx}
                      className={`w-16 h-16 shrink-0 rounded-lg border bg-white p-1 ${i === idx ? "border-primary ring-1 ring-primary" : "border-border"}`}
                    >
                      <img src={g} alt={`${product.name} Buzău - miniatura ${i + 1}`} loading="lazy" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {zoom && typeof document !== "undefined" && createPortal(
                <div
                  className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
                  onClick={() => setZoom(false)}
                  onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
                  onTouchEnd={(e) => {
                    if (touchX === null) return;
                    const dx = e.changedTouches[0].clientX - touchX;
                    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
                    setTouchX(null);
                  }}
                  role="dialog"
                  aria-modal="true"
                  aria-label="Galerie poze"
                >
                  <img
                    src={images[idx]}
                    alt={`${product.name} Buzău - poza ${idx + 1}`}
                    className="max-h-full max-w-full object-contain bg-white rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button type="button" onClick={() => setZoom(false)} aria-label="Închide" className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 flex items-center justify-center">
                    <X className="w-5 h-5" />
                  </button>
                  {images.length > 1 && (
                    <>
                      <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Poza anterioară" className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Poza următoare" className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm px-3 py-1 rounded-full bg-white/90">
                        {idx + 1} / {images.length}
                      </span>
                    </>
                  )}
                </div>
                , document.body)}
            </div>

            {/* Buy box */}
            <div className="min-w-0 space-y-5">
              <div>
                {product.brand && (
                  <Link to={`/produse?brand=${encodeURIComponent(product.brand)}`} className="inline-block py-1 text-xs font-semibold uppercase tracking-wide text-primary hover:underline">
                    {product.brand}
                  </Link>
                )}
                <h1 className="mt-1 text-2xl sm:text-3xl font-bold text-foreground leading-tight">{product.name}</h1>
                {reviews.count > 0 && (
                  <a href="#reviews-h" className="mt-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                    <Stars value={reviews.average} /> {reviews.average.toFixed(1)} ({reviews.count})
                  </a>
                )}
                {product.sku && <p className="mt-1 text-xs text-muted-foreground">Cod produs: {product.sku}</p>}
              </div>

              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-3xl sm:text-4xl font-bold text-foreground">{formatPrice(product.price)}</span>
                  {product.compare_at ? <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compare_at)}</span> : null}
                  {pct > 0 && <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-primary-foreground">-{pct}%</span>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Preț final, TVA inclus{saving > 0 ? <> · <span className="font-semibold text-primary">Economisești {formatPrice(saving)}</span></> : null}
                </p>
              </div>

              <p className="flex items-center gap-2 text-sm font-medium" role="status">
                <span className={`h-2.5 w-2.5 rounded-full ${stockDot}`} aria-hidden />
                <span className={out ? "text-muted-foreground" : product.stock <= 3 ? "text-foreground" : "text-primary"}>{stockLine}</span>
              </p>

              {intro && <p className="text-sm text-muted-foreground leading-relaxed">{intro}</p>}

              {/* Quantity + purchase */}
              <div ref={buyRef} className="space-y-3 border-t border-border pt-5">
                {!out && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-semibold text-foreground" id="qty-label">Cantitate</span>
                    <div className="flex items-center gap-2" role="group" aria-labelledby="qty-label">
                      <Button variant="outline" size="icon" className="h-10 w-10" onClick={decrementQuantity} disabled={quantity <= 1} aria-label="Scade cantitatea">
                        <Minus className="w-3.5 h-3.5" />
                      </Button>
                      <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          if (val >= 1 && val <= product.stock) setQuantity(val);
                        }}
                        className="text-center w-16 h-10 font-semibold text-sm"
                        min={1}
                        max={product.stock}
                        aria-label="Cantitate produs"
                      />
                      <Button variant="outline" size="icon" className="h-10 w-10" onClick={incrementQuantity} disabled={quantity >= product.stock} aria-label="Crește cantitatea">
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
                <div className="flex flex-col gap-2 lg:flex-row">
                  <Button size="lg" className="font-semibold lg:flex-1" disabled={out || !!busy} aria-busy={busy === "add"} onClick={addWithSpinner}>
                    {busy === "add" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
                    {out ? "Indisponibil" : busy === "add" ? "Se adaugă…" : "Adaugă în coș"}
                  </Button>
                  {!out && (
                    <Button size="lg" variant="outline" className="font-semibold lg:flex-1 border-primary text-primary hover:bg-primary/5" disabled={!!busy} aria-busy={busy === "buy"} onClick={handleBuyNow}>
                      {busy === "buy" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />} {busy === "buy" ? "Se pregătește…" : "Cumpără acum"}
                    </Button>
                  )}
                </div>
                <p className="flex items-center gap-2 text-xs text-muted-foreground"><CreditCard className="w-3.5 h-3.5" /> Plată securizată online cu cardul</p>
                <WishlistButton productId={product.id} productName={product.name} withLabel className="px-1 py-1 hover:text-primary" />
                {/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(product.id) && <StockAlertForm productId={product.id} kind={out ? "back_in_stock" : "price_drop"} />}
              </div>

              {/* Delivery / returns / warranty */}
              <ul className="divide-y rounded-xl border border-border bg-card text-sm">
                <li className="flex items-start gap-3 p-3"><Truck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong>Livrare în 24-48h lucrătoare</strong><br /><span className="text-muted-foreground">Gratuită peste 1.000 RON, altfel 20 RON</span></span></li>
                <li className="flex items-start gap-3 p-3"><RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong>Retur în 14 zile</strong><br /><span className="text-muted-foreground">Conform OUG 34/2014</span></span></li>
                <li className="flex items-start gap-3 p-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong>Garanție 24 de luni</strong><br /><span className="text-muted-foreground">Conformitate legală, factură cu TVA</span></span></li>
                <li className="flex flex-wrap items-center gap-x-4 gap-y-2 p-3">
                  <a href={`tel:${PHONE_TEL}`} onClick={() => trackClickToCall("product-page")} className="inline-flex items-center gap-2 font-semibold hover:text-primary"><PhoneCall className="h-4 w-4 text-primary" /> {PHONE_DISPLAY}</a>
                  <a href={whatsappLink(`Bună! Mă interesează ${product.name}`)} target="_blank" rel="noopener noreferrer" onClick={() => trackClickWhatsApp("product-page")} className="inline-flex items-center gap-2 font-semibold text-primary hover:underline">
                    <MessageCircle className="h-4 w-4" /> Întreabă pe WhatsApp
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Details tabs */}
          <Tabs defaultValue="descriere" className="mb-12">
            <TabsList className="h-auto w-full justify-start overflow-x-auto">
              <TabsTrigger value="descriere">Descriere</TabsTrigger>
              <TabsTrigger value="specificatii">Specificații</TabsTrigger>
              <TabsTrigger value="livrare">Livrare și retur</TabsTrigger>
            </TabsList>
            <TabsContent value="descriere" className="mt-4 rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 text-lg font-bold text-foreground">Despre {product.name}</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              {product.features.length > 0 && (
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{f}</li>
                  ))}
                </ul>
              )}
            </TabsContent>
            <TabsContent value="specificatii" className="mt-4 rounded-xl border border-border bg-card p-5">
              <h2 className="mb-3 text-lg font-bold text-foreground">Specificații tehnice</h2>
              <dl className="divide-y text-sm">
                {specRows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-2 gap-4 py-2 sm:grid-cols-[14rem_1fr]"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
                ))}
              </dl>
            </TabsContent>
            <TabsContent value="livrare" className="mt-4 rounded-xl border border-border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
              <h2 className="mb-3 text-lg font-bold text-foreground">Livrare și retur</h2>
              <p>Comenzile se expediază în 24-48h lucrătoare, cu curier, în toată țara. Livrarea este gratuită pentru comenzi de peste 1.000 RON; sub această valoare transportul costă 20 RON.</p>
              <p className="mt-2">Ai 14 zile să te răzgândești, conform OUG 34/2014. Produsele au garanție de 24 de luni. Detalii complete: <Link to="/livrare-si-retur" className="font-medium text-primary hover:underline">Livrare și retur</Link>.</p>
            </TabsContent>
          </Tabs>

          <ProductReviews productId={product.id} data={reviews} />

          {cards.length > 0 && (
            <section className="mb-12" aria-labelledby="rel-h">
              <h2 id="rel-h" className="mb-4 text-xl font-bold text-foreground">Produse similare</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {cards.map((c) => <ProductCard key={c.id} product={c} />)}
              </div>
            </section>
          )}

          {recent.length > 0 && (
            <section className="mb-4" aria-labelledby="rec-h">
              <h2 id="rec-h" className="mb-4 text-xl font-bold text-foreground">Văzute recent</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {recent.map((c) => <ProductCard key={c.id} product={c} />)}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Sticky buy bar (phones, after the main buttons scroll away) */}
      {stickyBar && !out && (
        <div ref={setBuyBar} style={{ bottom: "var(--bar-contact, 0px)" }} className="fixed inset-x-0 z-40 border-t border-border bg-background/95 p-3 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs text-muted-foreground">{product.name}</p>
              <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
            </div>
            <Button className="shrink-0 font-semibold" disabled={!!busy} onClick={addWithSpinner}>{busy === "add" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShoppingCart className="mr-2 h-4 w-4" />} {busy === "add" ? "Se adaugă…" : "Adaugă în coș"}</Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetails;

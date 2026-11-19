"use client";
import { useState, useEffect } from "react";
import { Link } from "@/lib/router";
import type { loadProduct, Product } from "@/lib/catalog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { trackViewItem, trackAddToCart as trackAddToCartAnalytics } from "@/lib/analytics";
import {
  Loader2,
  Minus,
  Plus,
  Package,
  Truck,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";

type Loaded = NonNullable<Awaited<ReturnType<typeof loadProduct>>>;

const ProductDetails = ({ initial }: { initial: Loaded }) => {
  const { product, related: relatedProducts } = initial;
  const [quantity, setQuantity] = useState(1);
  const [idx, setIdx] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);
  const { toast } = useToast();
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    setIdx(0);
    trackViewItem({ item_id: product.id, item_name: product.name, price: product.price, item_category: product.category });
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

  const handleAddToCart = async () => {
    if (!product || product.stock === 0) return;

    if (quantity > product.stock) {
      toast({
        title: "Stoc insuficient",
        description: `Disponibil doar ${product.stock} bucăți`,
        variant: "destructive",
      });
      return;
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
    }
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
  const cut = (s: string, n: number) => (s.length <= n ? s : s.slice(0, n).replace(/\s+\S*$/, "").replace(/[,;:\s-]+$/, ""));
  const seoTitle = product.name.length <= 50 ? `${product.name} | AirLife` : product.name; // never cut the name: BTU/model tell variants apart
  const seoDescription = cut(`${product.name}: ${product.price.toFixed(0)} RON, livrare în toată țara. ${product.description.replace(/\s+/g, " ")}`, 158);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.gallery.length ? product.gallery : product.image_url ? (product.image_url.startsWith("http") ? product.image_url : `https://airlife.ro${product.image_url}`) : "https://airlife.ro/placeholder.svg",
    "sku": product.sku ?? product.id.substring(0, 12),
    "brand": {
      "@type": "Brand",
      "name": product.brand ?? "AirLife"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://airlife.ro/products/${productPath}`,
      "priceCurrency": "RON",
      "price": product.price.toFixed(2),
      "priceValidUntil": "2027-12-31",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "AirLife"
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
        "item": "https://airlife.ro/products"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": `https://airlife.ro/products/${productPath}`
      }
    ]
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO
        title={seoTitle}
        description={seoDescription}
        canonical={`https://airlife.ro/products/${productPath}`}
        ogType="product"
        structuredData={[structuredData, breadcrumbsData]}
      />

      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex items-center gap-2 flex-wrap">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Acasă</Link>
              </li>
              <li>/</li>
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">Produse</Link>
              </li>
              <li>/</li>
              <li className="text-foreground font-medium truncate max-w-xs">{product.name}</li>
            </ol>
          </nav>

          {/* Product Main Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 animate-in fade-in duration-500">
            {/* Product Image */}
            <div className="space-y-4">
              <div
                className="relative aspect-square bg-white rounded-2xl border border-border/60 p-8 flex items-center justify-center overflow-hidden shadow-sm select-none"
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
                <img
                  src={images[idx]}
                  alt={`${product.name} - poza ${idx + 1}`}
                  className="max-h-full max-w-full object-contain cursor-zoom-in"
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
                <div className="flex gap-2">
                  {images.map((g, i) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setIdx(i)}
                      aria-label={`Poza ${i + 1}`}
                      className={`w-16 h-16 rounded-lg border bg-white p-1 ${i === idx ? "border-primary ring-1 ring-primary" : "border-border"}`}
                    >
                      <img src={g} alt={`${product.name} - miniatura ${i + 1}`} loading="lazy" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}

              {zoom && (
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
                    alt={`${product.name} - poza ${idx + 1}`}
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
              )}

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground pt-2">
                <div className="p-3 bg-card rounded-xl border border-border flex flex-col items-center gap-1.5">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">Livrare Rapidă</span>
                  <span>24-48h lucrătoare</span>
                </div>
                <div className="p-3 bg-card rounded-xl border border-border flex flex-col items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">Retur 14 Zile</span>
                  <span>Conform OUG 34/2014</span>
                </div>
                <div className="p-3 bg-card rounded-xl border border-border flex flex-col items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <span className="font-semibold text-foreground">Garanție 2 Ani</span>
                  <span>Conformitate legală</span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {product.category}
                </span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-3 text-foreground leading-tight">
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-primary">
                    {product.price.toFixed(2)} RON
                    {product.compare_at ? <span className="ml-3 text-xl font-normal text-muted-foreground line-through">{product.compare_at.toFixed(2)} RON</span> : null}
                  </span>
                  <span className="text-xs text-muted-foreground">Preț final, TVA inclus</span>
                </div>
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className={product.stock > 0 ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                  {product.stock > 0 ? `În Stoc (${product.stock} bucăți disponibile)` : "Indisponibil momentan"}
                </span>
              </div>

              {/* Key Features */}
              {Object.keys(product.specs).length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Specificații:</h2>
                  <dl className="text-sm divide-y border rounded-lg bg-card">
                    {product.sku && (
                      <div className="flex justify-between gap-4 px-3 py-2"><dt className="text-muted-foreground">Cod produs</dt><dd className="font-medium">{product.sku}</dd></div>
                    )}
                    {Object.entries(product.specs).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 px-3 py-2"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium text-right">{v}</dd></div>
                    ))}
                  </dl>
                </div>
              )}

              {product.features && product.features.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                    Caracteristici cheie:
                  </h2>
                  <div className="flex gap-2 flex-wrap">
                    {product.features.map((feature: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-secondary text-secondary-foreground text-xs rounded-lg border border-border"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">
                  Descriere Produs:
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector & Add to Cart */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  <label className="text-xs font-semibold text-foreground block">Cantitate:</label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      aria-label="Scade cantitatea"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= product.stock) {
                          setQuantity(val);
                        }
                      }}
                      className="text-center w-16 h-9 font-semibold text-sm"
                      min={1}
                      max={product.stock}
                      aria-label="Cantitate produs"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      aria-label="Crește cantitatea"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    size="lg"
                    className="flex-1 font-semibold"
                    disabled={product.stock === 0}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {product.stock > 0 ? "Adaugă în Coș" : "Indisponibil"}
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Livrare <strong>GRATUITĂ</strong> pentru comenzi peste 1000 RON.
                </p>
              </div>
            </div>
          </div>

          {/* Specifications Card */}
          {product.features && product.features.length > 0 && (
            <Card className="mb-12 border-border">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Specificații și Avantaje</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {product.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cross-Selling / Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">Produse Recomandate / Accesorii</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {relatedProducts.map((rel) => (
                  <Card key={rel.id} className="border-border hover:border-primary/40 transition-all p-4 bg-card flex flex-col justify-between">
                    <div>
                      <div className="aspect-video bg-white rounded-lg flex items-center justify-center p-2 mb-3">
                        <img src={rel.image_url} alt={rel.name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <span className="text-[11px] text-primary font-semibold block mb-1">{rel.category}</span>
                      <h3 className="font-bold text-sm text-foreground mb-2 line-clamp-2">
                        <Link to={`/products/${rel.slug ?? rel.id}`} className="hover:text-primary transition-colors">
                          {rel.name}
                        </Link>
                      </h3>
                    </div>
                    <div className="pt-3 border-t border-border flex items-center justify-between">
                      <span className="font-bold text-primary">{rel.price.toFixed(2)} RON</span>
                      <Link to={`/products/${rel.slug ?? rel.id}`}>
                        <Button size="sm" variant="outline" className="text-xs">
                          Vezi Produs
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;

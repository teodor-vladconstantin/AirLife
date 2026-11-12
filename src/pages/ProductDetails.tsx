import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuote } from "@/contexts/QuoteContext";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { INITIAL_PRODUCTS, StaticProduct } from "@/data/initialProducts";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  features: string[];
  stock: number;
  slug: string | null;
  sku: string | null;
  brand: string | null;
  gallery: string[];
  specs: Record<string, string>;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<StaticProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState<string | null>(null);
  const { toast } = useToast();
  const { addToQuote } = useQuote();
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setActiveImg(null);

    // 1. Check static products first
    const staticMatch = INITIAL_PRODUCTS.find((p) => p.id === productId);

    if (staticMatch) {
      setProduct({
        id: staticMatch.id,
        name: staticMatch.name,
        description: staticMatch.description,
        price: staticMatch.price,
        category: staticMatch.category,
        image_url: staticMatch.image_url,
        features: staticMatch.features,
        stock: staticMatch.stock,
        slug: null,
        sku: staticMatch.sku,
        brand: null,
        gallery: [],
        specs: {},
      });

      // Find cross-sells or related products in same category
      const related = INITIAL_PRODUCTS.filter(
        (p) => p.id !== staticMatch.id && (staticMatch.crossSellIds?.includes(p.id) || p.category === staticMatch.category)
      ).slice(0, 3);
      setRelatedProducts(related);

      trackViewItem({
        item_id: staticMatch.id,
        item_name: staticMatch.name,
        price: staticMatch.price,
        item_category: staticMatch.category,
      });

      setLoading(false);
      return;
    }

    // 2. Query Supabase
    try {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("*")
        .eq(UUID_RE.test(productId ?? "") ? "id" : "slug", productId as string)
        .maybeSingle();

      if (productError || !productData) {
        toast({
          title: "Eroare",
          description: "Produsul nu a fost găsit",
          variant: "destructive",
        });
        navigate("/products");
        return;
      }

      const featuresArr = Array.isArray(productData.features)
        ? (productData.features as string[])
        : [];

      setProduct({
        id: productData.id,
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        category: productData.category,
        image_url: productData.image_url,
        features: featuresArr,
        stock: productData.stock,
        slug: productData.slug,
        sku: productData.sku,
        brand: productData.brand,
        gallery: productData.gallery ?? [],
        specs: (productData.specs ?? {}) as Record<string, string>,
      });

      const { data: relRows } = await supabase
        .from("products")
        .select("*")
        .eq("category", productData.category)
        .neq("id", productData.id)
        .limit(3);
      const related: StaticProduct[] = (relRows ?? []).map((r) => ({
        id: r.id,
        slug: r.slug ?? undefined,
        name: r.name,
        description: r.description,
        price: Number(r.price),
        category: r.category,
        categorySlug: "",
        image_url: r.image_url || "/placeholder.svg",
        features: Array.isArray(r.features) ? (r.features as string[]) : [],
        stock: r.stock,
        sku: r.sku ?? r.id.substring(0, 8),
      }));
      setRelatedProducts(related.length ? related : INITIAL_PRODUCTS.filter((p) => p.category === productData.category).slice(0, 3));

      trackViewItem({
        item_id: productData.id,
        item_name: productData.name,
        price: Number(productData.price),
        item_category: productData.category,
      });
    } catch {
      toast({
        title: "Eroare",
        description: "Nu s-a putut încărca produsul",
        variant: "destructive",
      });
      navigate("/products");
    } finally {
      setLoading(false);
    }
  };

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
      await addToQuote(product, quantity);
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const productPath = product.slug ?? product.id;
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
        title={`${product.name} | AirLife Magazin HVAC`}
        description={product.description.substring(0, 155)}
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
              <div className="aspect-square bg-white rounded-2xl border border-border/60 p-8 flex items-center justify-center overflow-hidden shadow-sm">
                <img
                  src={activeImg || product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              {product.gallery.length > 1 && (
                <div className="flex gap-2">
                  {product.gallery.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setActiveImg(g)}
                      className={`w-16 h-16 rounded-lg border bg-white p-1 ${(activeImg || product.image_url) === g ? "border-primary" : "border-border"}`}
                    >
                      <img src={g} alt="" loading="lazy" className="w-full h-full object-contain" />
                    </button>
                  ))}
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
                  </span>
                  <span className="text-xs text-muted-foreground">TVA inclus</span>
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
                  Livrare 20 RON sau <strong>GRATUITĂ</strong> pentru comenzi peste 1000 RON.
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

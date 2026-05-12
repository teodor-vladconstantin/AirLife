import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuote } from "@/contexts/QuoteContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2, Minus, Plus, Package } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  features: any;
  stock: number;
}

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const { addToQuote } = useQuote();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    setLoading(true);

    const { data: productData, error: productError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (productError || !productData) {
      toast({
        title: "Eroare",
        description: "Produsul nu a fost găsit",
        variant: "destructive",
      });
      navigate("/products");
      return;
    }
    setProduct(productData);
    setLoading(false);
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

    await addToQuote(product, quantity);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-6">
            <Link to="/products">
              <Button variant="outline" className="mb-2">
                &larr; Înapoi la produse
              </Button>
            </Link>
          </div>
          {/* Info banner: site de prezentare */}
          <div className="mb-6">
            <div className="rounded-md bg-primary/5 border border-primary/10 p-3 text-sm text-muted-foreground">
              Acest site este de prezentare — nu vânzăm direct online. Pentru preț și ofertă personalizată, adaugă produsele dorite și cere o ofertă cu opțiuni de montaj și garanție.
            </div>
          </div>
          {/* Product Main Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 animate-in fade-in duration-700">
            {/* Product Image */}
            <div className="space-y-4 animate-in fade-in duration-700">
              <div className="aspect-square overflow-hidden rounded-lg border border-border/50 transition-all duration-300 hover:shadow-xl">
                <img
                  src={product.image_url || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6 animate-in fade-in duration-700">
              <div>
                <span className="text-sm text-primary font-semibold">{product.category}</span>
                <h1 className="text-4xl font-bold mt-2 mb-4">{product.name}</h1>
                <p className="text-3xl font-bold text-primary">{product.price} RON</p>
              </div>

              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {product.stock > 0 ? `Stoc: ${product.stock} bucăți` : "Indisponibil"}
                </span>
              </div>

              {product.features && product.features.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Caracteristici principale:</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.features.map((feature: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold mb-2">Descriere:</h3>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div>
                  <label className="font-semibold mb-2 block">Cantitate:</label>
                  <div className="flex items-center gap-2 max-w-xs">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
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
                      className="text-center"
                      min={1}
                      max={product.stock}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  size="lg"
                  className="w-full"
                  disabled={product.stock === 0}
                  onClick={handleAddToCart}
                >
                  {product.stock > 0 ? "Adaugă la ofertă" : "Indisponibil"}
                </Button>
              </div>
            </div>
          </div>

          {/* Specifications Section */}
          {product.features && product.features.length > 0 && (
            <Card className="mb-8 animate-in fade-in duration-700">
              <CardHeader>
                <CardTitle>Specificații Detaliate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {product.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 animate-in fade-in duration-700">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetails;

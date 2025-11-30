import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Loader2 } from "lucide-react";

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

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from("products").select("*").order("created_at", { ascending: false });

    if (selectedCategory !== "all") {
      query = query.eq("category", selectedCategory);
    }

    const { data, error } = await query;

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca produsele",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  };

  const categories = [
    { value: "all", label: "Toate Produsele" },
    { value: "Aer Condiționat", label: "Aer Condiționat" },
    { value: "Dezumidificatoare", label: "Dezumidificatoare" },
    { value: "Purificatoare Aer", label: "Purificatoare Aer" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Produsele Noastre
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descoperă gama completă de soluții HVAC eco-friendly
            </p>
          </div>

          <div className="flex gap-2 mb-8 flex-wrap justify-center">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">
                Nu există produse în această categorie
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-card/50 backdrop-blur-sm"
                >
                  {product.image_url && (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
                    </div>
                  )}

                  <CardContent className="p-6">
                    <div className="mb-2">
                      <span className="text-sm text-primary font-semibold">{product.category}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground">{product.name}</h3>
                    <p className="text-muted-foreground mb-4">{product.description}</p>

                    {product.features.length > 0 && (
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {product.features.map((feature, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full border border-primary/20"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-bold text-primary">{product.price} RON</span>
                      <span className="text-sm text-muted-foreground">
                        Stoc: {product.stock > 0 ? product.stock : "Indisponibil"}
                      </span>
                    </div>

                    <Button className="w-full mt-4" disabled={product.stock === 0}>
                      {product.stock > 0 ? "Comandă Acum" : "Indisponibil"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Products;

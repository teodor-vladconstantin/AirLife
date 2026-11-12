import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

// Validation schema
const checkoutSchema = z.object({
  customerName: z.string().min(3, "Numele trebuie să aibă cel puțin 3 caractere"),
  customerEmail: z.string().email("Email invalid"),
  customerPhone: z.string().min(10, "Telefon invalid"),
  county: z.string().min(2, "Județul este obligatoriu"),
  city: z.string().min(2, "Orașul este obligatoriu"),
  address: z.string().min(5, "Adresa este obligatorie"),
  postalCode: z.string().min(5, "Cod poștal invalid"),
  paymentMethod: z.enum(["cash_on_delivery", "bank_transfer"]),
  customerNotes: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, "Trebuie să accep ți termenii și condițiile"),
  acceptGDPR: z.boolean().refine((val) => val === true, "Trebuie să accepți politica GDPR"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const Checkout = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "cash_on_delivery",
      acceptTerms: false,
      acceptGDPR: false,
    },
  });

  const paymentMethod = watch("paymentMethod");
  const acceptTerms = watch("acceptTerms");
  const acceptGDPR = watch("acceptGDPR");

  useEffect(() => {
    checkUser();
    // Redirect if cart is empty
    if (items.length === 0) {
      toast({
        title: "Coșul este gol",
        description: "Adaugă produse în coș pentru a continua.",
      });
      navigate("/products");
    }
    // Redirect checkout route to request-quote (site is presentation-only)
    navigate("/request-quote");
  }, [items, navigate]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
    if (user) {
      setValue("customerEmail", user.email || "");
    }
  };

  const shippingCost = total >= 1000 ? 0 : 20;
  const grandTotal = total + shippingCost;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true);

    try {
      // Check stock for all products
      for (const item of items) {
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();

        if (!product || product.stock < item.quantity) {
          toast({
            title: "Stoc insuficient",
            description: `${item.name} nu are stoc suficient.`,
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // Generate order number
      const { data: orderNumData } = await supabase.rpc("generate_order_number");
      const orderNumber = orderNumData;

      // Create shipping address object
      const shippingAddress = {
        county: data.county,
        city: data.city,
        address: data.address,
        postalCode: data.postalCode,
      };

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          order_number: orderNumber,
          user_id: user?.id || null,
          customer_name: data.customerName,
          customer_email: data.customerEmail,
          customer_phone: data.customerPhone,
          shipping_address: shippingAddress,
          payment_method: data.paymentMethod,
          subtotal: total,
          shipping_cost: shippingCost,
          total_amount: grandTotal,
          customer_notes: data.customerNotes || null,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      for (const item of items) {
        const { error: itemError } = await supabase.from("order_items").insert({
          order_id: order.id,
          product_id: item.product_id,
          product_name: item.name,
          product_category: item.category,
          product_image_url: item.image_url,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity,
        });

        if (itemError) throw itemError;

        // Decrease stock
        const { data: stockDecreased } = await supabase.rpc("decrease_product_stock", {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });

        if (!stockDecreased) {
          throw new Error(`Failed to decrease stock for ${item.name}`);
        }
      }

      // Clear cart
      await clearCart();

      toast({
        title: "Cerere trimisă cu succes!",
        description: `Număr cerere: ${orderNumber}`,
      });

      // Redirect to confirmation
      navigate(`/order-confirmation/${order.id}`);
    } catch (error: any) {
      console.error("Order creation error:", error);
      toast({
        title: "Eroare",
        description: error.message || "Nu s-a putut plasa comanda. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-background to-secondary/30 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-4xl font-bold mb-8 text-center">Trimite Cerere de Ofertă</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left: Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Info */}
                <Card>
                  <CardHeader>
                    <CardTitle>Informații de Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="customerName">Nume Complet *</Label>
                      <Input
                        id="customerName"
                        {...register("customerName")}
                        placeholder="Ex: Ion Popescu"
                      />
                      {errors.customerName && (
                        <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerEmail">Email *</Label>
                      <Input
                        id="customerEmail"
                        type="email"
                        {...register("customerEmail")}
                        placeholder="exemplu@email.com"
                      />
                      {errors.customerEmail && (
                        <p className="text-sm text-destructive mt-1">{errors.customerEmail.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="customerPhone">Telefon *</Label>
                      <Input
                        id="customerPhone"
                        {...register("customerPhone")}
                        placeholder="07xxxxxxxx"
                      />
                      {errors.customerPhone && (
                        <p className="text-sm text-destructive mt-1">{errors.customerPhone.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Adresă de Livrare</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="county">Județ *</Label>
                        <Input
                          id="county"
                          {...register("county")}
                          placeholder="Ex: București"
                        />
                        {errors.county && (
                          <p className="text-sm text-destructive mt-1">{errors.county.message}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="city">Oraș *</Label>
                        <Input id="city" {...register("city")} placeholder="Ex: București" />
                        {errors.city && (
                          <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="address">Adresă (Stradă, Număr, Bloc, Apartament) *</Label>
                      <Input
                        id="address"
                        {...register("address")}
                        placeholder="Ex: Str. Exemplu, Nr. 10, Bl. A, Ap. 5"
                      />
                      {errors.address && (
                        <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="postalCode">Cod Poștal *</Label>
                      <Input
                        id="postalCode"
                        {...register("postalCode")}
                        placeholder="Ex: 010101"
                      />
                      {errors.postalCode && (
                        <p className="text-sm text-destructive mt-1">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Metodă de Plată</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup value={paymentMethod} onValueChange={(value: any) => setValue("paymentMethod", value)}>
                      <div className="flex items-center space-x-2 border rounded-lg p-4">
                        <RadioGroupItem value="cash_on_delivery" id="cod" />
                        <Label htmlFor="cod" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Ramburs (Cash la Livrare)</div>
                          <p className="text-sm text-muted-foreground">Plătești când primești produsele</p>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2 border rounded-lg p-4 mt-2">
                        <RadioGroupItem value="bank_transfer" id="transfer" />
                        <Label htmlFor="transfer" className="flex-1 cursor-pointer">
                          <div className="font-semibold">Transfer Bancar</div>
                          <p className="text-sm text-muted-foreground">Vei primi datele de plată prin email</p>
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.paymentMethod && (
                      <p className="text-sm text-destructive mt-2">{errors.paymentMethod.message}</p>
                    )}
                  </CardContent>
                </Card>

                {/* Notes */}
                <Card>
                    <CardHeader>
                      <CardTitle>Notițe Cerere (Opțional)</CardTitle>
                    </CardHeader>
                  <CardContent>
                      <Textarea
                      {...register("customerNotes")}
                      placeholder="Observații despre cerere (ex: interval orar preferat pentru montaj/inspecție)"
                      rows={4}
                    />
                  </CardContent>
                </Card>

                {/* Terms */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setValue("acceptTerms", checked as boolean)}
                      />
                      <Label htmlFor="terms" className="text-sm cursor-pointer">
                        Accept{" "}
                        <a href="/terms" target="_blank" className="text-primary underline">
                          Termenii și Condițiile
                        </a>{" "}
                        *
                      </Label>
                    </div>
                    {errors.acceptTerms && (
                      <p className="text-sm text-destructive">{errors.acceptTerms.message}</p>
                    )}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="gdpr"
                        checked={acceptGDPR}
                        onCheckedChange={(checked) => setValue("acceptGDPR", checked as boolean)}
                      />
                      <Label htmlFor="gdpr" className="text-sm cursor-pointer">
                        Accept{" "}
                        <a href="/privacy" target="_blank" className="text-primary underline">
                          Politica de Confidențialitate
                        </a>{" "}
                        și procesarea datelor personale *
                      </Label>
                    </div>
                    {errors.acceptGDPR && (
                      <p className="text-sm text-destructive">{errors.acceptGDPR.message}</p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Sumar Cerere</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Products */}
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-semibold">{(item.price * item.quantity).toFixed(2)} RON</span>
                        </div>
                      ))}
                    </div>

                    <Separator />

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span className="font-semibold">{total.toFixed(2)} RON</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Livrare</span>
                        <span className="font-semibold">{shippingCost === 0 ? "GRATUIT" : `${shippingCost.toFixed(2)} RON`}</span>
                      </div>
                      {total < 1000 && (
                        <p className="text-xs text-muted-foreground">
                          Mai adaugă {(1000 - total).toFixed(2)} RON pentru livrare gratuită!
                        </p>
                      )}
                    </div>

                    <Separator />

                    <div className="flex justify-between">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-lg text-primary">{grandTotal.toFixed(2)} RON</span>
                    </div>

                    <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Se procesează...
                        </>
                      ) : (
                        "Plasează Comanda"
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;

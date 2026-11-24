"use client";
import { useState, useEffect } from "react";
import { useNavigate } from "@/lib/router";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Package, ShoppingBag, FileText, Mail, Megaphone, Star, Tag, Send } from "lucide-react";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { BlogManager } from "@/components/admin/BlogManager";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { ProductManager } from "@/components/admin/ProductManager";
import { CampaignManager } from "@/components/admin/CampaignManager";
import { ReviewsManager } from "@/components/admin/ReviewsManager";
import { DiscountManager } from "@/components/admin/DiscountManager";
import { NewsletterManager } from "@/components/admin/NewsletterManager";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return navigate("/auth");
        const { data: role } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").single();
        if (!role) {
          toast({ title: "Acces interzis", description: "Nu ai permisiuni de admin", variant: "destructive" });
          return navigate("/");
        }
        setIsAdmin(true);
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Se încarcă...</div>;
  if (!isAdmin) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Panou Administrare</h1>
            <p className="text-muted-foreground mt-1">Produse, prețuri, comenzi (inclusiv furnizor), newsletter, coduri de reducere, recenzii, blog și lead-uri.</p>
          </div>
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="flex h-auto w-full max-w-3xl flex-wrap justify-start gap-1">
              <TabsTrigger value="products" className="flex flex-1 items-center justify-center gap-2"><Package className="h-4 w-4" />Produse</TabsTrigger>
              <TabsTrigger value="campaigns" className="flex flex-1 items-center justify-center gap-2"><Megaphone className="h-4 w-4" />Oferte</TabsTrigger>
              <TabsTrigger value="orders" className="flex flex-1 items-center justify-center gap-2"><ShoppingBag className="h-4 w-4" />Comenzi</TabsTrigger>
              <TabsTrigger value="blog" className="flex flex-1 items-center justify-center gap-2"><FileText className="h-4 w-4" />Blog</TabsTrigger>
              <TabsTrigger value="newsletter" className="flex flex-1 items-center justify-center gap-2"><Send className="h-4 w-4" />Newsletter</TabsTrigger>
              <TabsTrigger value="discounts" className="flex flex-1 items-center justify-center gap-2"><Tag className="h-4 w-4" />Coduri</TabsTrigger>
              <TabsTrigger value="reviews" className="flex flex-1 items-center justify-center gap-2"><Star className="h-4 w-4" />Recenzii</TabsTrigger>
              <TabsTrigger value="leads" className="flex flex-1 items-center justify-center gap-2"><Mail className="h-4 w-4" />Lead-uri</TabsTrigger>
            </TabsList>
            <TabsContent value="products"><ProductManager /></TabsContent>
            <TabsContent value="campaigns"><CampaignManager /></TabsContent>
            <TabsContent value="orders"><OrdersTable /></TabsContent>
            <TabsContent value="blog"><BlogManager /></TabsContent>
            <TabsContent value="newsletter"><NewsletterManager /></TabsContent>
            <TabsContent value="discounts"><DiscountManager /></TabsContent>
            <TabsContent value="reviews"><ReviewsManager /></TabsContent>
            <TabsContent value="leads"><LeadsTable /></TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Admin;

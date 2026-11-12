import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Package, ShoppingBag, FileText, Mail } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { BlogManager } from "@/components/admin/BlogManager";
import { slugify } from "@/lib/markdown";
import { LeadsTable } from "@/components/admin/LeadsTable";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const Admin = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Aer Condiționat",
    image_url: "",
    features: "",
    stock: "",
  });
  const [uploading, setUploading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Aer Condiționat",
    image_url: "",
    features: "",
    stock: "",
  });
  const [editUploading, setEditUploading] = useState(false);

  // Upload image to Supabase Storage
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await supabase.storage.from('media').upload(fileName, file);
    if (error) {
      toast({
        title: "Eroare upload imagine",
        description: error.message,
        variant: "destructive",
      });
      setUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
    setFormData({ ...formData, image_url: urlData?.publicUrl || "" });
    setUploading(false);
    toast({ title: "Imagine încărcată!" });
  };

  // Edit modal logic
  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setEditFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image_url: product.image_url || "",
      features: Array.isArray(product.features) ? product.features.join(", ") : product.features,
      stock: product.stock.toString(),
    });
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditProduct(null);
  };

  // Upload image for edit modal
  const handleEditImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
    const { data, error } = await supabase.storage.from('media').upload(fileName, file);
    if (error) {
      toast({
        title: "Eroare upload imagine",
        description: error.message,
        variant: "destructive",
      });
      setEditUploading(false);
      return;
    }
    const { data: urlData } = supabase.storage.from('media').getPublicUrl(fileName);
    setEditFormData({ ...editFormData, image_url: urlData?.publicUrl || "" });
    setEditUploading(false);
    toast({ title: "Imagine încărcată!" });
  };

  // Update product logic
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    const featuresArray = editFormData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);
    const { error } = await supabase.from("products").update({
      name: editFormData.name,
      description: editFormData.description,
      price: parseFloat(editFormData.price),
      category: editFormData.category,
      image_url: editFormData.image_url || null,
      features: featuresArray,
      stock: parseInt(editFormData.stock),
    }).eq("id", editProduct.id);
    if (error) {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Produs actualizat cu succes!" });
    closeEditModal();
    fetchProducts();
  };
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAdmin();
    fetchProducts();
  }, []);

  const checkAdmin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .single();

      if (!roles) {
        toast({
          title: "Acces interzis",
          description: "Nu ai permisiuni de admin",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Eroare",
        description: "Nu s-au putut încărca produsele",
        variant: "destructive",
      });
      return;
    }

    setProducts(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const featuresArray = formData.features
      .split(",")
      .map((f) => f.trim())
      .filter((f) => f);

    const { error } = await supabase.from("products").insert({
      name: formData.name,
      slug: slugify(formData.name),
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image_url: formData.image_url || null,
      features: featuresArray,
      stock: parseInt(formData.stock),
    });

    if (error) {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Produs adăugat cu succes!" });
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "Aer Condiționat",
      image_url: "",
      features: "",
      stock: "",
    });
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Produs șters cu succes!" });
    fetchProducts();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Se încarcă...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Panou Administrare</h1>
            <p className="text-muted-foreground mt-1">
              Gestionează produsele, comenzile, articolele de blog și lead-urile
            </p>
          </div>
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Produse
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Solicitări
            </TabsTrigger>
            <TabsTrigger value="blog" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Blog
            </TabsTrigger>
            <TabsTrigger value="leads" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Leads
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Adaugă Produs Nou
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nume Produs</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categorie</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aer Condiționat">Aer Condiționat</SelectItem>
                      <SelectItem value="Dezumidificatoare">Dezumidificatoare</SelectItem>
                      <SelectItem value="Purificatoare Aer">Purificatoare Aer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descriere</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Preț (RON)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stoc</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image_upload">Imagine Produs</Label>
                  <Input
                    id="image_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && <span className="text-xs text-muted-foreground">Se încarcă imaginea...</span>}
                  {formData.image_url && (
                    <div className="mt-2">
                      <img src={formData.image_url} alt="Preview" className="max-h-32 rounded" />
                      <Input
                        id="image_url"
                        type="url"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="mt-2"
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="features">Caracteristici (separate prin virgulă)</Label>
                  <Input
                    id="features"
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="A+++, Inverter, Wi-Fi"
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adaugă Produs
                </Button>
              </form>
            </CardContent>
          </Card>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Produse Existente ({products.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="p-4 border rounded-lg flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="text-sm mt-1">{product.description.substring(0, 100)}...</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-sm font-semibold text-primary">
                              {product.price} RON
                            </span>
                            <span className="text-sm text-muted-foreground">Stoc: {product.stock}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="icon"
                            onClick={() => openEditModal(product)}
                            className="bg-green-400 hover:bg-green-500 text-white"
                          >
                            <span className="sr-only">Editează</span>
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {editModalOpen && (
                      <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black bg-opacity-40 overflow-auto p-4">
                        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-auto">
                          <button className="absolute top-2 right-2 text-xl" onClick={closeEditModal}>&times;</button>
                          <h2 className="text-xl font-bold mb-4">Editează Produs</h2>
                          <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="edit_name">Nume Produs</Label>
                              <Input
                                id="edit_name"
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit_category">Categorie</Label>
                              <Select
                                value={editFormData.category}
                                onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Aer Condiționat">Aer Condiționat</SelectItem>
                                  <SelectItem value="Dezumidificatoare">Dezumidificatoare</SelectItem>
                                  <SelectItem value="Purificatoare Aer">Purificatoare Aer</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit_description">Descriere</Label>
                              <Textarea
                                id="edit_description"
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                required
                                rows={4}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit_price">Preț (RON)</Label>
                                <Input
                                  id="edit_price"
                                  type="number"
                                  step="0.01"
                                  value={editFormData.price}
                                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                                  required
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit_stock">Stoc</Label>
                                <Input
                                  id="edit_stock"
                                  type="number"
                                  value={editFormData.stock}
                                  onChange={(e) => setEditFormData({ ...editFormData, stock: e.target.value })}
                                  required
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit_image_upload">Imagine Produs</Label>
                              <Input
                                id="edit_image_upload"
                                type="file"
                                accept="image/*"
                                onChange={handleEditImageUpload}
                                disabled={editUploading}
                              />
                              {editUploading && <span className="text-xs text-muted-foreground">Se încarcă imaginea...</span>}
                              {editFormData.image_url && (
                                <div className="mt-2">
                                  <img src={editFormData.image_url} alt="Preview" className="max-h-32 rounded" />
                                  <Input
                                    id="edit_image_url"
                                    type="url"
                                    value={editFormData.image_url}
                                    onChange={(e) => setEditFormData({ ...editFormData, image_url: e.target.value })}
                                    className="mt-2"
                                    placeholder="https://..."
                                  />
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="edit_features">Caracteristici (separate prin virgulă)</Label>
                              <Input
                                id="edit_features"
                                value={editFormData.features}
                                onChange={(e) => setEditFormData({ ...editFormData, features: e.target.value })}
                                placeholder="A+++, Inverter, Wi-Fi"
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Salvează Modificările
                            </Button>
                          </form>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <OrdersTable />
          </TabsContent>

          <TabsContent value="blog">
            <BlogManager />
          </TabsContent>

          <TabsContent value="leads">
            <LeadsTable />
          </TabsContent>
        </Tabs>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Admin;

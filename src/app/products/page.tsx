import Products from "@/views/Products";
import { loadAllProducts } from "@/lib/catalog";

export const revalidate = 300;
export const metadata = {
  title: "Produse HVAC | Aer condiționat, ventilație | AirLife",
  description: "Catalog AirLife: aparate de aer condiționat, recuperatoare de căldură, dezumidificatoare și ventilatoare, cu livrare în toată țara.",
  alternates: { canonical: "/products" },
};

export default async function Page() {
  return <Products products={await loadAllProducts()} />;
}

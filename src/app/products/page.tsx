import Products from "@/views/Products";
import { loadAllProducts } from "@/lib/catalog";

export const revalidate = 300;
export const metadata = {
  title: "Produse HVAC | Aer condiționat, accesorii, consumabile | AirLife",
  description: "Catalog AirLife: aparate de aer condiționat, recuperatoare de căldură, dezumidificatoare, ventilatoare, accesorii și consumabile HVAC, cu livrare în toată țara.",
  alternates: { canonical: "/products" },
};

export default async function Page() {
  return <Products products={await loadAllProducts()} />;
}

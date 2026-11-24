import Products from "@/views/Products";
import { loadProductCards } from "@/lib/catalog";

export const revalidate = 300;
export const metadata = {
  title: "Produse HVAC | Aer condiționat, ventilație | AirLife",
  description: "Catalog AirLife: aparate de aer condiționat, recuperatoare de căldură, dezumidificatoare și ventilatoare, cu livrare în toată țara.",
  alternates: { canonical: "/produse" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website", locale: "ro_RO", siteName: "AirLife", url: "https://airlife.ro/produse",
    title: "Produse HVAC | Aer condiționat, ventilație | AirLife",
    description: "Catalog AirLife: aparate de aer condiționat, recuperatoare de căldură, dezumidificatoare și ventilatoare, cu livrare în toată țara.",
    images: ["https://airlife.ro/og-image.jpg"],
  },
};

export default async function Page() {
  return <Products cards={await loadProductCards()} />;
}

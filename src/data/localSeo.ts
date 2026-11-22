// Contact constants shared across the site.
export const PHONE_DISPLAY = "+40 722 15 35 25";
export const PHONE_TEL = "+40722153525";

// Local SEO: services (montaj, igienizare, service) cover Buzău city + the whole county.
// Products still ship nationwide. Change the area here, not in each page.
export const SERVICE_AREA = "municipiul Buzău și tot județul Buzău";
export const BUZAU_LOCALITIES = [
  "Buzău", "Râmnicu Sărat", "Nehoiu", "Pogoanele", "Pătârlagele", "Mărăcineni", "Vernești", "Țintești",
  "Săgeata", "Stâlpu", "Cernătești", "Merei", "Pietroasele", "Berca", "Vadu Pașii", "Costești", "Pârscov", "Cislău",
];
export const AREA_SERVED = [
  { "@type": "City", name: "Buzău" },
  { "@type": "City", name: "Râmnicu Sărat" },
  { "@type": "AdministrativeArea", name: "Județul Buzău" },
];
export const COVERAGE_FAQ = {
  q: "În ce zone faceți montaj, igienizare și service?",
  a: "Intervenim cu echipa AirLife sau parteneri în municipiul Buzău (Micro 3, Micro 5, Micro 14, Dorobanți, Centru, Broșteni, Orizont) și în tot județul Buzău, inclusiv Râmnicu Sărat, Nehoiu, Pogoanele și comunele din jur. Produsele și accesoriile le livrăm prin curier în toată țara.",
};

// One coverage Q&A per service page, so the FAQ text is not word-for-word the same on four pages (the hub keeps COVERAGE_FAQ).
export const SERVICE_COVERAGE = {
  montaj: {
    q: "Unde montați aparate de aer condiționat?",
    a: "Montăm în municipiul Buzău și în tot județul Buzău, cu echipa AirLife sau parteneri. Stabilim programarea după ce alegem modelul și locul unității exterioare, iar aparatul îl poți comanda direct de pe airlife.ro.",
  },
  igienizare: {
    q: "Veniți la domiciliu pentru igienizare?",
    a: "Da. Igienizarea se face la domiciliu sau la birou, în municipiul Buzău și în județ. Un aparat durează între 45 și 75 de minute, iar unitatea interioară este protejată cu husă ca să nu se murdărească pereții.",
  },
  service: {
    q: "Interveniți și în afara municipiului Buzău?",
    a: "Da, intervenim în tot județul Buzău, inclusiv Râmnicu Sărat, Nehoiu și Pogoanele. Descrie defecțiunea prin telefon sau formular, iar noi stabilim dacă e nevoie de o deplasare pentru constatare.",
  },
};

// WhatsApp uses the same mobile number as the phone line. wa.me wants digits only, with country code.
export const WHATSAPP_NUMBER = PHONE_TEL.replace(/\D/g, "");
export const whatsappLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

// AirLife holds an F-gas certificate (handling of fluorinated refrigerants). The certificate number is not published here.
export const FGAS_TEXT = "AirLife deține atestat F-gaz pentru manipularea gazelor fluorurate (agenți frigorifici).";

// Blog posts that cover the same query as a local guide: the guide is the main page, so the post points its canonical there.
export const BLOG_CANONICAL: Record<string, string> = {
  "ce-btu-sa-alegi-pentru-aer-conditionat": "https://airlife.ro/ghid/ce-btu-aer-conditionat-buzau",
  "ce-influenteaza-pretul-montajului-aerului-conditionat": "https://airlife.ro/ghid/cost-montaj-aer-conditionat-buzau",
};
export const GUIDE_LABEL: Record<string, string> = {
  "https://airlife.ro/ghid/ce-btu-aer-conditionat-buzau": "ghidul despre BTU pentru Buzău (calculator pe volum și tabel BTU)",
  "https://airlife.ro/ghid/cost-montaj-aer-conditionat-buzau": "ghidul despre costul montajului în Buzău",
};

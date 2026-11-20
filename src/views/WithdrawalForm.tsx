"use client";
import { Link } from "@/lib/router";
import LegalLayout, { type LegalSection } from "@/components/LegalLayout";
import { company as c } from "@/data/company";

const sections: LegalSection[] = [
  {
    title: "Formular-tip de retragere (OUG 34/2014, anexa 5)",
    body: (
      <>
        <p>Completează și trimite acest formular <strong>doar dacă dorești să te retragi din contract</strong>, în 14 zile calendaristice de la primirea produselor. Nu este obligatoriu să folosești acest formular; poți trimite orice declarație clară. Detalii: <Link to="/termeni-si-conditii">Termeni și Condiții</Link> și <Link to="/livrare-si-retur">Livrare și Retur</Link>.</p>
        <div className="rounded-md border border-border bg-secondary/40 p-4 text-sm leading-8">
          <p><strong>Către:</strong> {c.legalName}, {c.address}, e-mail {c.email}</p>
          <p>Vă informez prin prezenta că renunț la contractul de vânzare a următoarelor produse / prestare a următorului serviciu: ________________________________</p>
          <p>Comandat la data de ____________ / primit la data de ____________ (număr comandă: ____________)</p>
          <p>Numele consumatorului: ________________________</p>
          <p>Adresa consumatorului: ________________________</p>
          <p>Cont IBAN pentru restituire (doar dacă ai plătit ramburs): ________________________</p>
          <p>Semnătura consumatorului (doar dacă formularul este trimis pe hârtie): ____________</p>
          <p>Data: ____________</p>
        </div>
        <p>Trimite formularul la <a href={`mailto:${c.email}`}>{c.email}</a>. Îți confirmăm primirea pe e-mail. Rambursăm în cel mult 14 zile de la comunicarea retragerii, prin aceeași metodă de plată folosită la comandă.</p>
      </>
    ),
  },
];

const WithdrawalForm = () => (
  <LegalLayout
    title="Formular de retragere"
    seoTitle="Formular-tip de retragere din contract | AirLife.ro"
    description="Formularul-tip pentru exercitarea dreptului de retragere de 14 zile din contractele la distanță, conform OUG 34/2014."
    canonical="https://airlife.ro/formular-retragere"
    sections={sections}
  />
);

export default WithdrawalForm;

"use client";
import { Link } from "@/lib/router";
import LegalLayout, { type LegalSection } from "@/components/LegalLayout";
import { company as c } from "@/data/company";

type Row = { name: string; role: string; purpose: string; data: string; where: string; basis: string; consent?: boolean };

const rows: Row[] = [
  { name: "Vercel Inc.", role: "Persoană împuternicită", purpose: "Găzduirea și livrarea site-ului (CDN, funcții server)", data: "Adresă IP, jurnale tehnice ale cererilor, datele trimise prin formularele și funcțiile serverului", where: "SUA (funcțiile server rulează la Washington D.C.); rețea de livrare (CDN) globală, inclusiv UE", basis: "Clauze contractuale standard / Cadrul UE-SUA (DPF)" },
  { name: "Supabase Inc.", role: "Persoană împuternicită", purpose: "Bază de date, autentificare, stocarea comenzilor și a conturilor", data: "Date de cont, comenzi, date de livrare, mesaje de contact", where: "UE / SUA", basis: "Clauze contractuale standard / DPF" },
  { name: "Stripe Payments Europe, Ltd.", role: "Persoană împuternicită și operator independent (fraudă, obligații legale)", purpose: "Procesarea plăților cu cardul", data: "Nume, e-mail, sumă, date card (introduse direct la Stripe)", where: "Irlanda / SUA", basis: "DPF / clauze contractuale standard" },
  { name: "Resend, Inc.", role: "Persoană împuternicită", purpose: "Trimiterea e-mailurilor tranzacționale și a newsletterului", data: "E-mail, nume, conținutul mesajului, statusul livrării", where: "SUA", basis: "Clauze contractuale standard / DPF" },
  { name: "Cloudflare, Inc.", role: "Persoană împuternicită", purpose: "Verificare anti-bot (Turnstile)", data: "Adresă IP, semnale tehnice ale browserului", where: "UE / SUA", basis: "Clauze contractuale standard / DPF" },
  { name: "FAN Courier, DPD România, Sameday", role: "Destinatar (curierul ales pentru comanda ta)", purpose: "Livrarea coletelor și încasarea ramburs", data: "Nume, telefon, adresă de livrare, sumă ramburs", where: "România", basis: "Executarea contractului" },
  { name: "Google Ireland Ltd. (Analytics 4, Tag Manager)", role: "Persoană împuternicită", purpose: "Statistici de utilizare", data: "Identificatori online, pagini vizitate, evenimente de comerț electronic", where: "UE / SUA", basis: "Consimțământ; DPF", consent: true },
  { name: "PostHog Inc. (cloud UE)", role: "Persoană împuternicită", purpose: "Analiză comportament, înregistrări de sesiune, hărți de interacțiune", data: "Identificatori online, interacțiuni, informații despre dispozitiv", where: "UE", basis: "Consimțământ", consent: true },
  { name: "Meta Platforms Ireland Ltd.", role: "Operator asociat pentru măsurare", purpose: "Pixel Meta (măsurarea reclamelor)", data: "Identificatori online, evenimente de navigare", where: "UE / SUA", basis: "Consimțământ; DPF", consent: true },
  { name: "Functional Software, Inc. (Sentry)", role: "Persoană împuternicită", purpose: "Monitorizarea erorilor tehnice", data: "Tip eroare, pagină, browser, adresă IP", where: "SUA / UE", basis: "Consimțământ; DPF", consent: true },
];

const sections: LegalSection[] = [
  {
    title: "La ce folosește această listă",
    body: (
      <>
        <p>{c.legalName} este operatorul datelor tale (vezi <Link to="/politica-de-confidentialitate">Politica de Confidențialitate</Link>). Pentru a furniza serviciul apelăm la furnizorii de mai jos, care prelucrează date în numele nostru, în baza termenilor și a acordurilor standard de prelucrare a datelor (DPA) ale fiecărui furnizor, încheiate electronic la crearea contului nostru (art. 28 GDPR), sau care sunt destinatari independenți.</p>
        <p>Furnizorii marcați „consimțământ” funcționează doar dacă ai acceptat cookie-urile de analiză. Nu vindem datele tale.</p>
      </>
    ),
  },
  {
    title: "Lista subprocesatorilor și a destinatarilor",
    body: (
      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.name} className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
            <p className="font-semibold text-foreground">{r.name}{r.consent ? " (doar cu consimțământ)" : ""}</p>
            <ul className="mt-1">
              <li><strong>Rol:</strong> {r.role}</li>
              <li><strong>Scop:</strong> {r.purpose}</li>
              <li><strong>Date:</strong> {r.data}</li>
              <li><strong>Locație:</strong> {r.where}</li>
              <li><strong>Temei / garanții de transfer:</strong> {r.basis}</li>
            </ul>
          </div>
        ))}
        <p className="text-sm">Pot exista și furnizori de contabilitate, facturare și consultanță juridică, care primesc strict datele necesare obligațiilor legale, sub obligație de confidențialitate.</p>
      </div>
    ),
  },
  {
    title: "Transferuri în afara Spațiului Economic European",
    body: <p>Unde un furnizor prelucrează date în afara SEE, ne bazăm pe decizia de adecvare a Comisiei Europene (inclusiv Cadrul de Confidențialitate UE-SUA, pentru entitățile certificate) sau pe clauze contractuale standard, completate, la nevoie, cu măsuri suplimentare. Poți cere o copie a garanțiilor la <a href={`mailto:${c.email}`}>{c.email}</a>.</p>,
  },
  {
    title: "Modificări și notificare",
    body: <p>Actualizăm lista când adăugăm sau schimbăm un furnizor. Data ultimei actualizări este afișată în partea de sus. Pentru întrebări sau pentru a-ți exercita drepturile GDPR scrie-ne la <a href={`mailto:${c.email}`}>{c.email}</a>.</p>,
  },
];

const Subprocessors = () => (
  <LegalLayout
    title="Subprocesatori și destinatari"
    seoTitle="Subprocesatori și destinatari ai datelor | AirLife.ro"
    description="Lista furnizorilor care prelucrează date personale pentru AirLife.ro: rol, scop, date, locație și garanții de transfer (GDPR art. 28 și 44-46)."
    canonical="https://airlife.ro/subprocesatori"
    sections={sections}
  />
);

export default Subprocessors;

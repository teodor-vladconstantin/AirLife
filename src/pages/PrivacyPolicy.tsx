import { Link } from "react-router-dom";
import LegalLayout, { type LegalSection } from "@/components/LegalLayout";
import { company as c, ANSPDCP_URL } from "@/data/company";

const sections: LegalSection[] = [
  {
    title: "Operatorul datelor",
    body: (
      <>
        <p>Operatorul datelor tale personale este <strong>{c.legalName}</strong> (CUI {c.cui}, {c.regCom}), cu sediul în {c.address}, care operează site-ul airlife.ro.</p>
        <p>Contact pentru protecția datelor: <a href={`mailto:${c.privacyEmail}`}>{c.privacyEmail}</a>. Nu am desemnat un responsabil cu protecția datelor (DPO), deoarece nu ne încadrăm în cazurile din art. 37 GDPR; adresa de mai sus este punctul nostru de contact.</p>
        <p>Prelucrăm datele conform Regulamentului (UE) 2016/679 (GDPR), Legii nr. 190/2018 și Legii nr. 506/2004 privind confidențialitatea în comunicațiile electronice.</p>
      </>
    ),
  },
  {
    title: "Ce date prelucrăm, de ce și pe ce temei",
    body: (
      <ul>
        <li><strong>Comenzi și cereri de ofertă</strong> (nume, e-mail, telefon, adresă de livrare sau de intervenție, produsele/serviciul solicitat, metoda de plată, IBAN pentru restituiri): pentru a primi, livra, factura și deservi comanda sau oferta. Temei: executarea contractului sau demersuri precontractuale (art. 6 alin. 1 lit. b GDPR).</li>
        <li><strong>Facturare și evidențe contabile</strong>: obligații legale fiscale și contabile (art. 6 alin. 1 lit. c).</li>
        <li><strong>Cont de utilizator</strong> (e-mail, parolă stocată criptat, istoricul comenzilor): pentru autentificare și gestionarea comenzilor. Temei: contract (lit. b).</li>
        <li><strong>Mesaje prin formularul de contact, e-mail sau telefon</strong>: pentru a-ți răspunde. Temei: interes legitim de a răspunde solicitărilor (lit. f) sau pași precontractuali (lit. b).</li>
        <li><strong>Abonare la e-mailuri</strong> (adresa de e-mail, sursa abonării): trimitere de sfaturi și oferte. Temei: consimțământul tău (lit. a), retractabil oricând prin link-ul de dezabonare sau la <a href={`mailto:${c.privacyEmail}`}>{c.privacyEmail}</a>.</li>
        <li><strong>Statistici de utilizare</strong> (pagini vizitate, evenimente de navigare și comerț electronic, identificatori online, informații despre dispozitiv și browser, înregistrări ale sesiunii și hărți de interacțiune) prin Google Analytics 4 și PostHog: doar după ce accepți cookie-urile de analiză. Temei: consimțământul (lit. a; art. 4 din Legea 506/2004).</li>
        <li><strong>Monitorizarea erorilor tehnice</strong> (Sentry: tip de eroare, pagină, browser, adresă IP) : doar după consimțământul tău (lit. a).</li>
        <li><strong>Apărarea drepturilor noastre</strong> (reclamații, garanții, litigii): interes legitim (lit. f).</li>
      </ul>
    ),
  },
  {
    title: "De unde provin datele",
    body: <p>Datele provin în principal direct de la tine (formulare, comenzi, cont, apeluri, e-mailuri) și automat din dispozitivul tău, prin tehnologiile descrise în <Link to="/politica-de-cookies">Politica de Cookies</Link>. Furnizarea datelor necesare comenzii este obligatorie pentru a o putea onora; pentru restul, furnizarea este voluntară.</p>,
  },
  {
    title: "Cui dezvăluim datele",
    body: (
      <>
        <p>Nu vindem datele tale. Le transmitem doar celor care ne ajută să furnizăm serviciul, în baza unor contracte care îi obligă să le protejeze:</p>
        <ul>
          <li>firme de curierat, pentru livrarea coletelor;</li>
          <li>furnizori de infrastructură IT: găzduire (Vercel), bază de date și autentificare (Supabase), trimitere de e-mailuri;</li>
          <li>instrumente de analiză și monitorizare, doar după consimțământ în cazul analizei: Google (Google Analytics 4), PostHog (serverele din UE), Sentry;</li>
          <li>contabil, bancă și consultanți juridici, pentru obligațiile legale și evidențe;</li>
          <li>autorități publice, când legea o cere.</li>
        </ul>
        <p>Unii furnizori (de exemplu Google, Vercel, Supabase, Sentry) pot prelucra date și în afara Spațiului Economic European. În aceste cazuri ne bazăm pe garanții prevăzute de GDPR (decizia de adecvare a Comisiei Europene, inclusiv Cadrul de Confidențialitate UE-SUA pentru entitățile certificate, sau clauze contractuale standard). Poți cere detalii la <a href={`mailto:${c.privacyEmail}`}>{c.privacyEmail}</a>.</p>
      </>
    ),
  },
  {
    title: "Cât păstrăm datele",
    body: (
      <ul>
        <li>Documente fiscale și contabile (facturi, comenzi): 5 ani, conform legii contabilității, sau mai mult dacă legea impune.</li>
        <li>Date privind garanția, reclamațiile și posibile litigii: până la 3 ani de la încheierea contractului (termenul general de prescripție), apoi ștergere.</li>
        <li>Cont de utilizator: cât timp este activ; îl poți șterge oricând, cu păstrarea datelor pe care legea ne obligă să le arhivăm.</li>
        <li>Mesaje de contact fără comandă: până la 12 luni de la ultimul mesaj.</li>
        <li>Abonare la e-mailuri: până la retragerea consimțământului sau dezabonare.</li>
        <li>Date de analiză și monitorizare: perioade limitate, stabilite în instrumentele respective, în general sub 2 ani.</li>
      </ul>
    ),
  },
  {
    title: "Drepturile tale",
    body: (
      <>
        <p>Conform GDPR ai dreptul de: acces (art. 15), rectificare (16), ștergere (17), restricționare (18), portabilitate (20), opoziție (21, inclusiv oricând față de prelucrările bazate pe interes legitim) și de a nu fi supus unei decizii bazate exclusiv pe prelucrare automată (22; nu luăm astfel de decizii). Îți poți retrage oricând consimțământul, fără a afecta legalitatea prelucrării anterioare. Preferințele pentru cookie-uri le modifici din <Link to="/politica-de-cookies">Politica de Cookies</Link>.</p>
        <p>Pentru a-ți exercita drepturile, scrie-ne la <a href={`mailto:${c.privacyEmail}`}>{c.privacyEmail}</a>. Răspundem în cel mult o lună (prelungibilă cu până la două luni pentru cereri complexe). Putem cere dovada identității, dacă avem dubii. Exercitarea drepturilor este gratuită, în afara cererilor vădit nefondate sau excesive.</p>
        <p>Dacă consideri că ți-am încălcat drepturile, poți depune plângere la Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), B-dul G-ral Gheorghe Magheru nr. 28-30, sector 1, București, <a href={ANSPDCP_URL} target="_blank" rel="noopener noreferrer">dataprotection.ro</a>, <a href="mailto:anspdcp@dataprotection.ro">anspdcp@dataprotection.ro</a>, sau la instanța competentă.</p>
      </>
    ),
  },
  {
    title: "Securitatea datelor",
    body: <p>Folosim măsuri tehnice și organizatorice adecvate: conexiune criptată (HTTPS), parole stocate criptat, acces restricționat pe roluri la datele comenzilor, politici de securitate la nivel de bază de date și copii de siguranță. Dacă are loc o încălcare a securității care îți poate afecta drepturile, vom notifica ANSPDCP și, când legea o cere, și pe tine.</p>,
  },
  {
    title: "Minori",
    body: <p>Site-ul nu se adresează minorilor sub 16 ani și nu colectăm cu bună știință date de la aceștia. Dacă afli că un minor ne-a transmis date, scrie-ne și le ștergem.</p>,
  },
  {
    title: "Modificări ale politicii",
    body: <p>Putem actualiza această politică. Data ultimei actualizări este afișată în partea de sus a paginii; pentru modificări importante te anunțăm prin site sau e-mail.</p>,
  },
  {
    title: "Contact",
    body: <p>{c.legalName}, {c.address}.<br />Date personale: <a href={`mailto:${c.privacyEmail}`}>{c.privacyEmail}</a> | General: <a href={`mailto:${c.email}`}>{c.email}</a> | Telefon: {c.phone}</p>,
  },
];

const PrivacyPolicy = () => (
  <LegalLayout
    title="Politică de Confidențialitate"
    seoTitle="Politica de Confidențialitate (GDPR) | AirLife.ro"
    description="Cum colectăm, folosim și protejăm datele tale personale pe AirLife.ro: scopuri, temeiuri legale, destinatari, durate de păstrare și drepturile tale GDPR."
    canonical="https://airlife.ro/politica-de-confidentialitate"
    sections={sections}
  />
);

export default PrivacyPolicy;

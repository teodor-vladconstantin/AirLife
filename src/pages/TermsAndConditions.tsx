import { Link } from "react-router-dom";
import LegalLayout, { type LegalSection } from "@/components/LegalLayout";
import { company as c, ANPC_URL, SAL_URL } from "@/data/company";

const sections: LegalSection[] = [
  {
    title: "Identificarea vânzătorului",
    body: (
      <>
        <p>Site-ul airlife.ro (magazin online de produse HVAC și servicii de montaj, igienizare și service pentru aparate de aer condiționat) este operat de:</p>
        <ul>
          <li><strong>{c.legalName}</strong>, denumită în continuare „AirLife” sau „Vânzătorul”</li>
          <li>CUI: {c.cui}; Nr. Reg. Com.: {c.regCom}</li>
          <li>Sediul social: {c.address}</li>
          <li>E-mail: <a href={`mailto:${c.email}`}>{c.email}</a>; telefon: {c.phone}</li>
        </ul>
        <p>Serviciile la domiciliul clientului se prestează la cerere, în toată țara, conform disponibilității echipei.</p>
      </>
    ),
  },
  {
    title: "Acceptarea termenilor",
    body: (
      <>
        <p>Prin folosirea site-ului, trimiterea unei cereri de ofertă sau plasarea unei comenzi, declari că ai citit și ești de acord cu acești termeni, cu <Link to="/politica-de-confidentialitate">Politica de Confidențialitate</Link>, cu <Link to="/politica-de-cookies">Politica de Cookies</Link>, cu <Link to="/livrare-si-retur">Livrare și Retur</Link> și cu <Link to="/garantie">Condițiile de Garanție</Link>. Dacă nu ești de acord, te rugăm să nu folosești site-ul.</p>
        <p>Pentru comenzi te asiguri că ai cel puțin 18 ani sau că ai acordul reprezentantului legal.</p>
        <p>Putem modifica acești termeni. Versiunea aplicabilă unei comenzi este cea în vigoare la data plasării acesteia.</p>
      </>
    ),
  },
  {
    title: "Produse, servicii și prețuri",
    body: (
      <>
        <p>Vindem produse (accesorii, consumabile, filtre, purificatoare și altele) și prestăm servicii (montaj, igienizare, service). Descrierile, imaginile și specificațiile sunt orientative; pot exista diferențe minore de culoare sau ambalaj față de produsul livrat.</p>
        <p>Prețurile sunt exprimate în lei (RON). Vânzătorul nu este înregistrat ca plătitor de TVA, deci prețurile nu conțin TVA și nu se adaugă taxe suplimentare la plată (în afara costului de livrare, dacă există). Costul de livrare, dacă există, este afișat înainte de trimiterea comenzii. Prețul final al serviciilor la locația clientului se stabilește în ofertă, după clarificarea detaliilor lucrării.</p>
        <p>Ne rezervăm dreptul de a corecta o eroare evidentă de afișare a prețului sau a stocului. În acest caz te anunțăm înainte de executarea comenzii și poți confirma la prețul corect sau poți renunța, fără costuri.</p>
      </>
    ),
  },
  {
    title: "Încheierea contractului",
    body: (
      <>
        <p>Pașii pentru o comandă: alegi produsele, completezi datele de livrare, alegi metoda de plată, bifezi acceptarea termenilor și a politicii de confidențialitate și trimiți comanda. Contractul la distanță se consideră încheiat când îți confirmăm comanda pe e-mail sau telefonic.</p>
        <p>Cererile de ofertă pentru servicii nu obligă nici una dintre părți. Contractul de servicii se încheie când accepți oferta și stabilim programarea.</p>
        <p>Putem refuza sau anula o comandă pentru motive justificate (stoc epuizat, date de contact false sau incomplete, imposibilitatea livrării sau a intervenției). Sumele plătite deja se restituie integral.</p>
        <p>Contractul se încheie în limba română. Comanda și factura sunt păstrate în sistemul nostru și ți le putem retrimite la cerere.</p>
      </>
    ),
  },
  {
    title: "Plata și facturarea",
    body: (
      <>
        <p>Metode de plată disponibile: ramburs (numerar la livrare) și transfer bancar. La transferul bancar, comanda se procesează după confirmarea încasării.</p>
        <p>Factura fiscală se emite pentru fiecare comandă sau serviciu. Pentru factură pe persoană juridică te rugăm să ne transmiți datele firmei înainte de emitere.</p>
      </>
    ),
  },
  {
    title: "Livrarea",
    body: (
      <p>Termenele, costurile și condițiile de livrare sunt detaliate în pagina <Link to="/livrare-si-retur">Livrare și Retur</Link>. La primire verifică ambalajul în prezența curierului; semnalează imediat orice deteriorare vizibilă și, dacă este cazul, consemneaz-o în procesul-verbal al curierului. Riscul pierderii sau deteriorării produselor se transferă la tine în momentul în care tu sau o persoană desemnată de tine intră în posesia fizică a acestora.</p>
    ),
  },
  {
    title: "Dreptul de retragere (14 zile)",
    body: (
      <>
        <p>Dacă ești consumator, conform OUG nr. 34/2014 poți renunța la contractul la distanță în 14 zile calendaristice, fără să justifici decizia și fără penalități. Termenul curge de la data la care tu sau o persoană desemnată de tine (alta decât curierul) primești produsele; pentru mai multe produse livrate separat, de la primirea ultimului.</p>
        <p>Pentru a te retrage, ne transmiți o declarație clară (de exemplu pe <a href={`mailto:${c.email}`}>{c.email}</a>) cu numărul comenzii, datele tale și contul IBAN pentru restituire. Poți folosi și formularul-tip de mai jos. Trimite produsele înapoi în cel mult 14 zile de la comunicarea retragerii. Costul direct al returnării îl suporți tu, dacă nu ți-am comunicat altfel înainte de comandă.</p>
        <p>Îți rambursăm sumele primite, inclusiv costul livrării standard, în cel mult 14 zile de la comunicarea retragerii. Putem amâna rambursarea până primim produsele sau până dovedești expedierea lor. Răspunzi pentru diminuarea valorii produselor rezultată din manipularea lor în alt mod decât cel necesar verificării naturii, caracteristicilor și funcționării.</p>
        <p>Dreptul de retragere nu se aplică, printre altele (art. 16 OUG 34/2014):</p>
        <ul>
          <li>produselor sigilate care nu pot fi returnate din motive de protecție a sănătății sau de igienă, dacă au fost desigilate după livrare (de exemplu soluții de curățare și dezinfectare, filtre desigilate);</li>
          <li>produselor confecționate după specificațiile tale sau personalizate;</li>
          <li>serviciilor prestate integral, dacă prestarea a început cu acordul tău expres și ai recunoscut că pierzi dreptul de retragere după executarea completă;</li>
          <li>lucrărilor urgente de reparație sau întreținere solicitate expres de tine.</li>
        </ul>
        <p>Dacă ai cerut începerea unui serviciu în perioada de retragere și te retragi, plătești proporțional cu ce s-a prestat până la comunicarea retragerii.</p>
        <p className="rounded-md border border-border bg-secondary/40 p-3 text-sm">
          <strong>Formular-tip de retragere</strong> (completează și trimite doar dacă dorești să te retragi):<br />
          Către {c.legalName}, {c.address}, {c.email}: Vă informez prin prezenta că renunț la contractul de vânzare a următoarelor produse / prestare a următorului serviciu: ____ . Comandat la data de ____ / primit la data de ____ . Numele consumatorului: ____ . Adresa consumatorului: ____ . Cont IBAN pentru restituire: ____ . Data: ____ . Semnătura (doar dacă formularul se trimite pe hârtie): ____ .
        </p>
      </>
    ),
  },
  {
    title: "Garanția și conformitatea produselor",
    body: (
      <>
        <p>Produsele livrate consumatorilor trebuie să fie conforme cu contractul. Beneficiezi de garanția legală de conformitate de 2 ani (Legea nr. 449/2003 și OUG nr. 140/2021), plus garanția comercială a producătorului, dacă există. Dacă produsul nu este conform, ai dreptul, în ordine, la repararea sau înlocuirea lui, apoi la reducerea prețului sau la încetarea contractului, în condițiile legii.</p>
        <p>Pentru lucrările de montaj și service, garanția acoperă manopera conform devizului/ofertei acceptate. Detalii, excluderi și procedura de reclamație sunt în pagina <Link to="/garantie">Condiții de Garanție</Link>. Drepturile tale legale de consumator nu pot fi limitate prin aceste condiții.</p>
      </>
    ),
  },
  {
    title: "Servicii la locația clientului",
    body: (
      <ul>
        <li>Te angajezi să asiguri accesul în spațiu, curent electric și condițiile minime de siguranță pentru lucrare (inclusiv acces în siguranță la locul unității exterioare).</li>
        <li>Datele tehnice ale lucrării (traseu, distanțe, materiale suplimentare) se confirmă în ofertă. Lucrările suplimentare apărute pe parcurs se execută doar cu acordul tău.</li>
        <li>Dacă reprogramezi sau anulezi cu mai puțin de 24 de ore înainte, putem solicita acoperirea costurilor deplasării deja efectuate, doar dacă ți-am comunicat aceasta în ofertă.</li>
      </ul>
    ),
  },
  {
    title: "Răspundere și forță majoră",
    body: (
      <>
        <p>Răspundem pentru prejudiciile cauzate din culpa noastră, în limitele legii. Nu răspundem pentru întârzieri sau neexecutări cauzate de forță majoră (de exemplu calamități, restricții ale autorităților, întreruperi ale serviciilor de curierat) și nici pentru indisponibilitatea temporară a site-ului din motive tehnice. Nimic din acești termeni nu exclude răspunderea care nu poate fi exclusă prin lege.</p>
        <p>Informațiile din blog și ghiduri au caracter general și nu înlocuiesc evaluarea unui specialist pentru situația ta concretă.</p>
      </>
    ),
  },
  {
    title: "Contul de utilizator și utilizarea site-ului",
    body: (
      <>
        <p>Ești responsabil pentru confidențialitatea datelor contului tău și pentru datele furnizate; acestea trebuie să fie reale și actuale. Ne poți cere oricând ștergerea contului.</p>
        <p>Este interzisă folosirea site-ului în scopuri ilegale, încercarea de acces neautorizat, extragerea automată masivă a conținutului sau orice acțiune care afectează funcționarea lui.</p>
      </>
    ),
  },
  {
    title: "Proprietate intelectuală",
    body: (
      <p>Textele, imaginile, logo-urile, designul și structura site-ului sunt ale {c.legalName} sau ale partenerilor ei și sunt protejate de Legea nr. 8/1996. Mărcile și imaginile producătorilor aparțin deținătorilor lor. Nu poți reproduce sau distribui conținutul în scop comercial fără acordul nostru scris.</p>
    ),
  },
  {
    title: "Date personale",
    body: (
      <p>Prelucrăm datele tale conform Regulamentului (UE) 2016/679 (GDPR) și legislației române. Detalii în <Link to="/politica-de-confidentialitate">Politica de Confidențialitate</Link> și în <Link to="/politica-de-cookies">Politica de Cookies</Link>.</p>
    ),
  },
  {
    title: "Reclamații și soluționarea litigiilor",
    body: (
      <>
        <p>Pentru orice nemulțumire ne poți scrie la <a href={`mailto:${c.supportEmail}`}>{c.supportEmail}</a> sau la <a href={`mailto:${c.email}`}>{c.email}</a>; încercăm să răspundem în cel mult 30 de zile.</p>
        <p>Ca consumator poți apela și la soluționarea alternativă a litigiilor (SAL) prin <a href={SAL_URL} target="_blank" rel="noopener noreferrer">reclamatiisal.anpc.ro</a>, precum și la Autoritatea Națională pentru Protecția Consumatorilor (<a href={ANPC_URL} target="_blank" rel="noopener noreferrer">anpc.ro</a>). Te poți adresa oricând și instanțelor judecătorești competente.</p>
      </>
    ),
  },
  {
    title: "Legea aplicabilă",
    body: (
      <p>Acești termeni sunt guvernați de legea română. Dacă ești consumator, rămâi protejat de dispozițiile imperative ale legii țării tale de reședință. Litigiile se soluționează amiabil, iar în caz contrar de instanțele române competente (pentru consumatori, cele de la domiciliul acestora sau de la sediul nostru, la alegerea ta).</p>
    ),
  },
  {
    title: "Contact",
    body: (
      <p>{c.legalName}, CUI {c.cui}, {c.regCom}, {c.address}.<br />E-mail: <a href={`mailto:${c.email}`}>{c.email}</a> | Telefon: {c.phone}</p>
    ),
  },
];

const TermsAndConditions = () => (
  <LegalLayout
    title="Termeni și Condiții"
    seoTitle="Termeni și Condiții de Utilizare | AirLife.ro"
    description="Termenii și condițiile AirLife.ro: comenzi, plată, livrare, drept de retragere de 14 zile, garanție și soluționarea litigiilor, conform legislației din România."
    canonical="https://airlife.ro/termeni-si-conditii"
    sections={sections}
  />
);

export default TermsAndConditions;

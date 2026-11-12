// Programmatic SEO: /servicii/:service/:locality. Pure data + builders (no JSX), shared by the React page and
// scripts/prerender.ts. To change coverage, edit LOCALITIES (remove what you do not serve) and rebuild.

export const PHONE_DISPLAY = "+40 722 15 35 25";
export const PHONE_TEL = "+40722153525";

export interface Locality {
  slug: string;
  name: string;
  type: "oraș" | "comună";
  note: string; // one locality-specific sentence, keep factual
}

export const LOCALITIES: Locality[] = [
  { slug: "ramnicu-sarat", name: "Râmnicu Sărat", type: "oraș", note: "Râmnicu Sărat este al doilea oraș ca mărime din județul Buzău, cu o combinație de apartamente în blocuri și case unde sistemele de climatizare se montează tot mai des." },
  { slug: "maracineni", name: "Mărăcineni", type: "comună", note: "Mărăcineni se află în apropierea municipiului Buzău, așa că ajungem rapid la locuințe și spații comerciale din zonă." },
  { slug: "vadu-pasii", name: "Vadu Pașii", type: "comună", note: "Vadu Pașii este o comună din imediata vecinătate a Buzăului, deservită de echipa noastră locală." },
  { slug: "costesti", name: "Costești", type: "comună", note: "În Costești, ca în majoritatea comunelor din județ, lucrăm de obicei la case și la spații mici comerciale, cu programare în prealabil." },
  { slug: "sahateni", name: "Săhăteni", type: "comună", note: "Pentru Săhăteni stabilim programarea în funcție de traseu, ca să nu plătești deplasări inutile." },
  { slug: "patarlagele", name: "Pătârlagele", type: "oraș", note: "Pătârlagele este un oraș din zona de deal a județului Buzău, unde verile calde fac din climatizare o investiție utilă și pentru case." },
  { slug: "pogoanele", name: "Pogoanele", type: "oraș", note: "Pogoanele se află în zona de câmpie din sud-estul județului, cu veri fierbinți în care aerul condiționat funcționează intens." },
  { slug: "nehoiu", name: "Nehoiu", type: "oraș", note: "Nehoiu, pe Valea Buzăului, este una dintre cele mai îndepărtate localități deservite, de aceea programăm lucrările grupat." },
];

export interface Service {
  slug: string;
  name: string; // "Montaj aer condiționat"
  short: string;
  intro: string;
  includes: string[];
  steps: string[];
  faqs: { q: string; a: (l: Locality) => string }[];
  basePath: string; // the existing Buzău page for this service
}

export const SERVICES: Service[] = [
  {
    slug: "montaj-aer-conditionat",
    name: "Montaj aer condiționat",
    short: "montaj",
    basePath: "/servicii/montaj-aer-conditionat-buzau",
    intro: "Montăm aparate de aer condiționat de tip split, cu traseu de conducte curat, vidare corectă a circuitului și testare la final, pentru un randament bun și o durată de viață cât mai lungă a echipamentului.",
    includes: [
      "Vizită sau consultanță pentru alegerea amplasării unităților",
      "Montaj unitate interioară și exterioară",
      "Trasee de conducte frigorifice și scurgere condens",
      "Vidarea circuitului și verificarea etanșeității",
      "Punere în funcțiune, testare și instruire privind utilizarea",
    ],
    steps: [
      "Ne suni sau ne scrii și stabilim detaliile: tipul aparatului, locul de montaj, numărul de camere.",
      "Venim la data programată cu materialele și scula necesare și executăm montajul.",
      "Testăm aparatul în fața ta și îți explicăm cum să îl folosești și să îl întreții.",
    ],
    faqs: [
      { q: "Cât durează montajul unui aparat de aer condiționat?", a: () => "Un montaj standard de tip split se face de regulă într-o zi de lucru. Durata exactă depinde de lungimea traseului și de condițiile de la fața locului." },
      { q: "Pot să cumpăr aparatul separat?", a: (l) => `Da. Dacă ai deja aparatul, ne ocupăm doar de montaj. Pentru lucrări în ${l.name} stabilim programarea după ce ne spui modelul și locul de montaj.` },
      { q: "Ce trebuie să pregătesc înainte de montaj?", a: () => "Asigură accesul la locul de montaj și la tabloul electric și eliberează zona din jurul peretelui unde se instalează unitatea. Restul îți spunem noi la programare." },
    ],
  },
  {
    slug: "igienizare-aer-conditionat",
    name: "Igienizare aer condiționat",
    short: "igienizare",
    basePath: "/servicii/igienizare-aer-conditionat-buzau",
    intro: "Igienizarea curăță filtrele, schimbătorul de căldură și tava de condens, unde se adună praf, mucegai și bacterii. Un aparat curat răcește mai eficient, consumă mai puțin și nu mai răspândește mirosuri neplăcute.",
    includes: [
      "Demontarea și curățarea filtrelor",
      "Curățarea unității interioare cu soluții dedicate",
      "Curățarea tăvii de condens și verificarea scurgerii",
      "Verificarea funcționării și a stării generale a aparatului",
      "Dezinfecție a componentelor care vin în contact cu aerul",
    ],
    steps: [
      "Stabilim ziua și ora care ți se potrivesc.",
      "Igienizăm aparatul la tine acasă sau în spațiul comercial, fără să murdărim mobila sau podeaua.",
      "Verificăm funcționarea și îți spunem când să programezi următoarea igienizare.",
    ],
    faqs: [
      { q: "Cât de des trebuie igienizat aerul condiționat?", a: () => "De regulă se recomandă o igienizare pe an, înainte de sezonul cald, iar mai des dacă aparatul rulează intens sau ai animale de companie ori alergii." },
      { q: "De ce miroase urât aparatul când îl pornesc?", a: () => "Cel mai des cauza este umezeala și mucegaiul acumulate în unitatea interioară și în tava de condens. O igienizare profesională rezolvă de obicei problema." },
      { q: "Faceți igienizare și la aparate montate de alții?", a: (l) => `Da, lucrăm pe aparate de orice marcă. Pentru ${l.name} ne spui modelul și stabilim împreună programarea.` },
    ],
  },
  {
    slug: "service-aer-conditionat",
    name: "Service aer condiționat",
    short: "service",
    basePath: "/servicii/service-aer-conditionat-buzau",
    intro: "Diagnosticăm și remediem defecțiunile aparatelor de aer condiționat: lipsa răcirii sau a încălzirii, scurgeri de apă, zgomote, oprirea cu cod de eroare. Venim cu piesele uzuale și explicăm clar ce s-a întâmplat.",
    includes: [
      "Diagnoză: citirea codurilor de eroare și testarea componentelor",
      "Verificarea presiunii din circuit și căutarea pierderilor de agent frigorific",
      "Remedierea scurgerilor de condens și a blocajelor",
      "Verificarea plăcii electronice, a senzorilor și a ventilatoarelor",
      "Raport clar al intervenției și recomandări",
    ],
    steps: [
      "Ne descrii problema la telefon: ce face aparatul, ce cod de eroare apare, de când.",
      "Venim la programare, diagnosticăm și îți spunem ce are aparatul înainte să începem remedierea.",
      "Remediem pe loc când se poate sau comandăm piesa necesară și revenim.",
    ],
    faqs: [
      { q: "Aparatul pornește, dar nu răcește. Ce poate fi?", a: () => "Cauzele frecvente sunt filtrele înfundate, lipsa agentului frigorific sau o problemă la compresor ori la placa electronică. Doar diagnoza la fața locului arată exact." },
      { q: "De ce picură apă din unitatea interioară?", a: () => "De obicei scurgerea de condens este blocată sau panta tubului este greșită. Este o intervenție simplă în majoritatea cazurilor." },
      { q: "Cum programez o intervenție?", a: (l) => `Sună-ne la ${PHONE_DISPLAY} sau cere o ofertă online. Pentru ${l.name} fixăm ziua în funcție de traseu.` },
    ],
  },
];

export const localPath = (s: Service, l: Locality) => `/servicii/${s.slug}/${l.slug}`;

export interface LocalPage {
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  localNote: string;
  includes: string[];
  steps: string[];
  faqs: { q: string; a: string }[];
  related: { label: string; path: string }[];
}

export const getLocalPage = (serviceSlug: string, localitySlug: string): LocalPage | null => {
  const s = SERVICES.find((x) => x.slug === serviceSlug);
  const l = LOCALITIES.find((x) => x.slug === localitySlug);
  if (!s || !l) return null;
  const related = [
    ...SERVICES.filter((o) => o !== s).map((o) => ({ label: `${o.name} în ${l.name}`, path: localPath(o, l) })),
    ...LOCALITIES.filter((o) => o !== l).slice(0, 3).map((o) => ({ label: `${s.name} în ${o.name}`, path: localPath(s, o) })),
    { label: `${s.name} în Buzău`, path: s.basePath },
  ];
  return {
    path: localPath(s, l),
    title: `${s.name} în ${l.name} | AirLife`,
    description: `${s.name} în ${l.name}, județul Buzău. Echipă locală, programare rapidă, lucrări curate. Sună la ${PHONE_DISPLAY} sau cere o ofertă online.`,
    h1: `${s.name} în ${l.name}`,
    intro: s.intro,
    localNote: l.note,
    includes: s.includes,
    steps: s.steps,
    faqs: s.faqs.map((f) => ({ q: f.q, a: f.a(l) })),
    related,
  };
};

export const allLocalPaths = () => SERVICES.flatMap((s) => LOCALITIES.map((l) => localPath(s, l)));

export interface CategoryInfo {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  description: string;
  buyingGuide: {
    title: string;
    tips: string[];
  };
  faq?: { q: string; a: string }[];
}

export const CATEGORIES_DATA: Record<string, CategoryInfo> = {
  "aer-conditionat": {
    slug: "aer-conditionat",
    name: "Aer Condiționat",
    title: "Aer Condiționat Inverter Wi-Fi 9000–21000 BTU | AirLife",
    metaDescription:
      "Aparate de aer condiționat inverter cu Wi-Fi, în mai multe capacități (9000–21000 BTU). Livrare în toată țara, montaj profesional la cerere.",
    h1: "Aer Condiționat Inverter cu Wi-Fi",
    description:
      "Un aer condiționat inverter își reglează continuu turația compresorului în loc să pornească și să se oprească, așa că menține temperatura constantă și consumă mai puțin decât un aparat clasic. Aici găsești aparate split inverter pentru apartamente, case și birouri, în mai multe capacități. Livrare în toată țara; montajul se face la cerere, în funcție de zonă.",
    buyingGuide: {
      title: "Cum alegi capacitatea potrivită?",
      tips: [
        "Pentru o cameră de până la 25 mp se alege de obicei 9000 BTU, pentru 25–35 mp 12000 BTU, iar pentru spații mai mari 18000 BTU sau mai mult.",
        "Orientarea spre sud, etajele superioare și geamurile mari cer o capacitate mai mare decât indică suprafața.",
        "Clasa energetică A++ și compresorul inverter reduc consumul, iar funcția Wi-Fi permite pornirea aparatului înainte să ajungi acasă.",
      ],
    },
    faq: [
      { q: "Ce înseamnă aer condiționat inverter?", a: "Inverter înseamnă că turația compresorului se reglează continuu în funcție de cât de departe este camera de temperatura setată. Aparatul nu mai pornește și oprește compresorul la putere maximă, ci lucrează mai lin, cu consum mai mic și temperatură mai stabilă." },
      { q: "Merită un aer condiționat inverter față de unul clasic?", a: "Da, pentru utilizare zilnică. Un inverter consumă de regulă mai puțin curent decât un aparat on/off, face mai puțin zgomot și menține temperatura mai constantă. Diferența de preț se recuperează în timp, mai ales dacă folosești aparatul și pentru încălzire." },
      { q: "Câți BTU îmi trebuie pentru camera mea?", a: "Orientativ: 9000 BTU pentru camere de până la 25 mp, 12000 BTU pentru 25–35 mp și 18000 BTU sau mai mult pentru spații mai mari. Camerele orientate spre sud, de la ultimul etaj sau cu geamuri mari au nevoie de o capacitate mai mare." },
      { q: "Poate un aer condiționat inverter să încălzească iarna?", a: "Da, aparatele split inverter funcționează și ca pompă de căldură. Randamentul scade la temperaturi exterioare foarte scăzute, așa că verifică în fișa tehnică temperatura minimă de funcționare la încălzire." },
      { q: "Livrați și montați aparatul?", a: "Livrăm prin curier în toată țara. Montajul profesional îl facem la cerere, doar în zonele acoperite de echipa noastră sau de parteneri; trimite-ne localitatea și îți confirmăm disponibilitatea." },
    ],
  },
  "aer-conditionat-fara-unitate-exterioara": {
    slug: "aer-conditionat-fara-unitate-exterioara",
    name: "Aer Condiționat fără Unitate Exterioară",
    title: "Aer Condiționat fără Unitate Exterioară (Monobloc) | AirLife",
    metaDescription:
      "Aparate de aer condiționat fără unitate exterioară, pentru locuințe unde nu se poate monta unitate pe fațadă. Răcire și încălzire, control din aplicație.",
    h1: "Aer Condiționat fără Unitate Exterioară",
    description:
      "Soluția pentru apartamentele și clădirile în care nu poți monta o unitate pe fațadă. Aparatele sunt subțiri, silențioase și fac atât răcire, cât și încălzire.",
    buyingGuide: {
      title: "Ce trebuie să verifici înainte de a alege:",
      tips: [
        "Aparatul are nevoie de două deschideri în perete pentru aerul de admisie și de evacuare, deci verifică locul de montaj.",
        "Capacitatea se alege după suprafață, ca la orice aparat de aer condiționat; pentru camere mari sunt necesare mai multe unități.",
        "Dacă locuința se încălzește greu iarna, variantele cu încălzitor electric ajută la temperaturi foarte scăzute.",
      ],
    },
    faq: [
      { q: "Cum funcționează un aer condiționat fără unitate exterioară?", a: "Este un aparat monobloc: compresorul și toate componentele sunt într-o singură unitate montată pe peretele interior. Schimbul de căldură cu exteriorul se face prin două orificii în perete, prin care aerul intră și iese, așa că pe fațadă rămân vizibile doar două grile." },
      { q: "Când merită un aer condiționat fără unitate exterioară?", a: "Când nu poți monta o unitate pe fațadă: clădiri istorice, blocuri unde asociația nu permite, fațade termoizolate sau apartamente fără balcon. Verifică totuși regulile clădirii înainte de a da găurile în perete." },
      { q: "Este mai zgomotos decât un aer condiționat split?", a: "Da, puțin. Pentru că și compresorul este în interior, nivelul de zgomot este mai mare decât la unitatea interioară a unui split. Modelele moderne sunt totuși suficient de silențioase pentru dormitoare și birouri." },
      { q: "Consumă mai mult curent decât un split inverter?", a: "La aceeași capacitate, un monobloc are de regulă un randament ceva mai mic decât un split inverter. Diferența este compensată de faptul că nu ai nevoie de unitate exterioară și de un montaj mai simplu." },
      { q: "Poate încălzi iarna?", a: "Da, majoritatea modelelor fac atât răcire, cât și încălzire. Pentru temperaturi exterioare foarte scăzute, variantele cu rezistență electrică suplimentară ajută la menținerea confortului." },
    ],
  },
  "recuperatoare-caldura": {
    slug: "recuperatoare-caldura",
    name: "Recuperatoare de Căldură",
    title: "Ventilație Descentralizată cu Recuperare de Căldură | AirLife",
    metaDescription:
      "Sisteme de ventilație descentralizată cu recuperare de căldură NovingAIR și SEVentilation, plus panouri de control și accesorii. Pentru case, apartamente, mansarde, subsoluri și birouri.",
    h1: "Ventilație Descentralizată cu Recuperare de Căldură",
    description:
      "Ventilația descentralizată înseamnă unități montate direct în pereții exteriori ai fiecărei camere, fără tubulatură prin casă. Ele aduc aer proaspăt și recuperează o mare parte din căldura aerului evacuat, așa că aerisești fără să pierzi căldura iarna. Potrivite pentru case, apartamente, mansarde, subsoluri, birouri și renovări.",
    buyingGuide: {
      title: "Cum alegi un recuperator descentralizat?",
      tips: [
        "Alege diametrul și debitul în funcție de camera deservită; mai multe unități conectate pot lucra împreună.",
        "Varianta wireless evită cablurile între unități și simplifică montajul la renovări.",
        "Verifică nivelul de zgomot și grosimea peretelui, pentru că de ea depinde lungimea tubulaturii.",
      ],
    },
    faq: [
      { q: "Ce este un sistem de ventilație descentralizată?", a: "Un sistem format din unități mici montate direct în pereții exteriori, câte una sau mai multe în fiecare cameră, fără tubulatură centrală. Unitățile lucrează de regulă în pereche: una introduce aer proaspăt, cealaltă evacuează aerul viciat, iar sensul se inversează periodic. Schimbătorul de căldură din fiecare unitate reține căldura aerului evacuat și o cedează aerului proaspăt." },
      { q: "Ventilație descentralizată sau centralizată: ce aleg?", a: "Varianta descentralizată nu are nevoie de tubulatură prin tavan sau pereți, așa că se montează ușor în casele existente și la renovări, cameră cu cameră. Sistemul centralizat cu recuperator și tubulatură se potrivește mai bine la construcțiile noi, unde traseele se pot prevedea din proiect." },
      { q: "Cât costă un sistem de ventilație descentralizată pentru o casă?", a: "Costul depinde de numărul de camere ventilate și de modelul unităților: de regulă se folosește o pereche de unități pentru una sau două camere, plus un panou de control. Trimite-ne suprafața și numărul de camere și îți facem o ofertă exactă." },
      { q: "Se poate folosi în subsol, mansardă sau birouri?", a: "Da. În subsoluri ajută la eliminarea umezelii și a mirosului de închis, în mansarde reduce condensul de pe geamurile de acoperiș, iar în birouri menține aerul proaspăt fără să deschizi geamurile. Contează să existe un perete exterior în care să se poată monta unitățile." },
      { q: "Cum se controlează unitățile?", a: "Prin panouri de control sau controlere care pornesc unitățile, reglează treptele de ventilație și sincronizează perechile. Unele modele au variante wireless, care evită cablurile între unități." },
      { q: "Livrați și montați sistemul?", a: "Livrăm unitățile, panourile și accesoriile prin curier în toată țara. Montajul se face la cerere, doar în zonele acoperite de echipa noastră sau de parteneri; trimite-ne localitatea și îți confirmăm disponibilitatea." },
    ],
  },
  "ventilatoare-baie": {
    slug: "ventilatoare-baie",
    name: "Ventilatoare Baie",
    title: "Ventilatoare Baie Silențioase cu Senzor Umiditate | AirLife",
    metaDescription:
      "Ventilatoare pentru baie și camere umede: silențioase, cu senzor de umiditate sau de prezență, plus carcase, valve și controlere.",
    h1: "Ventilatoare pentru Baie și Camere Umede",
    description:
      "Elimină umezeala și mirosurile din baie, bucătărie sau camere tehnice. Găsești ventilatoare cu senzori, precum și carcasele, valvele și controlerele necesare montajului.",
    buyingGuide: {
      title: "Cum alegi un ventilator pentru baie:",
      tips: [
        "Un senzor de umiditate sau de prezență pornește ventilatorul doar când este nevoie.",
        "Pentru dormitoare și băi lângă camere alege un model cu zgomot cât mai mic, exprimat în dB(A).",
        "Unele modele de ventilatoare au nevoie de carcasă separată; verifică dacă este inclusă în preț.",
      ],
    },
  },
  "accesorii-aer-conditionat": {
    slug: "accesorii-aer-conditionat",
    name: "Accesorii Aer Condiționat",
    title: "Accesorii Aer Condiționat: Console și Suporturi | AirLife",
    metaDescription:
      "Cumpără accesorii pentru montaj și fixare aer condiționat: console exterioare electrostatice, tampoane antivibrante din cauciuc tehnic, tubulatură și protecții.",
    h1: "Accesorii pentru Aer Condiționat",
    description:
      "Gama noastră de accesorii include elemente de fixare și amortizare de calitate industrială pentru unitățile externe și interne de climatizare.",
    buyingGuide: {
      title: "Cum alegi accesoriile potrivite pentru aparatul tău?",
      tips: [
        "Alege console de susținere dimensionate corespunzător greutății unității externe (400mm pentru 9.000–12.000 BTU, 450–500mm pentru 18.000–24.000 BTU).",
        "Folosește întotdeauna tampoane antivibrante pentru a elimina transmiterea vibrațiilor compresorului prin peretele locuinței.",
        "Verifică dacă șuruburile și diblurile sunt compatibile cu tipul de zidărie (beton, cărămidă cu goluri sau BCA).",
      ],
    },
  },
  "consumabile-hvac": {
    slug: "consumabile-hvac",
    name: "Consumabile HVAC",
    title: "Consumabile HVAC: Furtun Condens, Bandă, Izolație | AirLife",
    metaDescription:
      "Consumabile profesionale pentru instalații de climatizare și HVAC: furtun evacuare condens spiralat, benzi adezive de matisare rezistente UV și protecții termice.",
    h1: "Consumabile HVAC & Climatizare",
    description:
      "Materiale și consumabile esențiale pentru trasee frigorifice fiabile, etanșeitate perfectă și drenaj corect al condensului.",
    buyingGuide: {
      title: "Sfaturi pentru alegerea consumabilelor:",
      tips: [
        "Optează pentru furtun de condens cu inserție spiralată rezistentă la strivire și blocare.",
        "Banda de matisare fără adeziv sau cu protecție UV previne degradarea izolației din spumă elastomeric a traseului exterior.",
        "Izolația termică trebuie să aibă grosimea adecvată pentru a preveni formarea condensului pe tubulatură.",
      ],
    },
  },
  "curatare-si-intretinere": {
    slug: "curatare-si-intretinere",
    name: "Curățare și Întreținere",
    title: "Curățare și Igienizare Aer Condiționat: Spray-uri | AirLife",
    metaDescription:
      "Soluții pentru curățarea aparatelor de aer condiționat: spray spumă pentru vaporizator, dezinfectant biocid și pastile antibacteriene pentru tava de condens.",
    h1: "Produse pentru Curățare și Întreținere HVAC",
    description:
      "Menține aerul curat și elimină mirosurile neplăcute din casă cu spray-uri și soluții testate pentru vaporizatoare, turbine și filtre de aer condiționat.",
    buyingGuide: {
      title: "Ghid de utilizare a produselor de igienizare:",
      tips: [
        "Curăță mecanic filtrele grosiere din plastic cu apă călduță înainte de aplicarea spray-ului.",
        "Aplică spuma activă uniform pe fagurele vaporizatorului și las-o să acționeze 10–15 minute.",
        "Pornește aparatul pe modul răcire timp de 20 de minute: condensul format va clăti natural soluția și impuritățile prin tăvița de drenaj.",
        "Folosește pastile antibacteriene în tăvița de condens pentru a preveni coloniile de mucegai pe termen lung.",
      ],
    },
  },
  "filtre-purificatoare": {
    slug: "filtre-purificatoare",
    name: "Filtre Purificatoare",
    title: "Filtre HEPA și Carbon Activ pentru Purificatoare | AirLife",
    metaDescription:
      "Filtre de rezervă HEPA H13 și carbon activ pentru purificatoare și sisteme de climatizare. Rețin 99.97% din particulele fine, alergeni și mirosuri neplăcute.",
    h1: "Filtre pentru Purificatoare de Aer și Climatizare",
    description:
      "Înlocuirea periodică a filtrelor asigură performanța optimă a aparatelor de purificare și aerului respirat în locuință.",
    buyingGuide: {
      title: "Când și cum se înlocuiesc filtrele?",
      tips: [
        "Filtrele HEPA se schimbă de regulă la fiecare 6–12 luni, în funcție de nivelul de poluare din încăpere.",
        "Filtrele cu carbon activ neutralizează compușii organici volatili (COV), fumul de țigară și mirosurile de gătit.",
        "Nu spălați niciodată filtrele clasice HEPA cu apă, cu excepția cazului în care producătorul specifică explicit că sunt lavabile.",
      ],
    },
  },
  "purificatoare-aer": {
    slug: "purificatoare-aer",
    name: "Purificatoare Aer",
    title: "Purificatoare de Aer cu Filtru HEPA | AirLife",
    metaDescription:
      "Purificatoare de aer eficiente energetic pentru dormitor, living sau birou. Filtrare multistrat HEPA, senzori calitatea aerului și mod nocturn silențios.",
    h1: "Purificatoare de Aer Rezidențiale",
    description:
      "Soluții avansate pentru îmbunătățirea calității aerului din locuință, ideale pentru copii, persoane alergice sau proprietari de animale.",
    buyingGuide: {
      title: "Cum alegi capacitatea purificatorului?",
      tips: [
        "Verifică valoarea CADR (Clean Air Delivery Rate) raportată la volumul camerei în metri cubi.",
        "Asigură-te că aparatul dispune de pre-filtru lavabil pentru reținerea prafului grosier și a părului de animale.",
        "Alege un model cu mod de noapte silențios (< 25 dB) dacă urmează să fie amplasat în dormitor.",
      ],
    },
  },
  "dezumidificatoare": {
    slug: "dezumidificatoare",
    name: "Dezumidificatoare",
    title: "Dezumidificatoare de Aer: Umiditate și Mucegai | AirLife",
    metaDescription:
      "Dezumidificatoare casnice eficiente cu higrostat electronic. Previn formarea condensului, a igrasiei și a mucegaiului în apartamente și case.",
    h1: "Dezumidificatoare de Aer pentru Casă",
    description:
      "Menține umiditatea optimă a aerului între 40% și 60% pentru un mediu sănătos, protejând pereții și sănătatea căilor respiratorii.",
    buyingGuide: {
      title: "Factori esențiali în alegerea unui dezumidificator:",
      tips: [
        "Capacitatea de extracție în litri/24h trebuie aleasă în funcție de suprafața încăperii și severitatea umidității.",
        "Funcția de drenaj continuu prin furtun este utilă pentru spații nelocuite permanent sau beciuri.",
        "Higrostatul reglabil permite aparatului să se oprească automat când s-a atins nivelul optim de umiditate, economisind energie.",
      ],
    },
  },
};

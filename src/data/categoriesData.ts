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
}

export const CATEGORIES_DATA: Record<string, CategoryInfo> = {
  "aer-conditionat": {
    slug: "aer-conditionat",
    name: "Aer Condiționat",
    title: "Aer Condiționat Inverter Wi-Fi 9000–21000 BTU | AirLife",
    metaDescription:
      "Aparate de aer condiționat inverter cu Wi-Fi, în mai multe capacități (9000–21000 BTU). Montaj profesional și județ.",
    h1: "Aer Condiționat cu Unitate Exterioară",
    description:
      "Aparate split inverter pentru apartamente, case și birouri, disponibile în mai multe capacități. La cerere, le montăm noi, și în localitățile din jur.",
    buyingGuide: {
      title: "Cum alegi capacitatea potrivită?",
      tips: [
        "Pentru o cameră de până la 25 mp se alege de obicei 9000 BTU, pentru 25–35 mp 12000 BTU, iar pentru spații mai mari 18000 BTU sau mai mult.",
        "Orientarea spre sud, etajele superioare și geamurile mari cer o capacitate mai mare decât indică suprafața.",
        "Clasa energetică A++ și compresorul inverter reduc consumul, iar funcția Wi-Fi permite pornirea aparatului înainte să ajungi acasă.",
      ],
    },
  },
  "aer-conditionat-fara-unitate-exterioara": {
    slug: "aer-conditionat-fara-unitate-exterioara",
    name: "Aer Condiționat fără Unitate Exterioară",
    title: "Aer Condiționat fără Unitate Exterioară | AirLife",
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
  },
  "recuperatoare-caldura": {
    slug: "recuperatoare-caldura",
    name: "Recuperatoare de Căldură",
    title: "Recuperatoare de Căldură Descentralizate | AirLife",
    metaDescription:
      "Recuperatoare de căldură descentralizate NovingAIR și SEVentilation pentru ventilație cu aer proaspăt, fără pierderi mari de căldură. Montaj în perete.",
    h1: "Recuperatoare de Căldură Descentralizate",
    description:
      "Aduc aer proaspăt în locuință și recuperează căldura din aerul evacuat, fără tubulaturi lungi. Potrivite pentru apartamente, case și renovări.",
    buyingGuide: {
      title: "Cum alegi un recuperator descentralizat?",
      tips: [
        "Alege diametrul și debitul în funcție de camera deservită; mai multe unități conectate pot lucra împreună.",
        "Varianta wireless evită cablurile între unități și simplifică montajul la renovări.",
        "Verifică nivelul de zgomot și grosimea peretelui, pentru că de ea depinde lungimea tubulaturii.",
      ],
    },
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

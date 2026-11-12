export interface StaticProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categorySlug: string;
  image_url: string;
  features: string[];
  stock: number;
  sku: string;
  crossSellIds?: string[];
  slug?: string;
}

export const INITIAL_PRODUCTS: StaticProduct[] = [
  {
    id: "prod-spray-igienizare-400ml",
    name: "Spray Spumă Igienizare Vaporizator Aer Condiționat 400ml",
    description:
      "Spumă activă profesională cu acțiune degresantă și antibacteriană special formulată pentru curățarea fagurelui vaporizatorului de aer condiționat. Îndepărtează praful, depunerile organice și mirosurile neplăcute. Include furtun flexibil prelungitor pentru aplicare profundă printre lamele.",
    price: 49.0,
    category: "Curățare și Întreținere",
    categorySlug: "curatare-si-intretinere",
    image_url: "/placeholder.svg",
    features: [
      "Spumă activă cu dizolvare lentă",
      "Include tub prelungitor 60cm",
      "Nu necesită clătire manuală",
      "Elimină sursa mirosurilor neplăcute",
    ],
    stock: 25,
    sku: "AL-CLN-01",
    crossSellIds: ["prod-husa-curatare-ac", "prod-pastile-tava-condens"],
  },
  {
    id: "prod-pastile-tava-condens",
    name: "Pastile Antibacteriene pentru Tăvița de Condens (Set 10 buc)",
    description:
      "Comprimate cu dizolvare lentă pentru prevenirea coloniilor de bacterii, alge și mucegai în tăvița și furtunul de drenaj al condensului. Previn înfundarea tubulaturii și mirosul stagnant de umezeală pe o perioadă de până la 3 luni per pastilă.",
    price: 39.0,
    category: "Curățare și Întreținere",
    categorySlug: "curatare-si-intretinere",
    image_url: "/placeholder.svg",
    features: [
      "Set 10 pastile",
      "Dizolvare lentă controlată",
      "Previne blocarea drenajului de condens",
      "Protecție antibacteriană continuă",
    ],
    stock: 30,
    sku: "AL-CLN-02",
    crossSellIds: ["prod-spray-igienizare-400ml"],
  },
  {
    id: "prod-husa-curatare-ac",
    name: "Husă Impermeabilă de Protecție și Spălare AC 9000-12000 BTU",
    description:
      "Husă etanșă din PVC armat, concepută pentru curățarea aparatelor de aer condiționat direct pe perete fără murdărirea zugrăvelii sau a pardoselii. Dotată cu pâlnie de colectare și furtun de evacuare a lichidului rezidual în găleată.",
    price: 79.0,
    category: "Curățare și Întreținere",
    categorySlug: "curatare-si-intretinere",
    image_url: "/placeholder.svg",
    features: [
      "Material PVC impermeabil reutilizabil",
      "Furtun de evacuare 2m inclus",
      "Tensionare elastică pe contur",
      "Compatibilă unități interioare 70-100cm",
    ],
    stock: 12,
    sku: "AL-CLN-03",
    crossSellIds: ["prod-spray-igienizare-400ml"],
  },
  {
    id: "prod-console-unitate-externa-450mm",
    name: "Set Console Rabatabile Unitate Externă AC 450mm (până la 140kg)",
    description:
      "Console metalice rabatabile din tablă ambutisată groasă de 1.8mm, vopsite în câmp electrostatic cu pulbere poliesterică rezistentă la intemperii și raze UV. Include bolțuri de fixare și nivelă încorporată pentru aliniere precisă.",
    price: 65.0,
    category: "Accesorii Aer Condiționat",
    categorySlug: "accesorii-aer-conditionat",
    image_url: "/placeholder.svg",
    features: [
      "Braț de susținere 450mm",
      "Sarcină maximă testată 140 kg",
      "Vopsire electrostatică anticorozivă",
      "Nivelă cu bulă integrată",
    ],
    stock: 18,
    sku: "AL-ACC-01",
    crossSellIds: ["prod-tampoane-antivibrante-m8"],
  },
  {
    id: "prod-tampoane-antivibrante-m8",
    name: "Set 4 Amortizoare Antivibrante din Cauciuc M8 pentru AC",
    description:
      "Tampoane din cauciuc tehnic vulcanizat cu șuruburi filetate M8 din oțel galvanizat. Absorb până la 85% din vibrațiile și zgomotul transmise de compresorul unității externe în peretele clădirii.",
    price: 32.0,
    category: "Accesorii Aer Condiționat",
    categorySlug: "accesorii-aer-conditionat",
    image_url: "/placeholder.svg",
    features: [
      "Set complet 4 bucăți cu piulițe și șaibe",
      "Filet M8 zincat",
      "Cauciuc EPDM de duritate medie",
      "Reduce zgomotul și rezonanța în cameră",
    ],
    stock: 40,
    sku: "AL-ACC-02",
    crossSellIds: ["prod-console-unitate-externa-450mm"],
  },
  {
    id: "prod-furtun-condens-spiralat-6m",
    name: "Furtun Evacuare Condens Spiralat Ø16mm (Rolă 6 metri)",
    description:
      "Furtun flexibil din PVC cu inserție spiralată rigidă pentru drenajul apei de condens. Interior neted pentru a preveni colmatarea și acumularea reziduurilor. Rezistent la temperaturi extreme și raze UV.",
    price: 28.0,
    category: "Consumabile HVAC",
    categorySlug: "consumabile-hvac",
    image_url: "/placeholder.svg",
    features: [
      "Lungime 6 metri",
      "Diametru interior Ø16mm",
      "Inserție spiralată antistrivire",
      "Rezistență UV pentru exterior",
    ],
    stock: 35,
    sku: "AL-CSM-01",
    crossSellIds: ["prod-banda-matisat-alba"],
  },
  {
    id: "prod-banda-matisat-alba",
    name: "Bandă Matisare Traseu Frigorific Rezistentă UV (Rolă 25m)",
    description:
      "Bandă din PVC plastifiat fără adeziv, cu lățimea de 50mm, utilizată pentru protecția și finisarea profesională a fasciculului de țevi de cupru, cabluri electrice și furtun de condens. Protejează izolația termică împotriva degradării solare și a păsărilor.",
    price: 18.0,
    category: "Consumabile HVAC",
    categorySlug: "consumabile-hvac",
    image_url: "/placeholder.svg",
    features: [
      "Lungime 25m, lățime 50mm",
      "Fără adeziv — nu lasă reziduuri lipicioase",
      "Elasticitate optimă pentru matisat strâns",
      "Protecție UV de lungă durată",
    ],
    stock: 50,
    sku: "AL-CSM-02",
    crossSellIds: ["prod-furtun-condens-spiralat-6m"],
  },
  {
    id: "prod-filtru-carbon-activ-universal",
    name: "Set Filtre Carbon Activ Antimiros Universale pentru AC (Set 2 buc)",
    description:
      "Filtre adiționale cu microparticule de cărbune activ, compatibile cu fanta suport a majorității aparatelor de aer condiționat split. Absorb compușii organici volatili, fumul de țigară și mirosurile neplăcute din fluxul de aer recirculat.",
    price: 29.0,
    category: "Filtre Purificatoare",
    categorySlug: "filtre-purificatoare",
    image_url: "/placeholder.svg",
    features: [
      "Set 2 bucăți (dimensiuni 21.5 x 5 cm)",
      "Cărbune activ de mare porozitate",
      "Ușor de decupat dacă este necesar",
      "Se recomandă înlocuirea la 4-6 luni",
    ],
    stock: 22,
    sku: "AL-FLT-01",
    crossSellIds: ["prod-spray-igienizare-400ml"],
  },
];

// Vsi podatki, ki se ponavljajo po strani, so na enem mestu.
// Ko se kaj spremeni (telefon, naslov, meni), popraviš samo tukaj.

export const site = {
  ime: "AS system d.o.o.",
  url: "https://assystem.si",
  moto: "Ko pritrjevanje postane igra",
  ustanovljeno: 1993,
  drzave: 19,
  telefon: "03 800 70 00",
  telefonRaw: "+38638007000",
  email: "info@as-system.si",
  emailProdaja: "prodaja@as-system.si",
  lokacije: [
    {
      naziv: "Šmarje pri Jelšah",
      vloga: "Uprava, visokoregalno skladišče, avtomatska montaža",
      naslov: "Obrtniška ulica 14, 3240 Šmarje pri Jelšah",
    },
    {
      naziv: "Bistrica ob Sotli",
      vloga: "Hladno kovanje, brizganje plastike, lastna orodjarna",
      naslov: "Bistrica ob Sotli, Slovenija",
    },
  ],
  druzbena: {
    facebook: "https://www.facebook.com/AsSystemDoo",
    instagram: "https://www.instagram.com/assystem.si/",
    youtube: "https://www.youtube.com/channel/UCMfPMqf0Nam2SbmAKcG35AA",
    tiktok: "https://www.tiktok.com/@assystem.si",
  },
};

// Glavna navigacija
export const navigacija = [
  { naziv: "Program", pot: "/program" },
  { naziv: "ASfix", pot: "/asfix" },
  { naziv: "Private label", pot: "/private-label" },
  { naziv: "Proizvodnja", pot: "/proizvodnja" },
  { naziv: "Kakovost", pot: "/kakovost" },
  { naziv: "O nas", pot: "/o-nas" },
  { naziv: "Kontakt", pot: "/kontakt" },
];

// Kategorije prodajnega programa.
// Slugi so enaki kot na as-system.si, da preusmeritve ohranijo Google pozicije.
export const kategorije = [
  {
    slug: "pritrdila-za-beton",
    naziv: "Pritrdila za beton",
    opis: "Jeklena sidra, turbo vijaki in vijaki za beton z evropsko tehnično oceno ETA.",
  },
  {
    slug: "vijacno-blago",
    naziv: "Vijačno blago",
    opis: "Vijaki, matice in podložke po standardih DIN in EN, pocinkani in iz nerjavnega jekla.",
  },
  {
    slug: "klasicna-pritrdila",
    naziv: "Klasična pritrdila",
    opis: "Najlonski zidni vložki, udarni vijaki in univerzalni vložki za polne in luknjaste podlage.",
  },
  {
    slug: "pritrdila-za-suhomontazo",
    naziv: "Pritrdila za suhomontažo",
    opis: "Vložki in vijaki za mavčne plošče in lahke predelne stene.",
  },
  {
    slug: "pritrdila-za-instalacije",
    naziv: "Pritrdila za inštalacije",
    opis: "Objemke, palice in nosilci za vodovodne, plinske in prezračevalne inštalacije.",
  },
  {
    slug: "pritrdila-za-v-votle-stene",
    naziv: "Pritrdila za votle stene",
    opis: "Rešitve za pritrjevanje v votlake, opeko in stene z zračnimi kanali.",
  },
  {
    slug: "kemicna-pritrditev",
    naziv: "Kemična pritrditev",
    opis: "Dvokomponentne mase PESF in EASF, sidrne palice in mrežice.",
  },
  {
    slug: "pritrdila-za-v-izolacijo",
    naziv: "Pritrdila za izolacijo",
    opis: "Stiropor vložki in pritrdila za fasadne sisteme.",
  },
  {
    slug: "pritrdila-za-streho",
    naziv: "Pritrdila za streho",
    opis: "Vijaki in tesnilni elementi za kritine ter strešne konstrukcije.",
  },
  {
    slug: "pritrdila-za-sanitarno-opremo",
    naziv: "Pritrdila za sanitarno opremo",
    opis: "Kompleti za WC školjke, umivalnike, bojlerje in kopalniško opremo.",
  },
  {
    slug: "zeblji",
    naziv: "Žeblji",
    opis: "Gradbeni, strešni in žični žeblji v različnih dimenzijah.",
  },
];

// Tri poti obiskovalcev — hrbtenica domače strani.
export const poti = [
  {
    naziv: "Distributerji",
    opis: "Iščete evropskega proizvajalca z lastnim razvojem, ETA certifikati in stabilnimi dobavnimi roki.",
    cta: "Postanite distributer",
    pot: "/distributerji",
  },
  {
    naziv: "Trgovine",
    opis: "Potrebujete asortiman ASfix v embalaži, ki proda sama — vrečke, škatle, police.",
    cta: "Program ASfix",
    pot: "/asfix",
  },
  {
    naziv: "Blagovne znamke",
    opis: "Želite pritrdila pod svojo znamko, od razvoja do zapakirane škatle z vašim logotipom.",
    cta: "Private label",
    pot: "/private-label",
  },
];

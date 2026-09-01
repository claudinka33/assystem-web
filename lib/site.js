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
    slika: "/slike/sidro-txh7.jpg",
    naziv: "Pritrdila za beton",
    opis: "Jeklena sidra, turbo vijaki in vijaki za beton z evropsko tehnično oceno ETA.",
  },
  {
    slug: "vijacno-blago",
    slika: "/slike/sidro-tx1.jpg",
    naziv: "Vijačno blago",
    opis: "Vijaki, matice in podložke po standardih DIN in EN, pocinkani in iz nerjavnega jekla.",
  },
  {
    slug: "klasicna-pritrdila",
    slika: "/slike/zidni-vlozek-uvs.jpg",
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
    slika: "/slike/udarni-vijak-zv.jpg",
    naziv: "Pritrdila za inštalacije",
    opis: "Objemke, palice in nosilci za vodovodne, plinske in prezračevalne inštalacije.",
  },
  {
    slug: "pritrdila-za-v-votle-stene",
    slika: "/slike/mrezica.jpg",
    naziv: "Pritrdila za votle stene",
    opis: "Rešitve za pritrjevanje v votlake, opeko in stene z zračnimi kanali.",
  },
  {
    slug: "kemicna-pritrditev",
    slika: "/slike/kemicno-sidro-pesf.jpg",
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
    slika: "/slike/sanitarno-wc.jpg",
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
    naziv: "Trgovine",
    opis: "Asortiman ASfix v embalaži, ki proda sama — vrečke z izveskom, škatle z jasno šifro, paletne enote.",
    cta: "Program ASfix",
    pot: "/asfix",
  },
  {
    naziv: "Distributerji",
    opis: "Evropski proizvajalec z lastnim razvojem, oceno ETA in stabilnimi dobavnimi roki za vaš trg.",
    cta: "Postanite distributer",
    pot: "/distributerji",
  },
  {
    naziv: "Izvajalci",
    opis: "Pravo pritrdilo za vsako podlago, s tehničnimi listi in navodili za vgradnjo.",
    cta: "Prodajni program",
    pot: "/program",
  },
];

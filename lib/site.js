// Vsi podatki, ki se ponavljajo po strani, so na enem mestu.
// Ko se kaj spremeni (telefon, naslov, meni), popraviš samo tukaj.

export const site = {
  ime: "AS system d.o.o.",
  url: "https://assystem.si",
  moto: "Ko pritrjevanje postane igra",
  ustanovljeno: 1993,
  drzave: 19,
  telefon: "+386 3 800 70 00",
  telefonRaw: "+38638007000",
  email: "info@as-system.si",
  emailProdaja: "info@as-system.si", // vsa prodajna pošta gre na info@ (prodaja@ se ne uporablja)
  lokacije: [
    {
      naziv: "Šmarje pri Jelšah",
      vloga: "Uprava, visokoregalno skladišče, avtomatska montaža",
      naslov: "Obrtniška ulica 14, 3240 Šmarje pri Jelšah",
    },
    {
      naziv: "Bistrica ob Sotli",
      vloga: "Hladno kovanje, valjanje navojev, brizganje plastike",
      naslov: "Hrastje ob Bistrici 2a, 3256 Bistrica ob Sotli",
    },
  ],
  // Podatki za pravna obvestila (ZGD-1, ZVPot-1, ZEPT)
  podjetje: {
    polnoIme: "AS SYSTEM proizvodnja, trgovina in storitve d.o.o.",
    naslov: "Obrtniška ulica 14, 3240 Šmarje pri Jelšah, Slovenija",
    maticna: "5821380000",
    davcna: "SI57134154",
    zavezanecDDV: true,
    sodisce: "Okrožno sodišče v Celju",
    osnovniKapital: "1.800.000,00 EUR",
    zastopnik: "Aleš Seidl, direktor",
    trr: "SI56 0700 0000 3486 464 (Gorenjska banka d.d.)",
  },
  // Spletna trgovina: mora se ujemati s tabelo »dostava« v bazi
  trgovina: {
    postnina: 10,
    brezplacnoNad: 100,
    // poštnina po vrednosti blaga z DDV (izračun: lib/cene.js -> izracunajPostnino)
    razredi: "do 50 € 10 €, od 50 € do 100 € 5 €, nad 100 € brezplačno",
    odprema: "praviloma v 1–2 delovnih dneh po potrditvi naročila",
    dostavaPosta: "Pošta Slovenije praviloma dostavi naslednji delovni dan po oddaji pošiljke",
  },
  druzbena: {
    facebook: "https://www.facebook.com/AsSystemDoo",
    instagram: "https://www.instagram.com/assystem.si/",
    youtube: "https://www.youtube.com/channel/UCMfPMqf0Nam2SbmAKcG35AA",
    tiktok: "https://www.tiktok.com/@assystem.si",
  },
};

// Glavna navigacija. »pod« = spustni seznam; »znamke« = seznam z logotipi znamk;
// »kategorije« = spustni seznam s slikami kategorij (iz baze, glej app/layout.js).
export const navigacija = [
  { naziv: "Izdelki", pot: "/program", kategorije: true },
  { naziv: "Znamke", pot: "/asfix", znamke: true },
  { naziv: "Za trgovce", pot: "/za-trgovce" },
  {
    naziv: "Za partnerje",
    pot: "/private-label",
    pod: [
      { naziv: "Private label", pot: "/private-label", opis: "Proizvodnja in pakiranje v škatle ali vrečke pod vašo blagovno znamko." },
      { naziv: "Vijaki po naročilu", pot: "/vijaki-po-narocilu", opis: "Izdelava vijakov po vaši risbi ali tehnični dokumentaciji." },
      { naziv: "Postanite distributer", pot: "/distributerji", opis: "Partnerstvo za prodajo naših znamk na vašem trgu." },
    ],
  },
  {
    naziv: "Podjetje",
    pot: "/o-nas",
    pod: [
      { naziv: "O nas", pot: "/o-nas", opis: `Slovenski proizvajalec pritrdilne tehnike od leta ${site.ustanovljeno}, dobava v ${site.drzave} držav.` },
      { naziv: "Proizvodnja", pot: "/proizvodnja", opis: "Hladno kovanje, valjanje navojev, brizganje plastike in avtomatska montaža." },
      { naziv: "Kakovost", pot: "/kakovost", opis: "Evropske tehnične ocene ETA, izjave o lastnostih in lastni nadzor kakovosti." },
      { naziv: "Zaposlitev", pot: "/zaposlitev", opis: "Prosta delovna mesta v Šmarju pri Jelšah in Bistrici ob Sotli." },
    ],
  },
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
    opis: "Vijaki, matice in podložke po normah DIN in ISO, pocinkani in iz nerjavnega jekla.",
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

// Kontakti zaposlenih na strani »O nas«.
// Vir: telefonske_nove.xlsx (oktober 2026). Ko se kaj spremeni, popraviš samo tukaj.
// tel = stacionarna, mob = mobitel. Polje, ki ga ni, pusti prazno (null).

export const oddelki = [
  {
    naziv: "Vodstvo",
    ljudje: [
      { ime: "Aleš Seidl", vloga: "Direktor", tel: "+386 3 800 70 01", mob: "+386 30 333 363", email: "ales.seidl@as-system.si" },
      { ime: "France Denk", vloga: "Tehnični direktor", tel: "+386 3 800 70 11", mob: "+386 40 654 172", email: "france.denk@as-system.si" },
    ],
  },
  {
    naziv: "Prodaja in nabava",
    ljudje: [
      { ime: "Špela Sedminek", vloga: "Direktorica prodaje in nabave", tel: "+386 3 800 70 06", mob: "+386 30 654 006", email: "spela.sedminek@as-system.si" },
      { ime: "Manja Part", vloga: "Komercialistka na terenu", tel: "+386 3 800 70 05", mob: "+386 30 654 005", email: "manja.part@as-system.si" },
      { ime: "Žan Seidl", vloga: "Komercialist na terenu · ključni kupci", tel: "+386 3 800 70 02", mob: "+386 30 332 251", email: "zan.seidl@as-system.si" },
      { ime: "Marko Praprotnik", vloga: "Komercialist na terenu", tel: null, mob: "+386 40 862 562", email: "marko.praprotnik@as-system.si" },
      { ime: "Tjaša Mihevc", vloga: "Komercialistka v pisarni · B2B prodaja", tel: "+386 3 800 70 00", mob: "+386 40 934 316", email: "tjasa.mihevc@as-system.si" },
      { ime: "Marina Benko", vloga: "Komercialistka v pisarni", tel: "+386 3 800 70 28", mob: "+386 40 934 316", email: "marina.benko@as-system.si" },
      { ime: "Alen Drofenik", vloga: "Vodja nabave", tel: "+386 3 800 70 08", mob: "+386 30 654 008", email: "alen.drofenik@as-system.si" },
    ],
  },
  {
    naziv: "Proizvodnja in kakovost",
    ljudje: [
      { ime: "Boris Černelč", vloga: "Vodja obrata Bistrica ob Sotli", tel: "+386 3 800 70 26", mob: "+386 41 864 999", email: "boris.cernelc@as-system.si" },
      { ime: "Milena Jančič", vloga: "Vodja obrata Šmarje pri Jelšah", tel: "+386 3 800 70 23", mob: "+386 41 439 370", email: "milena.jancic@as-system.si" },
      { ime: "Gregor Koritnik", vloga: "Tehnolog", tel: "+386 3 800 70 13", mob: "+386 40 654 175", email: "gregor.koritnik@as-system.si" },
      { ime: "Mitja Marguč", vloga: "Nalogi proizvodnja in montaža", tel: "+386 3 800 70 18", mob: "+386 30 654 014", email: "mitja.marguc@as-system.si" },
      { ime: "Mitja Babič", vloga: "Kakovost", tel: null, mob: "+386 31 405 973", email: "kakovost@as-system.si" },
    ],
  },
  {
    naziv: "Skladišče in odprema",
    ljudje: [
      { ime: "Feliks Žekar", vloga: "Vodja skladišča", tel: "+386 3 800 70 16", mob: "+386 40 654 176", email: "skladisce@as-system.si" },
    ],
  },
  {
    naziv: "Računovodstvo in kadrovska",
    ljudje: [
      { ime: "Sara Jagodič", vloga: "Knjigovodja", tel: "+386 3 800 70 09", mob: "+386 30 654 141", email: "sara.jagodic@as-system.si" },
      { ime: "Cvetka Seidl", vloga: "Kadrovska služba", tel: "+386 3 800 70 10", mob: "+386 30 654 001", email: "cvetka.seidl@as-system.si" },
    ],
  },
  {
    naziv: "Marketing",
    ljudje: [
      { ime: "Claudia Seidl", vloga: "Vodja marketinga", tel: "+386 3 800 70 07", mob: "+386 40 993 317", email: "claudia.seidl@as-system.si" },
    ],
  },
];

// Hitri usmerjevalnik »Koga pokličem?«
export const kogaPoklicem = [
  {
    kdo: "Distributerji",
    opis: "Partnerstvo za prodajo naših znamk na tujih trgih.",
    oseba: "Špela Sedminek",
  },
  {
    kdo: "Trgovci",
    opis: "Pokličite komercialista, ki pokriva vašo regijo.",
    regija: true,
  },
  {
    kdo: "Vijaki po naročilu",
    opis: "Izdelava po vaši risbi ali tehnični dokumentaciji.",
    oseba: "Špela Sedminek",
  },
  {
    kdo: "Private label",
    opis: "Naši izdelki v vaši embalaži in pod vašo znamko.",
    deljeno: [
      { kje: "V Sloveniji", oseba: "Manja Part" },
      { kje: "Izven Slovenije", oseba: "Špela Sedminek" },
    ],
  },
];

// Teren za trgovine — barve se ujemajo z zemljevidom regij.
export const teren = [
  {
    oseba: "Marko Praprotnik",
    kratko: "SZ — Osrednjeslovenska, Gorenjska",
    barva: "#96c3f2",
    regije: ["SZ — Osrednjeslovenska", "Gorenjska"],
  },
  {
    oseba: "Žan Seidl",
    kratko: "SV in JV Slovenija",
    barva: "#fcce82",
    regije: ["SV — Podravska, Savinjska", "Pomurska, Koroška"],
    dodatno: { barva: "#f096a2", regije: ["JV — Jugovzhodna Slovenija", "Zasavska, Posavska"] },
  },
  {
    oseba: "Manja Part",
    kratko: "JZ Slovenija + izbrani kraji",
    barva: "#96d296",
    regije: ["JZ — Goriška, Obalno-kraška", "Primorsko-notranjska"],
    dodatno: {
      barva: "#bf8de2",
      regije: ["Izbrani kraji: Maribor, Celje, Velenje, Žalec, Slovenj Gradec, Trbovlje, Litija …"],
    },
  },
];

export function poisci(ime) {
  for (const o of oddelki) {
    const p = o.ljudje.find((l) => l.ime === ime);
    if (p) return p;
  }
  return null;
}

export function telRaw(t) {
  const d = t.replace(/\s/g, "");
  return d.startsWith("+") ? d : "+386" + d.replace(/^0/, "");
}

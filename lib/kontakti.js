// Kontakti zaposlenih na strani »O nas«.
// Vir: telefonske_nove.xlsx (oktober 2026). Ko se kaj spremeni, popraviš samo tukaj.
// tel = stacionarna, mob = mobitel. Polje, ki ga ni, pusti prazno (null).

export const oddelki = [
  {
    naziv: "Vodstvo",
    ljudje: [
      { ime: "Aleš Seidl", vloga: "Direktor", tel: "03 800 70 01", mob: "030 333 363", email: "ales.seidl@as-system.si" },
      { ime: "France Denk", vloga: "Tehnični direktor", tel: "03 800 70 11", mob: "040 654 172", email: "france.denk@as-system.si" },
    ],
  },
  {
    naziv: "Prodaja in nabava",
    ljudje: [
      { ime: "Špela Sedminek", vloga: "Direktorica prodaje in nabave", tel: "03 800 70 06", mob: "030 654 006", email: "spela.sedminek@as-system.si" },
      { ime: "Manja Part", vloga: "Komercialistka na terenu", tel: "03 800 70 05", mob: "030 654 005", email: "manja.part@as-system.si" },
      { ime: "Žan Seidl", vloga: "Prodaja ključnim kupcem", tel: "03 800 70 02", mob: "030 332 251", email: "zan.seidl@as-system.si" },
      { ime: "Marko Praprotnik", vloga: "Komercialist na terenu", tel: null, mob: null, email: null },
      { ime: "Tjaša Mihevc", vloga: "B2B prodaja", tel: "03 800 70 00", mob: "040 934 316", email: "tjasa.mihevc@as-system.si" },
      { ime: "Alen Drofenik", vloga: "Vodja nabave", tel: "03 800 70 08", mob: "030 654 008", email: "alen.drofenik@as-system.si" },
    ],
  },
  {
    naziv: "Proizvodnja in kakovost",
    ljudje: [
      { ime: "Boris Černelč", vloga: "Vodja obrata Bistrica ob Sotli", tel: "03 800 70 26", mob: "041 864 999", email: "boris.cernelc@as-system.si" },
      { ime: "Milena Jančič", vloga: "Vodja obrata Šmarje pri Jelšah", tel: "03 800 70 23", mob: "041 439 370", email: "milena.jancic@as-system.si" },
      { ime: "Gregor Koritnik", vloga: "Tehnolog", tel: "03 800 70 13", mob: "040 654 175", email: "gregor.koritnik@as-system.si" },
      { ime: "Mitja Marguč", vloga: "Nalogi proizvodnja in montaža", tel: "03 800 70 18", mob: "030 654 014", email: "mitja.marguc@as-system.si" },
      { ime: "Mitja Babič", vloga: "Kakovost", tel: null, mob: "031 405 973", email: "kakovost@as-system.si" },
    ],
  },
  {
    naziv: "Skladišče in odprema",
    ljudje: [
      { ime: "Feliks Žekar", vloga: "Vodja skladišča", tel: "03 800 70 16", mob: "040 654 176", email: "skladisce@as-system.si" },
    ],
  },
  {
    naziv: "Računovodstvo in kadrovska",
    ljudje: [
      { ime: "Barbara Škorjanc", vloga: "Računovodja", tel: "03 800 70 12", mob: "041 783 362", email: "barbara.skorjanc@as-system.si" },
      { ime: "Sara Jagodič", vloga: "Knjigovodja", tel: "03 800 70 09", mob: "030 654 141", email: "sara.jagodic@as-system.si" },
      { ime: "Cvetka Seidl", vloga: "Kadrovska služba", tel: "03 800 70 10", mob: "030 654 001", email: "cvetka.seidl@as-system.si" },
    ],
  },
  {
    naziv: "Marketing",
    ljudje: [
      { ime: "Claudia Seidl", vloga: "Vodja marketinga", tel: "03 800 70 07", mob: "040 993 317", email: "claudia.seidl@as-system.si" },
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
    opis: "Pokliče vas komercialist, ki pokriva vašo regijo.",
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
    barva: "#96c3f2",
    regije: ["SZ — Osrednjeslovenska", "Gorenjska"],
  },
  {
    oseba: "Žan Seidl",
    barva: "#fcce82",
    regije: ["SV — Podravska, Savinjska", "Pomurska, Koroška"],
    dodatno: { barva: "#f096a2", regije: ["JV — Jugovzhodna Slovenija", "Zasavska, Posavska"] },
  },
  {
    oseba: "Manja Part",
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
  return "+386" + t.replace(/\s/g, "").replace(/^0/, "");
}

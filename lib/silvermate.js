// Silvermate v katalogu: kategorija in dva izdelka (Pozi, Torx).
// V tabeli izdelka se loči cel in delni navoj (stolpec »Navoj« s filtrom).

export const SILVERMATE_KATEGORIJA = {
  naziv: "Lesni vijaki Silvermate",
  slug: "lesni-vijaki-silvermate",
  nadrejena: null, // korenska kategorija — ploščica na strani Izdelki
  opis: "Lesni vijaki Silvermate s križnim (Pozi) ali Torx nastavkom, s celim ali delnim navojem — Ø 3,0 do 6,0 mm.",
  slika: "/slike/silvermate/silvermate-vijaka.jpg",
};

const embalaza = [
  {
    lastnost: "Pakiranje",
    vrednost: "škatla",
    naziv: "Škatla Silvermate",
    opis: "Profesionalna škatla z okencem in pladnjem. Število kosov v škatli je v stolpcu »Pakiranje«.",
    slika: "/slike/silvermate/skatla-silvermate.png",
  },
  {
    lastnost: "Navoj",
    vrednost: "cel navoj",
    naziv: "Cel navoj",
    opis: "Drži po vsej dolžini — plošče, letve, okovje.",
    slika: "/slike/silvermate/silvermate-cel-navoj.png",
  },
  {
    lastnost: "Navoj",
    vrednost: "delni navoj",
    naziv: "Delni navoj",
    opis: "Gladki del pod glavo potegne kosa lesa skupaj — konstrukcijski spoji.",
    slika: "/slike/silvermate/silvermate-delni-navoj.png",
  },
];

const skupnoUporaba = [
  "Iverne, OSB in MDF plošče",
  "Pohištvo in notranja oprema",
  "Letve, opaži in podkonstrukcije",
  "Konstrukcijski spoji v lesu (delni navoj)",
];

export const SILVERMATE_IZDELKI = {
  pozi: {
    naziv: "Lesni vijak Silvermate — križna glava (Pozi)",
    slug: "lesni-vijak-silvermate-pozi",
    seoNaslov: "Lesni vijak Silvermate Pozi — cel in delni navoj",
    kratekOpis:
      "Lesni vijak z ugreznjeno glavo in križnim nastavkom Pozi — s celim navojem (AS811) ali delnim navojem (AS812), Ø 3,0 do 6,0 mm.",
    opis:
      "Silvermate je lesni vijak z izjemno ostro konico in izboljšanim navojem, ki v lesu takoj prime. Rezalna rebra pod glavo poskrbijo za čist ugrez brez poškodb, voskana površina pa zmanjša silo pri vijačenju.\n\nIzvedba s celim navojem (AS811) drži po vsej dolžini — za pritrjevanje plošč, letev in okovja. Izvedba z delnim navojem (AS812) z gladkim delom pod glavo potegne dva kosa lesa skupaj — za konstrukcijske spoje. V tabeli spodaj izberite cel ali delni navoj.",
    tehnicniOpis:
      "Pocinkano jeklo (ZnB) · ugreznjena glava · nastavek PZ 1, PZ 2 ali PZ 3 · cel navoj (AS811) ali delni navoj (AS812) · evropska tehnična ocena ETA-18/0284, oznaka CE",
    uporaba: skupnoUporaba,
    prednosti: [
      "Ostra konica — vijak takoj prime v lesu",
      "Rezalna rebra za čist ugrez glave",
      "Majhno tveganje cepitve lesa",
      "Voskana površina — manj sile pri vijačenju",
    ],
    material: "Jeklo, pocinkano (ZnB)",
    eta: "ETA-18/0284",
    slika: "/slike/silvermate/AS811.jpg",
    galerija: ["/slike/silvermate/AS811.jpg", "/slike/silvermate/AS812.jpg", "/slike/silvermate/nastavek-kriz.png", "/slike/silvermate/silvermate-cel-navoj.png", "/slike/silvermate/silvermate-delni-navoj.png", "/slike/silvermate/detajl-konica.jpg", "/slike/silvermate/detajl-glava.jpg"],
    vrstniRed: 1,
    embalaza,
  },
  torx: {
    naziv: "Lesni vijak Silvermate — Torx",
    slug: "lesni-vijak-silvermate-torx",
    seoNaslov: "Lesni vijak Silvermate Torx — cel in delni navoj",
    kratekOpis:
      "Lesni vijak z ugreznjeno glavo in nastavkom Torx — s celim navojem (AS814) ali delnim navojem (AS816), Ø 3,0 do 6,0 mm.",
    opis:
      "Silvermate je lesni vijak z izjemno ostro konico in izboljšanim navojem, ki v lesu takoj prime. Nastavek Torx prenese večji navor brez zdrsa — primeren za daljše vijake in trši les.\n\nIzvedba s celim navojem (AS814) drži po vsej dolžini — za pritrjevanje plošč, letev in okovja. Izvedba z delnim navojem (AS816) z gladkim delom pod glavo potegne dva kosa lesa skupaj — za konstrukcijske spoje in tramove. V tabeli spodaj izberite cel ali delni navoj.",
    tehnicniOpis:
      "Pocinkano jeklo (ZnB) · ugreznjena glava · nastavek TX 10, TX 20 ali TX 30 · cel navoj (AS814) ali delni navoj (AS816) · evropska tehnična ocena ETA-18/0284, oznaka CE",
    uporaba: skupnoUporaba,
    prednosti: [
      "Torx prenese večji navor brez zdrsa",
      "Ostra konica — vijak takoj prime v lesu",
      "Majhno tveganje cepitve lesa",
      "Delni navoj do 200 mm za konstrukcijske spoje",
    ],
    material: "Jeklo, pocinkano (ZnB)",
    eta: "ETA-18/0284",
    slika: "/slike/silvermate/AS814.jpg",
    galerija: ["/slike/silvermate/AS814.jpg", "/slike/silvermate/AS816.jpg", "/slike/silvermate/nastavek-torx.png", "/slike/silvermate/silvermate-cel-navoj.png", "/slike/silvermate/silvermate-delni-navoj.png", "/slike/silvermate/detajl-konica.jpg", "/slike/silvermate/detajl-rezilo.jpg"],
    vrstniRed: 2,
    embalaza,
  },
};

// Pas VIDEO · LETAK · CERTIFIKAT (stran znamke in obe strani izdelkov)
export const SILVERMATE_MEDIJI = {
  video: { id: "CDTqtc-Er_w", naslov: "Lesni vijak Silvermate v praksi" },
  letak: { url: "/dokumenti/silvermate-letak-2026.pdf", slika: "/slike/silvermate/letak-naslovnica.jpg", naziv: "Letak Silvermate 2026" },
  certifikat: {
    oznaka: "ETA-18/0284",
    url: "/kontakt?izdelek=ETA-18%2F0284%20Silvermate&vir=certifikat",
    naslov: "Evropska tehnična ocena",
    opis: "Pošljemo na zahtevo →",
  },
};

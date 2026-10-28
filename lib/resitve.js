// Rešitve — interaktivni prikaz objekta (prototip z AI slikami).
// Koordinate so v odstotkih slike (x levo→desno, y zgoraj→dol),
// zato plusi ostanejo na mestu pri vsaki širini zaslona.
// Izdelki so navedeni s slugom izdelka na assystem.si; naziv je rezerva,
// če izdelka v bazi (še) ni.

export const objekt = {
  naslov: "Poslovno-industrijski objekt",
  opis:
    "Od temeljev do strehe: poglejte, kje na objektu se uporabljajo naša pritrdila. Kliknite na del objekta, nato na plus za izdelek.",
  slika: "/resitve/objekt.webp",
  sirina: 2200,
  visina: 1227,
};

export const cone = [
  {
    id: "skladisce",
    naziv: "Skladišče in regali",
    kratko: "Sidranje regalov in stebrov v betonska tla.",
    tocka: { x: 27.5, y: 45 },
    slika: "/resitve/skladisce.webp",
    plusi: [
      {
        x: 65.5, y: 58,
        naslov: "Jekleno sidro TXH7",
        izdelki: [
          { slug: "jekleno-sidro-txh7", naziv: "Jekleno sidro TXH7" },
        ],
      },
    ],
  },
  {
    id: "konstrukcija",
    naziv: "Jeklena konstrukcija",
    kratko: "Vijačni spoji nosilcev in sidranje stebrov.",
    tocka: { x: 33, y: 31 },
    slika: "/resitve/konstrukcija.webp",
    plusi: [
      {
        x: 36, y: 41,
        naslov: "HV garnitura EN 14399",
        povezava: { href: "/program/konstrukcijski-vijaki-hv-sb/hv-garnitura-en-14399", naziv: "HV garnitura EN 14399" },
        izdelki: [],
      },
      {
        x: 61.5, y: 49,
        naslov: "Garnitura SB EN 15048",
        povezava: { href: "/program/konstrukcijski-vijaki-hv-sb/garnitura-sb-en-15048", naziv: "Garnitura SB EN 15048" },
        izdelki: [],
      },
      {
        x: 48, y: 82,
        naslov: "Steber na betonskem podstavku",
        izdelki: [
          { slug: "kemicno-sidro-easf-top", naziv: "Kemično sidro EASF TOP" },
          { slug: "mungo-sidro-msl", naziv: "Težko sidro MSL" },
          { slug: "pistola-za-kemicne-mase", naziv: "Pištola za kemične mase" },
        ],
      },
    ],
  },
  {
    id: "temelji",
    naziv: "Temelji in beton",
    kratko: "Sidra in kemična pritrditev v armiran beton.",
    tocka: { x: 21, y: 69 },
    slika: "/resitve/temelji.webp",
    plusi: [
      {
        x: 41, y: 29.5,
        naslov: "Podložna plošča stebra",
        izdelki: [
          { slug: "jekleno-sidro-txm2", naziv: "Jekleno sidro TXm2" },
          { slug: "jekleno-sidro-txh7", naziv: "Jekleno sidro TXH7" },
        ],
      },
      {
        x: 57.5, y: 68,
        naslov: "Navojna palica v kemični masi",
        izdelki: [
          { slug: "kemicno-sidro-easf-top", naziv: "Kemično sidro EASF TOP" },
          { slug: "pistola-za-kemicne-mase", naziv: "Pištola za kemične mase" },
        ],
      },
    ],
  },
  {
    id: "fasada",
    naziv: "Fasada in izolacija",
    kratko: "Izolacijske plošče, okna in konzole na fasadi.",
    tocka: { x: 63.5, y: 55.5 },
    slika: "/resitve/fasada.webp",
    plusi: [
      {
        x: 72.5, y: 46,
        naslov: "Izolacijske plošče",
        izdelki: [
          { slug: "vlozek-za-stiropor", naziv: "Vložek za stiropor (mali in veliki)" },
        ],
      },
      {
        x: 16.5, y: 32,
        naslov: "Klima in okenski okvir",
        izdelki: [
          { slug: "univerzalni-vijak-z-vlozkom-af-rk", naziv: "Univerzalni vijak z vložkom AF-RK" },
          { slug: "univerzalni-vijak-z-vlozkom-af-rs", naziv: "Univerzalni vijak z vložkom AF-RS" },
          { slug: "vijak-z-vlozkom-za-okvir", naziv: "Vijak z vložkom za okvir" },
          { slug: "mungo-okvirni-vlozek-mb", naziv: "Okvirni vložek MB" },
        ],
      },
      {
        x: 56.25, y: 51.5,
        naslov: "Luč na fasadi",
        izdelki: [
          { slug: "vlozek-za-stiropor", naziv: "Vložek za stiropor (mali in veliki)" },
        ],
      },
    ],
  },
  {
    id: "pisarne",
    naziv: "Pisarne in inštalacije",
    kratko: "Mavčne stene, stropovi, cevi in kabelske police.",
    tocka: { x: 61, y: 38 },
    slika: "/resitve/pisarne.webp",
    plusi: [
      {
        x: 60.5, y: 71.5,
        naslov: "Polica na mavčni steni",
        izdelki: [
          { slug: "vlozek-za-gips-plasticni", naziv: "Plastični vložek za mavčne plošče" },
          { slug: "vlozek-za-gips-kovinski", naziv: "Kovinski vložek za mavčne plošče" },
        ],
      },
      {
        x: 32, y: 10,
        naslov: "Kabelske police na stropu",
        izdelki: [
          { slug: "mungo-sidro-za-strop-man", naziv: "Sidro za strop MAN" },
          { slug: "udarno-sidro-su-k", naziv: "Udarno sidro SU.K" },
          { slug: "vijak-hanger", naziv: "Vijak hanger" },
        ],
      },
      {
        x: 54, y: 16.5,
        naslov: "Cevi na stropu",
        izdelki: [
          { slug: "cevno-drzalo", naziv: "Cevno držalo" },
        ],
      },
      {
        x: 40, y: 28,
        naslov: "Prezračevalni kanal",
        izdelki: [
          { slug: "perforiran-trak", naziv: "Perforiran trak" },
        ],
      },
      {
        x: 81.5, y: 94,
        naslov: "Profil za mavčne stene",
        izdelki: [
          { slug: "udarni-vijak-nylon", naziv: "Udarni vijak UVS" },
        ],
      },
    ],
  },
  {
    id: "sanitarije",
    naziv: "Sanitarije",
    kratko: "Školjka, umivalnik in bojler na steni.",
    tocka: { x: 64, y: 47.5 },
    slika: "/resitve/sanitarije.webp",
    plusi: [
      {
        x: 51, y: 74,
        naslov: "Viseča WC školjka",
        izdelki: [{ slug: "komplet-za-wc-skoljko", naziv: "Komplet za WC školjko" }],
      },
      {
        x: 67, y: 63,
        naslov: "Umivalnik",
        izdelki: [{ slug: "komplet-za-umivalnik", naziv: "Komplet za umivalnik" }],
      },
      {
        x: 86, y: 30,
        naslov: "Bojler",
        izdelki: [{ slug: "komplet-za-bojler", naziv: "Komplet za bojler" }],
      },
    ],
  },
  {
    id: "ograja",
    naziv: "Ograja in zunanja ureditev",
    kratko: "Stebri ograje, drsna vrata in nabiralnik.",
    tocka: { x: 63.5, y: 72 },
    slika: "/resitve/ograja.webp",
    plusi: [
      {
        x: 19, y: 88,
        naslov: "Steber ograje na betonu",
        izdelki: [
          { slug: "jekleno-sidro-txh7", naziv: "Jekleno sidro TXH7" },
          { slug: "turbo-vijak-za-beton", naziv: "Turbo vijak" },
        ],
        igra: { href: "/asfix#igra", naziv: "Preizkusite: pritrdite ograjo v beton" },
      },
      {
        x: 90, y: 21,
        naslov: "Nabiralnik na stebru",
        izdelki: [
          { slug: "zidni-vlozek-z-robom", naziv: "Zidni vložek z robom" },
          { slug: "vijak-z-zidnim-vlozkom", naziv: "Vijak z zidnim vložkom" },
        ],
      },
    ],
  },
];

export function vsiSlugi() {
  return [...new Set(cone.flatMap((c) => c.plusi.flatMap((p) => p.izdelki.map((i) => i.slug))))];
}

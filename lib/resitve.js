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
        x: 16, y: 86,
        naslov: "Noge regalov v betonska tla",
        izdelki: [
          { slug: "jekleno-sidro-txh7", naziv: "Jekleno sidro TXH7" },
          { slug: "vijak-za-beton-pbs", naziv: "Vijak za beton PBS" },
          { slug: "turbo-vijak-za-beton", naziv: "Turbo vijak" },
        ],
      },
      {
        x: 84, y: 80,
        naslov: "Podnožje stebra",
        izdelki: [
          { slug: "mungo-sidro-msl", naziv: "Težko sidro MSL" },
          { slug: "jekleno-sidro-tx1-siroka-podlozka", naziv: "Jekleno sidro TX1" },
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
        x: 51, y: 52,
        naslov: "Vijačni spoj nosilcev",
        povezava: { href: "/program/vijacno-blago", naziv: "Vijačno blago ASco — vijaki, matice, podložke DIN" },
        izdelki: [],
      },
      {
        x: 36, y: 90,
        naslov: "Steber na betonskem podstavku",
        izdelki: [
          { slug: "kemicno-sidro-easf-top", naziv: "Kemično sidro EASF TOP" },
          { slug: "mungo-sidro-msl", naziv: "Težko sidro MSL" },
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
        x: 45, y: 25,
        naslov: "Podložna plošča stebra",
        izdelki: [
          { slug: "jekleno-sidro-txm2", naziv: "Jekleno sidro TXm2" },
          { slug: "jekleno-sidro-txh7", naziv: "Jekleno sidro TXH7" },
        ],
      },
      {
        x: 56, y: 55,
        naslov: "Navojna palica v kemični masi",
        izdelki: [
          { slug: "kemicno-sidro-pesf-top", naziv: "Kemično sidro PESF TOP" },
          { slug: "kemicno-sidro-easf-top", naziv: "Kemično sidro EASF TOP" },
          { slug: "mungo-sidrirna-palica-mit-s", naziv: "Sidrna palica MIT-S" },
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
        x: 56, y: 55,
        naslov: "Izolacijske plošče",
        izdelki: [
          { slug: "mungo-izolacijsko-pritrdilo-mip", naziv: "Izolacijsko pritrdilo MIP" },
          { slug: "mungo-izolacijski-diski", naziv: "Izolacijski diski" },
          { slug: "vlozek-za-stiropor", naziv: "Vložek za stiropor" },
        ],
      },
      {
        x: 22, y: 44,
        naslov: "Okenski okvir",
        izdelki: [
          { slug: "univerzalni-vijak-z-vlozkom-af-rk", naziv: "Univerzalni vijak z vložkom AF-RK" },
          { slug: "vijak-z-vlozkom-za-okvir", naziv: "Vijak z vložkom za okvir" },
          { slug: "mungo-okvirni-vlozek-mb", naziv: "Okvirni vložek MB" },
        ],
      },
      {
        x: 83, y: 50,
        naslov: "Konzola na steni",
        izdelki: [
          { slug: "zidni-vlozek-z-robom", naziv: "Zidni vložek z robom" },
          { slug: "zidni-vlozek-dolgi-vzd", naziv: "Dolgi zidni vložek VZD" },
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
        x: 39, y: 66,
        naslov: "Polica na mavčni steni",
        izdelki: [
          { slug: "vlozek-za-gips-kovinski", naziv: "Kovinski vložek za mavčne plošče" },
          { slug: "vlozek-za-votle-stene-vvs", naziv: "Vložek za votle stene VVS" },
          { slug: "mungo-snaptoggle-mst", naziv: "Snaptoggle MST" },
        ],
      },
      {
        x: 31, y: 13,
        naslov: "Kabelske police na stropu",
        izdelki: [
          { slug: "mungo-sidro-za-strop-man", naziv: "Sidro za strop MAN" },
          { slug: "udarno-sidro-su-k", naziv: "Udarno sidro SU.K" },
          { slug: "vijak-hanger", naziv: "Vijak hanger" },
        ],
      },
      {
        x: 81, y: 38,
        naslov: "Cevi na steni",
        izdelki: [
          { slug: "cevno-drzalo", naziv: "Cevno držalo" },
          { slug: "objemka-z-zebljickom", naziv: "Objemka z žebljičkom" },
          { slug: "univerzalni-instalacijski-vlozek", naziv: "Univerzalni inštalacijski vložek" },
        ],
      },
      {
        x: 78, y: 21,
        naslov: "Prezračevalni kanal",
        izdelki: [
          { slug: "perforiran-trak", naziv: "Perforiran trak" },
          { slug: "udarni-vijak-nylon", naziv: "Udarni vijak" },
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
        x: 47, y: 68,
        naslov: "Vodilo drsnih vrat",
        izdelki: [
          { slug: "jekleno-sidro-txm2", naziv: "Jekleno sidro TXm2" },
          { slug: "kemicno-sidro-easf-top", naziv: "Kemično sidro EASF TOP" },
        ],
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

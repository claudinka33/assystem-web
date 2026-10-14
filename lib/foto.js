// Fotografije iz proizvodnje AS system (znamke strojev zabrisane).
const L = (ime, alt) => ({ src: `/slike/foto/${ime}.jpg`, alt, w: 2000, h: 1333 });
const P = (ime, alt) => ({ src: `/slike/foto/${ime}.jpg`, alt, w: 1333, h: 2000 });

export const FOTO_KOVANJE = [
  L("proizvodnja-13", "Vijaki iz hladnega kovanja"),
  L("proizvodnja-06", "Valjanje navoja s hladilno emulzijo"),
  P("proizvodnja-02", "Vijaki po kovanju in valjanju navoja"),
  L("proizvodnja-08", "Linija za hladno kovanje"),
  L("proizvodnja-15", "Palice — surovina za proizvodnjo"),
  P("proizvodnja-05", "Nastavitev CNC stroja"),
  L("proizvodnja-07", "Dolgi vijaki z navojem"),
  L("proizvodnja-12", "Orodje za oblikovanje glave"),
  L("proizvodnja-01", "Vijaki na izhodu iz stroja"),
  P("proizvodnja-11", "Kontrola mer ob stroju"),
  L("proizvodnja-14", "Serija vijakov s Torx glavo"),
  L("proizvodnja-10", "Obešala z očesom"),
  P("proizvodnja-03", "Tekoči trak s serijo vijakov"),
  L("proizvodnja-04", "Vijaki z ugreznjeno glavo"),
  L("proizvodnja-16", "Vijaki za plastiko in pločevino"),
  L("proizvodnja-09", "Prvi kosi iz orodja"),
];

export const FOTO_PLASTIKA = [
  L("plastika-04", "Stroja za brizganje plastike"),
  L("plastika-01", "Orodje za brizganje zidnih vložkov"),
  L("plastika-03", "Zidni vložki na tekočem traku"),
  L("plastika-02", "Najlonski vložki po brizganju"),
];

export const FOTO_ORODJARNA = [
  L("orodjarna-01", "Struženje orodja"),
  L("orodjarna-04", "Rezkanje orodnega vložka"),
  L("orodjarna-02", "Načrtovanje orodja v CAD"),
  L("orodjarna-03", "Strojni park orodjarne"),
];

export const FOTO_KAKOVOST = [
  P("kakovost-01", "Preizkus izvlečne sile sidra v betonu"),
  L("kakovost-04", "Optično merjenje vijaka"),
  P("kakovost-06", "Optična meritev profila navoja"),
  L("kakovost-03", "Sidro med preizkusom nosilnosti"),
  P("kakovost-07", "Meritev glave vijaka"),
  P("kakovost-02", "Hidravlični preizkus sidra"),
  P("kakovost-05", "Merjenje vzorcev iz serije"),
];

export const FOTO_VPN = [
  L("vpn-risba", "Tehnična risba naročnika"),
  L("vpn-02", "Vijaki po naročilu — izbor izvedb"),
  L("vpn-04", "Vijaki z različnimi glavami in navoji"),
  L("vpn-01", "Posebne glave, navoji in površinske zaščite"),
  L("vpn-03", "Od M3 do M16"),
];

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

// Fotografije iz mape AS_slike (znamke strojev in viličarjev zabrisane).
const F = (ime, alt, w, h) => ({ src: `/slike/foto/${ime}.jpg`, alt, w, h });

export const FOTO_EKIPA = [
  F("ekipa-01", "Predstavitev programa kupcem", 2000, 1333),
  F("ekipa-02", "Prodaja — vedno na telefonu za kupce", 2000, 1333),
  F("ekipa-03", "Upravljanje linije za pakiranje v vrečke", 2000, 1333),
  F("ekipa-04", "Nastavitev stroja za vrečke", 2000, 1333),
  F("ekipa-05", "Upravljanje stroja za hladno kovanje", 2000, 1333),
  F("ekipa-06", "Kontrola mer po risbi", 2000, 1333),
  F("ekipa-07", "Nastavitev kovaškega stroja po risbi", 2000, 1333),
  F("ekipa-08", "Priprava naročila v skladišču", 2000, 1333),
  F("ekipa-09", "Odprema iz skladišča", 2000, 1333),
  F("ekipa-10", "Vsak dan na poti do kupcev", 2000, 1333),
  F("ekipa-11", "Proizvodna hala v Bistrici ob Sotli", 2000, 1328),
];

export const FOTO_SIDRA = [
  F("kovanje-01", "Linija za hladno kovanje sider", 2000, 1333),
  F("kovanje-02", "Jekleni vložki sider", 2000, 1333),
  F("kovanje-03", "Prenos med kovaškimi postajami", 2000, 1333),
  F("kovanje-04", "Sidro med kovanjem", 2000, 1333),
  F("kovanje-05", "Oblikovanje stožca sidra", 2000, 1333),
  F("kovanje-06", "Sidro na izhodu iz orodja", 2000, 1333),
  F("kovanje-07", "Kovaško orodje z več postajami", 2000, 1333),
];

export const FOTO_VIJAKI = [
  F("vijaki-01", "Stroji za hladno kovanje vijakov", 2000, 1333),
  F("vijaki-02", "Podajanje surovcev", 2000, 1333),
  F("vijaki-04", "Podajanje palic v stroj", 2000, 1333),
  F("vijaki-06", "Merjenje vzorca s kljunastim merilom", 2000, 1333),
  F("vijaki-08", "Stroj za valjanje navojev", 2000, 1333),
  F("vijaki-10", "Jeklene palice — surovina", 2000, 1333),
  F("vijaki-11", "Dolgi navojni vijaki", 2000, 1333),
  F("vijaki-13", "Žica za hladno kovanje", 2000, 1333),
  F("vijaki-14", "Strojni park za hladno kovanje", 2000, 1328),
  F("vijaki-15", "Pogled na proizvodno halo", 2000, 1328),
];

export const FOTO_PLASTIKA_2 = [
  F("plastika-07", "Stroj za brizganje plastike", 2000, 1333),
];

export const FOTO_MONTAZA = [
  F("montaza-01", "Avtomatska montaža sider", 2000, 1333),
  F("montaza-02", "Sestavljanje sidra", 1333, 2000),
  F("montaza-03", "Sestavni deli v vibracijskem podajalniku", 2000, 1333),
  F("montaza-04", "Prijemalo montažnega robota", 2000, 1333),
  F("montaza-05", "Sidro v montažni postaji", 2000, 1333),
  F("montaza-06", "Sestavljena sidra na drči", 2000, 1333),
  F("montaza-07", "Montažna postaja 02", 2000, 1333),
  F("montaza-08", "Montažna postaja 04", 2000, 1333),
  F("montaza-09", "Nameščanje podložke in matice", 2000, 1333),
  F("montaza-10", "Sidro med prenosom", 2000, 1333),
  F("montaza-11", "Sestavljena sidra", 2000, 1333),
];

export const FOTO_PAKIRANJE = [
  F("pakiranje-01", "Avtomatska linija za pakiranje v škatle", 2000, 1333),
  F("pakiranje-02", "Zlaganje škatel", 2000, 1333),
  F("pakiranje-03", "Kovinski vložki za mavčne plošče", 2000, 1333),
  F("pakiranje-04", "Vložki za mavčne plošče", 2000, 1333),
  F("pakiranje-05", "Štetje vijakov", 2000, 1333),
  F("pakiranje-06", "Škatla na poti do polnjenja", 2000, 1333),
  F("pakiranje-07", "Linija za vrečke z izveskom", 2000, 1333),
  F("pakiranje-08", "Vrečke z izveskom za trgovine", 2000, 1333),
  F("pakiranje-09", "Zapakirane vrečke z EAN kodo", 2000, 1333),
];

export const FOTO_SKLADISCE = [
  F("skladisce-01", "Visokoregalno skladišče", 2000, 1333),
  F("skladisce-02", "Škatle ASfix na regalih", 2000, 1333),
  F("skladisce-03", "Viličar med regali", 2000, 1333),
  F("skladisce-04", "Prevzem palete", 2000, 1333),
  F("skladisce-05", "Ozki hodniki med regali", 1333, 2000),
  F("skladisce-06", "Palete pripravljene za odpremo", 2000, 1333),
  F("skladisce-07", "Paletna mesta", 2000, 1333),
  F("skladisce-08", "Priprava palet ASfix", 2000, 1333),
  F("skladisce-09", "Skeniranje artiklov", 2000, 1333),
  F("skladisce-10", "Odprema", 2000, 1333),
  F("skladisce-11", "Skladišče z regali do stropa", 2000, 1333),
  F("skladisce-12", "Skladišče in montaža pod eno streho", 2000, 1333),
];

export const FOTO_ZEBLJI = [
  F("zeblji-01", "Linija za varjenje žebljev v kolut", 2000, 1333),
  F("zeblji-02", "Podajanje žebljev", 2000, 1333),
  F("zeblji-03", "Žeblji na podajalniku", 2000, 1333),
  F("zeblji-04", "Varjenje žebljev v trak", 1333, 2000),
  F("zeblji-05", "Navijanje žebljev v kolut", 2000, 1333),
  F("zeblji-06", "Kolut nastaja", 2000, 1333),
  F("zeblji-07", "Žeblji, povezani z žico", 2000, 1333),
  F("zeblji-08", "Navijanje koluta", 2000, 1333),
  F("zeblji-09", "Kolut žebljev", 2000, 1333),
  F("zeblji-10", "Kontrola koluta", 2000, 1333),
  F("zeblji-11", "Pakiranje kolutov v škatle", 2000, 1333),
];

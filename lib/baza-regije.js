// Regije po poštni številki (prva števka slovenske pošte).
export const REGIJE = [
  ["1", "Osrednja Slovenija (1xxx)"],
  ["2", "Štajerska, Koroška (2xxx)"],
  ["3", "Savinjska, Celje (3xxx)"],
  ["4", "Gorenjska (4xxx)"],
  ["5", "Goriška (5xxx)"],
  ["6", "Obala, Kras (6xxx)"],
  ["8", "Dolenjska, Posavje (8xxx)"],
  ["9", "Pomurje (9xxx)"],
  ["tujina", "Tujina"],
  ["brez", "Brez naslova"],
];

export function filtrRegije(poiz, r) {
  if (/^[1-9]$/.test(r)) return poiz.filter("posta", "match", `^(SI-?)?${r}[0-9]{3}`);
  if (r === "tujina") return poiz.not("posta", "is", null).not("posta", "match", "^(SI-?)?[0-9]{4}");
  if (r === "brez") return poiz.is("posta", null);
  return poiz;
}

export const RAZVRSTI = {
  email: ["email", "E-naslov"],
  ime: ["ime", "Ime in priimek"],
  podjetje: ["podjetje", "Podjetje"],
  kraj: ["posta", "Poslovalnica / kraj"],
  panoga: ["panoge", "Panoga"],
  stanje: ["odjavljen", "Stanje"],
  dodan: ["ustvarjeno", "Datum dodajanja"],
};

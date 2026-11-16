// Skupna pravila za prevajanje strani (strežnik in brskalnik).
// Spletna stran je napisana v slovenščini; angleška (/en) in nemška (/de)
// različica nastaneta samodejno — glej lib/i18n/prevajalnik.js.

export const JEZIKI = ["sl", "en", "de"];
export const TUJI = ["en", "de"];
export const IMENA_JEZIKOV = { sl: "SL", en: "EN", de: "DE" };

// Ključ niza: presledki strnjeni, brez robnih presledkov.
export function kljuc(s) {
  return String(s).replace(/\s+/g, " ").trim();
}

// Ali je niz sploh besedilo za prevod (ne številka, šifra, pot ali znamka).
const VELIKE_ZNAMKE = new Set(["ASFIX", "ASCO", "HAMMEX", "MUNGO", "SILVERMATE", "INOX", "SYSTEM", "EASF", "PESF"]);
const SAMO_ZNAMKE = new Set(["AS system", "AS system d.o.o.", "ASfix", "ASco", "Silvermate", "HAMMEX", "MUNGO", "B2B", "B2C", "OK"]);
export function zaPrevod(s) {
  const k = kljuc(s);
  if (k.length < 2 || k.length > 6000) return false;
  if (!/\p{L}{2}/u.test(k)) return false; // vsaj dve zaporedni črki
  // Samo velike črke: šifra ali kratica (ETA, CE, M8 × 60) se ne prevaja,
  // naziv artikla iz Vasca (PODLOŽKA NAVADNA DIN 125) pa se.
  if (!/\p{Ll}/u.test(k) && !(k.match(/\p{L}{4,}/gu) ?? []).some((b) => !VELIKE_ZNAMKE.has(b))) return false;
  if (SAMO_ZNAMKE.has(k)) return false;
  if (/^(https?:|mailto:|tel:|www\.)/i.test(k) || /^[\/#]\S*$/.test(k)) return false;
  if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(k)) return false; // e-pošta
  return true;
}

// Prevod z ohranjenimi robnimi presledki izvirnika.
export function obdrziRobove(izvirnik, prevod) {
  if (typeof prevod !== "string") return izvirnik;
  const zacetek = izvirnik.match(/^\s*/)[0];
  const konec = izvirnik.match(/\s*$/)[0];
  return zacetek + prevod + konec;
}

// Notranje povezave dobijo jezikovno predpono (/proizvodnja → /en/proizvodnja).
const BREZ_PREDPONE = ["/_next", "/slike", "/videi", "/api", "/admin", "/dokumenti", "/igra", "/mailing", "/polica", "/resitve/", "/aktualno/slike", "/hf-ref"];
export function potZJezikom(href, jezik) {
  if (!jezik || jezik === "sl" || typeof href !== "string") return href;
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  if (href === `/${jezik}` || href.startsWith(`/${jezik}/`) || href.startsWith(`/${jezik}?`) || href.startsWith(`/${jezik}#`)) return href;
  if (BREZ_PREDPONE.some((p) => href === p || href.startsWith(p.endsWith("/") ? p : p + "/"))) return href;
  const pot = href.split(/[?#]/)[0];
  if (/\.[a-z0-9]{2,5}$/i.test(pot)) return href; // datoteka (pdf, png, mp4 …)
  if (href === "/") return `/${jezik}`;
  if (href.startsWith("/?") || href.startsWith("/#")) return `/${jezik}${href.slice(1)}`;
  return `/${jezik}${href}`;
}

// Pot brez jezikovne predpone: /en/proizvodnja → /proizvodnja
export function brezJezika(pot) {
  for (const j of TUJI) {
    if (pot === `/${j}`) return "/";
    if (pot.startsWith(`/${j}/`)) return pot.slice(j.length + 1);
  }
  return pot;
}

// Lastnosti elementov, ki jih bralec vidi (poleg besedila).
export const VIDNE_LASTNOSTI = ["alt", "title", "placeholder", "aria-label", "label"];

// Ključi v podatkih, ki jih strežnik pošlje komponentam v brskalniku
// (npr. seznam izdelkov, kategorije v meniju). Samo ti se prevedejo.
export const KLJUCI_BESEDIL = new Set([
  "naziv", "opis", "naslov", "besedilo", "oznaka", "opomba", "kdo", "cta", "label", "podnaslov",
  "kratekOpis", "kratek_opis", "alt", "title", "placeholder", "tekst", "vsebina", "kraj", "vloga",
  "znacke", "lastnosti", "prednosti", "uporaba", "namen", "povzetek", "nadnaslov", "gumb", "napis",
  "kategorija_naziv", "kategorijaNaziv", "podlaga", "material", "pakiranje_opis", "vprasanje", "odgovor",
]);

// Besedilo, ki ga strežnik pošlje komponenti v brskalniku kot lastnost
// (npr. priloga="Fotografija ali risba (neobvezno)"): prevede se, če je
// videti kot stavek (vsaj dve besedi) in ni tehnična vrednost.
const TEHNICNE_LASTNOSTI = new Set(["className", "href", "src", "id", "name", "vir", "type", "variant", "slug", "sifra", "poster", "style", "kljuc", "key", "pot", "url", "povezava", "link", "action", "method", "lang", "jezik", "email", "telefon"]);
export function jeLastnostZaPrevod(ime, vrednost) {
  if (TEHNICNE_LASTNOSTI.has(ime) || typeof vrednost !== "string") return false;
  if (KLJUCI_BESEDIL.has(ime) || VIDNE_LASTNOSTI.includes(ime)) return zaPrevod(vrednost);
  const k = kljuc(vrednost);
  if (!k.includes(" ")) return false;
  if (k.split(" ").every((t) => /^[a-z0-9]+([-_:][a-z0-9]+)*$/.test(t))) return false; // CSS razredi
  return zaPrevod(k);
}

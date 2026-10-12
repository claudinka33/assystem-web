// Izračun cen iz Vasca za prikaz na strani.
// Vasco enote: C = cena za 100 kos, MIL = za 1000 kos, KOS/KOM = za kos,
// GRT/PAK = za pakiranje (vrečka, komplet). Cena v Vascu je VPC brez DDV.
export const DDV = 0.22;

// Poštnina (Pošta Slovenije) glede na vrednost blaga z DDV. Osebni prevzem je brezplačen.
// Razredi morajo biti usklajeni z lib/site.js -> trgovina.razredi (besedila na pravnih straneh).
export const POSTNINA_RAZREDI = [
  { do: 50, cena: 10 },
  { do: 100, cena: 5 },
];
export function izracunajPostnino(dostava, blagoBruto) {
  if (!dostava || dostava.koda === "osebno") return 0;
  for (const r of POSTNINA_RAZREDI) if (blagoBruto < r.do) return r.cena;
  return 0;
}

export function zaokrozi(x) {
  return Math.round(x * 100) / 100;
}

export function eur(x) {
  if (x === null || x === undefined || Number.isNaN(x)) return "—";
  return new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(x);
}

// Vrne { kos, neto, bruto, na100Neto, na100Bruto, opis } za eno prodajno enoto (pakiranje)
// ali null, če cene ni.
// cenaEnote: neobvezna cena na Vasco enoto (npr. B2B posebna cena); privzeto VPC iz Vasca.
export function cenaArtikla(a, cenaEnote) {
  const c = Number(cenaEnote ?? a?.cena_vasco);
  if (!c || c <= 0) return null;
  const e = String(a.vasco_enota ?? "").toUpperCase();
  const pak = Number(a.pakiranje) || 0;

  let naKos = null; // cena za 1 kos, če jo poznamo
  let neto, kos;
  if (e === "C" || e === "MIL") {
    naKos = c / (e === "C" ? 100 : 1000);
    kos = pak > 0 ? pak : 100;
    neto = naKos * kos;
  } else if (e === "GRT" || e === "PAK") {
    kos = pak > 0 ? pak : null;
    neto = c;
    naKos = kos ? c / kos : null;
  } else {
    // KOS, KOM, KG, M … — cena je za enoto
    kos = 1;
    neto = c;
    naKos = e === "KOS" || e === "KOM" ? c : null;
  }
  neto = zaokrozi(neto);
  const bruto = zaokrozi(neto * (1 + DDV));
  if (kos === 100) naKos = null; // pakiranje je že 100 kos — ne podvajamo
  return {
    kos,
    neto,
    bruto,
    na100Neto: naKos !== null && kos !== 1 ? zaokrozi(naKos * 100) : null,
    na100Bruto: naKos !== null && kos !== 1 ? zaokrozi(naKos * 100 * (1 + DDV)) : null,
  };
}

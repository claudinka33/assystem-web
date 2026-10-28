// Iskanje podjetja po davčni številki prek EU VIES (FURS podatki za SI zavezance za DDV). Samo strežnik.
import { normDavcna } from "@/lib/b2b";

const naslov = (v) => String(v ?? "").replace(/\s+/g, " ").trim();

// "ULICA 14, 3240 ŠMARJE PRI JELŠAH" -> { naslov, posta, kraj }
export function razcleniNaslov(surovo) {
  const deli = String(surovo ?? "")
    .split(/\n|,/)
    .map(naslov)
    .filter(Boolean);
  let posta = "";
  let kraj = "";
  const i = deli.findIndex((d) => /^\d{4}\s+\S/.test(d));
  if (i >= 0) {
    const m = deli[i].match(/^(\d{4})\s+(.+)$/);
    posta = m[1];
    kraj = m[2];
    deli.splice(i, 1);
  }
  return { naslov: deli.join(", "), posta, kraj };
}

const lepo = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/(^|[\s\-/(.])(\p{L})/gu, (_, a, b) => a + b.toUpperCase())
    .replace(/\bD\.O\.O\./gi, "d.o.o.")
    .replace(/\bS\.P\./gi, "s.p.")
    .replace(/\bD\.D\./gi, "d.d.");

export async function poisciPoDavcni(vnos) {
  const davcna = normDavcna(vnos);
  if (davcna.length !== 8) return { napaka: "Davčna mora imeti 8 številk (npr. SI12345678)." };
  try {
    const r = await fetch(`https://ec.europa.eu/taxation_customs/vies/rest-api/ms/SI/vat/${davcna}`, {
      headers: { accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) return { davcna, napaka: "Register trenutno ni dosegljiv — vpiši podatke ročno." };
    const j = await r.json();
    if (j.userError && j.userError !== "VALID") {
      if (j.userError === "INVALID") return { davcna, najdeno: false, napaka: "Podjetje s to davčno ni zavezanec za DDV — vpiši podatke ročno." };
      return { davcna, napaka: "Register trenutno ni dosegljiv — vpiši podatke ročno." };
    }
    if (!j.isValid) return { davcna, najdeno: false, napaka: "Podjetje s to davčno ni zavezanec za DDV — vpiši podatke ročno." };
    const n = razcleniNaslov(j.address);
    return {
      davcna,
      najdeno: true,
      podjetje: naslov(j.name) && naslov(j.name) !== "---" ? lepo(naslov(j.name)) : "",
      naslov: lepo(n.naslov),
      posta: n.posta,
      kraj: lepo(n.kraj),
    };
  } catch {
    return { davcna, napaka: "Register trenutno ni dosegljiv — vpiši podatke ročno." };
  }
}

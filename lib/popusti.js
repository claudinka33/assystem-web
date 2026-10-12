// Kode za popust: preverjanje in izračun. Samo strežnik.
// Popust se vedno izračuna na strežniku iz baze — brskalniku ne zaupamo.
import { supabaseAdmin } from "@/lib/supabase-server";
import { DDV, zaokrozi } from "@/lib/cene";

import { ZNAMKE as VSE_ZNAMKE, normZnamka, znamkaPoSifri } from "@/lib/znamke";

export const ZNAMKE = VSE_ZNAMKE;

// Znamka artikla: izdelek.znamka (vpis v adminu), sicer po šifri (lib/znamke.js).
export function znamkaArtikla(sifra, znamkaIzdelka) {
  return normZnamka(znamkaIzdelka) ?? znamkaPoSifri(sifra);
}

export const normKoda = (k) => String(k ?? "").trim().toUpperCase().replace(/\s+/g, "");

export async function najdiKodo(koda) {
  const k = normKoda(koda);
  if (!k) return null;
  const { data, error } = await supabaseAdmin().from("popust_kode").select("*").eq("koda", k).maybeSingle();
  if (error) return null;
  return data;
}

// Kategorije izdelkov (glavna + dodatne + vse nadrejene) za preverjanje kode na kategorijo.
async function kategorijeIzdelkov(izdelekIds) {
  const sb = supabaseAdmin();
  const [{ data: iz }, { data: dod }, { data: kat }] = await Promise.all([
    sb.from("izdelki").select("id, kategorija_id, znamka").in("id", izdelekIds),
    sb.from("izdelki_kategorije").select("izdelek_id, kategorija_id").in("izdelek_id", izdelekIds),
    sb.from("kategorije").select("id, nadrejena_id"),
  ]);
  const starsi = Object.fromEntries((kat ?? []).map((k) => [String(k.id), k.nadrejena_id ? String(k.nadrejena_id) : null]));
  const sVsemi = (id) => {
    const out = [];
    let x = id ? String(id) : null;
    for (let i = 0; x && i < 10; i++) {
      out.push(x);
      x = starsi[x];
    }
    return out;
  };
  const out = {};
  for (const i of iz ?? []) out[i.id] = { znamka: i.znamka ?? null, kategorije: new Set(sVsemi(i.kategorija_id)) };
  for (const d of dod ?? []) for (const k of sVsemi(d.kategorija_id)) out[d.izdelek_id]?.kategorije.add(k);
  return out;
}

/**
 * Izračun popusta.
 * vrstice: [{ artikel_id, sifra, vrstica_neto }]
 * Vrne { napaka } ali { koda, opis, popustNeto, popustBruto, poVrsticah: {artikel_id: neto}, brezplacnaDostava }
 */
export async function izracunajPopust(kodaVnos, vrstice, { b2b = false } = {}) {
  const koda = await najdiKodo(kodaVnos);
  if (!koda || !koda.aktivno) return { napaka: "Koda ne obstaja ali ni več veljavna." };
  const danes = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Ljubljana" });
  if (koda.velja_od && danes < koda.velja_od) return { napaka: "Koda še ne velja." };
  if (koda.velja_do && danes > koda.velja_do) return { napaka: "Koda je potekla." };
  if (koda.max_uporab && koda.uporabljeno >= koda.max_uporab) return { napaka: "Koda je že porabljena." };
  if (koda.kupci === "b2b" && !b2b) return { napaka: "Koda velja samo za poslovne (B2B) kupce." };
  if (koda.kupci === "b2c" && b2b) return { napaka: "Koda ne velja za B2B nakupe." };

  const blagoBruto = zaokrozi(vrstice.reduce((s, v) => s + Number(v.vrstica_neto), 0) * (1 + DDV));
  if (koda.min_znesek && blagoBruto + 0.001 < Number(koda.min_znesek))
    return { napaka: `Koda velja za nakupe nad ${Number(koda.min_znesek).toFixed(2).replace(".", ",")} € (z DDV).` };

  // katere vrstice so upravičene
  let upravicene = vrstice;
  if (koda.velja_za !== "trgovina") {
    const { data: art } = await supabaseAdmin()
      .from("artikli")
      .select("id, sifra, izdelek_id")
      .in("id", vrstice.map((v) => v.artikel_id));
    const poArt = Object.fromEntries((art ?? []).map((a) => [a.id, a]));
    const info = await kategorijeIzdelkov([...new Set((art ?? []).map((a) => a.izdelek_id).filter(Boolean))]);
    upravicene = vrstice.filter((v) => {
      const a = poArt[v.artikel_id];
      if (!a) return false;
      const i = info[a.izdelek_id] ?? { znamka: null, kategorije: new Set() };
      if (koda.velja_za === "artikel") return normKoda(a.sifra) === normKoda(koda.artikel_sifra);
      if (koda.velja_za === "znamka") return znamkaArtikla(a.sifra, i.znamka).toLowerCase() === String(koda.znamka ?? "").toLowerCase();
      if (koda.velja_za === "kategorija") return i.kategorije.has(String(koda.kategorija_id));
      return false;
    });
  }
  if (!upravicene.length) return { napaka: "Koda ne velja za izdelke v košarici." };

  const osnova = upravicene.reduce((s, v) => s + Number(v.vrstica_neto), 0);
  let popustNeto = 0;
  if (koda.tip === "odstotek") popustNeto = osnova * Math.min(100, Math.max(0, Number(koda.vrednost))) / 100;
  if (koda.tip === "znesek") popustNeto = Math.min(osnova, Number(koda.vrednost) / (1 + DDV));
  popustNeto = zaokrozi(popustNeto);

  // razdelitev po vrsticah (za Vasco: nižja cena na postavki)
  const poVrsticah = {};
  let razdeljeno = 0;
  upravicene.forEach((v, i) => {
    const del = i === upravicene.length - 1 ? zaokrozi(popustNeto - razdeljeno) : zaokrozi((popustNeto * Number(v.vrstica_neto)) / osnova);
    poVrsticah[v.artikel_id] = del;
    razdeljeno = zaokrozi(razdeljeno + del);
  });

  const opis =
    koda.tip === "dostava"
      ? "Brezplačna dostava"
      : koda.tip === "odstotek"
        ? `${Number(koda.vrednost)} % popusta${koda.velja_za === "trgovina" ? "" : " na izbrane izdelke"}`
        : `${Number(koda.vrednost).toFixed(2).replace(".", ",")} € popusta`;
  return {
    koda: koda.koda,
    id: koda.id,
    opis,
    popustNeto,
    popustBruto: zaokrozi(popustNeto * (1 + DDV)),
    poVrsticah,
    brezplacnaDostava: koda.tip === "dostava",
  };
}

// Po oddanem naročilu: +1 uporaba.
export async function zabeleziUporabo(id) {
  const sb = supabaseAdmin();
  const { data } = await sb.from("popust_kode").select("uporabljeno").eq("id", id).single();
  if (data) await sb.from("popust_kode").update({ uporabljeno: (data.uporabljeno ?? 0) + 1 }).eq("id", id);
}

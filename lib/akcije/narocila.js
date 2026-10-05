"use server";

import { supabaseAdmin } from "@/lib/supabase-server";
import { cenaArtikla, zaokrozi, DDV } from "@/lib/cene";

const NACINI = ["predracun", "povzetje"];

export async function pridobiDostave() {
  const { data } = await supabaseAdmin()
    .from("dostava")
    .select("id, naziv, koda, cena, brezplacno_nad")
    .eq("aktivno", true)
    .order("vrstni_red");
  const osebno = { id: 0, naziv: "Osebni prevzem — Šmarje pri Jelšah", koda: "osebno", cena: 0, brezplacno_nad: null };
  return [osebno, ...(data ?? [])];
}

// B2C naročilo iz košarice. Cene in dostavo izračuna strežnik iz baze.
export async function oddajNarocilo(vnos) {
  const sb = supabaseAdmin();
  const p = vnos?.podatki ?? {};
  const postavke = (vnos?.postavke ?? []).filter((x) => x.id && x.kolicina > 0).slice(0, 200);

  const obvezno = ["ime", "email", "telefon", "ulica", "posta", "kraj"];
  if (obvezno.some((k) => !String(p[k] ?? "").trim())) return { napaka: "Izpolni vsa obvezna polja." };
  if (!/^\S+@\S+\.\S+$/.test(p.email)) return { napaka: "E-naslov ni pravilen." };
  if (!postavke.length) return { napaka: "Košarica je prazna." };
  if (!NACINI.includes(p.placilo)) return { napaka: "Izberi način plačila." };
  if (!p.pogoji) return { napaka: "Potrdi splošne pogoje." };

  const { data: art } = await sb
    .from("artikli")
    .select("id, sifra, naziv, dimenzija, pakiranje, cena_vasco, vasco_enota, objavljeno")
    .in("id", postavke.map((x) => x.id));
  const poId = Object.fromEntries((art ?? []).map((a) => [a.id, a]));

  const vrstice = [];
  for (const x of postavke) {
    const a = poId[x.id];
    const c = a && a.objavljeno ? cenaArtikla(a) : null;
    if (!c) return { napaka: `Artikla ${a?.sifra ?? x.id} trenutno ni mogoče naročiti prek spleta.` };
    const kol = Math.min(Math.max(1, Math.floor(x.kolicina)), 9999);
    vrstice.push({
      artikel_id: a.id,
      sifra: a.sifra,
      naziv: `${a.naziv}${a.dimenzija ? " " + a.dimenzija : ""}`,
      kolicina: kol,
      enota: c.kos > 1 ? `pak (${c.kos} kos)` : "kos",
      cena_neto: c.neto,
      ddv_stopnja: DDV * 100,
      vrstica_neto: zaokrozi(c.neto * kol),
    });
  }

  const dostave = await pridobiDostave();
  const d = dostave.find((x) => String(x.id) === String(p.dostava)) ?? dostave[0];
  if (p.placilo === "povzetje" && d.koda === "osebno") return { napaka: "Plačilo po povzetju je mogoče samo z dostavo." };

  const neto = zaokrozi(vrstice.reduce((s, v) => s + v.vrstica_neto, 0));
  const brutoBlago = zaokrozi(neto * (1 + DDV));
  const postnina = d.brezplacno_nad && brutoBlago >= Number(d.brezplacno_nad) ? 0 : Number(d.cena) || 0;
  const ddv = zaokrozi(neto * DDV + (postnina - postnina / (1 + DDV)));
  const skupaj = zaokrozi(brutoBlago + postnina);

  const naslov = { naziv: p.podjetje || null, ime: p.ime, ulica: p.ulica, posta: p.posta, kraj: p.kraj, drzava: p.drzava || "SI", telefon: p.telefon };
  const { data: nar, error } = await sb
    .from("narocila")
    .insert({
      tip: "B2C",
      kontakt_ime: p.ime,
      kontakt_email: p.email,
      kontakt_telefon: p.telefon,
      naslov_racun: naslov,
      naslov_dostava: naslov,
      neto,
      ddv,
      postnina,
      popust: 0,
      skupaj,
      valuta: "EUR",
      nacin_placila: p.placilo,
      status_placila: "neplačano",
      nacin_dostave: d.naziv,
      status: "novo",
      opomba_kupca: p.opomba || null,
    })
    .select("id, stevilka")
    .single();
  if (error || !nar) return { napaka: "Naročila ni bilo mogoče shraniti. Poskusi znova ali nas pokliči." };

  let stevilka = nar.stevilka;
  if (!stevilka) {
    stevilka = `SN-${new Date().getFullYear()}-${String(nar.id).padStart(5, "0")}`;
    await sb.from("narocila").update({ stevilka }).eq("id", nar.id);
  }
  await sb.from("narocilo_postavke").insert(vrstice.map((v) => ({ ...v, narocilo_id: nar.id })));

  return { stevilka, skupaj, placilo: p.placilo };
}

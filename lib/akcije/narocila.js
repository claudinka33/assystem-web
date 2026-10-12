"use server";

import { supabaseAdmin } from "@/lib/supabase-server";
import { cenaArtikla, zaokrozi, DDV, izracunajPostnino } from "@/lib/cene";
import { posljiPotrdila } from "@/lib/narocila-potrdila";
import { trenutniB2B, jeAktiven, posebneCene, cenaPakiranjaZaKupca } from "@/lib/b2b";
import { stripeVklopljen, paypalVklopljen, stripeSeja, paypalNarocilo } from "@/lib/placila";

// Načini plačila, ki so trenutno na voljo (kartica/PayPal samo, ko so ključi v Vercelu).
async function naciniNaVoljo() {
  return ["predracun", "povzetje", ...(stripeVklopljen() ? ["kartica"] : []), ...(paypalVklopljen() ? ["paypal"] : [])];
}
export async function pridobiPlacila() {
  return naciniNaVoljo();
}
const SPLETNO = ["kartica", "paypal"];

export async function pridobiDostave() {
  const { data } = await supabaseAdmin()
    .from("dostava")
    .select("id, naziv, koda, cena, brezplacno_nad")
    .eq("aktivno", true)
    .order("vrstni_red");
  // Osebni prevzem prepoznamo po nazivu; če ga v tabeli ni, ga dodamo.
  const vrstice = (data ?? []).map((d) => ({ ...d, koda: /prevzem/i.test(d.naziv) ? "osebno" : d.koda }));
  if (vrstice.some((d) => d.koda === "osebno")) return vrstice;
  return [...vrstice, { id: 0, naziv: "Osebni prevzem — Šmarje pri Jelšah", koda: "osebno", cena: 0, brezplacno_nad: null }];
}

// B2C naročilo iz košarice. Cene in dostavo izračuna strežnik iz baze.
export async function oddajNarocilo(vnos) {
  const sb = supabaseAdmin();
  const p = vnos?.podatki ?? {};
  const postavke = (vnos?.postavke ?? []).filter((x) => x.id && x.kolicina > 0).slice(0, 200);

  // Prijavljen aktiven B2B kupec: cene po njegovem ceniku, plačilo na račun, naslov iz Vasca.
  const kupec = await trenutniB2B();
  const b2b = jeAktiven(kupec);
  if (b2b) {
    if (kupec.ustavljena_prodaja) return { napaka: "Spletno naročanje je za vaše podjetje ustavljeno. Pokličite nas." };
    p.placilo = "racun";
  }

  const obvezno = b2b ? ["ime", "email", "telefon"] : ["ime", "email", "telefon", "ulica", "posta", "kraj"];
  if (obvezno.some((k) => !String(p[k] ?? "").trim())) return { napaka: "Izpolni vsa obvezna polja." };
  if (!/^\S+@\S+\.\S+$/.test(p.email)) return { napaka: "E-naslov ni pravilen." };
  if (!postavke.length) return { napaka: "Košarica je prazna." };
  if (!b2b && !(await naciniNaVoljo()).includes(p.placilo)) return { napaka: "Izberi način plačila." };
  if (!p.pogoji) return { napaka: "Potrdi splošne pogoje." };

  const { data: art } = await sb
    .from("artikli")
    .select("id, sifra, naziv, dimenzija, pakiranje, cena_vasco, vasco_enota, objavljeno")
    .in("id", postavke.map((x) => x.id));
  const poId = Object.fromEntries((art ?? []).map((a) => [a.id, a]));
  const posebne = b2b ? await posebneCene(kupec.vasco_partner, (art ?? []).map((a) => a.sifra)) : null;

  const vrstice = [];
  for (const x of postavke) {
    const a = poId[x.id];
    const c = a && a.objavljeno ? (b2b ? cenaPakiranjaZaKupca(a, kupec, posebne) : cenaArtikla(a)) : null;
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
  const postnina = izracunajPostnino(d, brutoBlago);
  const ddv = zaokrozi(neto * DDV + (postnina - postnina / (1 + DDV)));
  const skupaj = zaokrozi(brutoBlago + postnina);

  let naslov = { naziv: p.podjetje || null, ime: p.ime, ulica: p.ulica, posta: p.posta, kraj: p.kraj, drzava: p.drzava || "SI", telefon: p.telefon };
  let naslovDostava = naslov;
  let prodajalna = null;
  const b2bPolja = {};
  if (b2b) {
    naslov = { naziv: kupec.vasco_naziv || kupec.podjetje, ime: p.ime, ulica: kupec.vasco_naslov || kupec.naslov, posta: kupec.vasco_posta || `${kupec.posta ?? ""} ${kupec.kraj ?? ""}`.trim(), kraj: "", drzava: "SI", telefon: p.telefon, davcna: kupec.davcna };
    naslovDostava = naslov;
    if (d.koda !== "osebno" && p.prodajalna) {
      const { data: pr } = await sb
        .from("b2b_prodajalne")
        .select("sifra, naziv, naziv2, naslov, posta")
        .eq("vasco_partner", kupec.vasco_partner)
        .eq("sifra", Number(p.prodajalna))
        .maybeSingle();
      if (pr) {
        prodajalna = pr.sifra;
        naslovDostava = { naziv: pr.naziv2 || pr.naziv, ime: p.ime, ulica: pr.naslov, posta: pr.posta, kraj: "", drzava: "SI", telefon: p.telefon };
      }
    }
    Object.assign(b2bPolja, { b2b_kupec_id: kupec.id, vasco_partner: kupec.vasco_partner, prodajalna });
  }
  const opomba = [p.narocilnica ? `Naročilnica kupca: ${String(p.narocilnica).slice(0, 40)}` : "", p.opomba || ""].filter(Boolean).join("\n") || null;
  const { data: nar, error } = await sb
    .from("narocila")
    .insert({
      ...b2bPolja,
      tip: b2b ? "B2B" : "B2C",
      kontakt_ime: p.ime,
      kontakt_email: p.email,
      kontakt_telefon: p.telefon,
      naslov_racun: naslov,
      naslov_dostava: naslovDostava,
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
      opomba_kupca: opomba,
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

  // Kartica / PayPal: potrdilo gre šele, ko je plačilo potrjeno (webhook ali vrnitev s plačila).
  if (SPLETNO.includes(p.placilo)) {
    try {
      const pl = await zacniPlacilo({ id: nar.id, stevilka, skupaj, kontakt_email: p.email, nacin_placila: p.placilo });
      return { stevilka, skupaj, placilo: p.placilo, preusmeritev: pl.url };
    } catch (e) {
      console.error("Začetek spletnega plačila ni uspel:", e?.message);
      return { napaka: `Naročilo ${stevilka} je shranjeno, plačila pa ni bilo mogoče začeti. Pokličite nas ali izberite plačilo po predračunu.` };
    }
  }

  await posljiPotrdila(nar.id);
  return { stevilka, skupaj, placilo: p.placilo };
}

async function zacniPlacilo(n) {
  const pl = n.nacin_placila === "kartica" ? await stripeSeja(n) : await paypalNarocilo(n);
  await supabaseAdmin().from("narocila").update({ placilo_ref: pl.ref }).eq("id", n.id);
  return pl;
}

// Ponovni poskus plačila (stran /blagajna/preklic). Samo za neplačana spletna plačila.
export async function ponovnoPlacaj(stevilka) {
  const { data: n } = await supabaseAdmin()
    .from("narocila")
    .select("id, stevilka, skupaj, kontakt_email, nacin_placila, status_placila, status")
    .eq("stevilka", String(stevilka ?? ""))
    .single();
  if (!n || !SPLETNO.includes(n.nacin_placila)) return { napaka: "Naročila ni mogoče najti." };
  if (n.status_placila === "plačano") return { napaka: "Naročilo je že plačano." };
  if (n.status === "preklicano") return { napaka: "Naročilo je preklicano." };
  try {
    return { preusmeritev: (await zacniPlacilo(n)).url };
  } catch (e) {
    return { napaka: "Plačila trenutno ni mogoče začeti. Pokličite nas." };
  }
}

"use server";

import { supabaseAdmin } from "@/lib/supabase-server";
import { Resend } from "resend";
import { cenaArtikla, zaokrozi, DDV, eur } from "@/lib/cene";

const PRODAJA = process.env.EMAIL_PREJEMNIK || "prodaja@as-system.si";
const POSILJATELJ = process.env.EMAIL_POSILJATELJ || "splet@assystem.si";
const PLACILA = { predracun: "Po predračunu", povzetje: "Po povzetju" };
const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

// Potrdilo kupcu + obvestilo prodaji. Brez RESEND_API_KEY se nič ne pošlje (naročilo je vseeno shranjeno).
async function posljiPotrdila({ stevilka, p, naslov, vrstice, neto, ddv, postnina, skupaj, dostava }) {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) return;
  const tabela = `
    <table style="font-family:Arial;font-size:14px;border-collapse:collapse;width:100%;">
      <tr style="background:#3f4140;color:#fff;"><th align="left" style="padding:6px">Šifra</th><th align="left" style="padding:6px">Artikel</th><th align="right" style="padding:6px">Kol.</th><th align="right" style="padding:6px">Znesek z DDV</th></tr>
      ${vrstice.map((v) => `<tr style="border-bottom:1px solid #ddd;"><td style="padding:6px">${esc(v.sifra)}</td><td style="padding:6px">${esc(v.naziv)}</td><td align="right" style="padding:6px">${v.kolicina} ${esc(v.enota)}</td><td align="right" style="padding:6px">${eur(v.vrstica_neto * (1 + DDV))}</td></tr>`).join("")}
      <tr><td colspan="3" align="right" style="padding:6px">Dostava (${esc(dostava)})</td><td align="right" style="padding:6px">${eur(postnina)}</td></tr>
      <tr><td colspan="3" align="right" style="padding:6px">Osnova brez DDV / DDV</td><td align="right" style="padding:6px">${eur(neto)} / ${eur(ddv)}</td></tr>
      <tr><td colspan="3" align="right" style="padding:6px"><b>Skupaj za plačilo</b></td><td align="right" style="padding:6px"><b>${eur(skupaj)}</b></td></tr>
    </table>`;
  const podatki = `
    <p style="font-family:Arial;font-size:14px;">
      <b>${esc(naslov.naziv || naslov.ime)}</b><br>${naslov.naziv ? esc(naslov.ime) + "<br>" : ""}${esc(naslov.ulica)}<br>${esc(naslov.posta)} ${esc(naslov.kraj)}<br>
      ${esc(p.email)} · ${esc(p.telefon)}<br>
      Plačilo: ${PLACILA[p.placilo] ?? esc(p.placilo)} · Dostava: ${esc(dostava)}
    </p>${p.opomba ? `<p style="font-family:Arial;font-size:14px;"><i>Opomba: ${esc(p.opomba)}</i></p>` : ""}`;
  const navodilo =
    p.placilo === "predracun"
      ? "Predračun vam pošljemo v ločenem sporočilu. Naročilo odpremimo po prejemu plačila."
      : "Naročilo plačate ob prevzemu paketa.";
  try {
    const resend = new Resend(kljuc);
    await resend.emails.send({
      from: `AS system <${POSILJATELJ}>`,
      to: [p.email],
      replyTo: PRODAJA,
      subject: `Potrdilo naročila ${stevilka} — AS system`,
      html: `<div style="max-width:640px">
        <h2 style="font-family:Arial;color:#C8102E;">Hvala za naročilo!</h2>
        <p style="font-family:Arial;font-size:14px;">Prejeli smo vaše naročilo <b>${esc(stevilka)}</b>. ${navodilo}</p>
        ${tabela}${podatki}
        <p style="font-family:Arial;font-size:13px;color:#6e7276;">AS system d.o.o. · Šmarje pri Jelšah · prodaja@as-system.si</p></div>`,
    });
    await resend.emails.send({
      from: `AS system splet <${POSILJATELJ}>`,
      to: [PRODAJA],
      replyTo: p.email,
      subject: `Novo spletno naročilo ${stevilka} — ${naslov.naziv || naslov.ime} (${eur(skupaj)})`,
      html: `<h2 style="font-family:Arial;color:#3f4140;">Novo spletno naročilo ${esc(stevilka)}</h2>${podatki}${tabela}`,
    });
  } catch (e) {
    console.error("Pošiljanje potrdila naročila ni uspelo:", e?.message);
  }
}

const NACINI = ["predracun", "povzetje"];

export async function pridobiDostave() {
  const { data } = await supabaseAdmin()
    .from("dostava")
    .select("id, naziv, koda, cena, brezplacno_nad")
    .eq("aktivno", true)
    .order("vrstni_red");
  // Osebni prevzem prepoznamo po nazivu; če ga v tabeli ni, ga dodamo.
  const vrstice = (data ?? []).map((d) => ({ ...d, koda: /prevzem/i.test(d.naziv) ? "osebno" : d.koda }));
  if (vrstice.some((d) => d.koda === "osebno")) return vrstice;
  return [{ id: 0, naziv: "Osebni prevzem — Šmarje pri Jelšah", koda: "osebno", cena: 0, brezplacno_nad: null }, ...vrstice];
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
  await posljiPotrdila({ stevilka, p, naslov, vrstice, neto, ddv, postnina, skupaj, dostava: d.naziv });

  return { stevilka, skupaj, placilo: p.placilo };
}

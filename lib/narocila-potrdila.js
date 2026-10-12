// Potrdila naročil (Resend) in označevanje plačila. Samo strežnik.
import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";
import { DDV, eur } from "@/lib/cene";
import { site } from "@/lib/site";

const PRODAJA = "info@as-system.si"; // vsa obvestila na info@
const POSILJATELJ = process.env.EMAIL_POSILJATELJ || "splet@assystem.si";
export const PLACILA_NAZIVI = {
  predracun: "Po predračunu",
  povzetje: "Po povzetju",
  kartica: "Plačilna kartica",
  paypal: "PayPal",
  racun: "Na račun",
};
const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
const jeOsebno = (n) => /prevzem/i.test(n.nacin_dostave ?? "");

function navodilo(n) {
  const prevzem = jeOsebno(n)
    ? ` Ko bo naročilo pripravljeno, vas obvestimo — prevzem je na naslovu ${site.lokacije[0].naslov} (pon–pet 7.00–15.00).`
    : "";
  if (n.nacin_placila === "predracun")
    return `Znesek <b>${eur(Number(n.skupaj))}</b> nakažite na TRR <b>${esc(site.podjetje.trr)}</b>, prejemnik ${esc(site.podjetje.polnoIme)}, sklic <b>${esc(n.stevilka)}</b>. Predračun vam pošljemo tudi v ločenem sporočilu. Naročilo ${jeOsebno(n) ? "pripravimo" : "odpremimo"} po prejemu plačila.${prevzem}`;
  if (n.nacin_placila === "povzetje") return `Naročilo plačate ob prevzemu paketa. Ko ga odpošljemo, vas obvestimo.`;
  if (n.nacin_placila === "racun")
    return `Račun prejmete z blagom${n._rok ? ` (rok plačila ${n._rok} dni)` : ""}. ${jeOsebno(n) ? "" : "Ko naročilo odpošljemo, vas obvestimo."}${prevzem}`;
  return `Plačilo (${PLACILA_NAZIVI[n.nacin_placila] ?? n.nacin_placila}) smo prejeli. ${jeOsebno(n) ? "" : "Ko naročilo odpošljemo, vas obvestimo."}${prevzem}`;
}

// Pošlje potrdilo kupcu in obvestilo prodaji za shranjeno naročilo.
export async function posljiPotrdila(narociloId) {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) return;
  const sb = supabaseAdmin();
  const { data: n } = await sb
    .from("narocila")
    .select("*, narocilo_postavke(sifra, naziv, kolicina, enota, vrstica_neto)")
    .eq("id", narociloId)
    .single();
  if (!n) return;
  if (n.b2b_kupec_id) {
    const { data: k } = await sb.from("b2b_kupci").select("rok_placila").eq("id", n.b2b_kupec_id).maybeSingle();
    n._rok = k?.rok_placila;
  }
  const vrstice = n.narocilo_postavke ?? [];
  const a = n.naslov_dostava ?? {};
  const tabela = `
    <table style="font-family:Arial;font-size:14px;border-collapse:collapse;width:100%;">
      <tr style="background:#3f4140;color:#fff;"><th align="left" style="padding:6px">Šifra</th><th align="left" style="padding:6px">Artikel</th><th align="right" style="padding:6px">Kol.</th><th align="right" style="padding:6px">Znesek z DDV</th></tr>
      ${vrstice.map((v) => `<tr style="border-bottom:1px solid #ddd;"><td style="padding:6px">${esc(v.sifra)}</td><td style="padding:6px">${esc(v.naziv)}</td><td align="right" style="padding:6px">${v.kolicina} ${esc(v.enota)}</td><td align="right" style="padding:6px">${eur(Number(v.vrstica_neto) * (1 + DDV))}</td></tr>`).join("")}
      ${Number(n.popust) > 0 ? `<tr><td colspan="3" align="right" style="padding:6px">Popust${n.popust_koda ? ` (koda ${esc(n.popust_koda)})` : ""}</td><td align="right" style="padding:6px;color:#C8102E">−${eur(Number(n.popust))}</td></tr>` : ""}
      <tr><td colspan="3" align="right" style="padding:6px">Dostava (${esc(n.nacin_dostave)})</td><td align="right" style="padding:6px">${eur(Number(n.postnina))}</td></tr>
      <tr><td colspan="3" align="right" style="padding:6px">Osnova brez DDV / DDV</td><td align="right" style="padding:6px">${eur(Number(n.neto))} / ${eur(Number(n.ddv))}</td></tr>
      <tr><td colspan="3" align="right" style="padding:6px"><b>Skupaj</b></td><td align="right" style="padding:6px"><b>${eur(Number(n.skupaj))}</b></td></tr>
    </table>`;
  const podatki = `
    <p style="font-family:Arial;font-size:14px;">
      <b>${esc(a.naziv || a.ime)}</b><br>${a.naziv ? esc(a.ime) + "<br>" : ""}${esc(a.ulica)}<br>${esc(a.posta)} ${esc(a.kraj)}<br>
      ${esc(n.kontakt_email)} · ${esc(n.kontakt_telefon)}<br>
      Plačilo: ${esc(PLACILA_NAZIVI[n.nacin_placila] ?? n.nacin_placila)} (${esc(n.status_placila)}) · Dostava: ${esc(n.nacin_dostave)}
    </p>${n.opomba_kupca ? `<p style="font-family:Arial;font-size:14px;"><i>Opomba: ${esc(n.opomba_kupca)}</i></p>` : ""}`;
  try {
    const resend = new Resend(kljuc);
    await resend.emails.send({
      from: `AS system <${POSILJATELJ}>`,
      to: [n.kontakt_email],
      replyTo: PRODAJA,
      subject: `Potrdilo naročila ${n.stevilka} — AS system`,
      html: `<div style="max-width:640px">
        <h2 style="font-family:Arial;color:#C8102E;">Hvala za naročilo!</h2>
        <p style="font-family:Arial;font-size:14px;">Prejeli smo vaše naročilo <b>${esc(n.stevilka)}</b>. ${navodilo(n)}</p>
        ${tabela}${podatki}
        <p style="font-family:Arial;font-size:13px;color:#6e7276;">AS system d.o.o. · ${esc(site.lokacije[0].naslov)} · ${esc(site.telefon)} · ${esc(PRODAJA)}</p></div>`,
    });
    await resend.emails.send({
      from: `AS system splet <${POSILJATELJ}>`,
      to: [PRODAJA],
      replyTo: n.kontakt_email,
      subject: `Novo spletno naročilo ${n.stevilka} — ${a.naziv || a.ime} (${eur(Number(n.skupaj))}, ${PLACILA_NAZIVI[n.nacin_placila] ?? n.nacin_placila})`,
      html: `<h2 style="font-family:Arial;color:#3f4140;">Novo spletno naročilo ${esc(n.stevilka)}</h2>${podatki}${tabela}`,
    });
  } catch (e) {
    console.error("Pošiljanje potrdila naročila ni uspelo:", e?.message);
  }
}

// Označi naročilo kot plačano (samo prvič) in pošlje potrdila. Varno za večkratni klic
// (webhook + vrnitev kupca na stran).
export async function oznaciPlacano(narociloId, { ref, znesek, nacin }) {
  const sb = supabaseAdmin();
  const { data: n } = await sb.from("narocila").select("id, skupaj, status_placila, nacin_placila").eq("id", narociloId).single();
  if (!n) return false;
  if (n.status_placila === "plačano") return true;
  if (nacin && n.nacin_placila !== nacin) return false;
  if (Number(znesek) + 0.01 < Number(n.skupaj)) {
    console.error(`Naročilo ${narociloId}: plačan znesek ${znesek} je manjši od ${n.skupaj}`);
    return false;
  }
  const zdaj = new Date().toISOString();
  let { data: spremenjeno, error } = await sb
    .from("narocila")
    .update({ status_placila: "plačano", status: "potrjeno", placilo_ref: ref ?? null, placano_ob: zdaj, posodobljeno: zdaj })
    .eq("id", narociloId)
    .neq("status_placila", "plačano")
    .select("id");
  if (error) {
    // stolpca placilo_ref/placano_ob še ne obstajata (SQL ni zagnan) -> referenco v interno opombo
    ({ data: spremenjeno } = await sb
      .from("narocila")
      .update({ status_placila: "plačano", status: "potrjeno", opomba_interna: `Plačilo ${ref ?? ""}`, posodobljeno: zdaj })
      .eq("id", narociloId)
      .neq("status_placila", "plačano")
      .select("id"));
  }
  if (spremenjeno?.length) await posljiPotrdila(narociloId);
  return true;
}

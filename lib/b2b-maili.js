// E-pošta za B2B račune (Resend). Samo strežnik.
import { Resend } from "resend";
import { site } from "@/lib/site";
import { osnovaUrl } from "@/lib/b2b";
import { sestaviHtml, zadevaIz } from "@/lib/email-predloge";
import { naloziPredlogo } from "@/lib/email-predloge-streznik";

const PRODAJA = "info@as-system.si"; // vsa obvestila na info@
const POSILJATELJ = process.env.EMAIL_POSILJATELJ || "splet@assystem.si";
const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

function ovoj(naslov, vsebina) {
  return `<div style="max-width:600px;font-family:Arial,sans-serif;font-size:15px;color:#1a1d21;">
    <h2 style="color:#C8102E;margin:0 0 16px;">${naslov}</h2>
    ${vsebina}
    <p style="font-size:13px;color:#6e7276;margin-top:28px;">AS system d.o.o. · ${esc(site.lokacije[0].naslov)} · ${esc(site.telefon)} · ${esc(PRODAJA)}</p>
  </div>`;
}
const gumb = (href, besedilo) =>
  `<p style="margin:22px 0;"><a href="${href}" style="background:#C8102E;color:#fff;padding:12px 22px;text-decoration:none;font-weight:bold;display:inline-block;">${besedilo}</a></p>`;

async function poslji(sporocilo) {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) throw new Error("RESEND_API_KEY ni nastavljen");
  const { data, error } = await new Resend(kljuc).emails.send({ from: `AS system <${POSILJATELJ}>`, replyTo: PRODAJA, ...sporocilo });
  if (error) throw new Error(error.message);
  return data?.id ?? null;
}

// Sporočilo iz predloge (Admin → E-mailing → Sporočila strankam).
async function izPredloge(kljuc, { to, vrednosti, povezava, vmes, html, ...ostalo }) {
  const t = await naloziPredlogo(kljuc);
  return poslji({ to, subject: zadevaIz(t, vrednosti), html: sestaviHtml(t, { vrednosti, povezava, vmes, html }), ...ostalo });
}

export async function mailPotrditev(email, tokenHash) {
  const povezava = `${osnovaUrl()}/b2b/potrdi?token_hash=${encodeURIComponent(tokenHash)}&type=signup`;
  await izPredloge("b2b_potrditev", { to: [email], vrednosti: { email }, povezava });
}

export async function mailPonastavitev(email, tokenHash) {
  const povezava = `${osnovaUrl()}/b2b/potrdi?token_hash=${encodeURIComponent(tokenHash)}&type=recovery`;
  await izPredloge("b2b_ponastavitev", { to: [email], vrednosti: { email }, povezava });
}

// Povabilo, ki ga pošlje AS system (komercialist v administraciji): potrdi e-naslov in nastavi geslo.
export async function mailPovabilo(kupec, tokenHash, tip = "invite") {
  const povezava = `${osnovaUrl()}/b2b/potrdi?token_hash=${encodeURIComponent(tokenHash)}&type=${tip}&nov=1`;
  await izPredloge("b2b_povabilo", {
    to: [kupec.email],
    vrednosti: { ime: kupec.ime || "", podjetje: kupec.podjetje, email: kupec.email },
    povezava,
  });
}

export async function mailAktiviran(kupec) {
  await izPredloge("b2b_aktiviran", {
    to: [kupec.email],
    vrednosti: {
      ime: kupec.ime || "",
      podjetje: kupec.vasco_naziv || kupec.podjetje,
      email: kupec.email,
      rok_placila: kupec.rok_placila ? `z rokom plačila ${kupec.rok_placila} dni` : "",
    },
    povezava: `${osnovaUrl()}/b2b`,
  });
}

export async function mailProdajiNovaRegistracija(kupec) {
  await poslji({
    to: site.obvestilaProdaja,
    replyTo: kupec.email,
    subject: `Nova B2B registracija: ${kupec.podjetje} (${kupec.davcna})`,
    html: ovoj(
      "Nova B2B registracija",
      `<p><b>${esc(kupec.podjetje)}</b>, davčna ${esc(kupec.davcna)}<br>${esc(kupec.ime)} · ${esc(kupec.email)} · ${esc(kupec.telefon)}<br>${esc(kupec.naslov)} ${esc(kupec.posta)} ${esc(kupec.kraj)}${kupec.poslovalnica_vnos ? `<br>Poslovalnica (vpisal kupec): <b>${esc(kupec.poslovalnica_vnos)}</b>` : ""}</p>
       <p>Obstoječe partnerje (ujemanje davčne in e-domene) sistem odobri sam. Ostale odobrite v administraciji.</p>
       ${gumb(`${osnovaUrl()}/admin/b2b`, "Odpri B2B kupce")}`
    ),
  });
}

// Vabilo zaposlenemu v administracijo spletne strani (Sistem → Uporabniki).
export async function mailAdminVabilo({ email, ime, deli = [], povabil }) {
  const vmes = deli.length
    ? `<ul style="margin:0 0 12px;padding-left:20px;">${deli.map((d) => `<li>${esc(d)}</li>`).join("")}</ul>`
    : "<p><i>Dostop do posameznih delov ti bo še dodeljen.</i></p>";
  return await izPredloge("admin_vabilo", {
    to: [email],
    vrednosti: { ime: ime ? ime.split(" ")[0] : "", povabil: povabil || "AS system", email },
    povezava: `${osnovaUrl()}/admin/prijava`,
    vmes,
  });
}

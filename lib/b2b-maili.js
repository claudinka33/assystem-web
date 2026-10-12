// E-pošta za B2B račune (Resend). Samo strežnik.
import { Resend } from "resend";
import { site } from "@/lib/site";
import { osnovaUrl } from "@/lib/b2b";

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
  const { error } = await new Resend(kljuc).emails.send({ from: `AS system <${POSILJATELJ}>`, replyTo: PRODAJA, ...sporocilo });
  if (error) throw new Error(error.message);
}

export async function mailPotrditev(email, tokenHash) {
  const link = `${osnovaUrl()}/b2b/potrdi?token_hash=${encodeURIComponent(tokenHash)}&type=signup`;
  await poslji({
    to: [email],
    subject: "Potrdite e-naslov — B2B dostop AS system",
    html: ovoj(
      "Potrdite svoj e-naslov",
      `<p>Hvala za registracijo v B2B spletno trgovino AS system. Za nadaljevanje potrdite svoj e-naslov:</p>
       ${gumb(link, "Potrdi e-naslov")}
       <p>Po potrditvi preverimo podatke vašega podjetja. Obstoječi partnerji praviloma dobijo dostop do svojih cen v nekaj minutah, nove partnerje odobrimo v enem delovnem dnevu.</p>
       <p style="font-size:13px;color:#6e7276;">Če se niste registrirali vi, to sporočilo prezrite.</p>`
    ),
  });
}

export async function mailPonastavitev(email, tokenHash) {
  const link = `${osnovaUrl()}/b2b/potrdi?token_hash=${encodeURIComponent(tokenHash)}&type=recovery`;
  await poslji({
    to: [email],
    subject: "Novo geslo — B2B dostop AS system",
    html: ovoj(
      "Nastavite novo geslo",
      `<p>Prejeli smo zahtevo za novo geslo za vaš B2B račun.</p>${gumb(link, "Nastavi novo geslo")}
       <p style="font-size:13px;color:#6e7276;">Povezava velja 1 uro. Če zahteve niste poslali vi, sporočilo prezrite.</p>`
    ),
  });
}

export async function mailAktiviran(kupec) {
  await poslji({
    to: [kupec.email],
    subject: "Vaš B2B dostop je aktiven — AS system",
    html: ovoj(
      "B2B dostop je aktiven",
      `<p>Pozdravljeni ${esc(kupec.ime)},</p>
       <p>vaš B2B račun za <b>${esc(kupec.vasco_naziv || kupec.podjetje)}</b> je aktiven. Ob prijavi v spletni trgovini vidite svoje cene (brez DDV) in naročate na račun${kupec.rok_placila ? ` z rokom plačila ${kupec.rok_placila} dni` : ""}.</p>
       ${gumb(`${osnovaUrl()}/b2b`, "Prijava v B2B trgovino")}`
    ),
  });
}

export async function mailProdajiNovaRegistracija(kupec) {
  await poslji({
    to: [PRODAJA],
    replyTo: kupec.email,
    subject: `Nova B2B registracija — ${kupec.podjetje} (${kupec.davcna})`,
    html: ovoj(
      "Nova B2B registracija",
      `<p><b>${esc(kupec.podjetje)}</b>, davčna ${esc(kupec.davcna)}<br>${esc(kupec.ime)} · ${esc(kupec.email)} · ${esc(kupec.telefon)}<br>${esc(kupec.naslov)} ${esc(kupec.posta)} ${esc(kupec.kraj)}</p>
       <p>Obstoječe partnerje (ujemanje davčne in e-domene) sistem odobri sam. Ostale odobrite v administraciji.</p>
       ${gumb(`${osnovaUrl()}/admin/b2b`, "Odpri B2B kupce")}`
    ),
  });
}

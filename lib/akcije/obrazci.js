"use server";

import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";
import { preveriNalozene } from "@/lib/akcije/nalaganje";

import { site } from "@/lib/site";
import { zapisiVBazo } from "@/lib/baza";
import { sestaviHtml, zadevaIz } from "@/lib/email-predloge";
import { naloziPredlogo } from "@/lib/email-predloge-streznik";

const PREJEMNIK = "info@as-system.si"; // javni naslov (v sporočilih kupcem)
const POSILJATELJ = process.env.EMAIL_POSILJATELJ || "splet@assystem.si";

// E-pošta se pošlje samo, če je ključ nastavljen. Če ga ni, se zapis
// vseeno shrani v bazo in ga vidiš v adminu — nič se ne izgubi.
async function posljiPosto({ zadeva, html, odgovoriNa, prejemnik, priponke }) {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) return { poslano: false, razlog: "Resend ni nastavljen" };

  try {
    const resend = new Resend(kljuc);
    await resend.emails.send({
      from: `AS system splet <${POSILJATELJ}>`,
      to: prejemnik || site.obvestilaProdaja,
      replyTo: odgovoriNa,
      subject: zadeva,
      html,
      ...(priponke?.length ? { attachments: priponke } : {}),
    });
    return { poslano: true };
  } catch (e) {
    return { poslano: false, razlog: e.message };
  }
}

// Potrdilo stranki (če je v Admin → Sporočila strankam vklopljeno).
async function potrdiloStranki(kljuc, email, vrednosti) {
  const kljucApi = process.env.RESEND_API_KEY;
  if (!kljucApi || !email) return;
  try {
    const t = await naloziPredlogo(kljuc);
    if (!t.vklopljeno) return;
    await new Resend(kljucApi).emails.send({
      from: `AS system <${POSILJATELJ}>`,
      to: [email],
      replyTo: PREJEMNIK,
      subject: zadevaIz(t, vrednosti),
      html: sestaviHtml(t, { vrednosti }),
    });
  } catch (e) {
    console.error("Potrdilo stranki ni bilo poslano:", e?.message);
  }
}

// Viri povpraševanj, ki gredo proizvodnji (Špela, Marina) namesto prodaji.
const VIRI_PROIZVODNJA = ["bespoke", "proizvodnja", "vijaki-po-narocilu"];

function vrstica(oznaka, vrednost) {
  if (!vrednost) return "";
  return `<tr><td style="padding:6px 12px;color:#6e7276;">${oznaka}</td>
          <td style="padding:6px 12px;font-weight:600;">${String(vrednost).replace(/</g, "&lt;")}</td></tr>`;
}

// Pregleden mail za povpraševanje: kontakt, izbire stranke kot tabela, sporočilo, priloge.
const esc = (v) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
function htmlPovprasevanja({ vrsta, ime, email, zapis, izdelek, pari, sporocilo, povezave }) {
  const F = "font-family:Arial,Helvetica,sans-serif;";
  const kontakt = [
    ["Ime", ime],
    ["Podjetje", zapis.podjetje],
    ["E-naslov", `<a href="mailto:${esc(email)}" style="color:#cb2026;">${esc(email)}</a>`, true],
    ["Telefon", zapis.telefon ? `<a href="tel:${esc(zapis.telefon)}" style="color:#cb2026;">${esc(zapis.telefon)}</a>` : "", true],
    ["Izdelek", izdelek],
  ].filter((r) => r[1]);
  const vrstice = (seznam) =>
    seznam
      .map(([o, v, html], n) => `<tr style="background:${n % 2 ? "#ffffff" : "#f6f6f7"};">
        <td style="${F}padding:10px 14px;width:38%;font-size:13px;color:#6b6f72;vertical-align:top;">${esc(o)}</td>
        <td style="${F}padding:10px 14px;font-size:15px;font-weight:bold;color:#2b2b2b;vertical-align:top;">${html ? v : esc(v)}</td></tr>`)
      .join("");
  const naslov = (t) => `<div style="${F}font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#cb2026;margin:26px 0 8px;">${t}</div>`;
  const tabela = (vsebina) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border:1px solid #e3e4e5;">${vsebina}</table>`;
  const prilogeHtml = povezave.length
    ? naslov(`Priloge stranke (${povezave.length})`) +
      povezave
        .map((p) => {
          const k = (p.naziv.split(".").pop() || "").toUpperCase().slice(0, 4);
          return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e3e4e5;margin-bottom:6px;"><tr>
            <td width="54" align="center" style="${F}background:#2f3234;color:#ffffff;font-size:12px;font-weight:bold;padding:14px 0;">${esc(k)}</td>
            <td style="${F}padding:10px 14px;font-size:14px;font-weight:bold;color:#2b2b2b;">${esc(p.naziv)}</td>
            <td align="right" style="${F}padding:10px 14px;">${p.url ? `<a href="${p.url}" style="background:#cb2026;color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold;padding:8px 14px;display:inline-block;">Odpri</a>` : ""}</td>
          </tr></table>`;
        })
        .join("") +
      `<div style="${F}font-size:12px;color:#6b6f72;margin-top:4px;">Datoteke so tudi v priponki tega maila. Povezava »Odpri« velja 30 dni, potem je datoteka v administraciji (Povpraševanja).</div>`
    : "";
  return `<div style="background:#ececed;padding:20px 8px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#ffffff;">
    <tr><td style="background:#2f3234;padding:20px 24px;border-bottom:5px solid #cb2026;">
      <div style="${F}font-size:12px;font-weight:bold;letter-spacing:1.5px;text-transform:uppercase;color:#ff6b73;">Novo povpraševanje · ${esc(vrsta)}</div>
      <div style="${F}font-size:22px;font-weight:bold;color:#ffffff;margin-top:6px;">${esc(ime)}${zapis.podjetje ? ` <span style="color:#c4c8cc;font-weight:normal;">· ${esc(zapis.podjetje)}</span>` : ""}</div>
    </td></tr>
    <tr><td style="padding:4px 24px 26px;">
      ${naslov("Kontakt")}${tabela(vrstice(kontakt))}
      ${pari.length ? naslov("Kaj je stranka izbrala") + tabela(vrstice(pari)) : ""}
      ${sporocilo ? naslov("Sporočilo stranke") + `<div style="${F}font-size:15px;line-height:22px;color:#2b2b2b;background:#f6f6f7;border-left:4px solid #cb2026;padding:14px 16px;white-space:pre-wrap;">${esc(sporocilo)}</div>` : ""}
      ${prilogeHtml}
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;"><tr><td style="background:#1a9a4b;">
        <a href="mailto:${esc(email)}?subject=${encodeURIComponent("Re: " + vrsta)}" style="${F}display:inline-block;padding:12px 22px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">Odgovori stranki</a>
      </td></tr></table>
    </td></tr>
  </table></div>`;
}

// ---------------------------------------------------------------
// POVPRAŠEVANJE (kontakt, izdelek, distributer, private label)
// ---------------------------------------------------------------
export async function posljiPovprasevanje(prejsnje, formData) {
  // Skrito polje, ki ga izpolnijo samo roboti.
  if (formData.get("polje_za_robote")) return { stanje: "ok" };

  const ime = formData.get("ime")?.trim();
  const email = formData.get("email")?.trim();
  const sporocilo = formData.get("sporocilo")?.trim();

  if (!ime || !email) {
    return { stanje: "napaka", sporocilo: "Ime in e-naslov sta obvezna." };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { stanje: "napaka", sporocilo: "E-naslov ni pravilno zapisan." };
  }

  // Dodatna polja obrazca (npr. material, letna količina) — ime polja je »dod:Oznaka«.
  const dodatno = [];
  const dodatnoPari = [];
  for (const [k, val] of formData.entries()) {
    if (k.startsWith("dod:") && String(val).trim()) {
      dodatno.push(`${k.slice(4)}: ${String(val).trim()}`);
      dodatnoPari.push([k.slice(4), String(val).trim()]);
    }
  }
  const celotno = [dodatno.join("\n"), sporocilo].filter(Boolean).join("\n\n");

  // Priložena risba ali tehnična dokumentacija (vijaki po naročilu, private label)
  const priloge = await preveriNalozene("priloga", formData.get("nalozeno"));
  for (const f of formData.getAll("priloga")) {
    if (!f || typeof f === "string" || !f.size) continue;
    if (f.size > 4 * 1024 * 1024) return { stanje: "napaka", sporocilo: "Datoteka je večja od 4 MB. Večje datoteke pošljite po e-pošti na " + PREJEMNIK + "." };
    const koncnica = f.name.split(".").pop().toLowerCase();
    if (!["pdf", "dwg", "dxf", "step", "stp", "igs", "iges", "jpg", "jpeg", "png", "zip"].includes(koncnica)) {
      return { stanje: "napaka", sporocilo: "Dovoljene so datoteke PDF, DWG, DXF, STEP, IGES, JPG, PNG ali ZIP." };
    }
    const pot = `risbe/${Date.now()}-${priloge.length}.${koncnica}`;
    const { error: napakaNalaganja } = await supabaseAdmin().storage.from("prijave").upload(pot, f, { contentType: f.type || undefined });
    if (napakaNalaganja) return { stanje: "napaka", sporocilo: "Datoteke ni bilo mogoče naložiti. Pošljite jo na " + PREJEMNIK + "." };
    priloge.push({ naziv: f.name, datoteka: pot });
    if (priloge.length >= 5) break;
  }

  const zapis = {
    ime,
    email,
    podjetje: formData.get("podjetje")?.trim() || null,
    telefon: formData.get("telefon")?.trim() || null,
    sporocilo: celotno || null,
    vir: formData.get("vir") || "kontakt",
    izdelki: [
      ...(formData.get("izdelek") ? [{ naziv: formData.get("izdelek"), sifra: formData.get("sifra") || null }] : []),
      ...priloge,
    ],
  };

  const { error } = await supabaseAdmin().from("povprasevanja").insert(zapis);
  if (error) {
    return { stanje: "napaka", sporocilo: "Sporočila ni bilo mogoče shraniti. Poskusite znova." };
  }
  await zapisiVBazo({ email, ime, podjetje: zapis.podjetje, telefon: zapis.telefon, vir: "povpraševanje" });

  // Priloge stranke: v mail kot priponke (do 25 MB skupaj) + povezava za prenos (velja 30 dni)
  const priponke = [];
  const povezave = [];
  let skupajB = 0;
  for (const pr of priloge) {
    if (!pr?.datoteka) continue;
    const sb = supabaseAdmin().storage.from("prijave");
    const { data: podpis } = await sb.createSignedUrl(pr.datoteka, 60 * 60 * 24 * 30);
    povezave.push({ naziv: pr.naziv || pr.datoteka.split("/").pop(), url: podpis?.signedUrl || null });
    try {
      const { data: blob } = await sb.download(pr.datoteka);
      if (blob && skupajB + blob.size <= 25 * 1024 * 1024) {
        skupajB += blob.size;
        priponke.push({ filename: pr.naziv || pr.datoteka.split("/").pop(), content: Buffer.from(await blob.arrayBuffer()) });
      }
    } catch {}
  }

  const vrsta = { "private-label": "Private label", "vijaki-po-narocilu": "Vijaki po naročilu", bespoke: "Bespoke (po meri)", proizvodnja: "Proizvodnja" }[zapis.vir] ?? "Povpraševanje";
  await posljiPosto({
    zadeva: `${vrsta}: ${ime}${zapis.podjetje ? ` (${zapis.podjetje})` : ""}`,
    // povpraševanja za proizvodnjo gredo Špeli in Marini
    prejemnik: VIRI_PROIZVODNJA.includes(zapis.vir) ? site.obvestilaProizvodnja : undefined,
    odgovoriNa: email,
    priponke,
    html: htmlPovprasevanja({ vrsta, ime, email, zapis, izdelek: formData.get("izdelek"), pari: dodatnoPari, sporocilo, povezave }),
  });
  await potrdiloStranki("povprasevanje_potrdilo", email, { ime, podjetje: zapis.podjetje || "", email });

  return { stanje: "ok" };
}

// ---------------------------------------------------------------
// PRIJAVA NA DELOVNO MESTO
// ---------------------------------------------------------------
export async function posljiPrijavo(prejsnje, formData) {
  if (formData.get("polje_za_robote")) return { stanje: "ok" };

  const ime = formData.get("ime")?.trim();
  const email = formData.get("email")?.trim();

  if (!ime || !email) {
    return { stanje: "napaka", sporocilo: "Ime in e-naslov sta obvezna." };
  }
  if (!formData.get("privolitev")) {
    return { stanje: "napaka", sporocilo: "Za oddajo prijave potrdite strinjanje s hrambo podatkov." };
  }
  const privolitevOb = new Date().toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana" });

  const sb = supabaseAdmin();
  let cvUrl = (await preveriNalozene("cv", formData.get("nalozeno")))[0]?.datoteka ?? null;

  const cv = formData.get("cv");
  if (cv && cv.size > 0) {
    if (cv.size > 4 * 1024 * 1024) {
      return { stanje: "napaka", sporocilo: "Datoteka je večja od 4 MB." };
    }
    const koncnica = cv.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx"].includes(koncnica)) {
      return { stanje: "napaka", sporocilo: "Dovoljeni so PDF, DOC in DOCX." };
    }
    const datoteka = `cv-${Date.now()}.${koncnica}`;
    const { error } = await sb.storage
      .from("prijave")
      .upload(datoteka, cv, { contentType: cv.type });
    if (!error) cvUrl = datoteka;
  }
  if (!cvUrl) {
    return { stanje: "napaka", sporocilo: "Priložite življenjepis (PDF, DOC ali DOCX). Brez njega prijave ni mogoče oddati." };
  }
  const imeCv = cvUrl.split("/").pop().replace(/^cv-\d+\./, "zivljenjepis.");
  // Življenjepis kot priponka v e-sporočilu kadrovski službi
  let priponke = [];
  try {
    const { data: blob } = await sb.storage.from("prijave").download(cvUrl);
    if (blob && blob.size <= 15 * 1024 * 1024) priponke = [{ filename: imeCv, content: Buffer.from(await blob.arrayBuffer()) }];
  } catch {}

  const mestoId = formData.get("delovno_mesto_id") || null;
  let mestoNaziv = null;
  if (mestoId) {
    const { data } = await sb.from("delovna_mesta").select("naziv").eq("id", mestoId).maybeSingle();
    mestoNaziv = data?.naziv ?? null;
  }

  const { error } = await sb.from("prijave_zaposlitev").insert({
    delovno_mesto_id: mestoId,
    delovno_mesto_naziv: mestoNaziv,
    ime,
    email,
    telefon: formData.get("telefon")?.trim() || null,
    sporocilo: formData.get("sporocilo")?.trim() || null,
    cv_url: cvUrl,
  });

  if (error) {
    return { stanje: "napaka", sporocilo: "Prijave ni bilo mogoče shraniti. Poskusite znova." };
  }

  await posljiPosto({
    prejemnik: site.obvestilaZaposlitev,
    zadeva: `Prijava na delovno mesto: ${ime}${mestoNaziv ? ` (${mestoNaziv})` : ""}`,
    odgovoriNa: email,
    html: `
      <h2 style="font-family:Arial;color:#3f4140;">Nova prijava</h2>
      <table style="font-family:Arial;font-size:14px;border-collapse:collapse;">
        ${vrstica("Ime", ime)}
        ${vrstica("E-naslov", email)}
        ${vrstica("Telefon", formData.get("telefon"))}
        ${vrstica("Delovno mesto", mestoNaziv ?? "splošna prijava")}
        ${vrstica("Življenjepis", priponke.length ? `v priponki: ${imeCv}` : `${imeCv} (odprite v administraciji: Prijave za delo)`)}
        ${vrstica("Privolitev", `hramba 1 leto, potrjeno ${privolitevOb}`)}
      </table>
      <p style="font-family:Arial;font-size:14px;white-space:pre-wrap;margin-top:16px;">
        ${(formData.get("sporocilo") || "").replace(/</g, "&lt;")}
      </p>`,
  });

  await potrdiloStranki("zaposlitev_potrdilo", email, { ime, email, delovno_mesto: mestoNaziv ? ` za delovno mesto ${mestoNaziv}` : "" });

  return { stanje: "ok" };
}

// ---------------------------------------------------------------
// POP-UP »Kupujete za podjetje?« — zbiranje B2B kontaktov
// ---------------------------------------------------------------
export async function oddajPopupB2B(prejsnje, formData) {
  if (formData.get("polje_za_robote")) return { stanje: "ok" };
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const podjetje = String(formData.get("podjetje") ?? "").trim().slice(0, 200) || null;
  const telefon = String(formData.get("telefon") ?? "").trim().slice(0, 40) || null;
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { stanje: "napaka", sporocilo: "Vpišite pravilen e-naslov." };

  const zapis = {
    ime: podjetje || email,
    email,
    podjetje,
    telefon,
    sporocilo: `Pop-up »Kupujete za podjetje?« — želi, da ga pokličemo v 1–2 delovnih dneh in pripravimo ponudbo za podjetje.\nE-novice: ${formData.get("novice") === "on" ? "da" : "ne"} · Stran: ${String(formData.get("stran") ?? "").slice(0, 200) || "/"}`,
    vir: "pop-up B2B",
    izdelki: [],
  };
  const { error } = await supabaseAdmin().from("povprasevanja").insert(zapis);
  if (error) return { stanje: "napaka", sporocilo: "Pošiljanje ni uspelo. Poskusite znova ali pokličite +386 40 934 316." };
  await zapisiVBazo({ email, podjetje, telefon, vir: "pop-up", soglasje: formData.get("novice") === "on" });

  if (formData.get("novice") === "on") {
    const { prijaviNaENovice } = await import("@/lib/enovice-resend");
    await prijaviNaENovice({ email, ime: "", panoga: "B2B kupci" }).catch((e) => console.error("Pop-up e-novice:", e?.message));
  }

  await posljiPosto({
    zadeva: `Pop-up B2B: ${podjetje || email}`,
    odgovoriNa: email,
    html: `
      <h2 style="font-family:Arial;color:#3f4140;">Nov B2B kontakt s spleta (pop-up)</h2>
      <p style="font-family:Arial;font-size:14px;">Obiskovalec želi, da ga kontaktiramo v 1–2 delovnih dneh in pripravimo ponudbo za podjetje.</p>
      <table style="font-family:Arial;font-size:14px;border-collapse:collapse;">
        ${vrstica("E-naslov", email)}
        ${vrstica("Podjetje", podjetje)}
        ${vrstica("Telefon", telefon)}
        ${vrstica("E-novice", formData.get("novice") === "on" ? "da" : "ne")}
        ${vrstica("Stran", formData.get("stran"))}
      </table>`,
  });
  return { stanje: "ok" };
}

// ---------------------------------------------------------------
// VPRAŠAJ ZA ROK DOBAVE (okence v tabeli artiklov)
// Prijavljen B2B kupec: podatke vzamemo iz njegovega računa. Ostali vpišejo e-naslov.
// ---------------------------------------------------------------
export async function mojKontaktB2B() {
  const { trenutniB2B } = await import("@/lib/b2b");
  const k = await trenutniB2B();
  if (!k) return null;
  return { email: k.email ?? k.user?.email ?? null, podjetje: k.vasco_naziv || k.podjetje || null };
}

export async function vprasajZaRok(p) {
  const { trenutniB2B } = await import("@/lib/b2b");
  const k = await trenutniB2B();
  const email = String(k ? k.email ?? k.user?.email ?? "" : p?.email ?? "").trim();
  const ime = String(p?.ime ?? "").trim() || (k ? k.vasco_naziv || k.podjetje || "B2B kupec" : "");
  const podjetje = k ? k.vasco_naziv || k.podjetje || null : String(p?.podjetje ?? "").trim() || null;
  const telefon = String(p?.telefon ?? "").trim() || (k?.telefon ?? null);
  const sporocilo = String(p?.sporocilo ?? "").trim().slice(0, 3000);
  const sifra = String(p?.sifra ?? "").trim();
  const naziv = `${String(p?.naziv ?? "").trim()} ${String(p?.dimenzija ?? "").trim()}`.trim();

  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { stanje: "napaka", sporocilo: "Vpišite pravilen e-naslov, da vam lahko odgovorimo." };
  if (!sifra) return { stanje: "napaka", sporocilo: "Manjka šifra artikla." };

  const zapis = {
    ime: ime || email,
    email,
    podjetje,
    telefon,
    sporocilo: sporocilo || null,
    vir: k ? "rok-dobave-b2b" : "rok-dobave",
    izdelki: [{ naziv: naziv || sifra, sifra }],
  };
  const { error } = await supabaseAdmin().from("povprasevanja").insert(zapis);
  if (error) return { stanje: "napaka", sporocilo: "Sporočila ni bilo mogoče poslati. Poskusite znova." };
  await zapisiVBazo({ email, ime: zapis.ime, podjetje, telefon, vir: "povpraševanje" });

  await posljiPosto({
    zadeva: `Rok dobave${k ? " (B2B)" : ""}: ${naziv || sifra} · ${podjetje ?? email}`,
    odgovoriNa: email,
    html: `
      <h2 style="font-family:Arial;color:#3f4140;">Vprašanje za rok dobave</h2>
      <table style="font-family:Arial;font-size:14px;border-collapse:collapse;">
        ${vrstica("Kupec", k ? "B2B (prijavljen)" : "spletni obiskovalec")}
        ${vrstica("Podjetje", podjetje)}
        ${vrstica("Ime", ime)}
        ${vrstica("E-naslov", email)}
        ${vrstica("Telefon", telefon)}
        ${vrstica("Artikel", naziv)}
        ${vrstica("Šifra", sifra)}
      </table>
      <p style="font-family:Arial;font-size:14px;white-space:pre-wrap;margin-top:16px;">${sporocilo.replace(/</g, "&lt;")}</p>`,
  });
  return { stanje: "ok" };
}

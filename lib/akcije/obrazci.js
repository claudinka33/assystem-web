"use server";

import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";

const PREJEMNIK = process.env.EMAIL_PREJEMNIK || "prodaja@as-system.si";
const POSILJATELJ = process.env.EMAIL_POSILJATELJ || "splet@assystem.si";

// E-pošta se pošlje samo, če je ključ nastavljen. Če ga ni, se zapis
// vseeno shrani v bazo in ga vidiš v adminu — nič se ne izgubi.
async function posljiPosto({ zadeva, html, odgovoriNa }) {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) return { poslano: false, razlog: "Resend ni nastavljen" };

  try {
    const resend = new Resend(kljuc);
    await resend.emails.send({
      from: `AS system splet <${POSILJATELJ}>`,
      to: [PREJEMNIK],
      replyTo: odgovoriNa,
      subject: zadeva,
      html,
    });
    return { poslano: true };
  } catch (e) {
    return { poslano: false, razlog: e.message };
  }
}

function vrstica(oznaka, vrednost) {
  if (!vrednost) return "";
  return `<tr><td style="padding:6px 12px;color:#6e7276;">${oznaka}</td>
          <td style="padding:6px 12px;font-weight:600;">${String(vrednost).replace(/</g, "&lt;")}</td></tr>`;
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

  const zapis = {
    ime,
    email,
    podjetje: formData.get("podjetje")?.trim() || null,
    telefon: formData.get("telefon")?.trim() || null,
    sporocilo: sporocilo || null,
    vir: formData.get("vir") || "kontakt",
    izdelki: formData.get("izdelek")
      ? [{ naziv: formData.get("izdelek"), sifra: formData.get("sifra") || null }]
      : [],
  };

  const { error } = await supabaseAdmin().from("povprasevanja").insert(zapis);
  if (error) {
    return { stanje: "napaka", sporocilo: "Sporočila ni bilo mogoče shraniti. Poskusite znova." };
  }

  await posljiPosto({
    zadeva: `Povpraševanje s spletne strani — ${ime}`,
    odgovoriNa: email,
    html: `
      <h2 style="font-family:Arial;color:#3f4140;">Novo povpraševanje</h2>
      <table style="font-family:Arial;font-size:14px;border-collapse:collapse;">
        ${vrstica("Ime", ime)}
        ${vrstica("Podjetje", zapis.podjetje)}
        ${vrstica("E-naslov", email)}
        ${vrstica("Telefon", zapis.telefon)}
        ${vrstica("Vir", zapis.vir)}
        ${vrstica("Izdelek", formData.get("izdelek"))}
      </table>
      <p style="font-family:Arial;font-size:14px;white-space:pre-wrap;margin-top:16px;">
        ${(sporocilo || "").replace(/</g, "&lt;")}
      </p>`,
  });

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

  const sb = supabaseAdmin();
  let cvUrl = null;

  const cv = formData.get("cv");
  if (cv && cv.size > 0) {
    if (cv.size > 8 * 1024 * 1024) {
      return { stanje: "napaka", sporocilo: "Datoteka je večja od 8 MB." };
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

  const { error } = await sb.from("prijave_zaposlitev").insert({
    delovno_mesto_id: formData.get("delovno_mesto_id") || null,
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
    zadeva: `Prijava na delovno mesto — ${ime}`,
    odgovoriNa: email,
    html: `
      <h2 style="font-family:Arial;color:#3f4140;">Nova prijava</h2>
      <table style="font-family:Arial;font-size:14px;border-collapse:collapse;">
        ${vrstica("Ime", ime)}
        ${vrstica("E-naslov", email)}
        ${vrstica("Telefon", formData.get("telefon"))}
        ${vrstica("Življenjepis", cvUrl ? "priložen — poglej v admin" : "ni priložen")}
      </table>
      <p style="font-family:Arial;font-size:14px;white-space:pre-wrap;margin-top:16px;">
        ${(formData.get("sporocilo") || "").replace(/</g, "&lt;")}
      </p>`,
  });

  return { stanje: "ok" };
}

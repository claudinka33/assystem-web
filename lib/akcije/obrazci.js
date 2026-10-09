"use server";

import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";

const PREJEMNIK = process.env.EMAIL_PREJEMNIK || "prodaja@as-system.si";
const PREJEMNIK_ZAPOSLITEV = process.env.EMAIL_ZAPOSLITEV || "zaposlitev@as-system.si";
const POSILJATELJ = process.env.EMAIL_POSILJATELJ || "splet@assystem.si";

// E-pošta se pošlje samo, če je ključ nastavljen. Če ga ni, se zapis
// vseeno shrani v bazo in ga vidiš v adminu — nič se ne izgubi.
async function posljiPosto({ zadeva, html, odgovoriNa, prejemnik }) {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) return { poslano: false, razlog: "Resend ni nastavljen" };

  try {
    const resend = new Resend(kljuc);
    await resend.emails.send({
      from: `AS system splet <${POSILJATELJ}>`,
      to: [prejemnik || PREJEMNIK],
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

  // Dodatna polja obrazca (npr. material, letna količina) — ime polja je »dod:Oznaka«.
  const dodatno = [];
  for (const [k, val] of formData.entries()) {
    if (k.startsWith("dod:") && String(val).trim()) dodatno.push(`${k.slice(4)}: ${String(val).trim()}`);
  }
  const celotno = [dodatno.join("\n"), sporocilo].filter(Boolean).join("\n\n");

  // Priložena risba ali tehnična dokumentacija (vijaki po naročilu, private label)
  const priloge = [];
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

  await posljiPosto({
    zadeva: `${{ "private-label": "Private label", "vijaki-po-narocilu": "Vijaki po naročilu" }[zapis.vir] ?? "Povpraševanje"} — ${ime}${zapis.podjetje ? ` (${zapis.podjetje})` : ""}`,
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
        ${vrstica("Priloge", priloge.map((x) => x.naziv).join(", ") + (priloge.length ? " — odpri v adminu" : ""))}
      </table>
      <p style="font-family:Arial;font-size:14px;white-space:pre-wrap;margin-top:16px;">
        ${(celotno || "").replace(/</g, "&lt;")}
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
    prejemnik: PREJEMNIK_ZAPOSLITEV,
    zadeva: `Prijava na delovno mesto — ${ime}${mestoNaziv ? ` (${mestoNaziv})` : ""}`,
    odgovoriNa: email,
    html: `
      <h2 style="font-family:Arial;color:#3f4140;">Nova prijava</h2>
      <table style="font-family:Arial;font-size:14px;border-collapse:collapse;">
        ${vrstica("Ime", ime)}
        ${vrstica("E-naslov", email)}
        ${vrstica("Telefon", formData.get("telefon"))}
        ${vrstica("Delovno mesto", mestoNaziv ?? "splošna prijava")}
        ${vrstica("Življenjepis", cvUrl ? "priložen — poglej v admin" : "ni priložen")}
      </table>
      <p style="font-family:Arial;font-size:14px;white-space:pre-wrap;margin-top:16px;">
        ${(formData.get("sporocilo") || "").replace(/</g, "&lt;")}
      </p>`,
  });

  return { stanje: "ok" };
}

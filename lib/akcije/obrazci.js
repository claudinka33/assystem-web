"use server";

import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";

import { site } from "@/lib/site";
import { zapisiVBazo } from "@/lib/baza";

const PREJEMNIK = "info@as-system.si"; // javni naslov (v sporočilih kupcem)
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
      to: prejemnik || site.obvestilaProdaja,
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
  await zapisiVBazo({ email, ime, podjetje: zapis.podjetje, telefon: zapis.telefon, vir: "povpraševanje" });

  await posljiPosto({
    zadeva: `${{ "private-label": "Private label", "vijaki-po-narocilu": "Vijaki po naročilu" }[zapis.vir] ?? "Povpraševanje"}: ${ime}${zapis.podjetje ? ` (${zapis.podjetje})` : ""}`,
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
        ${vrstica("Priloge", priloge.map((x) => x.naziv).join(", ") + (priloge.length ? ": odpri v adminu" : ""))}
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
  if (!formData.get("privolitev")) {
    return { stanje: "napaka", sporocilo: "Za oddajo prijave potrdite strinjanje s hrambo podatkov." };
  }
  const privolitevOb = new Date().toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana" });

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
        ${vrstica("Življenjepis", cvUrl ? "priložen: poglej v admin" : "ni priložen")}
        ${vrstica("Privolitev", `hramba 1 leto, potrjeno ${privolitevOb}`)}
      </table>
      <p style="font-family:Arial;font-size:14px;white-space:pre-wrap;margin-top:16px;">
        ${(formData.get("sporocilo") || "").replace(/</g, "&lt;")}
      </p>`,
  });

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
    sporocilo: `Pop-up »Kupujete za podjetje?« — želi ponudbo za podjetje.\nStran: ${String(formData.get("stran") ?? "").slice(0, 200)}`,
    vir: "pop-up B2B",
    izdelki: [],
  };
  const { error } = await supabaseAdmin().from("povprasevanja").insert(zapis);
  if (error) return { stanje: "napaka", sporocilo: "Pošiljanje ni uspelo. Poskusite znova ali pokličite +386 3 800 70 00." };
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

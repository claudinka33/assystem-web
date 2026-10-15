"use server";

import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { zahtevajAdmina } from "@/lib/akcije/skupno";

// Uvoz kontaktov za e-novice v Resend, v izbran segment (= panoga).
// Prilepljeno besedilo: en kontakt na vrstico, npr.
//   janez@firma.si
//   Janez Novak <janez@firma.si>
//   Janez Novak;janez@firma.si   (ali kopirano iz Excela s tabulatorji)

const EMAIL = /[A-Z0-9._%+'-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

function razcleni(besedilo) {
  const videni = new Set();
  const kontakti = [];
  const neveljavne = [];
  for (const surova of String(besedilo || "").split(/\r?\n/)) {
    const vrstica = surova.trim();
    if (!vrstica) continue;
    // več naslovov v isti vrstici (ločeni z vejico/podpičjem/presledkom)
    const najdeni = vrstica.match(new RegExp(EMAIL.source, "gi"));
    if (!najdeni) {
      neveljavne.push(vrstica);
      continue;
    }
    const ime =
      najdeni.length === 1
        ? vrstica
            .replace(najdeni[0], "")
            .replace(/[<>"';,\t|]+/g, " ")
            .replace(/\s+/g, " ")
            .trim()
        : "";
    for (const e of najdeni) {
      const email = e.toLowerCase();
      const [ime1, ...ostalo] = ime.split(" ");
      const k = { email, firstName: ime1 || "", lastName: ostalo.join(" ") };
      if (videni.has(email)) {
        // dvojnik: ohrani tistega, ki ima ime
        const obst = kontakti.find((x) => x.email === email);
        if (obst && !obst.firstName && k.firstName) Object.assign(obst, k);
        continue;
      }
      videni.add(email);
      kontakti.push(k);
    }
  }
  return { kontakti, neveljavne };
}

const csvPolje = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function odjemalec() {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) throw new Error("RESEND_API_KEY ni nastavljen.");
  return new Resend(kljuc);
}

export async function uvoziKontakte(prejsnje, formData) {
  await zahtevajAdmina();

  const { kontakti, neveljavne } = razcleni(formData.get("kontakti"));
  if (kontakti.length === 0) return { stanje: "napaka", sporocilo: "V besedilu ni nobenega e-naslova." };
  if (kontakti.length > 20000) return { stanje: "napaka", sporocilo: "Naenkrat lahko uvozite največ 20.000 kontaktov." };

  let resend;
  try {
    resend = odjemalec();
  } catch (e) {
    return { stanje: "napaka", sporocilo: e.message };
  }

  // Panoga: obstoječi segment ali nov
  let segmentId = formData.get("segment") || "";
  let segmentIme = "";
  const nova = formData.get("nova_panoga")?.trim();
  if (segmentId === "__nova__") {
    if (!nova) return { stanje: "napaka", sporocilo: "Vpišite ime nove panoge." };
    const { data, error } = await resend.segments.create({ name: nova });
    if (error) return { stanje: "napaka", sporocilo: `Resend (nova panoga): ${error.message}` };
    segmentId = data.id;
    segmentIme = nova;
  }
  if (!segmentId) return { stanje: "napaka", sporocilo: "Izberite panogo." };

  const csv = ["email,first_name,last_name", ...kontakti.map((k) => [k.email, k.firstName, k.lastName].map(csvPolje).join(","))].join("\n");

  try {
    const { data, error } = await resend.contacts.imports.create({
      file: new Blob([csv], { type: "text/csv" }),
      columnMap: { email: "email", firstName: "first_name", lastName: "last_name" },
      onConflict: "upsert",
      segments: [{ id: segmentId }],
    });
    if (error) return { stanje: "napaka", sporocilo: `Resend: ${error.message}` };
    revalidatePath("/admin/e-novice/kontakti");
    return {
      stanje: "ok",
      sporocilo:
        `Uvoz začet: ${kontakti.length} kontaktov${segmentIme ? ` v novo panogo »${segmentIme}«` : ""}. ` +
        `Resend jih obdela v nekaj sekundah – stanje vidite spodaj (osvežite stran).` +
        (neveljavne.length ? ` Preskočenih vrstic brez e-naslova: ${neveljavne.length}.` : ""),
      id: data?.id,
    };
  } catch (e) {
    return { stanje: "napaka", sporocilo: e.message };
  }
}

"use server";

import { Resend } from "resend";

// Prijava na e-novice: kontakt gre neposredno v Resend (Contacts).
// RESEND_API_KEY      — obstoječi ključ (Full access, ne samo "Sending")
// RESEND_SEGMENT_ID   — neobvezno: ID segmenta "E-novice" v Resendu
export async function prijavaNaNovice(prejsnje, formData) {
  // Past za robote — človek tega polja ne vidi.
  if (formData.get("polje_za_robote")) return { stanje: "ok" };

  const email = formData.get("email")?.trim().toLowerCase();
  const ime = formData.get("ime")?.trim() || undefined;

  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { stanje: "napaka", sporocilo: "Vpišite pravilen e-naslov." };
  }
  if (formData.get("privolitev") !== "on") {
    return { stanje: "napaka", sporocilo: "Za prijavo potrdite strinjanje s prejemanjem e-novic." };
  }

  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) {
    return { stanje: "napaka", sporocilo: "Prijava trenutno ni mogoča. Pišite nam na info@as-system.si." };
  }

  const resend = new Resend(kljuc);
  const segment = process.env.RESEND_SEGMENT_ID;
  const kontakt = {
    email,
    firstName: ime,
    unsubscribed: false,
    ...(segment ? { segments: [{ id: segment }] } : {}),
  };

  try {
    const { error } = await resend.contacts.create(kontakt);
    if (error) {
      // Kontakt že obstaja → ga ponovno prijavimo (npr. če se je prej odjavil).
      if (/exist|already/i.test(error.message || "")) {
        await resend.contacts.update({ email, unsubscribed: false, ...(ime ? { firstName: ime } : {}) });
        if (segment) await resend.contacts.segments.add({ email, segmentId: segment }).catch(() => {});
      } else {
        console.error("Resend prijava na novice:", error);
        return { stanje: "napaka", sporocilo: "Prijava ni uspela. Poskusite znova." };
      }
    }
  } catch (e) {
    console.error("Resend prijava na novice:", e);
    return { stanje: "napaka", sporocilo: "Prijava ni uspela. Poskusite znova." };
  }

  return { stanje: "ok" };
}

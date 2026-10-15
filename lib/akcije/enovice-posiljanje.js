"use server";

import { Resend } from "resend";
import { zahtevajAdmina } from "@/lib/akcije/skupno";

// Pošiljanje e-novic iz admina (Resend).
// Test → navaden e-mail na enega ali več naslovov.
// Vsem → Resend Broadcast na izbran segment (Resend sam doda odjavno povezavo
//        namesto {{{RESEND_UNSUBSCRIBE_URL}}} in izpusti odjavljene kontakte).

const ODGOVOR_NA = "info@as-system.si";
const privzetiPosiljatelj = () =>
  process.env.EMAIL_NOVICE || `AS system <${process.env.EMAIL_POSILJATELJ || "splet@assystem.si"}>`;

function preberi(formData) {
  return {
    zadeva: formData.get("zadeva")?.trim() || "",
    predogled: formData.get("predogled")?.trim() || undefined,
    posiljatelj: formData.get("posiljatelj")?.trim() || privzetiPosiljatelj(),
    html: formData.get("html")?.trim() || "",
  };
}

function preveri({ zadeva, html }) {
  if (!zadeva) return "Vpišite zadevo.";
  if (!html || !/<[a-z]/i.test(html)) return "Prilepite HTML kodo maila.";
  return null;
}

function odjemalec() {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) throw new Error("RESEND_API_KEY ni nastavljen.");
  return new Resend(kljuc);
}

export async function posljiTestENovice(prejsnje, formData) {
  await zahtevajAdmina();
  const p = preberi(formData);
  const napaka = preveri(p);
  if (napaka) return { stanje: "napaka", sporocilo: napaka };

  const prejemniki = (formData.get("test_naslovi") || "")
    .split(/[,;\s]+/)
    .map((x) => x.trim().toLowerCase())
    .filter((x) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x));
  if (prejemniki.length === 0) return { stanje: "napaka", sporocilo: "Vpišite vsaj en testni e-naslov." };
  if (prejemniki.length > 10) return { stanje: "napaka", sporocilo: "Test lahko pošljete največ na 10 naslovov." };

  // V testu odjavne povezave ni – placeholder zamenjamo, da ne ostane gola koda.
  const html = p.html.replaceAll("{{{RESEND_UNSUBSCRIBE_URL}}}", "https://assystem.si");

  try {
    const { error } = await odjemalec().emails.send({
      from: p.posiljatelj,
      to: prejemniki,
      replyTo: ODGOVOR_NA,
      subject: `[TEST] ${p.zadeva}`,
      html,
    });
    if (error) return { stanje: "napaka", sporocilo: `Resend: ${error.message}` };
  } catch (e) {
    return { stanje: "napaka", sporocilo: e.message };
  }
  return { stanje: "ok", sporocilo: `Test poslan na: ${prejemniki.join(", ")}` };
}

export async function posljiENoviceVsem(prejsnje, formData) {
  const admin = await zahtevajAdmina();
  const p = preberi(formData);
  const napaka = preveri(p);
  if (napaka) return { stanje: "napaka", sporocilo: napaka };

  const segmentId = formData.get("segment");
  if (!segmentId) return { stanje: "napaka", sporocilo: "Izberite segment (komu pošiljate)." };
  if (formData.get("potrditev") !== "on") {
    return { stanje: "napaka", sporocilo: "Obkljukajte potrditev, da res želite poslati vsem v segmentu." };
  }

  try {
    const { data, error } = await odjemalec().broadcasts.create({
      name: `${p.zadeva} · ${new Date().toISOString().slice(0, 10)} · ${admin.ime ?? "admin"}`,
      segmentId,
      from: p.posiljatelj,
      replyTo: ODGOVOR_NA,
      subject: p.zadeva,
      previewText: p.predogled,
      html: p.html,
      send: true,
    });
    if (error) return { stanje: "napaka", sporocilo: `Resend: ${error.message}` };
    return { stanje: "ok", sporocilo: `Poslano. ID kampanje v Resendu: ${data?.id}` };
  } catch (e) {
    return { stanje: "napaka", sporocilo: e.message };
  }
}

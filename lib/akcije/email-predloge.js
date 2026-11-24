"use server";

import { Resend } from "resend";
import { revalidatePath } from "@/lib/predpomnilnik";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { KLJUC_PREDLOGE, KONTAKT, POLJA, PRIMERI, PRIMERI_HTML, predlogaPoKljucu, sestaviHtml, zadevaIz, zdruziPredlogo } from "@/lib/email-predloge";
import { naloziShranjene } from "@/lib/email-predloge-streznik";

const POSILJATELJ = process.env.EMAIL_POSILJATELJ || "splet@assystem.si";

async function zapisi(vse) {
  const { error } = await supabaseAdmin()
    .from("nastavitve")
    .upsert({ kljuc: KLJUC_PREDLOGE, vrednost: JSON.stringify(vse) }, { onConflict: "kljuc" });
  return error;
}

export async function shraniPredlogo(_prej, formData) {
  const admin = await zahtevajAdmina();
  const kljuc = String(formData.get("kljuc") || "");
  const p = predlogaPoKljucu(kljuc);
  if (!p) return { napaka: "Neznana predloga." };
  const dejanje = formData.get("dejanje");
  const vse = await naloziShranjene();

  if (dejanje === "ponastavi") {
    delete vse[kljuc];
    const e = await zapisi(vse);
    if (e) return { napaka: e.message };
    revalidatePath("/admin/email-predloge");
    return { ok: "Vrnjeno na privzeto besedilo.", ponastavljeno: zdruziPredlogo(kljuc, {}) };
  }

  const nova = {};
  for (const { k } of POLJA) nova[k] = String(formData.get(k) ?? "").replace(/\r\n/g, "\n").slice(0, 4000);
  if (!nova.zadeva.trim()) return { napaka: "Zadeva ne sme biti prazna." };
  if (p.izklopljivo) nova.vklopljeno = formData.get("vklopljeno") === "on";
  vse[kljuc] = nova;
  const e = await zapisi(vse);
  if (e) return { napaka: e.message };
  revalidatePath("/admin/email-predloge");

  if (dejanje === "test") {
    const api = process.env.RESEND_API_KEY;
    if (!api) return { napaka: "Shranjeno, a Resend ni nastavljen — testno sporočilo ni poslano." };
    const t = zdruziPredlogo(kljuc, vse);
    const { error } = await new Resend(api).emails.send({
      from: `AS system <${POSILJATELJ}>`,
      to: [admin.email],
      replyTo: KONTAKT,
      subject: `[TEST] ${zadevaIz(t, PRIMERI)}`,
      html: sestaviHtml(t, { vrednosti: PRIMERI, html: PRIMERI_HTML, povezava: p.gumb ? "https://www.as-system.si/b2b" : null, vmes: p.kljuc === "narocilo_potrdilo" ? "<p style=\"color:#6e7276\"><i>[tukaj bo tabela artiklov in podatki o dostavi]</i></p>" : "" }),
    });
    if (error) return { napaka: "Shranjeno, a test ni uspel: " + error.message };
    return { ok: `Shranjeno. Testno sporočilo poslano na ${admin.email}.` };
  }
  return { ok: "Shranjeno — velja za vsa nova sporočila." };
}

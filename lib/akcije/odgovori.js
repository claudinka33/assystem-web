"use server";

import { Resend } from "resend";
import { revalidatePath } from "@/lib/predpomnilnik";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { site } from "@/lib/site";

const POSILJATELJ = process.env.EMAIL_POSILJATELJ || "splet@assystem.si";
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Odgovor stranki iz admina (Povpraševanja). Pošlje se prek Resenda v imenu prijavljenega
// zaposlenega: ime v »Od«, odgovori stranke gredo na njegov e-naslov (Reply-To), kopija mu pride v nabiralnik.
export async function odgovoriNaPovprasevanje(_prej, formData) {
  const admin = await zahtevajAdmina();
  const id = formData.get("id");
  const zadeva = String(formData.get("zadeva") ?? "").trim();
  const besedilo = String(formData.get("besedilo") ?? "").trim();
  if (!zadeva || !besedilo) return { stanje: "napaka", sporocilo: "Vpišite zadevo in besedilo." };

  const { data: p } = await supabaseAdmin().from("povprasevanja").select("*").eq("id", id).maybeSingle();
  if (!p?.email) return { stanje: "napaka", sporocilo: "Povpraševanje nima e-naslova stranke." };

  const priloge = [];
  let skupaj = 0;
  for (const f of formData.getAll("priloga")) {
    if (!f || typeof f === "string" || !f.size) continue;
    skupaj += f.size;
    if (skupaj > 4 * 1024 * 1024) return { stanje: "napaka", sporocilo: "Priloge so skupaj večje od 4 MB." };
    priloge.push({ filename: f.name, content: Buffer.from(await f.arrayBuffer()), tip: f.type });
  }

  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) return { stanje: "napaka", sporocilo: "Pošiljanje e-pošte ni nastavljeno (Resend)." };

  const ime = admin.ime || admin.email;
  const citat = p.sporocilo
    ? `<div style="margin-top:22px;padding:10px 14px;border-left:3px solid #d5d8dc;color:#6e767e;font-size:13px;white-space:pre-wrap;">${esc(p.sporocilo)}</div>`
    : "";
  const html = `
    <div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.55;color:#3f4140;">
      <div style="white-space:pre-wrap;">${esc(besedilo)}</div>
      <p style="margin-top:22px;border-top:1px solid #e3e5e8;padding-top:12px;font-size:13px;color:#6e767e;">
        <b style="color:#3f4140;">${esc(ime)}</b><br/>
        AS system d.o.o. · Obrtniška ulica 14, 3240 Šmarje pri Jelšah<br/>
        ${esc(site.telefon)} · <a href="mailto:${esc(admin.email)}" style="color:#c8102e;">${esc(admin.email)}</a> · <a href="https://www.as-system.si" style="color:#c8102e;">as-system.si</a>
      </p>
      ${citat}
    </div>`;

  try {
    const resend = new Resend(kljuc);
    const { error } = await resend.emails.send({
      from: `${ime} | AS system <${POSILJATELJ}>`,
      to: p.email,
      cc: admin.email,
      replyTo: admin.email,
      subject: zadeva,
      html,
      text: `${besedilo}\n\n--\n${ime}\nAS system d.o.o.\n${site.telefon} · ${admin.email}`,
      attachments: priloge.length ? priloge.map(({ filename, content }) => ({ filename, content })) : undefined,
    });
    if (error) return { stanje: "napaka", sporocilo: error.message || "Pošiljanje ni uspelo." };
  } catch (e) {
    return { stanje: "napaka", sporocilo: e.message || "Pošiljanje ni uspelo." };
  }

  // Priloge shranimo v zasebno shrambo, da so v zgodovini niti
  const shranjene = [];
  for (const [i, x] of priloge.entries()) {
    const pot = `odgovori/${id}/${Date.now()}-${i}-${x.filename.replace(/[^\w.\-]+/g, "_")}`;
    const { error: e } = await supabaseAdmin().storage.from("prijave").upload(pot, x.content, { contentType: x.tip || undefined });
    shranjene.push({ naziv: x.filename, datoteka: e ? null : pot });
  }
  const odgovor = { cas: new Date().toISOString(), od: ime, od_email: admin.email, zadeva, besedilo, priloge: shranjene };

  // Odgovor dodamo v zgodovino; vsa nova povpraševanja te stranke gredo v obdelavo
  const { error: napakaZgod } = await supabaseAdmin()
    .from("povprasevanja")
    .update({ odgovori: [...(p.odgovori ?? []), odgovor] })
    .eq("id", id);
  if (napakaZgod) {
    // stolpec »odgovori« še ne obstaja: zapis vsaj v opombo
    const zapis = `${new Date().toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana" })}: odgovoril/a ${ime}`;
    await supabaseAdmin().from("povprasevanja").update({ opomba: [p.opomba, zapis].filter(Boolean).join("\n") }).eq("id", id);
  }
  await supabaseAdmin().from("povprasevanja").update({ status: "v obdelavi" }).ilike("email", p.email).eq("status", "novo");
  revalidatePath("/admin/povprasevanja");
  revalidatePath("/admin");
  return { stanje: "ok", sporocilo: `Poslano na ${p.email}. Kopija je v vašem nabiralniku, odgovori stranke pridejo k vam.` };
}

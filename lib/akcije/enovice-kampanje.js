"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { supabaseAdmin } from "@/lib/supabase-server";
import { osveziStatistiko } from "@/lib/enovice-statistika";

// E-novice: kampanje se shranjujejo v Supabase (enovice_kampanje),
// pošiljajo pa prek Resend Broadcast (takoj ali načrtovano).
// Resend sam doda odjavno povezavo namesto {{{RESEND_UNSUBSCRIBE_URL}}}
// in izpusti odjavljene kontakte.

const ODGOVOR_NA = "info@as-system.si";
const UNSUB = "{{{RESEND_UNSUBSCRIBE_URL}}}";
const POT = "/admin/e-novice";

export async function privzetiPosiljatelj() {
  return process.env.EMAIL_NOVICE || `AS system <${process.env.EMAIL_POSILJATELJ || "splet@assystem.si"}>`;
}

function odjemalec() {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) throw new Error("RESEND_API_KEY ni nastavljen.");
  return new Resend(kljuc);
}

const tabela = () => supabaseAdmin().from("enovice_kampanje");

async function preberiKampanjo(id) {
  const { data, error } = await tabela().select("*").eq("id", id).single();
  if (error || !data) throw new Error("Kampanja ne obstaja.");
  return data;
}

// Polja, ki jih urejevalnik sme spremeniti.
function cistiVsebino(p = {}) {
  const out = {};
  if ("naziv" in p) out.naziv = String(p.naziv ?? "").trim() || null;
  if ("zadeva" in p) out.zadeva = String(p.zadeva ?? "").trim();
  if ("predogled" in p) out.predogled = String(p.predogled ?? "").trim() || null;
  if ("posiljatelj" in p) out.posiljatelj = String(p.posiljatelj ?? "").trim() || null;
  if ("html" in p) out.html = String(p.html ?? "");
  if ("bloki" in p) out.bloki = p.bloki ?? null;
  if ("nacin" in p && ["html", "bloki"].includes(p.nacin)) out.nacin = p.nacin;
  if ("segment_id" in p) out.segment_id = p.segment_id || null;
  if ("segment_ime" in p) out.segment_ime = p.segment_ime || null;
  return out;
}

function preveriZaPosiljanje(k) {
  if (!k.zadeva?.trim()) return "Vpišite zadevo.";
  if (!k.html || !/<[a-z]/i.test(k.html)) return "Mail nima vsebine (HTML).";
  return null;
}

// ---------------- osnutki ----------------

export async function novaKampanja(formData) {
  const admin = await zahtevajAdmina();
  const izId = formData?.get?.("iz");
  let podatki = { zadeva: "", status: "osnutek", ustvaril: admin.ime ?? admin.email };

  if (izId) {
    const vir = await preberiKampanjo(izId);
    podatki = {
      ...podatki,
      naziv: vir.status === "predloga" ? null : vir.naziv ? `${vir.naziv} (kopija)` : null,
      zadeva: vir.zadeva,
      predogled: vir.predogled,
      posiljatelj: vir.posiljatelj,
      nacin: vir.nacin,
      html: vir.html,
      bloki: vir.bloki,
      segment_id: vir.segment_id,
      segment_ime: vir.segment_ime,
    };
  } else if (formData?.get?.("nacin") === "bloki") {
    podatki.nacin = "bloki";
  }

  const { data, error } = await tabela().insert(podatki).select("id").single();
  if (error) {
    if (/enovice_kampanje/.test(error.message)) throw new Error("V bazi še ni tabele enovice_kampanje — zaženi SQL 43-enovice-kampanje.sql.");
    throw new Error(error.message);
  }
  revalidatePath(POT);
  redirect(`${POT}/${data.id}`);
}

// Samodejno shranjevanje iz urejevalnika.
export async function shraniKampanjo(id, vsebina) {
  await zahtevajAdmina();
  const k = await preberiKampanjo(id);
  if (!["osnutek", "predloga"].includes(k.status)) {
    return { ok: false, napaka: "Kampanja je že poslana ali načrtovana — sprememb ni mogoče shraniti." };
  }
  const posodobljeno = new Date().toISOString();
  const { error } = await tabela()
    .update({ ...cistiVsebino(vsebina), posodobljeno })
    .eq("id", id);
  if (error) return { ok: false, napaka: error.message };
  return { ok: true, posodobljeno };
}

export async function podvojiKampanjo(formData) {
  return novaKampanja(formData);
}

export async function shraniKotPredlogo(id, vsebina) {
  const admin = await zahtevajAdmina();
  const k = await preberiKampanjo(id);
  const v = { ...k, ...cistiVsebino(vsebina) };
  const ime = String(vsebina?.ime_predloge || v.naziv || v.zadeva || "Predloga").trim();
  const { error } = await tabela().insert({
    naziv: ime,
    zadeva: v.zadeva ?? "",
    predogled: v.predogled,
    posiljatelj: v.posiljatelj,
    nacin: v.nacin,
    html: v.html,
    bloki: v.bloki,
    status: "predloga",
    ustvaril: admin.ime ?? admin.email,
  });
  if (error) return { ok: false, napaka: error.message };
  revalidatePath(POT);
  return { ok: true, sporocilo: `Shranjeno kot predloga »${ime}«.` };
}

export async function izbrisiKampanjo(formData) {
  await zahtevajAdmina();
  const id = formData.get("id");
  const k = await preberiKampanjo(id);
  if (!["osnutek", "predloga"].includes(k.status)) {
    throw new Error("Poslanih ali načrtovanih kampanj ni mogoče izbrisati.");
  }
  await tabela().delete().eq("id", id);
  revalidatePath(POT);
  if (formData.get("nazaj")) redirect(POT);
}

// ---------------- test ----------------

export async function posljiTest(id, vsebina, naslovi) {
  await zahtevajAdmina();
  const shr = await shraniKampanjo(id, vsebina);
  if (!shr.ok) return { stanje: "napaka", sporocilo: shr.napaka };
  const k = await preberiKampanjo(id);
  const napaka = preveriZaPosiljanje(k);
  if (napaka) return { stanje: "napaka", sporocilo: napaka };

  const prejemniki = String(naslovi || "")
    .split(/[,;\s]+/)
    .map((x) => x.trim().toLowerCase())
    .filter((x) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x));
  if (prejemniki.length === 0) return { stanje: "napaka", sporocilo: "Vpišite vsaj en testni e-naslov." };
  if (prejemniki.length > 10) return { stanje: "napaka", sporocilo: "Test lahko pošljete največ na 10 naslovov." };

  try {
    const { error } = await odjemalec().emails.send({
      from: k.posiljatelj || (await privzetiPosiljatelj()),
      to: prejemniki,
      replyTo: ODGOVOR_NA,
      subject: `[TEST] ${k.zadeva}`,
      html: k.html.replaceAll(UNSUB, "https://assystem.si"),
    });
    if (error) return { stanje: "napaka", sporocilo: `Resend: ${error.message}` };
  } catch (e) {
    return { stanje: "napaka", sporocilo: e.message };
  }
  return { stanje: "ok", sporocilo: `Test poslan na: ${prejemniki.join(", ")}` };
}

// ---------------- pošiljanje / načrtovanje ----------------

// kdaj: null = takoj, sicer ISO čas (pretvorjen v brskalniku iz lokalnega časa)
export async function posljiKampanjo(id, vsebina, { segmentId, segmentIme, kdaj, potrjeno }) {
  const admin = await zahtevajAdmina();
  if (!potrjeno) return { stanje: "napaka", sporocilo: "Obkljukajte potrditev, da je test pregledan." };
  if (!segmentId) return { stanje: "napaka", sporocilo: "Izberite segment (komu pošiljate)." };

  let nacrt = null;
  if (kdaj) {
    const d = new Date(kdaj);
    if (Number.isNaN(d.getTime())) return { stanje: "napaka", sporocilo: "Neveljaven čas pošiljanja." };
    if (d.getTime() < Date.now() + 2 * 60 * 1000) {
      return { stanje: "napaka", sporocilo: "Čas pošiljanja mora biti vsaj 2 minuti v prihodnosti." };
    }
    if (d.getTime() > Date.now() + 30 * 24 * 3600 * 1000) {
      return { stanje: "napaka", sporocilo: "Načrtujete lahko največ 30 dni vnaprej." };
    }
    nacrt = d.toISOString();
  }

  const shr = await shraniKampanjo(id, { ...vsebina, segment_id: segmentId, segment_ime: segmentIme });
  if (!shr.ok) return { stanje: "napaka", sporocilo: shr.napaka };
  const k = await preberiKampanjo(id);
  const napaka = preveriZaPosiljanje(k);
  if (napaka) return { stanje: "napaka", sporocilo: napaka };

  try {
    const { data, error } = await odjemalec().broadcasts.create({
      name: `${k.naziv || k.zadeva} · #${k.id} · ${admin.ime ?? "admin"}`,
      segmentId,
      from: k.posiljatelj || (await privzetiPosiljatelj()),
      replyTo: ODGOVOR_NA,
      subject: k.zadeva,
      previewText: k.predogled || undefined,
      html: k.html,
      send: true,
      ...(nacrt ? { scheduledAt: nacrt } : {}),
    });
    if (error) return { stanje: "napaka", sporocilo: `Resend: ${error.message}` };

    await tabela()
      .update({
        resend_broadcast_id: data.id,
        status: nacrt ? "nacrtovano" : "poslano",
        nacrtovano_za: nacrt,
        poslano_ob: nacrt ? null : new Date().toISOString(),
        posodobljeno: new Date().toISOString(),
      })
      .eq("id", id);
  } catch (e) {
    return { stanje: "napaka", sporocilo: e.message };
  }

  revalidatePath(POT);
  revalidatePath(`${POT}/${id}`);
  return {
    stanje: "ok",
    sporocilo: nacrt
      ? `Načrtovano za ${new Date(nacrt).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana" })}.`
      : "Poslano. Statistika bo vidna v nekaj minutah.",
  };
}

// Prekliči načrtovano pošiljanje → kampanja se vrne med osnutke.
export async function prekliciNacrt(formData) {
  await zahtevajAdmina();
  const id = formData.get("id");
  const k = await preberiKampanjo(id);
  if (k.status !== "nacrtovano") return;
  if (k.resend_broadcast_id) {
    const r = odjemalec();
    const { error } = await r.broadcasts.cancel(k.resend_broadcast_id);
    if (error && !/not.*(scheduled|found)/i.test(error.message)) throw new Error(`Resend: ${error.message}`);
    await r.broadcasts.remove(k.resend_broadcast_id).catch(() => {});
  }
  await tabela()
    .update({ status: "osnutek", resend_broadcast_id: null, nacrtovano_za: null, posodobljeno: new Date().toISOString() })
    .eq("id", id);
  revalidatePath(POT);
  revalidatePath(`${POT}/${id}`);
}

// Načrtovane, ki jim je čas že potekel, preveri v Resendu in označi kot poslane.
export async function osveziNacrtovane() {
  await zahtevajAdmina();
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("enovice_kampanje")
    .select("id, resend_broadcast_id, nacrtovano_za")
    .eq("status", "nacrtovano")
    .lt("nacrtovano_za", new Date().toISOString());
  if (!data?.length) return;
  let r;
  try {
    r = odjemalec();
  } catch {
    return;
  }
  await Promise.all(
    data.map(async (k) => {
      if (!k.resend_broadcast_id) return;
      const { data: b } = await r.broadcasts.get(k.resend_broadcast_id).catch(() => ({}));
      if (b?.status === "sent") {
        await sb
          .from("enovice_kampanje")
          .update({ status: "poslano", poslano_ob: b.sent_at || k.nacrtovano_za })
          .eq("id", k.id);
      }
    })
  );
}


// Nov (prazen) osnutek za iste prejemnike kot poslana kampanja – brez odbitih,
// odjavljenih in prijav spama. Prejemnike uvozimo v nov Resend segment.
export async function istimPrejemnikom(id) {
  const admin = await zahtevajAdmina();
  const k = await preberiKampanjo(id);
  if (k.status !== "poslano") return { ok: false, napaka: "Kampanja še ni poslana." };

  try {
    await osveziStatistiko(k);
  } catch (e) {
    return { ok: false, napaka: e.message };
  }

  const { data: prejemniki, error } = await supabaseAdmin()
    .from("enovice_prejemniki")
    .select("email")
    .eq("kampanja_id", id)
    .eq("dostavljeno", true)
    .eq("odjavljen", false)
    .eq("pritozba", false)
    .is("odbit", null);
  if (error) return { ok: false, napaka: error.message };
  if (!prejemniki?.length) return { ok: false, napaka: "Ni dostavljenih prejemnikov." };

  const r = odjemalec();
  const ime = `${k.segment_ime || "Prejemniki"} · brez odbitih · #${k.id}`.slice(0, 120);
  const { data: seg, error: e1 } = await r.segments.create({ name: ime });
  if (e1) return { ok: false, napaka: `Resend (segment): ${e1.message}` };

  const csv = ["email", ...prejemniki.map((x) => `"${x.email.replace(/"/g, '""')}"`)].join("\n");
  const { error: e2 } = await r.contacts.imports.create({
    file: new Blob([csv], { type: "text/csv" }),
    columnMap: { email: "email" },
    onConflict: "upsert",
    segments: [{ id: seg.id }],
  });
  if (e2) return { ok: false, napaka: `Resend (uvoz): ${e2.message}` };

  const { data: nova, error: e3 } = await tabela()
    .insert({
      naziv: `Isti prejemniki kot #${k.id} (brez odbitih)`,
      zadeva: "",
      posiljatelj: k.posiljatelj,
      nacin: "html",
      html: "",
      segment_id: seg.id,
      segment_ime: ime,
      status: "osnutek",
      nadrejena_id: k.id,
      ustvaril: admin.ime ?? admin.email,
    })
    .select("id")
    .single();
  if (e3) return { ok: false, napaka: e3.message };

  revalidatePath(POT);
  return { ok: true, id: nova.id, stevilo: prejemniki.length };
}

// ---------------- sledljivost ----------------

export async function osveziStatistikoKampanje(id) {
  await zahtevajAdmina();
  try {
    const k = await preberiKampanjo(id);
    const r = await osveziStatistiko(k);
    return { ok: true, ...r };
  } catch (e) {
    return { ok: false, napaka: e.message };
  }
}

// Nov osnutek, ki gre samo tistim, ki so mail prejeli, a ga niso odprli.
// Prejemnike uvozimo v nov Resend segment »Niso odprli · …«.
export async function ponovnoNeodprtim(id) {
  const admin = await zahtevajAdmina();
  const k = await preberiKampanjo(id);
  if (k.status !== "poslano") return { ok: false, napaka: "Kampanja še ni poslana." };

  try {
    await osveziStatistiko(k);
  } catch (e) {
    return { ok: false, napaka: e.message };
  }

  const { data: neodprli, error } = await supabaseAdmin()
    .from("enovice_prejemniki")
    .select("email")
    .eq("kampanja_id", id)
    .eq("dostavljeno", true)
    .eq("odprl", 0)
    .eq("odjavljen", false)
    .eq("pritozba", false)
    .is("odbit", null);
  if (error) return { ok: false, napaka: error.message };
  if (!neodprli?.length) return { ok: false, napaka: "Vsi prejemniki so mail že odprli (ali ni podatkov o odpiranju)." };

  const r = odjemalec();
  const ime = `Niso odprli · ${k.zadeva}`.slice(0, 90) + ` · #${k.id}`;
  const { data: seg, error: e1 } = await r.segments.create({ name: ime });
  if (e1) return { ok: false, napaka: `Resend (segment): ${e1.message}` };

  const csv = ["email", ...neodprli.map((x) => `"${x.email.replace(/"/g, '""')}"`)].join("\n");
  const { error: e2 } = await r.contacts.imports.create({
    file: new Blob([csv], { type: "text/csv" }),
    columnMap: { email: "email" },
    onConflict: "upsert",
    segments: [{ id: seg.id }],
  });
  if (e2) return { ok: false, napaka: `Resend (uvoz): ${e2.message}` };

  const { data: nova, error: e3 } = await tabela()
    .insert({
      naziv: `Ponovno neodprtim – ${k.naziv || k.zadeva}`,
      zadeva: k.zadeva,
      predogled: k.predogled,
      posiljatelj: k.posiljatelj,
      nacin: k.nacin,
      html: k.html,
      bloki: k.bloki,
      segment_id: seg.id,
      segment_ime: ime,
      status: "osnutek",
      nadrejena_id: k.id,
      ustvaril: admin.ime ?? admin.email,
    })
    .select("id")
    .single();
  if (e3) return { ok: false, napaka: e3.message };

  revalidatePath(POT);
  return { ok: true, id: nova.id, stevilo: neodprli.length };
}

// ---------------- blok urejevalnik: izdelki iz kataloga ----------------

export async function iskanjeIzdelkovZaMail(niz) {
  await zahtevajAdmina();
  const q = String(niz || "").trim().replace(/[%,()]/g, " ");
  let poizvedba = supabaseAdmin()
    .from("izdelki")
    .select("id, naziv, slug, slika_url, kratek_opis, kategorije(slug)")
    .order("naziv")
    .limit(12);
  if (q) poizvedba = poizvedba.ilike("naziv", `%${q}%`);
  const { data, error } = await poizvedba;
  if (error) return { napaka: error.message, izdelki: [] };
  return {
    izdelki: (data ?? []).map((i) => ({
      id: i.id,
      naziv: i.naziv,
      slika: i.slika_url ?? "",
      opis: i.kratek_opis ?? "",
      povezava: i.kategorije?.slug ? `https://assystem.si/program/${i.kategorije.slug}/${i.slug}` : "",
    })),
  };
}

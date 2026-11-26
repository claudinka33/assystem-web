"use server";

import { revalidatePath } from "@/lib/predpomnilnik";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { supabaseAdmin } from "@/lib/supabase-server";
import { osveziStatistiko } from "@/lib/enovice-statistika";
import { vsiKontakti } from "@/lib/enovice-resend";
import { povezavaOdjave } from "@/lib/enovice-odjava";
import { izkljucitve, jeIzkljucen } from "@/lib/baza";
import { osnovaUrl } from "@/lib/b2b";

// E-novice: kampanje se shranjujejo v Supabase (enovice_kampanje),
// pošiljajo pa prek Resend Broadcast (takoj ali načrtovano).
// Resend sam doda odjavno povezavo namesto {{{RESEND_UNSUBSCRIBE_URL}}}
// in izpusti odjavljene kontakte.

const ODGOVOR_NA = "tjasa.mihevc@as-system.si";
// Mailing lahko določi svoj naslov za odgovore z <meta name="odgovor-na" content="ime@as-system.si"> v HTML-ju.
function odgovorNa(html) {
  const m = String(html || "").match(/<meta\s+name=["']odgovor-na["']\s+content=["']([^"'\s]+@[^"'\s]+)["']/i);
  return m ? m[1].trim() : ODGOVOR_NA;
}
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
    if (/enovice_kampanje/.test(error.message)) throw new Error("V bazi še ni tabele enovice_kampanje, zaženi SQL 43-enovice-kampanje.sql.");
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
    return { ok: false, napaka: "Kampanja je že poslana ali načrtovana, sprememb ni mogoče shraniti." };
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
      replyTo: odgovorNa(k.html),
      subject: `[TEST] ${k.zadeva}`,
      html: k.html.replaceAll(UNSUB, "https://www.as-system.si"),
    });
    if (error) return { stanje: "napaka", sporocilo: `Resend: ${error.message}` };
  } catch (e) {
    return { stanje: "napaka", sporocilo: e.message };
  }
  return { stanje: "ok", sporocilo: `Test poslan na: ${prejemniki.join(", ")}` };
}

// ---------------- pošiljanje / načrtovanje ----------------

// kdaj: null = takoj, sicer ISO čas (pretvorjen v brskalniku iz lokalnega časa)
// Mailing se pošlje kot POSAMEZNI maili prek Resend transakcijskega paketa (batch po 100),
// ker Resend broadcasti štejejo kontakte (brezplačni marketinški paket = 1.000 kontaktov).
// Prejemniki = unija izbranih baz (Resend segmentov), brez odjavljenih v Resendu in neaktivnih v Bazi kontaktov.
// Vsak prejemnik dobi svojo odjavno povezavo (/api/odjava). Statistika pride prek webhooka (/api/resend-webhook).
const pocakaj = (ms) => new Promise((res) => setTimeout(res, ms));
const OZNAKA_POSAMEZNO = "posamezno";

async function neaktivniVBazi() {
  const sb = supabaseAdmin();
  const set = new Set();
  for (let od = 0; ; od += 1000) {
    const { data, error } = await sb.from("baza_kontakti").select("email").eq("odjavljen", true).range(od, od + 999);
    if (error) break;
    for (const x of data ?? []) set.add(String(x.email).toLowerCase());
    if (!data || data.length < 1000) break;
  }
  return set;
}

// Webhook za sledenje (odprtja, kliki …) — ustvari se enkrat, skrivnost se shrani v nastavitve.
async function zagotoviSledenje(r) {
  const sb = supabaseAdmin();
  const { data } = await sb.from("nastavitve").select("vrednost").eq("kljuc", "resend_webhook").maybeSingle();
  if (data?.vrednost) return;
  const { data: wh, error } = await r.webhooks.create({
    endpoint: `${osnovaUrl()}/api/resend-webhook`,
    events: ["email.delivered", "email.opened", "email.clicked", "email.bounced", "email.complained", "email.suppressed", "email.failed"],
  });
  if (error) throw new Error(`Resend (webhook za statistiko): ${error.message}`);
  await sb.from("nastavitve").upsert({ kljuc: "resend_webhook", vrednost: JSON.stringify({ id: wh.id, secret: wh.signing_secret }) }, { onConflict: "kljuc" });
}

async function posljiBatch(r, paket) {
  for (let i = 0; i < 5; i++) {
    const res = await r.batch.send(paket);
    const err = res?.error;
    if (!err) return res;
    if (/rate|429|too many/i.test(`${err.name ?? ""} ${err.message ?? ""} ${err.statusCode ?? ""}`)) {
      await pocakaj(1500 * (i + 1));
      continue;
    }
    return res;
  }
  return r.batch.send(paket);
}

export async function posljiKampanjo(id, vsebina, { segmentId, segmentIds, segmentIme, kdaj, potrjeno }) {
  await zahtevajAdmina();
  if (!potrjeno) return { stanje: "napaka", sporocilo: "Obkljukajte potrditev, da je test pregledan." };
  const izbrane = [...new Set((segmentIds?.length ? segmentIds : [segmentId]).filter(Boolean))];
  if (!izbrane.length) return { stanje: "napaka", sporocilo: "Izberite vsaj eno bazo (komu pošiljate)." };
  if (kdaj) return { stanje: "napaka", sporocilo: "Načrtovanje trenutno ni na voljo — izberite »Pošlji zdaj«." };

  const shr = await shraniKampanjo(id, { ...vsebina, segment_id: izbrane[0], segment_ime: segmentIme });
  if (!shr.ok) return { stanje: "napaka", sporocilo: shr.napaka };
  const k = await preberiKampanjo(id);
  const napaka = preveriZaPosiljanje(k);
  if (napaka) return { stanje: "napaka", sporocilo: napaka };

  const r = odjemalec();

  // 1) prejemniki
  let prejemniki;
  try {
    const neaktivni = await neaktivniVBazi();
    const izk = await izkljucitve();
    const vsi = new Set();
    for (const sid of izbrane) {
      for (const c of await vsiKontakti(r, sid)) {
        const e = String(c.email || "").trim().toLowerCase();
        if (e && !c.unsubscribed && !neaktivni.has(e) && !jeIzkljucen(e, izk) && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) vsi.add(e);
      }
    }
    prejemniki = [...vsi];
  } catch (e) {
    return { stanje: "napaka", sporocilo: `Prejemnikov ni bilo mogoče prebrati: ${e.message}` };
  }
  if (!prejemniki.length) return { stanje: "napaka", sporocilo: "Izbrane baze nimajo prijavljenih prejemnikov." };

  // 2) sledenje (webhook) — brez tega ni statistike, mail pa se vseeno lahko pošlje
  let opozorilo = "";
  try {
    await zagotoviSledenje(r);
  } catch (e) {
    opozorilo = ` Statistika ne bo delovala: ${e.message}`;
  }

  // 3) zaklenemo kampanjo (prepreči dvojno pošiljanje ob dvojnem kliku)
  const { data: zaklep } = await tabela()
    .update({ status: "poslano", resend_broadcast_id: OZNAKA_POSAMEZNO, poslano_ob: new Date().toISOString(), nacrtovano_za: null, posodobljeno: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "osnutek")
    .select("id");
  if (!zaklep?.length) return { stanje: "napaka", sporocilo: "Kampanja se že pošilja ali je že poslana." };

  const sb = supabaseAdmin();
  await sb.from("enovice_prejemniki").delete().eq("kampanja_id", id);
  for (let i = 0; i < prejemniki.length; i += 500) {
    await sb.from("enovice_prejemniki").insert(prejemniki.slice(i, i + 500).map((email) => ({ kampanja_id: id, email })));
  }

  // 4) pošiljanje po 100
  const od = k.posiljatelj || (await privzetiPosiljatelj());
  let poslanih = 0;
  const napake = [];
  for (let i = 0; i < prejemniki.length; i += 100) {
    const paket = prejemniki.slice(i, i + 100).map((email) => {
      const odjava = povezavaOdjave(email, id);
      return {
        from: od,
        to: [email],
        replyTo: odgovorNa(k.html),
        subject: k.zadeva,
        html: k.html.replaceAll(UNSUB, odjava),
        headers: { "List-Unsubscribe": `<${odjava}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
        tags: [{ name: "kampanja", value: String(id) }],
      };
    });
    try {
      const { error } = await posljiBatch(r, paket);
      if (error) napake.push(`${i + 1}–${i + paket.length}: ${error.message}`);
      else poslanih += paket.length;
    } catch (e) {
      napake.push(`${i + 1}–${i + paket.length}: ${e.message}`);
    }
    await pocakaj(150);
  }

  await tabela()
    .update({ statistika: { prejemniki: poslanih, dostavljeno: 0, odprli: 0, kliknili: 0, odbiti: 0, pritozbe: 0, odjave: 0, zavrnjeni: 0, povezave: [], napake }, statistika_ob: new Date().toISOString() })
    .eq("id", id);

  revalidatePath(POT);
  revalidatePath(`${POT}/${id}`);
  if (napake.length && !poslanih) {
    return { stanje: "napaka", sporocilo: `Pošiljanje ni uspelo: ${napake[0]}` };
  }
  return {
    stanje: napake.length ? "napaka" : "ok",
    sporocilo: napake.length
      ? `Poslano ${poslanih} od ${prejemniki.length}. Napake: ${napake.join("; ")}`
      : `Poslano ${poslanih} prejemnikom. Statistika se polni sproti.${opozorilo}`,
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
      povezava: i.kategorije?.slug ? `https://www.as-system.si/program/${i.kategorije.slug}/${i.slug}` : "",
    })),
  };
}

// Kontakti vseh baz (samo prijavljeni), da urejevalnik sproti šteje prejemnike ob klikanju baz.
// Vrne { segmentId: [emaili] } — štetje unije (brez podvojenih) naredi brskalnik.
export async function kontaktiBaz(segmentIds = []) {
  await zahtevajAdmina();
  try {
    const r = odjemalec();
    const izk = await izkljucitve();
    const poBazah = {};
    for (const sid of [...new Set((segmentIds ?? []).filter(Boolean))]) {
      const kontakti = await vsiKontakti(r, sid);
      poBazah[sid] = [
        ...new Set(kontakti.filter((c) => c.email && !c.unsubscribed && !jeIzkljucen(c.email, izk)).map((c) => String(c.email).trim().toLowerCase())),
      ];
    }
    return { ok: true, poBazah };
  } catch (e) {
    return { ok: false, napaka: e.message };
  }
}

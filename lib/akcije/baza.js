"use server";

import { revalidatePath } from "@/lib/predpomnilnik";
import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { klic, resendOdjemalec, vsiKontakti, vsePanoge } from "@/lib/enovice-resend";

const POT = "/admin/baza";
// Panoga »AS system (mi)« — zaposleni. Ti kontakti so v VSAKEM Resend segmentu,
// da vsak mailing dobimo tudi mi (kontrolna kopija).
const PANOGA_MI = 999;
const PANOGA_TRGOVINA_NI_MAILINGA = 23; // samo za enkraten popravek (glej uskladiZResend)
const POPRAVEK_23 = "baza_popravek_23_ponovna_prijava";
const EMAIL = /[A-Z0-9._%+'-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const t = (v) => String(v ?? "").trim();
const zdaj = () => new Date().toISOString();

// Hitra izbira panoge v seznamu (zamenja vse panoge kontakta). sifre = [] → nerazvrščen.
export async function nastaviPanoge(email, sifre) {
  await zahtevajAdmina();
  const panoge = (Array.isArray(sifre) ? sifre : []).map(Number).filter(Number.isFinite);
  const { error } = await supabaseAdmin().from("baza_kontakti").update({ panoge, posodobljeno: zdaj() }).eq("email", email);
  if (error) return { napaka: error.message };
  revalidatePath(POT);
  return { ok: true };
}

// Dodaj ali uredi kontakt (obrazec). Pri urejanju se lahko spremeni tudi e-naslov.
export async function shraniKontakt(_prej, formData) {
  await zahtevajAdmina();
  const prejsnji = t(formData.get("prejsnji")).toLowerCase();
  const email = t(formData.get("email")).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { napaka: "E-naslov ni pravilen." };
  const podatki = {
    email,
    ime: t(formData.get("ime")) || null,
    podjetje: t(formData.get("podjetje")) || null,
    telefon: t(formData.get("telefon")) || null,
    davcna: t(formData.get("davcna")).replace(/\D/g, "") || null,
    opomba: t(formData.get("opomba")) || null,
    poslovalnica: t(formData.get("poslovalnica")) || null,
    kraj: t(formData.get("kraj")) || null,
    posta: t(formData.get("posta")) || null,
    panoge: formData.getAll("panoge").map(Number).filter(Number.isFinite),
    soglasje: formData.get("soglasje") === "on",
    odjavljen: formData.get("odjavljen") === "on",
    posodobljeno: zdaj(),
  };
  const sb = supabaseAdmin();
  if (prejsnji) {
    if (prejsnji !== email) {
      const { data: zaseden } = await sb.from("baza_kontakti").select("email").eq("email", email).maybeSingle();
      if (zaseden) return { napaka: `${email} je že v bazi.` };
    }
    const { error } = await sb.from("baza_kontakti").update(podatki).eq("email", prejsnji);
    if (error) return { napaka: error.message };
    // Stanje (aktiven/neaktiven) prenesemo tudi v Resend, sicer bi kontakt v starih segmentih še dobival maile.
    try {
      await klic(() => resendOdjemalec().contacts.update({ email, unsubscribed: podatki.odjavljen }));
    } catch {}
  } else {
    const { data: obst } = await sb.from("baza_kontakti").select("email").eq("email", email).maybeSingle();
    if (obst) return { napaka: `${email} je že v bazi — poišči ga in uredi.` };
    const { error } = await sb.from("baza_kontakti").insert({ ...podatki, vir: "ročno" });
    if (error) return { napaka: /baza_kontakti/.test(error.message) ? "Najprej zaženi SQL 52-baza-kontaktov.sql." : error.message };
  }
  revalidatePath(POT);
  return { ok: true, sporocilo: prejsnji ? "Kontakt shranjen." : `Dodan ${email}.` };
}

export async function izbrisiKontaktIzBaze(formData) {
  await zahtevajAdmina();
  const email = t(formData.get("id")).toLowerCase();
  await supabaseAdmin().from("baza_kontakti").delete().eq("email", email);
  // tudi iz Resenda, da ne dobi več mailingov
  try {
    await klic(() => resendOdjemalec().contacts.remove({ email }));
  } catch {}
  revalidatePath(POT);
}

// Uvoz: prilepljeno besedilo (iz Excela) → kontakti v izbrano panogo. Obstoječim panogo doda.
export async function uvoziVBazo(_prej, formData) {
  await zahtevajAdmina();
  const panoga = Number(formData.get("panoga")) || null;
  const vrstice = t(formData.get("besedilo")).split(/\r?\n/);
  const novi = new Map();
  for (const v of vrstice) {
    const najdeni = v.match(EMAIL);
    if (!najdeni) continue;
    const ostalo = najdeni.length === 1 ? v.replace(najdeni[0], "").split(/[\t;|]+/).map((x) => x.replace(/[<>"]/g, "").trim()).filter(Boolean) : [];
    for (const e of najdeni) {
      const email = e.toLowerCase();
      if (!novi.has(email)) novi.set(email, { email, ime: ostalo[0] || null, podjetje: ostalo[1] || null });
    }
  }
  if (!novi.size) return { napaka: "V besedilu ni nobenega e-naslova." };
  const sb = supabaseAdmin();
  const seznam = [...novi.values()];
  const obstojeci = new Map();
  for (let i = 0; i < seznam.length; i += 500) {
    const { data, error } = await sb.from("baza_kontakti").select("email, panoge").in("email", seznam.slice(i, i + 500).map((x) => x.email));
    if (error) return { napaka: /baza_kontakti/.test(error.message) ? "Najprej zaženi SQL 52-baza-kontaktov.sql." : error.message };
    for (const r of data ?? []) obstojeci.set(r.email, r.panoge ?? []);
  }
  const vstavi = seznam.filter((x) => !obstojeci.has(x.email)).map((x) => ({ ...x, vir: "uvoz", panoge: panoga ? [panoga] : [] }));
  for (let i = 0; i < vstavi.length; i += 500) await sb.from("baza_kontakti").insert(vstavi.slice(i, i + 500));
  let dop = 0;
  if (panoga) {
    for (const [email, p] of obstojeci) {
      if (p.includes(panoga)) continue;
      await sb.from("baza_kontakti").update({ panoge: [...p, panoga], posodobljeno: zdaj() }).eq("email", email);
      dop++;
    }
  }
  revalidatePath(POT);
  return { ok: true, sporocilo: `Novih ${vstavi.length}, že v bazi ${obstojeci.size}${panoga ? ` (panoga dodana ${dop})` : ""}.` };
}

// Uskladitev z Resendom (iz njega se pošiljajo mailingi):
// 1) odjave iz Resenda → baza (odjavljen), kontakti iz Resenda, ki jih v bazi ni → baza (nerazvrščeni)
// 2) vsaka panoga → Resend segment »Baza · <panoga>« (uvoz CSV, prijavljeni kontakti)
export async function uskladiZResend() {
  await zahtevajAdmina();
  const sb = supabaseAdmin();
  let r;
  try {
    r = resendOdjemalec();
  } catch (e) {
    return { napaka: e.message };
  }
  const vResend = await vsiKontakti(r);
  const vBazi = new Map();
  for (let od = 0; ; od += 1000) {
    const { data, error } = await sb.from("baza_kontakti").select("email, ime, podjetje, panoge, odjavljen").range(od, od + 999);
    if (error) return { napaka: /baza_kontakti/.test(error.message) ? "Najprej zaženi SQL 52-baza-kontaktov.sql." : error.message };
    for (const k of data ?? []) vBazi.set(k.email, k);
    if (!data || data.length < 1000) break;
  }
  let odjav = 0, dodanih = 0;
  const noviIzResenda = [];
  // Enkraten popravek: prejšnja verzija je »Trgovina ni mailinga« v Resendu izklopila, čeprav so v bazi aktivni.
  // Te ponovno prijavimo (samo enkrat, nato se zapiše v nastavitve), sicer bi jih spodnji korak označil kot odjavljene.
  const { data: popr } = await sb.from("nastavitve").select("vrednost").eq("kljuc", POPRAVEK_23).maybeSingle();
  let ponovnoPrijavljenih = 0;
  if (!popr) {
    for (const c of vResend) {
      const b = vBazi.get(String(c.email).toLowerCase());
      if (!b || !c.unsubscribed || b.odjavljen || !(b.panoge ?? []).includes(PANOGA_TRGOVINA_NI_MAILINGA)) continue;
      const { error } = await klic(() => r.contacts.update({ email: c.email, unsubscribed: false }));
      if (!error) {
        c.unsubscribed = false;
        ponovnoPrijavljenih++;
      }
    }
    await sb.from("nastavitve").upsert({ kljuc: POPRAVEK_23, vrednost: zdaj() }, { onConflict: "kljuc" });
  }
  for (const c of vResend) {
    const email = String(c.email).toLowerCase();
    const b = vBazi.get(email);
    if (!b) {
      noviIzResenda.push({ email, ime: [c.first_name, c.last_name].filter(Boolean).join(" ") || null, vir: "Resend (e-novice)", soglasje: true, odjavljen: !!c.unsubscribed });
    } else if (c.unsubscribed && !b.odjavljen) {
      await sb.from("baza_kontakti").update({ odjavljen: true, posodobljeno: zdaj() }).eq("email", email);
      b.odjavljen = true;
      odjav++;
    }
  }
  // Baza → Resend: neaktivni morajo biti v Resendu odjavljeni,
  // tudi če so od prej še v kakšnem segmentu. Baza je glavna — Resend ne sme kontakta znova aktivirati.
  let izklopljenih = 0;
  for (const c of vResend) {
    const b = vBazi.get(String(c.email).toLowerCase());
    if (!b || c.unsubscribed) continue;
    if (b.odjavljen) {
      const { error } = await klic(() => r.contacts.update({ email: c.email, unsubscribed: true }));
      if (!error) izklopljenih++;
    }
  }
  for (let i = 0; i < noviIzResenda.length; i += 500) {
    await sb.from("baza_kontakti").insert(noviIzResenda.slice(i, i + 500));
    dodanih += Math.min(500, noviIzResenda.length - i);
  }

  const { data: panoge } = await sb.from("baza_panoge").select("sifra, ime").order("vrstni_red");
  const segmenti = await vsePanoge(r);
  const poPanogi = new Map();
  for (const k of vBazi.values()) {
    if (k.odjavljen) continue;
    for (const s of k.panoge ?? []) (poPanogi.get(s) ?? poPanogi.set(s, []).get(s)).push(k);
  }
  const porocilo = [];
  const mi = poPanogi.get(PANOGA_MI) ?? [];
  for (const p of panoge ?? []) {
    const lastni = poPanogi.get(p.sifra) ?? [];
    if (!lastni.length) continue;
    const kontakti = p.sifra === PANOGA_MI ? lastni : [...lastni, ...mi.filter((k) => !lastni.includes(k))];
    const ime = `Baza · ${p.ime}`;
    let seg = segmenti.find((s) => s.name === ime);
    if (!seg) {
      const { data, error } = await klic(() => r.segments.create({ name: ime }));
      if (error) return { napaka: `Resend (${ime}): ${error.message}` };
      seg = data;
    }
    const csvPolje = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = ["email,first_name", ...kontakti.map((k) => [k.email, k.ime || k.podjetje || ""].map(csvPolje).join(","))].join("\n");
    const { error } = await klic(() =>
      r.contacts.imports.create({
        file: new Blob([csv], { type: "text/csv" }),
        columnMap: { email: "email", firstName: "first_name" },
        onConflict: "upsert",
        segments: [{ id: seg.id }],
      })
    );
    if (error) return { napaka: `Resend uvoz (${ime}): ${error.message}` };
    porocilo.push(`${p.ime}: ${kontakti.length}`);
  }
  revalidatePath(POT);
  return {
    ok: true,
    sporocilo: `Usklajeno. Iz Resenda: ${dodanih} novih (nerazvrščeni), ${odjav} odjav. V Resendu izklopljenih neaktivnih: ${izklopljenih}.${ponovnoPrijavljenih ? ` Ponovno prijavljenih (Trgovina ni mailinga): ${ponovnoPrijavljenih}.` : ""} V Resend segmente »Baza · …«: ${porocilo.join(", ") || "ni razvrščenih kontaktov"}.`,
  };
}

// Odjava / ponovna prijava (tudi v Resendu).
export async function preklopiOdjavo(email, odjavljen) {
  await zahtevajAdmina();
  const { error } = await supabaseAdmin().from("baza_kontakti").update({ odjavljen: Boolean(odjavljen), posodobljeno: zdaj() }).eq("email", email);
  if (error) return { napaka: error.message };
  try {
    await klic(() => resendOdjemalec().contacts.update({ email, unsubscribed: Boolean(odjavljen) }));
  } catch {}
  revalidatePath(POT);
  return { ok: true };
}

// Izključene domene (npr. podjetje ne obstaja več): izbriše vse kontakte s to domeno
// in prepreči ponovni vnos (Vasco uvoz, spletni obrazci). Seznam je v nastavitve.baza_izkljucene_domene.
const KLJUC_DOMENE = "baza_izkljucene_domene";

export async function izkljuciDomeno(_prej, formData) {
  await zahtevajAdmina();
  const domena = t(formData.get("domena")).toLowerCase().replace(/^.*@/, "").replace(/^www\./, "");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(domena)) return { napaka: "Vpiši domeno, npr. mtehnika.si" };
  const sb = supabaseAdmin();
  const { count } = await sb.from("baza_kontakti").delete({ count: "exact" }).ilike("email", `%@${domena}`);
  const { data: obst } = await sb.from("nastavitve").select("vrednost").eq("kljuc", KLJUC_DOMENE).maybeSingle();
  const seznam = [...new Set([...String(obst?.vrednost ?? "").split(",").map((x) => x.trim()).filter(Boolean), domena])].join(",");
  if (obst) await sb.from("nastavitve").update({ vrednost: seznam }).eq("kljuc", KLJUC_DOMENE);
  else {
    const { error } = await sb.from("nastavitve").insert({ kljuc: KLJUC_DOMENE, vrednost: seznam, opis: "Domene, ki jih ne vnašamo v bazo kontaktov" });
    if (error) await sb.from("nastavitve").insert({ kljuc: KLJUC_DOMENE, vrednost: seznam });
  }
  revalidatePath(POT);
  return { ok: true, sporocilo: `Izbrisanih ${count ?? 0} kontaktov z @${domena}. Domena se ne bo več uvažala.` };
}

export async function odstraniIzkljucitev(domena) {
  await zahtevajAdmina();
  const sb = supabaseAdmin();
  const { data: obst } = await sb.from("nastavitve").select("vrednost").eq("kljuc", KLJUC_DOMENE).maybeSingle();
  const seznam = String(obst?.vrednost ?? "").split(",").map((x) => x.trim()).filter((x) => x && x !== domena).join(",");
  await sb.from("nastavitve").update({ vrednost: seznam }).eq("kljuc", KLJUC_DOMENE);
  revalidatePath(POT);
  return { ok: true };
}

// Nova panoga (baza za mailing), ki jo admin doda sam. Šifre od 1000 naprej,
// da se ne pokrivajo s šiframi panog iz Vasca. V Resendu nastane segment »Baza · <ime>«
// ob naslednji uskladitvi (ko ima panoga vsaj en kontakt).
export async function dodajPanogo(_prej, formData) {
  await zahtevajAdmina();
  const ime = t(formData.get("ime")).slice(0, 80);
  if (ime.length < 2) return { napaka: "Vpiši ime panoge." };
  const sb = supabaseAdmin();
  const { data: vse, error } = await sb.from("baza_panoge").select("sifra, ime, vrstni_red");
  if (error) return { napaka: error.message };
  if ((vse ?? []).some((p) => p.ime.trim().toLowerCase() === ime.toLowerCase())) return { napaka: `Panoga »${ime}« že obstaja.` };
  const sifra = Math.max(999, ...(vse ?? []).map((p) => p.sifra)) + 1;
  const vrstni_red = Math.max(0, ...(vse ?? []).map((p) => p.vrstni_red ?? 0)) + 1;
  const { error: e2 } = await sb.from("baza_panoge").insert({ sifra, ime, vrstni_red });
  if (e2) return { napaka: e2.message };
  revalidatePath(POT);
  return { ok: true, sporocilo: `Panoga »${ime}« dodana.` };
}

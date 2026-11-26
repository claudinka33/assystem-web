// Baza kontaktov za mailinge — vpis s spletnih obrazcev. Samo strežnik.
import { supabaseAdmin } from "@/lib/supabase-server";

const veljaven = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

// Izbrisani za vedno: e-naslovi in domene, ki jih nikoli več ne vnašamo v bazo in jim ne pošiljamo mailingov
// (nastavitve.baza_izkljuceni_emaili, nastavitve.baza_izkljucene_domene — seznam, ločen z vejicami).
export const KLJUC_EMAILI = "baza_izkljuceni_emaili";
export const KLJUC_DOMENE = "baza_izkljucene_domene";
const seznam = (v) => String(v ?? "").split(",").map((x) => x.trim().toLowerCase()).filter(Boolean);

export async function izkljucitve(sb = supabaseAdmin()) {
  const { data } = await sb.from("nastavitve").select("kljuc, vrednost").in("kljuc", [KLJUC_EMAILI, KLJUC_DOMENE]);
  const v = Object.fromEntries((data ?? []).map((x) => [x.kljuc, x.vrednost]));
  return { emaili: new Set(seznam(v[KLJUC_EMAILI])), domene: new Set(seznam(v[KLJUC_DOMENE])) };
}

export function jeIzkljucen(email, izk) {
  const e = String(email ?? "").trim().toLowerCase();
  return izk.emaili.has(e) || izk.domene.has(e.split("@")[1] ?? "");
}

// Doda kontakt v bazo (nerazvrščen, če panoga ni znana). Obstoječega ne prepiše —
// le dopolni prazna polja in zabeleži soglasje / ponovno prijavo.
export async function zapisiVBazo({ email, ime, podjetje, telefon, davcna, vir, soglasje = false, panoga = null }) {
  const e = String(email ?? "").trim().toLowerCase();
  if (!veljaven(e)) return;
  try {
    const sb = supabaseAdmin();
    if (jeIzkljucen(e, await izkljucitve(sb))) return; // izbrisan za vedno
    const { data: obst, error: e0 } = await sb.from("baza_kontakti").select("email, ime, podjetje, telefon, davcna, soglasje, panoge").eq("email", e).maybeSingle();
    if (e0) return; // tabela še ne obstaja
    if (!obst) {
      await sb.from("baza_kontakti").insert({
        email: e, ime: ime || null, podjetje: podjetje || null, telefon: telefon || null, davcna: davcna || null,
        vir: vir || "splet", soglasje: Boolean(soglasje), panoge: panoga ? [panoga] : [],
      });
      return;
    }
    const pop = {};
    if (!obst.ime && ime) pop.ime = ime;
    if (!obst.podjetje && podjetje) pop.podjetje = podjetje;
    if (!obst.telefon && telefon) pop.telefon = telefon;
    if (!obst.davcna && davcna) pop.davcna = davcna;
    if (soglasje && !obst.soglasje) Object.assign(pop, { soglasje: true, odjavljen: false });
    if (Object.keys(pop).length) await sb.from("baza_kontakti").update({ ...pop, posodobljeno: new Date().toISOString() }).eq("email", e);
  } catch (err) {
    console.error("Baza kontaktov:", err?.message);
  }
}

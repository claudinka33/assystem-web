// Baza kontaktov za mailinge — vpis s spletnih obrazcev. Samo strežnik.
import { supabaseAdmin } from "@/lib/supabase-server";

const veljaven = (e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

// Doda kontakt v bazo (nerazvrščen, če panoga ni znana). Obstoječega ne prepiše —
// le dopolni prazna polja in zabeleži soglasje / ponovno prijavo.
export async function zapisiVBazo({ email, ime, podjetje, telefon, davcna, vir, soglasje = false, panoga = null }) {
  const e = String(email ?? "").trim().toLowerCase();
  if (!veljaven(e)) return;
  try {
    const sb = supabaseAdmin();
    const { data: izk } = await sb.from("nastavitve").select("vrednost").eq("kljuc", "baza_izkljucene_domene").maybeSingle();
    if (String(izk?.vrednost ?? "").split(",").map((x) => x.trim()).includes(e.split("@")[1])) return;
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

import { supabaseAdmin } from "@/lib/supabase-server";

// Skupni podatki za poročilo e-novic (PDF stran in Excel izvoz).

export const odstotek = (a, b) => (b ? Math.round((100 * (a || 0)) / b) : 0);

export const casSl = (d) =>
  d ? new Date(d).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "medium", timeStyle: "short" }) : "";

// Povezava za odjavo (Resend) – v poročilu jo pokažemo kot »Odjava (stran)«.
export const jeOdjava = (url) => /unsubscribe\.resend\.com|RESEND_UNSUBSCRIBE/i.test(String(url || ""));
export const imePovezave = (url) => (jeOdjava(url) ? "Odjava (stran za odjavo)" : String(url || "").replace(/^https?:\/\//, ""));

// Domena e-naslova kot približek podjetja (gmail ipd. pustimo prazno).
const ZASEBNE = /^(gmail|googlemail|hotmail|outlook|live|yahoo|icloud|me|gmx|web|aol|siol|t-online)\./i;
export function podjetje(email) {
  const d = String(email || "").split("@")[1] || "";
  if (!d || ZASEBNE.test(d)) return "";
  return d;
}

// Ocena prejemnika. Varnostni filtri v podjetjih pogosto sami »kliknejo« vse
// povezave (tudi odjavo), zato takšne klike označimo kot možen filter.
export function oceni(p, steviloPovezav) {
  const povezave = (p.povezave ?? []).map((l) => l.url);
  const kliknilOdjavo = povezave.some(jeOdjava) && !p.odjavljen;
  const kliknilVse = steviloPovezav > 1 && povezave.length >= steviloPovezav;
  if (p.odbit) return { oznaka: "odbit", opis: "Naslov ne obstaja / zavrnjen" };
  if (p.odjavljen) return { oznaka: "odjava", opis: "Odjavil se je" };
  if (p.kliknil > 0 && (kliknilOdjavo || kliknilVse))
    return { oznaka: "filter", opis: "Možen varnostni filter (kliknil vse povezave / odjavo, a se ni odjavil)" };
  if (p.kliknil > 0) return { oznaka: "zanimanje", opis: "Kliknil – zanimanje" };
  if (p.odprl >= 2) return { oznaka: "vec-odprtij", opis: "Odprl večkrat" };
  if (p.odprl === 1) return { oznaka: "odprl", opis: "Odprl" };
  if (p.dostavljeno) return { oznaka: "neodprto", opis: "Ni odprl" };
  return { oznaka: "neznano", opis: "" };
}

const VRSTNI_RED = { zanimanje: 0, "vec-odprtij": 1, filter: 2, odprl: 3, neodprto: 4, odjava: 5, odbit: 6, neznano: 7 };

export async function podatkiPorocila(id) {
  const sb = supabaseAdmin();
  const { data: k } = await sb
    .from("enovice_kampanje")
    .select("id, zadeva, naziv, segment_ime, poslano_ob, statistika, statistika_ob")
    .eq("id", id)
    .single();
  if (!k) return null;

  const vrstice = [];
  for (let od = 0; ; od += 1000) {
    const { data } = await sb.from("enovice_prejemniki").select("*").eq("kampanja_id", id).order("email").range(od, od + 999);
    vrstice.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }

  const s = k.statistika || {};
  const povezave = (s.povezave ?? []).filter((l) => l.url);
  const prave = povezave.filter((l) => !jeOdjava(l.url));
  const steviloPovezav = new Set(povezave.map((l) => l.url)).size;

  const prejemniki = vrstice
    .map((p) => ({ ...p, podjetje: podjetje(p.email), ocena: oceni(p, steviloPovezav) }))
    .sort(
      (a, b) =>
        VRSTNI_RED[a.ocena.oznaka] - VRSTNI_RED[b.ocena.oznaka] ||
        (b.kliknil || 0) - (a.kliknil || 0) ||
        (b.odprl || 0) - (a.odprl || 0) ||
        a.email.localeCompare(b.email)
    );

  const st = (o) => prejemniki.filter((p) => p.ocena.oznaka === o).length;
  const povzetek = {
    prejemniki: s.prejemniki ?? vrstice.length,
    dostavljeno: s.dostavljeno ?? 0,
    odprli: s.odprli ?? 0,
    kliknili: s.kliknili ?? 0,
    odbiti: s.odbiti ?? 0,
    odjave: s.odjave ?? 0,
    pritozbe: s.pritozbe ?? 0,
    zanimanje: st("zanimanje"),
    vecOdprtij: st("vec-odprtij"),
    filtri: st("filter"),
  };

  return { k, povzetek, povezave, prave, prejemniki };
}

import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";

// Sledljivost e-novic: Resend za vsak broadcast hrani dogodke po prejemnikih
// (dostavljeno, odprto, kliknjeno, odbito …). Tu jih preberemo in shranimo v
// enovice_prejemniki + povzetek v enovice_kampanje.statistika.
// Odpiranja in klike Resend beleži samo, če je na domeni vklopljen
// »Open tracking« in »Click tracking« (Resend → Domains → Configuration).

const TIPI = ["delivered", "opened", "clicked", "bounced", "complained", "unsubscribed", "suppressed"];
const pocakaj = (ms) => new Promise((r) => setTimeout(r, ms));

async function klic(fn) {
  // Resend omejuje število zahtev na sekundo → ob 429 počakamo in ponovimo.
  for (let i = 0; i < 6; i++) {
    const r = await fn();
    if (!r?.error) return r;
    if (r.error.statusCode === 429 || /rate|too many/i.test(r.error.message || "")) {
      await pocakaj(1200 * (i + 1));
      continue;
    }
    throw new Error(`Resend: ${r.error.message}`);
  }
  throw new Error("Resend: preveč zahtev, poskusi čez minuto.");
}

async function vsiPrejemniki(r, broadcastId, type) {
  const vsi = [];
  let after;
  for (let stran = 0; stran < 500; stran++) {
    const { data } = await klic(() => r.broadcasts.recipients(broadcastId, { type, limit: 100, ...(after ? { after } : {}) }));
    const kos = data?.data ?? [];
    vsi.push(...kos);
    if (!data?.has_more || kos.length === 0) break;
    after = kos[kos.length - 1].id;
    await pocakaj(220);
  }
  return vsi;
}

async function vsePovezave(r, broadcastId) {
  const vse = [];
  let after;
  for (let stran = 0; stran < 50; stran++) {
    const { data } = await klic(() => r.broadcasts.clickedLinks(broadcastId, { limit: 100, ...(after ? { after } : {}) }));
    const kos = data?.data ?? [];
    vse.push(...kos);
    if (!data?.has_more || kos.length === 0) break;
    after = kos[kos.length - 1].id;
    await pocakaj(220);
  }
  return vse.map((p) => ({ url: p.url, kliki: p.clicks, unikatni: p.unique_clicks }));
}

export async function osveziStatistiko(kampanja) {
  if (!kampanja?.resend_broadcast_id) throw new Error("Kampanja še ni bila poslana prek Resenda.");
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) throw new Error("RESEND_API_KEY ni nastavljen.");
  const r = new Resend(kljuc);
  const bid = kampanja.resend_broadcast_id;

  const po = new Map();
  const zapis = (x) => {
    const email = String(x.email || "").toLowerCase();
    if (!po.has(email)) {
      po.set(email, {
        kampanja_id: kampanja.id,
        email,
        contact_id: x.contact_id ?? null,
        dostavljeno: false,
        odprl: 0,
        kliknil: 0,
        povezave: null,
        odbit: null,
        pritozba: false,
        odjavljen: false,
        zavrnjen: false,
      });
    }
    return po.get(email);
  };

  for (const tip of TIPI) {
    const seznam = await vsiPrejemniki(r, bid, tip);
    for (const x of seznam) {
      const z = zapis(x);
      if (tip === "delivered") z.dostavljeno = true;
      if (tip === "opened") z.odprl = x.count ?? 1;
      if (tip === "clicked") {
        z.kliknil = x.count ?? 1;
        z.povezave = (x.clicked_links ?? []).map((l) => ({ url: l.url, kliki: l.clicks }));
      }
      if (tip === "bounced") z.odbit = x.bounce_type || "undetermined";
      if (tip === "complained") z.pritozba = true;
      if (tip === "unsubscribed") z.odjavljen = true;
      if (tip === "suppressed") z.zavrnjen = true;
    }
    await pocakaj(220);
  }

  const povezave = await vsePovezave(r, bid);
  const vrstice = [...po.values()];
  // kdor je kliknil, je mail tudi odprl (slike so lahko blokirane)
  for (const z of vrstice) if (z.kliknil && !z.odprl) z.odprl = 1;

  const statistika = {
    prejemniki: vrstice.length,
    dostavljeno: vrstice.filter((z) => z.dostavljeno).length,
    odprli: vrstice.filter((z) => z.odprl > 0).length,
    kliknili: vrstice.filter((z) => z.kliknil > 0).length,
    odbiti: vrstice.filter((z) => z.odbit).length,
    pritozbe: vrstice.filter((z) => z.pritozba).length,
    odjave: vrstice.filter((z) => z.odjavljen).length,
    zavrnjeni: vrstice.filter((z) => z.zavrnjen).length,
    povezave,
  };

  const sb = supabaseAdmin();
  await sb.from("enovice_prejemniki").delete().eq("kampanja_id", kampanja.id);
  for (let i = 0; i < vrstice.length; i += 500) {
    const { error } = await sb.from("enovice_prejemniki").insert(vrstice.slice(i, i + 500));
    if (error) {
      if (/enovice_prejemniki/.test(error.message)) throw new Error("V bazi še ni tabele enovice_prejemniki — zaženi SQL 44-enovice-prejemniki.sql.");
      throw new Error(error.message);
    }
  }
  const zdaj = new Date().toISOString();
  await sb.from("enovice_kampanje").update({ statistika, statistika_ob: zdaj }).eq("id", kampanja.id);
  return { statistika, statistika_ob: zdaj };
}

// Samodejno osveži, če je statistika starejša od 20 min in je kampanja poslana v zadnjih 30 dneh.
export function rabiOsvezitev(k) {
  if (k.status !== "poslano" || !k.resend_broadcast_id) return false;
  const poslano = new Date(k.poslano_ob || 0).getTime();
  if (Date.now() - poslano > 30 * 24 * 3600 * 1000) return !k.statistika_ob;
  if (!k.statistika_ob) return true;
  return Date.now() - new Date(k.statistika_ob).getTime() > 20 * 60 * 1000;
}

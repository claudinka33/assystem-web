import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase-server";
import { razvrstiVir, trgDrzave, napravaIzUA, jeBot } from "@/lib/obisk";
import { trenutniB2B, jeZaposleni } from "@/lib/b2b";
import { B2B_PISKOTEK } from "@/lib/supabase-server";

// Lastno merjenje obiska brez piškotkov. Brskalnik pošlje ogled strani ali dogodek,
// strežnik doda državo/mesto (Vercel), anonimen dnevni odtis obiskovalca in vir.
// IP se NE shrani — uporabi se le za odtis, ki se vsak dan zamenja.

export const runtime = "nodejs";

const prazno = () => new NextResponse(null, { status: 204 });
const rez = (v, n) => (v == null || v === "" ? null : String(v).slice(0, n));

export async function POST(request) {
  try {
    // samo produkcija (preview gradnje ne mešamo v statistiko)
    if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") return prazno();
    // naprave administratorjev se ne štejejo
    if (request.cookies.get("as_ne_stej")?.value) return prazno();

    const h = request.headers;
    const ua = h.get("user-agent") || "";
    if (jeBot(ua)) return prazno();

    let b;
    try {
      b = JSON.parse(await request.text());
    } catch {
      return prazno();
    }
    if (!b || typeof b !== "object") return prazno();

    const ime = /^[a-z0-9_]{1,40}$/.test(b.ime || "") ? b.ime : "ogled";
    const pot = rez(String(b.pot || "/").split("?")[0], 300) || "/";
    if (pot.startsWith("/admin") || pot.startsWith("/api")) return prazno();

    // anonimen dnevni odtis
    const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || h.get("x-real-ip") || "";
    const dan = new Date().toLocaleDateString("sv-SE", { timeZone: "Europe/Ljubljana" });
    const sol = process.env.OBISK_SOL || process.env.SUPABASE_SECRET_KEY || "assystem";
    const obiskovalec = createHash("sha256").update(`${sol}|${dan}|${ip}|${ua}`).digest("hex").slice(0, 24);

    // vir
    const q = new URLSearchParams(typeof b.q === "string" ? b.q.slice(0, 1000) : "");
    const utm = {
      source: q.get("utm_source"),
      medium: q.get("utm_medium"),
      campaign: q.get("utm_campaign"),
      content: q.get("utm_content"),
      term: q.get("utm_term"),
    };
    let refHost = null;
    try {
      if (b.ref) refHost = new URL(String(b.ref)).hostname.toLowerCase();
    } catch {}
    const placanKlik = q.has("gclid") || q.has("gbraid") || q.has("wbraid") || q.has("msclkid"); // fbclid doda FB tudi navadnim povezavam, zato ne pomeni oglasa
    const { kanal, vir } = razvrstiVir({
      refHost,
      lastniHost: (h.get("host") || "").toLowerCase(),
      utm,
      placanKlik,
      notranje: Boolean(b.notranje),
    });

    // lokacija (Vercel)
    const drzava = rez(h.get("x-vercel-ip-country"), 2);
    let mesto = h.get("x-vercel-ip-city");
    try {
      mesto = mesto ? decodeURIComponent(mesto) : null;
    } catch {}

    const sirina = Number(b.w) || 0;
    const { naprava, brskalnik, os } = napravaIzUA(ua, sirina);

    const vrednost = Number(b.vrednost);
    const podatki = b.podatki && typeof b.podatki === "object" ? b.podatki : null;

    // prijavljen B2B kupec: obisk povežemo s podjetjem (za komercialo), zaposlenih ne štejemo
    let b2b = null;
    if (request.cookies.getAll().some((c) => c.name.startsWith(B2B_PISKOTEK))) {
      try {
        const k = await trenutniB2B();
        if (k && !jeZaposleni(k)) b2b = { b2b_kupec: k.id, b2b_podjetje: rez(k.vasco_naziv || k.podjetje, 120) };
      } catch {}
    }

    const vrstica = {
      obiskovalec,
      ime,
      pot,
      naslov: rez(b.naslov, 200),
      vir_host: refHost,
      vir: rez(vir, 80),
      kanal,
      utm_source: rez(utm.source, 100),
      utm_medium: rez(utm.medium, 100),
      utm_campaign: rez(utm.campaign, 150),
      utm_content: rez(utm.content, 150),
      utm_term: rez(utm.term, 150),
      drzava,
      regija: rez(h.get("x-vercel-ip-country-region"), 10),
      mesto: rez(mesto, 80),
      trg: trgDrzave(drzava),
      jezik: rez(b.jezik, 20),
      naprava,
      brskalnik,
      os,
      zaslon: sirina || null,
      vrednost: Number.isFinite(vrednost) ? vrednost : null,
      podatki: podatki && JSON.stringify(podatki).length < 2000 ? podatki : null,
    };
    const tabela = supabaseAdmin().from("obiski");
    const { error } = await tabela.insert(b2b ? { ...vrstica, ...b2b } : vrstica);
    // če stolpca za B2B še ni (SQL 55 ni zagnan), shrani obisk brez njega
    if (error && b2b) await supabaseAdmin().from("obiski").insert(vrstica);
  } catch {
    // merjenje nikoli ne sme podreti strani
  }
  return prazno();
}

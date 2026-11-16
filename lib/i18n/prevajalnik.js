// Samodejni prevodi spletne strani (SL → EN, DE).
//
// Kako deluje:
// 1. Vsako slovensko besedilo, ki se izriše na /en ali /de, dobi ključ (sha256).
// 2. Prevod se najprej išče v pomnilniku, nato v tabeli »prevodi« (Supabase).
// 3. Česar še ni, prevede Claude (Anthropic API) in shrani v tabelo.
// Ko se slovensko besedilo spremeni (v kodi ali v administraciji), ima nov
// ključ, zato se novi prevod naredi sam. Ročni popravki v adminu (rocno = true)
// se nikoli ne prepišejo.

import { createHash } from "node:crypto";
import { after } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { kljuc, zaPrevod } from "./skupno";

const MODEL = process.env.PREVODI_MODEL || "claude-sonnet-5-5";
const CAS_CAKANJA_MS = 25000; // koliko največ počaka stran, preden pokaže slovensko besedilo
const PAKET_ZNAKOV = 7000;
const PAKET_NIZOV = 60;
const SOCASNO = 6;
const OSVEZI_MS = 5 * 60 * 1000;

let pomnilnik = { en: new Map(), de: new Map() };
let zadnjeOsvezeno = Date.now();
const vTeku = new Map(); // jezik:hash -> Promise

function osveziPomnilnik() {
  if (Date.now() - zadnjeOsvezeno > OSVEZI_MS) {
    pomnilnik = { en: new Map(), de: new Map() };
    zadnjeOsvezeno = Date.now();
  }
}

export function hashNiza(k, html = false) {
  return createHash("sha256").update((html ? "h:" : "t:") + k).digest("hex").slice(0, 40);
}

function baza() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function izBaze(sb, jezik, hashi) {
  const izid = new Map();
  for (let i = 0; i < hashi.length; i += 500) {
    const kos = hashi.slice(i, i + 500);
    const { data, error } = await sb.rpc("prevodi_poisci", { p_jezik: jezik, p_hashi: kos });
    if (error) throw error;
    for (const r of data ?? []) izid.set(r.vir_hash, r.prevod);
  }
  return izid;
}

const JEZIK_IME = { en: "English", de: "German" };

function navodila(jezik, html) {
  return `You translate the website of AS system d.o.o. (assystem.si), a Slovenian manufacturer of fastening technology (anchors, wall plugs, screws), from Slovenian into ${JEZIK_IME[jezik]}.

Rules:
- Natural, professional ${JEZIK_IME[jezik]} for B2B customers, distributors and installers.${jezik === "de" ? " Use the formal \"Sie\"." : ""}
- Keep brand and product names exactly: AS system, ASfix, ASco, Silvermate, HAMMEX, MUNGO, TXH7, TX1, EASF, PESF, UVS, AF-RK, AF-RS, MQ and similar codes.
- Keep numbers, dimensions (M8 × 60, Ø10), units, prices, e-mail addresses, phone numbers and URLs unchanged.
- Keep Slovenian place names (Šmarje pri Jelšah, Bistrica ob Sotli, Slovenija → ${jezik === "de" ? "Slowenien" : "Slovenia"}).
- Keep the same capitalisation style (ALL CAPS stays ALL CAPS) and keep punctuation such as "→", "·", "•" and "|".
- A text may be a fragment of a sentence; translate it as a fragment, without adding words.
- Terminology: jekleno sidro = ${jezik === "de" ? "Bolzenanker" : "wedge anchor"}; zidni vložek = ${jezik === "de" ? "Dübel" : "wall plug"}; udarni vijak = ${jezik === "de" ? "Nageldübel" : "hammer-fix plug"}; vložek za mavčne plošče = ${jezik === "de" ? "Gipskartondübel" : "plasterboard plug"}; kemično sidro / kemična masa = ${jezik === "de" ? "Injektionsmörtel" : "chemical anchor"}; perforiran trak = ${jezik === "de" ? "Lochband" : "perforated strip"}; vijaki po naročilu = ${jezik === "de" ? "Schrauben nach Zeichnung" : "screws to drawing"}; izdelava po meri = ${jezik === "de" ? "Fertigung nach Maß" : "bespoke manufacturing"}; keep the word "Bespoke" and "Bespoke manufacturing" in English in both languages; hladno kovanje = ${jezik === "de" ? "Kaltumformung" : "cold heading"}; nastavek = ${jezik === "de" ? "Antrieb" : "drive"}; podložka = ${jezik === "de" ? "Unterlegscheibe" : "washer"}; ZnB = ZnB; INOX = ${jezik === "de" ? "Edelstahl (INOX)" : "stainless steel (INOX)"}; košarica = ${jezik === "de" ? "Warenkorb" : "cart"}; predračun = ${jezik === "de" ? "Proforma-Rechnung" : "proforma invoice"}; polica = ${jezik === "de" ? "Regal" : "shelf"}.${html ? "\n- The texts are HTML. Translate only the human-readable text; keep every tag, attribute and URL exactly as it is." : ""}

Input: a JSON array of strings. Output: ONLY a JSON array of the same length with the translations, in the same order. No comments, no code fences.`;
}

async function prevediPaket(jezik, nizi, html) {
  // Preizkus brez API (samo za lokalno preverjanje): PREVODI_TEST=1
  if (process.env.PREVODI_TEST === "1") return nizi.map((n) => `[${jezik.toUpperCase()}] ${n}`);
  const kljucApi = process.env.ANTHROPIC_API_KEY;
  if (!kljucApi) return null;
  const odgovor = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": kljucApi,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 16000,
      system: navodila(jezik, html),
      messages: [{ role: "user", content: JSON.stringify(nizi) }],
    }),
  });
  if (!odgovor.ok) {
    console.error("[prevodi] API", odgovor.status, (await odgovor.text()).slice(0, 300));
    return null;
  }
  const json = await odgovor.json();
  const tekst = (json.content ?? []).map((c) => c.text ?? "").join("").trim();
  const zacetek = tekst.indexOf("[");
  const konec = tekst.lastIndexOf("]");
  if (zacetek < 0 || konec < zacetek) return null;
  let seznam;
  try {
    seznam = JSON.parse(tekst.slice(zacetek, konec + 1));
  } catch {
    return null;
  }
  if (!Array.isArray(seznam) || seznam.length !== nizi.length) return null;
  return seznam.map((s) => (typeof s === "string" ? s : null));
}

function razdeliVPakete(nizi) {
  const paketi = [];
  let trenutni = [];
  let znaki = 0;
  for (const n of nizi) {
    if (trenutni.length && (trenutni.length >= PAKET_NIZOV || znaki + n.length > PAKET_ZNAKOV)) {
      paketi.push(trenutni);
      trenutni = [];
      znaki = 0;
    }
    trenutni.push(n);
    znaki += n.length;
  }
  if (trenutni.length) paketi.push(trenutni);
  return paketi;
}

async function zOmejitvijo(opravila, n) {
  const izid = new Array(opravila.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: Math.min(n, opravila.length) }, async () => {
      while (i < opravila.length) {
        const moj = i++;
        try {
          izid[moj] = await opravila[moj]();
        } catch (e) {
          console.error("[prevodi]", e?.message ?? e);
          izid[moj] = null;
        }
      }
    })
  );
  return izid;
}

// Prevede in shrani manjkajoče nize; vrne Map(kljuc -> prevod) za uspešne.
async function prevediManjkajoce(sb, jezik, manjkajoci, html, vir) {
  const paketi = razdeliVPakete(manjkajoci);
  const rezultati = await zOmejitvijo(
    paketi.map((p) => () => prevediPaket(jezik, p, html)),
    SOCASNO
  );
  const novi = new Map();
  const vrstice = [];
  paketi.forEach((p, pi) => {
    const r = rezultati[pi];
    if (!r) return;
    p.forEach((k, i) => {
      if (!r[i]) return;
      novi.set(k, r[i]);
      vrstice.push({ jezik, vir_hash: hashNiza(k, html), vir: k, prevod: r[i], vrsta: html ? "html" : "besedilo", izvor: vir });
    });
  });
  if (sb && vrstice.length) {
    for (let i = 0; i < vrstice.length; i += 500) {
      const { error } = await sb
        .from("prevodi")
        .upsert(vrstice.slice(i, i + 500), { onConflict: "jezik,vir_hash", ignoreDuplicates: true });
      if (error) console.error("[prevodi] shranjevanje", error.message);
    }
  }
  return novi;
}

/**
 * Prevede seznam slovenskih nizov. Vrne objekt { [kljuc]: prevod }.
 * Česar ni mogoče prevesti (ni ključa API, napaka), v objektu ni.
 */
export async function prevedi(jezik, nizi, { html = false, vir = "stran" } = {}) {
  if (!["en", "de"].includes(jezik) || !nizi?.length) return {};
  osveziPomnilnik();
  const mem = pomnilnik[jezik];
  const izid = {};
  const potrebni = [];
  const videni = new Set();
  for (const s of nizi) {
    const k = html ? String(s).trim() : kljuc(s);
    if (videni.has(k)) continue;
    videni.add(k);
    if (!html && !zaPrevod(k)) continue;
    const memKljuc = (html ? "h:" : "t:") + k;
    if (mem.has(memKljuc)) izid[k] = mem.get(memKljuc);
    else potrebni.push(k);
  }
  if (!potrebni.length) return izid;

  const sb = baza();
  let manjkajoci = potrebni;
  if (sb) {
    try {
      const hashi = potrebni.map((k) => hashNiza(k, html));
      const najdeni = await izBaze(sb, jezik, hashi);
      manjkajoci = [];
      potrebni.forEach((k, i) => {
        const p = najdeni.get(hashi[i]);
        if (p) {
          izid[k] = p;
          mem.set((html ? "h:" : "t:") + k, p);
        } else manjkajoci.push(k);
      });
    } catch (e) {
      // Brez tabele prevodov ne prevajamo (vsak obisk bi sicer znova klical API).
      console.error("[prevodi] branje", e?.message ?? e);
      if (process.env.PREVODI_TEST !== "1") return izid;
    }
  } else if (process.env.PREVODI_TEST !== "1") {
    return izid;
  }
  if (!manjkajoci.length || (!process.env.ANTHROPIC_API_KEY && process.env.PREVODI_TEST !== "1")) return izid;

  // Isti niz, ki ga že prevaja druga zahteva, ne pošljemo še enkrat.
  const kljucTeka = jezik + ":" + (html ? "h" : "t") + ":" + hashNiza(manjkajoci.join("\u0000"));
  let obljuba = vTeku.get(kljucTeka);
  if (!obljuba) {
    obljuba = prevediManjkajoce(sb, jezik, manjkajoci, html, vir)
      .then((novi) => {
        for (const [k, p] of novi) mem.set((html ? "h:" : "t:") + k, p);
        return novi;
      })
      .finally(() => vTeku.delete(kljucTeka));
    vTeku.set(kljucTeka, obljuba);
  }

  let pravocasno = null;
  const casovnik = new Promise((r) => setTimeout(() => r(null), CAS_CAKANJA_MS));
  pravocasno = await Promise.race([obljuba, casovnik]);
  if (pravocasno) {
    for (const [k, p] of pravocasno) izid[k] = p;
  } else {
    // Stran se pokaže zdaj (delno slovensko), prevod se dokonča v ozadju.
    try {
      after(() => obljuba.catch(() => {}));
    } catch {
      /* zunaj zahteve */
    }
  }
  return izid;
}

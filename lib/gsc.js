// Google Search Console (iskalne besede, prikazi, kliki) prek servisnega računa. Samo strežnik.
// Nastavitev v Vercelu:
//   GSC_SA_JSON  = vsebina JSON ključa servisnega računa (lahko tudi base64)
//   GSC_SITE     = lastnina v Search Console, npr. "sc-domain:as-system.si" ali "https://www.as-system.si/"
import { createSign } from "node:crypto";

const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function kljuc() {
  const raw = process.env.GSC_SA_JSON;
  if (!raw) return null;
  try {
    const txt = raw.trim().startsWith("{") ? raw : Buffer.from(raw, "base64").toString("utf8");
    const j = JSON.parse(txt);
    return j.client_email && j.private_key ? j : null;
  } catch {
    return null;
  }
}

export const gscNastavljen = () => Boolean(kljuc());
export const gscLastnina = () => process.env.GSC_SITE || "sc-domain:as-system.si";
export const gscEmail = () => kljuc()?.client_email || null;

const b64u = (b) => Buffer.from(b).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

let zeton = null; // { token, do }

async function dostop() {
  if (zeton && zeton.do > Date.now() + 60_000) return zeton.token;
  const k = kljuc();
  if (!k) throw new Error("GSC_SA_JSON ni nastavljen");
  const zdaj = Math.floor(Date.now() / 1000);
  const glava = b64u(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const telo = b64u(JSON.stringify({ iss: k.client_email, scope: SCOPE, aud: "https://oauth2.googleapis.com/token", iat: zdaj, exp: zdaj + 3600 }));
  const podpis = createSign("RSA-SHA256").update(`${glava}.${telo}`).sign(k.private_key);
  const jwt = `${glava}.${telo}.${b64u(podpis)}`;
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: jwt }),
    cache: "no-store",
  });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error_description || j.error || `Google prijava: ${r.status}`);
  zeton = { token: j.access_token, do: Date.now() + (j.expires_in || 3600) * 1000 };
  return zeton.token;
}

async function poizvedba(token, od, doo, dimenzije, vrstic = 25) {
  const r = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(gscLastnina())}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ startDate: od, endDate: doo, dimensions: dimenzije, rowLimit: vrstic, dataState: "all" }),
      next: { revalidate: 3600 },
    }
  );
  const j = await r.json();
  if (!r.ok) throw new Error(j.error?.message || `Search Console: ${r.status}`);
  return j.rows ?? [];
}

// Vse za izbrano obdobje: skupaj, iskalne besede, strani, države, naprave.
export async function gscPodatki(od, doo) {
  const t = await dostop();
  const [skupaj, besede, strani, drzave, naprave] = await Promise.all([
    poizvedba(t, od, doo, [], 1),
    poizvedba(t, od, doo, ["query"], 40),
    poizvedba(t, od, doo, ["page"], 20),
    poizvedba(t, od, doo, ["country"], 12),
    poizvedba(t, od, doo, ["device"], 5),
  ]);
  return { skupaj: skupaj[0] ?? { clicks: 0, impressions: 0, ctr: 0, position: 0 }, besede, strani, drzave, naprave };
}

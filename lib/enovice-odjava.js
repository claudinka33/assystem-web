// Lastna odjava od e-novic (mailingi se pošiljajo kot posamezni maili prek Resend
// transakcijskega paketa, zato Resendova {{{RESEND_UNSUBSCRIBE_URL}}} tu ne deluje).
// Povezava: /api/odjava?e=<email>&t=<podpis>&k=<kampanja>. Samo strežnik.
import { createHmac, timingSafeEqual } from "node:crypto";
import { osnovaUrl } from "@/lib/b2b";

function skrivnost() {
  const s = process.env.ODJAVA_SECRET || process.env.RESEND_API_KEY;
  if (!s) throw new Error("Ni skrivnosti za odjavne povezave (ODJAVA_SECRET).");
  return s;
}

export function podpisOdjave(email) {
  return createHmac("sha256", skrivnost()).update(String(email).trim().toLowerCase()).digest("base64url").slice(0, 32);
}

export function preveriPodpis(email, podpis) {
  const a = Buffer.from(podpisOdjave(email));
  const b = Buffer.from(String(podpis || ""));
  return a.length === b.length && timingSafeEqual(a, b);
}

export function povezavaOdjave(email, kampanjaId) {
  const e = String(email).trim().toLowerCase();
  const q = new URLSearchParams({ e, t: podpisOdjave(e) });
  if (kampanjaId) q.set("k", String(kampanjaId));
  return `${osnovaUrl()}/api/odjava?${q}`;
}

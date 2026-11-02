// Skupna pomoč za Resend kontakte in panoge (segmente). Samo strežnik.
import { Resend } from "resend";

export function resendOdjemalec() {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) throw new Error("RESEND_API_KEY ni nastavljen.");
  return new Resend(kljuc);
}

const pocakaj = (ms) => new Promise((r) => setTimeout(r, ms));

// Resend dovoli le nekaj zahtev na sekundo — ob 429 počakamo in ponovimo.
export async function klic(fn) {
  for (let i = 0; i < 4; i++) {
    const r = await fn();
    const err = r?.error;
    if (!err || !/rate|429|too many/i.test(`${err.name ?? ""} ${err.message ?? ""} ${err.statusCode ?? ""}`)) return r;
    await pocakaj(700 * (i + 1));
  }
  return fn();
}

export async function vsiKontakti(r, segmentId) {
  const vsi = [];
  let after;
  for (let i = 0; i < 100; i++) {
    const { data, error } = await klic(() => r.contacts.list({ limit: 100, ...(after ? { after } : {}), ...(segmentId ? { segmentId } : {}) }));
    if (error) throw new Error(error.message);
    const kos = data?.data ?? [];
    vsi.push(...kos);
    if (!data?.has_more || kos.length === 0) break;
    after = kos[kos.length - 1].id;
    await pocakaj(250);
  }
  return vsi;
}

export async function vsePanoge(r) {
  const { data, error } = await klic(() => r.segments.list({ limit: 100 }));
  if (error) throw new Error(error.message);
  return (data?.data ?? []).sort((a, b) => a.name.localeCompare(b.name, "sl"));
}

// Poišče panogo po imenu ali jo ustvari.
export async function panogaPoImenu(r, ime) {
  const obst = (await vsePanoge(r)).find((s) => s.name.trim().toLowerCase() === ime.trim().toLowerCase());
  if (obst) return obst.id;
  const { data, error } = await klic(() => r.segments.create({ name: ime }));
  if (error) throw new Error(error.message);
  return data.id;
}

// Prijava kontakta (blagajna, B2B registracija …): ustvari ali ponovno prijavi in doda v panogo.
export async function prijaviNaENovice({ email, ime, panoga }) {
  const r = resendOdjemalec();
  const e = String(email || "").trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(e)) return;
  const [firstName, ...ostalo] = String(ime || "").trim().split(/\s+/);
  const segId = panoga ? await panogaPoImenu(r, panoga) : null;
  const { error } = await klic(() =>
    r.contacts.create({ email: e, unsubscribed: false, ...(firstName ? { firstName, lastName: ostalo.join(" ") } : {}), ...(segId ? { segments: [{ id: segId }] } : {}) })
  );
  if (error) {
    if (!/exist|already/i.test(error.message || "")) throw new Error(error.message);
    await klic(() => r.contacts.update({ email: e, unsubscribed: false }));
    if (segId) await klic(() => r.contacts.segments.add({ email: e, segmentId: segId }));
  }
}

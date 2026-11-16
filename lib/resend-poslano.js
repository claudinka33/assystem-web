import { Resend } from "resend";

function odjemalec() {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) throw new Error("RESEND_API_KEY ni nastavljen.");
  return new Resend(kljuc);
}
const pocakaj = (ms) => new Promise((r) => setTimeout(r, ms));

// Samo maili AS system (Resend račun si delimo z drugimi projekti).
export const jeAS = (m) => /@(as-?system\.si)>?\s*$/i.test(String(m?.from ?? "").trim());

// Zadnja poslana sporočila AS system (Resend: največ 100 na stran, 2 klica/s).
export async function poslanaSporocila({ strani = 6, cilj = 200, after = null } = {}) {
  const r = odjemalec();
  const vse = [];
  let kurzor = after;
  for (let i = 0; i < strani; i++) {
    const { data, error } = await r.emails.list({ limit: 100, ...(kurzor ? { after: kurzor } : {}) });
    if (error) throw new Error(error.message);
    const d = data?.data ?? [];
    vse.push(...d.filter(jeAS));
    if (!data?.has_more || !d.length) return { sporocila: vse, naslednji: null };
    kurzor = d[d.length - 1].id;
    if (vse.length >= cilj) break;
    await pocakaj(550);
  }
  return { sporocila: vse, naslednji: kurzor };
}

export async function poslanoSporocilo(id) {
  const { data, error } = await odjemalec().emails.get(id);
  if (error) throw new Error(error.message);
  if (!jeAS(data)) throw new Error("To sporočilo ni od AS system.");
  return data;
}

export const STANJA = {
  delivered: ["Dostavljeno", "ok"],
  opened: ["Odprto", "ok"],
  clicked: ["Kliknjeno", "ok"],
  sent: ["Poslano", "caka"],
  queued: ["V vrsti", "caka"],
  scheduled: ["Načrtovano", "caka"],
  delivery_delayed: ["Zamuda", "caka"],
  bounced: ["Zavrnjeno (bounce)", "ne"],
  failed: ["Napaka", "ne"],
  complained: ["Označeno kot spam", "ne"],
  suppressed: ["Blokirano", "ne"],
  canceled: ["Preklicano", "ne"],
};

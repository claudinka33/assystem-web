import { Resend } from "resend";

function odjemalec() {
  const kljuc = process.env.RESEND_API_KEY;
  if (!kljuc) throw new Error("RESEND_API_KEY ni nastavljen.");
  return new Resend(kljuc);
}
const pocakaj = (ms) => new Promise((r) => setTimeout(r, ms));

// Zadnja poslana sporočila (Resend: največ 100 na stran, 2 klica/s).
export async function poslanaSporocila({ strani = 3, after = null } = {}) {
  const r = odjemalec();
  const vse = [];
  let kurzor = after;
  for (let i = 0; i < strani; i++) {
    const { data, error } = await r.emails.list({ limit: 100, ...(kurzor ? { after: kurzor } : {}) });
    if (error) throw new Error(error.message);
    vse.push(...(data?.data ?? []));
    if (!data?.has_more || !data.data?.length) return { sporocila: vse, vec: false };
    kurzor = data.data[data.data.length - 1].id;
    await pocakaj(550);
  }
  return { sporocila: vse, vec: true };
}

export async function poslanoSporocilo(id) {
  const { data, error } = await odjemalec().emails.get(id);
  if (error) throw new Error(error.message);
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

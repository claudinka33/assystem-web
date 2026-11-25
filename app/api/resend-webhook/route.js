import { Resend } from "resend";
import { supabaseAdmin } from "@/lib/supabase-server";

// Dogodki iz Resenda za mailinge, poslane kot posamezni maili (z oznako kampanja=<id>):
// dostavljeno, odprto, kliknjeno, odbito, pritožba, zavrnjeno → enovice_prejemniki.
// Webhook in njegovo skrivnost ustvari admin samodejno ob prvem pošiljanju
// (nastavitve.resend_webhook → { id, secret }).

export const dynamic = "force-dynamic";

async function skrivnost(sb) {
  const { data } = await sb.from("nastavitve").select("vrednost").eq("kljuc", "resend_webhook").maybeSingle();
  try {
    return JSON.parse(data?.vrednost ?? "{}").secret || process.env.RESEND_WEBHOOK_SECRET || null;
  } catch {
    return process.env.RESEND_WEBHOOK_SECRET || null;
  }
}

export async function POST(req) {
  const telo = await req.text();
  const sb = supabaseAdmin();
  const secret = await skrivnost(sb);
  if (!secret) return new Response("Ni skrivnosti", { status: 500 });

  let dogodek;
  try {
    dogodek = new Resend(process.env.RESEND_API_KEY).webhooks.verify({
      payload: telo,
      headers: {
        id: req.headers.get("svix-id"),
        timestamp: req.headers.get("svix-timestamp"),
        signature: req.headers.get("svix-signature"),
      },
      webhookSecret: secret,
    });
  } catch {
    return new Response("Neveljaven podpis", { status: 401 });
  }

  const d = dogodek?.data ?? {};
  const kampanja = Number(d.tags?.kampanja) || null;
  const email = String(d.to?.[0] ?? "").trim().toLowerCase();
  if (!kampanja || !email) return new Response("OK"); // ni mailing (npr. B2B obvestilo)

  const { data: z } = await sb
    .from("enovice_prejemniki")
    .select("dostavljeno, odprl, kliknil, povezave")
    .eq("kampanja_id", kampanja)
    .eq("email", email)
    .maybeSingle();
  if (!z) return new Response("OK");

  const pop = {};
  switch (dogodek.type) {
    case "email.delivered":
      pop.dostavljeno = true;
      break;
    case "email.opened":
      pop.dostavljeno = true;
      pop.odprl = (z.odprl ?? 0) + 1;
      break;
    case "email.clicked": {
      pop.dostavljeno = true;
      pop.kliknil = (z.kliknil ?? 0) + 1;
      if (!z.odprl) pop.odprl = 1;
      const url = d.click?.link;
      if (url) {
        const pov = Array.isArray(z.povezave) ? [...z.povezave] : [];
        const obst = pov.find((p) => p.url === url);
        if (obst) obst.kliki = (obst.kliki ?? 0) + 1;
        else pov.push({ url, kliki: 1 });
        pop.povezave = pov;
      }
      break;
    }
    case "email.bounced":
      pop.odbit = d.bounce?.type || "undetermined";
      break;
    case "email.complained":
      pop.pritozba = true;
      break;
    case "email.suppressed":
    case "email.failed":
      pop.zavrnjen = true;
      break;
    default:
      return new Response("OK");
  }
  await sb.from("enovice_prejemniki").update(pop).eq("kampanja_id", kampanja).eq("email", email);
  return new Response("OK");
}

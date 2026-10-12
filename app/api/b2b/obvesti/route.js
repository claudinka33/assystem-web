import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { supabaseAdmin } from "@/lib/supabase-server";
import { mailAktiviran } from "@/lib/b2b-maili";

// as-terminal (vasco_web_b2b.py) pokliče, ko kupca aktivira -> kupcu pošljemo mail.
// Avtorizacija: header x-skrivnost = Supabase secret key (as-terminal ga ima kot WEB_SUPABASE_KEY).
export async function POST(request) {
  const prejeto = Buffer.from(request.headers.get("x-skrivnost") ?? "");
  const pricakovano = Buffer.from(process.env.SUPABASE_SECRET_KEY ?? "");
  if (!pricakovano.length || prejeto.length !== pricakovano.length || !crypto.timingSafeEqual(prejeto, pricakovano)) {
    return NextResponse.json({ napaka: "ni dovoljeno" }, { status: 401 });
  }
  const { id } = await request.json().catch(() => ({}));
  const { data: k } = await supabaseAdmin().from("b2b_kupci").select("*").eq("id", id).single();
  if (!k || k.status !== "aktiven") return NextResponse.json({ napaka: "kupec ni aktiven" }, { status: 400 });
  try {
    await mailAktiviran(k);
  } catch (e) {
    return NextResponse.json({ napaka: e?.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

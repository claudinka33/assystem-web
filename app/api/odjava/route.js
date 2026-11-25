import { supabaseAdmin } from "@/lib/supabase-server";
import { preveriPodpis } from "@/lib/enovice-odjava";
import { klic, resendOdjemalec } from "@/lib/enovice-resend";

// Odjava od e-novic iz povezave v mailingu (GET = klik v mailu, POST = »one-click« iz Gmaila/Outlooka).
// Kontakt označi kot neaktiven v Bazi kontaktov in kot odjavljen v Resendu.

export const dynamic = "force-dynamic";

async function odjavi(url) {
  const email = String(url.searchParams.get("e") || "").trim().toLowerCase();
  const podpis = url.searchParams.get("t");
  const kampanja = Number(url.searchParams.get("k")) || null;
  if (!email || !preveriPodpis(email, podpis)) return { ok: false, email };

  const sb = supabaseAdmin();
  const zdaj = new Date().toISOString();
  await sb.from("baza_kontakti").update({ odjavljen: true, posodobljeno: zdaj }).eq("email", email);
  if (kampanja) {
    await sb.from("enovice_prejemniki").update({ odjavljen: true }).eq("kampanja_id", kampanja).eq("email", email);
  }
  try {
    await klic(() => resendOdjemalec().contacts.update({ email, unsubscribed: true }));
  } catch {}
  return { ok: true, email };
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function stran(ok, email) {
  const naslov = ok ? "Odjava uspešna" : "Povezava ni veljavna";
  const besedilo = ok
    ? `Naslov <b>${esc(email)}</b> ne bo več prejemal e-novic AS system.<br>Če ste se odjavili po pomoti, nam pišite na <a href="mailto:info@as-system.si">info@as-system.si</a>.`
    : `Odjave ni bilo mogoče potrditi. Pišite nam na <a href="mailto:info@as-system.si">info@as-system.si</a> in vas odjavimo ročno.`;
  return new Response(
    `<!DOCTYPE html><html lang="sl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${naslov} · AS system</title><meta name="robots" content="noindex"></head>
<body style="margin:0;background:#eef0f1;font-family:Arial,Helvetica,sans-serif;color:#3f4140">
<div style="max-width:520px;margin:60px auto;background:#fff;border-top:5px solid #cb2026;padding:34px 30px">
<p style="margin:0 0 6px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#cb2026;font-weight:700">AS system · e-novice</p>
<h1 style="margin:0 0 14px;font-size:26px">${naslov}</h1>
<p style="margin:0 0 22px;line-height:1.6">${besedilo}</p>
<a href="https://www.as-system.si" style="color:#cb2026;font-weight:700;text-decoration:none">as-system.si &rarr;</a>
</div></body></html>`,
    { status: ok ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export async function GET(req) {
  const r = await odjavi(new URL(req.url));
  return stran(r.ok, r.email);
}

export async function POST(req) {
  const r = await odjavi(new URL(req.url));
  return new Response(r.ok ? "OK" : "Neveljavno", { status: r.ok ? 200 : 400 });
}

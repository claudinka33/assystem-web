import { NextResponse } from "next/server";
import { supabaseB2B } from "@/lib/supabase-server";

// Povezava iz e-sporočila: potrditev e-naslova (signup/email), ponastavitev gesla (recovery) ali povabilo (invite).
// GET žetona NE porabi: Outlook/Microsoft Defender (Safe Links) in drugi pregledovalniki pošte povezave odprejo
// vnaprej in bi enkratni žeton porabili, preden ga klikne kupec. Zato GET pokaže stran z gumbom,
// žeton pa preverimo šele ob kliku (POST).
export async function GET(request) {
  const url = new URL(request.url);
  const cilj = new URL("/b2b/potrdi/nadaljuj", request.url);
  for (const k of ["token_hash", "type", "nov"]) {
    const v = url.searchParams.get(k);
    if (v) cilj.searchParams.set(k, v);
  }
  return NextResponse.redirect(cilj, 303);
}

export async function POST(request) {
  const f = await request.formData();
  const token_hash = String(f.get("token_hash") ?? "");
  const tipi = { recovery: "recovery", invite: "invite" };
  const type = tipi[String(f.get("type") ?? "")] ?? "email";
  const nov = String(f.get("nov") ?? "") === "1";
  if (token_hash) {
    const sb = await supabaseB2B();
    let { error } = await sb.auth.verifyOtp({ token_hash, type });
    if (error && type === "email") ({ error } = await sb.auth.verifyOtp({ token_hash, type: "signup" }));
    if (!error) {
      const cilj = type === "email" ? "/b2b/racun?potrjeno=1" : nov ? "/b2b/novo-geslo?nov=1" : "/b2b/novo-geslo";
      return NextResponse.redirect(new URL(cilj, request.url), 303);
    }
  }
  return NextResponse.redirect(new URL("/b2b/pozabljeno-geslo?potekla=1", request.url), 303);
}

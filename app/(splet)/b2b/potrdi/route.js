import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// Povezava iz e-sporočila: potrditev e-naslova (signup/email) ali ponastavitev gesla (recovery) ali povabilo (invite).
export async function GET(request) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const tipi = { recovery: "recovery", invite: "invite" };
  const type = tipi[url.searchParams.get("type")] ?? "email";
  const nov = url.searchParams.get("nov") === "1";
  if (token_hash) {
    const sb = await supabaseServer();
    let { error } = await sb.auth.verifyOtp({ token_hash, type });
    if (error && type === "email") ({ error } = await sb.auth.verifyOtp({ token_hash, type: "signup" }));
    if (!error) {
      const cilj = type === "email" ? "/b2b/racun?potrjeno=1" : nov ? "/b2b/novo-geslo?nov=1" : "/b2b/novo-geslo";
      return NextResponse.redirect(new URL(cilj, request.url), 303);
    }
  }
  return NextResponse.redirect(new URL("/b2b?napaka=povezava", request.url), 303);
}

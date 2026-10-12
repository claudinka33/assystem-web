import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// Povezava iz e-sporočila: potrditev e-naslova (signup/email) ali ponastavitev gesla (recovery).
export async function GET(request) {
  const url = new URL(request.url);
  const token_hash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") === "recovery" ? "recovery" : "email";
  if (token_hash) {
    const sb = await supabaseServer();
    let { error } = await sb.auth.verifyOtp({ token_hash, type });
    if (error && type === "email") ({ error } = await sb.auth.verifyOtp({ token_hash, type: "signup" }));
    if (!error) {
      return NextResponse.redirect(new URL(type === "recovery" ? "/b2b/novo-geslo" : "/b2b/racun?potrjeno=1", request.url), 303);
    }
  }
  return NextResponse.redirect(new URL("/b2b?napaka=povezava", request.url), 303);
}

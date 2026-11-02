import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

// Povratek po prijavi z Microsoftom: koda → seja v piškotkih.
export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (code) {
    const sb = await supabaseServer();
    const { error } = await sb.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL("/admin", url.origin));
  }
  return NextResponse.redirect(new URL("/admin/prijava?napaka=ms", url.origin));
}

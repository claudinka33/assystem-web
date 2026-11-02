import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

// app.assystem.si vpraša: ali ima ta zaposleni dostop do administracije?
// (samo za prikaz gumba — prava zaščita je v proxy.js in na strani)
const GLAVE = {
  "Access-Control-Allow-Origin": "https://app.assystem.si",
  Vary: "Origin",
  "Cache-Control": "no-store",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: { ...GLAVE, "Access-Control-Allow-Methods": "GET", "Access-Control-Allow-Headers": "content-type" },
  });
}

export async function GET(request) {
  const email = (new URL(request.url).searchParams.get("email") || "").trim().toLowerCase();
  let dostop = false;
  if (email.endsWith("@as-system.si")) {
    try {
      const sb = supabaseAdmin();
      const [a, d] = await Promise.all([
        sb.from("admin_uporabniki").select("id").ilike("email", email).limit(1),
        sb.from("admin_dostopi").select("email").eq("email", email).eq("aktiven", true).limit(1),
      ]);
      dostop = (a.data?.length ?? 0) + (d.data?.length ?? 0) > 0;
    } catch {
      dostop = false;
    }
  }
  return NextResponse.json({ dostop }, { headers: GLAVE });
}

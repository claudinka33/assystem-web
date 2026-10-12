import { NextResponse } from "next/server";
import { paypalZakljuci } from "@/lib/placila";
import { oznaciPlacano } from "@/lib/narocila-potrdila";
import { supabaseAdmin } from "@/lib/supabase-server";

// PayPal po potrditvi preusmeri kupca sem (?token=<PayPal order id>). Tu plačilo zaključimo (capture).
export async function GET(request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token) return NextResponse.redirect(new URL("/kosarica", request.url), 303);
  try {
    const r = await paypalZakljuci(token);
    if (r.placano && r.narociloId) {
      await oznaciPlacano(r.narociloId, { ref: r.ref, znesek: r.znesek, nacin: "paypal" });
      const { data: n } = await supabaseAdmin().from("narocila").select("stevilka, skupaj").eq("id", r.narociloId).single();
      const cilj = new URL("/blagajna/hvala", request.url);
      cilj.searchParams.set("st", n?.stevilka ?? r.stevilka ?? "");
      cilj.searchParams.set("p", "paypal");
      cilj.searchParams.set("z", String(n?.skupaj ?? r.znesek));
      return NextResponse.redirect(cilj, 303);
    }
    const cilj = new URL("/blagajna/preklic", request.url);
    if (r.stevilka) cilj.searchParams.set("st", r.stevilka);
    return NextResponse.redirect(cilj, 303);
  } catch (e) {
    console.error("PayPal vrnitev:", e?.message);
    return NextResponse.redirect(new URL("/blagajna/preklic?napaka=1", request.url), 303);
  }
}

import { NextResponse } from "next/server";
import { stripePreveriPodpis } from "@/lib/placila";
import { oznaciPlacano } from "@/lib/narocila-potrdila";

// Stripe → Developers → Webhooks: https://assystem.si/api/stripe/webhook
// Dogodki: checkout.session.completed, checkout.session.async_payment_succeeded
export async function POST(request) {
  const telo = await request.text();
  if (!stripePreveriPodpis(telo, request.headers.get("stripe-signature"))) {
    return NextResponse.json({ napaka: "neveljaven podpis" }, { status: 400 });
  }
  const dogodek = JSON.parse(telo);
  const s = dogodek.data?.object ?? {};
  if (
    (dogodek.type === "checkout.session.completed" || dogodek.type === "checkout.session.async_payment_succeeded") &&
    s.payment_status === "paid"
  ) {
    const id = Number(s.metadata?.narocilo_id || s.client_reference_id);
    if (id) await oznaciPlacano(id, { ref: s.payment_intent || s.id, znesek: (s.amount_total ?? 0) / 100, nacin: "kartica" });
  }
  return NextResponse.json({ prejeto: true });
}

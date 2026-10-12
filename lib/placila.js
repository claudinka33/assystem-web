// Spletna plačila: Stripe Checkout (kartice, Apple/Google Pay) in PayPal (Orders v2).
// Brez SDK-jev — samo REST klici. Uporablja se SAMO na strežniku.
//
// Okoljske spremenljivke (Vercel):
//   STRIPE_SECRET_KEY        sk_live_... (ali sk_test_...)
//   STRIPE_WEBHOOK_SECRET    whsec_...   (Stripe → Developers → Webhooks → /api/stripe/webhook)
//   PAYPAL_CLIENT_ID         iz developer.paypal.com → Apps & Credentials (Live)
//   PAYPAL_CLIENT_SECRET
//   PAYPAL_OKOLJE            "live" (privzeto) ali "sandbox" za testiranje
//   SPLET_URL                https://assystem.si (privzeto site.url)
import crypto from "node:crypto";
import { site } from "@/lib/site";

export const stripeVklopljen = () => Boolean(process.env.STRIPE_SECRET_KEY);
export const paypalVklopljen = () => Boolean(process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET);
const osnova = () => (process.env.SPLET_URL || site.url).replace(/\/$/, "");
const centi = (eur) => Math.round(Number(eur) * 100);

// ---------------- Stripe ----------------
function formular(obj, predpona = "", out = new URLSearchParams()) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const kljuc = predpona ? `${predpona}[${k}]` : k;
    if (typeof v === "object") formular(v, kljuc, out);
    else out.append(kljuc, String(v));
  }
  return out;
}

async function stripe(pot, metoda = "GET", telo) {
  const r = await fetch(`https://api.stripe.com/v1/${pot}`, {
    method: metoda,
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: telo ? formular(telo) : undefined,
    cache: "no-store",
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`Stripe: ${d?.error?.message ?? r.status}`);
  return d;
}

// Ustvari Stripe Checkout sejo za celotno naročilo in vrne URL za preusmeritev.
export async function stripeSeja(n) {
  const s = await stripe("checkout/sessions", "POST", {
    mode: "payment",
    locale: "sl",
    customer_email: n.kontakt_email,
    client_reference_id: String(n.id),
    metadata: { narocilo_id: String(n.id), stevilka: n.stevilka },
    payment_intent_data: { description: `Naročilo ${n.stevilka}`, metadata: { narocilo_id: String(n.id), stevilka: n.stevilka } },
    line_items: {
      0: {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: centi(n.skupaj),
          product_data: { name: `Naročilo ${n.stevilka} — AS system` },
        },
      },
    },
    success_url: `${osnova()}/blagajna/hvala?st=${encodeURIComponent(n.stevilka)}&p=kartica&z=${n.skupaj}&sid={CHECKOUT_SESSION_ID}`,
    cancel_url: `${osnova()}/blagajna/preklic?st=${encodeURIComponent(n.stevilka)}`,
  });
  return { url: s.url, ref: s.id };
}

export async function stripePreveriSejo(sid) {
  const s = await stripe(`checkout/sessions/${encodeURIComponent(sid)}`);
  return {
    placano: s.payment_status === "paid",
    narociloId: Number(s.metadata?.narocilo_id || s.client_reference_id),
    znesek: (s.amount_total ?? 0) / 100,
    ref: s.payment_intent || s.id,
  };
}

// Preveri podpis Stripe webhooka (header "stripe-signature": t=...,v1=...).
export function stripePreveriPodpis(telo, glava) {
  const skrivnost = process.env.STRIPE_WEBHOOK_SECRET;
  if (!skrivnost || !glava) return false;
  const deli = Object.fromEntries(
    glava.split(",").map((x) => {
      const i = x.indexOf("=");
      return [x.slice(0, i), x.slice(i + 1)];
    })
  );
  const podpisi = glava.split(",").filter((x) => x.startsWith("v1=")).map((x) => x.slice(3));
  if (!deli.t || !podpisi.length) return false;
  if (Math.abs(Date.now() / 1000 - Number(deli.t)) > 600) return false;
  const pricakovan = crypto.createHmac("sha256", skrivnost).update(`${deli.t}.${telo}`).digest("hex");
  return podpisi.some((p) => p.length === pricakovan.length && crypto.timingSafeEqual(Buffer.from(p), Buffer.from(pricakovan)));
}

// ---------------- PayPal ----------------
const paypalApi = () =>
  process.env.PAYPAL_OKOLJE === "sandbox" ? "https://api-m.sandbox.paypal.com" : "https://api-m.paypal.com";

async function paypalZeton() {
  const r = await fetch(`${paypalApi()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  const d = await r.json();
  if (!r.ok) throw new Error(`PayPal prijava: ${d?.error_description ?? r.status}`);
  return d.access_token;
}

async function paypal(pot, metoda = "GET", telo) {
  const r = await fetch(`${paypalApi()}${pot}`, {
    method: metoda,
    headers: { Authorization: `Bearer ${await paypalZeton()}`, "Content-Type": "application/json" },
    body: telo ? JSON.stringify(telo) : undefined,
    cache: "no-store",
  });
  const d = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`PayPal: ${d?.details?.[0]?.description ?? d?.message ?? r.status}`);
  return d;
}

// Ustvari PayPal naročilo in vrne URL za potrditev plačila.
export async function paypalNarocilo(n) {
  const d = await paypal("/v2/checkout/orders", "POST", {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: n.stevilka,
        custom_id: String(n.id),
        invoice_id: n.stevilka,
        description: `Naročilo ${n.stevilka} — AS system`,
        amount: { currency_code: "EUR", value: Number(n.skupaj).toFixed(2) },
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "AS system d.o.o.",
          locale: "sl-SI",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: `${osnova()}/api/paypal/vrnitev`,
          cancel_url: `${osnova()}/blagajna/preklic?st=${encodeURIComponent(n.stevilka)}`,
        },
      },
    },
  });
  const link = (d.links ?? []).find((l) => l.rel === "payer-action" || l.rel === "approve");
  if (!link) throw new Error("PayPal ni vrnil povezave za plačilo.");
  return { url: link.href, ref: d.id };
}

// Zaključi (capture) PayPal plačilo po vrnitvi kupca.
export async function paypalZakljuci(orderId) {
  let d;
  try {
    d = await paypal(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, "POST", {});
  } catch (e) {
    // že zaključeno (npr. osvežitev strani) -> preberi stanje
    d = await paypal(`/v2/checkout/orders/${encodeURIComponent(orderId)}`);
    if (d.status !== "COMPLETED") throw e;
  }
  const enota = d.purchase_units?.[0] ?? {};
  const cap = enota.payments?.captures?.[0];
  return {
    placano: d.status === "COMPLETED" && (!cap || cap.status === "COMPLETED"),
    narociloId: Number(enota.custom_id ?? cap?.custom_id),
    stevilka: enota.reference_id ?? cap?.invoice_id,
    znesek: Number(cap?.amount?.value ?? enota.amount?.value ?? 0),
    ref: cap?.id ?? d.id,
  };
}

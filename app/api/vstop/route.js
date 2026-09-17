import { NextResponse } from "next/server";

function zeton(geslo) {
  let h = 0;
  for (let i = 0; i < geslo.length; i++) {
    h = (h * 31 + geslo.charCodeAt(i)) >>> 0;
  }
  return `as${h.toString(36)}`;
}

export async function POST(request) {
  const podatki = await request.formData();
  const vpisano = String(podatki.get("geslo") ?? "");
  const geslo = process.env.SPLET_GESLO;

  if (!geslo || vpisano !== geslo) {
    return NextResponse.redirect(new URL("/v-pripravi?napaka=1", request.url), 303);
  }

  const odgovor = NextResponse.redirect(new URL("/", request.url), 303);
  odgovor.cookies.set("as_vstop", zeton(geslo), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return odgovor;
}

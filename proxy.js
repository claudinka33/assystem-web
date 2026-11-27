import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { poisciAdmina } from "./lib/admin-dostop";
import { kljucIzPoti, imaDostop } from "./lib/dovoljenja";

// B2B seja ima svoj piškotek (ločen od admin seje) — glej lib/supabase-server.js.
const B2B_PISKOTEK = "sb-b2b-auth-token";
const jeB2BPiskotek = (n) => n.startsWith(B2B_PISKOTEK);
const jeAdminPiskotek = (n) => n.startsWith("sb-") && n.includes("auth-token") && !jeB2BPiskotek(n);

// Ime piškotka, ki pove, da je obiskovalec vpisal geslo.
const PISKOTEK = "as_vstop";

// Poti, ki so dosegljive tudi med zaklepom.
// /api/stripe in /api/paypal morata biti dosegljiva za plačilne sisteme tudi med zaklepom.
const PROSTO = ["/v-pripravi", "/zasebnost", "/splosni-pogoji", "/pravna-obvestila", "/izjava-o-dostopnosti", "/api/vstop", "/api/obisk", "/api/stripe", "/api/paypal", "/api/b2b", "/api/admin-dostop", "/api/odjava", "/api/resend-webhook", "/admin", "/favicon.ico", "/robots.txt", "/llms.txt", "/sitemap.xml"];

function zeton(geslo) {
  // preprost odtis gesla, da v piškotku ni zapisano geslo samo
  let h = 0;
  for (let i = 0; i < geslo.length; i++) {
    h = (h * 31 + geslo.charCodeAt(i)) >>> 0;
  }
  return `as${h.toString(36)}`;
}

// Slike polic za trgovce — samo za aktivne B2B kupce in admine.
const ZASCITENE_SLIKE = ["/slike/trgovci/", "/slike/silvermate/polica-"];

async function uporabnikIzPiskotka(request, piskotek) {
  const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
    ...(piskotek ? { cookieOptions: { name: piskotek } } : {}),
    cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} },
  });
  const { data: { user } } = await sb.auth.getUser();
  return user;
}

async function imaDostopDoPolic(request) {
  const imena = request.cookies.getAll().map((c) => c.name);
  const b2b = imena.some(jeB2BPiskotek);
  const adm = imena.some(jeAdminPiskotek);
  if (!b2b && !adm) return false;
  try {
    const servis = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    if (b2b) {
      const user = await uporabnikIzPiskotka(request, B2B_PISKOTEK);
      if (user) {
        const { data: k } = await servis.from("b2b_kupci").select("status, vasco_partner").eq("user_id", user.id).maybeSingle();
        if (k && k.status === "aktiven" && k.vasco_partner) return true;
      }
    }
    if (adm) {
      const user = await uporabnikIzPiskotka(request, null);
      if (user && (await poisciAdmina(servis, user))) return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function proxy(request) {
  // ---------- jezik: /en/... in /de/... sta prevedeni različici slovenske strani ----------
  const izvirnaPot = request.nextUrl.pathname;
  // Stara stran as-system.si je imela jezik v ?lang=… → preusmeri na čist naslov (sl) ali /en, /de, /hr
  const staraLang = request.nextUrl.searchParams.get("lang");
  if (staraLang !== null) {
    const cilj = request.nextUrl.clone();
    cilj.searchParams.delete("lang");
    const j = staraLang.toLowerCase().slice(0, 2);
    if (["en", "de", "hr"].includes(j) && !/^\/(en|de|hr)(\/|$)/.test(izvirnaPot)) {
      cilj.pathname = `/${j}${izvirnaPot === "/" ? "" : izvirnaPot}`;
    }
    return NextResponse.redirect(cilj, 308);
  }
  const ujemanje = izvirnaPot.match(/^\/(en|de|hr)(\/|$)/);
  const jezikZahteve = ujemanje ? ujemanje[1] : null;
  const pathname = jezikZahteve ? izvirnaPot.slice(3) || "/" : izvirnaPot;

  // Nadaljuj na stran; pri /en in /de prepiši pot brez predpone in povej jezik (glava x-jezik).
  const nadaljuj = () => {
    const h = new Headers(request.headers);
    h.delete("x-jezik");
    if (!jezikZahteve) return NextResponse.next({ request: { headers: h } });
    h.set("x-jezik", jezikZahteve);
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    return NextResponse.rewrite(url, { request: { headers: h } });
  };

  // Zaposlitev je samo v slovenski različici: /en/zaposlitev → /en
  if (jezikZahteve && (pathname === "/zaposlitev" || pathname.startsWith("/zaposlitev/"))) {
    const cilj = request.nextUrl.clone();
    cilj.pathname = `/${jezikZahteve}`;
    return NextResponse.redirect(cilj);
  }

  // Administracija in API nimata jezikovnih različic.
  if (jezikZahteve && (pathname.startsWith("/admin") || pathname.startsWith("/api/"))) {
    const cilj = request.nextUrl.clone();
    cilj.pathname = pathname;
    return NextResponse.redirect(cilj);
  }

  // ---------- slike polic samo za B2B ----------
  if (ZASCITENE_SLIKE.some((p) => pathname.startsWith(p)) && !(await imaDostopDoPolic(request))) {
    return new NextResponse("Ni dostopa", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  // ---------- zaklep strani ----------
  // Stran je javna od 23. 11. 2026. Zaklep z geslom se vklopi samo, če je SPLET_ZAKLEP=1.
  const geslo = process.env.SPLET_ZAKLEP === "1" ? process.env.SPLET_GESLO : null;
  if (geslo) {
    const dovoljeno =
      PROSTO.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/slike/") ||
      /\.(png|jpg|jpeg|svg|webp|ico|pdf|mp4|css|js|woff2?)$/.test(pathname);

    if (!dovoljeno && request.cookies.get(PISKOTEK)?.value !== zeton(geslo)) {
      const cilj = request.nextUrl.clone();
      cilj.pathname = "/v-pripravi";
      cilj.search = "";
      const h = new Headers(request.headers);
      h.delete("x-jezik");
      if (jezikZahteve) h.set("x-jezik", jezikZahteve);
      return NextResponse.rewrite(cilj, { request: { headers: h } });
    }
  }

  // ---------- osvezitev seje (admin in prijavljeni B2B kupci) ----------
  let response = nadaljuj();

  const imena = request.cookies.getAll().map((c) => c.name);

  // B2B seja (ločen piškotek) — samo osvežitev žetona
  if (imena.some(jeB2BPiskotek) && !pathname.startsWith("/api/") && !pathname.startsWith("/admin")) {
    const b2b = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
      cookieOptions: { name: B2B_PISKOTEK },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = nadaljuj();
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    });
    await b2b.auth.getUser();
  }

  const imaSejo = imena.some(jeAdminPiskotek);
  if (pathname.startsWith("/admin") || (imaSejo && !pathname.startsWith("/api/"))) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (list) => {
            list.forEach(({ name, value }) => request.cookies.set(name, value));
            const prej = response.cookies.getAll(); // ohrani morebitne osvežene B2B piškotke
            response = nadaljuj();
            prej.forEach((c) => response.cookies.set(c));
            list.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            );
          },
        },
      }
    );
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Omejeni uredniki: dela, ki ga nimajo odkljukanega, ne odpre niti ročno vtipkan naslov.
    const kljuc = kljucIzPoti(pathname);
    if (kljuc && user) {
      try {
        const servis = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const admin = await poisciAdmina(servis, user);
        if (admin && !imaDostop(admin, kljuc)) {
          const cilj = request.nextUrl.clone();
          cilj.pathname = "/admin";
          cilj.search = "?ni_dostopa=1";
          const preusmeri = NextResponse.redirect(cilj);
          response.cookies.getAll().forEach((c) => preusmeri.cookies.set(c));
          return preusmeri;
        }
      } catch {
        // ob napaki baze pusti naprej — stran sama zahteva prijavo
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

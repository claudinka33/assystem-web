import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { poisciAdmina } from "./lib/admin-dostop";
import { kljucIzPoti, imaDostop } from "./lib/dovoljenja";

// Ime piškotka, ki pove, da je obiskovalec vpisal geslo.
const PISKOTEK = "as_vstop";

// Poti, ki so dosegljive tudi med zaklepom.
// /api/stripe in /api/paypal morata biti dosegljiva za plačilne sisteme tudi med zaklepom.
const PROSTO = ["/v-pripravi", "/zasebnost", "/splosni-pogoji", "/pravna-obvestila", "/izjava-o-dostopnosti", "/api/vstop", "/api/obisk", "/api/stripe", "/api/paypal", "/api/b2b", "/api/admin-dostop", "/admin", "/favicon.ico", "/robots.txt"];

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

async function imaDostopDoPolic(request) {
  const imaSejo = request.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
  if (!imaSejo) return false;
  try {
    const sb = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY, {
      cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} },
    });
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return false;
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data: k } = await admin.from("b2b_kupci").select("status, vasco_partner").eq("user_id", user.id).maybeSingle();
    if (k && k.status === "aktiven" && k.vasco_partner) return true;
    return Boolean(await poisciAdmina(admin, user));
  } catch {
    return false;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // ---------- slike polic samo za B2B ----------
  if (ZASCITENE_SLIKE.some((p) => pathname.startsWith(p)) && !(await imaDostopDoPolic(request))) {
    return new NextResponse("Ni dostopa", { status: 404, headers: { "Cache-Control": "no-store" } });
  }

  // ---------- zaklep strani ----------
  const geslo = process.env.SPLET_GESLO;
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
      return NextResponse.rewrite(cilj);
    }
  }

  // ---------- osvezitev seje (admin in prijavljeni B2B kupci) ----------
  let response = NextResponse.next({ request });

  const imaSejo = request.cookies.getAll().some((c) => c.name.startsWith("sb-") && c.name.includes("auth-token"));
  if (pathname.startsWith("/admin") || (imaSejo && !pathname.startsWith("/api/"))) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_KEY,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (list) => {
            list.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
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

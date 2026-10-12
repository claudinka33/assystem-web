import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Ime piškotka, ki pove, da je obiskovalec vpisal geslo.
const PISKOTEK = "as_vstop";

// Poti, ki so dosegljive tudi med zaklepom.
// /api/stripe in /api/paypal morata biti dosegljiva za plačilne sisteme tudi med zaklepom.
const PROSTO = ["/v-pripravi", "/api/vstop", "/api/stripe", "/api/paypal", "/api/b2b", "/admin", "/favicon.ico", "/robots.txt"];

function zeton(geslo) {
  // preprost odtis gesla, da v piškotku ni zapisano geslo samo
  let h = 0;
  for (let i = 0; i < geslo.length; i++) {
    h = (h * 31 + geslo.charCodeAt(i)) >>> 0;
  }
  return `as${h.toString(36)}`;
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // ---------- zaklep strani ----------
  const geslo = process.env.SPLET_GESLO;
  if (geslo) {
    const dovoljeno =
      PROSTO.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
      pathname.startsWith("/_next") ||
      pathname.startsWith("/slike/") ||
      /\.(png|jpg|jpeg|svg|webp|ico|pdf|css|js|woff2?)$/.test(pathname);

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
    await supabase.auth.getUser();
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

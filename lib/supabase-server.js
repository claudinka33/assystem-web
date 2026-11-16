import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { poisciAdmina } from "@/lib/admin-dostop";

// B2B kupci imajo svojo sejo v ločenem piškotku — prijava v admin NI prijava v B2B (in obratno),
// zato je lahko admin v istem brskalniku hkrati prijavljen v B2B kot testna stranka.
export const B2B_PISKOTEK = "sb-b2b-auth-token";

// Odjemalec, ki pozna prijavljenega uporabnika (bere sejo iz piškotkov) — ADMIN seja.
export async function supabaseServer(piskotek) {
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    {
      ...(piskotek ? { cookieOptions: { name: piskotek } } : {}),
      cookies: {
        getAll: () => jar.getAll(),
        setAll: (list) => {
          try {
            list.forEach(({ name, value, options }) => jar.set(name, value, options));
          } catch {
            // klic iz server komponente — piškotke nastavi middleware
          }
        },
      },
    }
  );
}

// Odjemalec za B2B sejo kupca (ločen piškotek).
export const supabaseB2B = () => supabaseServer(B2B_PISKOTEK);

// Odjemalec s tajnim ključem — obide RLS. Uporablja se SAMO na strežniku,
// v server actions in route handlerjih, nikoli v komponentah brskalnika.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}

// Vrne prijavljenega administratorja ali null.
export async function trenutniAdmin() {
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  // vrne { id, email, ime, vloga, dovoljenja } — dovoljenja null = polni admin
  return poisciAdmina(supabaseAdmin(), user);
}

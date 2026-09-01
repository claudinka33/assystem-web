import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Odjemalec, ki pozna prijavljenega uporabnika (bere sejo iz piškotkov).
export async function supabaseServer() {
  const jar = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    {
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

  const { data } = await supabaseAdmin()
    .from("admin_uporabniki")
    .select("id, email, ime, vloga")
    .eq("id", user.id)
    .single();

  return data ?? null;
}

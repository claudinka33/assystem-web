// Odjemalec za brskalnik — uporablja javni (publishable) ključ.
// Bere lahko samo tisto, kar dovoljujejo pravila RLS v bazi.
import { createBrowserClient } from "@supabase/ssr";

export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY
  );
}

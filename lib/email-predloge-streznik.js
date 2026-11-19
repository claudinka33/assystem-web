// Naloži predlogo e-pošte (privzeto + spremembe iz administracije). Samo strežnik.
import { supabaseAdmin } from "@/lib/supabase-server";
import { KLJUC_PREDLOGE, razcleniPredloge, zdruziPredlogo } from "@/lib/email-predloge";

export async function naloziShranjene() {
  try {
    const { data } = await supabaseAdmin().from("nastavitve").select("vrednost").eq("kljuc", KLJUC_PREDLOGE).maybeSingle();
    return razcleniPredloge(data?.vrednost);
  } catch {
    return {};
  }
}

export async function naloziPredlogo(kljuc) {
  return zdruziPredlogo(kljuc, await naloziShranjene());
}

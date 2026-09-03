import { createClient } from "@supabase/supabase-js";

// Besedila, ki jih urejaš v adminu. Vsak kos ima svoj ključ, npr.
// "domov.hero.naslov". Če ključa v bazi ni, se uporabi privzeto besedilo
// iz kode — stran zato nikoli ne ostane prazna.
export async function pridobiVsebine(stran) {
  try {
    const sb = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_KEY,
      { auth: { persistSession: false } }
    );
    let q = sb.from("vsebine").select("kljuc, naslov, besedilo, slika_url");
    if (stran) q = q.eq("stran", stran);
    const { data } = await q;
    return Object.fromEntries((data ?? []).map((v) => [v.kljuc, v]));
  } catch {
    return {};
  }
}

// Vrne polje iz baze ali privzeto vrednost.
export function v(vsebine, kljuc, polje, privzeto) {
  const zapis = vsebine?.[kljuc];
  const vrednost = zapis?.[polje];
  return vrednost === null || vrednost === undefined || vrednost === ""
    ? privzeto
    : vrednost;
}

// Branje javnih podatkov iz baze. Uporablja javni ključ, zato vidi
// samo tisto, kar dovoljujejo pravila RLS (objavljeno = true).
import { createClient } from "@supabase/supabase-js";
import { kategorije as rezervne } from "@/lib/site";

function sb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_KEY,
    { auth: { persistSession: false } }
  );
}

// Dokler baza ni napolnjena, stran uporabi seznam iz lib/site.js,
// da ni prazna. Ko vneseš prvo kategorijo, se prikaže baza.
export async function pridobiKategorije() {
  try {
    const { data, error } = await sb()
      .from("kategorije")
      .select("id, slug, naziv, opis, slika_url, nadrejena_id")
      .is("nadrejena_id", null)
      .order("vrstni_red")
      .order("naziv");

    if (error || !data || data.length === 0) return { seznam: rezervne, izBaze: false };

    return {
      seznam: data.map((k) => ({
        slug: k.slug,
        naziv: k.naziv,
        opis: k.opis,
        slika: k.slika_url,
      })),
      izBaze: true,
    };
  } catch {
    return { seznam: rezervne, izBaze: false };
  }
}

export async function pridobiKategorijo(slug) {
  const { data } = await sb()
    .from("kategorije")
    .select("id, slug, naziv, opis, slika_url, seo_naslov, seo_opis")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

export async function pridobiPodkategorije(nadrejenaId) {
  const { data } = await sb()
    .from("kategorije")
    .select("id, slug, naziv, opis, slika_url")
    .eq("nadrejena_id", nadrejenaId)
    .order("vrstni_red");
  return data ?? [];
}

export async function pridobiIzdelke(kategorijaId) {
  const { data } = await sb()
    .from("izdelki")
    .select("id, slug, naziv, kratek_opis, slika_url, eta_stevilka")
    .eq("kategorija_id", kategorijaId)
    .order("vrstni_red")
    .order("naziv");
  return data ?? [];
}

export async function pridobiIzdelek(slug) {
  const { data } = await sb()
    .from("izdelki")
    .select(
      `id, slug, naziv, kratek_opis, opis, tehnicni_opis, uporaba, prednosti,
       slika_url, material, eta_stevilka, seo_naslov, seo_opis,
       kategorije ( slug, naziv ),
       artikli ( id, sifra, naziv, dimenzija, premer, dolzina, ean, enota,
                 pakiranje, cena_mpc, zaloga, objavljeno ),
       dokumenti ( id, naziv, tip, jezik, datoteka_url )`
    )
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

export async function pridobiNovice(omejitev = 20) {
  const { data } = await sb()
    .from("novice")
    .select("id, slug, naslov, povzetek, slika_url, objavljeno_dne")
    .order("objavljeno_dne", { ascending: false })
    .limit(omejitev);
  return data ?? [];
}

export async function pridobiNovico(slug) {
  const { data } = await sb().from("novice").select("*").eq("slug", slug).maybeSingle();
  return data ?? null;
}

export async function pridobiNastavitve() {
  try {
    const { data } = await sb().from("nastavitve").select("kljuc, vrednost");
    return Object.fromEntries((data ?? []).map((n) => [n.kljuc, n.vrednost]));
  } catch {
    return {};
  }
}

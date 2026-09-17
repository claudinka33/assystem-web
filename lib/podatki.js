// Branje javnih podatkov iz baze. Uporablja javni ključ, zato vidi
// samo tisto, kar dovoljujejo pravila RLS (objavljeno = true).
import { createClient } from "@supabase/supabase-js";
import { kategorije as rezervne } from "@/lib/site";

function sb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const kljuc = process.env.NEXT_PUBLIC_SUPABASE_KEY;
  if (!url || !kljuc) return null;
  return createClient(url, kljuc, { auth: { persistSession: false } });
}

// Dokler baza ni napolnjena, stran uporabi seznam iz lib/site.js,
// da ni prazna. Ko vneseš prvo kategorijo, se prikaže baza.
export async function pridobiKategorije() {
  try {
    const s = sb();
    if (!s) return { seznam: rezervne, izBaze: false };
    const { data, error } = await s
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
  const s = sb();
  if (!s) return null;
  const { data } = await s
    .from("kategorije")
    .select("id, slug, naziv, opis, slika_url, seo_naslov, seo_opis")
    .eq("slug", slug)
    .maybeSingle();
  return data ?? null;
}

export async function pridobiPodkategorije(nadrejenaId) {
  const s = sb();
  if (!s) return [];
  const { data } = await s
    .from("kategorije")
    .select("id, slug, naziv, opis, slika_url")
    .eq("nadrejena_id", nadrejenaId)
    .order("vrstni_red");
  return data ?? [];
}

export async function pridobiIzdelke(kategorijaId) {
  const s = sb();
  if (!s) return [];
  const { data } = await s
    .from("izdelki")
    .select("id, slug, naziv, kratek_opis, slika_url, eta_stevilka")
    .eq("kategorija_id", kategorijaId)
    .order("vrstni_red")
    .order("naziv");
  return data ?? [];
}

export async function pridobiIzdelek(slug) {
  const s = sb();
  if (!s) return null;
  const { data } = await s
    .from("izdelki")
    .select(
      `id, slug, naziv, kratek_opis, opis, tehnicni_opis, uporaba, prednosti,
       slika_url, galerija, material, eta_stevilka, seo_naslov, seo_opis,
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
  const s = sb();
  if (!s) return [];
  const { data } = await s
    .from("novice")
    .select("id, slug, naslov, povzetek, slika_url, objavljeno_dne")
    .order("objavljeno_dne", { ascending: false })
    .limit(omejitev);
  return data ?? [];
}

export async function pridobiNovico(slug) {
  const s = sb();
  if (!s) return null;
  const { data } = await s.from("novice").select("*").eq("slug", slug).maybeSingle();
  return data ?? null;
}

export async function pridobiNastavitve() {
  try {
    const s = sb();
    if (!s) return {};
    const { data } = await s.from("nastavitve").select("kljuc, vrednost");
    return Object.fromEntries((data ?? []).map((n) => [n.kljuc, n.vrednost]));
  } catch {
    return {};
  }
}

export async function pridobiDelovnaMesta() {
  try {
    const s = sb();
    if (!s) return [];
    const { data } = await s
      .from("delovna_mesta")
      .select("id, slug, naziv, lokacija, vrsta, opis, rok_prijave")
      .order("ustvarjeno", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export async function pridobiDokumente() {
  try {
    const s = sb();
    if (!s) return [];
    const { data } = await s
      .from("dokumenti")
      .select("id, naziv, tip, jezik, datoteka_url, izdelki ( naziv )")
      .order("tip")
      .limit(200);
    return data ?? [];
  } catch {
    return [];
  }
}

// Iskanje po nazivih izdelkov in sifrah artiklov.
export async function isci(niz) {
  const q = (niz || "").trim();
  if (q.length < 2) return { izdelki: [], artikli: [] };

  const s = sb();
  if (!s) return { izdelki: [], artikli: [] };
  const vzorec = `%${q}%`;

  const [poIzdelkih, poArtiklih] = await Promise.all([
    s.from("izdelki")
      .select("id, slug, naziv, kratek_opis, slika_url, kategorije ( slug, naziv )")
      .or(`naziv.ilike.${vzorec},kratek_opis.ilike.${vzorec}`)
      .limit(24),
    s.from("artikli")
      .select("id, sifra, naziv, dimenzija, pakiranje, izdelki ( slug, naziv, kategorije ( slug ) )")
      .or(`sifra.ilike.${vzorec},naziv.ilike.${vzorec},ean.ilike.${vzorec}`)
      .limit(40),
  ]);

  return { izdelki: poIzdelkih.data ?? [], artikli: poArtiklih.data ?? [] };
}

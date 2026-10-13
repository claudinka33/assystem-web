// Branje javnih podatkov iz baze. Uporablja javni ključ, zato vidi
// samo tisto, kar dovoljujejo pravila RLS (objavljeno = true).
import { createClient } from "@supabase/supabase-js";
import { kategorije as rezervne } from "@/lib/site";
import { dolociZnamko } from "@/lib/znamke";
import fs from "fs";
import path from "path";

// Slika kategorije iz repa (public/slike/kategorije/<slug>.jpg) ima prednost
// pred povezavo v bazi — tako slike dodamo s commitom, brez admina.
function lokalnaSlikaKategorije(slug, naziv = "") {
  const n = (naziv || "").toLowerCase();
  const kandidati = [slug];
  if (n.includes("beton")) kandidati.push("pritrdila-za-beton");
  if (n.includes("zidni")) kandidati.push("zidni-vlozki");
  if (n.includes("kemi")) kandidati.push("kemicna-pritrditev");
  if (n.includes("inštalac") || n.includes("instalac")) kandidati.push("pritrdila-za-instalacije");
  for (const k of kandidati) {
    if (!k) continue;
    const dat = path.join(process.cwd(), "public", "slike", "kategorije", `${k}.jpg`);
    try {
      if (fs.existsSync(dat)) return `/slike/kategorije/${k}.jpg`;
    } catch {}
  }
  return null;
}

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
        slika: lokalnaSlikaKategorije(k.slug, k.naziv) || k.slika_url,
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

// Izdelki kategorije: tisti, ki so v njej doma, in tisti, ki so ji
// dodatno pripisani v tabeli izdelki_kategorije (en izdelek v vec kategorijah).
export async function pridobiIzdelke(kategorijaId) {
  const s = sb();
  if (!s) return [];
  const { data: povezave } = await s
    .from("izdelki_kategorije")
    .select("izdelek_id")
    .eq("kategorija_id", kategorijaId);
  const dodatni = (povezave ?? []).map((p) => p.izdelek_id);

  let poizvedba = s
    .from("izdelki")
    .select("id, slug, naziv, kratek_opis, slika_url, eta_stevilka");
  poizvedba = dodatni.length
    ? poizvedba.or(`kategorija_id.eq.${kategorijaId},id.in.(${dodatni.join(",")})`)
    : poizvedba.eq("kategorija_id", kategorijaId);
  const { data } = await poizvedba.order("vrstni_red").order("naziv");
  return dodajZnamke(s, data ?? []);
}

// Znamka vsakega izdelka: vpis v adminu (stolpec znamka), sicer pravilo iz lib/znamke.js
// po šifrah artiklov in korenski kategoriji. Če stolpca še ni, deluje samo pravilo.
async function dodajZnamke(s, izdelki) {
  if (!izdelki.length) return izdelki;
  const ids = izdelki.map((i) => i.id);
  let { data, error } = await s
    .from("izdelki")
    .select("id, slug, znamka, kategorija_id, artikli ( sifra )")
    .in("id", ids);
  if (error) {
    ({ data } = await s.from("izdelki").select("id, slug, kategorija_id, artikli ( sifra )").in("id", ids));
  }
  const koren = await korenskeKategorije(s);
  const po = Object.fromEntries(
    (data ?? []).map((r) => [
      r.id,
      dolociZnamko({
        znamka: r.znamka,
        slug: r.slug,
        sifre: (r.artikli ?? []).map((a) => a.sifra),
        korenska: koren[String(r.kategorija_id)] ?? "",
      }),
    ])
  );
  return izdelki.map((i) => ({ ...i, znamka: po[i.id] ?? null }));
}

// id kategorije -> slug njene korenske kategorije (za pravilo znamke)
async function korenskeKategorije(s) {
  const { data } = await s.from("kategorije").select("id, slug, nadrejena_id");
  const po = Object.fromEntries((data ?? []).map((k) => [String(k.id), k]));
  const out = {};
  for (const k of data ?? []) {
    let x = k;
    for (let i = 0; x?.nadrejena_id && i < 10; i++) x = po[String(x.nadrejena_id)];
    out[String(k.id)] = x?.slug ?? "";
  }
  return out;
}

export async function pridobiIzdelek(slug) {
  const s = sb();
  if (!s) return null;
  const { data } = await s
    .from("izdelki")
    .select(
      `id, slug, naziv, kratek_opis, opis, tehnicni_opis, uporaba, prednosti, kategorija_id,
       slika_url, galerija, material, eta_stevilka, seo_naslov, seo_opis,
       kategorije!izdelki_kategorija_id_fkey ( slug, naziv ),
       artikli ( id, sifra, naziv, dimenzija, premer, dolzina, ean, enota,
                 pakiranje, cena_mpc, cena_vasco, vasco_enota, zaloga, objavljeno, lastnosti ),
       dokumenti ( id, naziv, tip, jezik, datoteka_url )`
    )
    .eq("slug", slug)
    .maybeSingle();
  if (!data) return null;
  // Legenda embalaže je v ločenem stolpcu; če ga še ni, stran deluje naprej brez nje.
  const { data: emb, error } = await s.from("izdelki").select("embalaza").eq("id", data.id).maybeSingle();
  const [zn] = await dodajZnamke(s, [{ id: data.id }]);
  return { ...data, embalaza: !error && Array.isArray(emb?.embalaza) ? emb.embalaza : [], znamka: zn?.znamka ?? null };
}

// Sorodni izdelki za dno strani izdelka: najprej iz iste kategorije,
// če jih je premalo, dopolni z drugimi izdelki.
export async function pridobiSorodne(izdelek, kategorijaSlug, omejitev = 8) {
  const s = sb();
  if (!s || !izdelek?.id) return [];
  try {
    const out = [];
    if (izdelek.kategorija_id) {
      const iz = await pridobiIzdelke(izdelek.kategorija_id);
      for (const x of iz) {
        if (x.id === izdelek.id) continue;
        out.push({ ...x, href: `/program/${kategorijaSlug}/${x.slug}` });
      }
    }
    if (out.length < 4) {
      const { data } = await s
        .from("izdelki")
        .select("id, slug, naziv, kratek_opis, slika_url, kategorije!izdelki_kategorija_id_fkey ( slug )")
        .neq("id", izdelek.id)
        .order("vrstni_red")
        .limit(16);
      for (const x of data ?? []) {
        if (out.length >= omejitev) break;
        if (!x.kategorije?.slug || out.some((o) => o.id === x.id)) continue;
        out.push({ ...x, href: `/program/${x.kategorije.slug}/${x.slug}` });
      }
    }
    return dodajZnamke(s, out.slice(0, omejitev));
  } catch {
    return [];
  }
}

// Bazen izdelkov iz drugih skupin za blok "Kaj vse še ponujamo".
// Izbor in mešanje naredi brskalnik, da vsak obisk pokaže drugačen nabor.
export async function pridobiPonudbo(izdelek, izpusti = []) {
  const s = sb();
  if (!s || !izdelek?.id) return [];
  try {
    const { data } = await s
      .from("izdelki")
      .select("id, slug, naziv, kratek_opis, slika_url, kategorija_id, kategorije!izdelki_kategorija_id_fkey ( slug, naziv )")
      .neq("id", izdelek.id)
      .limit(300);
    const brez = new Set(izpusti);
    const seznam = (data ?? [])
      .filter((x) => x.kategorije?.slug && !brez.has(x.id) && x.kategorija_id !== izdelek.kategorija_id)
      .map((x) => ({
        id: x.id,
        slug: x.slug,
        naziv: x.naziv,
        kratek_opis: x.kratek_opis ?? null,
        slika_url: x.slika_url ?? null,
        skupina: x.kategorije.naziv,
        href: `/program/${x.kategorije.slug}/${x.slug}`,
      }));
    return dodajZnamke(s, seznam);
  } catch {
    return [];
  }
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
      .select("id, slug, naziv, lokacija, vrsta, kratek_opis, opis, slika_url, rok_prijave")
      .order("vrstni_red")
      .order("naziv");
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
      .select("id, slug, naziv, kratek_opis, slika_url, kategorije!izdelki_kategorija_id_fkey ( slug, naziv )")
      .or(`naziv.ilike.${vzorec},kratek_opis.ilike.${vzorec}`)
      .limit(24),
    s.from("artikli")
      .select("id, sifra, naziv, dimenzija, pakiranje, izdelki ( slug, naziv, kategorije!izdelki_kategorija_id_fkey ( slug ) )")
      .or(`sifra.ilike.${vzorec},naziv.ilike.${vzorec},ean.ilike.${vzorec}`)
      .limit(40),
  ]);

  return { izdelki: await dodajZnamke(s, poIzdelkih.data ?? []), artikli: poArtiklih.data ?? [] };
}

export async function pridobiDelovnoMesto(slug) {
  const s = sb();
  if (!s) return null;
  const { data } = await s.from("delovna_mesta").select("*").eq("slug", slug).maybeSingle();
  return data ?? null;
}

// Izdelki po seznamu slugov (za stran Rešitve)
export async function pridobiIzdelkePoSlugih(slugi) {
  const s = sb();
  if (!s || !slugi?.length) return {};
  try {
    const { data } = await s
      .from("izdelki")
      .select("slug, naziv, kratek_opis, slika_url, kategorije!izdelki_kategorija_id_fkey ( slug )")
      .in("slug", slugi);
    const out = {};
    for (const i of data ?? []) {
      out[i.slug] = {
        naziv: i.naziv,
        opis: i.kratek_opis,
        slika: i.slika_url,
        href: i.kategorije?.slug ? `/program/${i.kategorije.slug}/${i.slug}` : null,
      };
    }
    return out;
  } catch {
    return {};
  }
}

// Vsi objavljeni izdelki ene znamke (za stran znamke), s povezavo in kategorijo.
export async function pridobiIzdelkeZnamke(znamka) {
  const s = sb();
  if (!s) return [];
  try {
    const { data } = await s
      .from("izdelki")
      .select("id, slug, naziv, kratek_opis, slika_url, vrstni_red, kategorije!izdelki_kategorija_id_fkey ( slug, naziv )")
      .order("vrstni_red")
      .order("naziv")
      .limit(1000);
    const z = await dodajZnamke(s, data ?? []);
    return z
      .filter((i) => i.znamka === znamka && i.kategorije?.slug)
      .map((i) => ({ ...i, href: `/program/${i.kategorije.slug}/${i.slug}`, skupina: i.kategorije.naziv }));
  } catch {
    return [];
  }
}

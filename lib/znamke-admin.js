// Pregled znamk za admin: vpis v bazi + predlog po pravilu (samo strežnik).
import { supabaseAdmin } from "@/lib/supabase-server";
import { normZnamka, predlogZnamke, razcleniSkrite, KLJUC_SKRITE } from "@/lib/znamke";

export async function skriteZnamkeAdmin() {
  const { data } = await supabaseAdmin().from("nastavitve").select("vrednost").eq("kljuc", KLJUC_SKRITE).maybeSingle();
  return razcleniSkrite(data?.vrednost);
}

export async function izdelkiZPredlogi() {
  const sb = supabaseAdmin();
  let stolpec = true;
  let { data, error } = await sb
    .from("izdelki")
    .select("id, naziv, slug, znamka, kategorija_id, objavljeno, artikli ( sifra )")
    .order("naziv");
  if (error) {
    stolpec = false;
    ({ data } = await sb
      .from("izdelki")
      .select("id, naziv, slug, kategorija_id, objavljeno, artikli ( sifra )")
      .order("naziv"));
  }
  const { data: kat } = await sb.from("kategorije").select("id, slug, naziv, nadrejena_id");
  const po = Object.fromEntries((kat ?? []).map((k) => [String(k.id), k]));
  const koren = (id) => {
    let x = po[String(id)];
    for (let i = 0; x?.nadrejena_id && i < 10; i++) x = po[String(x.nadrejena_id)];
    return x?.slug ?? "";
  };
  const seznam = (data ?? []).map((i) => {
    const sifre = (i.artikli ?? []).map((a) => a.sifra).filter(Boolean);
    return {
      id: i.id,
      naziv: i.naziv,
      objavljeno: i.objavljeno,
      kategorija: po[String(i.kategorija_id)]?.naziv ?? "—",
      sifre,
      vpis: normZnamka(i.znamka),
      predlog: predlogZnamke({ sifre, slug: i.slug, korenska: koren(i.kategorija_id) }),
    };
  });
  return { seznam, stolpec };
}

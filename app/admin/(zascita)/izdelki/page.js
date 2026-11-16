import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { dolociZnamko, ZNAMKE_INFO } from "@/lib/znamke";
import SeznamIzdelkov from "./SeznamIzdelkov";

export const dynamic = "force-dynamic";

export default async function Izdelki() {
  const sb = supabaseAdmin();
  const [{ data }, { data: kat }] = await Promise.all([
    sb
      .from("izdelki")
      .select("id, naziv, slug, slika_url, objavljeno, znamka, kategorija_id, material, eta_stevilka, artikli(sifra, naziv, ean, dimenzija)")
      .order("vrstni_red")
      .order("naziv"),
    sb.from("kategorije").select("id, slug, naziv, nadrejena_id"),
  ]);
  const po = Object.fromEntries((kat ?? []).map((k) => [String(k.id), k]));
  const koren = (id) => {
    let x = po[String(id)];
    for (let i = 0; x?.nadrejena_id && i < 10; i++) x = po[String(x.nadrejena_id)];
    return x?.slug ?? "";
  };

  const seznam = (data ?? []).map((i) => {
    const art = i.artikli ?? [];
    const z = dolociZnamko({ znamka: i.znamka, sifre: art.map((a) => a.sifra), slug: i.slug, korenska: koren(i.kategorija_id) });
    return {
      id: i.id,
      naziv: i.naziv,
      slug: i.slug,
      slika: i.slika_url,
      objavljeno: i.objavljeno,
      kategorija: po[String(i.kategorija_id)]?.naziv ?? "—",
      znamka: ZNAMKE_INFO[z]?.ime ?? z,
      stArtiklov: art.length,
      // za iskanje: naziv, slug, kategorija, znamka, material, ETA ...
      besedilo: [i.naziv, i.slug, po[String(i.kategorija_id)]?.naziv, z, i.material, i.eta_stevilka].filter(Boolean).join(" "),
      // ... in vsi artikli: šifra | EAN | naziv | dimenzija
      artikli: art.map((a) => [a.sifra, a.ean, a.naziv, a.dimenzija].map((x) => x ?? "").join("|")),
    };
  });

  return (
    <>
      <div className="adm-glava">
        <h1>Izdelki</h1>
        <Link className="gumb" href="/admin/izdelki/nov">
          Nov izdelek
        </Link>
      </div>

      <div className="adm-telo">
        {seznam.length === 0 ? (
          <div className="opozorilo">Izdelkov še ni. Najprej dodaj kategorijo, nato izdelek.</div>
        ) : (
          <SeznamIzdelkov seznam={seznam} />
        )}
      </div>
    </>
  );
}

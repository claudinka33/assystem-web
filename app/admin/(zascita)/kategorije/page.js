import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import KategorijeDrevo from "./KategorijeDrevo";
import { lokalnaSlikaKategorije } from "@/lib/podatki";

export const dynamic = "force-dynamic";

export default async function Kategorije() {
  const sb = supabaseAdmin();
  const [{ data }, { data: izdelki }] = await Promise.all([
    sb.from("kategorije")
      .select("id, naziv, slug, slika_url, vrstni_red, objavljeno, nadrejena_id")
      .order("vrstni_red")
      .order("naziv"),
    sb.from("izdelki").select("kategorija_id").limit(5000),
  ]);

  // Slika iz admina ima prednost, sicer privzeta slika iz repa (public/slike/kategorije).
  const seznam = (data ?? []).map((k) => ({ ...k, slika: k.slika_url || lokalnaSlikaKategorije(k.slug, k.naziv) }));
  const stIzd = {};
  for (const i of izdelki ?? []) stIzd[i.kategorija_id] = (stIzd[i.kategorija_id] ?? 0) + 1;

  const ids = new Set(seznam.map((k) => k.id));
  const otroci = {};
  for (const k of seznam) {
    if (k.nadrejena_id && ids.has(k.nadrejena_id)) (otroci[k.nadrejena_id] ??= []).push(k);
  }
  const glavne = seznam.filter((k) => !k.nadrejena_id || !ids.has(k.nadrejena_id));

  const objavljenih = seznam.filter((k) => k.objavljeno).length;

  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">Katalog</div>
          <h1>Kategorije</h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span className="adm-info">{glavne.length} glavnih · {seznam.length - glavne.length} podkategorij · {objavljenih} objavljenih</span>
          <Link className="gumb" href="/admin/kategorije/nova">+ Nova kategorija</Link>
        </div>
      </div>

      <div className="adm-telo">
        {seznam.length === 0 ? (
          <div className="opozorilo">Kategorij še ni. Dodaj prvo.</div>
        ) : (
          <KategorijeDrevo glavne={glavne} otroci={otroci} stIzd={stIzd} />
        )}
        <p className="adm-namig">Kategorijo primi za ročaj ⋮⋮ na levi in jo povleci gor ali dol (ali uporabi puščici). Vrstni red se shrani takoj in velja tudi na spletni strani.</p>
      </div>
    </>
  );
}

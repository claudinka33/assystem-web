import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { izbrisiKategorijo } from "@/lib/akcije/skupno";
import IzbrisiGumb from "../../IzbrisiGumb";
import { lokalnaSlikaKategorije } from "@/lib/podatki";

export const dynamic = "force-dynamic";

function Vrstica({ k, stIzdelkov, podrejenih, otrok }) {
  return (
    <div className={`kat-vrstica${otrok ? " otrok" : ""}${k.objavljeno ? "" : " skrita"}`}>
      <span className="kat-red" title="Vrstni red">{k.vrstni_red ?? 0}</span>
      <span className="kat-slika">
        {k.slika ? <img src={k.slika} alt="" /> : <span className="brez" title="Ni slike" />}
      </span>
      <Link href={`/admin/kategorije/${k.id}`} className="kat-ime">
        <b>{k.naziv}</b>
        <small>/{k.slug}</small>
      </Link>
      <span className="kat-meta">
        {podrejenih > 0 && <span>{podrejenih} podkat.</span>}
        <span className={stIzdelkov ? "" : "nic"}>{stIzdelkov} izdelkov</span>
      </span>
      <span className={k.objavljeno ? "znacka da" : "znacka ne"}>{k.objavljeno ? "Objavljeno" : "Skrito"}</span>
      <span className="kat-akcije">
        <a href={`/program/${k.slug}`} target="_blank" rel="noreferrer" className="ikona-gumb" title="Poglej na strani">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
        </a>
        <Link href={`/admin/kategorije/${k.id}`} className="gumb siv mini">Uredi</Link>
        <IzbrisiGumb
          action={izbrisiKategorijo}
          id={k.id}
          ime={k.naziv}
          opozorilo={stIzdelkov || podrejenih ? `Kategorija ima ${stIzdelkov} izdelkov in ${podrejenih} podkategorij.` : ""}
        />
      </span>
    </div>
  );
}

export default async function Kategorije() {
  const sb = supabaseAdmin();
  const [{ data }, { data: izdelki }] = await Promise.all([
    sb.from("kategorije")
      .select("id, naziv, slug, slika_url, vrstni_red, objavljeno, nadrejena_id")
      .order("vrstni_red")
      .order("naziv"),
    sb.from("izdelki").select("kategorija_id").limit(5000),
  ]);

  // Na strani ima prednost slika iz repa (public/slike/kategorije), sicer slika iz baze.
  const seznam = (data ?? []).map((k) => ({ ...k, slika: lokalnaSlikaKategorije(k.slug, k.naziv) || k.slika_url }));
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
          <div className="kat-seznam">
            {glavne.map((k) => {
              const pod = otroci[k.id] ?? [];
              const izdSkupaj = (stIzd[k.id] ?? 0) + pod.reduce((s, p) => s + (stIzd[p.id] ?? 0), 0);
              return (
                <section key={k.id} className="kat-skupina">
                  <Vrstica k={k} stIzdelkov={pod.length ? izdSkupaj : stIzd[k.id] ?? 0} podrejenih={pod.length} />
                  {pod.map((p) => (
                    <Vrstica key={p.id} k={p} stIzdelkov={stIzd[p.id] ?? 0} podrejenih={(otroci[p.id] ?? []).length} otrok />
                  ))}
                </section>
              );
            })}
          </div>
        )}
        <p className="adm-namig">Vrstni red določa, kako si kategorije sledijo na strani (manjša številka = višje). Spremeniš ga v »Uredi«.</p>
      </div>
    </>
  );
}

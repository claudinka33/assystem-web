import { supabaseAdmin } from "@/lib/supabase-server";
import { datumSlo } from "@/lib/pomoc";

export const dynamic = "force-dynamic";

export default async function Prijave() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("prijave_zaposlitev")
    .select("*, delovna_mesta(naziv)")
    .order("ustvarjeno", { ascending: false })
    .limit(200);

  const seznam = data ?? [];

  // Življenjepisi so v zasebnem vedru — povezave veljajo eno uro.
  const povezave = {};
  for (const p of seznam) {
    if (p.cv_url) {
      const { data: podpis } = await sb.storage
        .from("prijave")
        .createSignedUrl(p.cv_url, 3600);
      povezave[p.id] = podpis?.signedUrl;
    }
  }

  const imeDatoteke = (pot) => {
    const ime = String(pot ?? "").split("/").pop();
    return /^cv-\d+\./.test(ime) ? ime.replace(/^cv-\d+/, "zivljenjepis") : ime;
  };
  const koncnica = (pot) => String(pot ?? "").split(".").pop().toUpperCase();

  return (
    <>
      <div className="adm-glava">
        <h1>Prijave za zaposlitev</h1>
        <span style={{ fontSize: 13, color: "#6e7276" }}>{seznam.length} zapisov</span>
      </div>

      <div className="adm-telo">
        {seznam.length === 0 ? (
          <div className="opozorilo">Prijav še ni.</div>
        ) : (
          <div className="prj">
            {seznam.map((p) => (
              <article key={p.id} className="prj-k">
                <header className="prj-gl">
                  <div>
                    <b className="prj-ime">{p.ime}</b>
                    <span className="prj-mesto">{p.delovna_mesta?.naziv ?? p.delovno_mesto_naziv ?? "Splošna prijava"}</span>
                  </div>
                  <time>{datumSlo(p.ustvarjeno)}</time>
                </header>
                <dl className="prj-podatki">
                  <div><dt>E-naslov</dt><dd><a href={`mailto:${p.email}`}>{p.email}</a></dd></div>
                  <div><dt>Telefon</dt><dd>{p.telefon ? <a href={`tel:${p.telefon.replace(/\s+/g, "")}`}>{p.telefon}</a> : "—"}</dd></div>
                </dl>
                {p.sporocilo && (
                  <div className="prj-sp">
                    <small>Nekaj besed o sebi</small>
                    <p>{p.sporocilo}</p>
                  </div>
                )}
                <div className="prj-cv">
                  <small>Življenjepis</small>
                  {povezave[p.id] ? (
                    <a className="prj-dat" href={povezave[p.id]} target="_blank" rel="noreferrer">
                      <span className="prj-dat-ik">{koncnica(p.cv_url)}</span>
                      <span className="prj-dat-ime">{imeDatoteke(p.cv_url)}</span>
                      <span className="prj-dat-odpri">Odpri ↗</span>
                    </a>
                  ) : (
                    <span style={{ color: "#9ba0a5" }}>ni priložen</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

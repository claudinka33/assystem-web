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

  return (
    <>
      <div className="adm-glava">
        <h1>Prijave za zaposlitev</h1>
        <span style={{ fontSize: 14, color: "#6e7276" }}>{seznam.length} zapisov</span>
      </div>

      <div className="adm-telo">
        {seznam.length === 0 ? (
          <div className="opozorilo">Prijav še ni.</div>
        ) : (
          <table className="adm-tab">
            <thead>
              <tr>
                <th>Ime</th>
                <th>Kontakt</th>
                <th>Delovno mesto</th>
                <th style={{ width: 110 }}>Prejeto</th>
                <th style={{ width: 120 }}>Življenjepis</th>
              </tr>
            </thead>
            <tbody>
              {seznam.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.ime}</b>
                    {p.sporocilo && (
                      <div style={{ fontSize: 12.5, color: "#6e7276", marginTop: 4, maxWidth: 420 }}>
                        {p.sporocilo}
                      </div>
                    )}
                  </td>
                  <td style={{ fontSize: 13.5 }}>
                    <a href={`mailto:${p.email}`} style={{ color: "#cb2026" }}>
                      {p.email}
                    </a>
                    {p.telefon && <div>{p.telefon}</div>}
                  </td>
                  <td style={{ color: "#6e7276" }}>{p.delovna_mesta?.naziv ?? "Splošna prijava"}</td>
                  <td>{datumSlo(p.ustvarjeno)}</td>
                  <td>
                    {povezave[p.id] ? (
                      <a className="gumb siv mini" href={povezave[p.id]} target="_blank" rel="noreferrer">
                        Odpri
                      </a>
                    ) : (
                      <span style={{ color: "#9ba0a5" }}>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

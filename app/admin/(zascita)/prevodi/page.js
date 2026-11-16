import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { shraniPrevod, prevediZnova } from "@/lib/akcije/prevodi";

export const dynamic = "force-dynamic";

const NA_STRAN = 100;

export default async function Prevodi({ searchParams }) {
  const sp = await searchParams;
  const jezik = ["en", "de"].includes(sp?.jezik) ? sp.jezik : "en";
  const q = (sp?.q ?? "").trim();
  const samoRocni = sp?.rocno === "1";
  const stran = Math.max(1, Number(sp?.stran) || 1);

  let poizvedba = supabaseAdmin()
    .from("prevodi")
    .select("id, vir, prevod, rocno, izvor, posodobljeno", { count: "exact" })
    .eq("jezik", jezik)
    .order("posodobljeno", { ascending: false })
    .range((stran - 1) * NA_STRAN, stran * NA_STRAN - 1);
  if (q) poizvedba = poizvedba.or(`vir.ilike.%${q.replace(/[%,()]/g, " ")}%,prevod.ilike.%${q.replace(/[%,()]/g, " ")}%`);
  if (samoRocni) poizvedba = poizvedba.eq("rocno", true);
  const { data, count, error } = await poizvedba;

  const imaKljuc = !!process.env.ANTHROPIC_API_KEY;
  const povezava = (spremembe) => {
    const p = new URLSearchParams({ jezik, ...(q ? { q } : {}), ...(samoRocni ? { rocno: "1" } : {}), ...spremembe });
    return `/admin/prevodi?${p.toString()}`;
  };
  const strani = Math.max(1, Math.ceil((count ?? 0) / NA_STRAN));

  return (
    <>
      <div className="adm-glava">
        <h1>Prevodi strani (EN, DE)</h1>
        <span style={{ fontSize: 13, color: "#6e7276" }}>{count ?? 0} prevodov</span>
      </div>

      <div className="adm-telo">
        {!imaKljuc && (
          <div className="opozorilo" style={{ marginBottom: 18 }}>
            Ključ <b>ANTHROPIC_API_KEY</b> v Vercelu ni nastavljen, zato se nova besedila ne prevajajo
            (angleška in nemška stran pokažeta slovensko besedilo, dokler prevoda ni).
          </div>
        )}
        {error && (
          <div className="opozorilo" style={{ marginBottom: 18 }}>
            Tabela prevodov še ne obstaja. Zaženi <b>sql/54-prevodi.sql</b> v Supabase SQL Editorju.
          </div>
        )}

        <p style={{ fontSize: 13, color: "#6e7276", marginBottom: 16, maxWidth: 760 }}>
          Strani /en in /de se prevedejo same: vsako novo ali spremenjeno slovensko besedilo dobi prevod ob prvem
          obisku tuje strani. Tukaj lahko prevod popraviš (ostane za vedno) ali ga izbrišeš, da se naredi znova.
        </p>

        <form method="get" action="/admin/prevodi" style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center", marginBottom: 18 }}>
          <select name="jezik" defaultValue={jezik} aria-label="Jezik">
            <option value="en">Angleščina (EN)</option>
            <option value="de">Nemščina (DE)</option>
          </select>
          <input name="q" type="search" defaultValue={q} placeholder="Išči po slovenskem besedilu ali prevodu…" aria-label="Iskanje" style={{ minWidth: 320 }} />
          <label style={{ fontSize: 13, display: "flex", gap: 6, alignItems: "center" }}>
            <input type="checkbox" name="rocno" value="1" defaultChecked={samoRocni} /> samo ročno popravljeni
          </label>
          <button className="gumb siv mini" type="submit">Prikaži</button>
        </form>

        <table className="adm-tab">
          <thead>
            <tr>
              <th style={{ width: "38%" }}>Slovensko</th>
              <th>Prevod ({jezik.toUpperCase()})</th>
              <th style={{ width: 120 }}></th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((p) => (
              <tr key={p.id}>
                <td style={{ fontSize: 12.5, verticalAlign: "top" }}>
                  {p.vir.length > 400 ? p.vir.slice(0, 400) + "…" : p.vir}
                  {p.rocno && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: "#cb2026" }}>ROČNO POPRAVLJENO</div>}
                </td>
                <td style={{ verticalAlign: "top" }}>
                  <form action={shraniPrevod} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <input type="hidden" name="id" value={p.id} />
                    <textarea name="prevod" defaultValue={p.prevod} aria-label="Prevod" rows={Math.min(8, Math.max(1, Math.ceil(p.prevod.length / 70)))} style={{ flex: 1, fontSize: 12.5, minHeight: 0 }} />
                    <button className="gumb mini" type="submit">Shrani</button>
                  </form>
                </td>
                <td style={{ verticalAlign: "top", textAlign: "right" }}>
                  <form action={prevediZnova}>
                    <input type="hidden" name="id" value={p.id} />
                    <button className="gumb siv mini" type="submit" title="Izbriše prevod; ob naslednjem obisku strani se naredi nov.">Prevedi znova</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {strani > 1 && (
          <div style={{ display: "flex", gap: 10, marginTop: 16, alignItems: "center", fontSize: 13 }}>
            {stran > 1 && <Link className="gumb siv mini" href={povezava({ stran: String(stran - 1) })}>← Prejšnja</Link>}
            <span>Stran {stran} od {strani}</span>
            {stran < strani && <Link className="gumb siv mini" href={povezava({ stran: String(stran + 1) })}>Naslednja →</Link>}
          </div>
        )}
      </div>
    </>
  );
}

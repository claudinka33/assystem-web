import Link from "next/link";
import { izdelkiZPredlogi } from "@/lib/znamke-admin";
import { nastaviZnamko, vpisiPredloge } from "@/lib/akcije/znamke-admin";
import { ZNAMKE, ZNAMKE_INFO } from "@/lib/znamke";

export const dynamic = "force-dynamic";

// Pregled znamk vseh izdelkov. Na strani velja vpis; če ga ni, predlog po pravilu.
export default async function ZnamkeIzdelkov({ searchParams }) {
  const { seznam, stolpec } = await izdelkiZPredlogi();
  const { prikaz = "vse" } = (await searchParams) ?? {};

  const nastrani = (i) => i.vpis ?? i.predlog;
  const brezVpisa = seznam.filter((i) => !i.vpis);
  const razlike = seznam.filter((i) => i.vpis && i.vpis !== i.predlog);
  const vrstice =
    prikaz === "brez" ? brezVpisa
    : prikaz === "razlike" ? razlike
    : ZNAMKE.includes(prikaz) ? seznam.filter((i) => nastrani(i) === prikaz)
    : seznam;

  return (
    <>
      <div className="adm-glava">
        <h1>Znamke izdelkov</h1>
        {stolpec && brezVpisa.length > 0 && (
          <form action={vpisiPredloge}>
            <button className="gumb" type="submit">
              Vpiši predloge ({brezVpisa.length})
            </button>
          </form>
        )}
      </div>

      <div className="adm-telo">
        {!stolpec && (
          <div className="opozorilo" style={{ marginBottom: 18 }}>
            V bazi še ni stolpca za znamko. V Supabase → SQL Editor zaženi:
            <pre style={{ margin: "10px 0 0", whiteSpace: "pre-wrap" }}>
              alter table public.izdelki add column if not exists znamka text;
            </pre>
          </div>
        )}

        <p style={{ color: "#6e767e", marginBottom: 14, maxWidth: 820 }}>
          Pravilo predloga: šifra AS811/812/814/816 → Silvermate · slug »mungo-…« ali šifra M… → Mungo ·
          šifra AF… → ASfix · kategorija Vijačno blago → ASco · ostalo → ASfix. Vpis v bazi ima vedno prednost.
          »Vpiši predloge« vpiše predlog samo izdelkom brez vpisa; obstoječih vpisov ne spremeni.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 18 }}>
          {[
            ["vse", `Vsi (${seznam.length})`],
            ["brez", `Brez vpisa (${brezVpisa.length})`],
            ["razlike", `Vpis ≠ predlog (${razlike.length})`],
            ...ZNAMKE.map((z) => [z, `${ZNAMKE_INFO[z].ime} (${seznam.filter((i) => nastrani(i) === z).length})`]),
          ].map(([k, n]) => (
            <Link key={k} href={`/admin/znamke?prikaz=${k}`} className={`gumb mini ${prikaz === k ? "" : "siv"}`}>
              {n}
            </Link>
          ))}
        </div>

        <table className="adm-tab">
          <thead>
            <tr>
              <th>Izdelek</th>
              <th>Kategorija</th>
              <th>Šifre</th>
              <th style={{ width: 110 }}>Vpisano</th>
              <th style={{ width: 110 }}>Predlog</th>
              <th style={{ width: 230 }}>Spremeni</th>
            </tr>
          </thead>
          <tbody>
            {vrstice.map((i) => (
              <tr key={i.id} style={i.vpis && i.vpis !== i.predlog ? { background: "#fff6e5" } : undefined}>
                <td>
                  <Link href={`/admin/izdelki/${i.id}`}>
                    <b>{i.naziv}</b>
                  </Link>
                  {!i.objavljeno && <span style={{ color: "#9ba0a5" }}> · skrit</span>}
                </td>
                <td>{i.kategorija}</td>
                <td style={{ color: "#6e767e", fontSize: 12.5 }}>
                  {i.sifre.slice(0, 3).join(", ")}
                  {i.sifre.length > 3 && ` … (+${i.sifre.length - 3})`}
                </td>
                <td>{i.vpis ? <b>{ZNAMKE_INFO[i.vpis].ime}</b> : <span style={{ color: "#9ba0a5" }}>—</span>}</td>
                <td>{ZNAMKE_INFO[i.predlog].ime}</td>
                <td>
                  {stolpec && (
                    <form action={nastaviZnamko} style={{ display: "flex", gap: 6 }}>
                      <input type="hidden" name="id" value={i.id} />
                      <select name="znamka" defaultValue={i.vpis ?? ""}>
                        <option value="">samodejno</option>
                        {ZNAMKE.map((z) => (
                          <option key={z} value={z}>
                            {ZNAMKE_INFO[z].ime}
                          </option>
                        ))}
                      </select>
                      <button className="gumb mini" type="submit">
                        Shrani
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

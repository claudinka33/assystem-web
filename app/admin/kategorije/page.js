import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { izbrisiKategorijo } from "@/lib/akcije/skupno";

export const dynamic = "force-dynamic";

export default async function Kategorije() {
  const { data } = await supabaseAdmin()
    .from("kategorije")
    .select("id, naziv, slug, slika_url, vrstni_red, objavljeno, nadrejena_id")
    .order("vrstni_red")
    .order("naziv");

  const seznam = data ?? [];
  const nazivi = Object.fromEntries(seznam.map((k) => [k.id, k.naziv]));

  return (
    <>
      <div className="adm-glava">
        <h1>Kategorije</h1>
        <Link className="gumb" href="/admin/kategorije/nova">
          Nova kategorija
        </Link>
      </div>

      <div className="adm-telo">
        {seznam.length === 0 ? (
          <div className="opozorilo">Kategorij še ni. Dodaj prvo.</div>
        ) : (
          <table className="adm-tab">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Slika</th>
                <th>Naziv</th>
                <th>Nadrejena</th>
                <th>Slug</th>
                <th style={{ width: 70 }}>Vrstni red</th>
                <th style={{ width: 90 }}>Stanje</th>
                <th style={{ width: 150 }}></th>
              </tr>
            </thead>
            <tbody>
              {seznam.map((k) => (
                <tr key={k.id}>
                  <td>
                    {k.slika_url ? <img src={k.slika_url} alt="" /> : <span style={{ color: "#ccd2d8" }}>—</span>}
                  </td>
                  <td>
                    <b>{k.naziv}</b>
                  </td>
                  <td style={{ color: "#6e767e" }}>{nazivi[k.nadrejena_id] ?? "—"}</td>
                  <td style={{ color: "#6e767e" }}>{k.slug}</td>
                  <td>{k.vrstni_red}</td>
                  <td>
                    <span className={k.objavljeno ? "znacka da" : "znacka ne"}>
                      {k.objavljeno ? "Objavljeno" : "Skrito"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link className="gumb siv mini" href={`/admin/kategorije/${k.id}`}>
                      Uredi
                    </Link>{" "}
                    <form action={izbrisiKategorijo} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={k.id} />
                      <button className="gumb siv mini" type="submit">
                        Izbriši
                      </button>
                    </form>
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

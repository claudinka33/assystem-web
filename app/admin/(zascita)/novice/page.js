import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { izbrisiNovico } from "@/lib/akcije/skupno";

export const dynamic = "force-dynamic";

export default async function Novice() {
  const { data } = await supabaseAdmin()
    .from("novice")
    .select("id, naslov, slug, objavljeno_dne, objavljeno")
    .order("objavljeno_dne", { ascending: false });

  const seznam = data ?? [];

  return (
    <>
      <div className="adm-glava">
        <h1>Novice</h1>
        <Link className="gumb" href="/admin/novice/nova">
          Nova novica
        </Link>
      </div>
      <div className="adm-telo">
        {seznam.length === 0 ? (
          <div className="opozorilo">Novic še ni.</div>
        ) : (
          <table className="adm-tab">
            <thead>
              <tr>
                <th>Naslov</th>
                <th style={{ width: 120 }}>Datum</th>
                <th style={{ width: 100 }}>Stanje</th>
                <th style={{ width: 150 }}></th>
              </tr>
            </thead>
            <tbody>
              {seznam.map((n) => (
                <tr key={n.id}>
                  <td>
                    <b>{n.naslov}</b>
                  </td>
                  <td>{n.objavljeno_dne}</td>
                  <td>
                    <span className={n.objavljeno ? "znacka da" : "znacka ne"}>
                      {n.objavljeno ? "Objavljeno" : "Osnutek"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link className="gumb siv mini" href={`/admin/novice/${n.id}`}>
                      Uredi
                    </Link>{" "}
                    <form action={izbrisiNovico} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={n.id} />
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

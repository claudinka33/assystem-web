import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { izbrisiDelovnoMesto } from "@/lib/akcije/skupno";

export const dynamic = "force-dynamic";

export default async function DelovnaMesta() {
  const { data } = await supabaseAdmin()
    .from("delovna_mesta")
    .select("id, naziv, slug, lokacija, vrsta, aktivno, vrstni_red")
    .order("vrstni_red")
    .order("naziv");

  const seznam = data ?? [];

  return (
    <>
      <div className="adm-glava">
        <h1>Delovna mesta</h1>
        <Link className="gumb" href="/admin/delovna-mesta/novo">
          Novo delovno mesto
        </Link>
      </div>

      <div className="adm-telo">
        {seznam.length === 0 ? (
          <div className="opozorilo">
            Delovnih mest še ni. Dodaj prvo ali zaženi <b>05-zaposlitev.sql</b> v Supabase.
          </div>
        ) : (
          <table className="adm-tab">
            <thead>
              <tr>
                <th>Naziv</th>
                <th style={{ width: 200 }}>Lokacija</th>
                <th style={{ width: 120 }}>Vrsta</th>
                <th style={{ width: 70 }}>Red</th>
                <th style={{ width: 100 }}>Stanje</th>
                <th style={{ width: 150 }}></th>
              </tr>
            </thead>
            <tbody>
              {seznam.map((m) => (
                <tr key={m.id}>
                  <td>
                    <b>{m.naziv}</b>
                    <div style={{ fontSize: 12.5, color: "#6e7276" }}>{m.slug}</div>
                  </td>
                  <td style={{ color: "#6e7276" }}>{m.lokacija ?? "—"}</td>
                  <td style={{ color: "#6e7276" }}>{m.vrsta ?? "—"}</td>
                  <td>{m.vrstni_red}</td>
                  <td>
                    <span className={m.aktivno ? "znacka da" : "znacka ne"}>
                      {m.aktivno ? "Odprto" : "Zaprto"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link className="gumb siv mini" href={`/admin/delovna-mesta/${m.id}`}>
                      Uredi
                    </Link>{" "}
                    <form action={izbrisiDelovnoMesto} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={m.id} />
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

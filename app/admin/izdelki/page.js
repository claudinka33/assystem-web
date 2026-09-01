import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function Izdelki() {
  const { data } = await supabaseAdmin()
    .from("izdelki")
    .select("id, naziv, slug, slika_url, objavljeno, kategorije(naziv), artikli(id)")
    .order("vrstni_red")
    .order("naziv");

  const seznam = data ?? [];

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
          <div className="opozorilo">
            Izdelkov še ni. Najprej dodaj kategorijo, nato izdelek.
          </div>
        ) : (
          <table className="adm-tab">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Slika</th>
                <th>Naziv</th>
                <th>Kategorija</th>
                <th style={{ width: 90 }}>Artiklov</th>
                <th style={{ width: 90 }}>Stanje</th>
                <th style={{ width: 90 }}></th>
              </tr>
            </thead>
            <tbody>
              {seznam.map((i) => (
                <tr key={i.id}>
                  <td>{i.slika_url ? <img src={i.slika_url} alt="" /> : <span style={{ color: "#ccd2d8" }}>—</span>}</td>
                  <td>
                    <b>{i.naziv}</b>
                    <div style={{ fontSize: 12.5, color: "#6e767e" }}>{i.slug}</div>
                  </td>
                  <td style={{ color: "#6e767e" }}>{i.kategorije?.naziv ?? "—"}</td>
                  <td>{i.artikli?.length ?? 0}</td>
                  <td>
                    <span className={i.objavljeno ? "znacka da" : "znacka ne"}>
                      {i.objavljeno ? "Objavljeno" : "Skrito"}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <Link className="gumb siv mini" href={`/admin/izdelki/${i.id}`}>
                      Uredi
                    </Link>
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

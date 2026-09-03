import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const imenaStrani = {
  domov: "Domača stran",
  asfix: "ASfix",
  "private-label": "Private label",
  proizvodnja: "Proizvodnja",
  kakovost: "Kakovost",
  "o-nas": "O nas",
  kontakt: "Kontakt",
};

export default async function Vsebine() {
  const { data } = await supabaseAdmin()
    .from("vsebine")
    .select("id, kljuc, stran, naslov, besedilo")
    .order("stran")
    .order("kljuc");

  const seznam = data ?? [];
  const poStraneh = {};
  for (const v of seznam) (poStraneh[v.stran] ??= []).push(v);

  return (
    <>
      <div className="adm-glava">
        <h1>Besedila na strani</h1>
        <span style={{ fontSize: 14, color: "#6e7276" }}>{seznam.length} blokov</span>
      </div>

      <div className="adm-telo">
        {seznam.length === 0 ? (
          <div className="opozorilo">
            Blokov še ni. Zaženi datoteko <b>03-vsebine.sql</b> v Supabase SQL
            Editorju, da se ustvarijo.
          </div>
        ) : (
          Object.entries(poStraneh).map(([stran, bloki]) => (
            <div key={stran} style={{ marginBottom: 30 }}>
              <h2 style={{ fontSize: 17, fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
                {imenaStrani[stran] ?? stran}
              </h2>
              <table className="adm-tab">
                <thead>
                  <tr>
                    <th style={{ width: 230 }}>Kje na strani</th>
                    <th>Naslov</th>
                    <th>Besedilo</th>
                    <th style={{ width: 80 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {bloki.map((b) => (
                    <tr key={b.id}>
                      <td style={{ fontSize: 12.5, color: "#6e7276" }}>{b.kljuc}</td>
                      <td>
                        <b>{b.naslov ?? "—"}</b>
                      </td>
                      <td style={{ color: "#6e7276", fontSize: 13 }}>
                        {b.besedilo ? `${b.besedilo.slice(0, 90)}${b.besedilo.length > 90 ? "…" : ""}` : "—"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <Link className="gumb siv mini" href={`/admin/vsebine/${encodeURIComponent(b.kljuc)}`}>
                          Uredi
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </>
  );
}

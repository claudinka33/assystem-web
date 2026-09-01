import { supabaseAdmin } from "@/lib/supabase-server";
import { spremeniStatusPovprasevanja } from "@/lib/akcije/skupno";

export const dynamic = "force-dynamic";

const statusi = ["novo", "v obdelavi", "zaključeno"];

export default async function Povprasevanja() {
  const { data } = await supabaseAdmin()
    .from("povprasevanja")
    .select("*")
    .order("ustvarjeno", { ascending: false })
    .limit(200);

  const seznam = data ?? [];

  return (
    <>
      <div className="adm-glava">
        <h1>Povpraševanja</h1>
        <span style={{ fontSize: 14, color: "#6e767e" }}>{seznam.length} zapisov</span>
      </div>

      <div className="adm-telo">
        {seznam.length === 0 ? (
          <div className="opozorilo">
            Povpraševanj še ni. Prikazala se bodo, ko bo kontaktni obrazec v živo.
          </div>
        ) : (
          seznam.map((p) => (
            <div key={p.id} className="adm-obr" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <b style={{ fontSize: 16 }}>{p.ime}</b>
                  {p.podjetje && <span style={{ color: "#6e767e" }}> · {p.podjetje}</span>}
                  <div style={{ fontSize: 13.5, color: "#6e767e", marginTop: 4 }}>
                    <a href={`mailto:${p.email}`} style={{ color: "#c8102e" }}>
                      {p.email}
                    </a>
                    {p.telefon && ` · ${p.telefon}`} · vir: {p.vir}
                  </div>
                </div>
                <span className={p.status === "novo" ? "znacka novo" : "znacka ne"}>{p.status}</span>
              </div>

              {p.sporocilo && (
                <p style={{ marginTop: 14, fontSize: 14.5, whiteSpace: "pre-wrap" }}>{p.sporocilo}</p>
              )}

              <form action={spremeniStatusPovprasevanja} style={{ marginTop: 16, display: "flex", gap: 10, alignItems: "flex-end" }}>
                <input type="hidden" name="id" value={p.id} />
                <div className="adm-polje" style={{ marginBottom: 0, width: 170 }}>
                  <label>Status</label>
                  <select name="status" defaultValue={p.status}>
                    {statusi.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="adm-polje" style={{ marginBottom: 0, flex: 1 }}>
                  <label>Interna opomba</label>
                  <input type="text" name="opomba" defaultValue={p.opomba ?? ""} />
                </div>
                <button className="gumb" type="submit">
                  Shrani
                </button>
              </form>
            </div>
          ))
        )}
      </div>
    </>
  );
}

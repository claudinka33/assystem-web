import { supabaseAdmin } from "@/lib/supabase-server";
import { spremeniStatusPovprasevanja } from "@/lib/akcije/skupno";

export const dynamic = "force-dynamic";

const statusi = ["novo", "v obdelavi", "zaključeno"];

// »Odgovori« odpre e-pošto z naslovom in citatom vprašanja
function odgovor(p) {
  const izd = (p.izdelki ?? []).filter((x) => !x.datoteka).map((x) => `${x.naziv}${x.sifra ? ` (${x.sifra})` : ""}`).join(", ");
  const tema = (p.vir ?? "").startsWith("rok-dobave") ? `Rok dobave${izd ? `: ${izd}` : ""}` : `Vaše povpraševanje${izd ? `: ${izd}` : ""}`;
  const citat = (p.sporocilo ?? "").split("\n").map((v) => `> ${v}`).join("\n");
  const telo = `Pozdravljeni,\n\n\n\nLep pozdrav,\nAS system d.o.o.\n\n${citat}`;
  return `mailto:${p.email}?subject=${encodeURIComponent(tema)}&body=${encodeURIComponent(telo)}`;
}

export default async function Povprasevanja() {
  const { data } = await supabaseAdmin()
    .from("povprasevanja")
    .select("*")
    .order("ustvarjeno", { ascending: false })
    .limit(200);

  const seznam = data ?? [];
  // Povezave do priloženih risb (zasebna shramba, povezava velja 1 uro)
  for (const p of seznam) {
    for (const x of p.izdelki ?? []) {
      if (x?.datoteka) {
        const { data: u } = await supabaseAdmin().storage.from("prijave").createSignedUrl(x.datoteka, 3600);
        x.url = u?.signedUrl ?? null;
      }
    }
  }

  return (
    <>
      <div className="adm-glava">
        <h1>Povpraševanja</h1>
        <span style={{ fontSize: 13, color: "#6e767e" }}>{seznam.length} zapisov</span>
      </div>

      <div className="adm-telo">
        {seznam.length === 0 ? (
          <div className="opozorilo">
            Povpraševanj še ni. Prikazala se bodo, ko bo kontaktni obrazec v živo.
          </div>
        ) : (
          seznam.map((p) => (
            <div key={p.id} id={`p-${p.id}`} className="adm-obr adm-povp" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <b style={{ fontSize: 14 }}>{p.ime}</b>
                  {p.podjetje && <span style={{ color: "#6e767e" }}> · {p.podjetje}</span>}
                  <div style={{ fontSize: 12.5, color: "#6e767e", marginTop: 4 }}>
                    <a href={`mailto:${p.email}`} style={{ color: "#c8102e" }}>
                      {p.email}
                    </a>
                    {p.telefon && ` · ${p.telefon}`} · vir: {p.vir}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <a className="gumb" href={odgovor(p)}>
                    Odgovori
                  </a>
                  <span className={p.status === "novo" ? "znacka novo" : "znacka ne"}>{p.status}</span>
                </div>
              </div>

              {(p.izdelki ?? []).length > 0 && (
                <div style={{ marginTop: 10, fontSize: 13, display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {p.izdelki.map((x, i) =>
                    x.url ? (
                      <a key={i} href={x.url} target="_blank" rel="noreferrer" style={{ color: "#c8102e", fontWeight: 600 }}>
                        📎 {x.naziv}
                      </a>
                    ) : (
                      <span key={i}>
                        Izdelek: <b>{x.naziv}</b>
                        {x.sifra ? ` (${x.sifra})` : ""}
                      </span>
                    )
                  )}
                </div>
              )}

              {p.sporocilo && (
                <p style={{ marginTop: 14, fontSize: 13, whiteSpace: "pre-wrap" }}>{p.sporocilo}</p>
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

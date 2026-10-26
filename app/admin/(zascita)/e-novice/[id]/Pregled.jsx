import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { prekliciNacrt, podvojiKampanjo } from "@/lib/akcije/enovice-kampanje";
import { rabiOsvezitev } from "@/lib/enovice-statistika";
import { OsveziStatistiko, PonovnoNeodprtim } from "./StatistikaGumbi";

const cas = (d) =>
  d ? new Date(d).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "medium", timeStyle: "short" }) : "";
const odst = (a, b) => (b ? `${Math.round((100 * (a || 0)) / b)} %` : "–");

const FILTRI = [
  ["vsi", "Vsi"],
  ["odprli", "Odprli"],
  ["kliknili", "Kliknili"],
  ["neodprli", "Niso odprli"],
  ["odbiti", "Odbiti"],
  ["odjave", "Odjavljeni"],
];

const label = { margin: "0 0 4px", color: "#6e767e", fontSize: 12 };
const kpiSlog = {
  background: "#fff",
  border: "1px solid #e4e6e8",
  borderRadius: 10,
  padding: "12px 14px",
  minWidth: 0,
};

function Kpi({ ime, vrednost, pod, poudari }) {
  return (
    <div style={kpiSlog}>
      <div style={{ fontSize: 12, color: "#6e767e" }}>{ime}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: poudari ? "#cb2026" : "#3f4140", lineHeight: 1.2 }}>{vrednost}</div>
      {pod && <div style={{ fontSize: 12, color: "#6e767e" }}>{pod}</div>}
    </div>
  );
}

export default async function Pregled({ k, sp = {} }) {
  const s = k.statistika || {};
  const poslano = k.status === "poslano";
  const filter = FILTRI.some(([f]) => f === sp.f) ? sp.f : "vsi";
  const iskanje = String(sp.q || "").trim().toLowerCase();

  let prejemniki = [];
  let napakaBaze = null;
  if (poslano) {
    let q = supabaseAdmin()
      .from("enovice_prejemniki")
      .select("*")
      .eq("kampanja_id", k.id)
      .order("kliknil", { ascending: false })
      .order("odprl", { ascending: false })
      .order("email")
      .limit(1000);
    if (filter === "odprli") q = q.gt("odprl", 0);
    if (filter === "kliknili") q = q.gt("kliknil", 0);
    if (filter === "neodprli") q = q.eq("dostavljeno", true).eq("odprl", 0);
    if (filter === "odbiti") q = q.not("odbit", "is", null);
    if (filter === "odjave") q = q.eq("odjavljen", true);
    if (iskanje) q = q.ilike("email", `%${iskanje}%`);
    const { data, error } = await q;
    prejemniki = data ?? [];
    napakaBaze = error?.message ?? null;
  }

  const neodprli = Math.max(0, (s.dostavljeno ?? 0) - (s.odprli ?? 0) - (s.odjave ?? 0));
  const povezava = (f) => `?f=${f}${iskanje ? `&q=${encodeURIComponent(iskanje)}` : ""}`;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 340px) minmax(0, 1fr)", gap: 20, alignItems: "start" }}>
      {/* LEVO: podatki in akcije */}
      <div className="adm-obr" style={{ maxWidth: "none", padding: 18, fontSize: 14 }}>
        <p style={label}>Zadeva</p>
        <p style={{ margin: "0 0 14px", fontWeight: 600 }}>{k.zadeva}</p>
        <p style={label}>Komu</p>
        <p style={{ margin: "0 0 14px" }}>{k.segment_ime || k.segment_id}</p>
        {k.status === "nacrtovano" ? (
          <>
            <p style={label}>Pošlje se</p>
            <p style={{ margin: "0 0 16px", fontWeight: 600 }}>{cas(k.nacrtovano_za)}</p>
            <form action={prekliciNacrt}>
              <input type="hidden" name="id" value={k.id} />
              <button className="gumb siv" style={{ width: "100%" }}>
                Prekliči in vrni med osnutke
              </button>
            </form>
          </>
        ) : (
          <>
            <p style={label}>Poslano</p>
            <p style={{ margin: "0 0 16px" }}>{cas(k.poslano_ob)}</p>
            <PonovnoNeodprtim id={k.id} stevilo={s.dostavljeno ? neodprli : null} />
            <a className="gumb siv" href={`/admin/porocilo-enovice/${k.id}`} target="_blank" rel="noreferrer" style={{ width: "100%", marginTop: 8 }}>
              Poročilo (PDF)
            </a>
            <a className="gumb siv" href={`/admin/e-novice/${k.id}/izvoz`} style={{ width: "100%", marginTop: 8 }}>
              Izvozi v Excel
            </a>
          </>
        )}
        <form action={podvojiKampanjo} style={{ marginTop: 8 }}>
          <input type="hidden" name="iz" value={k.id} />
          <button className="gumb siv" style={{ width: "100%" }}>
            Podvoji v nov osnutek
          </button>
        </form>
        {k.nadrejena_id && (
          <p style={{ fontSize: 12.5, color: "#6e767e", marginTop: 12 }}>
            Ponovitev kampanje <Link href={`/admin/e-novice/${k.nadrejena_id}`}>#{k.nadrejena_id}</Link>
          </p>
        )}
      </div>

      {/* DESNO */}
      <div style={{ minWidth: 0 }}>
        {poslano && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, gap: 10, flexWrap: "wrap" }}>
              <h2 style={{ fontSize: 15, margin: 0 }}>Statistika</h2>
              <OsveziStatistiko id={k.id} samodejno={rabiOsvezitev(k)} statistikaOb={k.statistika_ob} />
            </div>
            {napakaBaze && <div className="opozorilo">Baza: {napakaBaze}</div>}

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10, marginBottom: 18 }}>
              <Kpi ime="Dostavljeno" vrednost={s.dostavljeno ?? "–"} pod={s.prejemniki ? `od ${s.prejemniki}` : null} />
              <Kpi ime="Odprli" vrednost={s.odprli ?? "–"} pod={odst(s.odprli, s.dostavljeno)} poudari />
              <Kpi ime="Kliknili" vrednost={s.kliknili ?? "–"} pod={odst(s.kliknili, s.dostavljeno)} poudari />
              <Kpi ime="Niso odprli" vrednost={s.dostavljeno != null ? neodprli : "–"} />
              <Kpi ime="Odbiti" vrednost={s.odbiti ?? "–"} />
              <Kpi ime="Odjave" vrednost={s.odjave ?? "–"} pod={s.pritozbe ? `${s.pritozbe} × spam` : null} />
            </div>

            {s.dostavljeno > 0 && !s.odprli && !s.kliknili && (
              <div className="opozorilo" style={{ fontSize: 13 }}>
                Ni nobenega odprtja ali klika. Preveri, ali sta v Resendu vklopljena <b>Open tracking</b> in{" "}
                <b>Click tracking</b> (Resend → Domains → assystem.si → Configuration).
              </div>
            )}

            {s.povezave?.length > 0 && (
              <>
                <h3 style={{ fontSize: 14, margin: "6px 0 8px" }}>Kliki po povezavah</h3>
                <table className="adm-tab" style={{ marginBottom: 20 }}>
                  <thead>
                    <tr>
                      <th>Povezava</th>
                      <th style={{ textAlign: "right" }}>Kliki</th>
                      <th style={{ textAlign: "right" }}>Različnih oseb</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.povezave.map((p) => (
                      <tr key={p.url}>
                        <td style={{ wordBreak: "break-all", fontSize: 13 }}>
                          <a href={p.url} target="_blank" rel="noreferrer">
                            {p.url}
                          </a>
                        </td>
                        <td style={{ textAlign: "right" }}>{p.kliki}</td>
                        <td style={{ textAlign: "right" }}>{p.unikatni}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            <h3 style={{ fontSize: 14, margin: "6px 0 8px" }}>Prejemniki</h3>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <nav className="zavihki" style={{ marginBottom: 10 }}>
                {FILTRI.map(([f, ime]) => (
                  <Link key={f} href={povezava(f)} className={f === filter ? "on" : ""} scroll={false}>
                    {ime}
                  </Link>
                ))}
              </nav>
              <form style={{ marginBottom: 10 }}>
                <input type="hidden" name="f" value={filter} />
                <input
                  type="search"
                  name="q"
                  defaultValue={iskanje}
                  placeholder="Išči e-naslov"
                  style={{ padding: "7px 10px", border: "1px solid #ccd0d4", borderRadius: 8, fontSize: 13 }}
                />
              </form>
            </div>
            {prejemniki.length === 0 ? (
              <p style={{ color: "#6e767e", fontSize: 13 }}>
                {k.statistika_ob ? "Ni prejemnikov v tem filtru." : "Statistika se nalaga …"}
              </p>
            ) : (
              <table className="adm-tab">
                <thead>
                  <tr>
                    <th>E-naslov</th>
                    <th>Stanje</th>
                    <th style={{ textAlign: "right" }}>Odprtja</th>
                    <th style={{ textAlign: "right" }}>Kliki</th>
                    <th>Kliknjene povezave</th>
                  </tr>
                </thead>
                <tbody>
                  {prejemniki.map((p) => (
                    <tr key={p.email}>
                      <td>{p.email}</td>
                      <td>
                        {p.odbit ? (
                          <span className="znacka ne">odbit ({p.odbit})</span>
                        ) : p.odjavljen ? (
                          <span className="znacka ne">odjavljen</span>
                        ) : p.pritozba ? (
                          <span className="znacka ne">spam</span>
                        ) : p.kliknil ? (
                          <span className="znacka novo">kliknil</span>
                        ) : p.odprl ? (
                          <span className="znacka da">odprl</span>
                        ) : p.dostavljeno ? (
                          <span className="znacka ne">ni odprl</span>
                        ) : (
                          <span className="znacka ne">ni dostavljeno</span>
                        )}
                      </td>
                      <td style={{ textAlign: "right" }}>{p.odprl || ""}</td>
                      <td style={{ textAlign: "right" }}>{p.kliknil || ""}</td>
                      <td style={{ fontSize: 12, color: "#6e767e", wordBreak: "break-all" }}>
                        {(p.povezave ?? []).map((l) => l.url.replace(/^https?:\/\/(www\.)?/, "")).join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {prejemniki.length === 1000 && (
              <p style={{ fontSize: 12.5, color: "#6e767e" }}>Prikazanih prvih 1000 — celoten seznam je v izvozu.</p>
            )}
          </>
        )}

        <details className="adm-obr" style={{ marginTop: poslano ? 22 : 0 }} open={!poslano}>
          <summary style={{ cursor: "pointer", fontWeight: 600, fontSize: 14 }}>Predogled maila</summary>
          <iframe
            title="Predogled maila"
            srcDoc={k.html || ""}
            sandbox=""
            style={{ width: "100%", height: "75vh", minHeight: 420, border: "1px solid #dde0e2", background: "#fff", marginTop: 12 }}
          />
        </details>
      </div>
    </div>
  );
}

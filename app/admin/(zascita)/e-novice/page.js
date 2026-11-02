import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { novaKampanja, podvojiKampanjo, izbrisiKampanjo, osveziNacrtovane } from "@/lib/akcije/enovice-kampanje";
import IzbrisiGumb from "@/app/admin/IzbrisiGumb";

export const dynamic = "force-dynamic";

const cas = (d) =>
  d ? new Date(d).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "short", timeStyle: "short" }) : "";
const pct = (a, b) => (b ? Math.round((100 * (a || 0)) / b) : null);

const sivo = "#6e767e";
const okvir = { background: "#fff", border: "1px solid #e3e5e8", borderRadius: 10 };

function Kpi({ stevilka, naziv, pod }) {
  return (
    <div style={{ ...okvir, padding: "16px 18px" }}>
      <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}>{stevilka}</div>
      <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4 }}>{naziv}</div>
      {pod && <div style={{ fontSize: 12, color: sivo, marginTop: 2 }}>{pod}</div>}
    </div>
  );
}

function Delez({ n, od, barva }) {
  const p = pct(n, od);
  if (n == null) return <span style={{ color: "#9aa0a6" }}>–</span>;
  return (
    <div style={{ minWidth: 120 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <b>{n}</b>
        <span style={{ color: sivo }}>{p != null ? `${p} %` : ""}</span>
      </div>
      <div style={{ height: 6, background: "#eef0f2", borderRadius: 3, marginTop: 4, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(p ?? 0, 100)}%`, height: "100%", background: barva }} />
      </div>
    </div>
  );
}

function Naslov({ children, desno }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", margin: "30px 0 12px", gap: 12 }}>
      <h2 style={{ fontSize: 17, fontWeight: 800, margin: 0 }}>{children}</h2>
      {desno}
    </div>
  );
}

export default async function ENovice() {
  await osveziNacrtovane().catch(() => {});

  const sb = supabaseAdmin();
  const { data: vse, error } = await sb
    .from("enovice_kampanje")
    .select("id, naziv, zadeva, status, segment_ime, nacrtovano_za, poslano_ob, posodobljeno, ustvaril, statistika, nacin")
    .order("posodobljeno", { ascending: false })
    .limit(500);

  const kampanje = vse ?? [];
  const poslane = kampanje
    .filter((k) => k.status === "poslano")
    .sort((a, b) => String(b.poslano_ob).localeCompare(String(a.poslano_ob)));
  const nacrtovane = kampanje
    .filter((k) => k.status === "nacrtovano")
    .sort((a, b) => String(a.nacrtovano_za).localeCompare(String(b.nacrtovano_za)));
  const osnutki = kampanje.filter((k) => k.status === "osnutek");
  const predloge = kampanje.filter((k) => k.status === "predloga");

  // skupna statistika poslanih
  let prejemniki = 0, odprli = 0, kliknili = 0, zStat = 0;
  for (const k of poslane) {
    const s = k.statistika || {};
    const d = s.dostavljeno ?? s.poslano;
    if (d) {
      prejemniki += d;
      if (s.odprli != null) { odprli += s.odprli; zStat += d; }
      if (s.kliknili != null) kliknili += s.kliknili;
    }
  }
  const odprtost = pct(odprli, zStat);
  const klikanost = pct(kliknili, zStat);
  const caka = [...nacrtovane, ...osnutki];

  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">Mailing</div>
          <h1>E-novice</h1>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link className="gumb siv" href="/admin/e-novice/kontakti">
            Kontakti
          </Link>
          <form action={novaKampanja}>
            <input type="hidden" name="nacin" value="bloki" />
            <button className="gumb">+ Nova kampanja</button>
          </form>
        </div>
      </div>

      <div className="adm-telo">
        {error && (
          <div className="opozorilo">
            Baza: {error.message}
            {/enovice_kampanje/.test(error.message) && " — zaženi SQL sql/43-enovice-kampanje.sql v Supabase."}
          </div>
        )}

        {/* ---------- številke ---------- */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 14 }}>
          <Kpi stevilka={poslane.length} naziv="Poslanih kampanj" pod={poslane[0] ? `zadnja ${cas(poslane[0].poslano_ob)}` : "še nobena"} />
          <Kpi stevilka={prejemniki.toLocaleString("sl-SI")} naziv="Prejemnikov skupaj" pod="dostavljenih e-mailov" />
          <Kpi stevilka={odprtost != null ? `${odprtost} %` : "–"} naziv="Povprečna odprtost" pod={odprli ? `${odprli.toLocaleString("sl-SI")} odprtij` : null} />
          <Kpi stevilka={klikanost != null ? `${klikanost} %` : "–"} naziv="Povprečni kliki" pod={kliknili ? `${kliknili.toLocaleString("sl-SI")} klikov` : null} />
          <Kpi stevilka={caka.length} naziv="Čaka" pod={`${nacrtovane.length} načrtovanih · ${osnutki.length} osnutkov`} />
        </div>

        {/* ---------- čaka ---------- */}
        <Naslov>Čaka na pošiljanje</Naslov>
        {caka.length === 0 ? (
          <div style={{ ...okvir, padding: "18px 20px", color: sivo, fontSize: 14 }}>
            Nič ne čaka. Začni z gumbom <b>+ Nova kampanja</b> ali uporabi predlogo spodaj.
          </div>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {caka.map((k) => (
              <div key={k.id} style={{ ...okvir, padding: "14px 18px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                {k.status === "nacrtovano" ? (
                  <span className="znacka novo" style={{ whiteSpace: "nowrap" }}>Pošlje se {cas(k.nacrtovano_za)}</span>
                ) : (
                  <span className="znacka ne" style={{ whiteSpace: "nowrap" }}>Osnutek</span>
                )}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <Link href={`/admin/e-novice/${k.id}`} style={{ fontWeight: 700 }}>
                    {k.zadeva || k.naziv || <em style={{ color: "#9aa0a6" }}>(brez zadeve)</em>}
                  </Link>
                  <div style={{ fontSize: 12.5, color: sivo }}>
                    {k.segment_ime ? `Komu: ${k.segment_ime}` : "Prejemniki še niso izbrani"} · spremenjeno {cas(k.posodobljeno)}
                    {k.ustvaril ? ` · ${k.ustvaril}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Link className="gumb mini" href={`/admin/e-novice/${k.id}`}>
                    {k.status === "osnutek" ? "Uredi" : "Odpri"}
                  </Link>
                  {k.status === "osnutek" && (
                    <IzbrisiGumb action={izbrisiKampanjo} id={k.id} ime={k.naziv || k.zadeva || "kampanjo"} />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------- poslane ---------- */}
        <Naslov desno={<span style={{ fontSize: 12.5, color: sivo }}>Klikni kampanjo za analizo</span>}>Poslane kampanje</Naslov>
        {poslane.length === 0 ? (
          <div style={{ ...okvir, padding: "18px 20px", color: sivo, fontSize: 14 }}>Še ni poslanih kampanj.</div>
        ) : (
          <table className="adm-tab">
            <thead>
              <tr>
                <th>Kampanja</th>
                <th>Komu</th>
                <th>Poslano</th>
                <th>Prejemniki</th>
                <th>Odprli</th>
                <th>Kliknili</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {poslane.map((k) => {
                const s = k.statistika || {};
                const d = s.dostavljeno ?? s.poslano;
                return (
                  <tr key={k.id}>
                    <td>
                      <Link href={`/admin/e-novice/${k.id}`} style={{ fontWeight: 700, display: "block" }}>
                        {k.zadeva || k.naziv || "(brez zadeve)"}
                      </Link>
                      {k.naziv && k.naziv !== k.zadeva && <div style={{ fontSize: 12, color: sivo }}>{k.naziv}</div>}
                    </td>
                    <td>{k.segment_ime || "–"}</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: 13 }}>{cas(k.poslano_ob)}</td>
                    <td style={{ fontWeight: 700 }}>{d ?? "–"}</td>
                    <td><Delez n={s.odprli} od={d} barva="#1f7a3f" /></td>
                    <td><Delez n={s.kliknili} od={d} barva="#C8102E" /></td>
                    <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                      <Link className="gumb mini" href={`/admin/e-novice/${k.id}`}>
                        Analiza
                      </Link>{" "}
                      <a className="gumb siv mini" href={`/admin/porocilo-enovice/${k.id}`} target="_blank" rel="noreferrer">
                        Poročilo
                      </a>{" "}
                      <form action={podvojiKampanjo} style={{ display: "inline" }}>
                        <input type="hidden" name="iz" value={k.id} />
                        <button className="gumb siv mini">Podvoji</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* ---------- predloge ---------- */}
        <Naslov>Predloge</Naslov>
        {predloge.length === 0 ? (
          <div style={{ ...okvir, padding: "18px 20px", color: sivo, fontSize: 14 }}>
            Ni predlog. V urejevalniku kampanje klikni »Shrani kot predlogo«.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {predloge.map((k) => (
              <div key={k.id} style={{ ...okvir, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
                <div>
                  <b>{k.naziv || k.zadeva || "Predloga"}</b>
                  {k.zadeva && k.naziv && <div style={{ fontSize: 12.5, color: sivo }}>{k.zadeva}</div>}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: "auto" }}>
                  <form action={podvojiKampanjo}>
                    <input type="hidden" name="iz" value={k.id} />
                    <button className="gumb mini">Uporabi</button>
                  </form>
                  <Link className="gumb siv mini" href={`/admin/e-novice/${k.id}`}>
                    Uredi
                  </Link>
                  <IzbrisiGumb action={izbrisiKampanjo} id={k.id} ime={k.naziv || "predlogo"} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

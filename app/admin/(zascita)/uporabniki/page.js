import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { shraniDostop, izbrisiDostop } from "@/lib/akcije/uporabniki";
import { MODULI } from "@/lib/dovoljenja";

export const dynamic = "force-dynamic";

const SKUPINE = [...new Set(MODULI.map((m) => m.skupina))];

function Kljukice({ izbrane = [] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: "14px 22px", margin: "6px 0 18px" }}>
      {SKUPINE.map((s) => (
        <div key={s}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.55, marginBottom: 6 }}>{s}</div>
          {MODULI.filter((m) => m.skupina === s).map((m) => (
            <label key={m.kljuc} style={{ display: "flex", gap: 8, alignItems: "center", padding: "3px 0", fontWeight: 400, cursor: "pointer" }}>
              <input type="checkbox" name="dovoljenja" value={m.kljuc} defaultChecked={izbrane.includes(m.kljuc)} style={{ width: "auto", margin: 0 }} />
              {m.naziv}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

function Obrazec({ d }) {
  return (
    <form className="adm-obr" action={shraniDostop} style={{ maxWidth: "none" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
        <div className="adm-polje">
          <label>Microsoft e-naslov</label>
          <input name="email" type="email" required defaultValue={d?.email ?? ""} readOnly={!!d} placeholder="ime.priimek@as-system.si" />
        </div>
        <div className="adm-polje">
          <label>Ime in priimek</label>
          <input name="ime" type="text" defaultValue={d?.ime ?? ""} />
        </div>
      </div>
      <Kljukice izbrane={d?.dovoljenja ?? []} />
      <label style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 14, fontWeight: 400 }}>
        <input type="checkbox" name="aktiven" defaultChecked={d ? d.aktiven : true} style={{ width: "auto", margin: 0 }} />
        Dostop je aktiven
      </label>
      <button className="gumb" type="submit">{d ? "Shrani spremembe" : "Dodaj zaposlenega"}</button>
    </form>
  );
}

export default async function Uporabniki() {
  await zahtevajAdmina();
  const sb = supabaseAdmin();
  const [{ data: polni }, { data: dostopi, error }] = await Promise.all([
    sb.from("admin_uporabniki").select("id, ime, email").order("ime"),
    sb.from("admin_dostopi").select("*").order("ime"),
  ]);

  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">Sistem</div>
          <h1>Uporabniki administracije</h1>
        </div>
      </div>
      <div className="adm-telo">
        {error && (
          <div className="opozorilo">Tabela admin_dostopi še ne obstaja — v Supabase zaženi SQL iz sql/49-admin-dostopi.sql.</div>
        )}

        <p style={{ marginTop: 0, opacity: 0.75 }}>
          Zaposleni se prijavijo na <b>assystem.si/admin/prijava</b> z gumbom <b>Prijava z Microsoft</b> (službeni račun).
          Vidijo samo dele, ki jih odkljukaš.
        </p>

        <section className="adm-panel" style={{ marginBottom: 24 }}>
          <header><h2>Polni administratorji (vidijo vse)</h2></header>
          <ul>
            {(polni ?? []).map((p) => (
              <li key={p.id}>
                <div>
                  <b>{p.ime}</b>
                  <small>{p.email}</small>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <h2 className="adm-naslov">Zaposleni z omejenim dostopom</h2>
        {(dostopi ?? []).length === 0 && <p className="prazno">Še nihče — dodaj prvega spodaj.</p>}
        {(dostopi ?? []).map((d) => (
          <details key={d.email} className="adm-panel" style={{ marginBottom: 12, padding: "12px 18px" }}>
            <summary style={{ cursor: "pointer", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <b>{d.ime || d.email}</b>
              <small style={{ opacity: 0.6 }}>{d.email}</small>
              <span className="znacka ne">{d.dovoljenja?.length ?? 0} delov</span>
              {!d.aktiven && <span className="znacka novo">izklopljen</span>}
            </summary>
            <div style={{ paddingTop: 14 }}>
              <Obrazec d={d} />
              <form action={izbrisiDostop} style={{ marginTop: 10 }}>
                <input type="hidden" name="email" value={d.email} />
                <button className="gumb siv" type="submit">Odstrani dostop</button>
              </form>
            </div>
          </details>
        ))}

        <section className="adm-panel" style={{ marginTop: 24, padding: "16px 20px" }}>
          <header><h2>Dodaj zaposlenega</h2></header>
          <Obrazec />
        </section>
      </div>
    </>
  );
}

import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajAdmina } from "@/lib/akcije/skupno";
import { shraniDostop, izbrisiDostop, ponovnoPosljiVabilo } from "@/lib/akcije/uporabniki";
import { MODULI } from "@/lib/dovoljenja";
import Link from "next/link";
import { poslanaSporocila, poslanoSporocilo, STANJA } from "@/lib/resend-poslano";

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

const cas = (d) => new Date(d).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" });
const Stanje = ({ e }) => {
  const [st, cl] = STANJA[e] ?? [e, "caka"];
  return <i className={`ps-st ${cl}`}>{st}</i>;
};

export default async function Uporabniki({ searchParams }) {
  await zahtevajAdmina();
  const { vabilo = "", ok = "", id = "", napaka = "" } = await searchParams;
  let poslano = null;
  if (id) {
    await new Promise((r) => setTimeout(r, 1500));
    poslano = await poslanoSporocilo(id).catch(() => null);
  }
  // zadnja vabila po zaposlenih (iz Resenda)
  const vabila = {};
  try {
    const { sporocila } = await poslanaSporocila({ strani: 2, cilj: 50 });
    for (const m of sporocila)
      if (String(m.subject).startsWith("Dostop do administracije"))
        for (const t of m.to ?? []) vabila[t.toLowerCase()] ??= m;
  } catch {}
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
        {vabilo && ok === "1" && (
          <div className="adm-ok">
            ✓ Vabilo je poslano na <b>{vabilo}</b>
            {poslano && <> · stanje: <Stanje e={poslano.last_event} /></>}
            {id && <> · <Link href={`/admin/poslano/${id}`}>poglej mail</Link></>}
          </div>
        )}
        {vabilo && ok === "0" && <div className="opozorilo">Vabilo na {vabilo} NI bilo poslano{napaka ? `: ${napaka}` : ""}.</div>}
        {error && (
          <div className="opozorilo">Tabela admin_dostopi še ne obstaja — v Supabase zaženi SQL iz sql/49-admin-dostopi.sql.</div>
        )}

        <p style={{ marginTop: 0, opacity: 0.75 }}>
          Zaposleni se prijavijo na <b>assystem.si/admin/prijava</b> z gumbom <b>Prijava z Microsoft</b> (službeni račun).
          Vidijo samo dele, ki jih odkljukaš. Ob dodajanju dobijo vabilo po mailu.
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
              {vabila[d.email] ? (
                <small style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                  vabilo {cas(vabila[d.email].created_at)} <Stanje e={vabila[d.email].last_event} />
                </small>
              ) : (
                <small style={{ opacity: 0.5 }}>vabilo: ni podatka</small>
              )}
            </summary>
            <div style={{ paddingTop: 14 }}>
              <Obrazec d={d} />
              <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
                <form action={ponovnoPosljiVabilo}>
                  <input type="hidden" name="email" value={d.email} />
                  <button className="gumb siv" type="submit">Pošlji vabilo znova</button>
                </form>
                <form action={izbrisiDostop}>
                  <input type="hidden" name="email" value={d.email} />
                  <button className="gumb siv" type="submit">Odstrani dostop</button>
                </form>
              </div>
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

import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { novaKampanja, podvojiKampanjo, izbrisiKampanjo, osveziNacrtovane } from "@/lib/akcije/enovice-kampanje";
import IzbrisiGumb from "@/app/admin/IzbrisiGumb";

export const dynamic = "force-dynamic";

const ZAVIHKI = [
  ["osnutek", "Osnutki"],
  ["nacrtovano", "Načrtovane"],
  ["poslano", "Poslane"],
  ["predloga", "Predloge"],
];

const cas = (d) =>
  d ? new Date(d).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "short", timeStyle: "short" }) : "";

const odst = (a, b) => (b ? `${Math.round((100 * (a || 0)) / b)} %` : "–");

export default async function ENovice({ searchParams }) {
  const { z } = await searchParams;
  const zavihek = ZAVIHKI.some(([k]) => k === z) ? z : "osnutek";

  await osveziNacrtovane().catch(() => {});

  const sb = supabaseAdmin();
  const { data: vse, error } = await sb
    .from("enovice_kampanje")
    .select("id, naziv, zadeva, status, segment_ime, nacrtovano_za, poslano_ob, posodobljeno, ustvaril, statistika, nacin")
    .order("posodobljeno", { ascending: false })
    .limit(500);

  const stevci = Object.fromEntries(ZAVIHKI.map(([k]) => [k, (vse ?? []).filter((x) => x.status === k).length]));
  const vrstice = (vse ?? []).filter((x) => x.status === zavihek);
  if (zavihek === "poslano") vrstice.sort((a, b) => String(b.poslano_ob).localeCompare(String(a.poslano_ob)));
  if (zavihek === "nacrtovano") vrstice.sort((a, b) => String(a.nacrtovano_za).localeCompare(String(b.nacrtovano_za)));

  return (
    <>
      <div className="adm-glava">
        <h1>E-novice</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <Link className="gumb siv mini" href="/admin/e-novice/kontakti">
            Kontakti
          </Link>
          <form action={novaKampanja}>
            <input type="hidden" name="nacin" value="bloki" />
            <button className="gumb mini">+ Nova kampanja</button>
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

        <nav className="zavihki">
          {ZAVIHKI.map(([k, ime]) => (
            <Link key={k} href={`/admin/e-novice?z=${k}`} className={k === zavihek ? "on" : ""}>
              {ime}
              <em>{stevci[k] || 0}</em>
            </Link>
          ))}
        </nav>

        {vrstice.length === 0 ? (
          <p style={{ color: "#6e767e", fontSize: 14 }}>
            {zavihek === "osnutek" && "Ni osnutkov. Klikni »+ Nova kampanja«."}
            {zavihek === "nacrtovano" && "Ni načrtovanih kampanj."}
            {zavihek === "poslano" && "Še ni poslanih kampanj."}
            {zavihek === "predloga" && "Ni predlog. V urejevalniku klikni »Shrani kot predlogo«."}
          </p>
        ) : (
          <table className="adm-tab">
            <thead>
              <tr>
                <th>{zavihek === "predloga" ? "Predloga" : "Zadeva"}</th>
                {zavihek !== "predloga" && <th>Komu</th>}
                {zavihek === "poslano" ? (
                  <>
                    <th>Poslano</th>
                    <th>Prejemniki</th>
                    <th>Odprli</th>
                    <th>Kliknili</th>
                  </>
                ) : zavihek === "nacrtovano" ? (
                  <th>Pošlje se</th>
                ) : (
                  <th>Spremenjeno</th>
                )}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vrstice.map((k) => {
                const s = k.statistika || {};
                return (
                  <tr key={k.id}>
                    <td>
                      <Link href={`/admin/e-novice/${k.id}`} style={{ fontWeight: 600, display: "block" }}>
                        {(zavihek === "predloga" ? k.naziv : k.zadeva) || k.zadeva || <em style={{ color: "#9aa0a6" }}>(brez zadeve)</em>}
                      </Link>
                      {k.naziv && zavihek !== "predloga" && (
                        <div style={{ fontSize: 12, color: "#6e767e" }}>{k.naziv}</div>
                      )}
                    </td>
                    {zavihek !== "predloga" && <td>{k.segment_ime || "–"}</td>}
                    {zavihek === "poslano" ? (
                      <>
                        <td style={{ whiteSpace: "nowrap" }}>{cas(k.poslano_ob)}</td>
                        <td style={{ whiteSpace: "nowrap", fontWeight: 600 }}>{s.dostavljeno ?? s.poslano ?? "–"}</td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {s.odprli != null ? (
                            <>
                              <b>{s.odprli}</b> <span style={{ color: "#6e767e", fontSize: 12.5 }}>· {odst(s.odprli, s.dostavljeno)}</span>
                            </>
                          ) : (
                            "–"
                          )}
                        </td>
                        <td style={{ whiteSpace: "nowrap" }}>
                          {s.kliknili != null ? (
                            <>
                              <b>{s.kliknili}</b> <span style={{ color: "#6e767e", fontSize: 12.5 }}>· {odst(s.kliknili, s.dostavljeno)}</span>
                            </>
                          ) : (
                            "–"
                          )}
                        </td>
                      </>
                    ) : zavihek === "nacrtovano" ? (
                      <td>
                        <span className="znacka novo" style={{ whiteSpace: "nowrap" }}>{cas(k.nacrtovano_za)}</span>
                      </td>
                    ) : (
                      <td style={{ fontSize: 13, color: "#6e767e" }}>
                        {cas(k.posodobljeno)}
                        {k.ustvaril ? ` · ${k.ustvaril}` : ""}
                      </td>
                    )}
                    <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                      <Link className="gumb mini" href={`/admin/e-novice/${k.id}`}>
                        {["osnutek", "predloga"].includes(k.status) ? "Uredi" : "Odpri"}
                      </Link>{" "}
                      <form action={podvojiKampanjo} style={{ display: "inline" }}>
                        <input type="hidden" name="iz" value={k.id} />
                        <button className="gumb siv mini">{zavihek === "predloga" ? "Uporabi" : "Podvoji"}</button>
                      </form>{" "}
                      {["osnutek", "predloga"].includes(k.status) && (
                        <IzbrisiGumb action={izbrisiKampanjo} id={k.id} ime={k.naziv || k.zadeva || "kampanjo"} />
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

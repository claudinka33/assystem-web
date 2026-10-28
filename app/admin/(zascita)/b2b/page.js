import { supabaseAdmin } from "@/lib/supabase-server";
import { adminB2B } from "@/lib/akcije/b2b";
import { B2B_STATUSI } from "@/lib/b2b";
import Osvezi from "../../Osvezi";
import NovB2B from "./NovB2B";

export const dynamic = "force-dynamic";

const cas = (t) => (t ? new Date(t).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "short", timeStyle: "short" }) : "—");
const VRSTNI_RED = ["caka_odobritev", "preverjanje", "aktiven", "zavrnjen"];

export default async function B2BKupci({ searchParams }) {
  const { napaka, shranjeno, poslano } = await searchParams;
  const { data, error } = await supabaseAdmin().from("b2b_kupci").select("*").order("ustvarjeno", { ascending: false }).limit(500);
  if (error)
    return (
      <div className="adm-telo">
        <div className="opozorilo">Tabela B2B kupcev še ne obstaja. V Supabase (assystem-web) zaženi SQL »40-b2b.sql«.</div>
      </div>
    );
  const kupci = [...(data ?? [])].sort((a, b) => VRSTNI_RED.indexOf(a.status) - VRSTNI_RED.indexOf(b.status));
  const caka = kupci.filter((k) => k.status === "caka_odobritev").length;
  const poDavcni = {};
  for (const k of kupci) (poDavcni[k.davcna] ??= []).push(k);
  // Podjetja: najprej tista, ki čakajo na odobritev
  const rang = (u) => Math.min(...u.map((k) => VRSTNI_RED.indexOf(k.status)));
  const skupine = Object.values(poDavcni).sort((a, b) => rang(a) - rang(b));
  const partnerji = [...new Set(kupci.map((k) => k.vasco_partner).filter(Boolean))];
  const { data: vseProdajalne } = partnerji.length
    ? await supabaseAdmin().from("b2b_prodajalne").select("vasco_partner, sifra, naziv, naziv2, naslov, posta").in("vasco_partner", partnerji).order("naziv2")
    : { data: [] };
  const prodajalnePartnerja = {};
  for (const x of vseProdajalne ?? []) (prodajalnePartnerja[x.vasco_partner] ??= []).push(x);
  const imeProdajalne = (partner, sifra) => {
    const x = (prodajalnePartnerja[partner] ?? []).find((y) => y.sifra === sifra);
    return x ? x.naziv2 || x.naziv : `poslovalnica ${sifra}`;
  };

  return (
    <>
      <Osvezi aktivno={kupci.some((k) => k.status === "preverjanje")} />
      <div className="adm-glava">
        <h1>B2B kupci</h1>
        <span style={{ fontSize: 14, color: "#6e767e" }}>{skupine.length} podjetij · {kupci.length} uporabnikov · {caka} čaka na odobritev</span>
      </div>
      <div className="adm-telo">
        <p style={{ fontSize: 14, color: "#6e767e", marginTop: 0 }}>
          as-terminal vsaki 2 minuti poišče partnerja v Vascu po davčni. Če se e-naslov ali domena ujema s partnerjem, se kupec aktivira
          sam. Ostale odobri tukaj — pri novem podjetju ga najprej odpri v Vascu in vpiši šifro partnerja. Z »+ Nov B2B kupec« lahko podjetje odpreš sam: vpiši davčno, poišči podatke, dodaj kontakt — kupec dobi mail za potrditev in geslo.
        </p>
        {napaka && <div className="opozorilo" style={{ marginBottom: 12 }}>{napaka}</div>}
        {poslano && (
          <div className="opozorilo" style={{ marginBottom: 12, borderColor: "#1a7f3c", color: "#1a7f3c" }}>
            ✓ Povabilo za potrditev in geslo je poslano na <b>{poslano}</b>.
          </div>
        )}
        {shranjeno && <div className="opozorilo" style={{ marginBottom: 12, borderColor: "#1a7f3c", color: "#1a7f3c" }}>Spremembe shranjene.</div>}
        <NovB2B />
        {kupci.length === 0 && <div className="opozorilo">Ni še registracij.</div>}
        {skupine.map((uporabniki) => {
          const g = uporabniki.find((x) => x.vasco_partner) ?? uporabniki[0];
          const pr = prodajalnePartnerja[g.vasco_partner] ?? [];
          return (
            <div key={g.davcna} className="adm-obr" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "baseline", flexWrap: "wrap" }}>
                <b style={{ fontSize: 17 }}>{g.vasco_naziv || g.podjetje}</b>
                <span style={{ color: "#6e767e", fontSize: 13 }}>SI{g.davcna}</span>
                <span style={{ color: "#6e767e", fontSize: 13 }}>
                  {uporabniki.length} {uporabniki.length === 1 ? "uporabnik" : uporabniki.length === 2 ? "uporabnika" : uporabniki.length < 5 ? "uporabniki" : "uporabnikov"}
                  {pr.length ? ` · ${pr.length} poslovalnic` : ""}
                </span>
                <span style={{ flex: 1 }} />
                <NovB2B zacetnaDavcna={g.davcna} oznaka="+ Dodaj uporabnika" siv />
              </div>
              <p style={{ fontSize: 13.5, margin: "8px 0 10px", color: "#4a5056" }}>
                Vasco:{" "}
                {g.vasco_partner ? (
                  <b>{g.vasco_partner} — {g.vasco_naziv} ({g.vasco_naslov}, {g.vasco_posta})</b>
                ) : (
                  <span style={{ color: "#cb2026" }}>partner ni najden</span>
                )}
                {g.vasco_partner && (
                  <> · rok {g.rok_placila ?? "—"} dni · rabat {Number(g.rabat ?? 0)} %{g.ustavljena_prodaja && <b style={{ color: "#cb2026" }}> · USTAVLJENA PRODAJA</b>}</>
                )}
                {g.vasco_emaili?.length ? <><br />E-naslovi v Vascu: {g.vasco_emaili.join(", ")}</> : null}
              </p>
              {uporabniki.map((k) => (
                <details key={k.id} style={{ borderTop: "1px solid #eceef0", padding: "10px 0" }} open={k.status === "caka_odobritev"}>
                  <summary style={{ display: "flex", gap: 14, alignItems: "center", cursor: "pointer", listStyle: "none", flexWrap: "wrap" }}>
                    <span style={{ flex: 1, minWidth: 240 }}>
                      <b>{k.ime}</b> · {k.email}
                    </span>
                    <span style={{ fontSize: 13, color: "#6e767e" }}>
                      {k.prodajalna
                        ? `📍 ${imeProdajalne(k.vasco_partner, k.prodajalna)}`
                        : k.poslovalnica_vnos
                          ? <span style={{ color: "#b26a00" }}>⚠ določi poslovalnico (»{k.poslovalnica_vnos}«)</span>
                          : "sedež / vse poslovalnice"}
                    </span>
                    <span className={k.status === "aktiven" ? "znacka da" : k.status === "caka_odobritev" ? "znacka novo" : "znacka ne"}>
                      {B2B_STATUSI[k.status] ?? k.status}
                    </span>
                    <span style={{ fontSize: 12, color: "#cb2026" }}>Uredi ▾</span>
                  </summary>
                  <div style={{ marginTop: 10, fontSize: 14 }}>
                    <p style={{ margin: "0 0 10px", color: "#6e767e", fontSize: 13 }}>
                      Registracija: {cas(k.ustvarjeno)} · zadnja sinhronizacija: {cas(k.vasco_sync_ob)}
                      {k.vasco_sporocilo ? ` — ${k.vasco_sporocilo}` : ""}
                      {k.odobreno_rocno && <> · odobreno ročno</>}
                      {k.poslovalnica_vnos && <><br />Poslovalnica, ki jo je vpisal kupec: <b>{k.poslovalnica_vnos}</b></>}
                    </p>
                  <form action={adminB2B}>
                    <input type="hidden" name="id" value={k.id} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "0 12px" }}>
                      <div className="adm-polje" style={{ gridColumn: "span 2" }}>
                        <label>Podjetje</label>
                        <input name="podjetje" defaultValue={k.podjetje ?? ""} required />
                      </div>
                      <div className="adm-polje">
                        <label>Davčna</label>
                        <input name="davcna" defaultValue={k.davcna ?? ""} required />
                      </div>
                      <div className="adm-polje">
                        <label>Šifra partnerja v Vascu</label>
                        <input name="vasco_partner" defaultValue={k.vasco_partner ?? ""} placeholder="poišče se po davčni" />
                      </div>
                      <div className="adm-polje">
                        <label>Kontaktna oseba</label>
                        <input name="ime" defaultValue={k.ime ?? ""} required />
                      </div>
                      <div className="adm-polje">
                        <label>E-naslov (prijava)</label>
                        <input name="email" type="email" defaultValue={k.email ?? ""} required />
                      </div>
                      <div className="adm-polje">
                        <label>Telefon</label>
                        <input name="telefon" defaultValue={k.telefon ?? ""} />
                      </div>
                      <div className="adm-polje" style={{ gridColumn: "span 2" }}>
                        <label>Naslov</label>
                        <input name="naslov" defaultValue={k.naslov ?? ""} />
                      </div>
                      <div className="adm-polje">
                        <label>Pošta</label>
                        <input name="posta" defaultValue={k.posta ?? ""} />
                      </div>
                      <div className="adm-polje">
                        <label>Kraj</label>
                        <input name="kraj" defaultValue={k.kraj ?? ""} />
                      </div>
                      {(prodajalnePartnerja[k.vasco_partner] ?? []).length > 0 && (
                        <div className="adm-polje" style={{ gridColumn: "1 / -1" }}>
                          <label>
                            Poslovalnica uporabnika
                            {k.poslovalnica_vnos && !k.prodajalna && (
                              <span style={{ color: "#b26a00", fontWeight: 400 }}> — kupec je vpisal: »{k.poslovalnica_vnos}«</span>
                            )}
                          </label>
                          <select name="prodajalna" defaultValue={k.prodajalna ?? ""}>
                            <option value="">Sedež — vidi vse poslovalnice in vsa naročila podjetja</option>
                            {prodajalnePartnerja[k.vasco_partner].map((x) => (
                              <option key={x.sifra} value={x.sifra}>{x.naziv2 || x.naziv} — {x.naslov}, {x.posta}</option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className="adm-polje" style={{ gridColumn: "1 / -1" }}>
                        <label>Interna opomba / kontakti</label>
                        <textarea name="opomba_interna" rows={3} defaultValue={k.opomba_interna ?? ""} />
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button className="gumb" type="submit" name="akcija" value="shrani">Shrani spremembe</button>
                      {k.status !== "aktiven" && <button className="gumb" type="submit" name="akcija" value="odobri">Odobri</button>}
                      <button className="gumb siv" type="submit" name="akcija" value="preveri">Preveri v Vascu</button>
                      {k.status !== "zavrnjen" && <button className="gumb siv" type="submit" name="akcija" value="povabilo">Pošlji povabilo za geslo</button>}
                      {k.status !== "zavrnjen" && <button className="gumb siv" type="submit" name="akcija" value="zavrni">Zavrni</button>}
                    </div>
                  </form>
                  </div>
                </details>
              ))}
            </div>
          );
        })}
      </div>
    </>
  );
}

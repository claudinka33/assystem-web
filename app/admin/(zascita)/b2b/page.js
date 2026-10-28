import { supabaseAdmin } from "@/lib/supabase-server";
import { adminB2B } from "@/lib/akcije/b2b";
import { B2B_STATUSI } from "@/lib/b2b";
import Osvezi from "../../Osvezi";
import NovB2B from "./NovB2B";

export const dynamic = "force-dynamic";

const cas = (t) => (t ? new Date(t).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "short", timeStyle: "short" }) : "—");
const VRSTNI_RED = ["caka_odobritev", "preverjanje", "aktiven", "zavrnjen"];

export default async function B2BKupci({ searchParams }) {
  const { napaka, shranjeno } = await searchParams;
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

  return (
    <>
      <Osvezi aktivno={kupci.some((k) => k.status === "preverjanje")} />
      <div className="adm-glava">
        <h1>B2B kupci</h1>
        <span style={{ fontSize: 14, color: "#6e767e" }}>{kupci.length} skupaj · {caka} čaka na odobritev</span>
      </div>
      <div className="adm-telo">
        <p style={{ fontSize: 14, color: "#6e767e", marginTop: 0 }}>
          as-terminal vsaki 2 minuti poišče partnerja v Vascu po davčni. Če se e-naslov ali domena ujema s partnerjem, se kupec aktivira
          sam. Ostale odobri tukaj — pri novem podjetju ga najprej odpri v Vascu in vpiši šifro partnerja. Z »+ Nov B2B kupec« lahko podjetje odpreš sam: vpiši davčno, poišči podatke, dodaj kontakt — kupec dobi mail za potrditev in geslo.
        </p>
        {napaka && <div className="opozorilo" style={{ marginBottom: 12 }}>{napaka}</div>}
        {shranjeno && <div className="opozorilo" style={{ marginBottom: 12, borderColor: "#1a7f3c", color: "#1a7f3c" }}>Spremembe shranjene.</div>}
        <NovB2B />
        {kupci.length === 0 && <div className="opozorilo">Ni še registracij.</div>}
        {kupci.map((k) => (
          <details key={k.id} className="adm-obr" style={{ marginBottom: 12 }} open={k.status === "caka_odobritev"}>
            <summary style={{ display: "flex", gap: 16, alignItems: "center", cursor: "pointer", listStyle: "none", flexWrap: "wrap" }}>
              <b style={{ minWidth: 220 }}>{k.podjetje}</b>
              <span style={{ color: "#6e767e", fontSize: 13 }}>SI{k.davcna}</span>
              <span style={{ flex: 1 }}>{k.ime} · {k.email}</span>
              {poDavcni[k.davcna].length > 1 && (
                <span style={{ fontSize: 12, color: "#6e767e" }}>{poDavcni[k.davcna].length} uporabniki podjetja</span>
              )}
              <span className={k.status === "aktiven" ? "znacka da" : k.status === "caka_odobritev" ? "znacka novo" : "znacka ne"}>
                {B2B_STATUSI[k.status] ?? k.status}
              </span>
            </summary>
            <div style={{ marginTop: 12, fontSize: 14 }}>
              <p>
                Registracija: {cas(k.ustvarjeno)} · tel. {k.telefon} · {k.naslov} {k.posta} {k.kraj}
                <br />
                Vasco:{" "}
                {k.vasco_partner ? (
                  <b>{k.vasco_partner} — {k.vasco_naziv} ({k.vasco_naslov}, {k.vasco_posta})</b>
                ) : (
                  <span style={{ color: "#cb2026" }}>partner ni najden</span>
                )}
                {k.vasco_partner && (
                  <> · rok {k.rok_placila ?? "—"} dni · rabat {Number(k.rabat ?? 0)} %{k.ustavljena_prodaja && <b style={{ color: "#cb2026" }}> · USTAVLJENA PRODAJA</b>}</>
                )}
                <br />
                {k.vasco_emaili?.length ? <>E-naslovi v Vascu: {k.vasco_emaili.join(", ")}<br /></> : null}
                Zadnja sinhronizacija: {cas(k.vasco_sync_ob)}{k.vasco_sporocilo ? ` — ${k.vasco_sporocilo}` : ""}
                {k.odobreno_rocno && <> · odobreno ročno</>}
                {poDavcni[k.davcna].length > 1 && (
                  <>
                    <br />
                    Drugi uporabniki podjetja:{" "}
                    {poDavcni[k.davcna].filter((x) => x.id !== k.id).map((x) => `${x.ime} (${x.email})`).join(", ")}
                  </>
                )}
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
    </>
  );
}

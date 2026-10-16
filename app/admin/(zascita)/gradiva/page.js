import { supabaseAdmin } from "@/lib/supabase-server";
import { izbrisiGradivo, shraniGradivo } from "@/lib/akcije/skupno";
import NalozSliko from "@/app/admin/NalozSliko";
import IzbrisiGumb from "../../IzbrisiGumb";

export const dynamic = "force-dynamic";

const TIPI = [
  ["katalog", "Katalogi"],
  ["letak", "Letaki"],
  ["certifikat", "Certifikati"],
  ["eta", "ETA — evropske tehnične ocene"],
  ["dop", "DoP — izjave o lastnostih"],
  ["navodila", "Navodila za vgradnjo"],
  ["risba", "Tehnične risbe"],
];
const JEZIKI = { sl: "SLO", en: "ENG", de: "DEU", hr: "HRV" };

export default async function Gradiva({ searchParams }) {
  const { tip: izbran } = (await searchParams) ?? {};
  const sb = supabaseAdmin();
  const [{ data }, { data: izdelki }] = await Promise.all([
    sb.from("dokumenti").select("id, naziv, tip, jezik, datoteka_url, izdelek_id, izdelki ( naziv )").order("tip").order("naziv").limit(1000),
    sb.from("izdelki").select("id, naziv").order("naziv").limit(2000),
  ]);
  const vsi = data ?? [];
  const steje = Object.fromEntries(TIPI.map(([t]) => [t, vsi.filter((d) => d.tip === t).length]));
  const prikazani = izbran ? vsi.filter((d) => d.tip === izbran) : vsi;

  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">Vsebina</div>
          <h1>Katalogi in gradiva</h1>
        </div>
        <a className="gumb siv" href="/katalogi" target="_blank" rel="noreferrer">Poglej stran Katalogi ↗</a>
      </div>

      <div className="adm-telo">
        <form className="adm-obr" action={shraniGradivo} style={{ maxWidth: "none", marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, margin: "0 0 16px" }}>Dodaj dokument</h2>
          <NalozSliko ime="datoteka_url" oznaka="PDF datoteka *" vedro="dokumenti" />
          <div className="adm-vrsta-3">
            <div className="adm-polje">
              <label htmlFor="g_naziv">Naziv *</label>
              <input id="g_naziv" name="naziv" type="text" required placeholder="npr. Katalog ASfix 2026" />
            </div>
            <div className="adm-polje">
              <label htmlFor="g_tip">Vrsta *</label>
              <select id="g_tip" name="tip" defaultValue={izbran || "katalog"}>
                {TIPI.map(([v, o]) => <option key={v} value={v}>{o}</option>)}
              </select>
            </div>
            <div className="adm-polje">
              <label htmlFor="g_jezik">Jezik</label>
              <select id="g_jezik" name="jezik" defaultValue="sl">
                {Object.entries(JEZIKI).map(([v, o]) => <option key={v} value={v}>{o}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-polje">
            <label htmlFor="g_izdelek">Velja za izdelek (neobvezno)</label>
            <select id="g_izdelek" name="izdelek_id" defaultValue="" style={{ width: "100%" }}>
              <option value="">— splošno (samo na strani Katalogi) —</option>
              {(izdelki ?? []).map((i) => <option key={i.id} value={i.id}>{i.naziv}</option>)}
            </select>
            <p className="namig">Če izbereš izdelek, se dokument pokaže tudi na strani tega izdelka.</p>
          </div>
          <button className="gumb" type="submit">Dodaj dokument</button>
        </form>

        <div className="zavihki">
          <a href="/admin/gradiva" className={!izbran ? "on" : ""}>Vse <em>{vsi.length}</em></a>
          {TIPI.map(([t, o]) => (
            <a key={t} href={`/admin/gradiva?tip=${t}`} className={izbran === t ? "on" : ""}>
              {o.split(" — ")[0]} <em>{steje[t]}</em>
            </a>
          ))}
        </div>

        {prikazani.length === 0 ? (
          <div className="opozorilo">V tej skupini še ni dokumentov.</div>
        ) : (
          <table className="adm-tab">
            <thead>
              <tr>
                <th>Naziv</th>
                <th style={{ width: 150 }}>Vrsta</th>
                <th style={{ width: 70 }}>Jezik</th>
                <th>Izdelek</th>
                <th style={{ width: 130 }}></th>
              </tr>
            </thead>
            <tbody>
              {prikazani.map((d) => (
                <tr key={d.id}>
                  <td><b>{d.naziv}</b></td>
                  <td><span className="znacka ne">{(TIPI.find(([t]) => t === d.tip)?.[1] ?? d.tip).split(" — ")[0]}</span></td>
                  <td>{JEZIKI[d.jezik] ?? d.jezik}</td>
                  <td style={{ color: "#6e7276" }}>
                    {d.izdelek_id ? <a href={`/admin/izdelki/${d.izdelek_id}`} style={{ color: "inherit" }}>{d.izdelki?.naziv ?? "izdelek"}</a> : "splošno"}
                  </td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <a className="gumb siv mini" href={d.datoteka_url} target="_blank" rel="noreferrer">Odpri</a>{" "}
                    <IzbrisiGumb action={izbrisiGradivo} id={d.id} ime={d.naziv} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

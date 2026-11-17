import { supabaseAdmin } from "@/lib/supabase-server";
import { spremeniNarocilo } from "@/lib/akcije/narocila-admin";
import { eur } from "@/lib/cene";
import { stanjeNarocila } from "@/lib/narocila-stanje";

export const dynamic = "force-dynamic";

const STATUSI = ["novo", "potrjeno", "v pripravi", "odposlano", "zaključeno", "preklicano"];
const PLACILO = { predracun: "predračun", povzetje: "povzetje", paypal: "PayPal", kartica: "kartica", racun: "na račun (B2B)" };

const MREZA = "110px 96px minmax(200px, 2.2fr) minmax(110px, 1fr) 44px minmax(100px, 1fr) minmax(90px, 1fr) 40px 80px 84px 84px";

function naslov(a) {
  if (!a) return <span className="siv">—</span>;
  return (
    <>
      {a.naziv && <><b>{a.naziv}</b><br /></>}
      {a.ime && <>{a.ime}<br /></>}
      {a.ulica}{a.ulica ? ", " : ""}{a.posta} {a.kraj}
      {a.davcna && <><br />Davčna: {a.davcna}</>}
    </>
  );
}

function cas(t) {
  return t ? new Date(t).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "short", timeStyle: "short" }) : "";
}

export default async function Narocila() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("narocila")
    .select("*, narocilo_postavke(sifra, naziv, kolicina, enota, cena_neto, vrstica_neto), b2b_kupci(podjetje, vasco_naziv)")
    .order("id", { ascending: false })
    .limit(100);
  const seznam = data ?? [];

  return (
    <>
      <div className="adm-glava">
        <h1>Naročila</h1>
        <span style={{ fontSize: 13, color: "#6e767e" }}>{seznam.length} zadnjih</span>
      </div>
      <div className="adm-telo">
        {seznam.length === 0 && <div className="opozorilo">Naročil še ni.</div>}
        {seznam.length > 0 && (
        <div className="vrstice">
          <div className="vrstice-glava" style={{ gridTemplateColumns: MREZA }}>
            <span>Številka</span><span>Datum</span><span>Kupec</span><span>Kraj dostave</span><span>Tip</span><span>Plačilo</span>
            <span>Dostava</span><span className="des">Post.</span><span>Vasco</span><span className="des">Skupaj</span><span>Status</span>
          </div>
        {seznam.map((n) => {
          const podjetje = n.b2b_kupci?.vasco_naziv || n.b2b_kupci?.podjetje || n.naslov_racun?.naziv || n.naslov_dostava?.naziv || "";
          const kraj = [n.naslov_dostava?.posta, n.naslov_dostava?.kraj].filter(Boolean).join(" ");
          const st = (n.narocilo_postavke ?? []).length;
          return (
          <details key={n.id}>
            <summary style={{ gridTemplateColumns: MREZA }}>
              <b>{n.stevilka}</b>
              <span className="siv">{cas(n.ustvarjeno)}</span>
              <span className="ell" title={`${podjetje} ${n.kontakt_ime} ${n.kontakt_email}`}>
                {podjetje ? <><b>{podjetje}</b> <span className="siv">· {n.kontakt_ime}</span></> : <b>{n.kontakt_ime}</b>}
                <br /><span className="siv" style={{ fontSize: 11.5 }}>{n.kontakt_email}{n.kontakt_telefon ? ` · ${n.kontakt_telefon}` : ""}</span>
              </span>
              <span className="ell">{kraj || "—"}</span>
              <span><span className={n.tip === "B2B" ? "znacka da" : "znacka ne"}>{n.tip}</span></span>
              <span className="ell">
                {PLACILO[n.nacin_placila] ?? n.nacin_placila}
                <br /><span style={{ fontSize: 11.5, color: n.status_placila === "plačano" ? "#1a7f3c" : "#b26a00" }}>{n.status_placila}</span>
              </span>
              <span className="ell siv">{n.nacin_dostave || "—"}</span>
              <span className="des">{st}</span>
              <span className="ell">
                {n.vasco_predracun ? <b>{n.vasco_predracun}</b> : n.vasco_napaka ? <span style={{ color: "#cb2026" }}>napaka</span> : <span className="siv">čaka</span>}
              </span>
              <b className="des">{eur(Number(n.skupaj))}</b>
              <span><span className={`znacka ${stanjeNarocila(n).razred}`}>{stanjeNarocila(n).oznaka}</span></span>
            </summary>
            <div className="vrstice-podrobno">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "4px 20px", marginBottom: 8 }}>
                <div>
                  <div className="siv" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".5px" }}>Kontakt</div>
                  {n.kontakt_ime}<br />
                  <a href={`mailto:${n.kontakt_email}`} style={{ color: "#c8102e" }}>{n.kontakt_email}</a>
                  {n.kontakt_telefon && <> · {n.kontakt_telefon}</>}
                </div>
                <div>
                  <div className="siv" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".5px" }}>Račun</div>
                  {naslov(n.naslov_racun)}
                </div>
                <div>
                  <div className="siv" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".5px" }}>Dostava</div>
                  {naslov(n.naslov_dostava)}
                  <br /><span className="siv">{n.nacin_dostave}</span>
                </div>
                <div>
                  <div className="siv" style={{ fontSize: 10.5, textTransform: "uppercase", letterSpacing: ".5px" }}>Plačilo / Vasco</div>
                  {PLACILO[n.nacin_placila] ?? n.nacin_placila} ({n.status_placila})
                  {n.placilo_ref && <span className="siv"> · ref. {n.placilo_ref}</span>}
                  {n.popust_koda && <><br />Koda za popust: <b>{n.popust_koda}</b></>}
                  {n.vasco_partner && <><br />Vasco partner: <b>{n.vasco_partner}</b>{n.prodajalna ? ` · poslovalnica ${n.prodajalna}` : ""}</>}
                  <br />
                  {n.vasco_predracun ? (
                    <b>predračun {n.vasco_predracun}</b>
                  ) : n.vasco_napaka ? (
                    <span style={{ color: "#cb2026" }}>napaka — {n.vasco_napaka}</span>
                  ) : (
                    <span className="siv">čaka na prenos (as-terminal)</span>
                  )}
                </div>
              </div>
              {n.opomba_kupca && <p style={{ whiteSpace: "pre-wrap", margin: "0 0 6px" }}>Opomba kupca: {n.opomba_kupca}</p>}
              <table className="adm-tab" style={{ marginTop: 4, boxShadow: "none" }}>
                <thead><tr><th>Šifra</th><th>Naziv</th><th>Količina</th><th>Cena neto</th><th>Skupaj neto</th></tr></thead>
                <tbody>
                  {(n.narocilo_postavke ?? []).map((v, i) => (
                    <tr key={i}>
                      <td><b>{v.sifra}</b></td><td>{v.naziv}</td><td>{v.kolicina} × {v.enota}</td>
                      <td>{eur(Number(v.cena_neto))}</td><td>{eur(Number(v.vrstica_neto))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ margin: "6px 0" }}>
                Neto {eur(Number(n.neto))} · DDV {eur(Number(n.ddv))} · Poštnina {eur(Number(n.postnina))}{Number(n.popust) > 0 ? ` · Popust −${eur(Number(n.popust))}` : ""} · <b>Skupaj {eur(Number(n.skupaj))}</b>
              </p>
              <form action={spremeniNarocilo} style={{ display: "flex", gap: 10, alignItems: "flex-end", marginTop: 10 }}>
                <input type="hidden" name="id" value={n.id} />
                <div className="adm-polje" style={{ marginBottom: 0, width: 160 }}>
                  <label>Status</label>
                  <select name="status" defaultValue={n.status}>{STATUSI.map((s) => <option key={s}>{s}</option>)}</select>
                </div>
                <div className="adm-polje" style={{ marginBottom: 0, width: 160 }}>
                  <label>Plačilo</label>
                  <select name="status_placila" defaultValue={n.status_placila}>{["neplačano", "plačano", "vrnjeno"].map((s) => <option key={s}>{s}</option>)}</select>
                </div>
                <div className="adm-polje" style={{ marginBottom: 0, flex: 1 }}>
                  <label>Interna opomba</label>
                  <input type="text" name="opomba_interna" defaultValue={n.opomba_interna ?? ""} />
                </div>
                <button className="gumb" type="submit">Shrani</button>
              </form>
            </div>
          </details>
          );
        })}
        </div>
        )}
      </div>
    </>
  );
}

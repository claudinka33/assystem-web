import { supabaseAdmin } from "@/lib/supabase-server";
import { spremeniNarocilo } from "@/lib/akcije/narocila-admin";
import { eur } from "@/lib/cene";

export const dynamic = "force-dynamic";

const STATUSI = ["novo", "potrjeno", "v pripravi", "odposlano", "zaključeno", "preklicano"];
const PLACILO = { predracun: "predračun", povzetje: "povzetje", paypal: "PayPal", kartica: "kartica" };

function cas(t) {
  return t ? new Date(t).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "short", timeStyle: "short" }) : "";
}

export default async function Narocila() {
  const sb = supabaseAdmin();
  const { data } = await sb
    .from("narocila")
    .select("*, narocilo_postavke(sifra, naziv, kolicina, enota, cena_neto, vrstica_neto)")
    .order("id", { ascending: false })
    .limit(100);
  const seznam = data ?? [];

  return (
    <>
      <div className="adm-glava">
        <h1>Naročila</h1>
        <span style={{ fontSize: 14, color: "#6e767e" }}>{seznam.length} zadnjih</span>
      </div>
      <div className="adm-telo">
        {seznam.length === 0 && <div className="opozorilo">Naročil še ni.</div>}
        {seznam.map((n) => (
          <details key={n.id} className="adm-obr" style={{ marginBottom: 12 }}>
            <summary style={{ display: "flex", gap: 16, alignItems: "center", cursor: "pointer", listStyle: "none" }}>
              <b style={{ minWidth: 130 }}>{n.stevilka}</b>
              <span style={{ minWidth: 120, color: "#6e767e", fontSize: 13 }}>{cas(n.ustvarjeno)}</span>
              <span style={{ flex: 1 }}>
                {n.kontakt_ime} <span style={{ color: "#6e767e" }}>· {n.tip} · {PLACILO[n.nacin_placila] ?? n.nacin_placila}</span>
              </span>
              <b>{eur(Number(n.skupaj))}</b>
              <span className={n.status === "novo" ? "znacka novo" : "znacka ne"}>{n.status}</span>
            </summary>
            <div style={{ marginTop: 14, fontSize: 14 }}>
              <p>
                <a href={`mailto:${n.kontakt_email}`} style={{ color: "#c8102e" }}>{n.kontakt_email}</a> · {n.kontakt_telefon}
                <br />
                {n.naslov_dostava?.naziv && <>{n.naslov_dostava.naziv}, </>}
                {n.naslov_dostava?.ime}, {n.naslov_dostava?.ulica}, {n.naslov_dostava?.posta} {n.naslov_dostava?.kraj}
                <br />
                Dostava: {n.nacin_dostave} · Plačilo: {PLACILO[n.nacin_placila] ?? n.nacin_placila} ({n.status_placila})
              </p>
              {n.opomba_kupca && <p style={{ whiteSpace: "pre-wrap" }}>Opomba kupca: {n.opomba_kupca}</p>}
              <table className="adm-tab" style={{ marginTop: 10 }}>
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
              <p style={{ marginTop: 8 }}>
                Neto {eur(Number(n.neto))} · DDV {eur(Number(n.ddv))} · Poštnina {eur(Number(n.postnina))} · <b>Skupaj {eur(Number(n.skupaj))}</b>
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
        ))}
      </div>
    </>
  );
}

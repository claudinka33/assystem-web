import { supabaseAdmin } from "@/lib/supabase-server";
import { zahtevajSinhronizacijo, oznaciNovArtikel } from "@/lib/akcije/sinhronizacija";
import Osvezi from "../../Osvezi";

export const dynamic = "force-dynamic";

function cas(t) {
  if (!t) return "—";
  return new Date(t).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", dateStyle: "short", timeStyle: "short" });
}

const OZNAKE = { caka: "čaka", "v teku": "v teku", koncano: "končano", napaka: "napaka" };

export default async function Sinhronizacija() {
  const sb = supabaseAdmin();
  const [zah, dnevnik, novi] = await Promise.all([
    sb.from("vasco_sync_zahteve").select("*").order("id", { ascending: false }).limit(5),
    sb.from("vasco_sync_log").select("*").order("id", { ascending: false }).limit(15),
    sb.from("vasco_novi_artikli").select("*").eq("status", "nov").order("skupina").order("sifra").limit(300),
  ]);

  if (zah.error || dnevnik.error) {
    return (
      <div className="adm-telo">
        <div className="opozorilo">
          Tabele za sinhronizacijo še ne obstajajo. V Supabase (assystem-web) zaženi SQL »37-sinhronizacija-vasco.sql«.
        </div>
      </div>
    );
  }

  const zahteve = zah.data ?? [];
  const odprta = zahteve.find((z) => z.status === "caka" || z.status === "v teku");
  const zadnja = (dnevnik.data ?? [])[0];
  const seznamNovih = novi.data ?? [];

  return (
    <>
      <Osvezi aktivno={!!odprta} />
      <div className="adm-glava">
        <h1>Sinhronizacija z Vascom</h1>
        <form action={zahtevajSinhronizacijo}>
          <button className="gumb" type="submit" disabled={!!odprta}>
            {odprta ? (odprta.status === "caka" ? "Čakam na as-terminal …" : "Sinhronizacija teče …") : "Sinhroniziraj zdaj"}
          </button>
        </form>
      </div>

      <div className="adm-telo">
        <p style={{ fontSize: 14, color: "#6e767e", marginTop: 0 }}>
          Samodejno ob 2:30, 10:00 in 13:00. Posodobi zalogo in cene vseh artiklov na spletu. Ročna sinhronizacija se začne v
          največ 2 minutah in traja okoli minuto.
          {zadnja && (
            <>
              {" "}Zadnja: <b>{cas(zadnja.konec ?? zadnja.zacetek)}</b>
              {zadnja.napaka ? " — napaka" : ` — posodobljenih ${zadnja.posodobljenih ?? 0}`}.
            </>
          )}
        </p>

        {zahteve.length > 0 && (
          <>
            <h2 style={{ fontSize: 16, margin: "24px 0 10px" }}>Ročne zahteve</h2>
            <table className="adm-tab">
              <thead>
                <tr><th>Zahteval</th><th>Čas</th><th>Status</th><th>Rezultat</th></tr>
              </thead>
              <tbody>
                {zahteve.map((z) => (
                  <tr key={z.id}>
                    <td>{z.zahteval}</td>
                    <td>{cas(z.ustvarjeno)}</td>
                    <td><span className={z.status === "koncano" ? "znacka da" : z.status === "napaka" ? "znacka novo" : "znacka ne"}>{OZNAKE[z.status] ?? z.status}</span></td>
                    <td style={{ fontSize: 13 }}>{z.sporocilo ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <h2 style={{ fontSize: 16, margin: "28px 0 10px" }}>Dnevnik</h2>
        {(dnevnik.data ?? []).length === 0 ? (
          <div className="opozorilo">Sinhronizacija se še ni izvedla.</div>
        ) : (
          <table className="adm-tab">
            <thead>
              <tr><th>Začetek</th><th>Vir</th><th>Posodobljenih</th><th>Ni v Vascu</th><th>Novi v Vascu</th><th>Napaka</th></tr>
            </thead>
            <tbody>
              {dnevnik.data.map((d) => (
                <tr key={d.id}>
                  <td>{cas(d.zacetek)}</td>
                  <td>{d.vir === "rocno" ? "ročno" : "samodejno"}</td>
                  <td>{d.posodobljenih ?? "—"}</td>
                  <td>{d.ni_v_vascu ?? "—"}</td>
                  <td>{d.novih_kandidatov ?? "—"}</td>
                  <td style={{ color: "#cb2026", fontSize: 13 }}>{d.napaka ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <h2 style={{ fontSize: 16, margin: "28px 0 6px" }}>Novi artikli v Vascu ({seznamNovih.length})</h2>
        <p style={{ fontSize: 13.5, color: "#6e767e", margin: "0 0 10px" }}>
          Artikli s ceno iz skupin, ki jih že imamo na spletu, a jih na spletu še ni. Nič se ne objavi samodejno — sporoči jih
          Claudu za dodajanje ali jih označi »ignoriraj«.
        </p>
        {seznamNovih.length > 0 && (
          <table className="adm-tab">
            <thead>
              <tr><th>Šifra</th><th>Naziv</th><th>Skupina</th><th>Zaloga</th><th></th></tr>
            </thead>
            <tbody>
              {seznamNovih.map((n) => (
                <tr key={n.sifra}>
                  <td><b>{n.sifra}</b></td>
                  <td>{n.naziv}<div style={{ fontSize: 12.5, color: "#6e767e" }}>{n.naziv2}</div></td>
                  <td>{n.skupina}</td>
                  <td>{n.zaloga ?? "—"}</td>
                  <td>
                    <form action={oznaciNovArtikel}>
                      <input type="hidden" name="sifra" value={n.sifra} />
                      <input type="hidden" name="status" value="ignoriraj" />
                      <button className="gumb siv mini" type="submit">Ignoriraj</button>
                    </form>
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

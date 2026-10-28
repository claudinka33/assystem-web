import Link from "next/link";
import { redirect } from "next/navigation";
import { trenutniB2B, prodajalneKupca, B2B_STATUSI, jeAktiven } from "@/lib/b2b";
import { odjava } from "@/lib/akcije/b2b";
import { supabaseAdmin } from "@/lib/supabase-server";
import { eur } from "@/lib/cene";
import { site } from "@/lib/site";

export const metadata = { title: "Moj B2B račun", robots: { index: false } };
export const dynamic = "force-dynamic";

const cas = (t) => (t ? new Date(t).toLocaleDateString("sl-SI", { timeZone: "Europe/Ljubljana" }) : "");

export default async function Racun({ searchParams }) {
  const { potrjeno, geslo } = await searchParams;
  const k = await trenutniB2B();
  if (!k) redirect("/b2b?naprej=/b2b/racun");
  const aktiven = jeAktiven(k);
  // Zgodovina: uporabnik poslovalnice vidi naročila svoje poslovalnice, uporabnik sedeža vsa naročila podjetja.
  let poizvedba = supabaseAdmin()
    .from("narocila")
    .select("id, stevilka, ustvarjeno, skupaj, status, nacin_dostave, vasco_predracun, b2b_kupec_id, prodajalna")
    .order("id", { ascending: false })
    .limit(100);
  if (aktiven) {
    poizvedba = poizvedba.eq("vasco_partner", k.vasco_partner);
    if (k.prodajalna) poizvedba = poizvedba.eq("prodajalna", k.prodajalna);
  } else poizvedba = poizvedba.eq("b2b_kupec_id", k.id);
  const [prodajalne, { data: narocila }, { data: sodelavci }] = await Promise.all([
    prodajalneKupca(k.vasco_partner),
    poizvedba,
    supabaseAdmin().from("b2b_kupci").select("id, ime").eq("davcna", k.davcna),
  ]);
  const imeKupca = Object.fromEntries((sodelavci ?? []).map((x) => [x.id, x.ime]));
  const mojaPoslovalnica = k.prodajalna ? prodajalne.find((p) => p.sifra === k.prodajalna) : null;
  const imePoslovalnice = Object.fromEntries(prodajalne.map((p) => [p.sifra, p.naziv2 || p.naziv]));

  return (
    <section className="sec">
      <div className="w" style={{ maxWidth: 1000 }}>
        <p className="izd-kat">B2B račun</p>
        <h1 className="izd-h1">{k.vasco_naziv || k.podjetje}</h1>

        {potrjeno && <div className="b2b-ok" style={{ marginTop: 16 }}>E-naslov je potrjen.</div>}
        {geslo && <div className="b2b-ok" style={{ marginTop: 16 }}>Novo geslo je shranjeno.</div>}

        {k.status === "preverjanje" && (
          <div className="b2b-info" style={{ marginTop: 16 }}>
            Podatke podjetja preverjamo v našem sistemu. To traja nekaj minut — osveži stran. Do takrat vidiš navadne cene.
          </div>
        )}
        {k.status === "caka_odobritev" && (
          <div className="b2b-info" style={{ marginTop: 16 }}>
            Registracija čaka na odobritev. Odobrimo jo praviloma v enem delovnem dnevu in te obvestimo po e-pošti. Za hitrejšo odobritev
            nas pokliči na <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a>.
          </div>
        )}
        {k.status === "zavrnjen" && (
          <div className="b2b-info" style={{ marginTop: 16 }}>B2B dostop ni odobren. Za podrobnosti nas pokliči na {site.telefon}.</div>
        )}
        {aktiven && k.ustavljena_prodaja && (
          <div className="b2b-info" style={{ marginTop: 16 }}>Spletno naročanje je trenutno ustavljeno. Pokliči nas na {site.telefon}.</div>
        )}
        {aktiven && !k.ustavljena_prodaja && (
          <div className="b2b-ok" style={{ marginTop: 16 }}>
            B2B dostop je aktiven — v programu vidiš svoje cene brez DDV. <Link href="/program" className="b2b-link">Na prodajni program →</Link>
          </div>
        )}

        <div className="b2b-mreza" style={{ marginTop: 24 }}>
          <div className="b2b-skatla">
            <h2>Podatki</h2>
            <dl className="b2b-pod">
              <dt>Podjetje</dt><dd>{k.vasco_naziv || k.podjetje}</dd>
              <dt>Naslov</dt><dd>{k.vasco_naslov ? `${k.vasco_naslov}, ${k.vasco_posta ?? ""}` : `${k.naslov ?? ""} ${k.posta ?? ""} ${k.kraj ?? ""}`}</dd>
              <dt>Davčna</dt><dd>SI{k.davcna}</dd>
              <dt>Kontakt</dt><dd>{k.ime} · {k.email} · {k.telefon}</dd>
              {mojaPoslovalnica && <><dt>Poslovalnica</dt><dd>{mojaPoslovalnica.naziv2 || mojaPoslovalnica.naziv}, {mojaPoslovalnica.naslov}</dd></>}
              <dt>Status</dt><dd>{B2B_STATUSI[k.status] ?? k.status}</dd>
              {aktiven && <><dt>Plačilo</dt><dd>Na račun{k.rok_placila ? `, rok ${k.rok_placila} dni` : ""}</dd></>}
            </dl>
            <p style={{ fontSize: 13.5, color: "var(--color-muted)", marginTop: 14 }}>
              Sprememba podatkov podjetja: pišite na {site.emailProdaja}.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
              <Link className="b b-d" href="/b2b/novo-geslo">Spremeni geslo</Link>
              <form action={odjava}><button className="b b-d" type="submit">Odjava</button></form>
            </div>
          </div>
          {prodajalne.length > 0 && !k.prodajalna && (
            <div className="b2b-skatla">
              <h2>Poslovalnice ({prodajalne.length})</h2>
              <p style={{ fontSize: 14, color: "var(--color-muted)", margin: "0 0 10px" }}>Na blagajni izbereš, kam dostavimo.</p>
              <div style={{ maxHeight: 320, overflowY: "auto", fontSize: 14 }}>
                {prodajalne.map((p) => (
                  <div key={p.sifra} style={{ padding: "6px 0", borderBottom: "1px solid #eceef0" }}>
                    <b>{p.naziv2 || p.naziv}</b><br />{p.naslov}, {p.posta}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <h2 style={{ fontSize: 18, textTransform: "uppercase", margin: "36px 0 12px" }}>Spletna naročila</h2>
        {(narocila ?? []).length === 0 ? (
          <p style={{ color: "var(--color-muted)" }}>Še ni spletnih naročil.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className="mob-kartice">
              <thead><tr><th>Številka</th><th>Datum</th><th>Naročil</th><th>Poslovalnica</th><th>Dostava</th><th>Znesek z DDV</th><th>Status</th></tr></thead>
              <tbody>
                {narocila.map((n) => (
                  <tr key={n.id}>
                    <td className="mk-gl"><b>{n.stevilka}</b></td>
                    <td data-l="Datum">{cas(n.ustvarjeno)}</td>
                    <td data-l="Naročil">{imeKupca[n.b2b_kupec_id] ?? "—"}</td>
                    <td data-l="Poslovalnica">{n.prodajalna ? imePoslovalnice[n.prodajalna] ?? n.prodajalna : "sedež"}</td>
                    <td data-l="Dostava">{n.nacin_dostave}</td>
                    <td data-l="Znesek z DDV">{eur(Number(n.skupaj))}</td>
                    <td data-l="Status">{n.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

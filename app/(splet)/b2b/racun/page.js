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
    .select("id, stevilka, ustvarjeno, neto, skupaj, status, nacin_dostave, vasco_predracun, b2b_kupec_id, prodajalna, opomba_kupca, narocilo_postavke(sifra, naziv, kolicina, enota, cena_neto, vrstica_neto)")
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

  const STATUS_BARVA = { novo: "#b26a00", potrjeno: "#1d6fb8", "v pripravi": "#1d6fb8", odposlano: "#1a7f3c", zaključeno: "#6e767e", preklicano: "#cb2026" };
  const naslovPodjetja = k.vasco_naslov ? `${k.vasco_naslov}, ${k.vasco_posta ?? ""}` : `${k.naslov ?? ""}, ${k.posta ?? ""} ${k.kraj ?? ""}`;

  return (
    <section className="sec rac-sec">
      <div className="w" style={{ maxWidth: 1300 }}>
        <div className="rac-glava">
          <div>
            <p className="izd-kat" style={{ margin: 0 }}>B2B račun</p>
            <h1 className="izd-h1" style={{ margin: "2px 0 0" }}>{k.vasco_naziv || k.podjetje}</h1>
          </div>
          <div className="rac-gumbi">
            {aktiven && <Link className="b b-r" href="/program">Na prodajni program →</Link>}
            <Link className="b b-d" href="/b2b/novo-geslo">Spremeni geslo</Link>
            <form action={odjava}><button className="b b-d" type="submit">Odjava</button></form>
          </div>
        </div>

        {potrjeno && <div className="b2b-ok" style={{ marginTop: 12 }}>E-naslov je potrjen.</div>}
        {geslo && <div className="b2b-ok" style={{ marginTop: 12 }}>Novo geslo je shranjeno.</div>}
        {k.status === "preverjanje" && (
          <div className="b2b-info" style={{ marginTop: 12 }}>Podatke podjetja preverjamo v našem sistemu. To traja nekaj minut — osveži stran. Do takrat vidiš navadne cene.</div>
        )}
        {k.status === "caka_odobritev" && (
          <div className="b2b-info" style={{ marginTop: 12 }}>
            Registracija čaka na odobritev. Odobrimo jo praviloma v enem delovnem dnevu in te obvestimo po e-pošti. Za hitrejšo odobritev pokliči{" "}
            <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a>.
          </div>
        )}
        {k.status === "zavrnjen" && <div className="b2b-info" style={{ marginTop: 12 }}>B2B dostop ni odobren. Za podrobnosti nas pokliči na {site.telefon}.</div>}
        {aktiven && k.ustavljena_prodaja && <div className="b2b-info" style={{ marginTop: 12 }}>Spletno naročanje je trenutno ustavljeno. Pokliči nas na {site.telefon}.</div>}

        <div className="rac-pod">
          <div><em>Status</em><b style={{ color: aktiven ? "#1a7f3c" : "#b26a00" }}>{aktiven ? "Aktiven" : B2B_STATUSI[k.status] ?? k.status}</b></div>
          <div><em>Davčna</em><b>SI{k.davcna}</b></div>
          <div className="rac-siroko"><em>Sedež</em><b>{naslovPodjetja}</b></div>
          <div className="rac-siroko"><em>Uporabnik</em><b>{k.ime}</b><span>{k.email}{k.telefon ? ` · ${k.telefon}` : ""}</span></div>
          <div><em>Plačilo</em><b>{aktiven ? `Na račun${k.rok_placila ? `, ${k.rok_placila} dni` : ""}` : "—"}</b></div>
          <div className="rac-siroko">
            <em>{k.prodajalna ? "Moja poslovalnica" : "Poslovalnice"}</em>
            {mojaPoslovalnica ? (
              <><b>{mojaPoslovalnica.naziv2 || mojaPoslovalnica.naziv}</b><span>{mojaPoslovalnica.naslov}, {mojaPoslovalnica.posta}</span></>
            ) : prodajalne.length ? (
              <details className="rac-pe">
                <summary><b>{prodajalne.length} poslovalnic</b> <span>— prikaži</span></summary>
                <ul>
                  {prodajalne.map((p) => (
                    <li key={p.sifra}><b>{p.naziv2 || p.naziv}</b> · {p.naslov}, {p.posta}</li>
                  ))}
                </ul>
              </details>
            ) : (
              <b>sedež</b>
            )}
          </div>
        </div>
        <p style={{ fontSize: 12.5, color: "var(--color-muted)", margin: "6px 0 0" }}>Sprememba podatkov podjetja: pišite na {site.emailProdaja}.</p>

        <div className="rac-nar-gl">
          <h2>Spletna naročila</h2>
          <span>{k.prodajalna ? "naročila vaše poslovalnice" : "vsa naročila podjetja"} · {(narocila ?? []).length}</span>
        </div>
        {(narocila ?? []).length === 0 ? (
          <p style={{ color: "var(--color-muted)" }}>Še ni spletnih naročil.</p>
        ) : (
          <div className="rac-nar">
            <div className="rac-vr rac-vr-gl">
              <span>Številka</span><span>Datum</span><span>Naročil</span><span>Poslovalnica</span><span>Dostava</span><span>Brez DDV</span><span>Z DDV</span><span>Status</span>
            </div>
            {narocila.map((n) => (
              <details key={n.id} className="rac-nd">
                <summary className="rac-vr">
                  <span data-l="Številka"><b>{n.stevilka}</b></span>
                  <span data-l="Datum">{cas(n.ustvarjeno)}</span>
                  <span data-l="Naročil">{imeKupca[n.b2b_kupec_id] ?? "—"}</span>
                  <span data-l="Poslovalnica">{n.prodajalna ? imePoslovalnice[n.prodajalna] ?? n.prodajalna : "sedež"}</span>
                  <span data-l="Dostava">{n.nacin_dostave}</span>
                  <span data-l="Brez DDV">{n.neto != null ? eur(Number(n.neto)) : "—"}</span>
                  <span data-l="Z DDV"><b>{eur(Number(n.skupaj))}</b></span>
                  <span data-l="Status">
                    <i className="rac-st" style={{ background: STATUS_BARVA[n.status] ?? "#6e767e" }}>{n.status}</i>
                  </span>
                </summary>
                <div className="rac-post">
                  <table>
                    <thead><tr><th>Šifra</th><th>Artikel</th><th>Količina</th><th>Cena brez DDV</th><th>Vrednost</th></tr></thead>
                    <tbody>
                      {(n.narocilo_postavke ?? []).map((v, i) => (
                        <tr key={i}>
                          <td>{v.sifra}</td><td>{v.naziv}</td><td>{v.kolicina} × {v.enota}</td>
                          <td>{eur(Number(v.cena_neto))}</td><td><b>{eur(Number(v.vrstica_neto))}</b></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {n.opomba_kupca && <p>Opomba: {n.opomba_kupca}</p>}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

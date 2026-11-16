import Link from "next/link";
import { redirect } from "next/navigation";
import { trenutniB2B, prodajalneKupca, B2B_STATUSI, jeAktiven, racuniVklopljeni, enotaVasco } from "@/lib/b2b";
import { odjava } from "@/lib/akcije/b2b";
import { supabaseAdmin } from "@/lib/supabase-server";
import { eur } from "@/lib/cene";
import { site } from "@/lib/site";

export const metadata = { title: "Moj B2B račun", robots: { index: false } };
export const dynamic = "force-dynamic";

const cas = (t) => (t ? new Date(t).toLocaleDateString("sl-SI", { timeZone: "Europe/Ljubljana" }) : "");
const STATUS_BARVA = { novo: "#b26a00", potrjeno: "#1d6fb8", "v pripravi": "#1d6fb8", odposlano: "#1a7f3c", zaključeno: "#6e767e", preklicano: "#cb2026" };

export default async function Racun({ searchParams }) {
  const { potrjeno, geslo, zavihek, pe } = await searchParams;
  const k = await trenutniB2B();
  if (!k) redirect("/b2b?naprej=/b2b/racun");
  const aktiven = jeAktiven(k);
  const sb = supabaseAdmin();

  // Uporabnik poslovalnice vidi samo svojo poslovalnico, uporabnik sedeža vse (in lahko filtrira).
  const filterPe = k.prodajalna || (Number(pe) || null);

  let poizvedba = sb
    .from("narocila")
    .select("id, stevilka, ustvarjeno, neto, skupaj, status, nacin_dostave, vasco_predracun, b2b_kupec_id, prodajalna, opomba_kupca, narocilo_postavke(sifra, naziv, kolicina, enota, cena_neto, vrstica_neto)")
    .order("id", { ascending: false })
    .limit(200);
  if (aktiven) {
    poizvedba = poizvedba.eq("vasco_partner", k.vasco_partner);
    if (filterPe) poizvedba = poizvedba.eq("prodajalna", filterPe);
  } else poizvedba = poizvedba.eq("b2b_kupec_id", k.id);

  const imaRacune = aktiven && (await racuniVklopljeni(k.vasco_partner));
  let rq = null;
  if (imaRacune) {
    rq = sb.from("b2b_racuni").select("leto, stevilka, prodajalna, datum, neto, znesek, odprto, postavke").eq("vasco_partner", k.vasco_partner).order("datum", { ascending: false }).order("stevilka", { ascending: false }).limit(1000);
    if (filterPe) rq = rq.eq("prodajalna", filterPe);
  }

  const [prodajalne, { data: narocila }, { data: sodelavci }, racRes] = await Promise.all([
    prodajalneKupca(k.vasco_partner),
    poizvedba,
    sb.from("b2b_kupci").select("id, ime").eq("davcna", k.davcna),
    rq ?? Promise.resolve({ data: [] }),
  ]);
  const racuni = racRes?.data ?? [];
  const imeKupca = Object.fromEntries((sodelavci ?? []).map((x) => [x.id, x.ime]));
  const mojaPoslovalnica = k.prodajalna ? prodajalne.find((p) => p.sifra === k.prodajalna) : null;
  const imePoslovalnice = Object.fromEntries(prodajalne.map((p) => [p.sifra, p.naziv2 || p.naziv]));
  const naslovPodjetja = k.vasco_naslov ? `${k.vasco_naslov}, ${k.vasco_posta ?? ""}` : `${k.naslov ?? ""}, ${k.posta ?? ""} ${k.kraj ?? ""}`;
  const tab = zavihek === "narocila" || !imaRacune ? "narocila" : zavihek === "racuni" ? "racuni" : "racuni";
  const povezava = (z, p = filterPe && !k.prodajalna ? filterPe : null) => `/b2b/racun?zavihek=${z}${p ? `&pe=${p}` : ""}`;

  const vsotaNeto = racuni.reduce((s, r) => s + Number(r.neto || 0), 0);
  const vsotaOdprto = racuni.reduce((s, r) => s + Number(r.odprto || 0), 0);
  const leto = new Date().getFullYear();

  return (
    <section className="b2bp">
      <div className="b2bp-w">
        <div className="b2bp-glava">
          <div className="b2bp-ime">
            <span>B2B račun</span>
            <h1>{k.vasco_naziv || k.podjetje}</h1>
          </div>
          <div className="b2bp-gumbi">
            {aktiven && <Link className="b2bp-g rdec" href="/program">Na prodajni program →</Link>}
            <Link className="b2bp-g" href="/b2b/novo-geslo">Spremeni geslo</Link>
            <form action={odjava}><button className="b2bp-g" type="submit">Odjava</button></form>
          </div>
        </div>

        {potrjeno && <div className="b2bp-obv ok">E-naslov je potrjen.</div>}
        {geslo && <div className="b2bp-obv ok">Novo geslo je shranjeno.</div>}
        {k.status === "preverjanje" && <div className="b2bp-obv">Podatke podjetja preverjamo v našem sistemu. To traja nekaj minut, nato osvežite stran. Do takrat vidite redne cene.</div>}
        {k.status === "caka_odobritev" && (
          <div className="b2bp-obv">
            Registracija čaka na odobritev. Ko jo odobrimo, vas obvestimo po e-pošti. Za hitrejšo odobritev pokličite <a href={`tel:${site.telefonRaw}`}>{site.telefon}</a>.
          </div>
        )}
        {k.status === "zavrnjen" && <div className="b2bp-obv">B2B dostop ni odobren. Za podrobnosti nas pokličite na {site.telefon}.</div>}
        {aktiven && k.ustavljena_prodaja && <div className="b2bp-obv">Spletno naročanje je trenutno ustavljeno. Pokličite nas na {site.telefon}.</div>}

        <div className="b2bp-pod">
          <div><em>Status</em><b style={{ color: aktiven ? "#1a7f3c" : "#b26a00" }}>{aktiven ? "Aktiven" : B2B_STATUSI[k.status] ?? k.status}</b></div>
          <div><em>Davčna</em><b>SI{k.davcna}</b></div>
          <div className="s2"><em>Sedež</em><b>{naslovPodjetja}</b></div>
          <div className="s2"><em>Uporabnik</em><b>{k.ime}</b><span>{k.email}{k.telefon ? ` · ${k.telefon}` : ""}</span></div>
          <div><em>Plačilo</em><b>{aktiven ? `Na račun${k.rok_placila ? `, ${k.rok_placila} dni` : ""}` : "—"}</b></div>
          <div className="s2">
            <em>{k.prodajalna ? "Moja poslovalnica" : "Poslovalnice"}</em>
            {mojaPoslovalnica ? (
              <><b>{mojaPoslovalnica.naziv2 || mojaPoslovalnica.naziv}</b><span>{mojaPoslovalnica.naslov}, {mojaPoslovalnica.posta}</span></>
            ) : prodajalne.length ? (
              <><b>Sedež · {prodajalne.length} poslovalnic</b><span>vidite vse poslovalnice</span></>
            ) : (
              <b>sedež</b>
            )}
          </div>
        </div>

        <div className="b2bp-zav">
          <nav>
            {imaRacune && (
              <Link href={povezava("racuni")} className={tab === "racuni" ? "on" : ""}>Računi <i>{racuni.length}</i></Link>
            )}
            <Link href={povezava("narocila")} className={tab === "narocila" ? "on" : ""}>Spletna naročila <i>{(narocila ?? []).length}</i></Link>
          </nav>
          {!k.prodajalna && prodajalne.length > 0 && aktiven && (
            <div className="b2bp-pe">
              <span>Poslovalnica:</span>
              <Link href={`/b2b/racun?zavihek=${tab}`} className={!filterPe ? "on" : ""}>Vse</Link>
              {prodajalne.map((p) => (
                <Link key={p.sifra} href={`/b2b/racun?zavihek=${tab}&pe=${p.sifra}`} className={filterPe === p.sifra ? "on" : ""}>{p.naziv2 || p.naziv}</Link>
              ))}
            </div>
          )}
        </div>

        {tab === "racuni" ? (
          <>
            <div className="b2bp-kpi">
              <div><em>Računi {leto}</em><b>{racuni.length}</b></div>
              <div><em>Skupaj brez DDV</em><b>{eur(vsotaNeto)}</b></div>
              <div className={vsotaOdprto > 0.004 ? "odprto" : ""}><em>Odprto</em><b>{eur(vsotaOdprto)}</b></div>
            </div>
            {racuni.length === 0 ? (
              <p className="b2bp-prazno">Računi se prenesejo iz našega sistema ob naslednji sinhronizaciji (največ v 20 minutah).</p>
            ) : (
              <div className="b2bp-tab">
                <div className="b2bp-vr b2bp-vr-gl rac">
                  <span>Račun</span><span>Datum</span><span>Poslovalnica</span><span className="d">Postavk</span><span className="d">Brez DDV</span><span className="d">Z DDV</span><span>Plačilo</span><span></span>
                </div>
                {racuni.map((r) => (
                  <details key={`${r.leto}-${r.stevilka}`}>
                    <summary className="b2bp-vr rac">
                      <span data-l="Račun"><b>{r.stevilka}/{r.leto}</b></span>
                      <span data-l="Datum">{cas(r.datum)}</span>
                      <span data-l="Poslovalnica">{r.prodajalna ? imePoslovalnice[r.prodajalna] ?? `PE ${r.prodajalna}` : "sedež"}</span>
                      <span data-l="Postavk" className="d">{(r.postavke ?? []).length}</span>
                      <span data-l="Brez DDV" className="d">{eur(Number(r.neto))}</span>
                      <span data-l="Z DDV" className="d"><b>{eur(Number(r.znesek))}</b></span>
                      <span data-l="Plačilo">
                        {Number(r.odprto) > 0.004 ? <i className="b2bp-st" style={{ background: "#b26a00" }}>odprto {eur(Number(r.odprto))}</i> : <i className="b2bp-st" style={{ background: "#1a7f3c" }}>plačano</i>}
                      </span>
                      <span className="d">
                        <a className="b2bp-pdf" href={`/b2b-izpis/${r.leto}/${r.stevilka}`} target="_blank" rel="noreferrer">PDF</a>
                      </span>
                    </summary>
                    <div className="b2bp-post">
                      <table>
                        <thead><tr><th>Šifra</th><th>Artikel</th><th className="d">Količina</th><th className="d">Cena brez DDV</th><th className="d">Rabat</th><th className="d">Vrednost brez DDV</th></tr></thead>
                        <tbody>
                          {(r.postavke ?? []).map((v, i) => (
                            <tr key={i}>
                              <td>{v.sifra}</td><td>{String(v.naziv || "—").replace(/\n/g, " ")}</td>
                              <td className="d">{v.kolicina} {enotaVasco(v.enota)}</td>
                              <td className="d">{eur(Number(v.cena))}</td>
                              <td className="d">{Number(v.rabat) ? `${v.rabat} %` : ""}</td>
                              <td className="d"><b>{eur(Number(v.vrednost))}</b></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </details>
                ))}
              </div>
            )}
          </>
        ) : (narocila ?? []).length === 0 ? (
          <p className="b2bp-prazno">Še ni spletnih naročil.</p>
        ) : (
          <div className="b2bp-tab">
            <div className="b2bp-vr b2bp-vr-gl nar">
              <span>Številka</span><span>Datum</span><span>Naročil</span><span>Poslovalnica</span><span>Dostava</span><span className="d">Brez DDV</span><span className="d">Z DDV</span><span>Status</span>
            </div>
            {narocila.map((n) => (
              <details key={n.id}>
                <summary className="b2bp-vr nar">
                  <span data-l="Številka"><b>{n.stevilka}</b></span>
                  <span data-l="Datum">{cas(n.ustvarjeno)}</span>
                  <span data-l="Naročil">{imeKupca[n.b2b_kupec_id] ?? "—"}</span>
                  <span data-l="Poslovalnica">{n.prodajalna ? imePoslovalnice[n.prodajalna] ?? n.prodajalna : "sedež"}</span>
                  <span data-l="Dostava">{n.nacin_dostave}</span>
                  <span data-l="Brez DDV" className="d">{n.neto != null ? eur(Number(n.neto)) : "—"}</span>
                  <span data-l="Z DDV" className="d"><b>{eur(Number(n.skupaj))}</b></span>
                  <span data-l="Status"><i className="b2bp-st" style={{ background: STATUS_BARVA[n.status] ?? "#6e767e" }}>{n.status}</i></span>
                </summary>
                <div className="b2bp-post">
                  <table>
                    <thead><tr><th>Šifra</th><th>Artikel</th><th className="d">Količina</th><th className="d">Cena brez DDV</th><th className="d">Vrednost</th></tr></thead>
                    <tbody>
                      {(n.narocilo_postavke ?? []).map((v, i) => (
                        <tr key={i}>
                          <td>{v.sifra}</td><td>{v.naziv}</td><td className="d">{v.kolicina} × {v.enota}</td>
                          <td className="d">{eur(Number(v.cena_neto))}</td><td className="d"><b>{eur(Number(v.vrstica_neto))}</b></td>
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
        <p className="b2bp-noga">Sprememba podatkov podjetja ali poslovalnice: pišite na {site.emailProdaja}.</p>
      </div>
    </section>
  );
}

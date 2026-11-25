import { supabaseAdmin } from "@/lib/supabase-server";
import { gscNastavljen, gscPodatki, gscLastnina } from "@/lib/gsc";

// Podrobna statistika pod osnovno: Google iskanje, B2B kupci po podjetjih,
// iskanje na strani, obrazci, kliki in globina branja.

const st = (n) => new Intl.NumberFormat("sl-SI").format(Math.round(Number(n) || 0));
const eur = (v) => new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(Number(v) || 0);
const odst = (a, b) => (b ? `${Math.round((a / b) * 100)} %` : "—");
const datum = (d) =>
  d ? new Date(d).toLocaleString("sl-SI", { timeZone: "Europe/Ljubljana", day: "numeric", month: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
function cas(sek) {
  const s = Math.round(Number(sek) || 0);
  if (!s) return "—";
  const m = Math.floor(s / 60);
  return m ? `${m} min ${String(s % 60).padStart(2, "0")} s` : `${s} s`;
}
// naslovi s časa, ko je bila stran zaklenjena (»v prenovi«), se ne prikažejo
const cistNaslov = (n) => (/v prenovi/i.test(n || "") ? "" : (n || "").replace(/\s*[|–-]\s*AS ?system.*$/i, "").trim());
const imeDrz = new Intl.DisplayNames(["sl"], { type: "region" });
function drzava(iso3) {
  // Search Console vrne 3-črkovne kode (svn, hrv …)
  const map = { svn: "SI", hrv: "HR", deu: "DE", aut: "AT", ita: "IT", srb: "RS", bih: "BA", usa: "US", gbr: "GB", che: "CH", hun: "HU", pol: "PL", cze: "CZ", svk: "SK", mne: "ME", mkd: "MK", fra: "FR", nld: "NL", swe: "SE", nor: "NO", dnk: "DK", fin: "FI", esp: "ES", rou: "RO", bgr: "BG", ukr: "UA", ind: "IN", chn: "CN" };
  const k = map[String(iso3).toLowerCase()];
  try {
    return k ? imeDrz.of(k) : String(iso3).toUpperCase();
  } catch {
    return iso3;
  }
}

const OBRAZCI = [
  [/^\/b2b\/registracija/, "B2B registracija"],
  [/^\/b2b\/prijava/, "B2B prijava"],
  [/^\/blagajna/, "Blagajna"],
  [/^\/bespoke/, "Bespoke (po meri)"],
  [/^\/private-label/, "Private label"],
  [/^\/proizvodnja/, "Proizvodnja"],
  [/^\/vijaki-po-narocilu/, "Vijaki po naročilu"],
  [/^\/zaposlitev/, "Prijava za delo"],
  [/^\/kontakt/, "Kontakt"],
  [/^\/za-trgovce|^\/trgovci/, "Za trgovce"],
  [/^\/distributer/, "Distributerji"],
  [/^\/program\//, "Povpraševanje za izdelek"],
];
const imeObrazca = (k) => OBRAZCI.find(([re]) => re.test(k || ""))?.[1] || k || "—";
const VRSTE_KLIKOV = { telefon: "📞 Telefon", email: "✉️ E-pošta", pdf: "📄 PDF", zunanja: "↗ Zunanja povezava" };

function Panel({ naslov, opis, siroko, children }) {
  return (
    <section className={`st-panel${siroko ? " siroko" : ""}`}>
      <header>
        <div>
          <h2>{naslov}</h2>
          {opis && <p>{opis}</p>}
        </div>
      </header>
      <div className="st-vsebina">{children}</div>
    </section>
  );
}
const Prazno = ({ besedilo = "Ni podatkov za izbrano obdobje." }) => <p className="st-prazno">{besedilo}</p>;

async function GoogleIskanje({ od, doo }) {
  if (!gscNastavljen()) {
    return (
      <Panel naslov="Google iskanje (Search Console)" opis="Katere besede ljudje vpišejo v Google, preden pridejo na stran" siroko>
        <p className="st-prazno">
          Povezava s Search Console še ni nastavljena. V Vercelu je treba dodati spremenljivki <b>GSC_SA_JSON</b> in{" "}
          <b>GSC_SITE</b> (navodila ima Claudia).
        </p>
      </Panel>
    );
  }
  let g;
  try {
    g = await gscPodatki(od, doo);
  } catch (e) {
    return (
      <Panel naslov="Google iskanje (Search Console)" siroko>
        <div className="opozorilo">
          Search Console ni dosegljiv: {e.message}. Preverite, ali je servisni račun dodan kot uporabnik lastnine{" "}
          <b>{gscLastnina()}</b>.
        </div>
      </Panel>
    );
  }
  const S = g.skupaj;
  return (
    <Panel
      naslov="Google iskanje (Search Console)"
      opis={`Kaj ljudje iščejo v Googlu in kolikokrat se prikažemo · podatki Google zamujajo 2–3 dni · ${gscLastnina()}`}
      siroko
    >
      <div className="st-kpiji st-kpiji-gsc">
        <div className="st-kpi"><span>Kliki iz Googla</span><b>{st(S.clicks)}</b></div>
        <div className="st-kpi"><span>Prikazi v iskanju</span><b>{st(S.impressions)}</b></div>
        <div className="st-kpi"><span>Delež klikov (CTR)</span><b>{(S.ctr * 100).toLocaleString("sl-SI", { maximumFractionDigits: 1 })} %</b></div>
        <div className="st-kpi"><span>Povprečno mesto</span><b>{S.position ? S.position.toLocaleString("sl-SI", { maximumFractionDigits: 1 }) : "—"}</b></div>
      </div>
      <div className="st-mreza dva">
        <div className="st-tab-ovoj">
          <h3 className="st-pod">Iskalne besede</h3>
          {g.besede.length === 0 ? <Prazno /> : (
            <table className="adm-tab st-tab">
              <thead><tr><th>Beseda</th><th className="d">Kliki</th><th className="d">Prikazi</th><th className="d">Mesto</th></tr></thead>
              <tbody>
                {g.besede.map((r) => (
                  <tr key={r.keys[0]}>
                    <td><b>{r.keys[0]}</b></td>
                    <td className="d">{st(r.clicks)}</td>
                    <td className="d">{st(r.impressions)}</td>
                    <td className="d">{r.position.toLocaleString("sl-SI", { maximumFractionDigits: 1 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="st-tab-ovoj">
          <h3 className="st-pod">Strani v Googlu</h3>
          {g.strani.length === 0 ? <Prazno /> : (
            <table className="adm-tab st-tab">
              <thead><tr><th>Stran</th><th className="d">Kliki</th><th className="d">Prikazi</th><th className="d">Mesto</th></tr></thead>
              <tbody>
                {g.strani.map((r) => {
                  let pot = r.keys[0];
                  try { const u = new URL(r.keys[0]); pot = decodeURIComponent(u.pathname + u.search); } catch {}
                  return (
                    <tr key={r.keys[0]}>
                      <td><a href={r.keys[0]} target="_blank" rel="noopener noreferrer">{pot}</a></td>
                      <td className="d">{st(r.clicks)}</td>
                      <td className="d">{st(r.impressions)}</td>
                      <td className="d">{r.position.toLocaleString("sl-SI", { maximumFractionDigits: 1 })}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
          <div className="st-mali" style={{ marginTop: 14 }}>
            <div>
              <h3>Države</h3>
              {g.drzave.map((r) => <p key={r.keys[0]}><span>{drzava(r.keys[0])}</span><b>{st(r.clicks)} / {st(r.impressions)}</b></p>)}
            </div>
            <div>
              <h3>Naprave</h3>
              {g.naprave.map((r) => (
                <p key={r.keys[0]}>
                  <span>{{ MOBILE: "Mobilni", DESKTOP: "Računalnik", TABLET: "Tablica" }[r.keys[0]] || r.keys[0]}</span>
                  <b>{st(r.clicks)} / {st(r.impressions)}</b>
                </p>
              ))}
            </div>
          </div>
          <p className="adm-namig">Pri državah in napravah: kliki / prikazi.</p>
        </div>
      </div>
    </Panel>
  );
}

export default async function Podrobno({ od, doo }) {
  const { data: D, error } = await supabaseAdmin().rpc("statistika_podrobno", { p_od: od, p_do: doo });

  return (
    <>
      <GoogleIskanje od={od} doo={doo} />

      {error || !D ? (
        <div className="opozorilo">
          Podrobna statistika (B2B kupci, iskanje, obrazci, kliki) še ni vklopljena. V Supabase SQL Editor zaženi{" "}
          <b>sql/55-statistika-podrobno.sql</b>
          {error?.message ? ` (${error.message})` : ""}.
        </div>
      ) : (
        <>
          <Panel
            naslov="B2B kupci na portalu"
            opis="Prijavljena podjetja: kdaj so bila na strani, kaj so gledala in ali so dodajala v košarico · za komercialo"
            siroko
          >
            {(D.b2b ?? []).length === 0 ? <Prazno besedilo="V tem obdobju ni bilo prijavljenih B2B kupcev." /> : (
              <div className="st-tab-ovoj">
                <table className="adm-tab st-tab">
                  <thead>
                    <tr>
                      <th>Podjetje</th><th>Zadnji obisk</th><th className="d">Dni</th><th className="d">Ogledi</th>
                      <th>Najbolj gledani izdelki</th><th className="d">V košarico</th><th className="d">Naročila</th><th>Kontakt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {D.b2b.map((x) => (
                      <tr key={x.id}>
                        <td><b>{x.podjetje || "—"}</b>{x.ime && <><br /><small>{x.ime}</small></>}</td>
                        <td>{datum(x.zadnji)}</td>
                        <td className="d">{st(x.dni)}</td>
                        <td className="d">{st(x.ogledi)}<br /><small>{cas(x.sekunde)}</small></td>
                        <td><small>{(x.top ?? []).map(cistNaslov).join(" · ") || "—"}</small></td>
                        <td className="d">{st(x.kosarica)}</td>
                        <td className="d">{x.nakupi ? <b>{st(x.nakupi)} · {eur(x.promet)}</b> : x.kosarica ? <span className="st-opozori">brez naročila</span> : "—"}</td>
                        <td><small>{x.telefon && <a href={`tel:${x.telefon}`}>{x.telefon}</a>}{x.telefon && x.email && <br />}{x.email && <a href={`mailto:${x.email}`}>{x.email}</a>}</small></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <h3 className="st-pod" style={{ marginTop: 18 }}>Odprte košarice (artikli v košarici, naročilo še ni oddano)</h3>
            {(D.kosarice ?? []).length === 0 ? <Prazno besedilo="Trenutno nihče nima artiklov v košarici." /> : (
              <table className="adm-tab st-tab">
                <thead><tr><th>Podjetje</th><th className="d">Artiklov</th><th>Zadnja sprememba</th><th>Kontakt</th></tr></thead>
                <tbody>
                  {D.kosarice.map((x) => (
                    <tr key={x.id}>
                      <td><b>{x.podjetje}</b>{x.ime && <><br /><small>{x.ime}</small></>}</td>
                      <td className="d">{st(x.artiklov)}</td>
                      <td>{datum(x.posodobljeno)}</td>
                      <td><small>{x.telefon && <a href={`tel:${x.telefon}`}>{x.telefon}</a>}{x.telefon && x.email && " · "}{x.email && <a href={`mailto:${x.email}`}>{x.email}</a>}</small></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <p className="adm-namig">Košarica se izprazni po oddanem naročilu ali po 3 dneh brez sprememb. Zaposleni (@as-system.si) niso prikazani.</p>
          </Panel>

          <div className="st-mreza dva">
            <Panel naslov="Iskanje na strani" opis="Kaj obiskovalci vpišejo v naš iskalnik">
              {(D.iskanje ?? []).length === 0 ? <Prazno /> : (
                <table className="adm-tab st-tab">
                  <thead><tr><th>Iskano</th><th className="d">Kolikokrat</th><th className="d">Zadetkov</th></tr></thead>
                  <tbody>
                    {D.iskanje.map((x) => (
                      <tr key={x.q}>
                        <td><b>{x.q}</b></td>
                        <td className="d">{st(x.n)}</td>
                        <td className="d">{Number(x.zadetki) === 0 ? <span className="st-opozori">0</span> : st(x.zadetki)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {(D.brez_zadetkov ?? []).length > 0 && (
                <p className="adm-namig">
                  <b>Iskali, a niso našli:</b> {D.brez_zadetkov.map((x) => `${x.q} (${x.n}×)`).join(", ")}. Kandidati za nove izdelke ali sopomenke.
                </p>
              )}
            </Panel>

            <Panel naslov="Obrazci" opis="Koliko jih začne izpolnjevati in koliko odda; kje najpogosteje odnehajo">
              {(D.obrazci ?? []).length === 0 ? <Prazno /> : (
                <table className="adm-tab st-tab">
                  <thead><tr><th>Obrazec</th><th className="d">Začeli</th><th className="d">Oddali</th><th>Odnehajo pri polju</th></tr></thead>
                  <tbody>
                    {D.obrazci.map((x) => (
                      <tr key={x.obrazec}>
                        <td><b>{imeObrazca(x.obrazec)}</b></td>
                        <td className="d">{st(x.zaceli)}</td>
                        <td className="d">{st(x.oddali)} <small>{odst(x.oddali, x.zaceli)}</small></td>
                        <td>{x.polje ? <>{x.polje} <small>({st(x.polje_n)}×)</small></> : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Panel>
          </div>

          <div className="st-mreza dva">
            <Panel naslov="Kliki" opis="Telefon, e-pošta, prenosi PDF in povezave na druge strani">
              {(D.kliki ?? []).length === 0 ? <Prazno /> : (
                <table className="adm-tab st-tab">
                  <thead><tr><th>Vrsta</th><th>Kam</th><th className="d">Klikov</th><th className="d">Obisk.</th></tr></thead>
                  <tbody>
                    {D.kliki.map((x) => (
                      <tr key={`${x.vrsta}|${x.cilj}`}>
                        <td>{VRSTE_KLIKOV[x.vrsta] || x.vrsta}</td>
                        <td><small>{x.vrsta === "telefon" ? `s strani ${x.cilj}` : x.cilj}</small></td>
                        <td className="d">{st(x.n)}</td>
                        <td className="d">{st(x.o)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Panel>

            <Panel naslov="Globina branja" opis="Do kod se obiskovalci pomaknejo po strani (100 % = do konca)">
              {(D.globina ?? []).length === 0 ? <Prazno besedilo="Zbiramo od danes naprej." /> : (
                <table className="adm-tab st-tab">
                  <thead><tr><th>Stran</th><th className="d">Obisk.</th><th className="d">Povp. globina</th><th className="d">Do konca</th><th className="d">Čas</th></tr></thead>
                  <tbody>
                    {D.globina.map((x) => (
                      <tr key={x.pot}>
                        <td><b>{cistNaslov(x.naslov) || x.pot}</b><br /><small>{x.pot}</small></td>
                        <td className="d">{st(x.o)}</td>
                        <td className="d">{st(x.globina)} %</td>
                        <td className="d">{st(x.do_konca)} %</td>
                        <td className="d">{cas(x.sekunde)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <p className="adm-namig">»Do konca« = delež obiskovalcev, ki so videli vsaj 75 % strani.</p>
            </Panel>
          </div>
        </>
      )}
    </>
  );
}

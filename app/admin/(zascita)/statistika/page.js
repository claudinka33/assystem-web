import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { TRGI } from "@/lib/obisk";
import UtmGenerator from "./UtmGenerator";

export const dynamic = "force-dynamic";
export const metadata = { title: "Statistika obiska" };

// ---------- pomožne ----------
const TZ = "Europe/Ljubljana";
const danes = () => new Date().toLocaleDateString("sv-SE", { timeZone: TZ });
function plus(d, n) {
  const [y, m, dd] = d.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, dd + n)).toISOString().slice(0, 10);
}
function dni(a, b) {
  const t = (d) => Date.UTC(...d.split("-").map((x, i) => (i === 1 ? Number(x) - 1 : Number(x))));
  return Math.round((t(b) - t(a)) / 864e5) + 1;
}
const jeDatum = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

const st = (n) => new Intl.NumberFormat("sl-SI").format(Math.round(Number(n) || 0));
const eur = (v) => new Intl.NumberFormat("sl-SI", { style: "currency", currency: "EUR" }).format(Number(v) || 0);
const odst = (a, b) => (b ? `${(Math.round((a / b) * 1000) / 10).toLocaleString("sl-SI")} %` : "—");
function cas(sek) {
  const s = Math.round(Number(sek) || 0);
  if (!s) return "—";
  const m = Math.floor(s / 60);
  return m ? `${m} min ${String(s % 60).padStart(2, "0")} s` : `${s} s`;
}
const kratekDatum = (d) => {
  const [, m, dd] = d.split("-");
  return `${Number(dd)}. ${Number(m)}.`;
};

const imeDrz = new Intl.DisplayNames(["sl"], { type: "region" });
const imeJez = new Intl.DisplayNames(["sl"], { type: "language" });
function drzava(iso) {
  if (!iso || iso === "??") return "Neznano";
  try {
    return imeDrz.of(iso);
  } catch {
    return iso;
  }
}
function zastava(iso) {
  if (!iso || iso.length !== 2 || iso === "??") return "🌐";
  return String.fromCodePoint(...[...iso.toUpperCase()].map((c) => 127397 + c.charCodeAt(0)));
}
function jezik(k) {
  if (!k || k === "??") return "Neznano";
  try {
    return imeJez.of(k);
  } catch {
    return k;
  }
}
const cistNaslov = (n) => (n || "").replace(/\s*[|–-]\s*AS ?system.*$/i, "").trim();

const DOGODKI = {
  povprasevanje_poslano: "Povpraševanje poslano",
  add_to_cart: "Dodano v košarico",
  begin_checkout: "Začel blagajno",
  purchase: "Nakup",
  b2b_registracija: "B2B registracija",
  prijava_novice: "Prijava na e-novice",
  prijava_zaposlitev: "Prijava za delo",
  katalog_prenos: "Prenos PDF (katalog, letak, ETA/DoP)",
  klik_email: "Klik na e-pošto",
  klik_telefon: "Klik na telefon",
};
const imeDogodka = (k) => DOGODKI[k] || (k.startsWith("igra_") ? `Igra: ${k.replace(/^igra_|_koncana$/g, "").replace(/_/g, " ")} (končana)` : k);

const OBDOBJA = [
  ["danes", "Danes"],
  ["vceraj", "Včeraj"],
  ["7", "7 dni"],
  ["30", "30 dni"],
  ["90", "90 dni"],
  ["365", "12 mesecev"],
];

// ---------- gradniki ----------
function Sprememba({ zdaj, prej, obratno }) {
  if (prej == null || !Number.isFinite(prej)) return null;
  if (!prej && !zdaj) return <small className="st-d">—</small>;
  if (!prej) return <small className="st-d gor">novo</small>;
  const r = ((zdaj - prej) / prej) * 100;
  const dobro = obratno ? r < 0 : r > 0;
  return (
    <small className={`st-d ${Math.abs(r) < 0.5 ? "" : dobro ? "gor" : "dol"}`}>
      {r > 0 ? "▲" : r < 0 ? "▼" : "■"} {Math.abs(Math.round(r)).toLocaleString("sl-SI")} %
    </small>
  );
}

function Kartica({ naslov, vrednost, pod, zdaj, prej, obratno, vroca }) {
  return (
    <div className={`st-kpi${vroca ? " vroca" : ""}`}>
      <span>{naslov}</span>
      <b>{vrednost}</b>
      <div className="st-kpi-pod">
        {pod && <em>{pod}</em>}
        <Sprememba zdaj={zdaj} prej={prej} obratno={obratno} />
      </div>
    </div>
  );
}

function Delez({ v, max }) {
  const p = max ? Math.max(2, (v / max) * 100) : 0;
  return (
    <span className="st-delez">
      <i style={{ width: `${p}%` }} />
    </span>
  );
}

function Panel({ naslov, opis, desno, children, siroko }) {
  return (
    <section className={`st-panel${siroko ? " siroko" : ""}`}>
      <header>
        <div>
          <h2>{naslov}</h2>
          {opis && <p>{opis}</p>}
        </div>
        {desno}
      </header>
      {children}
    </section>
  );
}

const Prazno = () => <p className="st-prazno">Ni podatkov za izbrano obdobje.</p>;

// ---------- stran ----------
export default async function Statistika({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const t = danes();

  let od, doo, obdobje = sp.obdobje || "30";
  if (jeDatum(sp.od) && jeDatum(sp.do) && sp.od <= sp.do) {
    od = sp.od;
    doo = sp.do;
    obdobje = "po-meri";
  } else if (obdobje === "danes") od = doo = t;
  else if (obdobje === "vceraj") od = doo = plus(t, -1);
  else {
    const n = [7, 30, 90, 365].includes(Number(obdobje)) ? Number(obdobje) : 30;
    obdobje = String(n);
    doo = t;
    od = plus(t, -(n - 1));
  }
  const dolzina = dni(od, doo);
  const prejOd = plus(od, -dolzina);
  const prejDo = plus(od, -1);

  const filtri = {
    drzava: sp.drzava && /^[A-Z?]{2}$/.test(sp.drzava) ? sp.drzava : null,
    trg: sp.trg || null,
    kanal: sp.kanal || null,
    kampanja: sp.kampanja || null,
  };

  // povezava, ki ohrani obdobje in filtre, spremeni le podano
  const osnova = { obdobje: obdobje === "po-meri" ? null : obdobje, od: obdobje === "po-meri" ? od : null, do: obdobje === "po-meri" ? doo : null, ...filtri };
  const url = (spremembe = {}) => {
    const p = new URLSearchParams();
    Object.entries({ ...osnova, ...spremembe }).forEach(([k, v]) => v && p.set(k, v));
    const s = p.toString();
    return `/admin/statistika${s ? `?${s}` : ""}`;
  };

  const arg = (a, b) => ({
    p_od: a,
    p_do: b,
    p_drzava: filtri.drzava,
    p_trg: filtri.trg,
    p_kanal: filtri.kanal,
    p_kampanja: filtri.kampanja,
  });
  const sb = supabaseAdmin();
  const [{ data, error }, { data: prej }] = await Promise.all([
    sb.rpc("statistika_obiska", arg(od, doo)),
    sb.rpc("statistika_obiska", arg(prejOd, prejDo)),
  ]);

  const glava = (
    <div className="adm-glava">
      <div>
        <div className="adm-nad">Analitika</div>
        <h1>Statistika obiska</h1>
        <p className="st-podnaslov">
          Vsi obiskovalci iz celega sveta, tudi tisti, ki zavrnejo piškotke · anonimno, brez piškotkov
          {data?.zdaj != null && (
            <>
              {" · "}
              <span className="st-zivo" /> {st(data.zdaj)} na strani zadnjih 30 min
            </>
          )}
        </p>
      </div>
      <div className="st-obdobja">
        {OBDOBJA.map(([k, n]) => (
          <Link key={k} href={url({ obdobje: k, od: null, do: null })} className={obdobje === k ? "on" : ""}>
            {n}
          </Link>
        ))}
      </div>
    </div>
  );

  if (error || !data) {
    return (
      <>
        {glava}
        <div className="adm-telo">
          <div className="opozorilo">
            Statistika še ni pripravljena. V Supabase SQL Editor zaženi <b>sql/46-statistika-obiska.sql</b>
            {error?.message ? ` (${error.message})` : ""}.
          </div>
        </div>
      </>
    );
  }

  const P = data.povzetek;
  const Q = prej?.povzetek ?? null;
  const strani = (x) => (x?.obiskovalci ? x.ogledi / x.obiskovalci : 0);
  const povpCas = (x) => (x?.obiskovalci ? x.sekunde / x.obiskovalci : 0);
  const odboj = (x) => (x?.obiskovalci ? (x.odbiti / x.obiskovalci) * 100 : 0);

  // dnevi: zapolni manjkajoče dneve z 0
  const poDnevih = new Map((data.dnevi ?? []).map((d) => [d.d, d]));
  const dnevi = [];
  for (let i = 0; i < dolzina; i++) {
    const d = plus(od, i);
    dnevi.push(poDnevih.get(d) ?? { d, o: 0, g: 0 });
  }
  const maxDan = Math.max(1, ...dnevi.map((d) => d.o));
  const ure = Array.from({ length: 24 }, (_, h) => (data.ure ?? []).find((u) => u.h === h)?.o ?? 0);
  const maxUra = Math.max(1, ...ure);

  const trgi = [...(data.trgi ?? [])].sort((a, b) => {
    const ia = TRGI.findIndex((x) => x.ime === a.k);
    const ib = TRGI.findIndex((x) => x.ime === b.k);
    return b.o - a.o || ia - ib;
  });
  const maxTrg = Math.max(1, ...trgi.map((x) => x.o));
  const drzave = data.drzave ?? [];
  const maxDrz = Math.max(1, ...drzave.map((x) => x.o));
  const kanali = data.kanali ?? [];
  const maxKan = Math.max(1, ...kanali.map((x) => x.o));
  const naprave = data.naprave ?? [];

  const lijak = [
    ["Obiskali stran", P.obiskovalci],
    ["Pogledali izdelek", P.izdelek],
    ["Dodali v košarico", P.kosarica],
    ["Začeli nakup (blagajna)", P.blagajna],
    ["Kupili", P.nakupi],
  ];

  const aktivni = [
    filtri.trg && ["trg", `Trg: ${filtri.trg}`],
    filtri.drzava && ["drzava", `${zastava(filtri.drzava)} ${drzava(filtri.drzava)}`],
    filtri.kanal && ["kanal", `Kanal: ${filtri.kanal}`],
    filtri.kampanja && ["kampanja", `Kampanja: ${filtri.kampanja}`],
  ].filter(Boolean);

  return (
    <>
      {glava}
      <div className="adm-telo st">
        {/* filtri */}
        <div className="st-filtri">
          <form action="/admin/statistika" className="st-meri">
            <label>
              Od <input type="date" name="od" defaultValue={od} max={t} />
            </label>
            <label>
              do <input type="date" name="do" defaultValue={doo} max={t} />
            </label>
            {Object.entries(filtri).map(([k, v]) => v && <input key={k} type="hidden" name={k} value={v} />)}
            <button className="gumb siv mini" type="submit">Prikaži</button>
          </form>
          <span className="st-primerjava">
            Primerjava s prejšnjim obdobjem: {kratekDatum(prejOd)} – {kratekDatum(prejDo)} {prejDo.slice(0, 4)}
          </span>
          {aktivni.length > 0 && (
            <div className="st-cipi">
              {aktivni.map(([k, n]) => (
                <Link key={k} href={url({ [k]: null })} className="st-cip">
                  {n} <b>×</b>
                </Link>
              ))}
              {aktivni.length > 1 && (
                <Link href={url({ trg: null, drzava: null, kanal: null, kampanja: null })} className="st-cip pocisti">
                  Počisti vse
                </Link>
              )}
            </div>
          )}
        </div>

        {/* KPI */}
        <div className="st-kpiji">
          <Kartica naslov="Obiskovalci" vrednost={st(P.obiskovalci)} pod={`${st(P.ogledi)} ogledov strani`} zdaj={P.obiskovalci} prej={Q?.obiskovalci} />
          <Kartica naslov="Strani na obisk" vrednost={strani(P).toLocaleString("sl-SI", { maximumFractionDigits: 1 })} pod={`odbojnost ${Math.round(odboj(P))} %`} zdaj={strani(P)} prej={Q ? strani(Q) : null} />
          <Kartica naslov="Povprečen čas obiska" vrednost={cas(povpCas(P))} pod="aktivno na strani" zdaj={povpCas(P)} prej={Q ? povpCas(Q) : null} />
          <Kartica naslov="Povpraševanja" vrednost={st(P.povprasevanja)} pod={`${odst(P.povprasevanja, P.obiskovalci)} obiskovalcev`} zdaj={P.povprasevanja} prej={Q?.povprasevanja} vroca={P.povprasevanja > 0} />
          <Kartica naslov="Vse konverzije" vrednost={st(P.konverzije)} pod={`konverzija ${odst(P.konverzije, P.obiskovalci)}`} zdaj={P.konverzije} prej={Q?.konverzije} />
          <Kartica naslov="Nakupi (trgovina)" vrednost={st(P.nakupi)} pod={`${st(P.kosarica)} jih je dodalo v košarico`} zdaj={P.nakupi} prej={Q?.nakupi} />
          <Kartica naslov="Promet iz obiskov" vrednost={eur(P.promet)} pod={`${eur(P.obiskovalci ? P.promet / P.obiskovalci : 0)} na obiskovalca`} zdaj={P.promet} prej={Q?.promet} />
          <Kartica naslov="Trgi / države" vrednost={`${trgi.filter((x) => x.k !== "Neznano").length} / ${drzave.filter((x) => x.k !== "??").length}`} pod="od kod so obiskovalci" />
        </div>

        {/* po dnevih */}
        <Panel naslov="Obiskovalci po dnevih" opis={`${kratekDatum(od)} – ${kratekDatum(doo)} ${doo.slice(0, 4)}`} siroko>
          <div className="st-graf" style={{ "--n": dnevi.length }}>
            {dnevi.map((d) => (
              <div key={d.d} className="st-stolpec" title={`${kratekDatum(d.d)}: ${d.o} obiskovalcev, ${d.g} ogledov`}>
                <i style={{ height: `${(d.o / maxDan) * 100}%` }}>{dnevi.length <= 31 && d.o > 0 && <em>{d.o}</em>}</i>
                <span>{dnevi.length <= 31 || d.d.endsWith("-01") || d.d === od ? kratekDatum(d.d) : ""}</span>
              </div>
            ))}
          </div>
        </Panel>

        {/* trgi + lijak */}
        <div className="st-mreza">
          <Panel naslov="Trgi" opis="Po strategiji: SLO in HR lastni komercialisti, ostalo prek distributerjev. Klik = filter.">
            {trgi.length === 0 ? <Prazno /> : (
              <table className="adm-tab st-tab">
                <thead>
                  <tr><th>Trg</th><th className="d">Obisk.</th><th>Delež</th><th className="d">Povpr.</th><th className="d">Konv.</th><th className="d">Promet</th></tr>
                </thead>
                <tbody>
                  {trgi.map((x) => (
                    <tr key={x.k} className={filtri.trg === x.k ? "on" : ""}>
                      <td><Link href={url({ trg: filtri.trg === x.k ? null : x.k, drzava: null })}><b>{x.k}</b></Link></td>
                      <td className="d">{st(x.o)}</td>
                      <td><Delez v={x.o} max={maxTrg} /> <small>{odst(x.o, P.obiskovalci)}</small></td>
                      <td className="d">{x.p || "—"}</td>
                      <td className="d">{x.c ? <>{x.c} <small>{odst(x.c, x.o)}</small></> : "—"}</td>
                      <td className="d">{Number(x.e) ? eur(x.e) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          <Panel naslov="Pot do nakupa" opis="Koliko obiskovalcev pride do katerega koraka">
            <div className="st-lijak">
              {lijak.map(([n, v], i) => (
                <div key={n}>
                  <div className="st-lijak-vrsta">
                    <b>{n}</b>
                    <span>
                      <b>{st(v)}</b>
                      {i > 0 && ` · ${odst(v, lijak[i - 1][1])} od prejšnjega`}
                    </span>
                  </div>
                  <Delez v={v} max={P.obiskovalci} />
                </div>
              ))}
            </div>
            <div className="st-lijak-b2b">
              <div><b>{st(P.povprasevanja)}</b><span>povpraševanj</span></div>
              <div><b>{st((data.dogodki ?? []).find((d) => d.k === "b2b_registracija")?.o ?? 0)}</b><span>B2B registracij</span></div>
              <div><b>{st((data.dogodki ?? []).find((d) => d.k === "katalog_prenos")?.o ?? 0)}</b><span>prenosov PDF</span></div>
            </div>
          </Panel>
        </div>

        {/* države */}
        <Panel naslov="Države" opis="Lokacija po IP naslovu (Vercel). Klik na državo = filter za vso stran." siroko>
          {drzave.length === 0 ? <Prazno /> : (
            <div className="st-drsno">
              <table className="adm-tab st-tab">
                <thead>
                  <tr><th>Država</th><th>Trg</th><th className="d">Obiskovalci</th><th>Delež</th><th className="d">Ogledi</th><th className="d">Povpr. čas</th><th className="d">Povpraš.</th><th className="d">Konverzije</th><th className="d">Nakupi</th><th className="d">Promet</th></tr>
                </thead>
                <tbody>
                  {drzave.map((x) => (
                    <tr key={x.k} className={filtri.drzava === x.k ? "on" : ""}>
                      <td><Link href={url({ drzava: filtri.drzava === x.k ? null : x.k })}><span className="st-zastava">{zastava(x.k)}</span> <b>{drzava(x.k)}</b></Link></td>
                      <td><small>{x.trg || "—"}</small></td>
                      <td className="d">{st(x.o)}</td>
                      <td><Delez v={x.o} max={maxDrz} /> <small>{odst(x.o, P.obiskovalci)}</small></td>
                      <td className="d">{st(x.g)}</td>
                      <td className="d">{cas(x.s)}</td>
                      <td className="d">{x.p || "—"}</td>
                      <td className="d">{x.c ? <>{x.c} <small>{odst(x.c, x.o)}</small></> : "—"}</td>
                      <td className="d">{x.n || "—"}</td>
                      <td className="d">{Number(x.e) ? eur(x.e) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        {/* kanali + mesta */}
        <div className="st-mreza">
          <Panel naslov="Kanali" opis="Od kod pridejo (prvi zunanji vir obiska). Klik = filter.">
            {kanali.length === 0 ? <Prazno /> : (
              <table className="adm-tab st-tab">
                <thead><tr><th>Kanal</th><th className="d">Obisk.</th><th>Delež</th><th className="d">Konv.</th><th className="d">Promet</th></tr></thead>
                <tbody>
                  {kanali.map((x) => (
                    <tr key={x.k} className={filtri.kanal === x.k ? "on" : ""}>
                      <td><Link href={url({ kanal: filtri.kanal === x.k ? null : x.k })}><b>{x.k}</b></Link></td>
                      <td className="d">{st(x.o)}</td>
                      <td><Delez v={x.o} max={maxKan} /> <small>{odst(x.o, P.obiskovalci)}</small></td>
                      <td className="d">{x.c ? <>{x.c} <small>{odst(x.c, x.o)}</small></> : "—"}</td>
                      <td className="d">{Number(x.e) ? eur(x.e) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>

          <Panel naslov={filtri.drzava ? `Mesta — ${drzava(filtri.drzava)}` : "Mesta"} opis="Največ obiskovalcev">
            {(data.mesta ?? []).length === 0 ? <Prazno /> : (
              <div className="st-drsno kratko">
                <table className="adm-tab st-tab">
                  <thead><tr><th>Mesto</th><th className="d">Obisk.</th><th className="d">Konv.</th></tr></thead>
                  <tbody>
                    {data.mesta.map((x) => (
                      <tr key={x.d + x.k}>
                        <td><span className="st-zastava">{zastava(x.d)}</span> {x.k}</td>
                        <td className="d">{st(x.o)}</td>
                        <td className="d">{x.c || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        {/* viri */}
        <Panel naslov="Viri" opis="»Direktno« = vpisan naslov, zaznamek ali aplikacija brez povezave (tudi Outlook)." siroko>
          {(data.viri ?? []).length === 0 ? <Prazno /> : (
            <table className="adm-tab st-tab">
              <thead><tr><th>Vir</th><th>Kanal</th><th className="d">Obiskovalci</th><th className="d">Ogledi</th><th className="d">Povpraš.</th><th className="d">Konverzije</th><th className="d">Nakupi</th><th className="d">Promet</th></tr></thead>
              <tbody>
                {data.viri.map((x) => (
                  <tr key={x.k}>
                    <td><b>{x.k}</b></td>
                    <td><small>{x.kanal}</small></td>
                    <td className="d">{st(x.o)}</td>
                    <td className="d">{st(x.g)}</td>
                    <td className="d">{x.p || "—"}</td>
                    <td className="d">{x.c ? <>{x.c} <small>{odst(x.c, x.o)}</small></> : "—"}</td>
                    <td className="d">{x.n || "—"}</td>
                    <td className="d">{Number(x.e) ? eur(x.e) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>

        {/* kampanje */}
        <Panel
          naslov="Kampanje (utm_campaign)"
          opis="Vsaka kampanja s svojo povezavo — generator je spodaj. Klik = filter, da vidiš vse za to kampanjo."
          siroko
        >
          {(data.kampanje ?? []).length === 0 ? (
            <p className="st-prazno">Ni še obiskov s kampanjskimi povezavami. Za vsako kampanjo/regijo naredi povezavo z generatorjem spodaj.</p>
          ) : (
            <table className="adm-tab st-tab">
              <thead><tr><th>Kampanja</th><th>Vir / medij</th><th>Države</th><th className="d">Obisk.</th><th className="d">Ogledi</th><th className="d">Povpraš.</th><th className="d">Konverzije</th><th className="d">Promet</th></tr></thead>
              <tbody>
                {data.kampanje.map((x) => (
                  <tr key={x.k} className={filtri.kampanja === x.k ? "on" : ""}>
                    <td><Link href={url({ kampanja: filtri.kampanja === x.k ? null : x.k })}><b>{x.k}</b></Link></td>
                    <td><small>{x.vir}</small></td>
                    <td><small>{(x.drzave || "").split(", ").map((d) => { const [iso, n] = d.split(" "); return `${zastava(iso)} ${n}`; }).join("  ")}</small></td>
                    <td className="d">{st(x.o)}</td>
                    <td className="d">{st(x.g)}</td>
                    <td className="d">{x.p || "—"}</td>
                    <td className="d">{x.c ? <>{x.c} <small>{odst(x.c, x.o)}</small></> : "—"}</td>
                    <td className="d">{Number(x.e) ? eur(x.e) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <UtmGenerator />
        </Panel>

        {/* izdelki + vstopne */}
        <div className="st-mreza">
          <Panel naslov="Najbolj gledani izdelki">
            {(data.izdelki ?? []).length === 0 ? <Prazno /> : (
              <div className="st-drsno">
                <table className="adm-tab st-tab">
                  <thead><tr><th>Izdelek</th><th className="d">Ogledi</th><th className="d">Obisk.</th><th className="d">Košarica</th><th className="d">Držav</th></tr></thead>
                  <tbody>
                    {data.izdelki.map((x) => (
                      <tr key={x.k}>
                        <td>
                          <a href={x.k} target="_blank" rel="noreferrer"><b>{cistNaslov(x.naslov) || x.k.split("/").pop()}</b></a>
                          <small className="st-pot">{x.k}</small>
                        </td>
                        <td className="d">{st(x.g)}</td>
                        <td className="d">{st(x.o)}</td>
                        <td className="d">{x.a ? <>{x.a} <small>{odst(x.a, x.o)}</small></> : "—"}</td>
                        <td className="d">{x.dr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel naslov="Vstopne strani" opis="Kje obiskovalci pristanejo (pomembno za oglase)">
            {(data.vstopne ?? []).length === 0 ? <Prazno /> : (
              <div className="st-drsno">
                <table className="adm-tab st-tab">
                  <thead><tr><th>Stran</th><th className="d">Vstopi</th><th className="d">Odboj</th><th className="d">Konv.</th></tr></thead>
                  <tbody>
                    {data.vstopne.map((x) => (
                      <tr key={x.k}>
                        <td><a href={x.k} target="_blank" rel="noreferrer">{x.k}</a></td>
                        <td className="d">{st(x.o)}</td>
                        <td className="d">{odst(x.b, x.o)}</td>
                        <td className="d">{x.c || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>
        </div>

        {/* strani + dogodki */}
        <div className="st-mreza">
          <Panel naslov="Najbolj obiskane strani">
            {(data.strani ?? []).length === 0 ? <Prazno /> : (
              <div className="st-drsno">
                <table className="adm-tab st-tab">
                  <thead><tr><th>Stran</th><th className="d">Ogledi</th><th className="d">Obisk.</th><th className="d">Povpr. čas</th></tr></thead>
                  <tbody>
                    {data.strani.map((x) => (
                      <tr key={x.k}>
                        <td><a href={x.k} target="_blank" rel="noreferrer">{x.k}</a></td>
                        <td className="d">{st(x.g)}</td>
                        <td className="d">{st(x.o)}</td>
                        <td className="d">{cas(x.g ? x.s / x.g : 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Panel>

          <Panel naslov="Dejanja obiskovalcev" opis="Povpraševanja, košarica, prenosi, kliki na kontakt …">
            {(data.dogodki ?? []).length === 0 ? <Prazno /> : (
              <table className="adm-tab st-tab">
                <thead><tr><th>Dejanje</th><th className="d">Kolikokrat</th><th className="d">Obisk.</th><th className="d">Vrednost</th></tr></thead>
                <tbody>
                  {data.dogodki.map((x) => (
                    <tr key={x.k}>
                      <td><b>{imeDogodka(x.k)}</b></td>
                      <td className="d">{st(x.n)}</td>
                      <td className="d">{st(x.o)}</td>
                      <td className="d">{Number(x.e) ? eur(x.e) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Panel>
        </div>

        {/* naprave, ura, jeziki */}
        <div className="st-mreza tri">
          <Panel naslov="Naprave">
            <div className="st-seznam">
              {naprave.map((x) => (
                <div key={x.k}>
                  <div className="st-lijak-vrsta"><b>{x.k === "Mobilni" ? "📱" : x.k === "Tablica" ? "📲" : "💻"} {x.k}</b><span>{st(x.o)} · {odst(x.o, P.obiskovalci)}</span></div>
                  <Delez v={x.o} max={P.obiskovalci} />
                </div>
              ))}
              {naprave.length === 0 && <Prazno />}
            </div>
            <div className="st-mali">
              <div>
                <h3>Brskalniki</h3>
                {(data.brskalniki ?? []).map((x) => <p key={x.k}><span>{x.k}</span><b>{st(x.o)}</b></p>)}
              </div>
              <div>
                <h3>Sistemi</h3>
                {(data.os ?? []).map((x) => <p key={x.k}><span>{x.k}</span><b>{st(x.o)}</b></p>)}
              </div>
            </div>
          </Panel>

          <Panel naslov="Ura obiska" opis="Po slovenskem času — kdaj objavljati in zagnati oglase">
            <div className="st-ure">
              {ure.map((v, h) => (
                <div key={h} title={`${h}:00 – ${h}:59: ${v} obiskovalcev`}>
                  <i style={{ height: `${(v / maxUra) * 100}%` }} />
                  <span>{h % 3 === 0 ? h : ""}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel naslov="Jezik brskalnika" opis="V katerem jeziku jim prevesti stran">
            <div className="st-mali en">
              <div>
                {(data.jeziki ?? []).map((x) => (
                  <p key={x.k}><span>{jezik(x.k)}</span><b>{st(x.o)} <small>{odst(x.o, P.obiskovalci)}</small></b></p>
                ))}
                {(data.jeziki ?? []).length === 0 && <Prazno />}
              </div>
            </div>
          </Panel>
        </div>

        <p className="adm-namig">
          Obiskovalec = anonimen dnevni odtis (brez piškotkov, IP se ne shrani), zato se isti človek v več dneh šteje večkrat.
          Obiski z naprav, s katerih ste prijavljeni v administracijo, in roboti se ne štejejo.
        </p>
      </div>
    </>
  );
}

import { notFound, redirect } from "next/navigation";
import { trenutniAdmin } from "@/lib/supabase-server";
import { podatkiPorocila, casSl, odstotek, imePovezave } from "@/lib/enovice-porocilo";
import NatisniGumb from "./NatisniGumb";

// Poročilo e-novic za tisk / PDF (brez admin menija). Odpre se v novem zavihku,
// gumb »Shrani kot PDF« odpre tiskanje brskalnika.
export const dynamic = "force-dynamic";
export const metadata = { title: "Poročilo e-novic", robots: { index: false, follow: false } };

const R = "#CB2026";
const A = "#3F4140";
const S = "#6B6F75";

function Kpi({ ime, vrednost, pod, rdeca }) {
  return (
    <div className="kpi">
      <div className="kpi-ime">{ime}</div>
      <div className="kpi-v" style={{ color: rdeca ? R : A }}>{vrednost}</div>
      {pod && <div className="kpi-pod">{pod}</div>}
    </div>
  );
}

function Vrstica({ ime, n, od, barva }) {
  const p = odstotek(n, od);
  return (
    <div className="lijak">
      <div className="lijak-ime">{ime}</div>
      <div className="lijak-trak">
        <div style={{ width: `${Math.max(p, 1)}%`, background: barva }} />
      </div>
      <div className="lijak-st">
        <b>{n}</b> · {p} %
      </div>
    </div>
  );
}

export default async function PorociloENovic({ params }) {
  if (!(await trenutniAdmin())) redirect("/admin/prijava");
  const { id } = await params;
  const p = await podatkiPorocila(id);
  if (!p) notFound();
  const { k, povzetek: s, prave, prejemniki } = p;

  const zaKlic = prejemniki.filter((x) => ["zanimanje", "vec-odprtij"].includes(x.ocena.oznaka));
  const odbiti = prejemniki.filter((x) => x.odbit);
  const neodprli = Math.max(0, s.dostavljeno - s.odprli - s.odjave);

  return (
    <div className="por">
      <style>{CSS}</style>
      <div className="orodja">
        <NatisniGumb />
        <a href={`/admin/e-novice/${k.id}/izvoz`} className="g siv">
          Prenesi Excel
        </a>
        <a href={`/admin/e-novice/${k.id}`} className="g siv">
          ← Nazaj
        </a>
      </div>

      <div className="list">
        <header className="glava">
          <img src="/logo-as-system.png" alt="AS system" className="logo" />
          <div className="glava-d">
            <div className="kicker">Poročilo e-novic</div>
            <div className="datum">Stanje: {casSl(k.statistika_ob) || "–"}</div>
          </div>
        </header>
        <div className="crta" />

        <h1>{k.zadeva}</h1>
        <div className="meta">
          <span>
            <b>Komu:</b> {k.segment_ime || "–"}
          </span>
          <span>
            <b>Poslano:</b> {casSl(k.poslano_ob) || "–"}
          </span>
          {k.naziv && (
            <span>
              <b>Kampanja:</b> {k.naziv}
            </span>
          )}
        </div>

        <section>
          <h2>
            <i>01</i> Rezultat
          </h2>
          <div className="kpiji">
            <Kpi ime="Dostavljeno" vrednost={s.dostavljeno} pod={`od ${s.prejemniki} poslanih`} />
            <Kpi ime="Odprli" vrednost={`${odstotek(s.odprli, s.dostavljeno)} %`} pod={`${s.odprli} prejemnikov`} rdeca />
            <Kpi ime="Kliknili" vrednost={`${odstotek(s.kliknili, s.dostavljeno)} %`} pod={`${s.kliknili} prejemnikov`} rdeca />
            <Kpi ime="Odbiti" vrednost={s.odbiti} pod="naslov ne obstaja" />
            <Kpi ime="Odjave" vrednost={s.odjave} pod={s.pritozbe ? `${s.pritozbe} × spam` : "brez pritožb"} />
          </div>
          <div className="lijaki">
            <Vrstica ime="Dostavljeno" n={s.dostavljeno} od={s.prejemniki} barva={A} />
            <Vrstica ime="Odprli" n={s.odprli} od={s.dostavljeno} barva={R} />
            <Vrstica ime="Kliknili" n={s.kliknili} od={s.dostavljeno} barva={R} />
            <Vrstica ime="Niso odprli" n={neodprli} od={s.dostavljeno} barva="#C6CACE" />
          </div>
        </section>

        <section>
          <h2>
            <i>02</i> Zanimanje
          </h2>
          <div className="kpiji tri">
            <Kpi ime="Kliknili – verjetno pravo zanimanje" vrednost={s.zanimanje} rdeca />
            <Kpi ime="Odprli večkrat" vrednost={s.vecOdprtij} />
            <Kpi ime="Možni varnostni filtri" vrednost={s.filtri} pod="niso šteti kot zanimanje" />
          </div>
          {prave.length > 0 && (
            <table className="tab">
              <thead>
                <tr>
                  <th>Povezava</th>
                  <th className="d">Kliki</th>
                  <th className="d">Različnih oseb</th>
                </tr>
              </thead>
              <tbody>
                {prave.map((l) => (
                  <tr key={l.url}>
                    <td>{imePovezave(l.url)}</td>
                    <td className="d">{l.kliki}</td>
                    <td className="d">{l.unikatni}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="lomi">
          <h2>
            <i>03</i> Za klic prodaje <small>{zaKlic.length} kontaktov</small>
          </h2>
          {zaKlic.length === 0 ? (
            <p className="siv-t">Ni kontaktov s kliki ali večkratnimi odprtji.</p>
          ) : (
            <table className="tab">
              <thead>
                <tr>
                  <th>E-naslov</th>
                  <th>Podjetje (domena)</th>
                  <th>Zakaj</th>
                  <th className="d">Odprtja</th>
                  <th className="d">Kliki</th>
                </tr>
              </thead>
              <tbody>
                {zaKlic.map((x) => (
                  <tr key={x.email}>
                    <td>{x.email}</td>
                    <td>{x.podjetje}</td>
                    <td>{x.ocena.opis}</td>
                    <td className="d">{x.odprl || 0}</td>
                    <td className="d">{x.kliknil || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {odbiti.length > 0 && (
          <section>
            <h2>
              <i>04</i> Odbiti naslovi <small>za čiščenje seznama</small>
            </h2>
            <p className="siv-t" style={{ columnCount: 2 }}>
              {odbiti.map((x) => (
                <span key={x.email} style={{ display: "block" }}>
                  {x.email}
                </span>
              ))}
            </p>
          </section>
        )}

        <section className="opombe">
          <b>Kako brati številke</b>
          <ul>
            <li>Odprtja so približna – nekateri programi (Apple Mail, poslovni filtri) mail odprejo sami.</li>
            <li>
              Kliki na gumb »Send an inquiry« (odpre e-pošto) se ne štejejo. Prava povpraševanja so v nabiralniku prodaje.
            </li>
            <li>»Možen varnostni filter« = klik na vse povezave ali na odjavo brez odjave – najverjetneje ni človek.</li>
          </ul>
        </section>

        <footer className="noga">
          AS system d.o.o. · Šmarje pri Jelšah · www.as-system.si · Poročilo pripravljeno {casSl(new Date())}
        </footer>
      </div>
    </div>
  );
}

const CSS = `
  @page { size: A4; margin: 12mm; }
  body { margin: 0; background: #E9EBEE; font-family: var(--font-poppins), Arial, sans-serif; color: ${A}; }
  .por { padding: 24px 12px 60px; }
  .orodja { max-width: 794px; margin: 0 auto 14px; display: flex; gap: 8px; }
  .g { background: ${R}; color: #fff; border: 0; padding: 10px 16px; font: 600 14px/1 inherit; font-family: inherit; cursor: pointer; text-decoration: none; border-radius: 6px; }
  .g.siv { background: #fff; color: ${A}; border: 1px solid #C6CACE; }
  .list { max-width: 794px; margin: 0 auto; background: #fff; padding: 36px 42px 28px; box-shadow: 0 2px 14px rgba(0,0,0,.08); }
  .glava { display: flex; justify-content: space-between; align-items: center; }
  .logo { height: 46px; width: auto; }
  .glava-d { text-align: right; }
  .kicker { font-size: 11px; letter-spacing: 2.5px; text-transform: uppercase; color: ${R}; font-weight: 700; }
  .datum { font-size: 12px; color: ${S}; margin-top: 4px; }
  .crta { width: 80mm; max-width: 50%; height: 4px; background: ${R}; margin: 16px 0 18px; }
  h1 { font-size: 21px; line-height: 1.25; margin: 0 0 8px; }
  .meta { display: flex; flex-wrap: wrap; gap: 4px 18px; font-size: 12.5px; color: ${S}; margin-bottom: 8px; }
  .meta b { color: ${A}; font-weight: 600; }
  section { margin-top: 22px; }
  h2 { font-size: 15px; text-transform: uppercase; letter-spacing: .5px; margin: 0 0 10px; padding-bottom: 6px; border-bottom: 1px solid #D9DCE0; }
  h2 i { font-style: normal; color: ${R}; margin-right: 6px; }
  h2 small { font-size: 11px; color: ${S}; text-transform: none; letter-spacing: 0; font-weight: 500; margin-left: 6px; }
  .kpiji { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
  .kpiji.tri { grid-template-columns: repeat(3, 1fr); margin-bottom: 12px; }
  .kpi { border: 1px solid #E4E6E8; border-top: 3px solid ${R}; padding: 9px 10px; background: #F4F5F6; }
  .kpi-ime { font-size: 10.5px; color: ${S}; text-transform: uppercase; letter-spacing: .4px; }
  .kpi-v { font-size: 24px; font-weight: 700; line-height: 1.15; margin-top: 2px; }
  .kpi-pod { font-size: 11px; color: ${S}; }
  .lijaki { margin-top: 14px; display: grid; gap: 7px; }
  .lijak { display: grid; grid-template-columns: 110px 1fr 90px; align-items: center; gap: 10px; font-size: 12.5px; }
  .lijak-trak { height: 12px; background: #F0F1F3; }
  .lijak-trak div { height: 100%; }
  .lijak-st { text-align: right; color: ${S}; }
  .lijak-st b { color: ${A}; }
  .tab { width: 100%; border-collapse: collapse; font-size: 11.5px; }
  .tab th { text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: .5px; color: ${S}; border-bottom: 2px solid ${A}; padding: 5px 6px; }
  .tab td { border-bottom: 1px solid #ECEEF0; padding: 5px 6px; word-break: break-all; }
  .tab .d { text-align: right; white-space: nowrap; }
  .siv-t { font-size: 11.5px; color: ${S}; margin: 0; }
  .opombe { font-size: 11.5px; color: ${S}; background: #F4F5F6; padding: 10px 14px; }
  .opombe b { color: ${A}; }
  .opombe ul { margin: 6px 0 0; padding-left: 18px; }
  .noga { margin-top: 22px; padding-top: 10px; border-top: 1px solid #D9DCE0; font-size: 10.5px; color: ${S}; text-align: center; }
  @media print {
    body { background: #fff; }
    .por { padding: 0; }
    .orodja { display: none; }
    .list { box-shadow: none; padding: 0; max-width: none; }
    * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    tr, .kpi { break-inside: avoid; }
  }
  @media (max-width: 640px) {
    .list { padding: 20px 16px; }
    .kpiji { grid-template-columns: repeat(2, 1fr); }
    .kpiji.tri { grid-template-columns: 1fr; }
  }
`;

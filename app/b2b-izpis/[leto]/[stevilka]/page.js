import { notFound, redirect } from "next/navigation";
import { trenutniB2B, jeAktiven, racuniVklopljeni, prodajalneKupca, enotaVasco } from "@/lib/b2b";
import { supabaseAdmin } from "@/lib/supabase-server";
import { eur } from "@/lib/cene";
import { site } from "@/lib/site";
import Natisni from "./Natisni";

export const metadata = { title: "Izpis računa", robots: { index: false } };
export const dynamic = "force-dynamic";

const datum = (d) => (d ? new Date(d).toLocaleDateString("sl-SI") : "");

// Izpis računa z NETO cenami (brez DDV) za B2B kupca — za tiskanje ali shranjevanje kot PDF.
export default async function IzpisRacuna({ params }) {
  const { leto, stevilka } = await params;
  const k = await trenutniB2B();
  if (!k) redirect(`/b2b?naprej=/b2b-izpis/${leto}/${stevilka}`);
  if (!jeAktiven(k) || !(await racuniVklopljeni(k.vasco_partner))) notFound();
  const { data: r } = await supabaseAdmin().from("b2b_racuni").select("*").eq("leto", Number(leto)).eq("stevilka", Number(stevilka)).maybeSingle();
  if (!r || Number(r.vasco_partner) !== Number(k.vasco_partner)) notFound();
  if (k.prodajalna && Number(r.prodajalna) !== Number(k.prodajalna)) notFound();

  const pe = r.prodajalna ? (await prodajalneKupca(k.vasco_partner)).find((p) => p.sifra === r.prodajalna) : null;
  const postavke = r.postavke ?? [];
  const neto = Number(r.neto ?? postavke.reduce((s, v) => s + Number(v.vrednost || 0), 0));
  const ddv = Math.max(0, Number(r.znesek) - neto);
  const p = site.podjetje;

  return (
    <main className="izp">
      <style>{`
        body { background: #e9ebee; }
        .izp { font-family: "Inter", "Segoe UI", system-ui, Arial, sans-serif; color: #23262a; font-size: 12px; padding: 20px 12px 40px; }
        .izp-orodja { max-width: 820px; margin: 0 auto 12px; display: flex; gap: 12px; align-items: center; }
        .izp-orodja button { background: #cb2026; color: #fff; border: 0; border-radius: 4px; padding: 8px 14px; font: inherit; font-weight: 700; cursor: pointer; }
        .izp-orodja span { color: #6e7276; }
        .izp-list { max-width: 820px; margin: 0 auto; background: #fff; padding: 36px 40px; box-shadow: 0 4px 20px rgba(0,0,0,.08); }
        .izp-gl { display: flex; justify-content: space-between; gap: 20px; border-bottom: 3px solid #cb2026; padding-bottom: 14px; }
        .izp-gl img { height: 44px; }
        .izp-gl .pod { text-align: right; font-size: 11px; color: #4a4f54; line-height: 1.5; }
        .izp h1 { font-size: 20px; margin: 18px 0 2px; font-family: inherit; text-transform: none; letter-spacing: 0; }
        .izp .opomba { color: #6e7276; font-size: 11px; margin: 0 0 16px; }
        .izp-bloki { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; margin-bottom: 18px; }
        .izp-bloki em { display: block; font-style: normal; font-size: 9.5px; text-transform: uppercase; letter-spacing: .7px; color: #6e7276; font-weight: 700; margin-bottom: 2px; }
        .izp table { width: 100%; border-collapse: collapse; }
        .izp th { text-align: left; font-size: 9.5px; text-transform: uppercase; letter-spacing: .5px; color: #6e7276; border-bottom: 1px solid #23262a; padding: 5px 6px; }
        .izp td { padding: 5px 6px; border-bottom: 1px solid #e3e6e9; vertical-align: top; }
        .izp .d { text-align: right; white-space: nowrap; }
        .izp-sum { margin: 14px 0 0 auto; width: 280px; }
        .izp-sum div { display: flex; justify-content: space-between; padding: 3px 0; }
        .izp-sum .vse { border-top: 2px solid #23262a; margin-top: 4px; padding-top: 6px; font-size: 14px; font-weight: 800; }
        .izp-noga { margin-top: 28px; padding-top: 10px; border-top: 1px solid #e3e6e9; font-size: 10px; color: #6e7276; }
        @media print {
          @page { size: A4; margin: 12mm; }
          body { background: #fff; }
          .izp { padding: 0; }
          .izp-orodja { display: none; }
          .izp-list { box-shadow: none; padding: 0; max-width: none; }
        }
      `}</style>
      <Natisni />
      <div className="izp-list">
        <div className="izp-gl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/as-system-logo.svg" alt="AS system" />
          <div className="pod">
            <b>{p.polnoIme}</b><br />
            {site.lokacije[0].naslov}<br />
            ID za DDV: {p.davcna} · Matična: {p.maticna}<br />
            {site.telefon} · {site.emailProdaja}
          </div>
        </div>

        <h1>Račun {r.stevilka}/{r.leto}</h1>
        <p className="opomba">Izpis iz spletnega B2B računa — cene brez DDV. Uradni račun ste prejeli ob dobavi.</p>

        <div className="izp-bloki">
          <div>
            <em>Kupec</em>
            <b>{k.vasco_naziv || k.podjetje}</b><br />
            {k.vasco_naslov}{k.vasco_posta ? `, ${k.vasco_posta}` : ""}<br />
            ID za DDV: SI{k.davcna}
          </div>
          <div>
            <em>Poslovalnica</em>
            {pe ? <><b>{pe.naziv2 || pe.naziv}</b><br />{pe.naslov}, {pe.posta}</> : "sedež"}
          </div>
          <div>
            <em>Datum računa</em>
            <b>{datum(r.datum)}</b>
            <br /><em style={{ marginTop: 6 }}>Stanje</em>
            {Number(r.odprto) > 0.004 ? `odprto ${eur(Number(r.odprto))}` : "plačano"}
          </div>
        </div>

        <table>
          <thead>
            <tr><th>#</th><th>Šifra</th><th>Artikel</th><th className="d">Količina</th><th className="d">Cena brez DDV</th><th className="d">Rabat</th><th className="d">Vrednost brez DDV</th></tr>
          </thead>
          <tbody>
            {postavke.map((v, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{v.sifra}</td>
                <td>{v.naziv || "—"}</td>
                <td className="d">{v.kolicina} {enotaVasco(v.enota)}</td>
                <td className="d">{eur(Number(v.cena))}</td>
                <td className="d">{Number(v.rabat) ? `${v.rabat} %` : ""}</td>
                <td className="d"><b>{eur(Number(v.vrednost))}</b></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="izp-sum">
          <div><span>Skupaj brez DDV</span><b>{eur(neto)}</b></div>
          <div><span>DDV</span><span>{eur(ddv)}</span></div>
          <div className="vse"><span>Za plačilo</span><span>{eur(Number(r.znesek))}</span></div>
        </div>

        <div className="izp-noga">
          {p.polnoIme} · TRR {p.trr} · Izpis ustvarjen {new Date().toLocaleDateString("sl-SI")} na assystem.si
        </div>
      </div>
    </main>
  );
}

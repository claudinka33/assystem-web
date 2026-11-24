import { notFound, redirect } from "next/navigation";
import { trenutniB2B, jeAktiven, racuniVklopljeni, prodajalneKupca, enotaVasco } from "@/lib/b2b";
import { supabaseAdmin } from "@/lib/supabase-server";
import Natisni from "./Natisni";

export const metadata = { title: "Račun", robots: { index: false } };
export const dynamic = "force-dynamic";

const d = (x) => (x ? new Date(x).toLocaleDateString("sl-SI", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\s/g, "") : "");
const st = (x, dec = 2) => Number(x || 0).toLocaleString("sl-SI", { minimumFractionDigits: dec, maximumFractionDigits: dec });

// Podatki izdajatelja, kot so na Vascovem računu.
const IZDAJATELJ = {
  kraj: "Šmarje pri Jelšah",
  ddv: "SI57134154",
  iban: "SI56 6100 0001 1061 160",
  banka: "Delavska hranilnica, d.d., Miklošičeva 5, 1000 Ljubljana",
  swift: "HDELSI22",
};
const ZAVEZANEC = { 0: "ni podatka", 1: "je zavezanec", 2: "ni zavezanec", 3: "izvoz", 4: "mali zavezanec" };

// Kopija računa v obliki Vascovega izpisa (brez seznama zapadlih računov) — za tiskanje ali shranjevanje kot PDF.
export default async function IzpisRacuna({ params }) {
  const { leto, stevilka } = await params;
  const k = await trenutniB2B();
  if (!k) redirect(`/b2b?naprej=/b2b-izpis/${leto}/${stevilka}`);
  if (!jeAktiven(k) || !(await racuniVklopljeni(k.vasco_partner))) notFound();
  const { data: r } = await supabaseAdmin().from("b2b_racuni").select("*").eq("leto", Number(leto)).eq("stevilka", Number(stevilka)).maybeSingle();
  if (!r || Number(r.vasco_partner) !== Number(k.vasco_partner)) notFound();
  if (k.prodajalna && Number(r.prodajalna) !== Number(k.prodajalna)) notFound();

  const g = r.glava ?? {};
  const pe = r.prodajalna ? (await prodajalneKupca(k.vasco_partner)).find((p) => p.sifra === r.prodajalna) : null;
  const postavke = r.postavke ?? [];
  const neto = Number(r.neto ?? postavke.reduce((s, v) => s + Number(v.vrednost || 0), 0));
  const ddv = Math.max(0, Number(r.znesek) - neto);
  const stopnja = postavke[0]?.ddv ?? 22;
  const naziv1 = k.vasco_naziv || k.podjetje;

  return (
    <main className="vr">
      <style>{`
        body { background: #e9ebee; }
        .vr { font-family: "Liberation Serif", "Times New Roman", Georgia, serif; color: #000; font-size: 11px; padding: 20px 12px 40px; }
        .izp-orodja { max-width: 794px; margin: 0 auto 12px; display: flex; gap: 12px; align-items: center; font-family: system-ui, Arial, sans-serif; }
        .izp-orodja button { background: #cb2026; color: #fff; border: 0; border-radius: 4px; padding: 8px 14px; font: inherit; font-weight: 700; cursor: pointer; }
        .izp-orodja span { color: #6e7276; font-size: 12px; }
        .vr-list { max-width: 794px; min-height: 1123px; margin: 0 auto; background: #fff; padding: 34px 40px; box-shadow: 0 4px 20px rgba(0,0,0,.08); position: relative; }
        .vr-sans { font-family: Arial, Helvetica, sans-serif; }
        .vr-logo { text-align: right; } .vr-logo img { height: 46px; }
        .vr-vrh { display: grid; grid-template-columns: 1fr 300px; gap: 20px; margin-top: 14px; align-items: start; }
        .vr-kupec { padding-top: 22px; font-size: 13.5px; font-weight: 700; line-height: 1.3; }
        .vr-box { border: 1px solid #000; }
        .vr-box .nas { display: flex; gap: 40px; font-size: 16px; padding: 3px 6px; border-bottom: 1px solid #000; }
        .vr-box table { width: 100%; border-collapse: collapse; font-size: 11px; }
        .vr-box td { padding: 1px 6px; vertical-align: top; }
        .vr-box td:first-child { width: 92px; }
        .vr-rdece { color: #cb2026; }
        .vr-dobava { display: flex; gap: 22px; margin-top: 10px; font-size: 9.5px; } .vr-dobava b { font-weight: 400; }
        .vr-datdob { border-top: 1px solid #000; margin-top: 8px; padding-top: 3px; font-size: 11px; }
        .vr-podatki { width: 100%; border-collapse: collapse; margin-top: 4px; text-align: center; font-size: 11px; }
        .vr-podatki th, .vr-podatki td { border: 1px solid #000; padding: 2px 4px; font-weight: 400; }
        .vr-podatki .mal { font-size: 8px; }
        .vr-post { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 9.5px; }
        .vr-post th { font-weight: 400; text-align: left; border-bottom: 1px solid #000; padding: 2px 3px; }
        .vr-post td { padding: 2px 3px; vertical-align: top; }
        .vr-post .d { text-align: right; white-space: nowrap; }
        .vr-post .naz div:first-child { text-transform: uppercase; }
        .vr-sum { margin: 14px 0 0 60px; font-size: 12px; }
        .vr-sum .vrs { display: grid; grid-template-columns: 1fr 120px 1fr 90px; border-top: 1px solid #000; padding: 1px 0; }
        .vr-sum .vrs span:last-child { text-align: right; }
        .vr-sum .vse { font-weight: 700; border-bottom: 1px solid #000; }
        .vr-sklic { margin: 22px 0 0 60px; font-weight: 700; font-size: 12px; }
        .vr-opomba { margin: 20px 0 0 60px; font-size: 12px; line-height: 1.35; }
        .vr-noga { margin-top: 30px; font-size: 9px; line-height: 1.4; }
        .vr-podpis { display: flex; justify-content: space-between; margin-top: 30px; padding: 0 30px; font-size: 11px; text-align: center; }
        .vr-kopija { position: absolute; top: 12px; left: 40px; font-size: 9px; color: #9ba0a5; font-family: Arial, sans-serif; }
        @media print {
          @page { size: A4; margin: 10mm; }
          body { background: #fff; }
          .vr { padding: 0; }
          .izp-orodja { display: none; }
          .vr-list { box-shadow: none; padding: 0; max-width: none; min-height: 0; }
          .vr-kopija { top: 0; left: 0; }
        }
      `}</style>
      <Natisni />
      <div className="vr-list">
        <div className="vr-kopija">Kopija računa · izpis iz B2B portala as-system.si</div>
        <div className="vr-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/as-system-logo.svg" alt="AS system" />
        </div>

        <div className="vr-vrh">
          <div className="vr-kupec">
            {naziv1}<br />
            {k.vasco_naziv && k.podjetje && k.podjetje !== k.vasco_naziv && <>{k.podjetje}<br /></>}
            {k.vasco_naslov || k.naslov}<br />
            {k.vasco_posta || `${k.posta ?? ""} ${k.kraj ?? ""}`}
          </div>
          <div className="vr-box">
            <div className="nas"><span>RAČUN</span><span>{r.stevilka}</span></div>
            <table className="vr-sans">
              <tbody>
                <tr><td>{IZDAJATELJ.kraj}, dne</td><td>{d(r.datum)}</td></tr>
                <tr><td>Rok plačila</td><td>{d(g.valuta)}{g.rok_placila ? `, ${g.rok_placila} dni` : ""}</td></tr>
                <tr><td>ID št. za DDV</td><td>{IZDAJATELJ.ddv}</td></tr>
                <tr className="vr-rdece"><td>IBAN:</td><td>{IZDAJATELJ.iban}</td></tr>
                <tr><td>Naslov:</td><td>{IZDAJATELJ.banka}</td></tr>
                <tr><td>SWIFT:</td><td>{IZDAJATELJ.swift}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {pe && (
          <div className="vr-dobava vr-sans">
            <span>Dobava:</span>
            <span>{pe.naziv}{pe.naziv2 ? ` ${pe.naziv2}` : ""}<br /><b>{pe.naslov} {pe.posta}</b></span>
          </div>
        )}

        <div className="vr-datdob">Datum dobave blaga oziroma izvršitve storitev: {d(g.datum_dobave || r.datum)}</div>
        <table className="vr-podatki">
          <thead>
            <tr><th>Kupec</th><th>Kome.</th><th>Naročilo</th><th>Dat. naročila</th><th>ID št. za DDV kupca</th><th>Davčni zavezanec</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>{r.vasco_partner}</td>
              <td>{g.komercialist ?? ""}</td>
              <td className={String(g.narocilo ?? "").length > 18 ? "mal" : ""}>{g.narocilo ?? ""}</td>
              <td>{d(g.datum_narocila)}</td>
              <td>{g.davcna_kupca || `SI${k.davcna}`}</td>
              <td>{ZAVEZANEC[g.davcni_zavezanec] ?? "je zavezanec"}</td>
            </tr>
          </tbody>
        </table>

        <table className="vr-post vr-sans">
          <thead>
            <tr>
              <th>Šifra artikla</th><th>Naziv</th><th>LOT</th><th className="d">Količina</th><th>Enota</th>
              <th className="d">Cena</th><th className="d">Rabat</th><th className="d">Rabat 2</th><th className="d">DDV</th><th className="d">Vrednost</th>
            </tr>
          </thead>
          <tbody>
            {postavke.map((v, i) => (
              <tr key={i}>
                <td>{v.sifra}</td>
                <td className="naz">{String(v.naziv || "").split("\n").map((x, j) => <div key={j}>{x}</div>)}</td>
                <td></td>
                <td className="d">{st(v.kolicina)}</td>
                <td title={enotaVasco(v.enota)}>{v.enota}</td>
                <td className="d">{st(v.prodajna_cena ?? v.cena, 4)}</td>
                <td className="d">{st(v.rabat)}</td>
                <td className="d">{st(v.rabat2)}</td>
                <td className="d">{st(v.ddv ?? 22, 1)}%</td>
                <td className="d">{st(v.vrednost)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="vr-sum vr-sans">
          <div className="vrs"><span>SKUPAJ</span><span></span><span></span><span>{st(neto)}</span></div>
          <div className="vrs"><span>SKUPAJ brez DDV</span><span></span><span></span><span>{st(neto)}</span></div>
          <div className="vrs"><span>+ DDV {st(stopnja)}% od osnove {st(neto)}</span><span></span><span></span><span>{st(ddv)}</span></div>
          <div className="vrs vse"><span>SKUPAJ ZA PLAČILO EUR</span><span></span><span></span><span>{st(r.znesek)}</span></div>
        </div>

        <div className="vr-sklic vr-sans">Pri plačilu se sklicujte na številko 00 {r.stevilka}-{r.vasco_partner}</div>

        <div className="vr-opomba">
          V primeru naročila pod 100,00€ brez DDV-ja vam zaračunamo stroške dostave:<br />
          - Administrativni strošek 5€ se zaračunava od naročila 50€ - 100€ brez DDV-ja<br />
          - Administrativni strošek 10€ se zaračunava od naročila 2,5€-49,99€ brez DDV-ja
        </div>

        <div className="vr-noga vr-sans">
          AS system d.o.o., je vključen v sistem ravnanja z embalažo in odpadno embalažo preko sheme UNIREC (pog. št. 497-ZAV/2013).<br />
          Za plačilo na TRR v 14 dneh od izstavitve računa vam priznavamo 3 % popusta, v primeru, da ni odprtih zapadlih terjatev.<br />
          Do poravnave celotne kupnine po tem dokumentu ostaja blago v lasti podjetja AS system d.o.o.. Vračil blaga, brez predhodne odobritve s strani podjetja AS system d.o.o., ne sprejemamo. Za napačno naročeno blago po krivdi kupca, ob vračilu zaračunavamo 20 % manipulativnih stroškov.<br />
          Reklamacije računa upoštevamo v roku 8 dni od datuma izstavitve računa.<br />
          Naše terjatve so zavarovane pri podjetju ACREDIA VERSICHERUNG AG Wien, Austria.
        </div>

        <div className="vr-podpis vr-sans">
          <div>Fakturirala<br /><br />Sara JAGODIČ</div>
          <div>Direktor<br /><br />Aleš SEIDL</div>
        </div>
      </div>
    </main>
  );
}

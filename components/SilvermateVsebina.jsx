import Image from "next/image";
import Link from "next/link";
import YouTubeVideo from "@/components/YouTubeVideo";
import { SILVERMATE_KATEGORIJA, SILVERMATE_IZDELKI } from "@/lib/silvermate";

/* --------------------------------------------------------------
   Skupna vsebina Silvermate: video, lastnosti, (tabela dimenzij),
   izbira vijaka in polica. Uporablja jo stran znamke /silvermate
   in obe strani izdelkov (Pozi, Torx) pod tabelo artiklov.
   -------------------------------------------------------------- */

// Lastnosti vijaka — po originalnem letaku Silvermate
const lastnosti = [
  { naziv: "Konica za hiter oprijem", opis: "Izjemno ostra konica in izboljšan navoj — vijak takoj prime v lesu.", slika: "/slike/silvermate/detajl-konica.jpg" },
  { naziv: "Minimalni upor pri vijačenju", opis: "Rebra na steblu pri delnem navoju in kakovosten vosek — vijak gre v les z manj sile.", slika: "/slike/silvermate/detajl-navoj.jpg" },
  { naziv: "Majhno tveganje cepitve", opis: "Izboljšana rezalna rebra za čist zaključek brez poškodb lesa.", slika: "/slike/silvermate/detajl-rezilo.jpg" },
  { naziv: "Zelo trpežen vijak", opis: "Najmočnejši vijak za iverne plošče v svojem razredu — za skoraj vse vrste lesa.", slika: "/slike/silvermate/detajl-glava.jpg" },
];

// Program po premerih — po originalnem letaku (dolžine v mm)
const tabelaDim = [
  { d: "3,0", pz: "PZ 1", tx: "TX 10", cel: "16 – 30", delni: "—", kos: 200 },
  { d: "3,5", pz: "PZ 2", tx: "TX 10", cel: "16 – 45", delni: "—", kos: 200 },
  { d: "4,0", pz: "PZ 2", tx: "TX 20", cel: "16 – 70", delni: "40 – 70", kos: 200 },
  { d: "4,5", pz: "PZ 2", tx: "TX 20", cel: "30 – 60", delni: "45 – 70", kos: 200 },
  { d: "5,0", pz: "PZ 2", tx: "TX 20", cel: "30 – 60", delni: "50 – 120", kos: 200 },
  { d: "6,0", pz: "PZ 3", tx: "TX 30", cel: "40 – 60", delni: "60 – 200", kos: 100 },
];

const izbira = [
  ["Pozi ali Torx", "Torx prenese večji navor in manj zdrsava — za daljše vijake in trši les. Pozi je klasika za vsakdanje delo. Za cel program zadoščajo trije biti vsake vrste.", "/slike/silvermate/izbira-nastavek.jpg"],
  ["Cel navoj", "Za spoje, kjer vijak drži po vsej dolžini — pritrjevanje plošč, letev in okovja.", "/slike/silvermate/izbira-cel-navoj-2.jpg"],
  ["Delni navoj", "Gladki del pod glavo potegne dva kosa lesa skupaj — za konstrukcijske spoje in tramove.", "/slike/silvermate/izbira-delni-navoj-2.jpg"],
];


export default function SilvermateVsebina({ tabela = false, glava = null }) {
  const druga = glava === "pozi" ? "torx" : glava === "torx" ? "pozi" : null;
  return (
    <>
      <section className="sec video-sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div className="st" style={{ marginBottom: 0 }}>
              <span>Video</span>
              <h2>Silvermate v praksi</h2>
              <p>Kratka predstavitev lesnega vijaka Silvermate.</p>
            </div>
            <YouTubeVideo id="CDTqtc-Er_w" naslov="Lesni vijak Silvermate" />
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Lastnosti</span>
            <h2>Zakaj Silvermate</h2>
          </div>
          <div className="kats">
            {lastnosti.map((x) => (
              <div key={x.naziv} className="k">
                <div className="im" style={{ height: 220 }}>
                  <Image src={x.slika} alt={x.naziv} fill sizes="(max-width: 700px) 50vw, 340px" style={{ objectFit: "contain", padding: 10 }} />
                </div>
                <div className="tx">
                  <h3>{x.naziv}</h3>
                  <p>{x.opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {tabela && (
      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Tehnični podatki</span>
            <h2>Dimenzije in nastavki</h2>
            <p>
              Pocinkani vijaki, izdelani tudi v izvedbi brez kroma VI. Z oznako CE in evropsko tehnično oceno
              ETA-18/0284. Pakirani v profesionalni škatli z okencem in pladnjem za lažji dostop.
            </p>
          </div>
          <div className="sm-tab-ovoj">
            <table className="sm-tab">
              <thead>
                <tr>
                  <th>Premer (mm)</th>
                  <th>Pozi</th>
                  <th>Torx</th>
                  <th>Cel navoj — dolžina</th>
                  <th>Delni navoj — dolžina</th>
                  <th>Kos v škatli</th>
                </tr>
              </thead>
              <tbody>
                {tabelaDim.map((r) => (
                  <tr key={r.d}>
                    <td><b>Ø {r.d}</b></td>
                    <td>{r.pz}</td>
                    <td>{r.tx}</td>
                    <td>{r.cel}</td>
                    <td>{r.delni}</td>
                    <td>{r.kos}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="sm-opomba">Dolžine v mm. Točne dimenzije in zalogo posamezne izvedbe najdete pri artiklih v katalogu.</p>
        </div>
      </section>
      )}

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Izbira</span>
            <h2>Kateri vijak za kateri spoj</h2>
          </div>
          <div className="who">
            {izbira.map(([n, o, sl]) => (
              <div key={n} className="izbira-k">
                <div className="izbira-sl">
                  <Image src={sl} alt={n} fill sizes="(max-width: 900px) 100vw, 480px" style={{ objectFit: "contain" }} />
                </div>
                <b>{n}</b>
                <p>{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="stojalo">
            <div className="stojalo-im">
              <Image
                src="/slike/stojala/silvermate-stojalo.jpg"
                alt="Prodajna polica Silvermate"
                width={893}
                height={1600}
                sizes="(max-width: 900px) 360px, 420px"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
            <div>
              <div className="st" style={{ marginBottom: 0 }}>
                <span>Za trgovce</span>
                <h2>Polica Silvermate</h2>
                <p>
                  Polica širine 1 m z lesnimi vijaki Silvermate v škatlah, razvrščenih po dimenzijah. Tabla na vrhu
                  kupcu na prvi pogled pove, zakaj izbrati Silvermate, rdeče cenovne letvice pa poskrbijo za
                  pregled cen.
                </p>
              </div>
              <ul>
                <li>Vse štiri izvedbe na eni polici — Pozi in Torx, cel in delni navoj.</li>
                <li>Profesionalne škatle z okencem in pladnjem za lažji dostop, z jasno oznako dimenzije.</li>
                <li>Asortiman sestavimo glede na vašo prodajo in ga dopolnjujemo.</li>
                <li>Polico lahko postavite ob polici ASfix in ASco — vse za pritrjevanje na enem mestu.</li>
              </ul>
              <div className="zn-gumbi">
                <Link className="b b-r" href="/za-trgovce#povprasevanje">
                  Želim polico Silvermate →
                </Link>
                <Link className="b b-d" href="/za-trgovce">
                  Vse police za trgovce
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {druga && (
        <section className="sec grey">
          <div className="w">
            <div className="qua" style={{ alignItems: "center" }}>
              <div className="st" style={{ marginBottom: 0 }}>
                <span>Druga izvedba</span>
                <h2>{druga === "torx" ? "Raje Torx?" : "Raje križna glava (Pozi)?"}</h2>
                <p>
                  {druga === "torx"
                    ? "Torx prenese večji navor brez zdrsa — za daljše vijake in trši les. Enake dimenzije, cel ali delni navoj."
                    : "Pozi je klasika za vsakdanje delo z lesom in ploščami. Enake dimenzije, cel ali delni navoj."}
                </p>
              </div>
              <div className="zn-gumbi">
                <Link className="b b-r" href={`/program/${SILVERMATE_KATEGORIJA.slug}/${SILVERMATE_IZDELKI[druga].slug}`}>
                  {SILVERMATE_IZDELKI[druga].naziv} →
                </Link>
                <Link className="b b-d" href="/silvermate">
                  Vse o znamki Silvermate
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

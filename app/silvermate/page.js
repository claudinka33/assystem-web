import Image from "next/image";
import Link from "next/link";
import ZnamkaHero from "@/components/ZnamkaHero";
import DveZnamki from "@/components/DveZnamki";
import YouTubeVideo from "@/components/YouTubeVideo";
import { pridobiIzdelkePoSlugih } from "@/lib/podatki";
import { SILVERMATE_KATEGORIJA, SILVERMATE_IZDELKI } from "@/lib/silvermate";

export const revalidate = 300;

export const metadata = {
  title: "Silvermate — lesni vijaki",
  description:
    "Lesni vijaki Silvermate z oceno ETA-18/0284: Pozi ali Torx, cel ali delni navoj, od 3,0 × 16 do 6,0 × 200 mm. AS811, AS812, AS814 in AS816.",
  alternates: { canonical: "/silvermate" },
};

const vijaki = [
  { sifra: "AS811", naziv: "Lesni vijak, Pozi", navoj: "cel navoj", glava: "pozi", slika: "/slike/silvermate/AS811.jpg" },
  { sifra: "AS812", naziv: "Lesni vijak, Pozi", navoj: "delni navoj", glava: "pozi", slika: "/slike/silvermate/AS812.jpg" },
  { sifra: "AS814", naziv: "Lesni vijak, Torx", navoj: "cel navoj", glava: "torx", slika: "/slike/silvermate/AS814.jpg" },
  { sifra: "AS816", naziv: "Lesni vijak, Torx", navoj: "delni navoj", glava: "torx", slika: "/slike/silvermate/AS816.jpg" },
];

// Lastnosti vijaka — po originalnem letaku Silvermate
const lastnosti = [
  { naziv: "Konica za hiter oprijem", opis: "Izjemno ostra konica in izboljšan navoj — vijak takoj prime v lesu.", slika: "/slike/silvermate/detajl-konica.jpg" },
  { naziv: "Minimalni upor pri vijačenju", opis: "Rebra na steblu pri delnem navoju in kakovosten vosek — vijak gre v les z manj sile.", slika: "/slike/silvermate/detajl-navoj.jpg" },
  { naziv: "Majhno tveganje cepitve", opis: "Izboljšana rezalna rebra za čist zaključek brez poškodb lesa.", slika: "/slike/silvermate/detajl-rezilo.jpg" },
  { naziv: "Zelo trpežen vijak", opis: "Najmočnejši vijak za iverne plošče v svojem razredu — za skoraj vse vrste lesa.", slika: "/slike/silvermate/detajl-glava.jpg" },
];

// Program po premerih — po originalnem letaku (dolžine v mm)
const tabela = [
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

export default async function Silvermate() {
  const izBaze = await pridobiIzdelkePoSlugih(Object.values(SILVERMATE_IZDELKI).map((x) => x.slug));
  const vKatalogu = Object.values(izBaze).some((x) => x.href);
  const katalog = vKatalogu ? `/program/${SILVERMATE_KATEGORIJA.slug}` : "/iskanje?q=AS81";
  const povezava = (x) => izBaze[SILVERMATE_IZDELKI[x.glava].slug]?.href ?? `/iskanje?q=${x.sifra}`;
  return (
    <>
      <ZnamkaHero
        podlaga="antracit"
        ime="Silvermate"
        logo="/slike/znamke/silvermate-logo-negativ.png"
        oznaka="Blagovna znamka · lesni vijaki"
        naslov="Lesni vijaki Silvermate"
        opis="Vijaki za les in iverne plošče z evropsko tehnično oceno — Pozi ali Torx, s celim ali delnim navojem, od 3,0 × 16 do 6,0 × 200 mm."
        znacke={["ETA-18/0284", "CE", "Pozi · Torx", "Cel · delni navoj"]}
        slika="/slike/stojala/silvermate-stojalo.jpg"
        slikaW={893}
        slikaH={1600}
        stojalo
        slikaAlt="Prodajna polica Silvermate"
        gumbi={[
          { href: katalog, naziv: "Lesni vijaki v katalogu", cls: "b-r" },
          { href: "/kontakt?vir=silvermate", naziv: "Povpraševanje →", cls: "b-o" },
        ]}
      />

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Program</span>
            <h2>Štiri izvedbe lesnih vijakov</h2>
            <p>Kliknite izvedbo za vse dimenzije, zalogo in cene. Pozi in Torx imata vsak svojo stran — v tabeli izberete cel ali delni navoj.</p>
          </div>
          <div className="kats">
            {vijaki.map((x) => (
              <Link key={x.sifra} href={povezava(x)} className="k">
                <div className="im">
                  <Image src={x.slika} alt={`Silvermate ${x.sifra} — ${x.naziv}, ${x.navoj}`} fill sizes="(max-width: 700px) 50vw, 340px" style={{ objectFit: "contain", padding: 8 }} />
                </div>
                <div className="tx">
                  <p style={{ color: "var(--color-red)", fontWeight: 800 }}>{x.sifra}</p>
                  <h3>{x.naziv}</h3>
                  <p>{x.navoj}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="zn-gumbi" style={{ marginTop: 24 }}>
            <Link className="b b-r" href={izBaze[SILVERMATE_IZDELKI.pozi.slug]?.href ?? "/iskanje?q=AS811"}>
              Vsi vijaki Pozi →
            </Link>
            <Link className="b b-r" href={izBaze[SILVERMATE_IZDELKI.torx.slug]?.href ?? "/iskanje?q=AS814"}>
              Vsi vijaki Torx →
            </Link>
          </div>
        </div>
      </section>

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
                {tabela.map((r) => (
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

      <DveZnamki trenutna="Silvermate" siv={false} />

      <div className="cta">
        <div className="w">
          <div>
            <h2>Lesni vijaki Silvermate za vašo trgovino?</h2>
            <p>Pripravimo predlog asortimana, pakiranja in pogoje.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=silvermate">
            Pošlji povpraševanje →
          </Link>
        </div>
      </div>
    </>
  );
}

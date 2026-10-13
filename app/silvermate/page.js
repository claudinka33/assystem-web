import Image from "next/image";
import Link from "next/link";
import ZnamkaHero from "@/components/ZnamkaHero";
import DveZnamki from "@/components/DveZnamki";
import YouTubeVideo from "@/components/YouTubeVideo";

export const metadata = {
  title: "Silvermate — lesni vijaki",
  description:
    "Lesni vijaki Silvermate s križno ali torx glavo, s celim ali delnim navojem: AS811, AS812, AS814 in AS816.",
  alternates: { canonical: "/silvermate" },
};

const vijaki = [
  { sifra: "AS811", naziv: "Lesni vijak, križ", navoj: "cel navoj", slika: "/slike/silvermate/AS811.jpg" },
  { sifra: "AS812", naziv: "Lesni vijak, križ", navoj: "delni navoj", slika: "/slike/silvermate/AS812.jpg" },
  { sifra: "AS814", naziv: "Lesni vijak, torx", navoj: "cel navoj", slika: "/slike/silvermate/AS814.jpg" },
  { sifra: "AS816", naziv: "Lesni vijak, torx", navoj: "delni navoj", slika: "/slike/silvermate/AS816.jpg" },
];

// Lastnosti vijaka — besedila s table na polici Silvermate
const lastnosti = [
  { naziv: "Konica za hiter oprijem", slika: "/slike/silvermate/detajl-konica.jpg" },
  { naziv: "Minimalni upor pri vijačenju", slika: "/slike/silvermate/detajl-navoj.jpg" },
  { naziv: "Majhno tveganje cepitve lesa", slika: "/slike/silvermate/detajl-rezilo.jpg" },
  { naziv: "Zelo trpežen vijak", slika: "/slike/silvermate/detajl-glava.jpg" },
];

const izbira = [
  ["Križ ali torx", "Torx nastavek prenese večji navor in manj zdrsava — za daljše vijake in trši les. Križni nastavek je klasika za vsakdanje delo.", "/slike/silvermate/izbira-nastavek.jpg"],
  ["Cel navoj", "Za spoje, kjer vijak drži po vsej dolžini — pritrjevanje plošč, letev in okovja.", "/slike/silvermate/izbira-cel-navoj-2.jpg"],
  ["Delni navoj", "Gladki del pod glavo potegne dva kosa lesa skupaj — za konstrukcijske spoje in tramove.", "/slike/silvermate/izbira-delni-navoj-2.jpg"],
];

export default function Silvermate() {
  return (
    <>
      <ZnamkaHero
        podlaga="antracit"
        ime="Silvermate"
        logo="/slike/znamke/silvermate-logo-negativ.png"
        oznaka="Blagovna znamka · lesni vijaki"
        naslov="Lesni vijaki Silvermate"
        opis="Štiri izvedbe za les — s križno ali torx glavo, s celim ali delnim navojem."
        znacke={["Križ", "Torx", "Cel navoj", "Delni navoj"]}
        slika="/slike/stojala/silvermate-stojalo.jpg"
        slikaW={893}
        slikaH={1600}
        stojalo
        slikaAlt="Prodajna polica Silvermate"
        gumbi={[
          { href: "/iskanje?q=AS81", naziv: "Lesni vijaki v katalogu", cls: "b-r" },
          { href: "/kontakt?vir=silvermate", naziv: "Povpraševanje →", cls: "b-o" },
        ]}
      />

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Program</span>
            <h2>Štiri izvedbe lesnih vijakov</h2>
          </div>
          <div className="kats">
            {vijaki.map((x) => (
              <Link key={x.sifra} href={`/iskanje?q=${x.sifra}`} className="k">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
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

      <section className="sec grey">
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
                <li>Vse štiri izvedbe na eni polici — križ in torx, cel in delni navoj.</li>
                <li>Škatle z jasno oznako dimenzije, pripravljene za samopostrežbo.</li>
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

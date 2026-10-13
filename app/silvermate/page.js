import Image from "next/image";
import Link from "next/link";
import ZnamkaHero from "@/components/ZnamkaHero";
import DveZnamki from "@/components/DveZnamki";

export const metadata = {
  title: "Silvermate — lesni vijaki",
  description:
    "Lesni vijaki Silvermate s križno ali torx glavo, s celim ali delnim navojem: AS811, AS812, AS814 in AS816.",
  alternates: { canonical: "/silvermate" },
};

const vijaki = [
  { sifra: "AS811", naziv: "Lesni vijak, križ", navoj: "cel navoj", slika: "/slike/DIN/LESNI_KRIZ_CELI_ZnR.jpeg" },
  { sifra: "AS812", naziv: "Lesni vijak, križ", navoj: "delni navoj", slika: "/slike/DIN/LESNI_KRIZ_DELNI_ZnR.jpeg" },
  { sifra: "AS814", naziv: "Lesni vijak, torx", navoj: "cel navoj", slika: "/slike/DIN/LESNI_TORX_CELI_ZnR.jpeg" },
  { sifra: "AS816", naziv: "Lesni vijak, torx", navoj: "delni navoj", slika: "/slike/DIN/LESNI_TORX_DELNI_ZnR.jpeg" },
];

const izbira = [
  ["Križ ali torx", "Torx nastavek prenese večji navor in manj zdrsava — za daljše vijake in trši les. Križni nastavek je klasika za vsakdanje delo."],
  ["Cel navoj", "Za spoje, kjer vijak drži po vsej dolžini — pritrjevanje plošč, letev in okovja."],
  ["Delni navoj", "Gladki del pod glavo potegne dva kosa lesa skupaj — za konstrukcijske spoje in tramove."],
];

export default function Silvermate() {
  return (
    <>
      <ZnamkaHero
        podlaga="antracit"
        ime="Silvermate"
        logo="/slike/znamke/silvermate-logo.png"
        oznaka="Blagovna znamka · lesni vijaki"
        naslov="Lesni vijaki Silvermate"
        opis="Štiri izvedbe za les — s križno ali torx glavo, s celim ali delnim navojem."
        znacke={["Križ", "Torx", "Cel navoj", "Delni navoj"]}
        slika="/slike/stojala/silvermate-stojalo.jpg"
        slikaW={893}
        slikaH={1600}
        stojalo
        logoPloscica
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
                  <Image src={x.slika} alt={`${x.naziv}, ${x.navoj}`} fill sizes="(max-width: 700px) 50vw, 300px" style={{ objectFit: "contain", padding: 18, mixBlendMode: "multiply" }} />
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

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Izbira</span>
            <h2>Kateri vijak za kateri spoj</h2>
          </div>
          <div className="who">
            {izbira.map(([n, o]) => (
              <div key={n}>
                <b>{n}</b>
                <p>{o}</p>
              </div>
            ))}
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

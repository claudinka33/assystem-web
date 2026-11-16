import Link from "next/link";
import VideoOzadje from "@/components/VideoOzadje";
import ObrazecPovprasevanje from "@/components/ObrazecPovprasevanje";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";

const metadataSl = {
  title: "Postanite distributer",
  description:
    "Iščemo distributerje pritrdilne tehnike ASfix v EXYU, DACH, Skandinaviji, Baltiku in Vzhodni Evropi.",
  alternates: { canonical: "/distributerji" },
};

const razlogi = [
  ["Lastna proizvodnja", "Hladno kovanje, brizganje plastike, montaža in pakiranje pod eno streho, brez posrednikov v dobavni verigi."],
  ["Evropski certifikati", "Nosilna sidra z oceno ETA in izjavo o lastnostih, dokumentacija v slovenščini in angleščini."],
  ["Prilagodljivost", "Spremembe dimenzij, materiala ali pakiranja brez čakanja na zunanjega dobavitelja."],
  ["Zaščita trga", "Distributerju zagotovimo jasne pogoje sodelovanja na dogovorjenem območju."],
];

function Distributerji() {
  return (
    <>
      <section className="zn-hero antracit">
        <div className="w">
          <div>
            <nav className="drobtine">
              <Link href="/">Domov</Link> / Distributerji
            </nav>
            <span className="zn-oznaka" style={{ marginTop: 0 }}>Tuji trgi · Distributors</span>
            <h1>Narejeno v Sloveniji. Prodano pod vašo ali našo znamko.</h1>
            <p>
              Jeklena sidra, udarne vijake, zidne vložke in perforiran trak izdelamo v lastni
              proizvodnji ter jih zapakiramo v škatle ASfix ali pod vašo znamko. Iščemo partnerje v
              EXYU, DACH, Skandinaviji, Baltiku in Vzhodni Evropi.
            </p>
            <ul className="zn-znacke">
              <li>Od leta 1993</li>
              <li>ISO 9001</li>
              <li>ETA · CE</li>
              <li>Private label</li>
            </ul>
            <div className="zn-gumbi">
              <a className="b b-r" href="#prijava">Postanite distributer</a>
              <Link className="b b-o" href="/proizvodnja">Naša proizvodnja</Link>
            </div>
          </div>
          <div className="vid-okvir">
            <VideoOzadje src="/videi/proizvodnja-hero.mp4" poster="/slike/proizvodnja/hero-video-poster.jpg" />
            <a className="vid-povezava" href="https://www.youtube.com/watch?v=uiRXMJviMv8" target="_blank" rel="noopener noreferrer">
              ▶ Company video (EN)
            </a>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Zakaj AS system</span>
            <h2>Kaj dobite kot partner</h2>
          </div>
          <div className="kats">
            {razlogi.map(([naziv, opis]) => (
              <div key={naziv} className="k" style={{ padding: "26px 24px" }}>
                <h3>{naziv}</h3>
                <p style={{ marginTop: 10 }}>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey" id="prijava">
        <div className="w">
          <div className="qua" style={{ alignItems: "flex-start" }}>
            <div>
              <div className="st">
                <span>Sodelovanje</span>
                <h2>Napišite nam o svojem trgu</h2>
                <p>
                  Zanima nas, katere države pokrivate, kakšen asortiman že
                  prodajate in kolikšne količine načrtujete. Na podlagi tega
                  pripravimo pogoje in vzorce.
                </p>
              </div>
            </div>
            <ObrazecPovprasevanje vir="distributer" naslov="Prijava distributerja" />
          </div>
        </div>
      </section>
    </>
  );
}

export default prevedenaStran(Distributerji);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}

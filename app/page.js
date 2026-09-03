import Image from "next/image";
import Link from "next/link";
import { pridobiKategorije } from "@/lib/podatki";
import { site } from "@/lib/site";

export const revalidate = 60;

export const metadata = {
  title: "AS system — pritrdilna tehnika ASfix",
  description:
    "ASfix je blagovna znamka podjetja AS system: jeklena sidra, zidni vložki, udarni vijaki in kemična sidra iz lastne slovenske proizvodnje. Od 1993, dobava v 19 držav.",
  alternates: { canonical: "/" },
};

const prednosti = [
  ["Lastna proizvodnja", "Hladno kovanje in brizganje plastike"],
  ["Ocena ETA", "Evropska tehnična ocena za nosilna sidra"],
  ["Dobava iz zaloge", "Visokoregalno skladišče v Šmarju"],
  [`${site.drzave} držav`, "Izvoz prek distributerjev"],
];

const zaKoga = [
  {
    naziv: "Trgovine",
    opis: "Asortiman ASfix v embalaži, ki proda sama — vrečke z izveskom, škatle z jasno šifro in dimenzijo, paletne enote za centre.",
    cta: "Program ASfix",
    pot: "/asfix",
  },
  {
    naziv: "Distributerji",
    opis: "Evropski proizvajalec z lastnim razvojem, oceno ETA in stabilnimi dobavnimi roki. Iščemo partnerje v EXYU, DACH, Skandinaviji in Baltiku.",
    cta: "Postanite distributer",
    pot: "/distributerji",
  },
  {
    naziv: "Izvajalci",
    opis: "Pravo pritrdilo za vsako podlago, s tehničnimi listi, izjavami o lastnostih in navodili za pravilno vgradnjo.",
    cta: "Tehnična podpora",
    pot: "/kakovost",
  },
];

const certifikati = [
  ["ETA", "Evropska tehnična ocena"],
  ["CE", "Oznaka skladnosti"],
  ["DoP", "Izjava o lastnostih"],
  ["ISO 9001", "Sistem vodenja kakovosti"],
];

export default async function Domov() {
  const { seznam: kategorije } = await pridobiKategorije();

  const stevilke = [
    ["1993", "Leto ustanovitve"],
    [`${site.drzave}`, "Držav, kamor dobavljamo"],
    ["2", "Proizvodni lokaciji v Sloveniji"],
    [`${kategorije.length}`, "Skupin izdelkov ASfix"],
  ];

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="w">
          <div>
            <span className="kick">Blagovna znamka ASfix</span>
            <h1>
              Pritrdila,
              <br />
              ki jih izdelamo
              <br />
              <em>od začetka do konca</em>
            </h1>
            <p>
              Jeklena sidra, zidni vložki, udarni vijaki in kemična sidra iz
              lastne proizvodnje v Sloveniji. Enajst skupin izdelkov, evropski
              certifikati, dobava iz zaloge.
            </p>
            <div className="acts">
              <Link className="b b-w" href="/program">
                Prodajni program
              </Link>
              <Link className="b b-o" href="/kontakt">
                Zahtevaj cenik
              </Link>
            </div>
          </div>

          <div className="hero-im">
            <div className="okvir">
              <Image
                src="/slike/sidro-txh7.jpg"
                alt="Jekleno sidro ASfix TXH7"
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 560px"
                style={{ objectFit: "contain", mixBlendMode: "multiply" }}
              />
            </div>
            <div className="hero-badge">
              <b>Jekleno sidro TXH7</b>
              <span>Ocena ETA · M8–M16 · ZnB</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Prednosti ---------- */}
      <div className="adv">
        <div className="w">
          {prednosti.map(([naziv, opis]) => (
            <div key={naziv}>
              <b>
                <i>●</i>
                {naziv}
              </b>
              <span>{opis}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Kategorije ---------- */}
      <section className="sec" id="program">
        <div className="w">
          <div className="st row">
            <div>
              <span>Prodajni program</span>
              <h2>Kategorije izdelkov</h2>
              <p>
                Za vsako podlago svoje pritrdilo — beton, opeka, votlaki, mavčne
                plošče, izolacija, streha in inštalacije.
              </p>
            </div>
            <Link className="more" href="/program">
              Vse kategorije →
            </Link>
          </div>

          <div className="kats">
            {kategorije.map((k) => (
              <Link key={k.slug} className="k" href={`/program/${k.slug}`}>
                <div className={k.slika ? "im" : "im prazna"}>
                  {k.slika && (
                    <Image
                      src={k.slika}
                      alt={k.naziv}
                      fill
                      sizes="(max-width: 620px) 100vw, 300px"
                      style={{
                        objectFit: "contain",
                        padding: 18,
                        mixBlendMode: "multiply",
                      }}
                    />
                  )}
                </div>
                <div className="tx">
                  <h3>{k.naziv}</h3>
                  <p>{k.opis}</p>
                </div>
              </Link>
            ))}

            <Link className="k" href="/private-label">
              <div className="im">
                <Image
                  src="/slike/skatla-private-label.jpg"
                  alt="Private label embalaža"
                  fill
                  sizes="300px"
                  style={{ objectFit: "contain", padding: 18, mixBlendMode: "multiply" }}
                />
              </div>
              <div className="tx">
                <h3>Private label</h3>
                <p>Pritrdila pod vašo blagovno znamko</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Za koga ---------- */}
      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Za koga delamo</span>
            <h2>Zanesljiv poslovni partner</h2>
            <p>
              Naši kupci so trgovine z gradbenim, kovinskim in inštalacijskim
              materialom, veletrgovci, distributerji na tujih trgih ter izvajalci
              na gradbiščih.
            </p>
          </div>
          <div className="who">
            {zaKoga.map((z) => (
              <div key={z.naziv}>
                <b>{z.naziv}</b>
                <p>{z.opis}</p>
                <Link href={z.pot}>{z.cta} →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Kakovost ---------- */}
      <section className="sec">
        <div className="w">
          <div className="qua">
            <div className="foto">
              <Image
                src="/slike/skatla-asfix.jpg"
                alt="Škatla ASfix"
                fill
                sizes="(max-width: 1000px) 100vw, 620px"
                style={{ objectFit: "contain", mixBlendMode: "multiply" }}
              />
            </div>
            <div>
              <div className="st">
                <span>Kakovost</span>
                <h2>Je kakovost pomembna? Za nas je najpomembnejša</h2>
                <p>
                  Nosilna sidra imajo evropsko tehnično oceno ETA in izjavo o
                  lastnostih. Vsa dokumentacija je na voljo za prenos, v
                  slovenščini in angleščini.
                </p>
              </div>
              <div className="cert">
                {certifikati.map(([kratica, opis]) => (
                  <div key={kratica}>
                    <b>{kratica}</b>
                    <span>{opis}</span>
                  </div>
                ))}
              </div>
              <Link className="more" href="/kakovost" style={{ display: "inline-block", marginTop: 22 }}>
                Certifikati in prenosi →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Številke ---------- */}
      <div className="nums">
        <div className="w">
          {stevilke.map(([v, k]) => (
            <div key={k}>
              <b>{v}</b>
              <span>{k}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- Podjetje ---------- */}
      <section className="sec">
        <div className="w">
          <div className="qua">
            <div>
              <div className="st">
                <span>{site.ime}</span>
                <h2>Proizvajalec, ne prekupčevalec</h2>
                <p>
                  Pritrdila razvijamo, kujemo in brizgamo sami. V Bistrici ob
                  Sotli imamo hladno kovanje, brizganje plastike in lastno
                  orodjarno, v Šmarju pri Jelšah upravo, visokoregalno skladišče
                  in avtomatsko montažo.
                </p>
                <p style={{ marginTop: 12 }}>
                  Ker ne kupujemo polizdelkov, lahko spremenimo dimenzijo,
                  material ali pakiranje brez čakanja na zunanjega dobavitelja.
                </p>
              </div>
              <Link className="more" href="/proizvodnja">
                Proizvodnja in razvoj →
              </Link>
            </div>
            <div className="foto">
              <Image
                src="/slike/as-system-smarje.jpg"
                alt="AS system Šmarje pri Jelšah"
                fill
                sizes="(max-width: 1000px) 100vw, 560px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Private label ---------- */}
      <div className="cta">
        <div className="w">
          <div>
            <h2>Pritrdila pod vašo blagovno znamko</h2>
            <p>
              Izdelek razvijemo, proizvedemo in zapakiramo v vašo embalažo.
              Private label za evropske znamke.
            </p>
          </div>
          <Link className="b b-w" href="/private-label">
            Kako poteka →
          </Link>
        </div>
      </div>
    </>
  );
}

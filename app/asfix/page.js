import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";

export const metadata = {
  title: "ASfix — blagovna znamka",
  description:
    "ASfix je blagovna znamka pritrdilne tehnike podjetja AS system: sidra, vložki, vijaki in kemična sidra v embalaži, pripravljeni za polico.",
  alternates: { canonical: "/asfix" },
};

const aduti = [
  ["Znan izvor", "Za vsakim izdelkom stoji slovenska proizvodnja z lastnim razvojem. Kupec ve, kdo je izdelal to, kar drži v roki."],
  ["Evropska dokazila", "Nosilna sidra imajo oceno ETA in izjavo o lastnostih. Trgovec lahko izdelek zagovarja pred zahtevnim kupcem."],
  ["Embalaža, ki proda", "Vrečka z izveskom, škatla z jasno šifro in dimenzijo, paletna enota za centre. V treh sekundah je jasno, kaj je notri."],
  ["Dobava iz zaloge", "Osnovni asortiman je v visokoregalnem skladišču v Šmarju. Brez čakanja na uvoz."],
];

const embalaza = [
  ["/slike/vrecka-rdeca.jpg", "Vrečka z izveskom", "Za police in stojala. Pregleden izvesek, dimenzija in šifra na sprednji strani."],
  ["/slike/skatla-asfix.jpg", "Škatla", "Za pult in skladišče. Šifra, dimenzija in število kosov so na čelni ploskvi."],
  ["/slike/paleta.jpg", "Paletna enota", "Za trgovske centre in večje odjeme. Enotno označene škatle na paleti."],
];

export default function ASfix() {
  return (
    <>
      <NaslovStrani
        oznaka="Blagovna znamka"
        naslov="ASfix"
        opis="Pritrdilna tehnika podjetja AS system — sidra, vložki, vijaki in kemična sidra pod eno znamko."
      />

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Kaj je ASfix</span>
                <h2>Znamka, ki jo trgovec lahko zagovarja</h2>
                <p>
                  ASfix je produktna znamka podjetja AS system. Nastopa na
                  embalaži, letakih in v katalogih, medtem ko AS system ostaja
                  znamka podjetja in razvojnega partnerja.
                </p>
                <p style={{ marginTop: 12 }}>
                  Program pokriva pritrdila za beton, opeko, votlake, mavčne
                  plošče, izolacijo, streho in inštalacije — od enega vijaka do
                  paletne enote.
                </p>
              </div>
              <Link className="b b-r" href="/program">
                Prodajni program
              </Link>
            </div>
            <div className="foto">
              <Image
                src="/slike/skatla-asfix.jpg"
                alt="Škatla ASfix"
                fill
                sizes="(max-width: 1000px) 100vw, 560px"
                style={{ objectFit: "contain", mixBlendMode: "multiply" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st">
            <span>Aduti</span>
            <h2>Zakaj ASfix na polici</h2>
          </div>
          <div className="who">
            {aduti.map(([naziv, opis]) => (
              <div key={naziv}>
                <b>{naziv}</b>
                <p>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Embalaža</span>
            <h2>Trije formati za prodajo</h2>
            <p>
              Embalažo prilagodimo prodajni poti — od samopostrežne police do
              paletne dobave v center.
            </p>
          </div>
          <div className="kats">
            {embalaza.map(([src, naziv, opis]) => (
              <div key={naziv} className="k">
                <div className="im">
                  <Image
                    src={src}
                    alt={naziv}
                    fill
                    sizes="300px"
                    style={{ objectFit: "contain", padding: 18, mixBlendMode: "multiply" }}
                  />
                </div>
                <div className="tx">
                  <h3>{naziv}</h3>
                  <p>{opis}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="cta">
        <div className="w">
          <div>
            <h2>Zanima vas program ASfix za vašo trgovino?</h2>
            <p>Pošljite povpraševanje in pripravimo predlog asortimana ter pogoje.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=asfix">
            Pošlji povpraševanje →
          </Link>
        </div>
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import { site } from "@/lib/site";

export const metadata = {
  title: "O nas",
  description:
    "AS system d.o.o. je slovenski B2B proizvajalec in razvojni partner na področju pritrdilne tehnike. Od leta 1993, dobava v 19 držav.",
  alternates: { canonical: "/o-nas" },
};

const mejniki = [
  ["1993", "Ustanovitev podjetja in začetek prodaje pritrdilne tehnike."],
  ["Bistrica ob Sotli", "Postavitev proizvodnje: hladno kovanje, brizganje plastike in lastna orodjarna."],
  ["Šmarje pri Jelšah", "Uprava, visokoregalno skladišče in avtomatska montaža."],
  ["Danes", `Blagovna znamka ASfix, private label za evropske znamke, dobava v ${site.drzave} držav.`],
];

export default function ONas() {
  return (
    <>
      <NaslovStrani
        oznaka="Podjetje"
        naslov="O nas"
        opis="Slovenski proizvajalec in razvojni partner na področju pritrdilne tehnike."
      />

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Od 1993</span>
                <h2>Trideset let pritrdilne tehnike</h2>
                <p>
                  AS system d.o.o. je slovensko podjetje, ki od leta 1993 razvija
                  in izdeluje jeklena sidra za beton, najlonske zidne vložke,
                  udarne vijake in vijake po naročilu.
                </p>
                <p style={{ marginTop: 12 }}>
                  Delujemo predvsem kot B2B partner: za evropske blagovne znamke
                  pokrivamo razvoj izdelka, hladno kovanje, brizganje plastike,
                  lastno orodjarno in avtomatizirano pakiranje v embalažo
                  naročnika. Vzporedno gradimo lastno znamko ASfix.
                </p>
                <p style={{ marginTop: 12 }}>
                  Naši aduti so evropska kakovost, lasten razvoj in proizvodnja
                  pod svojo streho — to nam daje nadzor nad kakovostjo in
                  fleksibilnost, ki je prekupčevalci nimajo.
                </p>
              </div>
              <Link className="b b-r" href="/proizvodnja">
                Proizvodnja in razvoj
              </Link>
            </div>
            <div className="foto">
              <Image
                src="/slike/as-system-smarje.jpg"
                alt="Sedež podjetja AS system"
                fill
                sizes="(max-width: 1000px) 100vw, 560px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="nums">
        <div className="w">
          <div>
            <b>1993</b>
            <span>Leto ustanovitve</span>
          </div>
          <div>
            <b>{site.drzave}</b>
            <span>Držav, kamor dobavljamo</span>
          </div>
          <div>
            <b>2</b>
            <span>Proizvodni lokaciji</span>
          </div>
          <div>
            <b>ETA</b>
            <span>Evropska tehnična ocena</span>
          </div>
        </div>
      </div>

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Pot podjetja</span>
            <h2>Kako smo prišli do sem</h2>
          </div>
          <div className="who">
            {mejniki.map(([naslov, opis]) => (
              <div key={naslov}>
                <b>{naslov}</b>
                <p>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="st" style={{ marginBottom: 0 }}>
            <span>Moto</span>
            <h2>Ko pritrjevanje postane igra</h2>
            <p>
              Enotna podoba je enako pomembna kot toleranca na vijaku. Ista
              logika, isti red, isti občutek kakovosti — od tehnične risbe do
              embalaže.
            </p>
          </div>
        </div>
      </section>

      <div className="cta">
        <div className="w">
          <div>
            <h2>Bi sodelovali z nami?</h2>
            <p>Kot trgovec, distributer ali blagovna znamka — pišite nam.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=o-nas">
            Kontakt →
          </Link>
        </div>
      </div>
    </>
  );
}

import Image from "next/image";
import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";

export const metadata = {
  title: "Proizvodnja in razvoj",
  description:
    "Hladno kovanje jekla, brizganje plastike, lastna orodjarna in avtomatska montaža na dveh lokacijah v Sloveniji.",
  alternates: { canonical: "/proizvodnja" },
};

const zmogljivosti = [
  ["Hladno kovanje", "Jeklena sidra in vijaki nastanejo iz žice do končnega izdelka na naši liniji. Hladno kovanje ohrani strukturo materiala in zagotovi ponovljivo nosilnost."],
  ["Brizganje plastike", "Najlonski vložki in tulci iz poliamida, brizgani na lastnih orodjih. Material izberemo glede na podlago in zahtevano obremenitev."],
  ["Lastna orodjarna", "Orodja razvijemo, izdelamo in vzdržujemo sami. Sprememba dimenzije ne pomeni čakanja na zunanjega dobavitelja."],
  ["Avtomatska montaža", "Sestavljanje kompletov in pakiranje v vrečke ali škatle poteka avtomatizirano, z enakomerno kakovostjo in brez ročnega dela."],
];

export default function Proizvodnja() {
  return (
    <>
      <NaslovStrani
        oznaka="Zmogljivosti"
        naslov="Proizvodnja in razvoj"
        opis="Dve lokaciji v Sloveniji, celotna pot izdelka pod eno streho."
      />

      <section className="sec">
        <div className="w">
          <div className="st">
            <span>Kaj delamo sami</span>
            <h2>Proizvajalec, ne prekupčevalec</h2>
            <p>
              Ker ne kupujemo polizdelkov, lahko spremenimo dimenzijo, material
              ali pakiranje brez čakanja na dobavno verigo. To je razlika med
              proizvajalcem in trgovcem.
            </p>
          </div>

          <div className="kats">
            {zmogljivosti.map(([naziv, opis]) => (
              <div key={naziv} className="k" style={{ padding: "26px 24px" }}>
                <h3>{naziv}</h3>
                <p style={{ marginTop: 10 }}>{opis}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec grey">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div className="foto">
              <Image
                src="/slike/as-system-smarje.jpg"
                alt="AS system Šmarje pri Jelšah"
                fill
                sizes="(max-width: 1000px) 100vw, 620px"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <div className="st">
                <span>Lokacija 01</span>
                <h2>Šmarje pri Jelšah</h2>
                <p>
                  Sedež podjetja. Tu so uprava, prodaja, visokoregalno skladišče
                  in avtomatska montaža. Iz tega skladišča odpremljamo naročila
                  za domači trg in izvoz.
                </p>
              </div>
              <dl className="stik">
                <div>
                  <dt>Dejavnost</dt>
                  <dd style={{ fontWeight: 400, fontSize: 15 }}>
                    Uprava · prodaja · skladišče · avtomatska montaža
                  </dd>
                </div>
                <div>
                  <dt>Naslov</dt>
                  <dd style={{ fontWeight: 400, fontSize: 15 }}>
                    Obrtniška ulica 14, 3240 Šmarje pri Jelšah
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="w">
          <div className="qua" style={{ alignItems: "center" }}>
            <div>
              <div className="st">
                <span>Lokacija 02</span>
                <h2>Bistrica ob Sotli</h2>
                <p>
                  Težki strojni park. Hladno kovanje jekla, proizvodnja vijakov,
                  brizganje plastike in orodjarna. Tu nastane večina izdelkov,
                  ki jih pozneje zapakiramo v Šmarju.
                </p>
              </div>
              <dl className="stik">
                <div>
                  <dt>Dejavnost</dt>
                  <dd style={{ fontWeight: 400, fontSize: 15 }}>
                    Hladno kovanje · vijaki · brizganje plastike · orodjarna
                  </dd>
                </div>
                <div>
                  <dt>Lokacija</dt>
                  <dd style={{ fontWeight: 400, fontSize: 15 }}>
                    Bistrica ob Sotli, Slovenija
                  </dd>
                </div>
              </dl>
            </div>
            <div className="foto">
              <Image
                src="/slike/sidro-txh7.jpg"
                alt="Jekleno sidro iz lastne proizvodnje"
                fill
                sizes="(max-width: 1000px) 100vw, 560px"
                style={{ objectFit: "contain", mixBlendMode: "multiply" }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="cta">
        <div className="w">
          <div>
            <h2>Potrebujete izdelek po meri?</h2>
            <p>Pošljite risbo ali vzorec in pripravimo predlog izvedbe.</p>
          </div>
          <Link className="b b-w" href="/kontakt?vir=proizvodnja">
            Pošlji povpraševanje →
          </Link>
        </div>
      </div>
    </>
  );
}

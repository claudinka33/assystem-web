import NaslovStrani from "@/components/NaslovStrani";
import ObrazecPovprasevanje from "@/components/ObrazecPovprasevanje";

export const metadata = {
  title: "Postanite distributer",
  description:
    "Iščemo distributerje pritrdilne tehnike ASfix v EXYU, DACH, Skandinaviji, Baltiku in Vzhodni Evropi.",
  alternates: { canonical: "/distributerji" },
};

const razlogi = [
  ["Lastna proizvodnja", "Hladno kovanje, brizganje plastike in orodjarna pod eno streho — brez posrednikov v dobavni verigi."],
  ["Evropski certifikati", "Nosilna sidra z oceno ETA in izjavo o lastnostih, dokumentacija v slovenščini in angleščini."],
  ["Prilagodljivost", "Spremembe dimenzij, materiala ali pakiranja brez čakanja na zunanjega dobavitelja."],
  ["Zaščita trga", "Distributerju zagotovimo jasne pogoje sodelovanja na dogovorjenem območju."],
];

export default function Distributerji() {
  return (
    <>
      <NaslovStrani
        oznaka="Tuji trgi"
        naslov="Postanite distributer"
        opis="Iščemo partnerje v EXYU, DACH, Skandinaviji, Baltiku in Vzhodni Evropi."
      />

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

      <section className="sec grey">
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

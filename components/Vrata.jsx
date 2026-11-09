import Link from "next/link";

/* Kaj iščete? Pet vstopnih poti: B2C, B2B, trgovci, private label, vijaki po risbi. */
const VRATA = [
  {
    st: "01",
    kdo: "Za domačo rabo",
    naslov: "Pritrdilo za vaš projekt",
    opis: "Poiščite izdelek po šifri ali podlagi in ga naročite brez registracije.",
    cta: "Izdelki",
    pot: "/program",
  },
  {
    st: "02",
    kdo: "Podjetja in izvajalci",
    naslov: "Poslovni nakup",
    opis: "Vaše cene, pregled naročil in plačilo na račun z dogovorjenim rokom plačila.",
    cta: "B2B prijava",
    pot: "/b2b",
  },
  {
    st: "03",
    kdo: "Trgovine",
    naslov: "Program in police",
    opis: "Sestavimo prodajni program in postavitev police od 1 do 20 metrov.",
    cta: "Za trgovce",
    pot: "/za-trgovce",
  },
  {
    st: "04",
    kdo: "Blagovne znamke",
    naslov: "Private label",
    opis: "Naše izdelke zapakiramo v vašo embalažo in pod vašo znamko.",
    cta: "Private label",
    pot: "/private-label",
  },
  {
    st: "05",
    kdo: "Industrija",
    naslov: "Vijaki po vaši risbi",
    opis: "Izdelamo vijake po vaši risbi ali tehnični dokumentaciji.",
    cta: "Vijaki po naročilu",
    pot: "/vijaki-po-narocilu",
  },
];

export default function Vrata() {
  return (
    <section className="sec">
      <div className="w">
        <div className="st">
          <span>Kaj iščete?</span>
          <h2>Izberite, kar velja za vas</h2>
        </div>
        <div className="vrata">
          {VRATA.map((x) => (
            <div key={x.st} className="vrata-k">
              <b>{x.st}</b>
              <em>{x.kdo}</em>
              <h3>{x.naslov}</h3>
              <p>{x.opis}</p>
              <div className="vrata-cta">
                <Link className="b b-r" href={x.pot}>
                  {x.cta} →
                </Link>
                {x.dodatno && (
                  <Link className="more" href={x.dodatno.pot}>
                    {x.dodatno.naziv} →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

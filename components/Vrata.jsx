import Link from "next/link";

/* Kaj iščete? Štiri vstopne poti: B2B, trgovci, private label, vijaki po risbi. */
const VRATA = [
  {
    st: "01",
    kdo: "Podjetja in izvajalci",
    naslov: "Poslovni nakup",
    opis: "Vaše cene, pregled naročil in plačilo na račun z dogovorjenim rokom plačila.",
    cta: "B2B prijava",
    pot: "/b2b",
  },
  {
    st: "02",
    kdo: "Trgovine",
    naslov: "Program in police",
    opis: "Sestavimo prodajni program in postavitev police od 1 do 20 metrov.",
    cta: "Za trgovce",
    pot: "/za-trgovce",
  },
  {
    st: "03",
    kdo: "Blagovne znamke",
    naslov: "Private label",
    opis: "Naše izdelke zapakiramo v vašo embalažo in pod vašo znamko.",
    cta: "Private label",
    pot: "/private-label",
  },
  {
    st: "04",
    kdo: "Bespoke",
    naslov: "Izdelava po meri",
    opis: "Prinesite skico ali risbo: vijake in naše izdelke izdelamo po vaših merah.",
    cta: "Bespoke",
    pot: "/bespoke",
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

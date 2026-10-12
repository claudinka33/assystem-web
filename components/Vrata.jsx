import Link from "next/link";

/* Kaj iščete? — štiri vstopna vrata za štiri publike (B2C, B2B, trgovci, partnerji). */
const VRATA = [
  {
    st: "01",
    kdo: "Kupujem zase",
    naslov: "Pravo pritrdilo za moj projekt",
    opis: "Poiščite izdelek po podlagi ali šifri in ga kupite brez registracije.",
    cta: "Izdelki",
    pot: "/program",
  },
  {
    st: "02",
    kdo: "Podjetje ali izvajalec",
    naslov: "Poslovne cene in naročanje",
    opis: "B2B prijava s cenami po dogovoru, zgodovino naročil in plačilom po računu.",
    cta: "B2B prijava",
    pot: "/b2b",
  },
  {
    st: "03",
    kdo: "Trgovec",
    naslov: "Program in police za trgovino",
    opis: "Sestavimo prodajni program in postavitev police — od 1 do 20 metrov.",
    cta: "Za trgovce",
    pot: "/za-trgovce",
  },
  {
    st: "04",
    kdo: "Partner ali blagovna znamka",
    naslov: "Pod vašo znamko ali po vaši risbi",
    opis: "Pakiranje pod vašo blagovno znamko in izdelava vijakov po tehnični dokumentaciji.",
    cta: "Za partnerje",
    pot: "/private-label",
    dodatno: { naziv: "Vijaki po naročilu", pot: "/vijaki-po-narocilu" },
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

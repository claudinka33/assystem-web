import { site } from "@/lib/site";

// Zemljevid »Iz Slovenije v svet« — enak slog kot na novih škatlah ASfix:
// antracit z vzorcem vijakov, tanke obrobe držav, loki iz Šmarja pri Jelšah.
// Koordinate so izračunane za viewBox 1000 × 470 (projekcija Natural Earth, public/slike/zemljevid-svet.svg).
const SI = [536.1, 123.8];
const EVROPA = [
  [525.1, 107.7], [535.8, 118.9], [539.7, 126.2], [531.6, 134.1], [535.1, 79.7],
  [557, 90.3], [546.6, 104.9], [552.3, 130.3], [506, 122], [490.5, 142.1], [496.4, 103.4],
];
const SVET = [
  [277.5, 137], [368.5, 322.9], [575.3, 356.5], [649, 190.9], [706.1, 179.9], [896.9, 381.4],
];

function lok([x2, y2], visina) {
  const [x1, y1] = SI;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - visina;
  return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
}

export default function ZemljevidProdaje() {
  return (
    <section className="zem">
      <div className="w zem-w">
        <div className="zem-t">
          <span className="zem-nad">Iz Slovenije v svet</span>
          <h2>
            Evropska kakovost.
            <br />
            Globalni doseg.
          </h2>
          <p>
            Pritrdila iz naše proizvodnje v Šmarju pri Jelšah in Bistrici ob Sotli vgrajujejo monterji in izvajalci po Evropi in
            drugod po svetu — pod znamko ASfix ali pod znamkami naših partnerjev.
          </p>
          <div className="zem-st">
            <div><b>{site.drzave}</b><span>držav, kamor dobavljamo</span></div>
            <div><b>{site.ustanovljeno}</b><span>lastna proizvodnja od</span></div>
            <div><b>2</b><span>proizvodni lokaciji v Sloveniji</span></div>
          </div>
        </div>
        <div className="zem-k" aria-hidden="true">
          <svg viewBox="0 0 1000 470" role="img">
            <image href="/slike/zemljevid-svet.svg" x="0" y="0" width="1000" height="470" />
            {SVET.map((t, i) => (
              <path key={`s${i}`} d={lok(t, 70 + i * 6)} className="zem-lok" style={{ animationDelay: `${0.6 + i * 0.25}s` }} />
            ))}
            {EVROPA.map((t, i) => (
              <path key={`e${i}`} d={lok(t, 10)} className="zem-lok kratek" style={{ animationDelay: `${0.2 + i * 0.08}s` }} />
            ))}
            {[...EVROPA, ...SVET].map(([x, y], i) => (
              <circle key={`t${i}`} cx={x} cy={y} r="2.6" className="zem-tocka" />
            ))}
            <circle cx={SI[0]} cy={SI[1]} r="12" className="zem-utrip" />
            <circle cx={SI[0]} cy={SI[1]} r="4.5" className="zem-si" />
          </svg>
          <p className="zem-pod">From Slovenia to the world. Fastening solutions you can trust.</p>
        </div>
      </div>
    </section>
  );
}

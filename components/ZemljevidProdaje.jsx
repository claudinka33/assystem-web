"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";

// Zemljevid »Iz Slovenije v svet« — slog novih škatel ASfix.
// Ko obiskovalec pridrsa do zemljevida, iz Šmarja poletijo letala: za sabo rišejo sled,
// ob pristanku zasveti pika. Koordinate so za viewBox 1000 × 470 (public/slike/zemljevid-svet.svg).
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
  return `M${x1} ${y1} Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - visina} ${x2} ${y2}`;
}

// najprej svet (z letali), nato Evropa (kratke rdeče sledi)
const POLETI = [
  ...SVET.map((t, i) => ({ id: `s${i}`, t, d: lok(t, 70 + i * 6), zamik: 0.3 + i * 0.35, trajanje: 2.4, letalo: true, rdec: false })),
  ...EVROPA.map((t, i) => ({ id: `e${i}`, t, d: lok(t, 10), zamik: 2.4 + i * 0.09, trajanje: 0.7, letalo: false, rdec: true })),
];

// letalo, usmerjeno v smer +x (animateMotion ga obrne po poti)
const LETALO = "M7 0 L2 -1.3 L-1 -6 L-2.6 -6 L-0.8 -1.3 L-4.6 -1.1 L-6 -3 L-7 -3 L-6.2 0 L-7 3 L-6 3 L-4.6 1.1 L-0.8 1.3 L-2.6 6 L-1 6 L2 1.3 Z";

export default function ZemljevidProdaje() {
  const ref = useRef(null);
  const [stanje, setStanje] = useState("caka"); // caka | leti | koncano

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setStanje("koncano");
      return;
    }
    const io = new IntersectionObserver(
      ([v]) => {
        if (!v.isIntersecting) return;
        io.disconnect();
        setStanje("leti");
        // SMIL animacije letal sprožimo ročno, z zamikom vsakega leta
        el.querySelectorAll("animateMotion, animate.let").forEach((a) => {
          const z = Number(a.dataset.zamik || 0) * 1000;
          setTimeout(() => {
            try {
              a.beginElement();
            } catch {}
          }, z);
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
          <svg ref={ref} viewBox="0 0 1000 470" className={`zem-svg ${stanje}`}>
            <image href="/slike/zemljevid-svet.svg" x="0" y="0" width="1000" height="470" />
            {POLETI.map((p) => (
              <path
                key={p.id}
                id={`zem-${p.id}`}
                d={p.d}
                pathLength="1"
                className={`zem-lok${p.rdec ? " kratek" : ""}`}
                style={{ animationDelay: `${p.zamik}s`, animationDuration: `${p.trajanje}s` }}
              />
            ))}
            {POLETI.map((p) => (
              <circle
                key={`t${p.id}`}
                cx={p.t[0]}
                cy={p.t[1]}
                r="2.8"
                className="zem-tocka"
                style={{ animationDelay: `${p.zamik + p.trajanje - 0.1}s` }}
              />
            ))}
            {POLETI.filter((p) => p.letalo).map((p) => (
              <g key={`l${p.id}`} className="zem-letalo" opacity="0">
                <path d={LETALO} />
                <animateMotion begin="indefinite" dur={`${p.trajanje}s`} fill="freeze" rotate="auto" calcMode="spline" keyPoints="0;1" keyTimes="0;1" keySplines="0.45 0 0.35 1" data-zamik={p.zamik}>
                  <mpath href={`#zem-${p.id}`} />
                </animateMotion>
                <animate className="let" attributeName="opacity" begin="indefinite" dur={`${p.trajanje}s`} values="0;1;1;0" keyTimes="0;0.08;0.85;1" fill="freeze" data-zamik={p.zamik} />
              </g>
            ))}
            <circle cx={SI[0]} cy={SI[1]} r="12" className="zem-utrip" />
            <circle cx={SI[0]} cy={SI[1]} r="4.5" className="zem-si" />
          </svg>
          <p className="zem-pod">Iz Slovenije v svet. Pritrdilna tehnika, na katero se lahko zanesete.</p>
        </div>
      </div>
    </section>
  );
}

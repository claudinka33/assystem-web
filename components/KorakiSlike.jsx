"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Velika slika 16:9 + zavihki pod njo; samodejno menjavanje, ustavi se ob miški.
// koraki: [{ naslov, podnaslov, opis, slika, alt }]
export default function KorakiSlike({ koraki, href, gumb = "Oglejte si →", cas = 5000 }) {
  const [i, setI] = useState(0);
  const [pavza, setPavza] = useState(false);

  useEffect(() => {
    if (pavza) return;
    const t = setTimeout(() => setI((x) => (x + 1) % koraki.length), cas);
    return () => clearTimeout(t);
  }, [i, pavza, cas, koraki.length]);

  const k = koraki[i];
  const Ovoj = href ? Link : "div";

  return (
    <div className="lok-d" onMouseEnter={() => setPavza(true)} onMouseLeave={() => setPavza(false)}>
      <Ovoj {...(href ? { href } : {})} className="lok-d-foto">
        {koraki.map((x, n) => (
          <div key={x.naslov} className={`lok-d-sl${n === i ? " on" : ""}`}>
            <Image src={x.slika} alt={x.alt ?? x.naslov} fill sizes="(max-width: 1000px) 100vw, 50vw" quality={90} />
          </div>
        ))}
        <div className="lok-d-nap">
          <small>{k.podnaslov}</small>
          <b>{k.naslov}</b>
          <span>{k.opis}</span>
        </div>
        {href && <span className="lok-d-vec">{gumb}</span>}
      </Ovoj>
      <div className="lok-d-tab" role="tablist" style={{ gridTemplateColumns: `repeat(${koraki.length}, minmax(0, 1fr))` }}>
        {koraki.map((x, n) => (
          <button
            key={x.naslov}
            type="button"
            role="tab"
            aria-selected={n === i}
            className={n === i ? "on" : ""}
            onClick={() => setI(n)}
            onMouseEnter={() => setI(n)}
          >
            <span className="lok-d-st">0{n + 1}</span>
            <span>
              <b>{x.naslov}</b>
            </span>
            <i key={`${i}-${pavza}`} className={n === i && !pavza ? "tece" : ""} style={{ animationDuration: `${cas}ms` }} />
          </button>
        ))}
      </div>
    </div>
  );
}

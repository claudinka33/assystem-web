"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Domača stran: Šmarje in Bistrica — velika fotografija (cela, 16:9), zavihka,
// samodejno menjavanje, počasen zoom, ob prehodu miške se ustavi.
const LOKACIJE = [
  {
    kraj: "Šmarje pri Jelšah",
    vloga: "Sedež in uprava",
    opis: "Visokoregalno skladišče, avtomatska montaža in pakiranje.",
    slika: "/slike/proizvodnja/smarje-pri-jelsah.jpg",
  },
  {
    kraj: "Bistrica ob Sotli",
    vloga: "Proizvodnja",
    opis: "Hladno kovanje, valjanje navojev in brizganje plastike.",
    slika: "/slike/proizvodnja/bistrica-ob-sotli.jpg",
  },
];

const CAS = 6000;

export default function LokacijiDomov() {
  const [i, setI] = useState(0);
  const [pavza, setPavza] = useState(false);

  useEffect(() => {
    if (pavza) return;
    const t = setTimeout(() => setI((x) => (x + 1) % LOKACIJE.length), CAS);
    return () => clearTimeout(t);
  }, [i, pavza]);

  return (
    <div className="lok-d" onMouseEnter={() => setPavza(true)} onMouseLeave={() => setPavza(false)}>
      <Link href="/proizvodnja#lokacije" className="lok-d-foto" aria-label={`${LOKACIJE[i].kraj} — več o lokaciji`}>
        {LOKACIJE.map((l, k) => (
          <div key={l.kraj} className={`lok-d-sl${k === i ? " on" : ""}`}>
            <Image src={l.slika} alt={`AS system ${l.kraj}`} fill sizes="(max-width: 1000px) 100vw, 60vw" quality={90} priority={k === 0} />
          </div>
        ))}
        <div className="lok-d-nap">
          <small>{LOKACIJE[i].vloga}</small>
          <b>{LOKACIJE[i].kraj}</b>
          <span>{LOKACIJE[i].opis}</span>
        </div>
        <span className="lok-d-vec">Oglejte si →</span>
      </Link>
      <div className="lok-d-tab" role="tablist">
        {LOKACIJE.map((l, k) => (
          <button
            key={l.kraj}
            type="button"
            role="tab"
            aria-selected={k === i}
            className={k === i ? "on" : ""}
            onClick={() => setI(k)}
            onMouseEnter={() => setI(k)}
          >
            <span className="lok-d-st">0{k + 1}</span>
            <span>
              <b>{l.kraj}</b>
              <small>{l.vloga}</small>
            </span>
            <i key={`${i}-${pavza}`} className={k === i && !pavza ? "tece" : ""} style={{ animationDuration: `${CAS}ms` }} />
          </button>
        ))}
      </div>
    </div>
  );
}

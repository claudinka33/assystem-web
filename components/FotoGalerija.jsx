"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

// Galerija fotografij iz proizvodnje: zavihki (skupine), mozaik, povečava ob kliku.
// skupine: [{ naziv, slike: [{ src, alt, w, h }] }]
export default function FotoGalerija({ skupine, max = 12 }) {
  const [s, setS] = useState(0);
  const [odprta, setOdprta] = useState(null);
  const [vse, setVse] = useState(false);
  const MAX = max;
  const slike = skupine[s].slike;

  const naprej = useCallback((d) => setOdprta((i) => (i === null ? null : (i + d + slike.length) % slike.length)), [slike.length]);

  useEffect(() => {
    if (odprta === null) return;
    const tipka = (e) => {
      if (e.key === "Escape") setOdprta(null);
      if (e.key === "ArrowRight") naprej(1);
      if (e.key === "ArrowLeft") naprej(-1);
    };
    window.addEventListener("keydown", tipka);
    const prej = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", tipka);
      document.body.style.overflow = prej;
    };
  }, [odprta, naprej]);

  return (
    <div className="fg">
      {skupine.length > 1 && (
        <div className="fg-tab" role="tablist">
          {skupine.map((g, i) => (
            <button key={g.naziv} type="button" role="tab" aria-selected={i === s} className={i === s ? "on" : ""} onClick={() => { setS(i); setOdprta(null); setVse(false); }}>
              {g.naziv}
              <small>{g.slike.length}</small>
            </button>
          ))}
        </div>
      )}
      <div className="fg-mreza" key={s}>
        {(vse ? slike : slike.slice(0, MAX)).map((x, i) => (
          <button key={x.src} type="button" className={`fg-sl${x.h > x.w ? " pokonc" : ""}`} onClick={() => setOdprta(i)} style={{ animationDelay: `${i * 45}ms` }} aria-label={`Povečaj: ${x.alt}`}>
            <Image src={x.src} alt={x.alt} width={x.w} height={x.h} sizes="(max-width: 700px) 50vw, (max-width: 1100px) 33vw, 320px" />
            <span>{x.alt}</span>
          </button>
        ))}
      </div>
      {!vse && slike.length > MAX && (
        <div className="fg-vec">
          <button type="button" className="b b-d" onClick={() => setVse(true)}>
            Pokaži vse fotografije ({slike.length})
          </button>
        </div>
      )}
      {odprta !== null && (
        <div className="fg-luc" onClick={() => setOdprta(null)} role="dialog" aria-modal="true">
          <button type="button" className="fg-x" aria-label="Zapri" onClick={() => setOdprta(null)}>×</button>
          <button type="button" className="fg-nav l" aria-label="Prejšnja" onClick={(e) => { e.stopPropagation(); naprej(-1); }}>‹</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <Image src={slike[odprta].src} alt={slike[odprta].alt} width={slike[odprta].w} height={slike[odprta].h} sizes="92vw" quality={90} />
            <figcaption>
              {slike[odprta].alt}
              <small>{odprta + 1} / {slike.length}</small>
            </figcaption>
          </figure>
          <button type="button" className="fg-nav d" aria-label="Naslednja" onClick={(e) => { e.stopPropagation(); naprej(1); }}>›</button>
        </div>
      )}
    </div>
  );
}

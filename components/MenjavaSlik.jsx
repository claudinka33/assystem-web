"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { prevedeno } from "@/lib/i18n/odjemalec";

/* Slike, ki se same menjajo (privzeto vsaki 2 s), z imenom in pikicami.
   slike: [{ src, naziv }] */
function MenjavaSlik({ slike, interval = 2000, className = "" }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (!slike || slike.length < 2) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % slike.length), interval);
    return () => clearInterval(t);
  }, [slike, interval]);

  if (!slike || !slike.length) return null;

  return (
    <div className={`menjava ${className}`}>
      <div className="menjava-okno">
        {slike.map((s, k) => (
          <Image
            key={s.src}
            src={s.src}
            alt={s.naziv}
            fill
            priority={k === 0}
            sizes="(max-width: 1000px) 92vw, 560px"
            className={k === i ? "menjava-im on" : "menjava-im"}
            style={{ objectFit: "contain" }}
          />
        ))}
      </div>
      <div className="menjava-pas">
        <b aria-live="polite">{slike[i].naziv}</b>
        <span className="menjava-pike">
          {slike.map((s, k) => (
            <button
              key={s.src}
              type="button"
              className={k === i ? "on" : ""}
              aria-label={`Pokaži: ${s.naziv}`}
              onClick={() => setI(k)}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

export default prevedeno(MenjavaSlik);

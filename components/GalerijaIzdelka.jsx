"use client";

import Image from "next/image";
import { useState } from "react";

// Glavna slika izdelka + sličice. Klik na sličico zamenja glavno sliko.
function oznakaIz(url) {
  const ime = (url.split("/").pop() || "").replace(/\.[a-z]+$/i, "");
  const zadnji = ime.split("_").pop();
  return zadnji && zadnji !== ime && zadnji.length <= 6 ? zadnji : "";
}

export default function GalerijaIzdelka({ slike, naziv }) {
  const [izbrana, setIzbrana] = useState(0);
  if (!slike.length) return <div className="izd-slika" />;
  const url = slike[izbrana] ?? slike[0];

  return (
    <>
      <div className="izd-slika">
        <Image
          key={url}
          src={url}
          alt={naziv}
          fill
          priority={izbrana === 0}
          sizes="(max-width: 1000px) 100vw, 380px"
          style={{ objectFit: "contain", padding: 18 }}
        />
        {oznakaIz(url) && <span className="izd-oznaka">{oznakaIz(url)}</span>}
      </div>

      {slike.length > 1 && (
        <div className="izd-mini">
          {slike.map((s, n) => (
            <button
              key={s}
              type="button"
              className={n === izbrana ? "on" : ""}
              onClick={() => setIzbrana(n)}
              aria-label={`${naziv} — slika ${n + 1}`}
            >
              <Image src={s} alt="" fill sizes="80px" style={{ objectFit: "contain", padding: 4 }} />
              {oznakaIz(s) && <span className="izd-oznaka">{oznakaIz(s)}</span>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

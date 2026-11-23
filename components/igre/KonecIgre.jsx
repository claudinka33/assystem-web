"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { prevedeno } from "@/lib/i18n/odjemalec";

// Okno, ki se odpre takoj, ko je igra končana (tudi na telefonu, kjer bi blok spodaj ostal neviden).
function KonecIgre({ naslov, besedilo, povezave = [], ponovi }) {
  const [odprto, setOdprto] = useState(true);
  useEffect(() => {
    const esc = (e) => e.key === "Escape" && setOdprto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  const gumbi = (
    <div className="igra-konec-gumbi">
      <Link className="b b-g" href="/b2b/registracija">Registrirajte podjetje</Link>
      {povezave.map((p) => (
        <Link key={p.href} className="b b-d" href={p.href}>{p.label}</Link>
      ))}
      <button type="button" className="b b-d" onClick={ponovi}>Poskusite znova</button>
    </div>
  );

  return (
    <>
      <div className="igra-konec">
        <h3>{naslov}</h3>
        <p>{besedilo}</p>
        {gumbi}
      </div>
      {odprto && (
        <div className="igra-okno" role="dialog" aria-modal="true" aria-label={naslov} onClick={() => setOdprto(false)}>
          <div className="igra-okno-k" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="igra-okno-x" aria-label="Zapri" onClick={() => setOdprto(false)}>×</button>
            <div className="igra-okno-ok" aria-hidden="true">✓</div>
            <span className="igra-okno-oz">Odlično opravljeno</span>
            <h3>{naslov}</h3>
            <p>{besedilo}</p>
            <div className="igra-okno-b2b">
              <b>Kupujete za podjetje?</b>
              <span>Registrirajte podjetje in takoj po odobritvi vidite svoje cene, zalogo in naročate prek spleta.</span>
            </div>
            {gumbi}
          </div>
        </div>
      )}
    </>
  );
}

export default prevedeno(KonecIgre);

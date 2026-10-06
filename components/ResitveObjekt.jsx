"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Interaktivni objekt: pregled → cona (detajl) → plus → kartica izdelkov.
export default function ResitveObjekt({ objekt, cone, izdelki }) {
  const [cona, setCona] = useState(null); // id izbrane cone
  const [poudarjena, setPoudarjena] = useState(null); // cona pod miško
  const [plus, setPlus] = useState(null); // indeks odprtega plusa
  const [prehod, setPrehod] = useState(null); // {x,y} med povečavo
  const vrh = useRef(null);

  const izbrana = cone.find((c) => c.id === cona) ?? null;
  const indeks = izbrana ? cone.indexOf(izbrana) : -1;

  // zapri kartico z Esc
  useEffect(() => {
    const k = (e) => {
      if (e.key !== "Escape") return;
      if (plus !== null) setPlus(null);
      else if (cona) setCona(null);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [plus, cona]);

  const odpri = (c) => {
    setPlus(null);
    setPoudarjena(null);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCona(c.id);
      return;
    }
    setPrehod(c.tocka);
    setTimeout(() => {
      setCona(c.id);
      setPrehod(null);
    }, 420);
  };

  const zamenjaj = (c) => {
    setPlus(null);
    setCona(c?.id ?? null);
    if (vrh.current && vrh.current.getBoundingClientRect().top < 0) {
      vrh.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const podatki = (i) => {
    const b = izdelki[i.slug];
    return {
      naziv: b?.naziv ?? i.naziv,
      opis: b?.opis ?? null,
      slika: b?.slika ?? null,
      href: b?.href ?? `/iskanje?q=${encodeURIComponent(i.naziv)}`,
    };
  };

  return (
    <div className="res" ref={vrh}>
      {/* ---------- levi stolpec: seznam con ---------- */}
      <aside className="res-levo">
        <div className="res-crta" />
        <h2>{izbrana ? izbrana.naziv : "Kje se uporabljajo naša pritrdila"}</h2>
        <p>{izbrana ? izbrana.kratko : objekt.opis}</p>

        <nav className="res-cone" aria-label="Deli objekta">
          <button
            type="button"
            className={!izbrana ? "on" : ""}
            onClick={() => zamenjaj(null)}
          >
            <span>Celoten objekt</span>
          </button>
          {cone.map((c, i) => (
            <button
              key={c.id}
              type="button"
              className={(cona === c.id ? "on " : "") + (poudarjena === c.id ? "hov" : "")}
              onMouseEnter={() => !izbrana && setPoudarjena(c.id)}
              onMouseLeave={() => setPoudarjena(null)}
              onFocus={() => !izbrana && setPoudarjena(c.id)}
              onBlur={() => setPoudarjena(null)}
              onClick={() => (izbrana ? zamenjaj(c) : odpri(c))}
            >
              <em>{String(i + 1).padStart(2, "0")}</em>
              <span>{c.naziv}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* ---------- desno: prizor ---------- */}
      <div className="res-desno">
        {izbrana && (
          <div className="res-orodja">
            <button type="button" className="res-nazaj" onClick={() => zamenjaj(null)}>
              ← Celoten objekt
            </button>
            <span className="res-pot">
              {objekt.naslov} / <b>{izbrana.naziv}</b>
            </span>
            <span className="res-puscice">
              <button
                type="button"
                aria-label="Prejšnji del"
                onClick={() => zamenjaj(cone[(indeks - 1 + cone.length) % cone.length])}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Naslednji del"
                onClick={() => zamenjaj(cone[(indeks + 1) % cone.length])}
              >
                ›
              </button>
            </span>
          </div>
        )}

        {!izbrana ? (
          <div
            className={"res-prizor res-pregled" + (prehod ? " zoom" : "")}
            style={prehod ? { transformOrigin: `${prehod.x}% ${prehod.y}%` } : undefined}
          >
            <Image
              src={objekt.slika}
              alt={objekt.naslov}
              width={objekt.sirina}
              height={objekt.visina}
              sizes="(max-width: 1000px) 100vw, 75vw"
              priority
            />
            {cone.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={"res-plus res-plus-cona" + (poudarjena === c.id ? " hov" : "")}
                style={{ left: `${c.tocka.x}%`, top: `${c.tocka.y}%` }}
                onMouseEnter={() => setPoudarjena(c.id)}
                onMouseLeave={() => setPoudarjena(null)}
                onClick={() => odpri(c)}
                aria-label={c.naziv}
              >
                <i aria-hidden>+</i>
                <b className="res-st" aria-hidden>{i + 1}</b>
                <span className="res-oznaka">{c.naziv}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="res-prizor res-detajl" key={izbrana.id}>
            <Image
              src={izbrana.slika}
              alt={izbrana.naziv}
              width={1800}
              height={1004}
              sizes="(max-width: 1000px) 100vw, 75vw"
              priority
            />
            {izbrana.plusi.map((p, i) => {
              const odprt = plus === i;
              const desno = p.x > 58;
              const spodaj = p.y > 55;
              return (
                <div
                  key={i}
                  className={"res-plus-ovoj" + (odprt ? " odprt" : "")}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <button
                    type="button"
                    className={"res-plus" + (odprt ? " on" : "")}
                    onClick={() => setPlus(odprt ? null : i)}
                    aria-expanded={odprt}
                    aria-label={p.naslov}
                  >
                    <i aria-hidden>{odprt ? "×" : "+"}</i>
                  </button>
                  {odprt && (
                    <div
                      className={"res-kartica" + (desno ? " levo" : "") + (spodaj ? " gor" : "")}
                      role="dialog"
                      aria-label={p.naslov}
                    >
                      <div className="res-k-glava">
                        <b className="res-k-naslov">{p.naslov}</b>
                        <button type="button" className="res-k-zapri" aria-label="Zapri" onClick={() => setPlus(null)}>×</button>
                      </div>
                      {p.izdelki.map((iz) => {
                        const d = podatki(iz);
                        return (
                          <Link key={iz.slug} href={d.href} className="res-k-izdelek">
                            <span className="res-k-sl">
                              {d.slika ? (
                                <Image src={d.slika} alt="" fill sizes="64px" unoptimized={d.slika.startsWith("http")} style={{ objectFit: "contain", padding: 4, mixBlendMode: "multiply" }} />
                              ) : (
                                <span>{d.naziv.slice(0, 1)}</span>
                              )}
                            </span>
                            <span className="res-k-tx">
                              <b>{d.naziv}</b>
                              {d.opis && <span>{d.opis}</span>}
                            </span>
                            <span className="res-k-pus" aria-hidden>→</span>
                          </Link>
                        );
                      })}
                      {p.povezava && (
                        <Link href={p.povezava.href} className="res-k-vec">
                          {p.povezava.naziv} →
                        </Link>
                      )}
                      {p.igra && (
                        <Link href={p.igra.href} className="res-k-vec">
                          ▶ {p.igra.naziv}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <p className="res-namig">
          {izbrana
            ? "Kliknite plus za izdelke, ki se uporabljajo na tem mestu."
            : "Kliknite na del objekta ali na plus za podrobnejši pogled."}
        </p>

        {/* seznam izdelkov cone — tudi za telefon in iskalnike */}
        {izbrana && (
          <div className="res-seznam">
            {izbrana.plusi.map((p, i) => (
              <div key={i} className="res-seznam-sk">
                <b>{p.naslov}</b>
                <ul>
                  {p.izdelki.map((iz) => {
                    const d = podatki(iz);
                    return (
                      <li key={iz.slug}>
                        <Link href={d.href}>{d.naziv}</Link>
                      </li>
                    );
                  })}
                  {p.povezava && (
                    <li>
                      <Link href={p.povezava.href}>{p.povezava.naziv}</Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

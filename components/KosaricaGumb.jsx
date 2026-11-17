"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useKosarica, nastaviKolicino, odstrani } from "@/lib/kosarica";
import { eur } from "@/lib/cene";
import { prevedeno, useJezik } from "@/lib/i18n/odjemalec";

// Košarica v glavi: klik odpre majhno okno s postavkami (brez zapuščanja strani),
// od tam na blagajno ali na celotno košarico.
function KosaricaGumb() {
  const p = useKosarica();
  const { t } = useJezik();
  const [odprto, setOdprto] = useState(false);
  const ovoj = useRef(null);
  const pot = usePathname();
  const n = p.reduce((s, x) => s + x.kolicina, 0);
  const b2b = p.some((x) => x.b2b);
  const cena = (x) => (x.b2b ? x.cenaNeto ?? x.cenaBruto : x.cenaBruto);
  const skupaj = p.reduce((s, x) => s + (cena(x) ?? 0) * x.kolicina, 0);

  useEffect(() => setOdprto(false), [pot]);
  useEffect(() => {
    if (!odprto) return;
    const klik = (e) => ovoj.current && !ovoj.current.contains(e.target) && setOdprto(false);
    const tipka = (e) => e.key === "Escape" && setOdprto(false);
    document.addEventListener("mousedown", klik);
    document.addEventListener("keydown", tipka);
    return () => {
      document.removeEventListener("mousedown", klik);
      document.removeEventListener("keydown", tipka);
    };
  }, [odprto]);

  return (
    <span className="mk-ovoj" ref={ovoj}>
      <button type="button" className="kos-gumb" aria-label={`${t("Košarica")} (${n})`} aria-expanded={odprto} onClick={() => setOdprto(!odprto)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 8H6" />
          <circle cx="9" cy="20" r="1.4" />
          <circle cx="18" cy="20" r="1.4" />
        </svg>
        {n > 0 && <span>{n}</span>}
      </button>
      {odprto && (
        <>
          <span className="mk-ozadje" onClick={() => setOdprto(false)} aria-hidden="true" />
          <div className="mk" role="dialog" aria-label="Košarica">
            <div className="mk-gl">
              <b>Košarica</b>
              <span>{p.length} {p.length === 1 ? "artikel" : p.length === 2 ? "artikla" : p.length < 5 ? "artikli" : "artiklov"}</span>
              <button type="button" className="mk-x" aria-label="Zapri" onClick={() => setOdprto(false)}>×</button>
            </div>
            {p.length === 0 ? (
              <p className="mk-prazno">Košarica je prazna.</p>
            ) : (
              <>
                <ul className="mk-sez">
                  {p.map((x) => (
                    <li key={x.id}>
                      <span className="mk-sl">{x.slika ? <img src={x.slika} alt="" /> : null}</span>
                      <span className="mk-op">
                        <b>{x.naziv}{x.dimenzija ? ` ${x.dimenzija}` : ""}</b>
                        <small translate="no">{x.sifra}{x.kos > 1 ? ` · ${x.kos} kos` : ""}</small>
                        <span className="mk-st">
                          <button type="button" aria-label="Manj" disabled={x.kolicina <= 1} onClick={() => nastaviKolicino(x.id, x.kolicina - 1)}>−</button>
                          <em>{x.kolicina}</em>
                          <button type="button" aria-label="Več" onClick={() => nastaviKolicino(x.id, x.kolicina + 1)}>+</button>
                        </span>
                      </span>
                      <span className="mk-c">
                        {cena(x) != null ? eur(cena(x) * x.kolicina) : "—"}
                        <button type="button" className="mk-od" aria-label="Odstrani" onClick={() => odstrani(x.id)}>×</button>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mk-sk">
                  <span>Skupaj {b2b ? "brez DDV" : "z DDV"}</span>
                  <b>{eur(skupaj)}</b>
                </div>
                <div className="mk-gumbi">
                  <Link href="/kosarica" className="mk-g2">Ogled košarice</Link>
                  <Link href="/blagajna" className="mk-g1">Na blagajno →</Link>
                </div>
              </>
            )}
          </div>
        </>
      )}
    </span>
  );
}

export default prevedeno(KosaricaGumb);

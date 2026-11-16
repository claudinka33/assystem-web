"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { prevedeno, useJezik } from "@/lib/i18n/odjemalec";

const norm = (x) => String(x ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const KLJUC = "as_hitri_program";

function vsebuje(v, href) {
  return v.izdelki.some((i) => i.href === href) || v.otroci.some((o) => vsebuje(o, href));
}

function Vozel({ v, trenutni, q, globina }) {
  const imaTrenutnega = vsebuje(v, trenutni);
  const [odprto, setOdprto] = useState(imaTrenutnega);
  const izdelki = q ? v.izdelki.filter((i) => norm(i.naziv).includes(q)) : v.izdelki;
  const otroci = v.otroci.map((o) => <Vozel key={o.slug} v={o} trenutni={trenutni} q={q} globina={globina + 1} />);
  const zadetkiOtrok = q ? v.otroci.some(function z(o) { return o.izdelki.some((i) => norm(i.naziv).includes(q)) || o.otroci.some(z); }) : true;
  if (q && !izdelki.length && !zadetkiOtrok) return null;
  const vidno = q ? true : odprto;
  return (
    <li className={`hp-kat g${globina}${imaTrenutnega ? " akt" : ""}`}>
      <button type="button" className="hp-kat-gumb" onClick={() => setOdprto(!odprto)} aria-expanded={vidno}>
        <i>{vidno ? "▾" : "▸"}</i>
        <span>{v.naziv}</span>
      </button>
      {vidno && (
        <ul>
          {otroci}
          {izdelki.map((i) => (
            <li key={i.href}>
              <Link href={i.href} className={`hp-izd${i.href === trenutni ? " on" : ""}`} prefetch={false}>
                {i.naziv}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

// Plavajoč seznam vseh kategorij in izdelkov na strani izdelka (hiter skok na naslednji izdelek).
function HitriProgram({ drevo, trenutni }) {
  const { pot } = useJezik();
  const [odprto, setOdprto] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => {
    let odpri = false;
    try {
      odpri = localStorage.getItem(KLJUC) !== "0" && window.innerWidth > 1100; // privzeto odprto na računalniku
    } catch {}
    if (!odpri) return;
    const t = setTimeout(() => setOdprto(true), 0);
    return () => clearTimeout(t);
  }, []);
  const preklopi = (v) => {
    setOdprto(v);
    try {
      localStorage.setItem(KLJUC, v ? "1" : "0");
    } catch {}
  };
  const tr = useMemo(() => {
    // trenutna pot brez jezikovne predpone
    return String(trenutni || "");
  }, [trenutni]);
  const nq = norm(q.trim());
  return (
    <>
      {!odprto && (
        <button type="button" className="hp-zavihek" onClick={() => preklopi(true)} title="Prodajni program">
          <span>☰</span> Prodajni program
        </button>
      )}
      {odprto && (
        <aside className="hp-panel" aria-label="Prodajni program">
          <div className="hp-glava">
            <b>Prodajni program</b>
            <button type="button" onClick={() => preklopi(false)} aria-label="Zapri">✕</button>
          </div>
          <input className="hp-isk" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Išči izdelek …" />
          <ul className="hp-drevo">
            {drevo.map((v) => (
              <Vozel key={v.slug} v={v} trenutni={tr} q={nq} globina={0} />
            ))}
          </ul>
          <Link href={pot("/program")} className="hp-vse">Vse kategorije →</Link>
        </aside>
      )}
    </>
  );
}

export default prevedeno(HitriProgram);

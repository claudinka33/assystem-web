"use client";

import Link from "next/link";
import { useState } from "react";
import { prevedeno, useJezik } from "@/lib/i18n/odjemalec";

const norm = (x) => String(x ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

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

function Seznam({ drevo, trenutni, pot, zapri }) {
  const [q, setQ] = useState("");
  const nq = norm(q.trim());
  return (
    <>
      <div className="hp-glava">
        <b>Prodajni program</b>
        {zapri && <button type="button" onClick={zapri} aria-label="Zapri">✕</button>}
      </div>
      <input className="hp-isk" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Išči izdelek …" />
      <ul className="hp-drevo">
        {drevo.map((v) => (
          <Vozel key={v.slug} v={v} trenutni={trenutni} q={nq} globina={0} />
        ))}
      </ul>
      <Link href={pot("/program")} className="hp-vse">Vse kategorije →</Link>
    </>
  );
}

// Levi stolpec strani izdelka (računalnik) + izvlečni seznam na telefonu/tablici.
function HitriProgram({ drevo, trenutni }) {
  const { pot } = useJezik();
  const [odprto, setOdprto] = useState(false);
  return (
    <>
      <div className="hp-stolpec">
        <Seznam drevo={drevo} trenutni={trenutni} pot={pot} />
      </div>
      <button type="button" className="hp-zavihek" onClick={() => setOdprto(true)} title="Prodajni program">
        <span>☰</span> Prodajni program
      </button>
      {odprto && (
        <aside className="hp-panel" aria-label="Prodajni program">
          <Seznam drevo={drevo} trenutni={trenutni} pot={pot} zapri={() => setOdprto(false)} />
        </aside>
      )}
    </>
  );
}

export default prevedeno(HitriProgram);

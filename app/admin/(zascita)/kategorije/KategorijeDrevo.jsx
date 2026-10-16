"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { izbrisiKategorijo, shraniVrstniRedKategorij } from "@/lib/akcije/skupno";
import IzbrisiGumb from "../../IzbrisiGumb";

const Rocaj = () => (
  <svg width="14" height="18" viewBox="0 0 14 18" fill="currentColor" aria-hidden="true">
    {[3, 9, 15].map((y) => [4, 10].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />))}
  </svg>
);

function Puscica({ smer, onClick, disabled }) {
  return (
    <button type="button" className="ikona-gumb mini" onClick={onClick} disabled={disabled} title={smer === "gor" ? "Premakni gor" : "Premakni dol"}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {smer === "gor" ? <path d="m6 15 6-6 6 6" /> : <path d="m6 9 6 6 6-6" />}
      </svg>
    </button>
  );
}

// Seznam z vlečenjem za eno raven (glavne ali podkategorije enega starša).
function Raven({ zacetni, render, onShrani, razred }) {
  const [vrsta, setVrsta] = useState(zacetni);
  const vlecem = useRef(null);
  const [nad, setNad] = useState(null);

  function premakni(od, na) {
    if (od === na || od == null || na == null) return;
    const nova = [...vrsta];
    const [el] = nova.splice(od, 1);
    nova.splice(na, 0, el);
    setVrsta(nova);
    onShrani(nova.map((k) => k.id));
  }

  return (
    <div className={razred}>
      {vrsta.map((k, i) => (
        <div
          key={k.id}
          className={`kat-vlek${nad === i ? " nad" : ""}`}
          onDragOver={(e) => {
            if (vlecem.current == null) return;
            e.preventDefault();
            e.stopPropagation();
            setNad(i);
          }}
          onDragLeave={() => setNad((n) => (n === i ? null : n))}
          onDrop={(e) => {
            if (vlecem.current == null) return;
            e.preventDefault();
            e.stopPropagation();
            premakni(vlecem.current, i);
            vlecem.current = null;
            setNad(null);
          }}
        >
          {render(k, {
            rocaj: (
              <span
                className="kat-rocaj"
                draggable
                title="Povleci za premik"
                onDragStart={(e) => {
                  e.stopPropagation();
                  vlecem.current = i;
                  e.dataTransfer.effectAllowed = "move";
                  e.dataTransfer.setData("text/plain", String(k.id));
                }}
                onDragEnd={() => {
                  vlecem.current = null;
                  setNad(null);
                }}
              >
                <Rocaj />
              </span>
            ),
            puscici: (
              <span className="kat-puscici">
                <Puscica smer="gor" disabled={i === 0} onClick={() => premakni(i, i - 1)} />
                <Puscica smer="dol" disabled={i === vrsta.length - 1} onClick={() => premakni(i, i + 1)} />
              </span>
            ),
            mesto: i + 1,
          })}
        </div>
      ))}
    </div>
  );
}

function Vrstica({ k, stIzdelkov, podrejenih, otrok, rocaj, puscici, mesto }) {
  return (
    <div className={`kat-vrstica${otrok ? " otrok" : ""}${k.objavljeno ? "" : " skrita"}`}>
      {rocaj}
      <span className="kat-red" title="Mesto na strani">{mesto}</span>
      <span className="kat-slika">{k.slika ? <img src={k.slika} alt="" /> : <span className="brez" title="Ni slike" />}</span>
      <Link href={`/admin/kategorije/${k.id}`} className="kat-ime">
        <b>{k.naziv}</b>
        <small>/{k.slug}</small>
      </Link>
      <span className="kat-meta">
        {podrejenih > 0 && <span>{podrejenih} podkat.</span>}
        <span className={stIzdelkov ? "" : "nic"}>{stIzdelkov} izdelkov</span>
      </span>
      <span className={k.objavljeno ? "znacka da" : "znacka ne"}>{k.objavljeno ? "Objavljeno" : "Skrito"}</span>
      <span className="kat-akcije">
        {puscici}
        <a href={`/program/${k.slug}`} target="_blank" rel="noreferrer" className="ikona-gumb" title="Poglej na strani">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></svg>
        </a>
        <Link href={`/admin/kategorije/${k.id}`} className="gumb siv mini">Uredi</Link>
        <IzbrisiGumb
          action={izbrisiKategorijo}
          id={k.id}
          ime={k.naziv}
          opozorilo={stIzdelkov || podrejenih ? `Kategorija ima ${stIzdelkov} izdelkov in ${podrejenih} podkategorij.` : ""}
        />
      </span>
    </div>
  );
}

export default function KategorijeDrevo({ glavne, otroci, stIzd }) {
  const [stanje, setStanje] = useState(null); // null | "shranjujem" | "ok" | napaka
  const [, zacni] = useTransition();
  const casovnik = useRef(null);

  function shrani(ids) {
    setStanje("shranjujem");
    zacni(async () => {
      const r = await shraniVrstniRedKategorij(ids);
      setStanje(r?.ok ? "ok" : r?.napaka || "Napaka pri shranjevanju");
      clearTimeout(casovnik.current);
      if (r?.ok) casovnik.current = setTimeout(() => setStanje(null), 2500);
    });
  }

  return (
    <>
      <div className={`kat-stanje${stanje ? " vidno" : ""}${stanje && stanje !== "ok" && stanje !== "shranjujem" ? " napaka" : ""}`}>
        {stanje === "shranjujem" && "Shranjujem vrstni red …"}
        {stanje === "ok" && "✓ Vrstni red shranjen — velja tudi na spletni strani."}
        {stanje && stanje !== "ok" && stanje !== "shranjujem" && `Napaka: ${stanje}`}
      </div>

      <Raven
        razred="kat-seznam"
        zacetni={glavne}
        onShrani={shrani}
        render={(k, r) => {
          const pod = otroci[k.id] ?? [];
          const izd = (stIzd[k.id] ?? 0) + pod.reduce((s, p) => s + (stIzd[p.id] ?? 0), 0);
          return (
            <section className="kat-skupina">
              <Vrstica k={k} stIzdelkov={izd} podrejenih={pod.length} {...r} />
              {pod.length > 0 && (
                <Raven
                  zacetni={pod}
                  onShrani={shrani}
                  render={(p, rp) => (
                    <Vrstica k={p} stIzdelkov={stIzd[p.id] ?? 0} podrejenih={(otroci[p.id] ?? []).length} otrok {...rp} />
                  )}
                />
              )}
            </section>
          );
        }}
      />
    </>
  );
}

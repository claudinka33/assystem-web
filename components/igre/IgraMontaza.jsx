"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { dogodek } from "@/lib/dogodki";
import { C, Vzorci, Sveder, Vijacnik, Pihalka, Kladivo } from "./orodje";

/* --------------------------------------------------------------
   Splošna montažna igra. Vsak izdelek poda konfiguracijo:
   luknje, orodja, korake in risbo prizora (glej konfiguracije.jsx).

   Korak tipa "postavi" je skupen (en klik v prizor), ostali koraki
   se opravijo na vsaki luknji posebej:
     nacin "drzi"    – drži miško, napredek raste
     nacin "klik"    – en klik
     nacin "udarci"  – vsak klik je udarec (+korak)
   -------------------------------------------------------------- */

const W = 1200;
const ustreza = (k, id) => (Array.isArray(k.orodje) ? k.orodje.includes(id) : k.orodje === id);

function izmetZa(smer) {
  if (smer === 180) return () => ({ dx: (Math.random() - 0.5) * 150, dy: 30 + Math.random() * 100 });
  if (smer === 90) return () => ({ dx: 30 + Math.random() * 130, dy: (Math.random() - 0.5) * 120 });
  return () => ({ dx: (Math.random() - 0.5) * 160, dy: -30 - Math.random() * 100 });
}

export default function IgraMontaza({ cfg }) {
  const H = cfg.visina ?? 600;
  const m = cfg.koraki.length;
  const zacetne = () => cfg.luknje.map(() => Array(m).fill(0));

  const [nap, setNap] = useState(zacetne);
  const [orodje, setOrodje] = useState(null);
  const [misk, setMisk] = useState({ x: 600, y: 200 });
  const [dela, setDela] = useState(false);
  const [aktivna, setAktivna] = useState(null);
  const [delci, setDelci] = useState([]);
  const [izbire, setIzbire] = useState({});
  const [sporocilo, setSporocilo] = useState(null);
  const [napaka, setNapaka] = useState(false);
  const javljeno = useRef(false);

  const svgRef = useRef(null);
  const tik = useRef(null);
  const stevec = useRef(0);

  let korak = 0;
  while (korak < m && nap.every((r) => r[korak] >= 100)) korak++;
  const koncano = korak === m;
  const k = cfg.koraki[Math.min(korak, m - 1)];

  function povej(b, jeNapaka = false) { setSporocilo(b); setNapaka(jeNapaka); }

  const nastavi = useCallback((li, j, f) => {
    setNap((p) => p.map((r, i) => (i === li ? r.map((v, jj) => (jj === j ? f(v) : v)) : r)));
  }, []);

  function vrziDelce(x, y, koliko = 4, barva = "#b9b4a4") {
    const smer = izmetZa(cfg.smer ?? 0);
    const novi = Array.from({ length: koliko }, () => ({ k: stevec.current++, x, y, barva, r: 2 + Math.random() * 4, ...smer() }));
    setDelci((p) => [...p, ...novi]);
    setTimeout(() => setDelci((p) => p.filter((d) => !novi.includes(d))), 650);
  }

  function ustavi() {
    if (tik.current) clearInterval(tik.current);
    tik.current = null;
    setDela(false);
    setAktivna(null);
  }
  useEffect(() => () => { if (tik.current) clearInterval(tik.current); }, []);

  useEffect(() => {
    if (koncano && !javljeno.current) { javljeno.current = true; dogodek(cfg.dogodek ?? `igra_${cfg.id}_koncana`); }
  }, [koncano, cfg]);

  function tocka(e) {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
  }

  function najdiLuknjo(t) {
    let naj = -1, d0 = cfg.dosegZadetka ?? 110;
    cfg.luknje.forEach((l, i) => {
      const d = Math.hypot(t.x - l.x, t.y - l.y);
      if (d < d0) { d0 = d; naj = i; }
    });
    return naj;
  }

  const imeOrodja = (id) => cfg.orodja.find((o) => o.id === (Array.isArray(id) ? id[0] : id))?.naziv ?? String(id);

  function pritisk(e) {
    const t = tocka(e);
    setMisk(t);
    if (koncano) return;

    const izbrano = orodje ? cfg.orodja.find((o) => o.id === orodje) : null;

    // skupni korak (postavi element)
    if (k.tip === "postavi") {
      if (k.orodje && !izbrano) { povej(`Vzemi iz orodjarne: ${imeOrodja(k.orodje)}.`, true); return; }
      if (izbrano?.napaka) { povej(izbrano.napaka, true); return; }
      if (k.orodje && !ustreza(k, izbrano.id)) {
        povej(`Zdaj potrebuješ: ${imeOrodja(k.orodje)}.`, true);
        return;
      }
      if (k.obmocje && !k.obmocje(t)) return;
      setNap((p) => p.map((r) => r.map((v, j) => (j === korak ? 100 : v))));
      if (izbrano) setIzbire((p) => ({ ...p, [korak]: izbrano.id }));
      if (k.potrdilo) povej(k.potrdilo);
      return;
    }

    const li = najdiLuknjo(t);
    if (li < 0) return;
    if (!izbrano) { povej("Najprej vzemi orodje iz orodjarne.", true); return; }
    if (izbrano.napaka) { povej(izbrano.napaka, true); return; }

    if (!ustreza(k, izbrano.id)) {
      const kasneje = cfg.koraki.some((x, j) => j > korak && ustreza(x, izbrano.id));
      if (kasneje) povej(k.preskok ?? `Najprej: ${k.naziv.toLowerCase()}.`, true);
      return;
    }
    if (nap[li][korak] >= 100) return;

    const l = cfg.luknje[li];
    const j = korak;
    setIzbire((p) => ({ ...p, [j]: izbrano.id }));

    if (k.nacin === "klik") {
      nastavi(li, j, () => 100);
      return;
    }
    if (k.nacin === "udarci") {
      setAktivna(li);
      nastavi(li, j, (v) => Math.min(100, v + (k.korak ?? 25)));
      vrziDelce(l.x, l.y, 2, "#cfd3d6");
      return;
    }
    // drzi
    setAktivna(li);
    setDela(true);
    tik.current = setInterval(() => {
      if (k.delci) vrziDelce(l.x, l.y, 3, k.delci);
      setNap((p) => {
        const n = Math.min(100, p[li][j] + (k.korak ?? 6));
        if (n >= 100) setTimeout(ustavi, 0);
        return p.map((r, i) => (i === li ? r.map((v, jj) => (jj === j ? n : v)) : r));
      });
    }, 70);
  }

  function vzemi(o) {
    setOrodje(o.id);
    povej(o.izbrano ?? `${o.naziv} je v roki.`);
  }

  function ponovi() {
    ustavi(); setNap(zacetne()); setOrodje(null); setDelci([]); setIzbire({});
    setSporocilo(null); setNapaka(false); javljeno.current = false;
  }

  const stanje = { nap, korak, koncano, izbire, napKorak: (li, j) => nap[li][j] };

  // položaj orodja — med delom se pripne na luknjo
  const izbrano = orodje ? cfg.orodja.find((o) => o.id === orodje) : null;
  let poz = misk;
  if (aktivna != null && izbrano && cfg.prijem) {
    const p = cfg.prijem(izbrano.id, aktivna, stanje);
    if (p) poz = p;
  }
  const rot = izbrano?.brezRotacije ? 0 : (cfg.smer ?? 0);

  let navodilo = k.navodilo;
  if (k.orodje && !ustreza(k, orodje) && !koncano) navodilo = k.vzemi ?? `Vzemi iz orodjarne: ${imeOrodja(k.orodje)}.`;
  if (koncano) navodilo = cfg.konec?.kratko ?? "Pritrjeno.";

  const kick = cfg.kicker ?? {};

  return (
    <div className="igra">
      <ol className="igra-koraki" style={{ gridTemplateColumns: `repeat(${m}, 1fr)` }}>
        {cfg.koraki.map((x, i) => (
          <li key={x.naziv} className={i < korak ? "koncan" : i === korak ? "aktiven" : undefined}>
            <b>{i < korak ? "✓" : i + 1}</b>
            <span>{x.naziv}</span>
          </li>
        ))}
      </ol>

      <div className="igra-vrstica">
        <div className="igra-navodilo">
          <b>{koncano ? "Končano" : k.naziv}</b>
          <span>{navodilo}</span>
        </div>
        {sporocilo && !koncano && <p className={napaka ? "igra-napaka" : "igra-uspeh"}>{sporocilo}</p>}
      </div>

      <div className="igra-telo">
        <div className="prizor-okvir" style={{ maxWidth: `max(520px, calc((100svh - 300px) * ${W / H} + 28px))` }}>
          <svg
            ref={svgRef}
            className={`prizor${orodje && !koncano ? " z-orodjem" : ""}`}
            viewBox={`0 0 ${W} ${H}`}
            onPointerMove={(e) => setMisk(tocka(e))}
            onPointerDown={pritisk}
            onPointerUp={ustavi}
            onPointerLeave={ustavi}
          >
            <defs>
              <Vzorci />
              <clipPath id={`okvir-${cfg.id}`}>
                <rect x="0" y="0" width={W} height={H} rx="14" />
              </clipPath>
            </defs>

            <g clipPath={`url(#okvir-${cfg.id})`}>
              <rect x="0" y="0" width={W} height={H} fill="#fff" />

              {cfg.narisi(stanje)}

              {!koncano && (
                <g>
                  <rect x={kick.x ?? 40} y={(kick.y ?? 34)} width="6" height="40" fill={C.red} />
                  <text x={(kick.x ?? 40) + 18} y={(kick.y ?? 34) + 17} fill={C.red} fontSize="14" fontWeight="800" letterSpacing="2.4">
                    {cfg.nadnaslov ?? "PREREZ"}
                  </text>
                  <text x={(kick.x ?? 40) + 18} y={(kick.y ?? 34) + 39} fill={C.ink} fontSize="21" fontWeight="800" className="halo">
                    {cfg.naslovPrizora}
                  </text>
                </g>
              )}

              {delci.map((d) => (
                <circle key={d.k} cx={d.x} cy={d.y} r={d.r} fill={d.barva} className="delec"
                  style={{ "--dx": `${d.dx}px`, "--dy": `${d.dy}px` }} />
              ))}

              {izbrano && !koncano && (
                <g transform={`translate(${poz.x} ${poz.y}) rotate(${rot})`} pointerEvents="none">
                  {izbrano.risba === "sveder" && <Sveder sirina={izbrano.sirina} dolzina={izbrano.dolzina} dela={dela} oznaka={izbrano.oznaka} />}
                  {izbrano.risba === "vijacnik" && <Vijacnik dela={dela} />}
                  {izbrano.risba === "pihalka" && <Pihalka dela={dela} />}
                  {izbrano.risba === "kladivo" && <Kladivo udari={aktivna != null} />}
                  {izbrano.risba === "roka" && cfg.vRoki?.(izbrano.id)}
                </g>
              )}

              {koncano && (
                <g transform={`translate(${cfg.banner?.x ?? 40} ${cfg.banner?.y ?? 30})`}>
                  <rect x="0" y="0" width={cfg.banner?.sirina ?? 300} height="64" rx="32" fill={C.red} />
                  <circle cx="32" cy="32" r="22" fill="#fff" />
                  <path d="M21 32 L29 40 L44 24" fill="none" stroke={C.red} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="68" y="42" fill="#fff" fontSize="28" fontWeight="800" letterSpacing="1">{cfg.konec?.napis ?? "PRITRJENO"}</text>
                </g>
              )}
            </g>
          </svg>
        </div>

        <div className="orodjarna">
          <div className="orodjarna-skupina">
            <h4>Orodjarna</h4>
            <div className="orodjarna-gumbi">
              {cfg.orodja.map((o) => (
                <button key={o.id} type="button" className={orodje === o.id ? "izbran" : undefined} onClick={() => vzemi(o)}>
                  <i className={`ik-${o.ikona ?? o.risba}`} />{o.naziv}
                </button>
              ))}
            </div>
          </div>
          {cfg.podatki && (
            <div className="igra-podatki">
              <h4>Podatki za vgradnjo</h4>
              <dl>
                {cfg.podatki.map(([a, b]) => (
                  <div key={a}><dt>{a}</dt><dd>{b}</dd></div>
                ))}
              </dl>
            </div>
          )}
          {cfg.opomba && <p className="orodjarna-opomba">{cfg.opomba}</p>}
        </div>
      </div>

      {koncano && cfg.konec && (
        <div className="igra-konec">
          <h3>{cfg.konec.naslov}</h3>
          <p>{cfg.konec.besedilo}</p>
          <div className="igra-konec-gumbi">
            {(cfg.konec.povezave ?? []).map((p, i) => (
              <Link key={p.href} className={`b ${i === 0 ? "b-r" : "b-d"}`} href={p.href}>{p.label}</Link>
            ))}
            <button type="button" className="b b-d" onClick={ponovi}>Poskusi znova</button>
          </div>
        </div>
      )}

      {!koncano && <button type="button" className="igra-ponovi" onClick={ponovi}>Začni znova</button>}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { dogodek } from "@/lib/dogodki";

/* --------------------------------------------------------------
   Vaja sidranja. Cel prizor je en SVG s koordinatami 1200 × 520,
   zato so ograja, luknje, sidra in orodje vedno poravnani.
   -------------------------------------------------------------- */

const S = { w: 1200, h: 520, tla: 300 }; // tla = zgornji rob betona
const LUKNJE_X = [508, 566, 634, 692];
const GLOBINA = 92;   // globina izvrtine v enotah prizora
const SVEDRI = [8, 10, 12];

const SIDRA = [
  { id: "8x75", naziv: "TXH7 M8×75", premer: 8, opis: "Nadstreški, lažje konzole" },
  { id: "10x90", naziv: "TXH7 M10×90", premer: 10, opis: "Ograje, konzole, strojne noge", top: true },
  { id: "12x120", naziv: "TXH7 M12×120", premer: 12, opis: "Nosilci, težke obremenitve" },
];

const zacetne = LUKNJE_X.map((x, id) => ({
  id, x, globina: 0, prah: 100, sidro: null, zabitost: 0, zategnjenost: 0,
}));

export default function IgraSidranje() {
  const [luknje, setLuknje] = useState(zacetne);
  const [ograja, setOgraja] = useState(false);
  const [orodje, setOrodje] = useState(null);
  const [misk, setMisk] = useState({ x: 600, y: 200 });
  const [dela, setDela] = useState(false);
  const [delci, setDelci] = useState([]);
  const [sporocilo, setSporocilo] = useState(null);
  const [napaka, setNapaka] = useState(false);
  const [koncano, setKoncano] = useState(false);

  const svgRef = useRef(null);
  const tik = useRef(null);
  const stevec = useRef(0);
  const vrtanoZ = useRef(null);

  const vseIzvrtane = luknje.every((l) => l.globina >= 100);
  const vseIzpihane = luknje.every((l) => l.prah <= 0);
  const vseSidra = luknje.every((l) => l.sidro);
  const vseZabite = luknje.every((l) => l.zabitost >= 100);
  const vseZategnjene = luknje.every((l) => l.zategnjenost >= 100);

  const korak = !ograja ? 0 : !vseIzvrtane ? 1 : !vseIzpihane ? 2 : !vseSidra ? 3 : !vseZabite ? 4 : !vseZategnjene ? 5 : 6;

  const KORAKI = [
    ["Postavi ograjo", "Klikni na betonsko škarpo."],
    ["Izvrtaj luknje", orodje?.tip === "sveder" ? "Sveder je v roki. Postavi ga nad rdečo oznako in drži miško." : "Vzemi sveder — premer mora ustrezati sidru."],
    ["Izpihaj luknje", orodje?.tip === "pihalka" ? "Drži miško nad luknjo, dokler prah ne izgine." : "Vzemi pihalko."],
    ["Vstavi sidra", orodje?.tip === "sidro" ? "Klikni v vsako izpihano luknjo." : "Izberi sidro TXH7."],
    ["Zabij sidra", orodje?.tip === "kladivo" ? "Vsak klik je en udarec. Štirje udarci na sidro." : "Vzemi kladivo."],
    ["Zategni matice", orodje?.tip === "kljuc" ? "Drži miško nad matico, dokler ni zategnjena." : "Vzemi viličasti ključ."],
    ["Končano", "Ograja je pritrjena."],
  ];

  function povej(b, jeNapaka = false) { setSporocilo(b); setNapaka(jeNapaka); }

  const posodobi = useCallback((id, f) => {
    setLuknje((p) => p.map((l) => (l.id === id ? { ...l, ...f(l) } : l)));
  }, []);

  function vrziDelce(x, y, koliko = 4) {
    const novi = Array.from({ length: koliko }, () => ({
      k: stevec.current++, x, y,
      dx: (Math.random() - 0.5) * 150,
      dy: -30 - Math.random() * 90,
      r: 2 + Math.random() * 4.5,
    }));
    setDelci((p) => [...p, ...novi]);
    setTimeout(() => setDelci((p) => p.filter((d) => !novi.includes(d))), 650);
  }

  function ustavi() { if (tik.current) clearInterval(tik.current); tik.current = null; setDela(false); }
  useEffect(() => ustavi, []);

  useEffect(() => {
    if (korak === 6 && !koncano) { setKoncano(true); dogodek("igra_sidranje_koncana"); }
  }, [korak, koncano]);

  function tocka(e) {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return { x: 0, y: 0 };
    return {
      x: ((e.clientX - r.left) / r.width) * S.w,
      y: ((e.clientY - r.top) / r.height) * S.h,
    };
  }

  function premik(e) { setMisk(tocka(e)); }

  function najdiLuknjo(t) {
    return luknje.find((l) => Math.abs(t.x - l.x) < 34 && t.y > S.tla - 70);
  }

  function pritisk(e) {
    const t = tocka(e);
    setMisk(t);

    if (!ograja) {
      if (t.y > S.tla) {
        setOgraja(true);
        povej("Steber stoji na škarpi. Vzemi sveder iz orodjarne.");
      }
      return;
    }

    const l = najdiLuknjo(t);
    if (!l) return;
    if (!orodje) { povej("Najprej vzemi orodje iz orodjarne.", true); return; }

    if (orodje.tip === "sveder") {
      if (l.globina >= 100) return;
      vrtanoZ.current = orodje.premer;
      setDela(true);
      tik.current = setInterval(() => {
        vrziDelce(l.x, S.tla, 4);
        posodobi(l.id, (x) => {
          const n = Math.min(100, x.globina + 6);
          if (n >= 100) ustavi();
          return { globina: n };
        });
      }, 70);
      return;
    }

    if (orodje.tip === "pihalka") {
      if (l.globina < 100) { povej("Ta luknja še ni do konca izvrtana.", true); return; }
      if (l.prah <= 0) return;
      setDela(true);
      tik.current = setInterval(() => {
        posodobi(l.id, (x) => {
          const n = Math.max(0, x.prah - 9);
          if (n <= 0) ustavi();
          return { prah: n };
        });
      }, 70);
      return;
    }

    if (orodje.tip === "sidro") {
      if (l.globina < 100) { povej("V neizvrtano luknjo sidra ni mogoče vstaviti.", true); return; }
      if (l.prah > 0) { povej("Luknja je še polna prahu. Prah zniža nosilnost — najprej izpihaj.", true); return; }
      if (l.sidro) return;
      posodobi(l.id, () => ({ sidro: orodje.id }));
      return;
    }

    if (orodje.tip === "kladivo") {
      if (!l.sidro || l.zabitost >= 100) return;
      posodobi(l.id, (x) => ({ zabitost: Math.min(100, x.zabitost + 25) }));
      vrziDelce(l.x, S.tla - 6, 2);
      return;
    }

    if (orodje.tip === "kljuc") {
      if (l.zabitost < 100) { povej("Sidro mora biti najprej zabito do plošče.", true); return; }
      if (l.zategnjenost >= 100) return;
      setDela(true);
      tik.current = setInterval(() => {
        posodobi(l.id, (x) => {
          const n = Math.min(100, x.zategnjenost + 8);
          if (n >= 100) ustavi();
          return { zategnjenost: n };
        });
      }, 70);
    }
  }

  function vzemiSidro(s) {
    if (vrtanoZ.current && s.premer !== vrtanoZ.current) {
      povej(
        `Sidro ${s.naziv} zahteva izvrtino Ø${s.premer}, ti pa si vrtal z Ø${vrtanoZ.current}. ` +
          (s.premer > vrtanoZ.current
            ? "V premajhno izvrtino sidra ni mogoče vstaviti."
            : "V preveliki izvrtini se tulec ne razpre in sidro ne zagrabi betona."),
        true
      );
      return;
    }
    setOrodje({ tip: "sidro", id: s.id, premer: s.premer });
    povej(`${s.naziv} je v roki. Klikni v izpihano luknjo.`);
  }

  function ponovi() {
    ustavi(); setLuknje(zacetne); setOgraja(false); setOrodje(null);
    setDelci([]); setSporocilo(null); setNapaka(false); setKoncano(false);
    vrtanoZ.current = null;
  }

  const izbranoSidro = SIDRA.find((s) => s.id === luknje.find((l) => l.sidro)?.sidro);

  return (
    <div className="igra">
      <ol className="igra-koraki">
        {KORAKI.slice(0, 6).map(([naziv], i) => (
          <li key={naziv} className={i < korak ? "koncan" : i === korak ? "aktiven" : undefined}>
            <b>{String(i + 1).padStart(2, "0")}</b>
            <span>{naziv}</span>
          </li>
        ))}
      </ol>

      <div className="igra-navodilo">
        <b>{KORAKI[korak][0]}</b>
        <span>{KORAKI[korak][1]}</span>
      </div>

      {sporocilo && <p className={napaka ? "igra-napaka" : "igra-uspeh"}>{sporocilo}</p>}

      <svg
        ref={svgRef}
        className={`prizor${orodje ? " z-orodjem" : ""}`}
        viewBox={`0 0 ${S.w} ${S.h}`}
        onPointerMove={premik}
        onPointerDown={pritisk}
        onPointerUp={ustavi}
        onPointerLeave={ustavi}
      >
        <defs>
          <linearGradient id="nebo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dde2e6" />
            <stop offset="100%" stopColor="#f5f6f7" />
          </linearGradient>
          <linearGradient id="jeklo" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6f767c" />
            <stop offset="20%" stopColor="#ccd1d5" />
            <stop offset="42%" stopColor="#f1f3f4" />
            <stop offset="64%" stopColor="#b7bdc2" />
            <stop offset="100%" stopColor="#70777d" />
          </linearGradient>
          <linearGradient id="luknjaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#15171a" />
            <stop offset="100%" stopColor="#3f4448" />
          </linearGradient>
          <filter id="senca" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="7" dy="9" stdDeviation="7" floodColor="#2d3033" floodOpacity="0.32" />
          </filter>
        </defs>

        {/* nebo in beton */}
        <rect x="0" y="0" width={S.w} height={S.tla} fill="url(#nebo)" />
        <image href="/igra/beton.jpg" x="0" y={S.tla} width={S.w} height={S.h - S.tla} preserveAspectRatio="xMidYMid slice" />
        <rect x="0" y={S.tla} width={S.w} height="6" fill="#dcdedf" />
        <rect x="0" y={S.tla + 6} width={S.w} height="4" fill="#a9adaf" />

        {!ograja && (
          <g style={{ cursor: "pointer" }}>
            <rect x="0" y={S.tla} width={S.w} height={S.h - S.tla} fill="#cb2026" opacity="0.07" />
            <rect x="480" y={S.tla + 60} width="240" height="40" fill="#cb2026" />
            <text x="600" y={S.tla + 87} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="700" letterSpacing="1">
              POSTAVI OGRAJO
            </text>
          </g>
        )}

        {ograja && (
          <>
            {/* senca pod plosco */}
            <ellipse cx="600" cy={S.tla + 8} rx="150" ry="12" fill="#2d3033" opacity="0.22" />

            <g filter="url(#senca)">
              <rect x="150" y="120" width="900" height="15" fill="url(#jeklo)" />
              <rect x="150" y="215" width="900" height="15" fill="url(#jeklo)" />
              {[190, 250, 310, 370, 830, 890, 950, 1010].map((x) => (
                <g key={x}>
                  <rect x={x} y="70" width="13" height="225" rx="2" fill="url(#jeklo)" />
                  <polygon points={`${x - 4},72 ${x + 17},72 ${x + 6.5},48`} fill="#9aa1a7" />
                </g>
              ))}
              <rect x="578" y="40" width="44" height="245" rx="3" fill="url(#jeklo)" />
              <rect x="578" y="40" width="44" height="10" rx="2" fill="#e2e5e7" />
              <polygon points="578,246 548,285 578,285" fill="#9aa1a7" />
              <polygon points="622,246 652,285 622,285" fill="#8e959b" />
              <rect x="486" y="285" width="228" height="15" rx="2" fill="url(#jeklo)" />
              <rect x="486" y="285" width="228" height="3" fill="#f0f2f3" />
            </g>

            {/* luknje */}
            {luknje.map((l) => {
              const g = (l.globina / 100) * GLOBINA;
              return (
                <g key={l.id} style={{ cursor: "pointer" }}>
                  {/* tarca */}
                  <rect x={l.x - 34} y={S.tla - 26} width="68" height="130" fill="transparent" />

                  {l.globina === 0 && (
                    <>
                      <circle cx={l.x} cy={S.tla - 8} r="16" fill="#cb2026" opacity="0.2">
                        <animate attributeName="r" values="12;19;12" dur="1.6s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={l.x} cy={S.tla - 8} r="7" fill="#cb2026" />
                    </>
                  )}

                  {l.globina > 0 && !l.sidro && (
                    <>
                      <rect x={l.x - 7} y={S.tla} width="14" height={g} fill="url(#luknjaG)" />
                      <rect x={l.x - 7} y={S.tla} width="14" height="3" fill="#7a8085" />
                      {l.globina >= 100 && l.prah > 0 && (
                        <ellipse cx={l.x} cy={S.tla + 4} rx="22" ry="8" fill="#b3a98e" opacity={l.prah / 130} />
                      )}
                    </>
                  )}

                  {l.sidro && (
                    <g>
                      <image
                        href="/igra/sidro.png"
                        x={l.x - 11}
                        y={S.tla - 78 + l.zabitost * 0.16}
                        width="22"
                        height="136"
                        preserveAspectRatio="xMidYMid meet"
                      />
                      {l.zategnjenost > 0 && (
                        <g transform={`rotate(${l.zategnjenost * 3.6} ${l.x} ${S.tla - 62 + l.zabitost * 0.16})`}>
                          <rect
                            x={l.x - 9}
                            y={S.tla - 70 + l.zabitost * 0.16}
                            width="18"
                            height="14"
                            fill="none"
                            stroke="#1a7f3c"
                            strokeWidth="2.5"
                            opacity="0.7"
                          />
                        </g>
                      )}
                    </g>
                  )}
                </g>
              );
            })}

            {/* delci betona */}
            {delci.map((d) => (
              <circle
                key={d.k}
                cx={d.x}
                cy={d.y}
                r={d.r}
                fill="#b3a98e"
                style={{ "--dx": `${d.dx}px`, "--dy": `${d.dy}px` }}
                className="delec"
              />
            ))}
          </>
        )}

        {/* orodje v roki */}
        {orodje && (
          <g transform={`translate(${misk.x} ${misk.y})`} pointerEvents="none">
            {orodje.tip === "sveder" && (
              <g className={dela ? "trese" : undefined}>
                <rect x="-26" y="-150" width="52" height="54" rx="6" fill="#33383c" />
                <rect x="-8" y="-100" width="16" height="104" fill="#9aa1a7" />
                <path d="M-8,-96 L8,-86 L-8,-76 L8,-66 L-8,-56 L8,-46 L-8,-36 L8,-26 L-8,-16 L8,-6"
                      stroke="#eef1f2" strokeWidth="4" fill="none" />
                <polygon points="-8,4 8,4 0,16" fill="#c9ced2" />
                <rect x="30" y="-146" width="46" height="22" fill="#cb2026" />
                <text x="53" y="-130" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="800">
                  Ø{orodje.premer}
                </text>
              </g>
            )}

            {orodje.tip === "pihalka" && (
              <g className={dela ? "stiska" : undefined}>
                <ellipse cx="0" cy="-58" rx="30" ry="36" fill="#3c4145" />
                <rect x="-9" y="-28" width="18" height="34" rx="4" fill="#6d7479" />
                <polygon points="-7,6 7,6 3,22 -3,22" fill="#8b9297" />
              </g>
            )}

            {orodje.tip === "sidro" && (
              <image href="/igra/sidro.png" x="-11" y="-128" width="22" height="136" />
            )}

            {orodje.tip === "kladivo" && (
              <g>
                <rect x="-70" y="-116" width="86" height="30" rx="4" fill="#3c4145" />
                <rect x="-70" y="-116" width="86" height="8" rx="4" fill="#5b6165" />
                <rect x="-16" y="-92" width="17" height="96" rx="4" fill="#9c6f3c" transform="rotate(10)" />
              </g>
            )}

            {orodje.tip === "kljuc" && (
              <g className={dela ? "vrti" : undefined}>
                <rect x="-16" y="-14" width="110" height="26" rx="5" fill="#b9bfc4" />
                <path d="M-16,-22 L14,-22 L14,-8 L-2,-8 L-2,8 L14,8 L14,22 L-16,22 Z" fill="#9aa1a7" />
              </g>
            )}
          </g>
        )}

        {korak === 6 && (
          <g>
            <rect x="420" y="26" width="360" height="52" fill="#1a7f3c" />
            <text x="600" y="60" textAnchor="middle" fill="#fff" fontSize="24" fontWeight="800" letterSpacing="1">
              OGRAJA DRŽI
            </text>
          </g>
        )}
      </svg>

      {/* ---------------- orodjarna ---------------- */}
      <div className="orodjarna">
        <div className="orodjarna-skupina">
          <h4>Svedri</h4>
          <div className="orodjarna-gumbi">
            {SVEDRI.map((p) => (
              <button
                key={p}
                type="button"
                className={orodje?.tip === "sveder" && orodje.premer === p ? "izbran" : undefined}
                onClick={() => { setOrodje({ tip: "sveder", premer: p }); povej(`V vrtalnik je vpet sveder Ø${p}.`); }}
              >
                <i className="ik-sveder" />Ø{p}
              </button>
            ))}
          </div>
        </div>

        <div className="orodjarna-skupina">
          <h4>Orodje</h4>
          <div className="orodjarna-gumbi">
            <button type="button" className={orodje?.tip === "pihalka" ? "izbran" : undefined}
              onClick={() => { setOrodje({ tip: "pihalka" }); povej("Pihalka je v roki. Drži miško nad luknjo."); }}>
              <i className="ik-pihalka" />Pihalka
            </button>
            <button type="button" className={orodje?.tip === "kladivo" ? "izbran" : undefined}
              onClick={() => { setOrodje({ tip: "kladivo" }); povej("Kladivo je v roki. Vsak klik je en udarec."); }}>
              <i className="ik-kladivo" />Kladivo
            </button>
            <button type="button" className={orodje?.tip === "kljuc" ? "izbran" : undefined}
              onClick={() => { setOrodje({ tip: "kljuc" }); povej("Ključ je v roki. Drži miško nad matico."); }}>
              <i className="ik-kljuc" />Ključ
            </button>
          </div>
        </div>

        <div className="orodjarna-skupina sidra">
          <h4>Sidra TXH7</h4>
          <div className="orodjarna-gumbi">
            {SIDRA.map((s) => (
              <button key={s.id} type="button"
                className={`sidro-gumb${orodje?.tip === "sidro" && orodje.id === s.id ? " izbran" : ""}`}
                onClick={() => vzemiSidro(s)}>
                <b>{s.naziv}</b>
                {s.top && <em>top izbor</em>}
                <span>{s.opis}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {korak === 6 && (
        <div className="igra-konec">
          <h3>Ograja je pritrjena</h3>
          <p>
            Vsa štiri sidra so izvrtana s pravim svedrom, izpihana, zabita do
            plošče in zategnjena. Prav izpih izvrtine je korak, ki ga na gradbišču
            največkrat izpustijo — in prav ta najbolj zniža nosilnost pritrditve.
          </p>
          <div className="igra-konec-gumbi">
            <Link className="b b-r" href="/program/pritrdila-za-beton">Poglej sidra TXH7</Link>
            <Link className="b b-d" href="/kontakt?vir=igra">Zahtevaj ponudbo</Link>
            <button type="button" className="b b-d" onClick={ponovi}>Poskusi znova</button>
          </div>
        </div>
      )}

      {korak !== 6 && (
        <button type="button" className="igra-ponovi" onClick={ponovi}>Začni znova</button>
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { dogodek } from "@/lib/dogodki";

/* --------------------------------------------------------------
   Prodajna polica ASfix — izbira širine 1 m, 2 m ali 4 m.
   Škatla AFR41 je široka 237 mm, zato gre na tekoči meter
   štiri škatle. Polica je visoka 2 m in ima šest polic.
   -------------------------------------------------------------- */

const SIRINE = [
  { id: "1m", naziv: "1 m", metri: 1, opis: "Za manjše trgovine in pulte" },
  { id: "2m", naziv: "2 m", metri: 2, opis: "Najpogostejša izbira", top: true },
  { id: "4m", naziv: "4 m", metri: 4, opis: "Za gradbene centre" },
];

// šest polic, od zgoraj navzdol
const POLICE = [
  { naziv: "Jeklena sidra TXH7", opis: "M8 – M16 · ocena ETA" },
  { naziv: "Turbo vijaki", opis: "Ø6 – Ø10 · brez vložka" },
  { naziv: "Zidni vložki", opis: "Ø5 – Ø14 · najlon" },
  { naziv: "Udarni vijaki", opis: "Ø5 – Ø10 · hitra montaža" },
  { naziv: "Univerzalni vložek z vijakom", opis: "Komplet za vse podlage" },
  { naziv: "Mešani paket", opis: "Najbolj prodajane dimenzije" },
];

const NA_METER = 4; // škatel na tekoči meter

export default function PolicaAsfix() {
  const [sirina, setSirina] = useState(SIRINE[1]);

  const naPolico = NA_METER * sirina.metri;
  const skupaj = naPolico * POLICE.length;

  // merilo prizora
  const sirinaPolice = 260 * sirina.metri; // 1 m = 260 enot
  const visina = 520; // 2 m
  const w = sirinaPolice + 120;
  const h = visina + 150;

  function izberi(s) {
    setSirina(s);
    dogodek("polica_izbrana", { sirina: s.id });
  }

  return (
    <div className="polica">
      <div className="polica-izbira">
        {SIRINE.map((s) => (
          <button
            key={s.id}
            type="button"
            className={sirina.id === s.id ? "izbran" : undefined}
            onClick={() => izberi(s)}
          >
            <b>{s.naziv}</b>
            {s.top && <em>najpogosteje</em>}
            <span>{s.opis}</span>
          </button>
        ))}
      </div>

      <div className="polica-prizor">
        <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Prodajna polica ASfix, širina ${sirina.naziv}`}>
          <defs>
            <linearGradient id="kovinaP" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#eceef0" />
              <stop offset="45%" stopColor="#c4c9cd" />
              <stop offset="100%" stopColor="#8f969b" />
            </linearGradient>
            <linearGradient id="hrbet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f1f2f3" />
              <stop offset="100%" stopColor="#dfe1e3" />
            </linearGradient>
            <filter id="sencaP" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#2d3033" floodOpacity="0.22" />
            </filter>
          </defs>

          {/* tla */}
          <rect x="0" y={h - 26} width={w} height="26" fill="#e7e9ea" />
          <ellipse cx={w / 2} cy={h - 24} rx={sirinaPolice / 1.7} ry="12" fill="#2d3033" opacity="0.12" />

          {/* hrbtna stena regala */}
          <rect x="60" y="120" width={sirinaPolice} height={visina} fill="url(#hrbet)" />

          {/* banner nad polico */}
          <g filter="url(#sencaP)">
            <rect x="52" y="34" width={sirinaPolice + 16} height="74" fill="#cb2026" />
            <rect x="52" y="34" width={sirinaPolice + 16} height="6" fill="#3f4140" />
            <image
              href="/logo-asfix.png"
              x="74"
              y="50"
              height="40"
              width="150"
              preserveAspectRatio="xMinYMid meet"
            />
            <text x={sirinaPolice + 52} y="70" textAnchor="end" fill="#fff" fontSize="20" fontWeight="800" letterSpacing="1">
              PRITRDILNA TEHNIKA
            </text>
            <text x={sirinaPolice + 52} y="92" textAnchor="end" fill="#fff" fontSize="12.5" opacity="0.85" letterSpacing="1.4">
              SIDRA · VLOŽKI · VIJAKI · KEMIČNA SIDRA
            </text>
          </g>

          {/* police s škatlami */}
          {POLICE.map((p, i) => {
            const yPolica = 120 + (i + 1) * (visina / POLICE.length);
            const visinaPredala = visina / POLICE.length;
            const skatlaW = (sirinaPolice - 16) / naPolico;
            const skatlaH = Math.min(visinaPredala - 26, skatlaW * 1.02);

            return (
              <g key={p.naziv}>
                {/* škatle */}
                {Array.from({ length: naPolico }).map((_, n) => (
                  <image
                    key={n}
                    href="/polica/skatla.png"
                    x={68 + n * skatlaW}
                    y={yPolica - 10 - skatlaH}
                    width={skatlaW - 2}
                    height={skatlaH}
                    preserveAspectRatio="xMidYMax meet"
                  />
                ))}

                {/* polica */}
                <rect x="60" y={yPolica - 10} width={sirinaPolice} height="9" fill="url(#kovinaP)" />
                <rect x="60" y={yPolica - 1} width={sirinaPolice} height="4" fill="#7f868b" />

                {/* cenovna letvica z nazivom skupine */}
                <rect x="60" y={yPolica + 3} width={sirinaPolice} height="17" fill="#3f4140" />
                <text x="72" y={yPolica + 15.5} fill="#fff" fontSize="11" fontWeight="700" letterSpacing="0.6">
                  {p.naziv.toUpperCase()}
                </text>
                <text x={sirinaPolice + 52} y={yPolica + 15.5} textAnchor="end" fill="#c9ced2" fontSize="10">
                  {p.opis}
                </text>
              </g>
            );
          })}

          {/* stranska nosilca */}
          <rect x="48" y="108" width="14" height={visina + 26} fill="url(#kovinaP)" />
          <rect x={60 + sirinaPolice} y="108" width="14" height={visina + 26} fill="url(#kovinaP)" />

          {/* kotirna crta sirine */}
          <g stroke="#9ba0a5" strokeWidth="1.5">
            <line x1="48" y1={h - 44} x2={74 + sirinaPolice} y2={h - 44} />
            <line x1="48" y1={h - 50} x2="48" y2={h - 38} />
            <line x1={74 + sirinaPolice} y1={h - 50} x2={74 + sirinaPolice} y2={h - 38} />
          </g>
          <rect x={w / 2 - 34} y={h - 55} width="68" height="22" fill="#f5f6f7" />
          <text x={w / 2} y={h - 39} textAnchor="middle" fill="#3f4140" fontSize="14" fontWeight="800">
            {sirina.naziv}
          </text>
        </svg>
      </div>

      <div className="polica-podatki">
        <dl>
          <div>
            <dt>Širina police</dt>
            <dd>{sirina.naziv}</dd>
          </div>
          <div>
            <dt>Višina</dt>
            <dd>2 m</dd>
          </div>
          <div>
            <dt>Število polic</dt>
            <dd>{POLICE.length}</dd>
          </div>
          <div>
            <dt>Škatel na polico</dt>
            <dd>{naPolico}</dd>
          </div>
          <div>
            <dt>Škatel skupaj</dt>
            <dd>{skupaj}</dd>
          </div>
        </dl>

        <div className="polica-gumbi">
          <Link className="b b-r" href={`/kontakt?vir=polica&izdelek=Prodajna%20polica%20ASfix%20${sirina.naziv}`}>
            Zahtevaj ponudbo za polico
          </Link>
          <Link className="b b-d" href="/program">
            Poglej program
          </Link>
        </div>
      </div>
    </div>
  );
}

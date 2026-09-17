"use client";

import Link from "next/link";
import { useState } from "react";
import { dogodek } from "@/lib/dogodki";

/* --------------------------------------------------------------
   Prodajno mesto ASfix — zgoraj banner, pod njim perforirana stena
   z obešenimi vrečkami, spodaj police s škatlami in cenovnimi
   letvicami. Širina 1 m, 2 m ali 4 m.
   -------------------------------------------------------------- */

const SIRINE = [
  { id: "1m", naziv: "1 m", stolpci: 4, opis: "Za manjše trgovine in pulte" },
  { id: "2m", naziv: "2 m", stolpci: 8, opis: "Najpogostejša izbira", top: true },
  { id: "4m", naziv: "4 m", stolpci: 16, opis: "Za gradbene centre" },
];

const SKUPINE = [
  "Jeklena sidra TXH7",
  "Turbo vijaki",
  "Zidni vložki",
  "Udarni vijaki",
  "Univerzalni vložek",
  "Kemična sidra",
  "Vložki za gips",
  "Okvirni vložki",
];

const POLICE = [
  { naziv: "Jeklena sidra TXH7", opis: "M8 – M16 · ocena ETA" },
  { naziv: "Turbo vijaki in udarni vijaki", opis: "Ø5 – Ø10" },
  { naziv: "Zidni vložki in univerzalni vložki", opis: "Ø5 – Ø14" },
];

const STOLPEC = 62;   // širina enega stolpca vrečk
const VRSTE = 5;      // vrste obešenih vrečk

export default function PolicaAsfix() {
  const [sirina, setSirina] = useState(SIRINE[1]);

  const sirinaRegala = sirina.stolpci * STOLPEC;
  const y = { banner: 0, stena: 104, police: 384, tla: 660 };
  const w = sirinaRegala + 60;
  const h = 700;

  const vrecke = sirina.stolpci * VRSTE;
  const skatle = sirina.stolpci * POLICE.length;

  function izberi(s) {
    setSirina(s);
    dogodek("polica_izbrana", { sirina: s.id });
  }

  return (
    <div className="polica">
      <div className="polica-izbira">
        {SIRINE.map((s) => (
          <button key={s.id} type="button" className={sirina.id === s.id ? "izbran" : undefined} onClick={() => izberi(s)}>
            <b>{s.naziv}</b>
            {s.top && <em>najpogosteje</em>}
            <span>{s.opis}</span>
          </button>
        ))}
      </div>

      <div className="polica-prizor">
        <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Prodajno mesto ASfix, širina ${sirina.naziv}`}>
          <defs>
            <pattern id="perforacija" width="14" height="14" patternUnits="userSpaceOnUse">
              <rect width="14" height="14" fill="#d5d8da" />
              <circle cx="7" cy="7" r="2.1" fill="#9aa0a4" />
              <circle cx="7" cy="6.2" r="2.1" fill="#b8bcbf" />
            </pattern>
            <linearGradient id="kovinaP" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f2f3f4" />
              <stop offset="40%" stopColor="#c7ccd0" />
              <stop offset="100%" stopColor="#8b9297" />
            </linearGradient>
            <linearGradient id="tlaG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#dcdfe1" />
              <stop offset="100%" stopColor="#eef0f1" />
            </linearGradient>
            <filter id="sencaR" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="7" stdDeviation="8" floodColor="#2d3033" floodOpacity="0.28" />
            </filter>
            <filter id="sencaBlaga" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#2d3033" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* tla */}
          <rect x="0" y={y.tla} width={w} height={h - y.tla} fill="url(#tlaG)" />

          {/* ---------- banner nad regalom ---------- */}
          <g filter="url(#sencaR)">
            <rect x="24" y="10" width={sirinaRegala + 12} height="82" fill="#3f4140" />
            <rect x="24" y="10" width={sirinaRegala + 12} height="4" fill="#5a5d5c" />

            {/* rdeč naslovni blok */}
            <rect x="40" y="26" width={Math.min(300, sirinaRegala * 0.42)} height="50" fill="#cb2026" />
            <text x={40 + Math.min(300, sirinaRegala * 0.42) / 2} y="48" textAnchor="middle" fill="#fff" fontSize="17" fontWeight="800" letterSpacing="1">
              PRITRDILNA TEHNIKA
            </text>
            <text x={40 + Math.min(300, sirinaRegala * 0.42) / 2} y="66" textAnchor="middle" fill="#fff" fontSize="10.5" opacity="0.9" letterSpacing="1.6">
              SIDRA · VLOŽKI · VIJAKI
            </text>

            {/* fotografija izdelka na bannerju */}
            <image
              href="/polica/sidro-vodoravno.png"
              x={40 + Math.min(300, sirinaRegala * 0.42) + 24}
              y="30"
              width={Math.min(260, sirinaRegala * 0.3)}
              height="42"
              preserveAspectRatio="xMidYMid meet"
            />

            {/* bel blok z logotipom */}
            <rect x={sirinaRegala - 104} y="24" width="124" height="54" fill="#fff" />
            <image href="/logo-asfix.png" x={sirinaRegala - 94} y="34" width="104" height="34" preserveAspectRatio="xMidYMid meet" />
          </g>

          {/* ---------- perforirana stena ---------- */}
          <rect x="30" y={y.stena} width={sirinaRegala} height={y.police - y.stena} fill="url(#perforacija)" />

          {/* naslovna letvica skupin */}
          <rect x="30" y={y.stena} width={sirinaRegala} height="20" fill="#2f3231" />
          {Array.from({ length: sirina.stolpci }).map((_, i) => (
            <g key={i}>
              <text
                x={30 + i * STOLPEC + 6}
                y={y.stena + 13.5}
                fill="#e8eaeb"
                fontSize="7.5"
                letterSpacing="0.3"
              >
                {SKUPINE[i % SKUPINE.length].slice(0, 15)}
              </text>
              {i > 0 && <rect x={30 + i * STOLPEC} y={y.stena} width="1" height="20" fill="#565958" />}
            </g>
          ))}

          {/* obešene vrečke */}
          {Array.from({ length: sirina.stolpci }).map((_, i) =>
            Array.from({ length: VRSTE }).map((_, v) => {
              const rdeca = i % 2 === 0;
              const sirinaV = rdeca ? 40 : 46;
              return (
                <g key={`${i}-${v}`}>
                  {/* kavelj */}
                  <rect x={30 + i * STOLPEC + STOLPEC / 2 - 1} y={y.stena + 24 + v * 48} width="2" height="10" fill="#8b9297" />
                  <image
                    href={rdeca ? "/polica/vrecka-rdeca.png" : "/polica/vrecka-uvs.png"}
                    x={30 + i * STOLPEC + (STOLPEC - sirinaV) / 2}
                    y={y.stena + 30 + v * 48}
                    width={sirinaV}
                    height="46"
                    preserveAspectRatio="xMidYMin meet"
                  />
                </g>
              );
            })
          )}

          {/* ---------- police s škatlami ---------- */}
          {POLICE.map((p, i) => {
            const visinaPredala = (y.tla - y.police) / POLICE.length;
            const yPolica = y.police + (i + 1) * visinaPredala;
            const skatlaW = sirinaRegala / sirina.stolpci;
            const skatlaH = Math.min(visinaPredala - 30, skatlaW * 1.0);

            return (
              <g key={p.naziv}>
                {/* zadnja stena predala */}
                <rect x="30" y={yPolica - visinaPredala} width={sirinaRegala} height={visinaPredala} fill="#e4e7e8" />

                {/* škatle */}
                {Array.from({ length: sirina.stolpci }).map((_, n) => (
                  <image
                    key={n}
                    href="/polica/skatla.png"
                    x={30 + n * skatlaW + 2}
                    y={yPolica - 22 - skatlaH}
                    width={skatlaW - 4}
                    height={skatlaH}
                    preserveAspectRatio="xMidYMax meet"
                  />
                ))}

                {/* polica */}
                <rect x="26" y={yPolica - 22} width={sirinaRegala + 8} height="9" fill="url(#kovinaP)" />
                <rect x="26" y={yPolica - 13} width={sirinaRegala + 8} height="3" fill="#7f868b" />

                {/* cenovna letvica */}
                <rect x="26" y={yPolica - 10} width={sirinaRegala + 8} height="20" fill="#2f3231" />
                <text x="38" y={yPolica + 4} fill="#fff" fontSize="10.5" fontWeight="700" letterSpacing="0.5">
                  {p.naziv.toUpperCase()}
                </text>
                <text x={sirinaRegala + 26} y={yPolica + 4} textAnchor="end" fill="#b9bdbf" fontSize="9.5">
                  {p.opis}
                </text>

                {/* rumene cenovne etikete */}
                {Array.from({ length: sirina.stolpci }).map((_, n) => (
                  <rect key={n} x={30 + n * skatlaW + skatlaW / 2 - 12} y={yPolica - 7} width="24" height="14" fill="#f5c518" rx="1" />
                ))}
              </g>
            );
          })}

          {/* stranska nosilca */}
          <rect x="18" y={y.stena - 6} width="12" height={y.tla - y.stena + 12} fill="url(#kovinaP)" />
          <rect x={30 + sirinaRegala} y={y.stena - 6} width="12" height={y.tla - y.stena + 12} fill="url(#kovinaP)" />
          <rect x="14" y={y.tla} width="20" height="10" fill="#8b9297" />
          <rect x={26 + sirinaRegala} y={y.tla} width="20" height="10" fill="#8b9297" />
          <ellipse cx={w / 2} cy={y.tla + 14} rx={sirinaRegala / 1.9} ry="10" fill="#2d3033" opacity="0.14" />

          {/* kotirna črta */}
          <g stroke="#9ba0a5" strokeWidth="1.5">
            <line x1="18" y1={h - 22} x2={42 + sirinaRegala} y2={h - 22} />
            <line x1="18" y1={h - 28} x2="18" y2={h - 16} />
            <line x1={42 + sirinaRegala} y1={h - 28} x2={42 + sirinaRegala} y2={h - 16} />
          </g>
          <rect x={w / 2 - 30} y={h - 33} width="60" height="22" fill="#eef0f1" />
          <text x={w / 2} y={h - 17} textAnchor="middle" fill="#3f4140" fontSize="14" fontWeight="800">
            {sirina.naziv}
          </text>
        </svg>
      </div>

      <div className="polica-podatki">
        <dl>
          <div>
            <dt>Širina</dt>
            <dd>{sirina.naziv}</dd>
          </div>
          <div>
            <dt>Višina</dt>
            <dd>2 m</dd>
          </div>
          <div>
            <dt>Vrečk na steni</dt>
            <dd>{vrecke}</dd>
          </div>
          <div>
            <dt>Škatel na policah</dt>
            <dd>{skatle}</dd>
          </div>
          <div>
            <dt>Skupin izdelkov</dt>
            <dd>{Math.min(sirina.stolpci, SKUPINE.length)}</dd>
          </div>
        </dl>

        <div className="polica-gumbi">
          <Link className="b b-r" href={`/kontakt?vir=polica&izdelek=Prodajno%20mesto%20ASfix%20${sirina.naziv}`}>
            Zahtevaj ponudbo
          </Link>
          <Link className="b b-d" href="/program">
            Poglej program
          </Link>
        </div>
      </div>
    </div>
  );
}

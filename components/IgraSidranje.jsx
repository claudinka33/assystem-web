"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { dogodek } from "@/lib/dogodki";

/* --------------------------------------------------------------
   Vaja sidranja — prerez v slogu montažnih videov ASfix.
   Cel prizor je en SVG (1200 × 660). Sidro, luknja in mere so
   narisani v merilu: K točk prizora = 1 mm.
   -------------------------------------------------------------- */

const S = { w: 1200, h: 600, tla: 370 }; // tla = zgornji rob betona
const K = 2.2;                            // točk na milimeter
const PLOSCA = 10 * K;                    // debelina podložne plošče (10 mm)
const VRH_PLOSCE = S.tla - PLOSCA;
const LUKNJE_X = [470, 730];
const SVEDRI = [8, 10, 12];

// Katalog AS 2025 — TXH7
const H1 = { 8: 65, 10: 70, 12: 90 };     // globina izvrtine
const HNOM = { 8: 55, 10: 60, 12: 80 };   // globina vgradnje
const MOMENT = { 8: 23, 10: 45, 12: 65 }; // moment zatezanja

const SIDRA = [
  { id: "8x75", naziv: "TXH7 M8×75", premer: 8, dolzina: 75, opis: "Nadstreški, lažje konzole" },
  { id: "10x90", naziv: "TXH7 M10×90", premer: 10, dolzina: 90, opis: "Ograje, konzole, strojne noge", top: true },
  { id: "12x120", naziv: "TXH7 M12×120", premer: 12, dolzina: 120, opis: "Nosilci, težke obremenitve" },
];

const C = { red: "#CB2026", ink: "#3F4140", dark: "#1B1E21", jeklo: "#B4BABF", jekloS: "#D5D9DC", luknja: "#2A2D30" };

const zacetne = LUKNJE_X.map((x, id) => ({
  id, x, globina: 0, premer: null, prah: 100, sidro: null, zabitost: 0, zategnjenost: 0,
}));

/* ---------- tekstura betona (deterministična, enaka ob vsakem renderju) ---------- */
function rng(seed) {
  let s = seed;
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
}
const BETON = (() => {
  const r = rng(11);
  const pike = Array.from({ length: 70 }, () => ({
    x: r() * 180, y: r() * 180, r: 0.8 + r() * 2.2, c: r() < 0.55 ? "#9fa3a6" : "#e2e4e5",
  }));
  const kamni = Array.from({ length: 9 }, () => {
    const cx = r() * 180, cy = r() * 180, v = 5 + r() * 7, n = 6;
    const tocke = Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2, rr = v * (0.7 + r() * 0.5);
      return `${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr * 0.8).toFixed(1)}`;
    }).join(" ");
    return { tocke, c: r() < 0.5 ? "#aeb2b5" : "#b9bcbf" };
  });
  return { pike, kamni };
})();

/* ---------- geometrija sidra v luknji ---------- */
function geo(l, s) {
  const d = s.premer, dw = d * K;
  const baseBot = S.tla + HNOM[d] * K;
  const prot = 20 * K * (1 - l.zabitost / 100);  // pred zabijanjem gleda 20 mm ven
  const lift = 3 * K * (l.zategnjenost / 100);   // pri zatezanju se palica dvigne
  const rodBot = baseBot - prot - lift;
  const coneH = 1.3 * dw, clipH = 1.5 * dw;
  const wH0 = 2.2 * K, nH0 = 0.8 * dw;
  // navoj gleda nad matico 3 mm (po zatezanju 6 mm) — enako pri vseh velikostih
  const dolzinaVidna = (baseBot - 3 * K) - (VRH_PLOSCE - wH0 - nH0 - 6 * K);
  const rodTop = rodBot - dolzinaVidna;
  const clipBot = baseBot - prot - coneH * 0.4;
  const wH = 2.2 * K, nH = 0.8 * dw;
  const washerBot = VRH_PLOSCE - prot;
  const nutBot = washerBot - wH, nutTop = nutBot - nH;
  return { d, dw, rodBot, rodTop, coneH, clipH, clipBot, wH, nH, washerBot, nutBot, nutTop, nutW: 1.75 * dw };
}

function SidroRisba({ x, g, zat }) {
  const { dw, rodBot, rodTop, coneH, clipH, clipBot, wH, washerBot, nutBot, nutTop, nutW } = g;
  const neckW = dw * 0.6;
  const shaftW = dw * 0.9;
  const neckTop = rodBot - coneH - clipH - 8; // vrat je del palice in se dviga z njo
  const navoj = [];
  for (let y = rodTop + 4; y < rodTop + (rodBot - rodTop) * 0.42; y += 5) {
    navoj.push(<line key={y} x1={x - shaftW / 2} y1={y + 2} x2={x + shaftW / 2} y2={y - 1.5} stroke="#7c8287" strokeWidth="1.3" />);
  }
  const razpr = (zat / 100) * dw * 0.28;
  return (
    <g>
      {/* palica */}
      <rect x={x - shaftW / 2} y={rodTop} width={shaftW} height={neckTop - rodTop} fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" />
      {navoj}
      {/* vrat */}
      <rect x={x - neckW / 2} y={neckTop} width={neckW} height={rodBot - coneH - neckTop} fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" />
      {/* stožec */}
      <polygon
        points={`${x - neckW / 2},${rodBot - coneH} ${x + neckW / 2},${rodBot - coneH} ${x + dw / 2},${rodBot} ${x - dw / 2},${rodBot}`}
        fill="#9aa0a5" stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* razpršna objemka */}
      <polygon
        points={`${x - dw * 0.5},${clipBot - clipH} ${x + dw * 0.5},${clipBot - clipH} ${x + dw * 0.52 + razpr},${clipBot} ${x - dw * 0.52 - razpr},${clipBot}`}
        fill={C.jekloS} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round"
      />
      <line x1={x} y1={clipBot - clipH + 3} x2={x} y2={clipBot} stroke={C.ink} strokeWidth="1.2" />
      {/* podložka in matica */}
      <rect x={x - dw * 1.05} y={washerBot - wH} width={dw * 2.1} height={wH} fill={C.jekloS} stroke={C.ink} strokeWidth="1.5" />
      <rect x={x - nutW / 2} y={nutTop} width={nutW} height={nutBot - nutTop} rx="1.5" fill="#a3a9ae" stroke={C.ink} strokeWidth="1.5" />
      <line x1={x - nutW * 0.22} y1={nutTop} x2={x - nutW * 0.22} y2={nutBot} stroke={C.ink} strokeWidth="1" />
      <line x1={x + nutW * 0.22} y1={nutTop} x2={x + nutW * 0.22} y2={nutBot} stroke={C.ink} strokeWidth="1" />
    </g>
  );
}

/* ---------- orodje (konica orodja je v izhodišču 0,0) ---------- */
function Sveder({ premer, dela }) {
  const bw = premer * K;
  const bl = H1[premer] * K + PLOSCA + 14;
  const vijacnica = [];
  for (let y = -bl + 12; y < -14; y += 9) {
    vijacnica.push(<line key={y} x1={-bw / 2} y1={y + 3} x2={bw / 2} y2={y - 4} stroke="#e4e7e9" strokeWidth="2.4" />);
  }
  const ch = -bl;
  return (
    <g className={dela ? "trese" : undefined}>
      <rect x={-bw / 2} y={-bl} width={bw} height={bl - 9} fill="#9ea4a9" stroke={C.ink} strokeWidth="1.5" />
      {vijacnica}
      <polygon points={`${-bw / 2},-9 ${bw / 2},-9 0,1`} fill="#c9ced2" stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="-19" y={ch - 30} width="38" height="30" rx="4" fill={C.ink} />
      <rect x="-19" y={ch - 20} width="38" height="4" fill="#5d6164" />
      <rect x="-36" y={ch - 98} width="72" height="70" rx="14" fill={C.dark} />
      <rect x="-36" y={ch - 72} width="72" height="14" fill={C.red} />
      <rect x="30" y={ch - 92} width="96" height="30" rx="10" fill={C.dark} />
      <rect x="62" y={ch - 56} width="58" height="26" rx="4" fill={C.red} />
      <text x="91" y={ch - 37} textAnchor="middle" fill="#fff" fontSize="17" fontWeight="800">Ø{premer}</text>
    </g>
  );
}

function Pihalka({ dela }) {
  return (
    <g>
      <rect x="-4" y="-78" width="8" height="74" fill={C.ink} />
      <polygon points="-4,-4 4,-4 2,2 -2,2" fill={C.ink} />
      <rect x="-11" y="-88" width="22" height="12" rx="3" fill={C.dark} />
      <g transform="translate(0 -88)">
        <g className={dela ? "stisni" : undefined}>
          <ellipse cx="0" cy="-40" rx="30" ry="40" fill={C.red} stroke="#8f151b" strokeWidth="2" />
          <ellipse cx="-10" cy="-54" rx="8" ry="14" fill="#fff" opacity=".28" />
        </g>
      </g>
    </g>
  );
}

function Kladivo({ udari }) {
  return (
    <g transform="translate(176 -26)">
      <g className={udari ? "udari" : undefined}>
        <g transform="translate(-176 26)">
          <rect x="16" y="-34" width="166" height="16" rx="7" fill="#8a6239" stroke={C.ink} strokeWidth="1.5" />
          <rect x="124" y="-36" width="60" height="20" rx="8" fill={C.dark} />
          <rect x="-22" y="-54" width="44" height="54" rx="4" fill={C.ink} />
          <rect x="-22" y="-40" width="44" height="11" fill={C.red} />
          <rect x="-24" y="-6" width="48" height="6" rx="2" fill="#5d6164" />
        </g>
      </g>
    </g>
  );
}

function Kljuc({ dela, nutW }) {
  const sir = nutW + 12;
  return (
    <g className={dela ? "zateguj" : undefined}>
      <rect x={-sir / 2} y="-11" width={sir} height="22" rx="4" fill={C.jekloS} stroke={C.ink} strokeWidth="1.5" />
      <rect x={sir / 2 - 2} y="-7" width="170" height="14" rx="5" fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" />
      <rect x={sir / 2 + 96} y="-10" width="76" height="20" rx="8" fill={C.red} />
    </g>
  );
}

function Mera({ x, y1, y2, napis, strani = 1 }) {
  const t = 7;
  return (
    <g className="mera">
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={C.red} strokeWidth="2" />
      <line x1={x - t} y1={y1} x2={x + t} y2={y1} stroke={C.red} strokeWidth="2" />
      <line x1={x - t} y1={y2} x2={x + t} y2={y2} stroke={C.red} strokeWidth="2" />
      <text x={x + strani * 12} y={(y1 + y2) / 2 + 6} textAnchor={strani > 0 ? "start" : "end"} fill={C.red} fontSize="17" fontWeight="800" className="halo">
        {napis}
      </text>
    </g>
  );
}

export default function IgraSidranje() {
  const [luknje, setLuknje] = useState(zacetne);
  const [ograja, setOgraja] = useState(false);
  const [orodje, setOrodje] = useState(null);
  const [misk, setMisk] = useState({ x: 600, y: 200 });
  const [dela, setDela] = useState(false);
  const [aktivna, setAktivna] = useState(null);
  const [delci, setDelci] = useState([]);
  const [sporocilo, setSporocilo] = useState(null);
  const [napaka, setNapaka] = useState(false);
  const [koncano, setKoncano] = useState(false);

  const svgRef = useRef(null);
  const tik = useRef(null);
  const stevec = useRef(0);

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

  function vrziDelce(x, y, koliko = 4, barva = "#b9b4a4") {
    const novi = Array.from({ length: koliko }, () => ({
      k: stevec.current++, x, y, barva,
      dx: (Math.random() - 0.5) * 160,
      dy: -30 - Math.random() * 100,
      r: 2 + Math.random() * 4,
    }));
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
    return luknje.find((l) => Math.abs(t.x - l.x) < 46 && t.y > 80);
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
      const drugi = luknje.find((x) => x.premer && x.premer !== orodje.premer);
      if (drugi) {
        povej(`Obe luknji vrtaj z istim svedrom — začel si z Ø${drugi.premer}.`, true);
        return;
      }
      setAktivna(l.id);
      setDela(true);
      tik.current = setInterval(() => {
        vrziDelce(l.x, VRH_PLOSCE, 4);
        posodobi(l.id, (x) => {
          const n = Math.min(100, x.globina + 5);
          if (n >= 100) ustavi();
          return { globina: n, premer: orodje.premer };
        });
      }, 70);
      return;
    }

    if (orodje.tip === "pihalka") {
      if (l.globina < 100) { povej("Ta luknja še ni do konca izvrtana.", true); return; }
      if (l.prah <= 0) return;
      setAktivna(l.id);
      setDela(true);
      tik.current = setInterval(() => {
        vrziDelce(l.x, VRH_PLOSCE, 3, "#d8d2c0");
        posodobi(l.id, (x) => {
          const n = Math.max(0, x.prah - 8);
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
      setAktivna(l.id);
      posodobi(l.id, (x) => ({ zabitost: Math.min(100, x.zabitost + 25) }));
      vrziDelce(l.x, VRH_PLOSCE - 30, 2, "#cfd3d6");
      return;
    }

    if (orodje.tip === "kljuc") {
      if (!l.sidro) return;
      if (l.zabitost < 100) { povej("Sidro mora biti najprej zabito do plošče.", true); return; }
      if (l.zategnjenost >= 100) return;
      setAktivna(l.id);
      setDela(true);
      tik.current = setInterval(() => {
        posodobi(l.id, (x) => {
          const n = Math.min(100, x.zategnjenost + 7);
          if (n >= 100) ustavi();
          return { zategnjenost: n };
        });
      }, 70);
    }
  }

  function vzemiSidro(s) {
    const vrtano = luknje.find((l) => l.premer)?.premer;
    if (vrtano && s.premer !== vrtano) {
      povej(
        `Sidro ${s.naziv} zahteva izvrtino Ø${s.premer}, ti pa si vrtal z Ø${vrtano}. ` +
          (s.premer > vrtano
            ? "V premajhno izvrtino sidra ni mogoče vstaviti."
            : "V preveliki izvrtini se objemka ne razpre in sidro ne zagrabi betona."),
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
  }

  const sidroOd = (l) => SIDRA.find((s) => s.id === l.sidro);
  const vRoki = orodje?.tip === "sidro" ? SIDRA.find((s) => s.id === orodje.id) : null;

  /* položaj orodja: med delom se pripne na luknjo */
  let poz = misk;
  const al = aktivna != null ? luknje.find((l) => l.id === aktivna) : null;
  if (al && orodje) {
    if (orodje.tip === "sveder") poz = { x: al.x, y: al.globina > 0 ? S.tla + (al.globina / 100) * H1[orodje.premer] * K : VRH_PLOSCE };
    if (orodje.tip === "pihalka") poz = { x: al.x, y: VRH_PLOSCE + 46 };
    if (al.sidro && (orodje.tip === "kladivo" || orodje.tip === "kljuc")) {
      const g = geo(al, sidroOd(al));
      poz = orodje.tip === "kladivo" ? { x: al.x, y: g.rodTop } : { x: al.x, y: (g.nutTop + g.nutBot) / 2 };
    }
  }
  const nutWroka = (al?.sidro ? geo(al, sidroOd(al)).nutW : null) ?? 1.75 * (luknje.find((l) => l.premer)?.premer ?? 10) * K;

  return (
    <div className="igra">
      <ol className="igra-koraki">
        {KORAKI.slice(0, 6).map(([naziv], i) => (
          <li key={naziv} className={i < korak ? "koncan" : i === korak ? "aktiven" : undefined}>
            <b>{i < korak ? "✓" : i + 1}</b>
            <span>{naziv}</span>
          </li>
        ))}
      </ol>

      <div className="igra-vrstica">
        <div className="igra-navodilo">
          <b>{KORAKI[korak][0]}</b>
          <span>{KORAKI[korak][1]}</span>
        </div>
        {sporocilo && <p className={napaka ? "igra-napaka" : "igra-uspeh"}>{sporocilo}</p>}
      </div>

      <div className="igra-telo">
      <div className="prizor-okvir">
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
            <pattern id="betonVzorec" width="180" height="180" patternUnits="userSpaceOnUse">
              {BETON.kamni.map((k, i) => (
                <polygon key={`k${i}`} points={k.tocke} fill={k.c} stroke="#8f9396" strokeWidth="1" />
              ))}
              {BETON.pike.map((p, i) => (
                <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r} fill={p.c} />
              ))}
            </pattern>
            <clipPath id="okvirPrizora">
              <rect x="0" y="0" width={S.w} height={S.h} rx="14" />
            </clipPath>
          </defs>

          <g clipPath="url(#okvirPrizora)">
            {/* ozadje in beton v prerezu */}
            <rect x="0" y="0" width={S.w} height={S.h} fill="#fff" />
            <rect x="0" y={S.tla} width={S.w} height={S.h - S.tla} fill="#c6c9cb" />
            <rect x="0" y={S.tla} width={S.w} height={S.h - S.tla} fill="url(#betonVzorec)" />
            <line x1="0" y1={S.tla} x2={S.w} y2={S.tla} stroke={C.ink} strokeWidth="3" />
            <text x="28" y={S.h - 24} fill={C.ink} fontSize="18" fontWeight="800" letterSpacing="3" className="halo">BETON</text>

            {/* nadnaslov kot v videu */}
            {korak < 6 && (
              <g>
                <rect x="40" y="34" width="6" height="40" fill={C.red} />
                <text x="58" y="51" fill={C.red} fontSize="14" fontWeight="800" letterSpacing="2.4">PREREZ</text>
                <text x="58" y="73" fill={C.ink} fontSize="21" fontWeight="800">Sidro TXH7 v beton</text>
              </g>
            )}

            {!ograja && (
              <g style={{ cursor: "pointer" }}>
                <rect x="0" y={S.tla} width={S.w} height={S.h - S.tla} fill={C.red} opacity="0.08" />
                <rect x="460" y={S.tla + 110} width="280" height="56" rx="28" fill={C.red} />
                <text x="600" y={S.tla + 145} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800" letterSpacing="1.5">
                  POSTAVI OGRAJO
                </text>
              </g>
            )}

            {ograja && (
              <>
                {/* ograja — ploski slog */}
                <g stroke={C.ink} strokeWidth="2" strokeLinejoin="round">
                  {[110, 170, 230, 290, 897, 957, 1017, 1077].map((x) => (
                    <g key={x}>
                      <rect x={x} y="128" width="14" height="214" fill={C.jeklo} />
                      <polygon points={`${x - 4},128 ${x + 18},128 ${x + 7},104`} fill="#9aa0a5" />
                    </g>
                  ))}
                  <rect x="60" y="168" width="1080" height="16" fill={C.jekloS} />
                  <rect x="60" y="272" width="1080" height="16" fill={C.jekloS} />
                  <rect x="575" y="92" width="50" height={VRH_PLOSCE - 92} fill={C.jeklo} />
                  <rect x="571" y="84" width="58" height="12" rx="2" fill="#9aa0a5" />
                  <polygon points={`575,${VRH_PLOSCE - 48} 540,${VRH_PLOSCE} 575,${VRH_PLOSCE}`} fill="#9aa0a5" />
                  <polygon points={`625,${VRH_PLOSCE - 48} 660,${VRH_PLOSCE} 625,${VRH_PLOSCE}`} fill="#9aa0a5" />
                  <rect x="380" y={VRH_PLOSCE} width="440" height={PLOSCA} fill="#a3a9ae" />
                </g>

                {/* luknje */}
                {luknje.map((l) => {
                  const pr = l.premer ?? 10;
                  const hw = pr * K + 3;
                  const dno = S.tla + (l.globina / 100) * H1[pr] * K;
                  const s = sidroOd(l);
                  const g = s ? geo(l, s) : null;
                  const levo = l.id === 0;
                  const stran = levo ? -1 : 1;
                  return (
                    <g key={l.id} style={{ cursor: "pointer" }}>
                      <rect x={l.x - 46} y="80" width="92" height={S.h - 80} fill="transparent" />

                      {l.globina === 0 && (
                        <>
                          <circle cx={l.x} cy={VRH_PLOSCE - 2} r="16" fill={C.red} opacity="0.22">
                            <animate attributeName="r" values="11;20;11" dur="1.6s" repeatCount="indefinite" />
                          </circle>
                          <circle cx={l.x} cy={VRH_PLOSCE - 2} r="7" fill={C.red} />
                        </>
                      )}

                      {l.globina > 0 && (
                        <rect x={l.x - hw / 2} y={VRH_PLOSCE} width={hw} height={dno - VRH_PLOSCE} fill={C.luknja} />
                      )}

                      {/* prah v luknji */}
                      {l.globina >= 100 && l.prah > 0 && !l.sidro && (
                        <g opacity={0.35 + l.prah / 155}>
                          {Array.from({ length: Math.ceil(l.prah / 7) }, (_, i) => (
                            <circle key={i} cx={l.x + (((i * 37) % 10) / 10 - 0.5) * hw * 0.75} cy={dno - 4 - ((i * 11) % 46)} r={1.6 + (i % 3) * 0.7} fill="#d8d2c0" />
                          ))}
                          <ellipse cx={l.x} cy={VRH_PLOSCE} rx={10 + l.prah / 6} ry="6" fill="#cfc8b3" />
                        </g>
                      )}

                      {/* mere izvrtine */}
                      {levo && l.globina >= 100 && !l.sidro && (
                        <>
                          <Mera x={l.x - hw / 2 - 20} y1={S.tla} y2={dno} napis={`h₁ = ${H1[pr]} mm`} strani={-1} />
                          <text x={l.x} y={dno + 26} textAnchor="middle" fill={C.red} fontSize="17" fontWeight="800" className="halo">Ø{pr} mm</text>
                        </>
                      )}

                      {g && (
                        <>
                          <SidroRisba x={l.x} g={g} zat={l.zategnjenost} />

                          {levo && (
                            <text x={l.x - 44} y={Math.max(g.nutTop - 8, 314)} textAnchor="end" fill={C.ink} fontSize="16" fontWeight="800" className="halo">
                              {s.naziv}
                            </text>
                          )}

                          {levo && l.zabitost >= 100 && l.zategnjenost === 0 && (
                            <Mera x={l.x - hw / 2 - 20} y1={S.tla} y2={S.tla + HNOM[s.premer] * K} napis={`h_nom = ${HNOM[s.premer]} mm`} strani={-1} />
                          )}

                          {/* razpiranje objemke */}
                          {l.zategnjenost > 0 && (
                            <g fill={C.red}>
                              {[-1, 1].map((sm) => {
                                const y = g.clipBot - g.clipH / 2;
                                const x0 = l.x + sm * (g.dw / 2 + 4);
                                const dl = 10 + (l.zategnjenost / 100) * 14;
                                return (
                                  <g key={sm}>
                                    <line x1={x0} y1={y} x2={x0 + sm * dl} y2={y} stroke={C.red} strokeWidth="3" />
                                    <polygon points={`${x0 + sm * (dl + 9)},${y} ${x0 + sm * dl},${y - 6} ${x0 + sm * dl},${y + 6}`} />
                                  </g>
                                );
                              })}
                              <text x={l.x + stran * (g.dw / 2 + 40)} y={g.clipBot - g.clipH / 2 + 6} textAnchor={levo ? "end" : "start"} fontSize="16" fontWeight="800" className="halo">
                                objemka se razpre
                              </text>
                            </g>
                          )}

                          {/* moment zatezanja */}
                          {l.zategnjenost > 0 && (
                            <g>
                              <path
                                d={`M ${l.x - g.nutW / 2 - 12} ${(g.nutTop + g.nutBot) / 2} A ${g.nutW / 2 + 12} 11 0 0 0 ${l.x + g.nutW / 2 + 12} ${(g.nutTop + g.nutBot) / 2}`}
                                fill="none" stroke={C.red} strokeWidth="3"
                              />
                              <polygon
                                points={`${l.x + g.nutW / 2 + 12},${(g.nutTop + g.nutBot) / 2 - 9} ${l.x + g.nutW / 2 + 5},${(g.nutTop + g.nutBot) / 2 + 3} ${l.x + g.nutW / 2 + 19},${(g.nutTop + g.nutBot) / 2 + 3}`}
                                fill={C.red}
                              />
                              <text x={l.x + g.dw / 2 + 12} y={S.tla + 28} textAnchor="start" fill={C.red} fontSize="17" fontWeight="800" className="halo">
                                {l.zategnjenost >= 100 ? "✓ " : ""}{MOMENT[s.premer]} Nm
                              </text>
                            </g>
                          )}
                        </>
                      )}
                    </g>
                  );
                })}

                {/* delci */}
                {delci.map((d) => (
                  <circle
                    key={d.k}
                    cx={d.x}
                    cy={d.y}
                    r={d.r}
                    fill={d.barva}
                    style={{ "--dx": `${d.dx}px`, "--dy": `${d.dy}px` }}
                    className="delec"
                  />
                ))}
              </>
            )}

            {/* orodje v roki */}
            {orodje && korak < 6 && (
              <g transform={`translate(${poz.x} ${poz.y})`} pointerEvents="none">
                {orodje.tip === "sveder" && <Sveder premer={orodje.premer} dela={dela} />}
                {orodje.tip === "pihalka" && <Pihalka dela={dela} />}
                {orodje.tip === "kladivo" && <Kladivo udari={aktivna != null} />}
                {orodje.tip === "kljuc" && <Kljuc dela={dela} nutW={nutWroka} />}
                {vRoki && (() => {
                  const g = geo({ zabitost: 0, zategnjenost: 0 }, vRoki);
                  return (
                    <g transform={`translate(0 ${-g.rodBot})`}>
                      <SidroRisba x={0} g={g} zat={0} />
                    </g>
                  );
                })()}
              </g>
            )}

            {korak === 6 && (
              <g>
                <rect x="40" y="30" width="336" height="64" rx="32" fill={C.red} />
                <circle cx="72" cy="62" r="22" fill="#fff" />
                <path d="M61 62 L69 70 L84 54" fill="none" stroke={C.red} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                <text x="108" y="72" fill="#fff" fontSize="28" fontWeight="800" letterSpacing="1">OGRAJA DRŽI</text>
              </g>
            )}
          </g>
        </svg>
      </div>

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
                <b>{s.naziv}{s.top && <em>top izbor</em>}</b>
                <span>{s.opis}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>

      {korak === 6 && (
        <div className="igra-konec">
          <h3>Ograja je pritrjena</h3>
          <p>
            Obe sidri sta izvrtani s pravim svedrom, izpihani, zabiti do
            plošče in zategnjeni s predpisanim momentom. Prav izpih izvrtine je korak, ki ga na gradbišču
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

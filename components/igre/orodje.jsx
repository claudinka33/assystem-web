/* Skupne risbe za montažne igre ASfix (slog montažnih videov).
   Vsako orodje je narisano s konico v izhodišču (0,0), obrnjeno navzdol. */

export const C = {
  red: "#CB2026", ink: "#3F4140", dark: "#1B1E21",
  jeklo: "#B4BABF", jekloS: "#D5D9DC", luknja: "#2A2D30",
  najlon: "#ECEAE4", les: "#C99A62", lesT: "#A97B45", prah: "#D8D2C0",
};

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

/** Vzorci: url(#v-beton), url(#v-zid), url(#v-les) */
export function Vzorci() {
  return (
    <>
      <pattern id="v-beton" width="180" height="180" patternUnits="userSpaceOnUse">
        <rect width="180" height="180" fill="#c6c9cb" />
        {BETON.kamni.map((k, i) => <polygon key={`k${i}`} points={k.tocke} fill={k.c} stroke="#8f9396" strokeWidth="1" />)}
        {BETON.pike.map((p, i) => <circle key={`p${i}`} cx={p.x} cy={p.y} r={p.r} fill={p.c} />)}
      </pattern>
      <pattern id="v-zid" width="120" height="60" patternUnits="userSpaceOnUse">
        <rect width="120" height="60" fill="#e6dcd0" />
        <rect x="2" y="2" width="116" height="26" fill="#c9876a" />
        <rect x="-58" y="32" width="116" height="26" fill="#c08064" />
        <rect x="62" y="32" width="116" height="26" fill="#c08064" />
      </pattern>
      <pattern id="v-les" width="160" height="40" patternUnits="userSpaceOnUse">
        <rect width="160" height="40" fill={C.les} />
        <path d="M0 9 C40 5 80 14 160 8 M0 22 C50 26 100 17 160 23 M0 33 C60 30 110 37 160 32" stroke={C.lesT} strokeWidth="1.6" fill="none" />
      </pattern>
    </>
  );
}

export function Sveder({ sirina = 16, dolzina = 220, dela, oznaka }) {
  const bw = sirina, bl = dolzina;
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
      {oznaka && (
        <g>
          <rect x="58" y={ch - 56} width="64" height="26" rx="4" fill={C.red} />
          <text x="90" y={ch - 37} textAnchor="middle" fill="#fff" fontSize="17" fontWeight="800">{oznaka}</text>
        </g>
      )}
    </g>
  );
}

export function Vijacnik({ dela }) {
  return (
    <g>
      <g className={dela ? "trese" : undefined}>
        <rect x="-4" y="-40" width="8" height="40" fill="#9ea4a9" stroke={C.ink} strokeWidth="1.3" />
        <rect x="-15" y="-66" width="30" height="26" rx="4" fill={C.ink} />
        <rect x="-34" y="-140" width="68" height="76" rx="14" fill={C.dark} />
        <rect x="-34" y="-112" width="68" height="13" fill={C.red} />
        <rect x="28" y="-134" width="88" height="28" rx="10" fill={C.dark} />
      </g>
      {dela && (
        <path d="M -28 -20 A 30 10 0 0 0 28 -20" fill="none" stroke={C.red} strokeWidth="3" />
      )}
    </g>
  );
}

export function Pihalka({ dela }) {
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

export function Kladivo({ udari }) {
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

/** Rdeča puščica od (x1,y1) do (x2,y2) */
export function Puscica({ x1, y1, x2, y2 }) {
  const a = Math.atan2(y2 - y1, x2 - x1), d = 9, s = 6;
  const bx = x2 - Math.cos(a) * d, by = y2 - Math.sin(a) * d;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={C.red} strokeWidth="3" />
      <polygon
        points={`${x2},${y2} ${bx - Math.sin(a) * s},${by + Math.cos(a) * s} ${bx + Math.sin(a) * s},${by - Math.cos(a) * s}`}
        fill={C.red}
      />
    </g>
  );
}

/** Napis z belim robom (berljiv čez teksturo) */
export function Napis({ x, y, children, barva = C.red, velikost = 16, sidro = "start", teza = 800 }) {
  return (
    <text x={x} y={y} textAnchor={sidro} fill={barva} fontSize={velikost} fontWeight={teza} className="halo">
      {children}
    </text>
  );
}

/** Navoj vijaka: cikcak robovi, faza se premika z napredkom (videz vrtenja) */
export function NavojVijaka({ x, y1, y2, sirina, korak = 7, faza = 0, barva = C.jeklo }) {
  const h = sirina / 2, z = sirina * 0.18;
  const tocke = [];
  const od = y1 + ((faza % korak) + korak) % korak;
  tocke.push(`${x - h + z},${y1}`);
  for (let y = od; y < y2; y += korak) tocke.push(`${x - h},${y}`, `${x - h + z},${Math.min(y2, y + korak / 2)}`);
  tocke.push(`${x - h + z},${y2}`, `${x + h - z},${y2}`);
  const desno = [];
  for (let y = od; y < y2; y += korak) desno.push(`${x + h},${y}`, `${x + h - z},${Math.min(y2, y + korak / 2)}`);
  desno.reverse();
  return <polygon points={[...tocke, ...desno, `${x + h - z},${y1}`].join(" ")} fill={barva} stroke={C.ink} strokeWidth="1.3" strokeLinejoin="round" />;
}

/** Kotirna mera (navpična ali vodoravna) z rdečim napisom */
export function Mera({ x1, y1, x2, y2, napis, stran = 1, odmik = 12 }) {
  const navp = Math.abs(x2 - x1) < Math.abs(y2 - y1);
  const t = 7;
  const kon = navp
    ? [[x1 - t, y1, x1 + t, y1], [x2 - t, y2, x2 + t, y2]]
    : [[x1, y1 - t, x1, y1 + t], [x2, y2 - t, x2, y2 + t]];
  const tx = navp ? x1 + stran * odmik : (x1 + x2) / 2;
  const ty = navp ? (y1 + y2) / 2 + 6 : y1 - (stran > 0 ? odmik : -odmik - 12);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.red} strokeWidth="2" />
      {kon.map(([a, b, c, d], i) => <line key={i} x1={a} y1={b} x2={c} y2={d} stroke={C.red} strokeWidth="2" />)}
      <text x={tx} y={ty} textAnchor={navp ? (stran > 0 ? "start" : "end") : "middle"} fill={C.red} fontSize="17" fontWeight="800" className="halo">
        {napis}
      </text>
    </g>
  );
}

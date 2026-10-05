/* Konfiguracije montažnih iger za strani izdelkov ASfix.
   Koraki in besedila sledijo montažnim videom. Brez nosilnosti in
   drugih podatkov, ki jih tehnolog še ni potrdil. */

import { C, Puscica, Napis, NavojVijaka } from "./orodje";

const PROGRESS = (v) => v / 100;

/* ---------- skupni deli ---------- */
const sveder = (sirina, dolzina) => ({
  id: "sveder", naziv: "Vrtalnik", risba: "sveder", ikona: "sveder", sirina, dolzina,
  izbrano: "Vrtalnik je v roki. Drži miško nad rdečo oznako.",
});
const pihalka = { id: "pihalka", naziv: "Pihalka", risba: "pihalka", izbrano: "Pihalka je v roki. Drži miško nad luknjo." };
const vijacnik = { id: "vijacnik", naziv: "Vijačnik", risba: "vijacnik", izbrano: "Akumulatorski vijačnik je v roki. Drži miško nad vijakom." };
const kladivo = (napaka) => ({ id: "kladivo", naziv: "Kladivo", risba: "kladivo", ...(napaka ? { napaka } : { izbrano: "Kladivo je v roki. Vsak klik je en udarec." }) });

function Tarca({ x, y }) {
  return (
    <g>
      <circle cx={x} cy={y} r="16" fill={C.red} opacity="0.22">
        <animate attributeName="r" values="11;20;11" dur="1.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={x} cy={y} r="7" fill={C.red} />
    </g>
  );
}

function GumbPostavi({ x, y, napis }) {
  return (
    <g style={{ cursor: "pointer" }}>
      <rect x={x - 150} y={y} width="300" height="56" rx="28" fill={C.red} />
      <text x={x} y={y + 35} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800" letterSpacing="1.5">{napis}</text>
    </g>
  );
}

function Prah({ x, dno, sirina, kolicina, gor = false }) {
  return (
    <g opacity={0.35 + kolicina / 155}>
      {Array.from({ length: Math.ceil(kolicina / 7) }, (_, i) => (
        <circle key={i} cx={x + (((i * 37) % 10) / 10 - 0.5) * sirina * 0.75}
          cy={gor ? dno + 4 + ((i * 11) % 40) : dno - 4 - ((i * 11) % 40)} r={1.6 + (i % 3) * 0.7} fill={C.prah} />
      ))}
    </g>
  );
}

function Beton({ od, visina, x = 0, sirina = 1200 }) {
  return (
    <g>
      <rect x={x} y={od} width={sirina} height={visina} fill="url(#v-beton)" />
      <line x1={x} y1={od} x2={x + sirina} y2={od} stroke={C.ink} strokeWidth="3" />
    </g>
  );
}

/* =================================================================
   TURBO VIJAK — okenski okvir naravnost v beton
   ================================================================= */
const T = { tla: 370, vrh: 300, X: [430, 770], hw: 14, globina: 150, vijak: 200 };
T.L = T.tla - T.vrh + T.globina;

export const turbo = {
  id: "turbo",
  naslovPrizora: "Turbo vijak skozi okvir v beton",
  luknje: T.X.map((x) => ({ x, y: T.vrh })),
  smer: 0,
  orodja: [
    sveder(T.hw - 1, T.L + 30),
    pihalka,
    vijacnik,
    kladivo("Turbo vijaka ne zabijaš. Privij ga z vijačnikom — navoj se sam ureže v beton."),
  ],
  koraki: [
    { naziv: "Postavi okvir", tip: "postavi", navodilo: "Klikni na beton, da postaviš okenski okvir.", obmocje: (t) => t.y > 250, potrdilo: "Okvir je na mestu. Vrtaš kar skozi okvir." },
    { naziv: "Izvrtaj luknje", orodje: "sveder", nacin: "drzi", korak: 5, delci: "#b9b4a4", navodilo: "Drži miško nad rdečo oznako — vrtaj skozi okvir naravnost v beton." },
    { naziv: "Izpihaj luknje", orodje: "pihalka", nacin: "drzi", korak: 8, delci: C.prah, navodilo: "Drži miško nad luknjo, dokler prah ne izgine.", preskok: "Luknja je še polna prahu. Prah zniža nosilnost — najprej izpihaj." },
    { naziv: "Privij vijaka", orodje: "vijacnik", nacin: "drzi", korak: 4, navodilo: "Drži miško nad vijakom, dokler glava ne nalega na okvir." },
  ],
  prijem(o, li, s) {
    const x = T.X[li];
    if (o === "sveder") return { x, y: T.vrh + T.L * PROGRESS(s.nap[li][1]) };
    if (o === "pihalka") return { x, y: T.vrh + 40 };
    if (o === "vijacnik") return { x, y: T.vrh - T.vijak + T.vijak * PROGRESS(s.nap[li][3]) };
    return null;
  },
  narisi(s) {
    const postavljen = s.nap[0][0] >= 100;
    return (
      <g>
        <Beton od={T.tla} visina={300} />
        <Napis x={28} y={576} barva={C.ink} velikost={18}>BETON</Napis>
        {!postavljen && (
          <g>
            <rect x="0" y={T.tla} width="1200" height="230" fill={C.red} opacity="0.08" />
            <GumbPostavi x={600} y={T.tla + 90} napis="POSTAVI OKVIR" />
          </g>
        )}
        {postavljen && (
          <g>
            <rect x="260" y={T.vrh} width="680" height={T.tla - T.vrh} fill="url(#v-les)" stroke={C.ink} strokeWidth="2" />
            <Napis x={600} y={T.vrh - 14} barva={C.ink} sidro="middle">OKENSKI OKVIR</Napis>
            {s.nap.map((r, li) => {
              const x = T.X[li];
              const dno = T.vrh + T.L * PROGRESS(r[1]);
              const q = r[3];
              const pripravljen = s.korak === 3 || q > 0;
              const vrhVijaka = T.vrh - T.vijak + T.vijak * PROGRESS(q);
              return (
                <g key={li}>
                  {r[1] === 0 && <Tarca x={x} y={T.vrh - 2} />}
                  {r[1] > 0 && (
                    <>
                      <rect x={x - T.hw / 2} y={T.vrh} width={T.hw} height={Math.min(dno, T.tla) - T.vrh} fill="#5a3d22" />
                      {dno > T.tla && <rect x={x - T.hw / 2} y={T.tla} width={T.hw} height={dno - T.tla} fill={C.luknja} />}
                    </>
                  )}
                  {r[1] >= 100 && r[2] < 100 && (
                    <>
                      <Prah x={x} dno={T.tla + T.globina} sirina={T.hw} kolicina={100 - r[2]} />
                      <ellipse cx={x} cy={T.vrh} rx={10 + (100 - r[2]) / 6} ry="6" fill="#cfc8b3" opacity={0.4 + (100 - r[2]) / 160} />
                    </>
                  )}
                  {pripravljen && r[2] >= 100 && (
                    <g>
                      <NavojVijaka x={x} y1={vrhVijaka + 12} y2={vrhVijaka + T.vijak - 8} sirina={16} faza={q * 0.9} />
                      <polygon points={`${x - 4},${vrhVijaka + T.vijak - 8} ${x + 4},${vrhVijaka + T.vijak - 8} ${x},${vrhVijaka + T.vijak}`} fill={C.jeklo} stroke={C.ink} strokeWidth="1.3" />
                      <polygon points={`${x - 16},${vrhVijaka} ${x + 16},${vrhVijaka} ${x + 8},${vrhVijaka + 12} ${x - 8},${vrhVijaka + 12}`} fill={C.jekloS} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" />
                    </g>
                  )}
                  {q > 0 && li === 1 && (
                    <g>
                      <Puscica x1={x + 46} y1={T.tla + 70} x2={x + 14} y2={T.tla + 70} />
                      <Napis x={x + 54} y={T.tla + 76}>navoj se sam ureže v beton</Napis>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </g>
    );
  },
  banner: { sirina: 280 },
  konec: {
    napis: "PRITRJENO",
    kratko: "Okvir je pritrjen — brez vložka.",
    naslov: "Okvir je pritrjen brez vložka",
    besedilo: "Vrtali ste skozi okvir, izpihali izvrtini in vijaka privili naravnost v beton. Kaljen navoj se sam ureže v steno izvrtine — vložek ni potreben, okvir pa ves čas ostane na mestu.",
    povezave: [{ href: "/kontakt?vir=igra-turbo", label: "Zahtevaj ponudbo" }],
  },
};

/* =================================================================
   UDARNI VIJAK UVS — lesena letev na beton
   ================================================================= */
const U = { tla: 370, vrh: 326, X: [440, 760], hw: 18, globina: 130, vlozek: 150, ven: 34 };
U.L = U.tla - U.vrh + U.globina;

function UvsRisba({ x, vrh, glava, razpr = 0 }) {
  // vrh = ovratnik vložka, glava = vrh glave vijaka
  const dol = vrh + U.vlozek;
  const w = U.hw - 2;
  return (
    <g>
      <polygon
        points={`${x - w / 2},${vrh + 8} ${x + w / 2},${vrh + 8} ${x + w / 2 + razpr},${dol - 26} ${x + w / 2},${dol} ${x - w / 2},${dol} ${x - w / 2 - razpr},${dol - 26}`}
        fill={C.najlon} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round"
      />
      <line x1={x} y1={dol - 44} x2={x} y2={dol} stroke={C.ink} strokeWidth="1.2" />
      <polygon points={`${x - w / 2 - 9},${vrh} ${x + w / 2 + 9},${vrh} ${x + w / 2},${vrh + 9} ${x - w / 2},${vrh + 9}`} fill={C.najlon} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x={x - 3} y={glava + 8} width="6" height={dol - 6 - glava - 8} fill={C.jeklo} stroke={C.ink} strokeWidth="1" />
      <polygon points={`${x - 10},${glava} ${x + 10},${glava} ${x + 4},${glava + 9} ${x - 4},${glava + 9}`} fill={C.jekloS} stroke={C.ink} strokeWidth="1.4" strokeLinejoin="round" />
    </g>
  );
}

export const uvs = {
  id: "uvs",
  naslovPrizora: "Udarni vijak UVS: letev na beton",
  luknje: U.X.map((x) => ({ x, y: U.vrh })),
  smer: 0,
  orodja: [
    sveder(U.hw - 1, U.L + 30),
    { id: "uvs", naziv: "Udarni vijak UVS", risba: "roka", ikona: "vlozek", izbrano: "UVS je v roki. Klikni v izvrtino." },
    kladivo(),
    { ...vijacnik, napaka: "UVS ne privijaš — vijak zabiješ s kladivom, glava se ugrezne v ovratnik vložka." },
  ],
  koraki: [
    { naziv: "Postavi letev", tip: "postavi", navodilo: "Klikni na beton, da položiš leseno letev.", obmocje: (t) => t.y > 280, potrdilo: "Letev je na mestu. Vrtaš kar skozi letev." },
    { naziv: "Izvrtaj luknje", orodje: "sveder", nacin: "drzi", korak: 5, delci: "#b9b4a4", navodilo: "Drži miško nad rdečo oznako — vrtaj skozi letev v beton." },
    { naziv: "Vstavi UVS", orodje: "uvs", nacin: "klik", navodilo: "Klikni v vsako izvrtino — ovratnik nalega na letev.", preskok: "Najprej vstavi udarni vijak v izvrtino." },
    { naziv: "Zabij vijaka", orodje: "kladivo", nacin: "udarci", korak: 25, navodilo: "Vsak klik je en udarec. Štirje udarci na vijak." },
  ],
  prijem(o, li, s) {
    const x = U.X[li];
    if (o === "sveder") return { x, y: U.vrh + U.L * PROGRESS(s.nap[li][1]) };
    if (o === "kladivo") return { x, y: U.vrh - U.ven * (1 - PROGRESS(s.nap[li][3])) };
    return null;
  },
  vRoki() {
    return <g transform={`translate(0 ${-U.vlozek})`}><UvsRisba x={0} vrh={0} glava={-U.ven} /></g>;
  },
  narisi(s) {
    const postavljena = s.nap[0][0] >= 100;
    return (
      <g>
        <Beton od={U.tla} visina={300} />
        <Napis x={28} y={576} barva={C.ink} velikost={18}>BETON</Napis>
        {!postavljena && (
          <g>
            <rect x="0" y={U.tla} width="1200" height="230" fill={C.red} opacity="0.08" />
            <GumbPostavi x={600} y={U.tla + 90} napis="POLOŽI LETEV" />
          </g>
        )}
        {postavljena && (
          <g>
            <rect x="280" y={U.vrh} width="640" height={U.tla - U.vrh} fill="url(#v-les)" stroke={C.ink} strokeWidth="2" />
            <Napis x={600} y={U.vrh - 14} barva={C.ink} sidro="middle">LESENA LETEV</Napis>
            {s.nap.map((r, li) => {
              const x = U.X[li];
              const dno = U.vrh + U.L * PROGRESS(r[1]);
              const z = r[3];
              return (
                <g key={li}>
                  {r[1] === 0 && <Tarca x={x} y={U.vrh - 2} />}
                  {r[1] > 0 && (
                    <>
                      <rect x={x - U.hw / 2} y={U.vrh} width={U.hw} height={Math.min(dno, U.tla) - U.vrh} fill="#5a3d22" />
                      {dno > U.tla && <rect x={x - U.hw / 2} y={U.tla} width={U.hw} height={dno - U.tla} fill={C.luknja} />}
                    </>
                  )}
                  {r[2] >= 100 && (
                    <UvsRisba x={x} vrh={U.vrh} glava={U.vrh - U.ven * (1 - PROGRESS(z))} razpr={PROGRESS(z) * 4} />
                  )}
                  {z > 0 && li === 1 && (
                    <g>
                      <Puscica x1={x + U.hw / 2 + 4} y1={U.vrh + U.vlozek - 26} x2={x + U.hw / 2 + 28} y2={U.vrh + U.vlozek - 26} />
                      <Puscica x1={x - U.hw / 2 - 4} y1={U.vrh + U.vlozek - 26} x2={x - U.hw / 2 - 28} y2={U.vrh + U.vlozek - 26} />
                      <Napis x={x + 44} y={U.vrh + U.vlozek - 20}>vložek se razpre</Napis>
                    </g>
                  )}
                  {z >= 100 && li === 0 && (
                    <Napis x={x - 30} y={U.vrh - 14} sidro="end">glava v ovratniku</Napis>
                  )}
                </g>
              );
            })}
          </g>
        )}
      </g>
    );
  },
  banner: { sirina: 280 },
  konec: {
    napis: "PRITRJENO",
    kratko: "Letev je pritrjena.",
    naslov: "Letev je pritrjena",
    besedilo: "Izvrtali ste skozi letev, vstavili udarna vijaka in ju zabili s kladivom. Vijak razpre vložek v izvrtini, glava pa se ugrezne v ovratnik — brez privijanja, zato je montaža hitra tudi v seriji.",
    povezave: [{ href: "/kontakt?vir=igra-uvs", label: "Zahtevaj ponudbo" }],
  },
};

/* =================================================================
   VLOŽEK ZA MAVČNE PLOŠČE — plastičen, samovrezni
   ================================================================= */
const G = { vrh: 330, plosca: 38, X: [450, 750], dolz: 99, element: 18, vijak: 110 };

function GipsVlozek({ x, vrh }) {
  // vrh = zgornji rob prirobnice
  const d = G.dolz, jedro = 12;
  const krila = [];
  for (let y = vrh + 12; y < vrh + d - 18; y += 13) {
    krila.push(
      <polygon key={y} points={`${x - jedro},${y} ${x - 19},${y + 7} ${x - jedro},${y + 9} ${x + jedro},${y + 4} ${x + 19},${y + 11} ${x + jedro},${y + 13}`}
        fill="#f4f4f2" stroke={C.ink} strokeWidth="1.2" strokeLinejoin="round" />
    );
  }
  return (
    <g>
      <polygon points={`${x - jedro},${vrh + 6} ${x + jedro},${vrh + 6} ${x + 5},${vrh + d - 6} ${x},${vrh + d} ${x - 5},${vrh + d - 6}`} fill="#f4f4f2" stroke={C.ink} strokeWidth="1.4" strokeLinejoin="round" />
      {krila}
      <rect x={x - 19} y={vrh} width="38" height="6" rx="2" fill="#f4f4f2" stroke={C.ink} strokeWidth="1.4" />
    </g>
  );
}

function GipsElement() {
  const y = G.vrh - G.element;
  return (
    <g stroke={C.ink} strokeWidth="2" strokeLinejoin="round">
      <rect x="380" y={y} width="440" height={G.element} fill={C.jeklo} />
      <rect x="590" y="160" width="20" height={y - 160} fill={C.jeklo} />
      <polygon points={`590,${y - 50} 548,${y} 590,${y}`} fill="#9aa0a5" />
      <polygon points={`610,${y - 50} 652,${y} 610,${y}`} fill="#9aa0a5" />
      <rect x="470" y="140" width="260" height="20" fill="url(#v-les)" />
    </g>
  );
}

export const gips = {
  id: "gips",
  naslovPrizora: "Vložek za mavčne plošče",
  luknje: G.X.map((x) => ({ x, y: G.vrh })),
  smer: 0,
  orodja: [
    { id: "vlozek", naziv: "Vložek", risba: "roka", ikona: "vlozek", izbrano: "Vložek je v roki. Klikni na rdečo oznako." },
    vijacnik,
    { id: "element", naziv: "Nosilec police", risba: "roka", ikona: "element", brezRotacije: true, izbrano: "Nosilec je v roki. Klikni v prizor, da ga prisloniš." },
    sveder(14, 120),
    kladivo("Plastičnega vložka ne zabijaš — mavec bi se zdrobil. Privij ga z vijačnikom."),
  ],
  koraki: [
    { naziv: "Nastavi vložka", orodje: "vlozek", nacin: "klik", navodilo: "Klikni na rdeči oznaki, da nastaviš vložka na ploščo." },
    { naziv: "Privij vložka", orodje: "vijacnik", nacin: "drzi", korak: 5, delci: "#eceeee", navodilo: "Drži miško nad vložkom — konica z rezili se sama zavrta v ploščo." },
    { naziv: "Prisloni nosilec", tip: "postavi", orodje: "element", navodilo: "Klikni v prizor, da prisloniš nosilec police.", potrdilo: "Nosilec je na mestu. Zdaj privij vijaka." },
    { naziv: "Privij vijaka", orodje: "vijacnik", nacin: "drzi", korak: 5, navodilo: "Drži miško nad vijakom, dokler glava ne nalega na nosilec.", preskok: "Najprej prisloni nosilec police." },
  ],
  prijem(o, li, s) {
    const x = G.X[li];
    if (o !== "vijacnik") return null;
    if (s.korak <= 1) return { x, y: G.vrh - G.dolz * (1 - PROGRESS(s.nap[li][1])) };
    return { x, y: G.vrh - G.element - (G.vijak - 10) * (1 - PROGRESS(s.nap[li][3])) - 8 };
  },
  vRoki(id) {
    if (id === "vlozek") return <g transform={`translate(0 ${-G.dolz})`}><GipsVlozek x={0} vrh={0} /></g>;
    if (id === "element") return (
      <g transform="translate(-60 -30) scale(.28)" stroke={C.ink} strokeWidth="5">
        <rect x="0" y="80" width="440" height="20" fill={C.jeklo} />
        <rect x="210" y="0" width="20" height="80" fill={C.jeklo} />
      </g>
    );
    return null;
  },
  narisi(s) {
    const element = s.nap[0][2] >= 100;
    return (
      <g>
        {/* votli prostor za ploščo */}
        <rect x="0" y={G.vrh + G.plosca} width="1200" height="300" fill="#f1f2f3" />
        {Array.from({ length: 30 }, (_, i) => (
          <line key={i} x1={i * 48 - 200} y1={600} x2={i * 48 + 30} y2={G.vrh + G.plosca} stroke="#e1e4e6" strokeWidth="2" />
        ))}
        <rect x="0" y={G.vrh} width="1200" height={G.plosca} fill="#f7f6f1" stroke={C.ink} strokeWidth="2.5" />
        <line x1="0" y1={G.vrh + 4} x2="1200" y2={G.vrh + 4} stroke="#d9d4c3" strokeWidth="2" />
        <line x1="0" y1={G.vrh + G.plosca - 4} x2="1200" y2={G.vrh + G.plosca - 4} stroke="#d9d4c3" strokeWidth="2" />
        <Napis x={28} y={G.vrh + G.plosca + 30} barva={C.ink} velikost={16}>MAVČNA PLOŠČA</Napis>
        <Napis x={28} y={576} barva="#8f9599" velikost={15} teza={700}>votli prostor</Napis>

        {element && <GipsElement />}

        {s.nap.map((r, li) => {
          const x = G.X[li];
          const vrh = G.vrh - G.dolz * (1 - PROGRESS(r[1]));
          const v = r[3];
          const glavaDno = G.vrh - G.element - (G.vijak - 10) * (1 - PROGRESS(v));
          return (
            <g key={li}>
              {r[0] === 0 && <Tarca x={x} y={G.vrh - 2} />}
              {r[0] >= 100 && <GipsVlozek x={x} vrh={vrh} />}
              {element && (s.korak === 3 || v > 0) && (
                <g>
                  <NavojVijaka x={x} y1={glavaDno} y2={glavaDno + G.vijak - 18} sirina={9} korak={5} faza={v} />
                  <polygon points={`${x - 3},${glavaDno + G.vijak - 18} ${x + 3},${glavaDno + G.vijak - 18} ${x},${glavaDno + G.vijak - 10}`} fill={C.jeklo} stroke={C.ink} strokeWidth="1" />
                  <rect x={x - 12} y={glavaDno - 8} width="24" height="8" rx="3" fill={C.jekloS} stroke={C.ink} strokeWidth="1.4" />
                </g>
              )}
              {r[1] > 0 && r[1] < 100 && li === 1 && (
                <Napis x={x + 34} y={G.vrh + 26}>brez vrtanja</Napis>
              )}
              {r[1] >= 100 && li === 1 && (
                <g>
                  <Puscica x1={x + 64} y1={G.vrh + 64} x2={x + 22} y2={G.vrh + 30} />
                  <Napis x={x + 70} y={G.vrh + 70}>široki navoj drži v mavcu</Napis>
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  },
  kicker: { x: 40, y: 34 },
  banner: { x: 860, y: 30, sirina: 300 },
  konec: {
    napis: "PRITRJENO",
    kratko: "Nosilec je pritrjen.",
    naslov: "Nosilec je pritrjen",
    besedilo: "Vložka ste privili naravnost v mavčno ploščo — brez vrtanja. Široke lopatice navoja se urežejo v mavec in obremenitev razporedijo na večjo površino plošče. Primerno za slike, ogledala, svetila in lahke police.",
    povezave: [{ href: "/kontakt?vir=igra-gips", label: "Zahtevaj ponudbo" }],
  },
};

/* =================================================================
   PERFORIRAN TRAK — obešanje cevi na strop
   ================================================================= */
const P = { strop: 150, X: [470, 730], hw: 18, globina: 110, vlozek: 90, cx: 600, cy: 340, r: 72 };

function StropniVlozek({ x }) {
  const vrh = P.strop - P.vlozek;
  return (
    <g>
      <polygon points={`${x - 8},${vrh} ${x + 8},${vrh} ${x + 8},${P.strop - 6} ${x - 8},${P.strop - 6}`} fill={C.najlon} stroke={C.ink} strokeWidth="1.4" />
      <line x1={x} y1={vrh} x2={x} y2={vrh + 36} stroke={C.ink} strokeWidth="1.2" />
      <rect x={x - 13} y={P.strop - 6} width="26" height="6" fill={C.najlon} stroke={C.ink} strokeWidth="1.4" />
    </g>
  );
}

const TRAK_POT = `M ${P.X[0]} ${P.strop + 2} L ${P.cx - P.r} ${P.cy} A ${P.r} ${P.r} 0 0 0 ${P.cx + P.r} ${P.cy} L ${P.X[1]} ${P.strop + 2}`;

export const trak = {
  id: "trak",
  naslovPrizora: "Perforiran trak: cev na strop",
  luknje: P.X.map((x) => ({ x, y: P.strop })),
  smer: 180,
  kicker: { x: 40, y: 500 },
  orodja: [
    sveder(P.hw - 1, P.globina + 30),
    { id: "vlozek", naziv: "Vložek", risba: "roka", ikona: "vlozek", brezRotacije: true, izbrano: "Vložek je v roki. Klikni v izvrtino." },
    { id: "trak", naziv: "Perforiran trak", risba: "roka", ikona: "trak", brezRotacije: true, izbrano: "Trak je v roki. Klikni na cev, da jo oviješ." },
    vijacnik,
    kladivo("Kladivo tukaj ni potrebno — trak privijaš z vijakom v vložek."),
  ],
  koraki: [
    { naziv: "Izvrtaj luknji", orodje: "sveder", nacin: "drzi", korak: 6, delci: "#b9b4a4", navodilo: "Drži miško pod rdečo oznako in vrtaj v strop." },
    { naziv: "Vstavi vložka", orodje: "vlozek", nacin: "klik", navodilo: "Klikni v vsako izvrtino." },
    { naziv: "Ovij trak", tip: "postavi", orodje: "trak", navodilo: "Klikni na cev, da jo oviješ s trakom.", obmocje: (t) => Math.hypot(t.x - P.cx, t.y - P.cy) < P.r + 60, potrdilo: "Trak je ovit okoli cevi. Zdaj privij oba konca.", preskok: "Najprej ovij trak okoli cevi." },
    { naziv: "Privij konca", orodje: "vijacnik", nacin: "drzi", korak: 6, navodilo: "Drži miško pod vijakom, dokler trak ne nalega na strop.", preskok: "Najprej ovij trak okoli cevi." },
  ],
  prijem(o, li, s) {
    const x = P.X[li];
    if (o === "sveder") return { x, y: P.strop - P.globina * PROGRESS(s.nap[li][0]) };
    if (o === "vijacnik") return { x, y: P.strop - 84 + 80 * (1 - PROGRESS(s.nap[li][3])) + 94 };
    return null;
  },
  vRoki(id) {
    if (id === "vlozek") return <g transform={`translate(0 ${P.vlozek - P.strop})`}><StropniVlozek x={0} /></g>;
    if (id === "trak") return (
      <g>
        <circle cx="0" cy="0" r="26" fill="none" stroke={C.jeklo} strokeWidth="10" />
        <circle cx="0" cy="0" r="26" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="2 7" />
        <circle cx="0" cy="0" r="14" fill="#fff" stroke={C.ink} strokeWidth="1.5" />
      </g>
    );
    return null;
  },
  narisi(s) {
    const ovit = s.nap[0][2] >= 100;
    return (
      <g>
        <rect x="0" y="0" width="1200" height={P.strop} fill="url(#v-beton)" />
        <line x1="0" y1={P.strop} x2="1200" y2={P.strop} stroke={C.ink} strokeWidth="3" />
        <Napis x={28} y={40} barva={C.ink} velikost={18}>STROP · BETON</Napis>

        {/* cev v prerezu */}
        <circle cx={P.cx} cy={P.cy} r={P.r} fill="#cfd3d6" stroke={C.ink} strokeWidth="2.5" />
        <circle cx={P.cx} cy={P.cy} r={P.r - 12} fill="#eef0f1" stroke={C.ink} strokeWidth="1.5" />
        <Napis x={P.cx} y={P.cy + 7} barva={C.ink} sidro="middle" velikost={18}>CEV</Napis>
        {!ovit && s.korak === 2 && (
          <circle cx={P.cx} cy={P.cy} r={P.r + 14} fill="none" stroke={C.red} strokeWidth="3" strokeDasharray="8 8" />
        )}

        {ovit && (
          <g>
            <path d={TRAK_POT} fill="none" stroke={C.ink} strokeWidth="14" strokeLinejoin="round" />
            <path d={TRAK_POT} fill="none" stroke={C.jeklo} strokeWidth="10" strokeLinejoin="round" />
            <path d={TRAK_POT} fill="none" stroke="#fff" strokeWidth="3.5" strokeDasharray="2 9" />
          </g>
        )}

        {s.nap.map((r, li) => {
          const x = P.X[li];
          const vrh = P.strop - P.globina * PROGRESS(r[0]);
          const v = r[3];
          const konica = P.strop - 84 + 80 * (1 - PROGRESS(v));
          return (
            <g key={li}>
              {r[0] === 0 && <Tarca x={x} y={P.strop + 2} />}
              {r[0] > 0 && <rect x={x - P.hw / 2} y={vrh} width={P.hw} height={P.strop - vrh} fill={C.luknja} />}
              {r[1] >= 100 && <StropniVlozek x={x} />}
              {ovit && (s.korak === 3 || v > 0) && (
                <g>
                  <NavojVijaka x={x} y1={konica + 6} y2={konica + 86} sirina={9} korak={5} faza={-v} />
                  <polygon points={`${x - 3},${konica + 6} ${x + 3},${konica + 6} ${x},${konica}`} fill={C.jeklo} stroke={C.ink} strokeWidth="1" />
                  <rect x={x - 14} y={konica + 86} width="28" height="8" rx="2" fill={C.jekloS} stroke={C.ink} strokeWidth="1.4" />
                </g>
              )}
            </g>
          );
        })}
        {ovit && s.nap.every((r) => r[3] >= 100) && (
          <Napis x={P.cx + P.r + 26} y={P.cy + 6}>cev je obešena</Napis>
        )}
      </g>
    );
  },
  banner: { x: 860, y: 520, sirina: 300 },
  konec: {
    napis: "OBEŠENO",
    kratko: "Cev je obešena.",
    naslov: "Cev je obešena",
    besedilo: "V strop ste izvrtali luknji, vstavili vložka, cev ovili s perforiranim trakom in privili oba konca. Pocinkan trak je na voljo v širini 12 mm in 17 mm, pakiranje 10 m.",
    povezave: [{ href: "/kontakt?vir=igra-trak", label: "Zahtevaj ponudbo" }],
  },
};

/* =================================================================
   AF-RK — konzola za zunanjo enoto klime v zid
   ================================================================= */
const A = { zid: 300, plosca: 16, Y: [190, 460], hw: 22, globina: 140, tulec: 130, ven: 30 };
A.usta = A.zid + A.plosca;
A.L = A.plosca + A.globina;

function AfrkRisba({ y, glavaX, razpr = 0 }) {
  // glavaX = levi rob glave vijaka; tulec od ust v levo
  const x0 = A.usta, x1 = A.usta - A.tulec, h = A.hw / 2 - 1;
  const b = razpr;
  const tulec = `${x0},${y - h} ${x1 + 70},${y - h} ${x1 + 52},${y - h - b} ${x1 + 34},${y - h} ${x1 + 26},${y - h} ${x1 + 14},${y - h - b} ${x1},${y - h + 2}
    ${x1},${y + h - 2} ${x1 + 14},${y + h + b} ${x1 + 26},${y + h} ${x1 + 34},${y + h} ${x1 + 52},${y + h + b} ${x1 + 70},${y + h} ${x0},${y + h}`;
  return (
    <g>
      <polygon points={tulec} fill={C.najlon} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x={x0} y={y - h - 9} width="7" height={2 * h + 18} rx="2" fill={C.najlon} stroke={C.ink} strokeWidth="1.5" />
      <rect x={x1 + 8} y={y - 3.5} width={glavaX - x1 - 8} height="7" fill={C.jeklo} stroke={C.ink} strokeWidth="1" />
      <rect x={glavaX} y={y - 13} width="10" height="26" rx="2" fill={C.jekloS} stroke={C.ink} strokeWidth="1.4" />
    </g>
  );
}

export const afrkKlima = {
  id: "afrk",
  naslovPrizora: "AF-RK: konzola za klimo v zid",
  luknje: A.Y.map((y) => ({ x: A.usta, y })),
  smer: 90,
  kicker: { x: 360, y: 34 },
  dosegZadetka: 120,
  orodja: [
    sveder(A.hw - 1, A.L + 30),
    pihalka,
    { id: "afrk", naziv: "Vložek AF-RK", risba: "roka", ikona: "vlozek", izbrano: "AF-RK je v roki. Klikni v izvrtino." },
    vijacnik,
    { id: "enota", naziv: "Zunanja enota", risba: "roka", ikona: "enota", brezRotacije: true, izbrano: "Zunanja enota je v roki. Klikni na konzolo." },
    kladivo("AF-RK ne zabijaš — privij vijak, da se tulec razpre v zidu."),
  ],
  koraki: [
    { naziv: "Prisloni konzolo", tip: "postavi", navodilo: "Klikni ob zid, da prisloniš konzolo.", obmocje: (t) => t.x > A.zid, potrdilo: "Konzola je poravnana. Vrtaš skozi luknje v konzoli." },
    { naziv: "Izvrtaj", orodje: "sveder", nacin: "drzi", korak: 5, delci: "#c9a08a", navodilo: "Drži miško ob rdeči oznaki — vrtaj skozi konzolo v zid." },
    { naziv: "Izpihaj", orodje: "pihalka", nacin: "drzi", korak: 8, delci: C.prah, navodilo: "Drži miško ob luknji, dokler prah ne izgine.", preskok: "Izvrtina je še polna prahu — najprej izpihaj." },
    { naziv: "Vstavi AF-RK", orodje: "afrk", nacin: "klik", navodilo: "Klikni v vsako izvrtino — prirobnica nalega na konzolo." },
    { naziv: "Privij vijaka", orodje: "vijacnik", nacin: "drzi", korak: 4, navodilo: "Drži miško ob vijaku, dokler glava ne nalega." },
    { naziv: "Postavi enoto", tip: "postavi", orodje: "enota", navodilo: "Klikni na konzolo, da postaviš zunanjo enoto.", obmocje: (t) => t.x > A.zid, potrdilo: "Zunanja enota stoji na konzoli.", preskok: "Najprej privij oba vijaka." },
  ],
  prijem(o, li, s) {
    const y = A.Y[li];
    if (o === "sveder") return { x: A.usta - A.L * PROGRESS(s.nap[li][1]), y };
    if (o === "pihalka") return { x: A.usta - 40, y };
    if (o === "vijacnik") return { x: A.usta + 7 + A.ven * (1 - PROGRESS(s.nap[li][4])) + 10, y };
    return null;
  },
  vRoki(id) {
    if (id === "afrk") return (
      // narisan vodoravno → zavrtimo nazaj, da je po rotaciji orodja (90°) spet vodoraven
      <g transform="rotate(-90)">
        <g transform={`translate(${-A.usta + A.tulec} 0)`}><AfrkRisba y={0} glavaX={A.usta + 7 + A.ven} /></g>
      </g>
    );
    if (id === "enota") return (
      <g transform="translate(-50 -40)">
        <rect x="0" y="0" width="100" height="56" rx="4" fill="#eef0f1" stroke={C.ink} strokeWidth="2" />
        <circle cx="34" cy="28" r="18" fill="none" stroke={C.ink} strokeWidth="2" />
      </g>
    );
    return null;
  },
  narisi(s) {
    const konzola = s.nap[0][0] >= 100;
    const enota = s.nap[0][5] >= 100;
    return (
      <g>
        <rect x="0" y="0" width={A.zid} height="600" fill="url(#v-zid)" />
        <line x1={A.zid} y1="0" x2={A.zid} y2="600" stroke={C.ink} strokeWidth="3" />
        <Napis x={24} y={576} barva={C.ink} velikost={18}>ZID</Napis>
        {!konzola && (
          <g>
            <rect x={A.zid} y="0" width={1200 - A.zid} height="600" fill={C.red} opacity="0.06" />
            <GumbPostavi x={720} y={300} napis="PRISLONI KONZOLO" />
          </g>
        )}
        {konzola && (
          <g stroke={C.ink} strokeWidth="2" strokeLinejoin="round">
            <rect x={A.zid} y="110" width={A.plosca} height="430" fill={C.jeklo} />
            <rect x={A.usta} y="330" width="680" height="22" fill={C.jekloS} />
            <line x1={A.usta} y1="520" x2="760" y2="352" stroke={C.ink} strokeWidth="18" strokeLinecap="round" />
            <line x1={A.usta} y1="520" x2="760" y2="352" stroke={C.jeklo} strokeWidth="13" strokeLinecap="round" />
          </g>
        )}
        {konzola && <Napis x={A.usta + 14} y={580} barva={C.ink} velikost={15}>KONZOLA</Napis>}

        {enota && (
          <g>
            <rect x="560" y="150" width="400" height="180" rx="8" fill="#eef0f1" stroke={C.ink} strokeWidth="2.5" />
            <circle cx="690" cy="240" r="66" fill="#fff" stroke={C.ink} strokeWidth="2" />
            {[0, 1, 2, 3].map((i) => (
              <line key={i} x1="690" y1="240" x2={690 + Math.cos(i * 1.57 + 0.4) * 60} y2={240 + Math.sin(i * 1.57 + 0.4) * 60} stroke={C.ink} strokeWidth="2" />
            ))}
            {[0, 1, 2, 3, 4].map((i) => <line key={`r${i}`} x1="790" y1={190 + i * 22} x2="930" y2={190 + i * 22} stroke="#b9bec2" strokeWidth="3" />)}
            <Napis x={760} y={142} barva={C.ink} sidro="middle">ZUNANJA ENOTA</Napis>
          </g>
        )}

        {konzola && s.nap.map((r, li) => {
          const y = A.Y[li];
          const levo = A.usta - A.L * PROGRESS(r[1]);
          const v = r[4];
          return (
            <g key={li}>
              {r[1] === 0 && <Tarca x={A.usta + 2} y={y} />}
              {r[1] > 0 && <rect x={levo} y={y - A.hw / 2} width={A.usta - levo} height={A.hw} fill={C.luknja} />}
              {r[1] >= 100 && r[2] < 100 && (
                <g opacity={0.35 + (100 - r[2]) / 155}>
                  {Array.from({ length: Math.ceil((100 - r[2]) / 7) }, (_, i) => (
                    <circle key={i} cx={A.usta - A.L + 4 + ((i * 11) % 40)} cy={y + (((i * 37) % 10) / 10 - 0.5) * A.hw * 0.75} r={1.6 + (i % 3) * 0.7} fill={C.prah} />
                  ))}
                </g>
              )}
              {r[3] >= 100 && (
                <AfrkRisba y={y} glavaX={A.usta + 7 + A.ven * (1 - PROGRESS(v))} razpr={PROGRESS(v) * 6} />
              )}
              {v > 0 && li === 0 && (
                <g>
                  <Puscica x1={A.usta - A.tulec + 40} y1={y - 16} x2={A.usta - A.tulec + 40} y2={y - 42} />
                  <Puscica x1={A.usta - A.tulec + 40} y1={y + 16} x2={A.usta - A.tulec + 40} y2={y + 42} />
                  <Napis x={A.usta - A.tulec + 54} y={y - 34}>tulec se razpre</Napis>
                </g>
              )}
            </g>
          );
        })}
      </g>
    );
  },
  banner: { x: 860, y: 520, sirina: 300 },
  konec: {
    napis: "PRITRJENO",
    kratko: "Klima stoji na konzoli.",
    naslov: "Konzola za klimo je pritrjena",
    besedilo: "Konzolo ste prislonili na zid, vrtali skozi njene luknje, izvrtini izpihali in vstavili okvirna vložka AF-RK. Ko vijak privijete, se tulec razpre v zidu, velika prirobnica pa nalega na konzolo.",
    povezave: [{ href: "/kontakt?vir=igra-afrk", label: "Zahtevaj ponudbo" }],
  },
};

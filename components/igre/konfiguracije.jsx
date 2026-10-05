/* Konfiguracije montažnih iger za strani izdelkov ASfix.
   Koraki in besedila sledijo montažnim videom. Brez nosilnosti in
   drugih podatkov, ki jih tehnolog še ni potrdil. */

import { C, Puscica, Napis, NavojVijaka, Mera } from "./orodje";

const PROGRESS = (v) => v / 100;

/* ---------- skupni deli ---------- */
const sveder = (sirina, dolzina) => ({
  id: "sveder", naziv: "Vrtalnik", risba: "sveder", ikona: "sveder", sirina, dolzina,
  izbrano: "Vrtalnik je v roki. Drži miško nad rdečo oznako.",
});
/** Izbira svedrov: pravi premer + napačni z razlago */
const svedri = (prav, mozni, pxNaMm, dolzina, napaka) => mozni.map((d) => ({
  id: `sveder${d}`, naziv: `Sveder Ø${d}`, risba: "sveder", ikona: "sveder", oznaka: `Ø${d}`,
  sirina: d * pxNaMm, dolzina,
  ...(d === prav ? { izbrano: `V vrtalnik je vpet sveder Ø${d}. Drži miško nad rdečo oznako.` } : { napaka: napaka(d) }),
}));
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
    ...svedri(6, [5, 6, 8], 2.2, T.L + 30, (d) => (d > 6
      ? "Prevelika izvrtina — navoj Turbo vijaka ne prime. Vrtaj s svedrom Ø6."
      : "Za Turbo vijak Ø7,5 vrtaj v zid s svedrom Ø6.")),
    pihalka,
    vijacnik,
    kladivo("Turbo vijaka ne zabijaš. Privij ga z vijačnikom — navoj se sam ureže v beton."),
  ],
  koraki: [
    { naziv: "Postavi okvir", tip: "postavi", navodilo: "Klikni na beton, da postaviš okenski okvir.", obmocje: (t) => t.y > 250, potrdilo: "Okvir je na mestu. Vrtaš kar skozi okvir." },
    { naziv: "Izvrtaj luknje", orodje: "sveder6", nacin: "drzi", korak: 5, delci: "#b9b4a4", navodilo: "Drži miško nad rdečo oznako — vrtaj skozi okvir naravnost v beton." },
    { naziv: "Izpihaj luknje", orodje: "pihalka", nacin: "drzi", korak: 8, delci: C.prah, navodilo: "Drži miško nad luknjo, dokler prah ne izgine.", preskok: "Luknja je še polna prahu. Prah zniža nosilnost — najprej izpihaj." },
    { naziv: "Privij vijaka", orodje: "vijacnik", nacin: "drzi", korak: 4, navodilo: "Drži miško nad vijakom, dokler glava ne nalega na okvir." },
  ],
  prijem(o, li, s) {
    const x = T.X[li];
    if (o.startsWith("sveder")) return { x, y: T.vrh + T.L * PROGRESS(s.nap[li][1]) };
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
                  {li === 0 && r[1] >= 100 && q === 0 && s.korak < 3 && (
                    <Napis x={x - 16} y={T.tla + 60} sidro="end">Ø6 mm</Napis>
                  )}
                  {li === 0 && pripravljen && r[2] >= 100 && (
                    <Napis x={x - 30} y={T.vrh - 24} barva={C.ink} sidro="end">Turbo Ø7,5 · TX30</Napis>
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
  podatki: [
    ["Vijak", "Turbo Ø7,5 × 42–302 mm"],
    ["Glava", "ugreznjena, TX30"],
    ["Okvir predvrtaj", "≈ Ø6,2 mm"],
    ["Sveder v zid", "Ø6 mm — točen premer"],
    ["Privijanje", "udarni vijačnik"],
    ["Podlaga", "beton, opeka, zidaki"],
  ],
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
   UDARNI VIJAK UVS — kovinski UD profil za mavčne plošče na beton
   ================================================================= */
const U = { tla: 420, vrh: 412, X: [440, 760], K: 3.5, hw: 21, globina: 45 * 3.5, vlozek: 40 * 3.5, ven: 34 };
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

/* skupni deli igre z udarnimi vijaki (UVS in perforiran trak) */
function luknjeUvs(s, { X, vrh, tla, L, iVrt, iVstavi, iZabij, lesTla }) {
  return s.nap.map((r, li) => {
    const x = X[li];
    const dno = vrh + L * PROGRESS(r[iVrt]);
    const z = r[iZabij];
    return (
      <g key={li}>
        {r[iVrt] === 0 && s.korak === iVrt && <Tarca x={x} y={vrh - 2} />}
        {r[iVrt] > 0 && (
          <>
            <rect x={x - U.hw / 2} y={vrh} width={U.hw} height={Math.min(dno, tla) - vrh} fill={lesTla ?? "#4b4f53"} />
            {dno > tla && <rect x={x - U.hw / 2} y={tla} width={U.hw} height={dno - tla} fill={C.luknja} />}
          </>
        )}
        {li === 0 && r[iVrt] >= 100 && r[iVstavi] < 100 && (
          <Mera x1={x - U.hw / 2 - 20} y1={tla} x2={x - U.hw / 2 - 20} y2={vrh + L} napis="Ø6 · h₁ ≥ 45 mm" stran={-1} />
        )}
        {li === 0 && r[iVstavi] >= 100 && (
          <Napis x={x - 34} y={vrh - 44} barva={C.ink} sidro="end">UVS 6 × 40</Napis>
        )}
        {r[iVstavi] >= 100 && <UvsRisba x={x} vrh={vrh} glava={vrh - U.ven * (1 - PROGRESS(z))} razpr={PROGRESS(z) * 4} />}
        {z > 0 && li === 1 && (
          <g>
            <Puscica x1={x + U.hw / 2 + 4} y1={vrh + U.vlozek - 26} x2={x + U.hw / 2 + 28} y2={vrh + U.vlozek - 26} />
            <Puscica x1={x - U.hw / 2 - 4} y1={vrh + U.vlozek - 26} x2={x - U.hw / 2 - 28} y2={vrh + U.vlozek - 26} />
            <Napis x={x + 44} y={vrh + U.vlozek - 20}>vložek se razpre</Napis>
          </g>
        )}
      </g>
    );
  });
}

const uvsOrodje = { id: "uvs", naziv: "UVS 6 × 40", risba: "roka", ikona: "vlozek", izbrano: "UVS je v roki. Klikni v izvrtino." };
const uvsVRoki = () => <g transform={`translate(0 ${-U.vlozek})`}><UvsRisba x={0} vrh={0} glava={-U.ven} /></g>;
const uvsSvedri = (dolzina) => svedri(6, [5, 6, 8], U.K, dolzina, (d) => (d < 6
  ? "Premajhna izvrtina — UVS 6 ne gre v luknjo. Vrtaj s svedrom Ø6."
  : "Prevelika izvrtina — vložek se ne razpre in ne drži. Vrtaj s svedrom Ø6."));
const uvsNapacenVijacnik = { ...vijacnik, napaka: "UVS ne privijaš — vijak zabiješ s kladivom, glava se ugrezne v ovratnik vložka." };

export const uvs = {
  id: "uvs",
  naslovPrizora: "Udarni vijak UVS: profil na beton",
  luknje: U.X.map((x) => ({ x, y: U.vrh })),
  smer: 0,
  orodja: [...uvsSvedri(U.L + 30), uvsOrodje, kladivo(), uvsNapacenVijacnik],
  koraki: [
    { naziv: "Postavi profil", tip: "postavi", navodilo: "Klikni na beton, da postaviš kovinski profil za mavčne plošče.", obmocje: (t) => t.y > 300, potrdilo: "Profil je na mestu. Vrtaš kar skozi luknje v profilu." },
    { naziv: "Izvrtaj luknje", orodje: "sveder6", nacin: "drzi", korak: 5, delci: "#b9b4a4", navodilo: "Drži miško nad rdečo oznako — vrtaj skozi profil v beton." },
    { naziv: "Vstavi UVS", orodje: "uvs", nacin: "klik", navodilo: "Klikni v vsako izvrtino — ovratnik nalega na profil.", preskok: "Najprej vstavi udarni vijak v izvrtino." },
    { naziv: "Zabij vijaka", orodje: "kladivo", nacin: "udarci", korak: 25, navodilo: "Vsak klik je en udarec. Štirje udarci na vijak." },
  ],
  prijem(o, li, s) {
    const x = U.X[li];
    if (o.startsWith("sveder")) return { x, y: U.vrh + U.L * PROGRESS(s.nap[li][1]) };
    if (o === "kladivo") return { x, y: U.vrh - U.ven * (1 - PROGRESS(s.nap[li][3])) };
    return null;
  },
  vRoki: uvsVRoki,
  narisi(s) {
    const postavljen = s.nap[0][0] >= 100;
    return (
      <g>
        <Beton od={U.tla} visina={200} />
        <Napis x={28} y={576} barva={C.ink} velikost={18}>BETON</Napis>
        {!postavljen && (
          <g>
            <rect x="0" y={U.tla} width="1200" height="180" fill={C.red} opacity="0.08" />
            <GumbPostavi x={600} y={U.tla + 60} napis="POSTAVI PROFIL" />
          </g>
        )}
        {postavljen && (
          <g>
            {/* stranica profila (za prerezom) in dno profila */}
            <rect x="240" y="352" width="720" height={U.vrh - 352} fill="#e3e6e8" stroke={C.ink} strokeWidth="2" />
            <rect x="240" y="352" width="720" height="8" fill={C.jekloS} stroke={C.ink} strokeWidth="1.5" />
            <rect x="240" y={U.vrh} width="720" height={U.tla - U.vrh} fill={C.jeklo} stroke={C.ink} strokeWidth="2" />
            <Napis x={600} y={340} barva={C.ink} sidro="middle">KOVINSKI PROFIL ZA MAVČNE PLOŠČE</Napis>
            {luknjeUvs(s, { X: U.X, vrh: U.vrh, tla: U.tla, L: U.L, iVrt: 1, iVstavi: 2, iZabij: 3 })}
            {s.nap[0][3] >= 100 && <Napis x={U.X[0] - 30} y={U.vrh - 14} sidro="end">glava v ovratniku</Napis>}
          </g>
        )}
      </g>
    );
  },
  podatki: [
    ["Vijak", "UVS 6 × 40, ugreznjena glava"],
    ["Sveder", "Ø6 mm"],
    ["Globina vrtanja", "h₁ ≥ 45 mm"],
    ["Debelina elementa", "t_fix do 10 mm"],
    ["Najpogosteje", "6 × 40 in 6 × 60"],
    ["Pred vstavljanjem", "izvrtino izpihaj"],
  ],
  banner: { x: 860, y: 30, sirina: 280 },
  konec: {
    napis: "PRITRJENO",
    kratko: "Profil je pritrjen.",
    naslov: "Profil je pritrjen",
    besedilo: "Izvrtali ste skozi profil, vstavili udarna vijaka in ju zabili s kladivom. Vijak razpre vložek v izvrtini, glava pa se ugrezne v ovratnik — brez privijanja, zato je montaža profilov za mavčne plošče hitra tudi v seriji.",
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
    { ...sveder(14, 120), napaka: "Za ta vložek ne vrtaš — konica z rezili se sama zavrta v mavčno ploščo." },
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
        <Napis x={28} y={G.vrh + G.plosca + 30} barva={C.ink} velikost={16}>MAVČNA PLOŠČA 12,5 mm</Napis>
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
              {li === 0 && r[0] >= 100 && !element && (
                <Napis x={x - 30} y={G.vrh - 16} barva={C.ink} sidro="end">vložek 13 × 32</Napis>
              )}
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
  podatki: [
    ["Vložek", "13 × 32 mm, najlon"],
    ["Plošča", "9,5–15 mm"],
    ["Vrtanje", "ni potrebno"],
    ["Privijanje", "izvijač ali vijačnik"],
    ["Za težja bremena", "kovinski vložek"],
  ],
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
   PERFORIRAN TRAK — kabli po tleh, trak čez, UVS v beton
   ================================================================= */
const P = { tla: 420, X: [470, 730], debelina: 4 };
P.vrh = P.tla - P.debelina;
P.L = P.debelina + 170;
const KABLI = [{ x: 581, y: P.tla - 19, b: "#1b1e21" }, { x: 619, y: P.tla - 19, b: "#3f4140" }, { x: 600, y: P.tla - 52, b: "#cb2026" }];
const TRAK_POT = `M 410 ${P.tla - 2} L 520 ${P.tla - 2} C 540 ${P.tla - 2} 536 ${P.tla - 80} 600 ${P.tla - 80} C 664 ${P.tla - 80} 660 ${P.tla - 2} 680 ${P.tla - 2} L 790 ${P.tla - 2}`;

export const trak = {
  id: "trak",
  naslovPrizora: "Perforiran trak: kabli na beton",
  luknje: P.X.map((x) => ({ x, y: P.vrh })),
  smer: 0,
  orodja: [
    { id: "trak12", naziv: "Trak 12 mm", risba: "roka", ikona: "trak", brezRotacije: true, izbrano: "Trak 12 mm je v roki. Klikni na kable, da jih prekriješ." },
    { id: "trak17", naziv: "Trak 17 mm", risba: "roka", ikona: "trak", brezRotacije: true, izbrano: "Trak 17 mm je v roki — širši trak prenese večjo obremenitev. Klikni na kable." },
    ...uvsSvedri(P.L + 30),
    uvsOrodje,
    kladivo(),
    uvsNapacenVijacnik,
  ],
  koraki: [
    { naziv: "Položi kable", tip: "postavi", navodilo: "Klikni na tla, da položiš kable.", obmocje: (t) => t.y > 300, potrdilo: "Kabli so na tleh. Zdaj jih prekrij s trakom." },
    { naziv: "Prekrij s trakom", tip: "postavi", orodje: ["trak12", "trak17"], vzemi: "Vzemi perforiran trak 12 ali 17 mm.", navodilo: "Klikni na kable, da jih prekriješ s perforiranim trakom.", obmocje: (t) => Math.abs(t.x - 600) < 160 && t.y > 260, potrdilo: "Trak je čez kable. Vrtaj skozi luknje v traku." },
    { naziv: "Izvrtaj luknji", orodje: "sveder6", nacin: "drzi", korak: 5, delci: "#b9b4a4", navodilo: "Drži miško nad rdečo oznako — vrtaj skozi trak v beton.", preskok: "Najprej prekrij kable s trakom." },
    { naziv: "Vstavi UVS", orodje: "uvs", nacin: "klik", navodilo: "Klikni v vsako izvrtino." },
    { naziv: "Zabij vijaka", orodje: "kladivo", nacin: "udarci", korak: 25, navodilo: "Vsak klik je en udarec. Štirje udarci na vijak." },
  ],
  prijem(o, li, s) {
    const x = P.X[li];
    if (o.startsWith("sveder")) return { x, y: P.vrh + P.L * PROGRESS(s.nap[li][2]) };
    if (o === "kladivo") return { x, y: P.vrh - U.ven * (1 - PROGRESS(s.nap[li][4])) };
    return null;
  },
  vRoki(id) {
    if (id === "uvs") return uvsVRoki();
    if (id.startsWith("trak")) return (
      <g>
        <circle cx="0" cy="0" r="26" fill="none" stroke={C.jeklo} strokeWidth="10" />
        <circle cx="0" cy="0" r="26" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="2 7" />
        <circle cx="0" cy="0" r="14" fill="#fff" stroke={C.ink} strokeWidth="1.5" />
      </g>
    );
    return null;
  },
  narisi(s) {
    const kabli = s.nap[0][0] >= 100;
    const trakCez = s.nap[0][1] >= 100;
    return (
      <g>
        <Beton od={P.tla} visina={200} />
        <Napis x={28} y={576} barva={C.ink} velikost={18}>BETON</Napis>
        {!kabli && (
          <g>
            <rect x="0" y={P.tla} width="1200" height="180" fill={C.red} opacity="0.08" />
            <GumbPostavi x={600} y={P.tla + 60} napis="POLOŽI KABLE" />
          </g>
        )}
        {kabli && (
          <g>
            {KABLI.map((k, i) => (
              <g key={i}>
                <circle cx={k.x} cy={k.y} r="19" fill={k.b} stroke={C.ink} strokeWidth="2" />
                <circle cx={k.x} cy={k.y} r="7" fill="#c98a4b" />
              </g>
            ))}
            <Napis x={600} y={P.tla - 96} barva={C.ink} sidro="middle">KABLI</Napis>
            {!trakCez && s.korak === 1 && (
              <ellipse cx="600" cy={P.tla - 40} rx="70" ry="58" fill="none" stroke={C.red} strokeWidth="3" strokeDasharray="8 8" />
            )}
          </g>
        )}
        {trakCez && (
          <g>
            <path d={TRAK_POT} fill="none" stroke={C.ink} strokeWidth="8" strokeLinejoin="round" />
            <path d={TRAK_POT} fill="none" stroke={C.jeklo} strokeWidth="5" strokeLinejoin="round" />
            <path d={TRAK_POT} fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="2 9" />
            <Napis x={800} y={P.tla - 10} barva={C.ink}>PERFORIRAN TRAK {s.izbire[1] === "trak17" ? "17" : "12"} mm</Napis>
            {luknjeUvs(s, { X: P.X, vrh: P.vrh, tla: P.tla, L: P.L, iVrt: 2, iVstavi: 3, iZabij: 4 })}
          </g>
        )}
      </g>
    );
  },
  podatki: [
    ["Trak", "12 mm ali 17 mm × 10 m"],
    ["Material", "pocinkano jeklo, 17 mm tudi INOX A4"],
    ["Vijak", "UVS 6 × 40"],
    ["Sveder", "Ø6 mm"],
    ["Globina vrtanja", "h₁ ≥ 45 mm"],
    ["Pozor", "po rezanju ostri robovi"],
  ],
  banner: { x: 860, y: 30, sirina: 300 },
  konec: {
    napis: "PRITRJENO",
    kratko: "Kabli so pritrjeni.",
    naslov: "Kabli so pritrjeni",
    besedilo: "Kable ste prekrili s perforiranim trakom, vrtali skozi luknje v traku in trak pritrdili z udarnima vijakoma UVS, ki ju samo zabijete s kladivom. Pocinkan trak je na voljo v širini 12 mm in 17 mm, pakiranje 10 m.",
    povezave: [
      { href: "/program/pritrdila-za-suhomontazo/udarni-vijak-nylon", label: "Poglej udarni vijak UVS" },
      { href: "/kontakt?vir=igra-trak", label: "Zahtevaj ponudbo" },
    ],
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
    ...svedri(10, [8, 10, 12], 2, A.L + 30, (d) => `AF-RK 10 × 100 potrebuje izvrtino Ø10 — ${d < 10 ? "v premajhno ga ne vstaviš" : "v preveliki se tulec ne razpre"}.`),
    pihalka,
    { id: "afrk", naziv: "AF-RK 10 × 100", risba: "roka", ikona: "vlozek", izbrano: "AF-RK je v roki. Klikni v izvrtino." },
    vijacnik,
    { id: "enota", naziv: "Zunanja enota", risba: "roka", ikona: "enota", brezRotacije: true, izbrano: "Zunanja enota je v roki. Klikni na konzolo." },
    kladivo("AF-RK ne zabijaš — privij vijak, da se tulec razpre v zidu."),
  ],
  koraki: [
    { naziv: "Prisloni konzolo", tip: "postavi", navodilo: "Klikni ob zid, da prisloniš konzolo.", obmocje: (t) => t.x > A.zid, potrdilo: "Konzola je poravnana. Vrtaš skozi luknje v konzoli." },
    { naziv: "Izvrtaj", orodje: "sveder10", nacin: "drzi", korak: 5, delci: "#c9a08a", navodilo: "Drži miško ob rdeči oznaki — vrtaj skozi konzolo v zid." },
    { naziv: "Izpihaj", orodje: "pihalka", nacin: "drzi", korak: 8, delci: C.prah, navodilo: "Drži miško ob luknji, dokler prah ne izgine.", preskok: "Izvrtina je še polna prahu — najprej izpihaj." },
    { naziv: "Vstavi AF-RK", orodje: "afrk", nacin: "klik", navodilo: "Klikni v vsako izvrtino — prirobnica nalega na konzolo." },
    { naziv: "Privij vijaka", orodje: "vijacnik", nacin: "drzi", korak: 4, navodilo: "Drži miško ob vijaku, dokler glava ne nalega." },
    { naziv: "Postavi enoto", tip: "postavi", orodje: "enota", navodilo: "Klikni na konzolo, da postaviš zunanjo enoto.", obmocje: (t) => t.x > A.zid, potrdilo: "Zunanja enota stoji na konzoli.", preskok: "Najprej privij oba vijaka." },
  ],
  prijem(o, li, s) {
    const y = A.Y[li];
    if (o.startsWith("sveder")) return { x: A.usta - A.L * PROGRESS(s.nap[li][1]), y };
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
              {li === 0 && r[1] >= 100 && r[3] < 100 && (
                <Mera x1={A.zid} y1={y - A.hw / 2 - 22} x2={A.zid - A.globina} y2={y - A.hw / 2 - 22} napis="Ø10 · h₁ = 70 mm" />
              )}
              {li === 0 && r[3] >= 100 && (
                <Napis x={A.usta + 40} y={y - 26} barva={C.ink}>AF-RK 10 × 100</Napis>
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
  podatki: [
    ["Vložek", "AF-RK 10 × 100"],
    ["Sveder", "Ø10 mm"],
    ["Globina vrtanja", "h₁ = 70 mm"],
    ["Sidrna globina", "h_ef = 60 mm"],
    ["Prirobnica", "Ø18,5 mm"],
    ["Pogon", "SW13 / TX40"],
    ["Podlage", "A–D: beton, opeka, zidaki, siporex"],
  ],
  banner: { x: 860, y: 520, sirina: 300 },
  konec: {
    napis: "PRITRJENO",
    kratko: "Klima stoji na konzoli.",
    naslov: "Konzola za klimo je pritrjena",
    besedilo: "Konzolo ste prislonili na zid, vrtali skozi njene luknje, izvrtini izpihali in vstavili okvirna vložka AF-RK. Ko vijak privijete, se tulec razpre v zidu, velika prirobnica pa nalega na konzolo.",
    povezave: [{ href: "/kontakt?vir=igra-afrk", label: "Zahtevaj ponudbo" }],
  },
};

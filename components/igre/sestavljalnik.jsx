/* Sestavljalnik montažnih iger (v2).
   Prerez je risan v lokalnih koordinatah: x je položaj ob površini (px), y je globina
   v milimetrih × merilo u (px/mm). Površina podlage je y = 0, podlaga je pri y > 0,
   element pred podlago je pri y < 0. Postavitev "tla" | "stena" | "strop" prerez zavrti.
   Mere (premer, dolžina, debelina …) so v mm in so lahko funkcije izbire igralca (I). */

import { C, Napis, NavojVijaka, Mera, Puscica } from "./orodje";

const P = (v) => v / 100;

const POSTAVITVE = {
  tla: { smer: 0, tr: (x, y) => ({ x, y: 300 + y }), g: "translate(0 300)" },
  stena: { smer: 90, tr: (x, y) => ({ x: 430 - y, y: x }), g: "translate(430 0) rotate(90)" },
  strop: { smer: 180, tr: (x, y) => ({ x: 1200 - x, y: 230 - y }), g: "translate(1200 230) rotate(180)" },
};

export const OROD = {
  sveder: (d) => ({ id: `sveder${d}`, naziv: `Sveder Ø${String(d).replace(".", ",")}`, risba: "sveder", ikona: "sveder", oznaka: `Ø${String(d).replace(".", ",")}`, sirina: 6 + d * 1.2, dolzina: 240, izbrano: `V vrtalnik je vpet sveder Ø${String(d).replace(".", ",")}. Držite miško nad rdečo oznako.` }),
  pihalka: { id: "pihalka", naziv: "Pihalka", risba: "pihalka", izbrano: "Pihalka je v roki. Držite miško nad luknjo." },
  krtacka: { id: "krtacka", naziv: "Krtača", risba: "roka", ikona: "sveder", izbrano: "Krtača je v roki. Držite miško nad luknjo." },
  vijacnik: { id: "vijacnik", naziv: "Vijačnik", risba: "vijacnik", izbrano: "Akumulatorski vijačnik je v roki. Nastavite ga na glavo vijaka in držite miško." },
  kladivo: { id: "kladivo", naziv: "Kladivo", risba: "kladivo", izbrano: "Kladivo je v roki. Vsak klik je en udarec." },
  kljuc: { id: "kljuc", naziv: "Ključ", risba: "roka", ikona: "kljuc", izbrano: "Ključ je v roki. Nastavite ga na matico ali glavo in držite miško." },
  pistola: { id: "pistola", naziv: "Pištola z maso", risba: "roka", ikona: "element", izbrano: "Pištola s kartušo je v roki. Držite miško nad luknjo." },
  zaga: { id: "zaga", naziv: "Žaga", risba: "roka", ikona: "kljuc", izbrano: "Žaga je v roki." },
};

/* ---------- risbe v lokalnem prerezu ---------- */
export function Vlozek({ x, vrh, L, d, barva = C.najlon, razpr = 0, prirobnica = true, mrezica = false }) {
  const h = d / 2, b = razpr;
  if (mrezica) {
    return (
      <g>
        <rect x={x - h} y={vrh} width={d} height={L} fill="#c9ced2" stroke={C.ink} strokeWidth="1.3" />
        {Array.from({ length: Math.floor(L / 8) }, (_, i) => <line key={i} x1={x - h} y1={vrh + i * 8} x2={x + h} y2={vrh + i * 8 + 8} stroke="#7e868d" strokeWidth="1" />)}
        {Array.from({ length: Math.floor(L / 8) }, (_, i) => <line key={`b${i}`} x1={x + h} y1={vrh + i * 8} x2={x - h} y2={vrh + i * 8 + 8} stroke="#7e868d" strokeWidth="1" />)}
      </g>
    );
  }
  const reb = [];
  for (let y = vrh + 10; y < vrh + L - 8; y += 9) reb.push(<line key={y} x1={x - h + 1} y1={y} x2={x + h - 1} y2={y + 4} stroke={C.ink} strokeWidth="0.9" opacity=".45" />);
  return (
    <g>
      <polygon points={`${x - h},${vrh + 4} ${x + h},${vrh + 4} ${x + h + b},${vrh + L * 0.62} ${x + h - 1},${vrh + L} ${x - h + 1},${vrh + L} ${x - h - b},${vrh + L * 0.62}`}
        fill={barva} stroke={C.ink} strokeWidth="1.4" strokeLinejoin="round" />
      {reb}
      {prirobnica && <rect x={x - h - Math.max(3, d * 0.2)} y={vrh} width={d + 2 * Math.max(3, d * 0.2)} height="5" rx="1.5" fill={barva} stroke={C.ink} strokeWidth="1.4" />}
    </g>
  );
}
export function Vijak({ x, glava, L, d, navoj = "lesni", glavaTip = "plosca", faza = 0, razpr = 0 }) {
  // glava = zgornji rob glave; telo do glava + hv + L
  const hv = glavaH(glavaTip, d);
  const dno = glava + hv + L;
  const konica = navoj === "metricni" || navoj === "palica" ? 2 : navoj === "svedrast" ? d * 1.2 : d * 0.9;
  if (navoj === "sidro") {
    const r = d / 2, nv = Math.max(3, d * 0.55);
    return (
      <g>
        <NavojVijaka x={x} y1={glava} y2={glava + hv + d * 3.5} sirina={d} korak={nv} faza={faza} />
        <rect x={x - r} y={glava + hv + d * 3.5} width={d} height={Math.max(0, L - d * 3.5 - d * 2.4)} fill={C.jeklo} stroke={C.ink} strokeWidth="1.2" />
        <rect x={x - r * 0.65} y={dno - d * 2.4} width={d * 0.65} height={d * 1.3} fill="#9aa0a5" stroke={C.ink} strokeWidth="1" />
        <polygon points={`${x - r * 0.65},${dno - d * 1.1} ${x + r * 0.65},${dno - d * 1.1} ${x + r},${dno - d * 0.3} ${x},${dno} ${x - r},${dno - d * 0.3}`} fill={C.jekloS} stroke={C.ink} strokeWidth="1.1" />
        {[-1, 1].map((sg) => <polygon key={sg} points={`${x + sg * r * 0.65},${dno - d * 2.5} ${x + sg * (r + razpr * 0.3)},${dno - d * 2.5} ${x + sg * (r + razpr)},${dno - d * 1.1} ${x + sg * r * 0.65},${dno - d * 1.1}`} fill="#c9d0d6" stroke={C.ink} strokeWidth="1" />)}
        <rect x={x - d * 0.75} y={glava + d} width={d * 1.5} height={d * 0.8} rx="1.5" fill={C.jekloS} stroke={C.ink} strokeWidth="1.3" />
        <line x1={x - d * 0.3} y1={glava + d} x2={x - d * 0.3} y2={glava + d * 1.8} stroke={C.ink} strokeWidth="0.9" />
        <line x1={x + d * 0.3} y1={glava + d} x2={x + d * 0.3} y2={glava + d * 1.8} stroke={C.ink} strokeWidth="0.9" />
        <rect x={x - d * 1.55} y={glava + d * 1.8} width={d * 3.1} height={d * 0.2} rx="1" fill="#d5d9dc" stroke={C.ink} strokeWidth="1" />
      </g>
    );
  }
  return (
    <g>
      <NavojVijaka x={x} y1={glava + hv} y2={dno - konica} sirina={d} korak={navoj === "lesni" ? Math.max(4, d * 0.9) : Math.max(3, d * 0.55)} faza={faza} />
      {navoj === "svedrast" ? (
        <polygon points={`${x - d * 0.35},${dno - konica} ${x + d * 0.35},${dno - konica} ${x + d * 0.35},${dno - 3} ${x},${dno} ${x - d * 0.35},${dno - 3}`} fill="#c9ced2" stroke={C.ink} strokeWidth="1.1" />
      ) : konica > 2 ? (
        <polygon points={`${x - d / 2 + 1},${dno - konica} ${x + d / 2 - 1},${dno - konica} ${x},${dno}`} fill={C.jeklo} stroke={C.ink} strokeWidth="1.1" />
      ) : null}
      {glavaTip === "plosca" && <rect x={x - d * 0.95} y={glava} width={d * 1.9} height={hv} rx="2" fill={C.jekloS} stroke={C.ink} strokeWidth="1.3" />}
      {glavaTip === "ugrez" && <polygon points={`${x - d},${glava} ${x + d},${glava} ${x + d / 2},${glava + hv} ${x - d / 2},${glava + hv}`} fill={C.jekloS} stroke={C.ink} strokeWidth="1.3" strokeLinejoin="round" />}
      {glavaTip === "sestroba" && <rect x={x - d * 0.85} y={glava} width={d * 1.7} height={hv} rx="1.5" fill={C.jekloS} stroke={C.ink} strokeWidth="1.3" />}
      {glavaTip === "prirobnica" && (<>
        <rect x={x - d * 1.1} y={glava + hv - 2} width={d * 2.2} height="3" fill={C.jekloS} stroke={C.ink} strokeWidth="1.1" />
        <rect x={x - d * 0.8} y={glava} width={d * 1.6} height={hv - 2} rx="1.5" fill={C.jekloS} stroke={C.ink} strokeWidth="1.3" />
      </>)}
      {glavaTip === "goba" && (<>
        <path d={`M ${x - d * 1.2} ${glava + hv * 0.55} Q ${x} ${glava - hv * 0.45} ${x + d * 1.2} ${glava + hv * 0.55} Z`} fill={C.jekloS} stroke={C.ink} strokeWidth="1.3" />
        <rect x={x - d / 2 - 1} y={glava + hv * 0.55} width={d + 2} height={hv * 0.45} fill="#9aa0a5" stroke={C.ink} strokeWidth="1.1" />
      </>)}
    </g>
  );
}
export function glavaH(tip, d) {
  return { plosca: Math.max(5, d * 0.55), ugrez: Math.max(5, d * 0.6), sestroba: Math.max(6, d * 0.7), prirobnica: Math.max(6, d * 0.7), goba: Math.max(10, d * 1.4), sidro: d * 2, brez: 0 }[tip] ?? 0;
}
export function Hanger({ x, vrh, Lles, Lmet, d, faza }) {
  return (
    <g>
      <NavojVijaka x={x} y1={vrh} y2={vrh + Lmet} sirina={d} korak={Math.max(3, d * 0.5)} faza={faza} />
      <rect x={x - d * 0.6} y={vrh + Lmet - 3} width={d * 1.2} height="6" fill="#9aa0a5" stroke={C.ink} strokeWidth="1" />
      <NavojVijaka x={x} y1={vrh + Lmet + 3} y2={vrh + Lmet + Lles - d * 0.9} sirina={d * 0.95} korak={Math.max(4, d * 0.9)} faza={faza} />
      <polygon points={`${x - d * 0.45},${vrh + Lmet + Lles - d * 0.9} ${x + d * 0.45},${vrh + Lmet + Lles - d * 0.9} ${x},${vrh + Lmet + Lles}`} fill={C.jeklo} stroke={C.ink} strokeWidth="1.1" />
    </g>
  );
}
export function Matica({ x, y, d, faza = 0 }) {
  const w = d * 1.75, h = d * 0.8;
  const f = 0.22 + 0.12 * Math.sin(faza);
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx="1.5" fill={C.jekloS} stroke={C.ink} strokeWidth="1.4" />
      <line x1={x - w / 2 + w * f} y1={y - h} x2={x - w / 2 + w * f} y2={y} stroke={C.ink} strokeWidth="0.9" />
      <line x1={x + w / 2 - w * (0.44 - f)} y1={y - h} x2={x + w / 2 - w * (0.44 - f)} y2={y} stroke={C.ink} strokeWidth="0.9" />
    </g>
  );
}
export function Podlozka({ x, y, d, h = 2 }) { return <rect x={x - d} y={y - h} width={d * 2} height={h} fill="#d5d9dc" stroke={C.ink} strokeWidth="1" />; }
function Tarca({ x, y }) {
  return (
    <g pointerEvents="none">
      <circle cx={x} cy={y} r="15" fill={C.red} opacity="0.22"><animate attributeName="r" values="10;19;10" dur="1.6s" repeatCount="indefinite" /></circle>
      <circle cx={x} cy={y} r="6" fill={C.red} />
    </g>
  );
}
function Gumb({ x, y, napis }) {
  return (
    <g style={{ cursor: "pointer" }}>
      <rect x={x - 160} y={y} width="320" height="56" rx="28" fill={C.red} />
      <text x={x} y={y + 35} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800" letterSpacing="1.5">{napis}</text>
    </g>
  );
}
const FILL = { omet: "#ece6da", beton: "url(#v-beton)", zid: "url(#v-zid)", les: "url(#v-les)", jeklo: C.jeklo, eps: "#fbfbf6", mavec: "#f7f6f1", votla: "url(#v-zid)" };
function PodlagaZaslon({ tip, x, y, w, h, rob }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={FILL[tip]} stroke={tip === "jeklo" ? C.ink : "none"} strokeWidth="1.5" />
      {tip === "eps" && Array.from({ length: 90 }, (_, i) => <circle key={i} cx={x + ((i * 97) % Math.max(1, w))} cy={y + ((i * 53) % Math.max(1, h))} r={6 + (i % 4)} fill="none" stroke="#d6d6cc" strokeWidth="1.4" />)}
      {rob && <line {...rob} stroke={C.ink} strokeWidth="2.5" />}
    </g>
  );
}

/* ---------- sestavljalnik ---------- */
export function sestavi(o) {
  const pos = POSTAVITVE[o.postavitev ?? "tla"];
  const u = o.u ?? 3;                       // px na mm (globina in premeri)
  const tr = pos.tr;
  const X = o.luknje;                       // lateralni položaji lukenj (px)
  const F = (v, I) => (typeof v === "function" ? v(I ?? {}) : v);
  const koraki = [];
  const ix = {};
  const add = (kljuc, k) => { ix[kljuc] = koraki.length; koraki.push({ ...k, kljuc }); };
  const izbiraPred = (kljuc) => (o.izbire ?? []).filter((z) => z.pred === kljuc).forEach((z, i) => add(`izbira-${kljuc}-${i}`, { tip: "izbira", naziv: z.naziv, navodilo: z.navodilo ?? "Izberite v desnem stolpcu in potrdite izbiro.", scenarij: z.scenarij, skupine: z.skupine, preveri: z.preveri, potrdilo: z.potrdilo }));

  const el = o.element;
  const elPrej = el && !el.potem;
  izbiraPred("zacetek");
  if (elPrej) add("element", { naziv: el.korak ?? "Postavite element", tip: "postavi", navodilo: el.navodilo ?? "Kliknite v prizor.", potrdilo: el.potrdilo });
  izbiraPred("vrtaj");
  if (o.vrtanje) add("vrtaj", {
    naziv: o.vrtanje.naziv ?? "Izvrtajte", orodje: o.vrtanje.svedri ? o.vrtanje.svedri.map((d) => `sveder${d}`) : "sveder", nacin: "drzi", korak: 4, delci: o.vrtanje.delci ?? "#b9b4a4",
    vzemi: o.vrtanje.vzemi ?? "Vzemite iz orodjarne pravi sveder.", navodilo: o.vrtanje.navodilo ?? "Držite miško nad rdečo oznako, dokler luknja ni izvrtana.",
    preveriOrodje: o.vrtanje.pravi ? (id, s) => { const d = Number(id.replace("sveder", "")); const prav = F(o.vrtanje.pravi, s.izbor); return d === prav ? null : (o.vrtanje.napaka?.(d, prav, s.izbor) ?? `Za to izbiro potrebujete sveder Ø${String(prav).replace(".", ",")}.`); } : undefined,
  });
  if (o.pihaj) add("pihaj", { naziv: o.pihaj.naziv ?? "Očistite luknjo", orodje: "pihalka", nacin: "drzi", korak: 7, delci: C.prah, navodilo: o.pihaj.navodilo ?? "Držite miško nad luknjo, dokler prah ne izgine.", preskok: "Luknja je še polna prahu, najprej jo očistite." });
  izbiraPred("vlozek");
  if (o.vlozek) add("vlozek", { naziv: o.vlozek.korak ?? "Vstavite vložek", orodje: "vlozek", nacin: "klik", navodilo: o.vlozek.navodilo ?? "Kliknite v vsako luknjo." });
  if (o.masa) add("masa", { naziv: "Napolnite z maso", orodje: "pistola", nacin: "drzi", korak: 5, navodilo: o.masa.navodilo ?? "Držite miško nad luknjo: masa naj napolnite dve tretjini luknje, od dna navzgor.", preskok: "Najprej napolnite luknjo s kemično maso." });
  if (el?.potem && el.predVijakom) add("element", { naziv: el.korak ?? "Prislonite element", tip: "postavi", orodje: "element", navodilo: el.navodilo ?? "Kliknite v prizor.", potrdilo: el.potrdilo, preskok: "Najprej pripravite pritrdila." });
  izbiraPred("vijak");
  const vz = o.vijak;
  if (vz) {
    if (!vz.brezVstavi) add("vstavi", { naziv: vz.vstavi ?? "Nastavite vijak", orodje: vz.orodjeVstavi ?? "vijak", nacin: "klik", navodilo: vz.vstaviNavodilo ?? "Kliknite na rdečo oznako, da nastavite vijak.", preskok: vz.preskok });
    if (!vz.brezPrivijanja) add("vijak", { naziv: vz.korak ?? "Privijte", orodje: vz.orodje ?? "vijacnik", nacin: vz.orodje === "kladivo" ? "udarci" : "drzi", korak: vz.orodje === "kladivo" ? (vz.udarec ?? 34) : (vz.hitrost ?? 3), navodilo: vz.navodilo ?? "Nastavite orodje na glavo vijaka in držite miško, dokler glava ne naleže.", preskok: vz.preskok });
  }
  if (el?.potem && !el.predVijakom) add("element", { naziv: el.korak ?? "Namestite element", tip: "postavi", orodje: "element", navodilo: el.navodilo ?? "Kliknite v prizor.", potrdilo: el.potrdilo, preskok: "Najprej pripravite pritrdila." });
  izbiraPred("matica");
  const mt = o.matica;
  if (mt) {
    if (mt.podlozka !== false) add("podlozka", { naziv: mt.podlozkaKorak ?? "Podložka", orodje: "podlozka", nacin: "klik", navodilo: mt.podlozkaNavodilo ?? "Kliknite na vsak vijak, da nadenete podložko." });
    add("matica", { naziv: mt.korak ?? "Zategnite matico", orodje: "kljuc", nacin: "drzi", korak: 4, navodilo: mt.navodilo ?? "Nastavite ključ na matico in držite miško, dokler ni zategnjena." });
  }
  (Array.isArray(o.dodatno) ? o.dodatno : o.dodatno ? [o.dodatno] : []).forEach((k, i) => add(i ? `dodatno${i + 1}` : "dodatno", k));

  const has = (k) => ix[k] != null;
  const pr = (s, li, k) => (has(k) ? P(s.nap[li][ix[k]]) : 1);
  const done = (s, li, k) => (has(k) ? s.nap[li][ix[k]] >= 100 : true);
  const kljucKoraka = (s) => koraki[Math.min(s.korak, koraki.length - 1)]?.kljuc;

  // geometrija (vse v px lokalno)
  const geo = (s) => {
    const I = s.izbor ?? {};
    const tEl = (F(el?.debelina, I) ?? 0) * u;           // debelina elementa
    const tPre = elPrej || (el?.potem && done(s, 0, "element")) ? tEl : (elPrej ? tEl : 0);
    const D = (F(o.vrtanje?.globina, I) ?? 0) * u;        // globina luknje v podlagi
    const hd = (F(o.vrtanje?.premer, I) ?? 8) * u;        // premer luknje
    const vL = (F(o.vlozek?.dolzina, I) ?? 0) * u;
    const vd = (F(o.vlozek?.premer, I) ?? 8) * u;
    const L = (F(vz?.L, I) ?? 0) * u;
    const d = (F(vz?.d, I) ?? 6) * u;
    const hv = vz?.tip === "hanger" ? 0 : glavaH(vz?.glava ?? "plosca", d);
    const vrhVlozka = (F(o.vlozek?.vrh, I) ?? 0) * u;     // npr. -tEl za montažo skozi element
    const koncna = vz?.koncnaGlava != null ? F(vz.koncnaGlava, I) * u : -tEl - hv;
    const vstop = vz?.vstop != null ? F(vz.vstop, I) * u : -tEl;   // kje je konica, ko je vijak nastavljen
    const Lles = (F(vz?.Lles, I) ?? 0) * u, Lmet = (F(vz?.Lmet, I) ?? 0) * u;
    return { I, tEl, tPre: elPrej ? tEl : 0, D, hd, vL, vd, L, d, hv, vrhVlozka, koncna, vstop, Lles, Lmet };
  };
  const glavaVijaka = (g, q) => {
    if (vz?.tip === "hanger") { const zac = g.vstop - g.Lles - g.Lmet, kon = -g.Lmet; return zac + (kon - zac) * q; }
    const zac = g.vstop - g.L - g.hv; return zac + (g.koncna - zac) * q;
  };
  const maticaY = (s, li) => F(mt?.naY, s.izbor) * u;

  function cilj(li, s) {
    const x = X[li], g = geo(s), k = kljucKoraka(s);
    if (k === "vijak") return tr(x, vz.tip === "hanger" ? glavaVijaka(g, pr(s, li, "vijak")) : glavaVijaka(g, pr(s, li, "vijak")));
    if (k === "matica" || k === "podlozka") return tr(x, maticaY(s, li) + (mt.spodaj ? 18 : -14));
    if (k?.startsWith("dodatno") && vz) return tr(x, glavaVijaka(g, 1) + (vz.glava === "sidro" ? g.d * 1.4 : 0));
    if (k === "masa" || k === "pihaj") return tr(x, -g.tPre);
    return tr(x, -g.tPre);
  }

  function narisiLokalno(s) {
    const g = geo(s);
    const elNa = el && done(s, 0, "element");
    return (
      <g>
        {o.risbaPod?.(s, g)}
        {elPrej && elNa && el.risba(s, g)}
        {X.map((x, li) => {
          const vrt = pr(s, li, "vrtaj");
          const dno = -g.tPre + (g.tPre + g.D) * vrt;
          const pih = pr(s, li, "pihaj");
          const masa = pr(s, li, "masa");
          const q = pr(s, li, "vijak");
          const nastavljen = vz?.brezVstavi ? done(s, li, "vlozek") : has("vstavi") && done(s, li, "vstavi");
          return (
            <g key={li}>
              {has("vrtaj") && vrt > 0 && <rect x={x - g.hd / 2} y={-g.tPre} width={g.hd} height={dno + g.tPre} fill={C.luknja} />}
              {has("pihaj") && vrt >= 1 && pih < 1 && Array.from({ length: Math.ceil((1 - pih) * 16) }, (_, i) => (
                <circle key={i} cx={x + (((i * 37) % 10) / 10 - 0.5) * g.hd * 0.7} cy={g.D - 3 - ((i * 11) % Math.max(10, g.D * 0.5))} r={1.4 + (i % 3) * 0.6} fill={C.prah} />
              ))}
              {has("vlozek") && done(s, li, "vlozek") && <Vlozek x={x} vrh={g.vrhVlozka} L={g.vL} d={g.vd} barva={F(o.vlozek.barva, g.I)} razpr={q * (o.vlozek.razpr ?? 2)} mrezica={o.vlozek.mrezica} prirobnica={o.vlozek.prirobnica !== false} />}
              {has("masa") && masa > 0 && (() => { const f = Math.min(1, 0.66 * masa + (masa >= 1 ? 0.34 * q : 0)); const w = o.vlozek?.mrezica ? g.vd - 4 : g.hd; return <rect x={x - w / 2} y={g.D - g.D * f} width={w} height={g.D * f} fill="#8e979f" opacity="0.92" />; })()}
              {vz && (nastavljen || q > 0) && (vz.tip === "hanger"
                ? <Hanger x={x} vrh={glavaVijaka(g, q)} Lles={g.Lles} Lmet={g.Lmet} d={g.d} faza={q * 40} />
                : <Vijak x={x} glava={glavaVijaka(g, q)} L={g.L} d={g.d} navoj={vz.navoj} glavaTip={vz.glava} faza={q * 40} razpr={F(vz.razpr, { s, li, pr: (k) => pr(s, li, k) }) ?? 0} />)}
            </g>
          );
        })}
        {el?.potem && elNa && el.risba(s, g)}
        {mt && X.map((x, li) => {
          const pod = done(s, li, "podlozka") && (mt.podlozka !== false);
          const m = pr(s, li, "matica");
          const yNa = maticaY(s, li);
          const md = F(mt.d, g.I) * u;
          const hP = Math.max(2, F(mt.podlozkaH ?? 1.6, g.I) * u);
          const hV = mt.vzmetna ? Math.max(2, 2 * u) : 0;
          const visina = md * 0.8;
          const pot = (mt.pot ?? 18) * u;
          return (
            <g key={`m${li}`}>
              {pod && (mt.spodaj ? <Podlozka x={x} y={yNa + hP} d={md} h={hP} /> : <Podlozka x={x} y={yNa} d={md} h={hP} />)}
              {pod && hV > 0 && (mt.spodaj
                ? <rect x={x - md * 0.85} y={yNa + hP} width={md * 1.7} height={hV} fill="#9da6ad" stroke={C.ink} strokeWidth="0.9" />
                : <rect x={x - md * 0.85} y={yNa - hP - hV} width={md * 1.7} height={hV} fill="#9da6ad" stroke={C.ink} strokeWidth="0.9" />)}
              {(s.korak >= ix.matica || m > 0) && (mt.spodaj
                ? <Matica x={x} y={yNa + hP + hV + visina + (1 - m) * pot} d={md} faza={m * 22} />
                : <Matica x={x} y={yNa - hP - hV - (1 - m) * pot} d={md} faza={m * 22} />)}
            </g>
          );
        })}
        {o.risbaNad?.(s, g)}
      </g>
    );
  }

  return {
    id: o.id,
    naslovPrizora: o.naslov,
    nadnaslov: o.nadnaslov ?? "PREREZ",
    smer: pos.smer,
    kicker: o.kicker ?? (o.postavitev === "stena" ? { x: 470, y: 34 } : { x: 40, y: 34 }),
    dosegZadetka: o.doseg ?? 90,
    luknje: X.map((x) => tr(x, 0)),
    cilj,
    orodja: o.orodja,
    koraki,
    prijem(id, li, s) {
      const x = X[li], g = geo(s), k = kljucKoraka(s);
      if (id.startsWith("sveder")) return tr(x, -g.tPre + (g.tPre + g.D) * pr(s, li, "vrtaj"));
      if (id === "pihalka") return tr(x, g.D * 0.35);
      if (id === "pistola") return tr(x, g.D * (1 - 0.66 * pr(s, li, "masa")));
      if (k === "vijak") return tr(x, glavaVijaka(g, pr(s, li, "vijak")));
      if (k?.startsWith("dodatno") && vz && id === "kljuc") return tr(x, glavaVijaka(g, 1) + (vz.glava === "sidro" ? g.d * 1.4 : 0));
      if (id === "kljuc" && mt) return tr(x, maticaY(s, li) + (mt.spodaj ? (F(mt.d, g.I) * u) : -(F(mt.d, g.I) * u * 0.4)));
      return null;
    },
    vRoki(id) {
      if (o.vRoki) { const r = o.vRoki(id); if (r) return r; }
      if (id === "vlozek" && o.vlozek) return <Vlozek x={0} vrh={-40} L={40} d={14} barva={F(o.vlozek.barva, {})} mrezica={o.vlozek.mrezica} />;
      if (id === "vijak" && vz) {
        if (vz.tip === "hanger") return <Hanger x={0} vrh={-70} Lles={40} Lmet={30} d={10} faza={0} />;
        return <Vijak x={0} glava={-62} L={56} d={10} navoj={vz.navoj} glavaTip={vz.glava} />;
      }
      if (id === "podlozka") return <Podlozka x={0} y={0} d={14} h={4} />;
      if (id === "kljuc") return (
        <g transform="rotate(-90)">
          <path d="M -26 -16 L -6 -16 L -6 -6 L 4 -6 L 4 6 L -6 6 L -6 16 L -26 16 Z" fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" />
          <rect x="-180" y="-8" width="156" height="16" rx="6" fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" />
          <rect x="-180" y="-9" width="52" height="18" rx="6" fill={C.red} />
        </g>
      );
      if (id === "pistola") return (
        <g>
          <rect x="-5" y="-60" width="10" height="60" fill="#e8e2d0" stroke={C.ink} strokeWidth="1.2" />
          <rect x="-26" y="-200" width="52" height="140" rx="8" fill="#c42026" stroke={C.ink} strokeWidth="1.5" />
          <rect x="22" y="-170" width="70" height="22" rx="8" fill={C.dark} />
          <rect x="60" y="-150" width="22" height="70" rx="8" fill={C.dark} />
        </g>
      );
      if (id === "element" && el?.vRoki) return el.vRoki();
      return null;
    },
    narisi(s) {
      const g = geo(s);
      const prvi = elPrej && s.nap[0][ix.element] < 100;
      const k = kljucKoraka(s);
      const naLuknji = ["vrtaj", "pihaj", "vlozek", "masa", "vstavi", "vijak", "podlozka", "matica"];
      return (
        <g>
          {(o.podlage ?? [{ tip: o.podlaga ?? "beton", od: 0, do: 400 }]).map((p, i) => {
            const a = tr(-2000, p.od * u), b = tr(3000, p.do * u);
            const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y), w = Math.abs(a.x - b.x), h = Math.abs(a.y - b.y);
            const p0 = tr(0, p.od * u), p1 = tr(10, p.od * u);
            const vod = Math.abs(p0.y - p1.y) < 1;
            return <PodlagaZaslon key={i} tip={p.tip} x={x} y={y} w={w} h={h} rob={i === 0 ? (vod ? { x1: 0, y1: p0.y, x2: 1200, y2: p0.y } : { x1: p0.x, y1: 0, x2: p0.x, y2: 600 }) : null} />;
          })}
          <g transform={pos.g}>{narisiLokalno(s)}</g>
          {!s.koncano && !prvi && (naLuknji.includes(k) || (k?.startsWith("dodatno") && koraki[s.korak]?.tip !== "postavi")) && X.map((x, li) => (s.nap[li][s.korak] < 100 ? <Tarca key={li} {...cilj(li, s)} /> : null))}
          {(o.napisi ?? []).map((n, i) => (typeof n === "function" ? <g key={i}>{n(s, tr, g)}</g> : <Napis key={i} x={n.x} y={n.y} barva={n.barva ?? C.ink} velikost={n.velikost ?? 17} sidro={n.sidro}>{n.t}</Napis>))}
          {has("vrtaj") && o.vrtanje.mera && s.nap[0][ix.vrtaj] >= 100 && s.korak <= (ix.vlozek ?? ix.masa ?? ix.vstavi ?? 99) && (() => {
            const a = tr(X[0] - g.hd / 2 - 22, 0), b = tr(X[0] - g.hd / 2 - 22, g.D);
            return <Mera x1={a.x} y1={a.y} x2={b.x} y2={b.y} napis={F(o.vrtanje.mera, g.I)} stran={-1} />;
          })()}
          {o.oznaka && (vz?.brezVstavi ? done(s, 0, "vlozek") : done(s, 0, "vstavi")) && (() => { const p = tr(X[0], -g.tEl); return <Napis x={p.x + (o.postavitev === "stena" ? 30 : 34)} y={p.y + (o.postavitev === "stena" ? -30 : -46)} barva={C.ink}>{F(o.oznaka, g.I)}</Napis>; })()}
          {prvi && <Gumb {...(el.gumb ?? { x: 800, y: 460 })} napis={el.gumbNapis ?? "Postavite"} />}
          {o.nad?.(s, tr, g)}
        </g>
      );
    },
    podatki: o.podatki,
    banner: o.banner ?? (o.postavitev === "stena" ? { x: 860, y: 520, sirina: 300 } : { x: 860, y: 30, sirina: 300 }),
    konec: o.konec,
  };
}

export { Napis, Puscica, C };

/* ---------- pomočniki za izbire ---------- */
export const fmt = (v) => String(v).replace(".", ",");
export const izbor = (kljuc, naslov, vrednosti, napis = (v) => fmt(v)) => ({ kljuc, naslov, moznosti: vrednosti.map((v) => ({ v, napis: napis(v) })) });

/* Sestavljalnik montažnih iger: iz opisa izdelka zgradi konfiguracijo za IgraMontaza.
   Prizor je risan v lokalnem prerezu: površina podlage je y = 0, podlaga je pri y > 0,
   element (ki ga pritrjujemo) je pri y < 0. Postavitev "tla" (od zgoraj), "stena"
   (podlaga levo) ali "strop" (podlaga zgoraj) prerez samo zavrti. Napisi so vedno
   vodoravni (risani po preslikavi). */

import { C, Puscica, Napis, NavojVijaka, Mera } from "./orodje";

const P = (v) => v / 100;

const POSTAVITVE = {
  tla: { smer: 0, tr: (x, y) => ({ x, y: 330 + y }), g: "translate(0 330)" },
  stena: { smer: 90, tr: (x, y) => ({ x: 400 - y, y: x }), g: "translate(400 0) rotate(90)" },
  strop: { smer: 180, tr: (x, y) => ({ x: 1200 - x, y: 230 - y }), g: "translate(1200 230) rotate(180)" },
};

export const OROD = {
  sveder: (d, oznaka) => ({ id: `sveder${d}`, naziv: oznaka ? `Sveder ${oznaka}` : "Vrtalnik", risba: "sveder", ikona: "sveder", oznaka, sirina: 14, dolzina: 230 }),
  pihalka: { id: "pihalka", naziv: "Pihalka", risba: "pihalka", izbrano: "Pihalka je v roki. Drži miško nad luknjo." },
  vijacnik: { id: "vijacnik", naziv: "Vijačnik", risba: "vijacnik", izbrano: "Akumulatorski vijačnik je v roki. Drži miško nad vijakom." },
  kladivo: { id: "kladivo", naziv: "Kladivo", risba: "kladivo", izbrano: "Kladivo je v roki. Vsak klik je en udarec." },
  kljuc: { id: "kljuc", naziv: "Ključ", risba: "roka", ikona: "kljuc", izbrano: "Ključ je v roki. Drži miško nad matico ali glavo vijaka." },
  pistola: { id: "pistola", naziv: "Pištola z maso", risba: "roka", ikona: "element", izbrano: "Pištola s kartušo je v roki. Drži miško nad luknjo." },
};

/* ---------- risbe v lokalnem prerezu ---------- */
function Vlozek({ x, vrh, L, d, barva = C.najlon, razpr = 0 }) {
  const h = d / 2, b = razpr;
  const reb = [];
  for (let y = vrh + 14; y < vrh + L - 10; y += 12) reb.push(<line key={y} x1={x - h} y1={y} x2={x + h} y2={y + 5} stroke={C.ink} strokeWidth="1" opacity=".5" />);
  return (
    <g>
      <polygon points={`${x - h},${vrh + 6} ${x + h},${vrh + 6} ${x + h + b},${vrh + L * 0.6} ${x + h - 2},${vrh + L} ${x - h + 2},${vrh + L} ${x - h - b},${vrh + L * 0.6}`}
        fill={barva} stroke={C.ink} strokeWidth="1.5" strokeLinejoin="round" />
      {reb}
      <rect x={x - h - 6} y={vrh} width={d + 12} height="7" rx="2" fill={barva} stroke={C.ink} strokeWidth="1.5" />
    </g>
  );
}
function Vijak({ x, glava, L, d, tip = "lesni", glavaTip = "plosca", faza = 0 }) {
  // glava = zgornji rob glave, vijak gre navzdol do glava + L
  const hv = glavaTip === "sestroba" ? 14 : 8;
  const dno = glava + hv + L;
  return (
    <g>
      {tip === "palica" ? (
        <NavojVijaka x={x} y1={glava} y2={dno} sirina={d} korak={5} faza={faza} />
      ) : (
        <>
          <NavojVijaka x={x} y1={glava + hv} y2={dno - 10} sirina={d} korak={tip === "lesni" ? 8 : 5} faza={faza} />
          {tip === "svedrast" ? (
            <polygon points={`${x - d * 0.3},${dno - 10} ${x + d * 0.3},${dno - 10} ${x + d * 0.3},${dno - 4} ${x},${dno} ${x - d * 0.3},${dno - 4}`} fill="#c9ced2" stroke={C.ink} strokeWidth="1.2" />
          ) : (
            <polygon points={`${x - d / 2 + 1},${dno - 10} ${x + d / 2 - 1},${dno - 10} ${x},${dno}`} fill={C.jeklo} stroke={C.ink} strokeWidth="1.2" />
          )}
        </>
      )}
      {glavaTip === "plosca" && <rect x={x - d - 4} y={glava} width={2 * d + 8} height={hv} rx="3" fill={C.jekloS} stroke={C.ink} strokeWidth="1.4" />}
      {glavaTip === "sestroba" && <rect x={x - d - 2} y={glava} width={2 * d + 4} height={hv} rx="2" fill={C.jekloS} stroke={C.ink} strokeWidth="1.4" />}
      {glavaTip === "prirobnica" && (<>
        <rect x={x - d - 8} y={glava + hv - 3} width={2 * d + 16} height="4" fill={C.jekloS} stroke={C.ink} strokeWidth="1.2" />
        <rect x={x - d + 1} y={glava} width={2 * d - 2} height={hv - 3} rx="2" fill={C.jekloS} stroke={C.ink} strokeWidth="1.4" />
      </>)}
      {glavaTip === "goba" && (<>
        <path d={`M ${x - d - 10} ${glava + hv} Q ${x} ${glava - 12} ${x + d + 10} ${glava + hv} Z`} fill={C.jekloS} stroke={C.ink} strokeWidth="1.4" />
        <rect x={x - d / 2 - 2} y={glava + hv} width={d + 4} height="12" fill="#9aa0a5" stroke={C.ink} strokeWidth="1.2" />
      </>)}
    </g>
  );
}
function Hanger({ x, vrh, Lles, Lmet, d, faza }) {
  // vrh = vrh metričnega dela; lesni del spodaj
  return (
    <g>
      <NavojVijaka x={x} y1={vrh} y2={vrh + Lmet} sirina={d} korak={4} faza={faza} />
      <NavojVijaka x={x} y1={vrh + Lmet} y2={vrh + Lmet + Lles - 10} sirina={d + 2} korak={9} faza={faza} />
      <polygon points={`${x - d / 2},${vrh + Lmet + Lles - 10} ${x + d / 2},${vrh + Lmet + Lles - 10} ${x},${vrh + Lmet + Lles}`} fill={C.jeklo} stroke={C.ink} strokeWidth="1.2" />
    </g>
  );
}
function Matica({ x, y, d, faza = 0 }) {
  // y = spodnji rob matice
  const w = d * 2.2, h = d * 0.9;
  return (
    <g>
      <rect x={x - w / 2} y={y - h} width={w} height={h} rx="2" fill={C.jekloS} stroke={C.ink} strokeWidth="1.5" />
      <line x1={x - w / 2 + w * (0.2 + 0.1 * Math.sin(faza))} y1={y - h} x2={x - w / 2 + w * (0.2 + 0.1 * Math.sin(faza))} y2={y} stroke={C.ink} strokeWidth="1" />
      <line x1={x + w / 2 - w * (0.2 - 0.1 * Math.sin(faza))} y1={y - h} x2={x + w / 2 - w * (0.2 - 0.1 * Math.sin(faza))} y2={y} stroke={C.ink} strokeWidth="1" />
    </g>
  );
}
function Podlozka({ x, y, d }) { return <rect x={x - d * 1.6} y={y - 4} width={d * 3.2} height="4" fill="#d5d9dc" stroke={C.ink} strokeWidth="1.2" />; }

function Podlaga({ tip, od = 0, do: dno = 400, x0 = -400, x1 = 1600 }) {
  const fill = { beton: "url(#v-beton)", zid: "url(#v-zid)", les: "url(#v-les)", jeklo: C.jeklo, eps: "#fbfbf6", mavec: "#f7f6f1" }[tip];
  return (
    <g>
      <rect x={x0} y={od} width={x1 - x0} height={dno - od} fill={fill} stroke={tip === "jeklo" ? C.ink : "none"} strokeWidth="2" />
      {tip === "eps" && Array.from({ length: 60 }, (_, i) => <circle key={i} cx={x0 + ((i * 97) % (x1 - x0))} cy={od + 10 + ((i * 53) % Math.max(20, dno - od - 20))} r={5 + (i % 4)} fill="none" stroke="#dcdcd4" strokeWidth="1.2" />)}
      <line x1={x0} y1={od} x2={x1} y2={od} stroke={C.ink} strokeWidth="3" />
    </g>
  );
}
function PodlagaZaslon({ tip, x, y, w, h, rob }) {
  const fill = { beton: "url(#v-beton)", zid: "url(#v-zid)", les: "url(#v-les)", jeklo: C.jeklo, eps: "#fbfbf6", mavec: "#f7f6f1" }[tip];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={fill} stroke={tip === "jeklo" ? C.ink : "none"} strokeWidth="2" />
      {tip === "eps" && Array.from({ length: 90 }, (_, i) => <circle key={i} cx={x + ((i * 97) % Math.max(1, w))} cy={y + ((i * 53) % Math.max(1, h))} r={6 + (i % 4)} fill="none" stroke="#d6d6cc" strokeWidth="1.4" />)}
      <line {...rob} stroke={C.ink} strokeWidth="3" />
    </g>
  );
}
function Tarca({ x, y }) {
  return (
    <g>
      <circle cx={x} cy={y} r="16" fill={C.red} opacity="0.22"><animate attributeName="r" values="11;20;11" dur="1.6s" repeatCount="indefinite" /></circle>
      <circle cx={x} cy={y} r="7" fill={C.red} />
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

/* ---------- sestavljalnik ---------- */
export function sestavi(o) {
  const pos = POSTAVITVE[o.postavitev ?? "tla"];
  const K = o.merilo ?? 1.8, cx = o.postavitev === "stena" ? 300 : 600;
  const tr = (x, y) => pos.tr(cx + (x - cx) * K, y * K);
  const gLok = `${pos.g} translate(${cx} 0) scale(${K}) translate(${-cx} 0)`;
  const X = o.luknje;                 // lokalni x lukenj
  const t = o.element?.debelina ?? 0; // debelina elementa (pred vrtanjem)
  const koraki = [];
  const ix = {};
  const add = (kljuc, k) => { ix[kljuc] = koraki.length; koraki.push(k); };

  if (o.element && !o.element.potem) add("element", { naziv: o.element.korak ?? "Postavi element", tip: "postavi", navodilo: o.element.navodilo ?? `Klikni v prizor, da postaviš: ${o.element.ime.toLowerCase()}.`, potrdilo: o.element.potrdilo ?? `${o.element.ime} je na mestu.` });
  if (o.vrtanje) add("vrtaj", { naziv: o.vrtanje.naziv ?? "Izvrtaj", orodje: o.vrtanje.orodje, nacin: "drzi", korak: 5, delci: o.vrtanje.delci ?? "#b9b4a4", navodilo: o.vrtanje.navodilo ?? "Drži miško nad rdečo oznako, dokler luknja ni izvrtana." });
  if (o.pihaj) add("pihaj", { naziv: "Očisti luknjo", orodje: "pihalka", nacin: "drzi", korak: 8, delci: C.prah, navodilo: "Drži miško nad luknjo, dokler prah ne izgine.", preskok: "Luknja je še polna prahu — najprej jo očisti." });
  if (o.masa) add("masa", { naziv: "Napolni z maso", orodje: "pistola", nacin: "drzi", korak: 5, navodilo: "Drži miško nad luknjo — masa naj napolni približno dve tretjini luknje, od dna navzgor.", preskok: "Najprej napolni luknjo s kemično maso." });
  if (o.vlozek) add("vlozek", { naziv: o.vlozek.korak ?? "Vstavi vložek", orodje: "vlozek", nacin: "klik", navodilo: o.vlozek.navodilo ?? "Klikni v vsako luknjo — prirobnica naj bo poravnana s površino." });
  if (o.element?.potem && o.element.predVijakom) add("element", { naziv: o.element.korak ?? "Postavi element", tip: "postavi", orodje: "element", navodilo: o.element.navodilo ?? "Klikni v prizor, da namestiš element.", potrdilo: o.element.potrdilo ?? `${o.element.ime} je na mestu.`, preskok: "Najprej pripravi pritrdila." });
  if (o.vijak) {
    if (o.vijak.vstavi) add("vstavi", { naziv: o.vijak.vstavi, orodje: "vijak", nacin: "klik", navodilo: o.vijak.vstaviNavodilo ?? "Klikni na vsako mesto, da nastaviš vijak." });
    if (!o.vijak.brezPrivijanja) add("vijak", { naziv: o.vijak.korak ?? "Privij vijak", orodje: o.vijak.orodje ?? "vijacnik", nacin: o.vijak.orodje === "kladivo" ? "udarci" : "drzi", korak: o.vijak.orodje === "kladivo" ? 50 : (o.vijak.hitrost ?? 4), navodilo: o.vijak.navodilo ?? "Drži miško nad vijakom, dokler glava ne naleže.", preskok: o.vijak.preskok });
  }
  if (o.element?.potem && !o.element.predVijakom) add("element", { naziv: o.element.korak ?? "Obesi element", tip: "postavi", orodje: "element", navodilo: o.element.navodilo ?? "Klikni v prizor, da namestiš element.", potrdilo: o.element.potrdilo ?? `${o.element.ime} je na mestu.`, preskok: "Najprej pripravi pritrdila." });
  if (o.matica) {
    if (o.matica.podlozka) add("podlozka", { naziv: o.matica.podlozka.korak ?? "Podložka", orodje: "podlozka", nacin: "klik", navodilo: o.matica.podlozka.navodilo ?? "Klikni na vsak vijak, da nadeneš podložko." });
    add("matica", { naziv: o.matica.korak ?? "Zategni matico", orodje: "kljuc", nacin: "drzi", korak: 5, navodilo: o.matica.navodilo ?? "Drži miško nad matico, dokler ni zategnjena." });
  }
  if (o.dodatniKorak) add("dodatno", o.dodatniKorak);

  const has = (k) => ix[k] != null;
  const pr = (s, li, k) => (has(k) ? P(s.nap[li][ix[k]]) : 1);
  const done = (s, li, k) => (has(k) ? s.nap[li][ix[k]] >= 100 : true);

  const orodja = [...(o.orodja ?? [])];

  // geometrija
  const D = o.vrtanje?.globina ?? 0;         // globina luknje v podlagi (lokalno)
  const hd = o.vrtanje?.premer ?? 14;        // širina luknje v risbi
  const vL = o.vlozek?.dolzina ?? 0;
  const vz = o.vijak ?? {};
  const izstop = vz.izstop ?? 60;            // koliko glave štrli pred privijanjem

  function stanjeLuknje(s, li) {
    const vrt = pr(s, li, "vrtaj");
    const dno = -t + (t + D) * vrt;
    return { vrt, dno };
  }

  function narisiLokalno(s) {
    const elementNaMestu = o.element && done(s, 0, "element") && (!o.element.potem || s.nap[0][ix.element] >= 100);
    return (
      <g>
        {o.risbaPod?.(s)}
        {o.element && !o.element.potem && elementNaMestu && o.element.risba(s)}
        {X.map((x, li) => {
          const { vrt, dno } = stanjeLuknje(s, li);
          const pih = pr(s, li, "pihaj");
          const masa = pr(s, li, "masa");
          const vlozenPlug = has("vlozek") && done(s, li, "vlozek");
          const q = pr(s, li, "vijak");
          const vrhVl = o.vlozek?.prirobnicaNaElementu ? -t : 0;
          return (
            <g key={li}>
              {has("vrtaj") && vrt > 0 && <rect x={x - hd / 2} y={-t} width={hd} height={dno + t} fill={C.luknja} />}
              {has("vrtaj") && vrt >= 1 && pih < 1 && has("pihaj") && Array.from({ length: Math.ceil((1 - pih) * 14) }, (_, i) => (
                <circle key={i} cx={x + (((i * 37) % 10) / 10 - 0.5) * hd * 0.7} cy={D - 4 - ((i * 11) % 40)} r={1.6 + (i % 3) * 0.7} fill={C.prah} />
              ))}
              {has("masa") && masa > 0 && (() => { const f = 0.66 * masa + 0.34 * (masa >= 1 ? q : 0); return <rect x={x - hd / 2} y={D - D * f} width={hd} height={D * f} fill="#8e979f" />; })()}
              {vlozenPlug && <Vlozek x={x} vrh={vrhVl} L={vL} d={o.vlozek.sirina ?? hd} barva={o.vlozek.barva} razpr={q * (o.vlozek.razpr ?? 3)} />}
              {o.vijak && (vz.zakasni ? (s.korak >= ix.vijak || q > 0) : has("vstavi") ? done(s, li, "vstavi") : (has("vlozek") ? done(s, li, "vlozek") : (s.korak >= ix.vijak || q > 0))) && (
                vz.tip === "hanger" ? (
                  <Hanger x={x} vrh={-vz.Lmet - (vz.Lles) * (1 - q) * 0.75} Lles={vz.Lles} Lmet={vz.Lmet} d={vz.d} faza={q * 30} />
                ) : (
                  <Vijak x={x} glava={(vz.koncnaGlava ?? -t - 8) - izstop * (1 - q)} L={vz.L} d={vz.d} tip={vz.navoj} glavaTip={vz.glava} faza={q * 30} />
                )
              )}
            </g>
          );
        })}
        {o.element?.potem && elementNaMestu && o.element.risba(s)}
        {o.matica && X.map((x, li) => {
          const pod = has("podlozka") ? done(s, li, "podlozka") : done(s, li, "matica") || s.korak >= ix.matica;
          const m = pr(s, li, "matica");
          const yNa = o.matica.naY(s, li);
          const sp = o.matica.spodaj;
          const hM = o.matica.d * 0.9;
          return (
            <g key={`m${li}`}>
              {pod && <Podlozka x={x} y={sp ? yNa + 4 : yNa} d={o.matica.d} />}
              {o.matica.vzmetna && pod && <rect x={x - o.matica.d * 1.3} y={sp ? yNa + 4 : yNa - 9} width={o.matica.d * 2.6} height="5" fill="#9da6ad" stroke={C.ink} strokeWidth="1" />}
              {(s.korak >= ix.matica || m > 0) && (sp
                ? <Matica x={x} y={yNa + (o.matica.vzmetna ? 9 : 4) + hM + (1 - m) * (o.matica.pot ?? 40)} d={o.matica.d} faza={m * 20} />
                : <Matica x={x} y={yNa - (o.matica.vzmetna ? 9 : 4) - (1 - m) * (o.matica.pot ?? 40)} d={o.matica.d} faza={m * 20} />)}
            </g>
          );
        })}
        {o.risbaNad?.(s)}
      </g>
    );
  }

  return {
    id: o.id,
    naslovPrizora: o.naslov,
    nadnaslov: o.nadnaslov ?? "PREREZ",
    smer: pos.smer,
    kicker: o.kicker ?? (o.postavitev === "stena" ? { x: 460, y: 34 } : { x: 40, y: 34 }),
    dosegZadetka: o.doseg ?? (o.matica?.spodaj ? 130 : 110),
    luknje: X.map((x) => tr(x, o.luknjaY ?? (o.matica?.spodaj ? 36 : o.matica ? -t - 20 : -t))),
    orodja,
    koraki,
    prijem(id, li, s) {
      const x = X[li];
      if (id.startsWith("sveder")) return tr(x, stanjeLuknje(s, li).dno);
      if (id === "pihalka") return tr(x, D * 0.3);
      if (id === "pistola") return tr(x, D * (1 - 0.66 * pr(s, li, "masa")));
      if (id === "vijacnik" || id === "kladivo" || (id === "kljuc" && s.korak === ix.vijak)) {
        const q = pr(s, li, "vijak");
        if (vz.tip === "hanger") return tr(x, -vz.Lmet - vz.Lles * (1 - q) * 0.75);
        return tr(x, (vz.koncnaGlava ?? -t - 8) - izstop * (1 - q));
      }
      if (id === "kljuc" && o.matica) return tr(x, o.matica.naY(s, li) + (o.matica.spodaj ? 20 : -10));
      return null;
    },
    vRoki(id) {
      if (o.vRoki) { const r = o.vRoki(id); if (r) return r; }
      if (id === "vlozek" && o.vlozek) return <Vlozek x={0} vrh={-vL} L={vL} d={o.vlozek.sirina ?? hd} barva={o.vlozek.barva} />;
      if ((id === "vijak" || id === "palica") && o.vijak) {
        if (vz.tip === "hanger") return <Hanger x={0} vrh={-(vz.Lles + vz.Lmet)} Lles={vz.Lles} Lmet={vz.Lmet} d={vz.d} faza={0} />;
        return <Vijak x={0} glava={-(vz.L + (vz.glava === "sestroba" ? 14 : 8))} L={vz.L} d={vz.d} tip={vz.navoj} glavaTip={vz.glava} />;
      }
      if (id === "podlozka") return <Podlozka x={0} y={0} d={o.matica?.d ?? 10} />;
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
      if (id === "element" && o.element?.vRoki) return o.element.vRoki();
      return null;
    },
    narisi(s) {
      const elementPrej = o.element && !o.element.potem;
      const prvi = elementPrej && s.nap[0][ix.element] < 100;
      return (
        <g>
          {(o.podlage ?? [{ tip: o.podlaga ?? "beton", od: 0, do: 600 }]).map((p, i) => {
            const a = tr(-2000, p.od), b = tr(3000, p.do);
            const x = Math.min(a.x, b.x), y = Math.min(a.y, b.y), w = Math.abs(a.x - b.x), h = Math.abs(a.y - b.y);
            const povrsina = tr(0, p.od), drugi = tr(10, p.od);
            const vodoravna = Math.abs(povrsina.y - drugi.y) < 1;
            return <PodlagaZaslon key={i} tip={p.tip} x={x} y={y} w={w} h={h} rob={vodoravna ? { x1: 0, y1: povrsina.y, x2: 1200, y2: povrsina.y } : { x1: povrsina.x, y1: 0, x2: povrsina.x, y2: 600 }} />;
          })}
          <g transform={gLok}>{narisiLokalno(s)}</g>
          {/* tarče */}
          {has("vrtaj") && !prvi && X.map((x, li) => (s.nap[li][ix.vrtaj] === 0 && s.korak === ix.vrtaj ? <Tarca key={li} {...tr(x, -t)} /> : null))}
          {!has("vrtaj") && has("vlozek") && X.map((x, li) => (s.nap[li][ix.vlozek] === 0 && s.korak === ix.vlozek ? <Tarca key={li} {...tr(x, -t)} /> : null))}
          {!has("vrtaj") && !has("vlozek") && has("vstavi") && !prvi && X.map((x, li) => (s.nap[li][ix.vstavi] === 0 && s.korak === ix.vstavi ? <Tarca key={li} {...tr(x, -t)} /> : null))}
          {/* napisi podlag */}
          {(o.napisi ?? []).map((n, i) => (typeof n === "function" ? <g key={i}>{n(s, tr)}</g> : <Napis key={i} x={n.x} y={n.y} barva={n.barva ?? C.ink} velikost={n.velikost ?? 17} sidro={n.sidro}>{n.t}</Napis>))}
          {/* mera ob prvi luknji */}
          {has("vrtaj") && o.vrtanje.mera && s.nap[0][ix.vrtaj] >= 100 && s.korak <= (ix.vlozek ?? ix.masa ?? ix.vijak ?? 99) && (() => {
            const a = tr(X[0] - hd / 2 - 24, 0), b = tr(X[0] - hd / 2 - 24, D);
            return <Mera x1={a.x} y1={a.y} x2={b.x} y2={b.y} napis={o.vrtanje.mera} stran={-1} />;
          })()}
          {prvi && <Gumb {...(o.element.gumb ?? { x: 760, y: 470 })} napis={o.element.gumbNapis ?? "POSTAVI ELEMENT"} />}
          {o.nad?.(s, tr)}
        </g>
      );
    },
    podatki: o.podatki,
    banner: o.banner ?? { x: 860, y: 30, sirina: 300 },
    konec: o.konec,
  };
}

export { Vlozek, Vijak, Hanger, Matica, Podlozka, Puscica, Napis, C };

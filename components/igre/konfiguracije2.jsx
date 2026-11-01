/* Podrobne montažne igre (ASfix, ASco). Igralec izbere premer in dolžino, igra preveri,
   ali izbira ustreza debelini elementa, globini sidranja in pravilom proizvajalcev.
   Pravila (splošna praksa, viri: podatki ASfix, Böllhoff DIN 7504, EJOT USF, TR Fastenings, fischer):
   – plastični vložek: sveder = premer vložka, globina ≥ dolžina vložka + 10 mm,
     dolžina vijaka ≥ dolžina vložka + debelina elementa + premer vijaka;
   – kemična masa: sveder = M + 2 mm, luknjo v betonu očisti, v votli opeki ne (mrežica);
   – samovrtalni vijak: vsota debelin pločevin v območju vrtalne zmogljivosti premera;
   – pločevinski (kniping) vijak: predvrtana luknja glede na premer in debelino pločevine. */

import { sestavi, OROD, Napis, Puscica, C, izbor, fmt } from "./sestavljalnik";

const roka = (id, naziv, izbrano, ikona = "vlozek") => ({ id, naziv, risba: "roka", ikona, izbrano });
const elOrodje = (naziv, ikona = "element") => ({ id: "element", naziv, risba: "roka", ikona, izbrano: `${naziv} je v roki. Klikni v prizor.` });
const ponudba = (vir) => ({ href: `/kontakt?vir=igra-${vir}`, label: "Zahtevaj ponudbo" });
const svedri = (list) => list.map(OROD.sveder);
const napacenSveder = (ime) => (d, prav) => (d < prav ? `Sveder Ø${fmt(d)} je premajhen — ${ime} ne gre v luknjo. Potrebuješ Ø${fmt(prav)}.` : `Sveder Ø${fmt(d)} je prevelik — ${ime} v luknji ne bo držal. Potrebuješ Ø${fmt(prav)}.`);

/* =================================================================
   TURBO VIJAK Ø7,5 — okenski okvir v beton (brez vložka)
   ================================================================= */
const TU = { okvir: 60 };
export const turbo = sestavi({
  id: "turbo", postavitev: "tla", u: 2, naslov: "Turbo vijak skozi okvir v beton",
  luknje: [480, 760],
  element: { korak: "Postavi okvir", gumbNapis: "POSTAVI OKENSKI OKVIR", gumb: { x: 600, y: 420 }, debelina: TU.okvir, potrdilo: "Okvir je na mestu. Izberi dolžino vijaka.",
    risba: (s, g) => <rect x="280" y={-g.tEl} width="640" height={g.tEl} fill="url(#v-les)" stroke={C.ink} strokeWidth="2" /> },
  izbire: [{ pred: "vrtaj", naziv: "Izberi vijak", scenarij: `Okenski okvir je debel ${TU.okvir} mm, podlaga je beton. Turbo vijak mora biti v betonu vsaj 30 mm.`,
    skupine: [izbor("L", "Turbo Ø7,5 — dolžina", [52, 72, 92, 112, 132], (v) => `7,5 × ${v}`)],
    preveri: (sel) => (sel.L - TU.okvir < 30 ? `7,5 × ${sel.L} je prekratek: v betonu bi bil le ${Math.max(0, sel.L - TU.okvir)} mm, potrebnih je vsaj 30 mm.` : null),
    potrdilo: (I) => `Turbo 7,5 × ${I.L}: v betonu bo ${I.L - TU.okvir} mm. Zdaj vrtaj skozi okvir.` }],
  vrtanje: { svedri: [6, 7, 8], pravi: 7, napaka: (d) => (d > 7 ? "Prevelika izvrtina — navoj Turbo vijaka v betonu ne prime. Vrtaj s svedrom Ø7." : "Za Turbo vijak v beton vrtaj s svedrom Ø7 (v votlo opeko Ø6,5)."),
    globina: (I) => (I.L ?? 92) - TU.okvir + 10, premer: 7, mera: (I) => `Ø7 · h₁ = ${(I.L ?? 92) - TU.okvir + 10} mm`, navodilo: "Drži miško nad rdečo oznako — vrtaj skozi okvir v beton." },
  vijak: { vstavi: "Nastavi vijak", L: (I) => I.L ?? 92, d: 7.5, navoj: "lesni", glava: "ugrez", vstop: 0, koncnaGlava: -TU.okvir, korak: "Privij vijak", navodilo: "Nastavi vijačnik na glavo vijaka in drži miško — navoj se sam ureže v beton." },
  orodja: [...svedri([6, 7, 8]), { ...OROD.pihalka, napaka: "Pri Turbo vijaku luknje ne čistiš — vijak kar privij." }, roka("vijak", "Turbo vijak", "Turbo vijak je v roki. Klikni na luknjo v okvirju."), OROD.vijacnik, { ...OROD.kladivo, napaka: "Turbo vijaka ne zabijaš — privij ga z vijačnikom." }],
  oznaka: (I) => `Turbo 7,5 × ${I.L}`,
  napisi: [{ x: 24, y: 576, t: "BETON", velikost: 18 }, { x: 290, y: 225, t: "OKENSKI OKVIR 60 mm" }],
  podatki: [["Vijak", "Turbo Ø7,5, ugreznjena glava TX30"], ["Sveder v beton", "Ø7 mm"], ["Sveder v votlo opeko", "Ø6,5 mm"], ["V betonu", "vsaj 30 mm"], ["Dolžina", "debelina okvirja + sidranje"], ["Čiščenje luknje", "ni potrebno"]],
  konec: { napis: "PRITRJENO", kratko: "Okvir je pritrjen — brez vložka.", naslov: "Okvir je pritrjen brez vložka", besedilo: "Izbrali ste dolžino glede na debelino okvirja, vrtali s svedrom Ø7 skozi okvir v beton in vijaka privili. Navoj se sam ureže v beton — luknje ni treba čistiti, vložek ni potreben.", povezave: [ponudba("turbo")] },
});

/* =================================================================
   AF-RK / AF-RS — skozi element v zid (push-through)
   ================================================================= */
function okvirni({ id, tip, ime, elementIme, tFix, omet, risba, napisi, konecBesedilo }) {
  const tSkupaj = tFix + omet;
  return sestavi({
    id, postavitev: "stena", u: 2.3, naslov: `${tip}: ${elementIme.toLowerCase()} skozi element v zid`,
    podlage: [{ tip: "omet", od: 0, do: omet }, { tip: "zid", od: omet, do: 400 }],
    luknje: [190, 410],
    element: { korak: `Prisloni ${elementIme.toLowerCase()}`, gumbNapis: `PRISLONI ${elementIme.toUpperCase()}`, gumb: { x: 820, y: 270 }, debelina: tFix, risba, potrdilo: `${elementIme} je na mestu. Izberi dolžino vložka.` },
    izbire: [{ pred: "vrtaj", naziv: "Izberi vložek", scenarij: `${elementIme} je debel ${tFix} mm, omet ${omet} mm — skupaj ${tSkupaj} mm do nosilnega zidu. ${tip} 10 mora biti v zidu vsaj 60 mm (h_ef).`,
      skupine: [izbor("L", `${tip} Ø10 — dolžina`, [80, 100, 120, 140, 160], (v) => `10 × ${v}`)],
      preveri: (sel) => (sel.L - tSkupaj < 60 ? `10 × ${sel.L} je prekratek: v zidu bi bil ${Math.max(0, sel.L - tSkupaj)} mm, potrebnih je 60 mm (dolžina ≥ ${tSkupaj + 60} mm).` : null),
      potrdilo: (I) => `${tip} 10 × ${I.L}: v zidu ${I.L - tSkupaj} mm. Vrtaj skozi ${elementIme.toLowerCase()}.` }],
    vrtanje: { svedri: [8, 10, 12], pravi: 10, napaka: napacenSveder(tip), globina: (I) => (I.L ?? 120) - tFix + 10, premer: 10, mera: (I) => `Ø10 · h₁ = ${(I.L ?? 120) - tFix + 10} mm`, delci: "#c9a08a", navodilo: "Drži miško ob rdeči oznaki — vrtaj skozi element in omet v zid." },
    pihaj: { naziv: "Izpihaj luknjo" },
    vlozek: { korak: `Vstavi ${tip}`, dolzina: (I) => (I.L ?? 120) - 4, premer: 10, vrh: -tFix, barva: C.najlon, razpr: 3, navodilo: "Klikni v luknjo — vložek potisni skozi element, prirobnica naleže nanj." },
    vijak: { brezVstavi: true, L: (I) => (I.L ?? 120) - 2, d: 7, navoj: "metricni", glava: tip === "AF-RS" ? "ugrez" : "plosca", vstop: (I) => -tFix + (I.L ?? 120) - 12, koncnaGlava: tip === "AF-RS" ? -tFix : undefined, korak: "Privij vijak", navodilo: "Nastavi vijačnik na glavo in drži — vložek se razpre v zidu." },
    orodja: [...svedri([8, 10, 12]), OROD.pihalka, roka("vlozek", `${tip} 10`, `${tip} je v roki. Klikni v luknjo.`), OROD.vijacnik, { ...OROD.kladivo, napaka: `${tip} ne zabijaš — privij vijak, da se vložek razpre.` }],
    oznaka: (I) => `${tip} 10 × ${I.L}`,
    napisi: [{ x: 24, y: 576, t: "ZID", velikost: 18 }, { x: 384, y: 590, t: "OMET", velikost: 12 }, ...(napisi ?? [])],
    podatki: [["Vložek", `${tip} Ø8 / Ø10 / Ø12`], ["Sveder", "enak premeru vložka"], ["Sidranje Ø10", "h_ef 60 mm, h₁ 70 mm"], ["Dolžina", "element + omet + 60 mm"], ["Montaža", "skozi element"], ["Nastavek/ključ", tip === "AF-RS" ? "torx" : "SW13 / TX40"], ["Podlage", "beton, opeka, zidaki, siporex"]],
    konec: { napis: "PRITRJENO", kratko: `${elementIme} je pritrjen.`, naslov: `${elementIme} je pritrjen`, besedilo: konecBesedilo, povezave: [ponudba(id)] },
  });
}
export const afrkKlima = okvirni({
  id: "afrk", tip: "AF-RK", ime: "AF-RK", elementIme: "Nosilec klime", tFix: 4, omet: 20,
  risba: (s, g) => (<g><rect x="70" y={-g.tEl} width="460" height={g.tEl} fill={C.jeklo} stroke={C.ink} strokeWidth="2" /><rect x="70" y={-g.tEl - 180} width="10" height="180" fill={C.jeklo} stroke={C.ink} strokeWidth="2" /></g>),
  konecBesedilo: "Dolžino ste izbrali glede na nosilec in omet, vrtali skozi nosilec v zid, luknji izpihali in vložka AF-RK potisnili skozi nosilec. Ko vijak privijete, se vložek razpre v nosilnem zidu, velika prirobnica pa naleže na nosilec.",
});
export const afrs = okvirni({
  id: "afrs", tip: "AF-RS", ime: "AF-RS", elementIme: "Okvir", tFix: 50, omet: 15,
  risba: (s, g) => <rect x="130" y={-g.tEl} width="340" height={g.tEl} fill="url(#v-les)" stroke={C.ink} strokeWidth="2" />,
  konecBesedilo: "Dolžino ste izbrali glede na okvir in omet, vrtali skozi okvir v zid, luknji izpihali in vložka AF-RS potisnili skozi okvir. Ugreznjena glava ostane poravnana z okvirjem.",
});

/* =================================================================
   ZIDNI VLOŽEK MQ — nosilec na opeko, izbira vložka in vijaka
   ================================================================= */
const MQ = { 5: 25, 6: 30, 8: 40, 10: 50, 12: 60, 14: 70 };
const MQ_VIJ = { 5: [3, 4], 6: [4, 5], 8: [4.5, 6], 10: [6, 8], 12: [8, 10], 14: [10, 12] };
export const mq = sestavi({
  id: "mq", postavitev: "stena", u: 3.2, podlaga: "zid", naslov: "Zidni vložek MQ: nosilec na opečni zid",
  luknje: [190, 410],
  izbire: [
    { pred: "vrtaj", naziv: "Izberi vložek", scenarij: "Pritrdil boš kovinski nosilec debeline 3 mm. Izberi velikost vložka MQ.",
      skupine: [izbor("v", "Vložek MQ", [5, 6, 8, 10, 12, 14], (v) => `Ø${v} × ${MQ[v]}`)],
      potrdilo: (I) => `MQ Ø${I.v} × ${MQ[I.v]}: vrtaj s svedrom Ø${I.v}, globina vsaj ${MQ[I.v] + 10} mm.` },
    { pred: "vijak", naziv: "Izberi vijak", scenarij: (I) => `Vložek MQ Ø${I.v ?? 8} × ${MQ[I.v ?? 8]}, nosilec 3 mm. Vijak mora vložek razpreti po vsej dolžini.`,
      skupine: [izbor("d", "Premer lesnega vijaka", [3, 4, 4.5, 5, 6, 8, 10, 12], (v) => `Ø${fmt(v)}`), izbor("L", "Dolžina vijaka", [30, 40, 50, 60, 70, 80, 100], (v) => `${v} mm`)],
      preveri: (sel, I) => {
        const [a, b] = MQ_VIJ[I.v]; const potrebno = MQ[I.v] + 3 + sel.d;
        if (sel.d < a) return `Vijak Ø${fmt(sel.d)} je pretanek za MQ Ø${I.v} — vložka ne razpre. Uporabi Ø${fmt(a)}–${fmt(b)}.`;
        if (sel.d > b) return `Vijak Ø${fmt(sel.d)} je predebel za MQ Ø${I.v} — vložek bi počil. Uporabi Ø${fmt(a)}–${fmt(b)}.`;
        if (sel.L < potrebno) return `Vijak je prekratek: vložek ${MQ[I.v]} mm + nosilec 3 mm + premer vijaka ${fmt(sel.d)} mm = vsaj ${fmt(potrebno)} mm.`;
        return null;
      },
      potrdilo: (I) => `Lesni vijak ${fmt(I.d)} × ${I.L} ustreza vložku MQ Ø${I.v}.` },
  ],
  vrtanje: { svedri: [5, 6, 8, 10, 12, 14], pravi: (I) => I.v ?? 8, napaka: napacenSveder("vložek MQ"), globina: (I) => MQ[I.v ?? 8] + 10, premer: (I) => I.v ?? 8, mera: (I) => `Ø${I.v} · h₁ ≥ ${MQ[I.v] + 10} mm`, delci: "#c9a08a" },
  pihaj: { naziv: "Izpihaj luknjo" },
  vlozek: { korak: "Vstavi MQ", dolzina: (I) => MQ[I.v ?? 8], premer: (I) => I.v ?? 8, barva: "#5c6064", razpr: 2.5, navodilo: "Klikni v luknjo — vložek potisni do prirobnice." },
  element: { potem: true, predVijakom: true, korak: "Prisloni nosilec", debelina: 3, potrdilo: "Nosilec je na mestu. Izberi vijak.", vRoki: () => <rect x="-50" y="-8" width="100" height="8" fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" />,
    risba: (s, g) => <rect x="120" y={-g.tEl} width="360" height={g.tEl} fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" /> },
  vijak: { vstavi: "Nastavi vijak", L: (I) => I.L ?? 50, d: (I) => I.d ?? 5, navoj: "lesni", glava: "plosca", korak: "Privij vijak", navodilo: "Nastavi vijačnik na glavo vijaka in drži — vložek se razpre na štiri strani." },
  orodja: [...svedri([5, 6, 8, 10, 12, 14]), OROD.pihalka, roka("vlozek", "Vložek MQ", "Vložek MQ je v roki. Klikni v luknjo."), elOrodje("Nosilec"), roka("vijak", "Lesni vijak", "Vijak je v roki. Klikni na luknjo v nosilcu."), OROD.vijacnik],
  oznaka: (I) => `MQ Ø${I.v} × ${MQ[I.v]}${I.d ? ` · vijak ${fmt(I.d)} × ${I.L}` : ""}`,
  napisi: [{ x: 24, y: 576, t: "OPEČNI ZID", velikost: 18 }],
  podatki: [["Vložek", "MQ Ø5 do Ø14, najlon"], ["Sveder", "enak premeru vložka"], ["Globina", "dolžina vložka + 10 mm"], ["Vijak Ø8 vložek", "Ø4,5–6 mm"], ["Dolžina vijaka", "vložek + element + premer vijaka"], ["Podlage", "beton, polna in votla opeka"]],
  konec: { napis: "PRITRJENO", kratko: "Nosilec je pritrjen.", naslov: "Nosilec je pritrjen", besedilo: "Vložek, sveder in vijak ste izbrali tako, da se ujemajo: sveder je enak premeru vložka, vijak razpre vložek po vsej dolžini. Vložek MQ se razpre na štiri strani in se zagozdi v opeki.", povezave: [ponudba("mq")] },
});

/* =================================================================
   KEMIČNA MASA — navojna palica v beton / votlo opeko z mrežico
   ================================================================= */
const HEF = { 8: 80, 10: 90, 12: 110 };
const MREZ = { "12x80": { d: 12, L: 80, M: [8] }, "16x85": { d: 16, L: 85, M: [8, 10] }, "20x85": { d: 20, L: 85, M: [12] } };
function kemija({ id, naslov, votla, vir, konec, podatki, tNos = 10 }) {
  const hef = (I) => (votla ? MREZ[I.s ?? "16x85"].L : HEF[I.M ?? 10]);
  return sestavi({
    id, postavitev: "stena", u: 1.75, podlaga: votla ? "zid" : "beton", naslov,
    luknje: [190, 410],
    izbire: [
      { pred: "vrtaj", naziv: votla ? "Izberi palico in mrežico" : "Izberi palico", scenarij: votla ? "Votla opeka. Nosilec debeline 10 mm pritrdiš z navojnima palicama in kovinsko mrežico." : "Beton. Nosilec debeline 10 mm pritrdiš z navojnima palicama v kemični masi.",
        skupine: [izbor("M", "Navojna palica", [8, 10, 12], (v) => `M${v}`), ...(votla ? [izbor("s", "Kovinska mrežica", Object.keys(MREZ), (v) => v.replace("x", " × "))] : [])],
        preveri: (sel) => (votla && !MREZ[sel.s].M.includes(sel.M) ? `Mrežica ${sel.s.replace("x", " × ")} ni za M${sel.M}. Za M8: 12 × 80 ali 16 × 85, za M10: 16 × 85, za M12: 20 × 85.` : null),
        potrdilo: (I) => (votla ? `M${I.M} z mrežico ${I.s.replace("x", " × ")}: sveder Ø${MREZ[I.s].d}, globina ${MREZ[I.s].L + 5} mm.` : `M${I.M}: sveder Ø${I.M + 2}, globina ${HEF[I.M]} mm.`) },
      { pred: "vijak", naziv: "Odreži palico", scenarij: (I) => `V podlagi ${hef(I)} mm + nosilec ${tNos} mm + podložka + matica M${I.M} + 2 navoja.`,
        skupine: [izbor("Lp", "Dolžina palice", [100, 120, 140, 160, 200], (v) => `${v} mm`)],
        preveri: (sel, I) => { const pot = hef(I) + tNos + 2 + I.M * 0.8 + 3; return sel.Lp < pot ? `Palica je prekratka — potrebuješ vsaj ${Math.ceil(pot)} mm (sidranje ${hef(I)} + nosilec ${tNos} + podložka + matica).` : sel.Lp > pot + 45 ? `Palica je predolga — štrlela bi ${Math.round(sel.Lp - pot)} mm čez matico. Odreži krajšo.` : null; },
        potrdilo: (I) => `Palica M${I.M} × ${I.Lp} mm.` },
    ],
    vrtanje: { svedri: votla ? [12, 16, 20] : [10, 12, 14], pravi: (I) => (votla ? MREZ[I.s ?? "16x85"].d : (I.M ?? 10) + 2), napaka: (d, prav) => `Za to izbiro vrtaj s svedrom Ø${prav}${votla ? " (premer mrežice)" : " (premer palice + 2 mm)"}.`,
      globina: (I) => (votla ? MREZ[I.s ?? "16x85"].L + 5 : HEF[I.M ?? 10]), premer: (I) => (votla ? MREZ[I.s ?? "16x85"].d : (I.M ?? 10) + 2), mera: (I) => (votla ? `Ø${MREZ[I.s].d} · h₁ = ${MREZ[I.s].L + 5} mm` : `Ø${I.M + 2} · h₁ = ${HEF[I.M]} mm`), delci: votla ? "#c9a08a" : "#b9b4a4" },
    ...(votla ? { vlozek: { korak: "Vstavi mrežico", dolzina: (I) => MREZ[I.s ?? "16x85"].L, premer: (I) => MREZ[I.s ?? "16x85"].d, mrezica: true, prirobnica: false, navodilo: "Klikni v luknjo — mrežico vstavi do dna." } } : { pihaj: { naziv: "Očisti luknjo", navodilo: "Drži miško nad luknjo — luknjo temeljito očisti in izpihaj." } }),
    masa: { navodilo: votla ? "Drži miško nad mrežico — napolni jo z maso od dna navzgor." : "Prvi del mase iztisni v odpadek. Drži miško nad luknjo — napolni jo od dna navzgor." },
    vijak: { vstavi: "Nastavi palico", orodjeVstavi: "palica", orodje: "palica", L: (I) => I.Lp ?? 140, d: (I) => I.M ?? 10, navoj: "palica", glava: "brez", vstop: 0, koncnaGlava: (I) => -((I.Lp ?? 140) - hef(I)), korak: "Vstavi z vrtenjem", hitrost: 4, navodilo: "Drži miško nad palico — vstavi jo z rahlim vrtenjem do dna.", preskok: "Najprej napolni luknjo z maso." },
    element: { korak: "Namesti nosilec", potem: true, debelina: tNos, navodilo: "Ko masa otrdi, klikni v prizor, da namestiš nosilec.", potrdilo: "Masa je otrdela, nosilec je na palicah.", vRoki: () => <rect x="-50" y="-18" width="100" height="18" fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" />,
      risba: (s, g) => <rect x="110" y={-g.tEl} width="380" height={g.tEl} fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" /> },
    matica: { d: (I) => I.M ?? 10, naY: () => -tNos, podlozkaKorak: "Podložka DIN 125", korak: "Zategni matico" },
    orodja: [...svedri(votla ? [12, 16, 20] : [10, 12, 14]), ...(votla ? [roka("vlozek", "Kovinska mrežica", "Mrežica je v roki. Klikni v luknjo."), { ...OROD.pihalka, napaka: "V votli steni luknje ne čistiš — vstavi mrežico." }] : [OROD.pihalka]), OROD.pistola, roka("palica", "Navojna palica", "Navojna palica je v roki. Klikni na luknjo."), elOrodje("Nosilec"), roka("podlozka", "Podložka", "Podložka je v roki. Klikni na palico.", "element"), OROD.kljuc],
    vRoki: (k) => (k === "palica" ? <g><rect x="-6" y="-120" width="12" height="120" fill={C.jeklo} stroke={C.ink} strokeWidth="1.3" />{Array.from({ length: 20 }, (_, i) => <line key={i} x1="-6" y1={-6 - i * 6} x2="6" y2={-9 - i * 6} stroke={C.ink} strokeWidth="0.8" />)}</g> : null),
    oznaka: (I) => (I.Lp ? `M${I.M} × ${I.Lp}` : `M${I.M}`),
    napisi: [{ x: 24, y: 576, t: votla ? "VOTLA OPEKA" : "BETON", velikost: 18 }],
    podatki,
    konec: { napis: "PRITRJENO", kratko: "Nosilec je pritrjen.", ...konec, povezave: [ponudba(vir)] },
  });
}
export const kemijaBeton = kemija({ id: "kemija-beton", vir: "kemija", naslov: "Kemična masa: palici v beton",
  podatki: [["EASF TOP", "suh in vlažen beton, navojne in armaturne palice"], ["PESF TOP", "suha podlaga, navojne palice, popravilo lukenj"], ["Sveder", "premer palice + 2 mm"], ["Globina", "M8 80 · M10 90 · M12 110 mm"], ["Luknja", "temeljito očisti in izpihaj"], ["Prvi del mase", "iztisni v odpadek"]],
  konec: { naslov: "Nosilec je pritrjen s kemično maso", besedilo: "Izbrali ste palico, pravi sveder in globino, luknji očistili, napolnili z maso od dna navzgor in vstavili palici z vrtenjem. Ko je masa otrdela, ste nosilec privili s podložkama in maticama." } });
export const kemijaVotla = kemija({ id: "kemija-votla", vir: "mrezica", votla: true, naslov: "Kemična masa v votlo opeko z mrežico",
  podatki: [["Mrežica", "kovinska, 1 m — odrežeš po meri"], ["M8", "mrežica 12 × 80 ali 16 × 85"], ["M10", "mrežica 16 × 85"], ["M12", "mrežica 20 × 85"], ["Sveder", "premer mrežice"], ["Votla stena", "luknje ne čistiš"]],
  konec: { naslov: "Nosilec je pritrjen v votlo opeko", besedilo: "Mrežica ustreza palici in luknji, napolnili ste jo z maso in vstavili palici. Mrežica zadrži maso, da ne steče v votline opeke." } });
export const kemija975 = kemija({ id: "palica-975", vir: "din975", naslov: "Navojna palica DIN 975: nosilec na beton",
  podatki: [["Palica", "DIN 975, odrežeš po meri"], ["Matica", "DIN 934"], ["Podložka", "DIN 125"], ["Spajanje palic", "podaljšana matica DIN 6334"], ["Sveder", "premer palice + 2 mm"], ["Masa", "ASfix EASF TOP ali PESF TOP"]],
  konec: { naslov: "Nosilec je pritrjen", besedilo: "Palico DIN 975 ste odrezali na pravo dolžino, jo vgradili v beton s kemično maso in nosilec privili s podložko DIN 125 in matico DIN 934." } });

/* =================================================================
   CEVNO DRŽALO — vložek MQ + hanger vijak + držalo + cev (stena / strop)
   ================================================================= */
const HANG = { 6: 8, 8: 10, 10: 12 };
function cevno({ id, strop }) {
  const X = strop ? [480, 720] : [190, 410];
  return sestavi({
    id, postavitev: strop ? "strop" : "stena", u: 2.6, podlaga: "beton", naslov: strop ? "Cevno držalo v strop" : "Cevno držalo na steno",
    luknje: X,
    izbire: [{ pred: "vrtaj", naziv: "Izberi pritrdila", scenarij: "Cevno držalo ima priključek M8. Izberi hanger vijak in vložek MQ zanj.",
      skupine: [izbor("M", "Hanger vijak", [6, 8, 10], (v) => `M${v}`), izbor("v", "Vložek MQ", [8, 10, 12], (v) => `Ø${v} × ${MQ[v]}`)],
      preveri: (sel) => (sel.M !== 8 ? `Držalo ima priključek M8 — hanger M${sel.M} vanj ne gre.` : sel.v !== HANG[sel.M] ? `Za hanger M8 uporabi vložek MQ Ø10 — ${sel.v < 10 ? "v manjšega lesni navoj ne gre" : "v večjem lesni navoj ne prime"}.` : null),
      potrdilo: "Hanger M8 z vložkom MQ Ø10: vrtaj s svedrom Ø10, globina 60 mm." }],
    vrtanje: { svedri: [8, 10, 12], pravi: (I) => I.v ?? 10, napaka: napacenSveder("vložek"), globina: (I) => MQ[I.v ?? 10] + 10, premer: (I) => I.v ?? 10, mera: (I) => `Ø${I.v} · h₁ = ${MQ[I.v] + 10} mm` },
    pihaj: { naziv: "Izpihaj luknjo" },
    vlozek: { korak: "Vstavi MQ", dolzina: (I) => MQ[I.v ?? 10], premer: (I) => I.v ?? 10, barva: "#5c6064", razpr: 2 },
    vijak: { tip: "hanger", vstavi: "Nastavi hanger", Lles: 45, Lmet: 32, d: (I) => (I.M ?? 8) - 1, korak: "Privij hanger", navodilo: "Nastavi vijačnik z nastavkom na vijak in drži — lesni navoj gre v vložek, M8 ostane zunaj." },
    element: { korak: "Privij držalo", potem: true, debelina: 0, navodilo: "Klikni v prizor — držali privij na navoj M8.", potrdilo: "Držali sta na vijakih. Vstavi cev.", vRoki: () => <circle cx="0" cy="-60" r="50" fill="none" stroke="#9aa3aa" strokeWidth="10" />,
      risba: (s) => (<g>{X.map((x) => { const y0 = -32 * 2.6 - 6; return (<g key={x}><rect x={x - 12} y={y0 - 26} width="24" height="30" fill="#b9c1c7" stroke={C.ink} strokeWidth="1.5" /><circle cx={x} cy={y0 - 26 - 64} r="62" fill="none" stroke="#9aa3aa" strokeWidth="14" /><circle cx={x} cy={y0 - 26 - 64} r="54" fill="none" stroke="#232527" strokeWidth="6" />{s.nap[0][s.nap[0].length - 1] >= 100 && <circle cx={x} cy={y0 - 26 - 64} r="50" fill="#d5dadf" stroke="#a9b0b6" strokeWidth="3" />}</g>); })}</g>) },
    dodatno: { naziv: "Vstavi cev", tip: "postavi", orodje: "cev", navodilo: "Klikni v prizor — vstavi cev in zapri držali.", potrdilo: "Cev je v držalih." },
    orodja: [...svedri([8, 10, 12]), OROD.pihalka, roka("vlozek", "Vložek MQ", "Vložek MQ je v roki. Klikni v luknjo."), roka("vijak", "Hanger vijak", "Hanger vijak je v roki. Klikni na vložek."), OROD.vijacnik, elOrodje("Cevno držalo"), { id: "cev", naziv: "Vodovodna cev", risba: "roka", ikona: "trak", izbrano: "Cev je v roki. Klikni v prizor." }],
    vRoki: (k) => (k === "cev" ? <circle cx="0" cy="-40" r="36" fill="#d5dadf" stroke="#a9b0b6" strokeWidth="3" /> : null),
    oznaka: (I) => `hanger M${I.M} · MQ Ø${I.v}`,
    napisi: [strop ? { x: 24, y: 214, t: "STROP", velikost: 18 } : { x: 24, y: 576, t: "STENA", velikost: 18 }],
    podatki: [["Vložek", "MQ Ø10 × 50"], ["Hanger vijak", "lesni navoj + M8"], ["Držalo", "priključek M8, gumijasti vložek"], ["Sveder", "Ø10, globina 60 mm"], ["Premeri cevi", "od 12–14 mm (1/4\") naprej"]],
    konec: { napis: "PRITRJENO", kratko: "Cev je pritrjena.", naslov: "Cev je pritrjena", besedilo: `Za priključek M8 ste izbrali hanger M8 in vložek MQ Ø10, v ${strop ? "strop" : "steno"} vrtali s svedrom Ø10, privili hanger in nanj cevno držalo. Gumijasti vložek duši tresljaje in hrup.`, povezave: [ponudba(id)] },
  });
}
export const cevnoStena = cevno({ id: "cevno", strop: false });
export const cevnoStrop = cevno({ id: "hanger", strop: true });

/* =================================================================
   VLOŽEK ZA STIROPOR — svetilo na fasado
   ================================================================= */
const EPS = 80;
export const stiropor = sestavi({
  id: "stiropor", postavitev: "stena", u: 2.8, naslov: "Vložek za stiropor: svetilo na fasado",
  podlage: [{ tip: "eps", od: 0, do: EPS }, { tip: "zid", od: EPS, do: 400 }],
  luknje: [200, 400],
  izbire: [
    { pred: "vlozek", naziv: "Izberi vložek", scenarij: `Fasada ima ${EPS} mm stiropora. Vložek mora ostati v izolaciji — ne sme seči do zidu (toplotni most).`,
      skupine: [izbor("v", "Vložek za stiropor", [50, 60, 95], (v) => `${v} mm`)],
      preveri: (sel) => (sel.v > EPS - 5 ? `Vložek ${sel.v} mm je predolg — segel bi do zidu in naredil toplotni most. Pri ${EPS} mm stiropora izberi krajšega.` : null),
      potrdilo: (I) => `Vložek ${I.v} mm ostane v stiroporu.` },
    { pred: "vijak", naziv: "Izberi vijak", scenarij: "Svetilo ima podnožje debeline 4 mm.",
      skupine: [izbor("s", "Lesni vijak", ["3,5×30", "4×40", "5×60"], (v) => v.replace("×", " × "))],
      preveri: (sel) => (sel.s !== "4×40" ? (sel.s === "5×60" ? "Vijak 5 × 60 je predebel in predolg — vložek bi se razklal. Uporabi lesni vijak 4 × 40." : "Vijak 3,5 × 30 je prekratek in pretanek. Uporabi lesni vijak 4 × 40.") : null),
      potrdilo: "Lesni vijak 4 × 40 — pravi vijak za vložek za stiropor." },
  ],
  vlozek: { korak: "Privij vložek", dolzina: (I) => I.v ?? 60, premer: (I) => ((I.v ?? 60) > 60 ? 16 : 12), barva: (I) => ((I.v ?? 60) > 60 ? "#f4f4f2" : "#9a9ea2"), navodilo: "Klikni na rdečo oznako — vložek privij v stiropor, prirobnica poravnana s fasado." },
  element: { potem: true, predVijakom: true, korak: "Prisloni svetilo", debelina: 4, vRoki: () => <rect x="-60" y="-50" width="120" height="50" rx="10" fill="#f2f2ee" stroke={C.ink} strokeWidth="2" />, potrdilo: "Svetilo je na mestu. Izberi vijak.",
    risba: (s, g) => (<g><rect x="150" y={-g.tEl} width="300" height={g.tEl} fill="#3a3f44" stroke={C.ink} strokeWidth="1.5" /><rect x="220" y={-g.tEl - 90} width="160" height="90" rx="14" fill="#f2f2ee" stroke={C.ink} strokeWidth="2" /></g>) },
  vijak: { vstavi: "Nastavi vijak", L: (I) => (I.s === "5×60" ? 60 : I.s === "3,5×30" ? 30 : 40), d: (I) => (I.s === "5×60" ? 5 : I.s === "3,5×30" ? 3.5 : 4), navoj: "lesni", glava: "plosca", korak: "Privij vijak", navodilo: "Nastavi vijačnik na glavo vijaka in drži — ne pretegni, da se stiropor ne poškoduje." },
  orodja: [roka("vlozek", "Vložek za stiropor", "Vložek je v roki. Klikni na rdečo oznako."), elOrodje("Svetilo", "enota"), roka("vijak", "Lesni vijak", "Vijak je v roki. Klikni na vložek."), OROD.vijacnik, { ...OROD.sveder(10), napaka: "Vložek za stiropor se sam privije v izolacijo — vrtanje ni potrebno." }],
  oznaka: (I) => `vložek ${I.v} mm${I.s ? ` · ${I.s.replace("×", " × ")}` : ""}`,
  napisi: [{ x: 210, y: 576, t: `STIROPOR ${EPS} mm`, velikost: 15 }, { x: 14, y: 576, t: "ZID", velikost: 15 }],
  podatki: [["Velikosti", "50, 60 in 95 mm"], ["Vijak", "lesni vijak 4 × 40"], ["Pravilo", "vložek ne sme seči do zidu"], ["Za", "svetila, nabiralnike, hišne številke"], ["Ni za", "pritrjevanje izolacijskih plošč"], ["Pozor", "vijaka ne pretegni"]],
  konec: { napis: "PRITRJENO", kratko: "Svetilo je pritrjeno.", naslov: "Svetilo je na fasadi", besedilo: "Vložek ste izbrali tako, da ostane v stiroporu in ne seže do zidu, ga privili v izolacijo, prislonili svetilo in privili lesna vijaka 4 × 40.", povezave: [ponudba("stiropor")] },
});

/* =================================================================
   VLOŽEK ZA MAVČNE PLOŠČE — nosilec police
   ================================================================= */
export const gips = sestavi({
  id: "gips", postavitev: "tla", u: 5, naslov: "Vložek za mavčne plošče: nosilec police",
  podlage: [{ tip: "mavec", od: 0, do: 12.5 }],
  luknje: [480, 720],
  vlozek: { korak: "Privij vložek", dolzina: 32, premer: 13, barva: "#f4f4f2", navodilo: "Klikni na rdečo oznako — vložek se z rezili sam privije v ploščo, brez vrtanja." },
  element: { potem: true, predVijakom: true, korak: "Prisloni nosilec", debelina: 3, potrdilo: "Nosilec je na mestu. Izberi vijak.", vRoki: () => <rect x="-50" y="-8" width="100" height="8" fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" />,
    risba: (s, g) => (<g><rect x="380" y={-g.tEl} width="440" height={g.tEl} fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" /><rect x="590" y={-g.tEl - 140} width="20" height="140" fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" /></g>) },
  izbire: [{ pred: "vijak", naziv: "Izberi vijak", scenarij: "Vložek 13 × 32, nosilec 3 mm. Vijak mora ostati v vložku.",
    skupine: [izbor("s", "Lesni vijak", ["3,5×25", "4,5×30", "4,5×50", "6×40"], (v) => v.replace("×", " × "))],
    preveri: (sel) => ({ "3,5×25": "Vijak 3,5 × 25 je pretanek — vložek se ne razpre dovolj. Uporabi 4,5 × 30.", "4,5×50": "Vijak 4,5 × 50 je predolg — šel bi skozi vložek v votli prostor. Vijak mora ostati v vložku: 4,5 × 30.", "6×40": "Vijak Ø6 je predebel — vložek bi počil in mavec bi se zdrobil. Uporabi 4,5 × 30." }[sel.s] ?? null),
    potrdilo: "Lesni vijak 4,5 × 30 ostane v vložku." }],
  vijak: { vstavi: "Nastavi vijak", L: 30, d: 4.5, navoj: "lesni", glava: "plosca", korak: "Privij vijak", hitrost: 3, navodilo: "Nastavi vijačnik na glavo in drži — ne pretegni, mavčna plošča se lahko deformira." },
  orodja: [roka("vlozek", "Vložek za mavec", "Vložek je v roki. Klikni na rdečo oznako."), elOrodje("Nosilec police"), roka("vijak", "Lesni vijak", "Vijak je v roki. Klikni na vložek."), OROD.vijacnik, { ...OROD.sveder(8), napaka: "Za ta vložek ne vrtaš — konica z rezili se sama zavrta v mavčno ploščo." }, { ...OROD.kladivo, napaka: "Plastičnega vložka ne zabijaš — mavec bi se zdrobil." }],
  oznaka: (I) => (I.s ? `vijak ${I.s.replace("×", " × ")}` : "vložek 13 × 32"),
  napisi: [{ x: 24, y: 300 + 12.5 * 5 + 24, t: "MAVČNA PLOŠČA 12,5 mm", velikost: 15 }, { x: 24, y: 576, t: "votli prostor", velikost: 14, barva: "#8f9599" }],
  podatki: [["Vložek", "13 × 32 mm, najlon"], ["Vijak", "lesni vijak 4,5 × 30"], ["Vrtanje", "ni potrebno"], ["Plošča", "ena ali dve mavčni plošči"], ["Pozor", "ne pretegni — plošča se deformira"]],
  konec: { napis: "PRITRJENO", kratko: "Nosilec je pritrjen.", naslov: "Nosilec je pritrjen", besedilo: "Vložka ste privili naravnost v mavčno ploščo, prislonili nosilec in privili lesna vijaka 4,5 × 30, ki ostaneta v vložku. Vijaka ne pretegnite, da se mavec ne zdrobi.", povezave: [ponudba("gips")] },
});

/* =================================================================
   WC, BOJLER, UMIVALNIK (kompleti)
   ================================================================= */
export const wc = sestavi({
  id: "wc", postavitev: "tla", u: 2.2, podlaga: "beton", naslov: "Komplet za WC školjko",
  luknje: [500, 700],
  vrtanje: { svedri: [10], pravi: 10, globina: 60, premer: 10, mera: "globina ≥ dolžina vložka" },
  pihaj: { naziv: "Izpihaj luknjo" },
  vlozek: { korak: "Vstavi vložek", dolzina: 50, premer: 10, barva: "#f4f4f2", navodilo: "Klikni v luknjo — vložek ZV.A potisni do roba." },
  element: { potem: true, predVijakom: true, korak: "Postavi školjko", debelina: 25, vRoki: () => <rect x="-60" y="-30" width="120" height="30" rx="6" fill="#fbfbfb" stroke={C.ink} strokeWidth="2" />, potrdilo: "Školjka je na mestu.",
    risba: (s, g) => (<g opacity=".6"><path d={`M 420 ${-g.tEl} L 780 ${-g.tEl} L 780 0 L 420 0 Z`} fill="#fbfbfb" stroke={C.ink} strokeWidth="2.5" /><path d={`M 440 ${-g.tEl} C 440 ${-g.tEl - 100} 760 ${-g.tEl - 100} 760 ${-g.tEl}`} fill="#fbfbfb" stroke={C.ink} strokeWidth="2.5" /></g>) },
  vijak: { vstavi: "Nastavi vijak s podložko", L: 80, d: 6, navoj: "lesni", glava: "sestroba", orodje: "kljuc", korak: "Privij s ključem", navodilo: "Nastavi ključ na glavo vijaka in drži — ne pretegni, keramika lahko poči." },
  orodja: [OROD.sveder(10), OROD.pihalka, roka("vlozek", "Vložek ZV.A", "Vložek je v roki. Klikni v luknjo."), elOrodje("WC školjka", "enota"), roka("vijak", "Vijak DIN 571", "Vijak je v roki. Klikni na luknjo v školjki."), OROD.kljuc],
  napisi: [{ x: 24, y: 576, t: "TLA", velikost: 18 }],
  oznaka: "DIN 571 6 × 80 · vložek ZV.A",
  podatki: [["Vsebina", "vložek, vijak DIN 571, podložka, kapica"], ["Vijaki", "6 × 80 do 6 × 120"], ["Pakiranje", "2 kos"], ["Privijanje", "ključ — ne pretegni"], ["Kapica", "bela, prekrije glavo"]],
  konec: { napis: "PRITRJENO", kratko: "Školjka je pritrjena.", naslov: "WC školjka je pritrjena", besedilo: "Luknji ste izvrtali in izpihali, vstavili vložka ZV.A, postavili školjko in vijaka DIN 571 s podložko privili s ključem. Na koncu glavo prekrije bela kapica.", povezave: [ponudba("wc")] },
});
function obesi({ id, ime, risba, vRoki, konec, podatki, vir }) {
  return sestavi({
    id, postavitev: "stena", u: 2.2, podlaga: "zid", naslov: `Komplet za ${ime.toLowerCase()}`,
    luknje: [190, 410],
    izbire: [{ pred: "vrtaj", naziv: "Izberi komplet", scenarij: `Nosilna pločevina ${ime.toLowerCase()}a je debela 2 mm. Med zidom in pločevino je 20 mm prostora za poravnavo.`,
      skupine: [izbor("k", "Komplet (hanger vijak)", ["8x100", "10x120", "10x140"], (v) => v.replace("x", " × "))],
      potrdilo: (I) => `Komplet ${I.k.replace("x", " × ")}.` }],
    vrtanje: { svedri: [10, 12], pravi: (I) => (I.k?.startsWith("8") ? 10 : 12), napaka: napacenSveder("vložek"), globina: (I) => (I.k?.startsWith("8") ? 60 : 70), premer: (I) => (I.k?.startsWith("8") ? 10 : 12), delci: "#c9a08a", mera: "globina ≥ dolžina vložka" },
    pihaj: { naziv: "Izpihaj luknjo" },
    vlozek: { korak: "Vstavi vložek", dolzina: (I) => (I.k?.startsWith("8") ? 50 : 60), premer: (I) => (I.k?.startsWith("8") ? 10 : 12), barva: "#f4f4f2" },
    vijak: { tip: "hanger", vstop: 0, vstavi: "Nastavi hanger", Lles: (I) => (I.k?.startsWith("8") ? 50 : 60), Lmet: (I) => Number(I.k?.split("x")[1] ?? 120) - (I.k?.startsWith("8") ? 50 : 60), d: (I) => (I.k?.startsWith("8") ? 8 : 10), korak: "Privij hanger", navodilo: "Nastavi vijačnik z nastavkom na vijak in drži — lesni navoj gre v vložek, metrični ostane zunaj." },
    element: { potem: true, korak: `Obesi ${ime.toLowerCase()}`, debelina: 2, risba, vRoki, navodilo: `Klikni v prizor — ${ime.toLowerCase()} nadeneš od strani na vijaka.`, potrdilo: `${ime} visi na vijakih.` },
    matica: { d: (I) => (I.k?.startsWith("8") ? 8 : 10), naY: (I) => -(Number(I.k?.split("x")[1] ?? 120) - (I.k?.startsWith("8") ? 50 : 60)) + 28, podlozkaKorak: "Podložka", korak: "Zategni matico", navodilo: "Nastavi ključ na matico in drži — z maticama poravnaš v navpičnico." },
    orodja: [OROD.sveder(10), OROD.sveder(12), OROD.pihalka, roka("vlozek", "Vložek", "Vložek je v roki. Klikni v luknjo."), roka("vijak", "Hanger vijak", "Hanger je v roki. Klikni na vložek."), OROD.vijacnik, elOrodje(ime, "enota"), roka("podlozka", "Podložka", "Podložka je v roki. Klikni na vijak.", "element"), OROD.kljuc],
    oznaka: (I) => `hanger ${I.k?.replace("x", " × ")}`,
    napisi: [{ x: 24, y: 576, t: "ZID", velikost: 18 }],
    podatki,
    konec: { napis: "PRITRJENO", kratko: `${ime} je pritrjen.`, ...konec, povezave: [ponudba(vir)] },
  });
}
const bojlerRisba = (s, g) => { const y = -g.Lmet + 28 * 2.2; return (<g><rect x="150" y={y} width="300" height={g.tEl} fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" /><rect x="130" y={y - 380} width="340" height="380" rx="30" fill="#f4f5f6" stroke={C.ink} strokeWidth="2.5" opacity=".55" /></g>); };
export const bojler = obesi({ id: "bojler", vir: "bojler", ime: "Bojler", risba: bojlerRisba, vRoki: () => <rect x="-60" y="-50" width="120" height="50" rx="10" fill="#f4f5f6" stroke={C.ink} strokeWidth="2" />,
  podatki: [["Vsebina", "hanger vijak, vložek, podložka, matica"], ["Dimenzije", "8 × 100 do 10 × 140"], ["Pakiranje", "2 kos"], ["Matica", "poravnava v navpičnico"], ["Površina", "pocinkano"]],
  konec: { naslov: "Bojler je obešen", besedilo: "V vložka ste privili hanger vijaka, bojler nadeli od strani, nato nadeli podložki in matici zategnili s ključem. Z maticama bojler poravnate v navpičnico." } });
const umivalnikRisba = (s, g) => { const y = -g.Lmet + 28 * 2.2; return (<g><rect x="160" y={y} width="280" height={g.tEl} fill="#fbfbfb" stroke={C.ink} strokeWidth="2.5" /><path d={`M 160 ${y} L 160 ${y - 200} Q 300 ${y - 230} 440 ${y - 200} L 440 ${y}`} fill="#fbfbfb" stroke={C.ink} strokeWidth="2.5" /></g>); };
export const umivalnik = obesi({ id: "umivalnik", vir: "umivalnik", ime: "Umivalnik", risba: umivalnikRisba, vRoki: () => <rect x="-60" y="-30" width="120" height="30" rx="6" fill="#fbfbfb" stroke={C.ink} strokeWidth="2" />,
  podatki: [["Vsebina", "hanger vijak, vložek, podložka, matica"], ["Dimenzije", "8 × 100 do 10 × 140"], ["Pakiranje", "2 kos"], ["Podlage", "beton, opeka"]],
  konec: { naslov: "Umivalnik je pritrjen", besedilo: "V vložka ste privili hanger vijaka, umivalnik nadeli na vijaka, nato podložki in matici zategnili s ključem." } });

/* =================================================================
   ASco DIN 7504 — samovrtalni vijak: trapezna pločevina na jekleno lego
   ================================================================= */
const KAP = { 3.5: [0.7, 2.25], 4.2: [1.75, 3.0], 4.8: [1.75, 4.4], 5.5: [1.75, 5.25], 6.3: [2.0, 6.0] };
const T7504 = { plocevina: 0.75, lega: 3 };
const T7504_SK = T7504.plocevina + T7504.lega;
export const din7504 = sestavi({
  id: "din7504", postavitev: "tla", u: 11, naslov: "Samovrtalni vijak DIN 7504: pločevina na lego",
  podlage: [{ tip: "jeklo", od: 0, do: T7504.lega }],
  luknje: [470, 730],
  element: { korak: "Položi pločevino", gumbNapis: "POLOŽI TRAPEZNO PLOČEVINO", gumb: { x: 600, y: 470 }, debelina: T7504.plocevina, potrdilo: "Pločevina leži na legi. Izberi vijak.",
    risba: (s, g) => <path d={`M -400 ${-g.tEl} L 540 ${-g.tEl} L 565 -60 L 635 -60 L 660 ${-g.tEl} L 1600 ${-g.tEl} L 1600 0 L -400 0 Z`} fill="#8fa3b5" stroke={C.ink} strokeWidth="1.5" /> },
  izbire: [{ pred: "vijak", naziv: "Izberi vijak", scenarij: `Trapezna pločevina ${fmt(T7504.plocevina)} mm + jeklena lega ${T7504.lega} mm = ${fmt(T7504_SK)} mm skupaj. Vrtalna zmogljivost vijaka mora pokriti skupno debelino.`,
    skupine: [izbor("d", "Premer DIN 7504 K", [3.5, 4.2, 4.8, 5.5, 6.3], (v) => `Ø${fmt(v)}`), izbor("L", "Dolžina", [13, 16, 19, 22, 25], (v) => `${v} mm`)],
    preveri: (sel) => { const [a, b] = KAP[sel.d]; if (T7504_SK > b) return `Ø${fmt(sel.d)} zvrta največ ${fmt(b)} mm jekla — tukaj je ${fmt(T7504_SK)} mm. Izberi večji premer.`; if (T7504_SK < a) return `Ø${fmt(sel.d)} je za tako tanko pločevino prevelik.`; if (sel.L < T7504_SK + 11) return `Vijak ${sel.L} mm je prekratek — svedrasta konica mora v celoti skozi obe plasti, preden navoj prime (vsaj ${Math.ceil(T7504_SK + 11)} mm).`; return null; },
    potrdilo: (I) => `DIN 7504 K ${fmt(I.d)} × ${I.L}: zvrta ${fmt(KAP[I.d][0])}–${fmt(KAP[I.d][1])} mm.` }],
  vijak: { vstavi: "Nastavi vijak", L: (I) => I.L ?? 19, d: (I) => I.d ?? 5.5, navoj: "svedrast", glava: "prirobnica", korak: "Privij", hitrost: 2.5, navodilo: "Nastavi vijačnik na glavo in drži — konica izvrta luknjo, vijak izreže navoj in se privije." },
  orodja: [roka("vijak", "DIN 7504 K", "Samovrtalni vijak je v roki. Klikni na pločevino nad lego."), OROD.vijacnik, { ...OROD.sveder(5), napaka: "Samovrtalnega vijaka ne predvrtaš — svedrasta konica sama izvrta luknjo." }],
  oznaka: (I) => `DIN 7504 K ${fmt(I.d)} × ${I.L}`,
  napisi: [{ x: 28, y: 352, t: "JEKLENA LEGA 3 mm", velikost: 15 }],
  podatki: [["Ø3,5", "0,7–2,25 mm"], ["Ø4,2", "1,75–3,0 mm"], ["Ø4,8", "1,75–4,4 mm"], ["Ø5,5", "1,75–5,25 mm"], ["Ø6,3", "2,0–6,0 mm"], ["Glave", "K šestroba, N lečasta, P ugrezna"]],
  konec: { napis: "PRITRJENO", kratko: "Pločevina je pritrjena.", naslov: "Pločevina je pritrjena", besedilo: "Premer ste izbrali po vrtalni zmogljivosti (skupna debelina obeh plasti), dolžino pa tako, da gre svedrasta konica v celoti skozi, preden navoj prime. Vijak v enem koraku izvrta, izreže navoj in se privije — brez predvrtanja.", povezave: [ponudba("din7504")] },
});

/* =================================================================
   ASco KNIPING DIN 7981 / 7982 — spoj prezračevalnega kanala
   ================================================================= */
const PILOT = { 3.5: 2.9, 4.2: 3.4, 4.8: 3.9 };
export const kniping = sestavi({
  id: "kniping", postavitev: "tla", u: 13, naslov: "Kniping vijak: spoj prezračevalnega kanala",
  podlage: [{ tip: "jeklo", od: 0, do: 1 }],
  luknje: [480, 720],
  element: { korak: "Prekrij spoj", gumbNapis: "PREKRIJ SPOJ", gumb: { x: 600, y: 470 }, debelina: 1, risba: (s, g) => <rect x="380" y={-g.tEl} width="440" height={g.tEl} fill="#b2bbc1" stroke={C.ink} strokeWidth="1.2" />, potrdilo: "Spojni del prekriva kanal. Izberi vijak." },
  izbire: [{ pred: "vrtaj", naziv: "Izberi vijak", scenarij: "Spojni del 1 mm + kanal 1 mm = 2 mm jeklene pločevine. Luknja za pločevinski vijak je manjša od premera vijaka.",
    skupine: [izbor("d", "Premer DIN 7981", [3.5, 4.2, 4.8], (v) => `Ø${fmt(v)}`), izbor("L", "Dolžina", [9.5, 13, 16], (v) => `${fmt(v)} mm`)],
    potrdilo: (I) => `DIN 7981 ${fmt(I.d)} × ${fmt(I.L)}: predvrtaj Ø${fmt(PILOT[I.d])}.` }],
  vrtanje: { svedri: [2.9, 3.4, 3.9, 4.8], pravi: (I) => PILOT[I.d ?? 4.2], napaka: (d, prav) => (d > prav ? `Luknja Ø${fmt(d)} je prevelika — navoj v pločevini ne bo prijel. Za ta vijak predvrtaj Ø${fmt(prav)}.` : `Luknja Ø${fmt(d)} je premajhna — vijak bi se zlomil ali pretrgal pločevino. Predvrtaj Ø${fmt(prav)}.`), globina: 1.2, premer: (I) => PILOT[I.d ?? 4.2], navodilo: "Drži miško nad rdečo oznako — izvrtaj skozi spojni del in kanal." },
  vijak: { vstavi: "Nastavi vijak", L: (I) => I.L ?? 13, d: (I) => I.d ?? 4.2, navoj: "lesni", glava: "plosca", korak: "Privij", hitrost: 3, navodilo: "Nastavi vijačnik na glavo in drži — vijak si sam oblikuje navoj v pločevini." },
  orodja: [...svedri([2.9, 3.4, 3.9, 4.8]), roka("vijak", "DIN 7981", "Kniping vijak je v roki. Klikni v luknjo."), OROD.vijacnik],
  oznaka: (I) => `DIN 7981 ${fmt(I.d)} × ${fmt(I.L)}`,
  napisi: [{ x: 28, y: 345, t: "KANAL 1 mm", velikost: 15 }],
  podatki: [["DIN 7981", "lečasta glava"], ["DIN 7982", "ugrezna glava"], ["Konica", "ostra (oblika C)"], ["Luknja Ø3,5", "≈ Ø2,9 mm"], ["Luknja Ø4,2", "≈ Ø3,4 mm"], ["Luknja Ø4,8", "≈ Ø3,9 mm"]],
  konec: { napis: "PRITRJENO", kratko: "Kanal je spojen.", naslov: "Kanal je spojen", besedilo: "Luknjo ste predvrtali nekoliko manjšo od premera vijaka — tako si kniping vijak v pločevini oblikuje trden navoj.", povezave: [ponudba("kniping")] },
});

/* =================================================================
   ASco DIN 603 — deska stranice na jeklen steber prikolice
   ================================================================= */
const T603 = { deska: 25, steber: 4 };
export const din603 = sestavi({
  id: "din603", postavitev: "tla", u: 3.6, naslov: "Sponski vijak DIN 603: stranica prikolice",
  podlage: [{ tip: "les", od: 0, do: T603.deska }, { tip: "jeklo", od: T603.deska, do: T603.deska + T603.steber }],
  luknje: [500, 700],
  izbire: [{ pred: "vrtaj", naziv: "Izberi vijak", scenarij: `Deska stranice ${T603.deska} mm + jeklen steber ${T603.steber} mm. Luknje v stebru so za M8. Pod steberom pride podložka in matica.`,
    skupine: [izbor("M", "Premer DIN 603", [6, 8, 10], (v) => `M${v}`), izbor("L", "Dolžina", [30, 40, 50, 60, 80], (v) => `${v} mm`)],
    preveri: (sel) => { if (sel.M !== 8) return `Luknje v stebru so za M8 — M${sel.M} ${sel.M < 8 ? "bi v luknji opletal" : "ne gre skozi"}.`; const pot = T603.deska + T603.steber + 1.6 + 6.5 + 2.5; if (sel.L < pot) return `${sel.L} mm je prekratko — deska + steber + podložka + matica + 2 navoja = vsaj ${Math.ceil(pot)} mm.`; if (sel.L > pot + 25) return `${sel.L} mm je predolgo — vijak bi štrlel ${Math.round(sel.L - pot)} mm čez matico.`; return null; },
    potrdilo: (I) => `DIN 603 M8 × ${I.L}: vrtaj s svedrom Ø8.` }],
  vrtanje: { svedri: [6, 8, 10], pravi: 8, napaka: napacenSveder("vijak M8"), globina: T603.deska + T603.steber, premer: 8, mera: "Ø8 · skozi desko in steber" },
  vijak: { vstavi: "Vstavi vijak", L: (I) => I.L ?? 40, d: 8, navoj: "metricni", glava: "goba", orodje: "kladivo", udarec: 34, vstop: (I) => (I.L ?? 40) - 12, korak: "Zabij do glave", navodilo: "Nekaj udarcev s kladivom — štirirobi vrat se zagozdi v les." },
  matica: { d: 8, spodaj: true, naY: () => T603.deska + T603.steber, podlozkaKorak: "Podložka DIN 125", korak: "Zategni matico DIN 934", navodilo: "Nastavi ključ na matico pod steberom in drži." },
  orodja: [...svedri([6, 8, 10]), roka("vijak", "DIN 603", "Sponski vijak je v roki. Klikni v luknjo."), OROD.kladivo, roka("podlozka", "Podložka DIN 125", "Podložka je v roki. Klikni pod vijak.", "element"), OROD.kljuc],
  oznaka: (I) => `DIN 603 M8 × ${I.L}`,
  doseg: 120,
  napisi: [{ x: 28, y: 300 + T603.deska * 3.6 - 14, t: "DESKA STRANICE 25 mm", velikost: 14 }, { x: 28, y: 300 + (T603.deska + T603.steber) * 3.6 + 22, t: "JEKLEN STEBER 4 mm", velikost: 14 }],
  podatki: [["Vijak", "DIN 603, polokrogla glava"], ["Vrat", "štirirobi — se zagozdi v les"], ["Luknja", "enaka premeru vijaka"], ["Dolžina", "deska + steber + podložka + matica + 2 navoja"], ["Matica", "DIN 934"], ["Podložka", "DIN 125"]],
  konec: { napis: "PRITRJENO", kratko: "Stranica je pritrjena.", naslov: "Stranica prikolice je pritrjena", besedilo: "Vijak M8 ste izbrali po luknjah v stebru, dolžino po debelini spoja, izvrtali skozi desko in steber, vijak zabili do glave in pod steberom zategnili matico s podložko. Štirirobi vrat preprečuje vrtenje vijaka.", povezave: [ponudba("din603")] },
});

/* =================================================================
   ASco DIN 571 — kotnik na lesen steber pergole
   ================================================================= */
const P571 = { 6: 4, 8: 5, 10: 6 };
export const din571 = sestavi({
  id: "din571", postavitev: "stena", u: 2.6, podlaga: "les", naslov: "Vijak stojalni DIN 571: kotnik na steber",
  luknje: [200, 400],
  element: { korak: "Prisloni kotnik", gumbNapis: "PRISLONI KOTNIK", gumb: { x: 820, y: 270 }, debelina: 3, potrdilo: "Kotnik je na mestu. Izberi vijak.",
    risba: (s, g) => (<g><rect x="120" y={-g.tEl} width="360" height={g.tEl} fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" /><rect x="120" y={-g.tEl - 130} width={g.tEl} height="130" fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" /></g>) },
  izbire: [{ pred: "vrtaj", naziv: "Izberi vijak", scenarij: "Kotnik 3 mm ima luknje Ø9. Vijak naj bo v lesu vsaj 6 × premer.",
    skupine: [izbor("d", "Premer DIN 571", [6, 8, 10], (v) => `Ø${v}`), izbor("L", "Dolžina", [40, 60, 80, 100], (v) => `${v} mm`)],
    preveri: (sel) => { if (sel.d === 10) return "Ø10 ne gre skozi luknjo Ø9 v kotniku."; if (sel.d === 6) return "Ø6 je za luknjo Ø9 premajhen — vijak bi opletal, podložka pa slabo nalegala. Izberi Ø8."; const pot = 3 + 1.6 + 6 * sel.d; return sel.L < pot ? `${sel.L} mm je prekratko — v lesu bi bil le ${Math.round(sel.L - 4.6)} mm, potrebnih je vsaj ${6 * sel.d} mm.` : null; },
    potrdilo: (I) => `DIN 571 ${I.d} × ${I.L}: predvrtaj Ø${P571[I.d]}.` }],
  vrtanje: { svedri: [4, 5, 6, 8], pravi: (I) => P571[I.d ?? 8], napaka: (d, prav) => (d > prav ? `Predvrtaj tanjše — Ø${prav}. Pri Ø${d} lesni navoj ne bi prijel.` : `Ø${d} je premajhen — les bi lahko počil. Predvrtaj Ø${prav}.`), globina: (I) => (I.L ?? 60) - 6, premer: (I) => P571[I.d ?? 8], mera: (I) => `predvrtaj Ø${P571[I.d]}`, delci: "#c99a62", navodilo: "Drži miško ob rdeči oznaki — predvrtaj les skozi luknjo v kotniku." },
  vijak: { vstavi: "Nastavi vijak s podložko", L: (I) => I.L ?? 60, d: (I) => I.d ?? 8, navoj: "lesni", glava: "sestroba", orodje: "kljuc", korak: "Privij s ključem", navodilo: "Nastavi ključ na šestrobo glavo in drži, dokler ne naleže." },
  orodja: [...svedri([4, 5, 6, 8]), roka("vijak", "DIN 571", "Vijak je v roki. Klikni na luknjo v kotniku."), OROD.kljuc, { ...OROD.vijacnik, napaka: "Šestroba glava DIN 571 se privija s ključem ali nasadnim ključem." }],
  oznaka: (I) => `DIN 571 ${I.d} × ${I.L}`,
  napisi: [{ x: 24, y: 576, t: "LESEN STEBER", velikost: 18 }],
  podatki: [["Vijak", "DIN 571, šestroba glava"], ["Predvrtanje", "≈ 0,6 × premer"], ["V lesu", "vsaj 6 × premer"], ["Podložka", "DIN 125"], ["Privijanje", "ključ ali nasadni ključ"]],
  konec: { napis: "PRITRJENO", kratko: "Kotnik je pritrjen.", naslov: "Kotnik je pritrjen", besedilo: "Premer ste izbrali po luknji v kotniku, dolžino tako, da je vijak v lesu vsaj 6 × premer, les predvrtali tanjše od vijaka in vijaka privili s ključem.", povezave: [ponudba("din571")] },
});

/* =================================================================
   ASco matični spoj — DIN 933 + DIN 125 + DIN 127B + DIN 934
   ================================================================= */
const TSP = 10;
export const maticniSpoj = sestavi({
  id: "maticni", postavitev: "tla", u: 4.2, naslov: "Spoj po DIN: vijak, podložke, matica",
  podlage: [{ tip: "jeklo", od: 0, do: TSP }, { tip: "jeklo", od: TSP, do: 2 * TSP }],
  luknje: [500, 700],
  risbaPod: () => <g>{[500, 700].map((x) => <rect key={x} x={x - 23} y="0" width="46" height={2 * TSP * 4.2} fill="#fff" />)}</g>,
  izbire: [{ pred: "vijak", naziv: "Izberi vijak", scenarij: `Dve jekleni plošči po ${TSP} mm z luknjama Ø11. Zgoraj podložka DIN 125, spodaj podložka DIN 125, vzmetna podložka DIN 127B in matica DIN 934.`,
    skupine: [izbor("M", "Premer DIN 933", [8, 10, 12], (v) => `M${v}`), izbor("L", "Dolžina", [30, 35, 40, 50], (v) => `${v} mm`)],
    preveri: (sel) => { if (sel.M === 12) return "M12 ne gre skozi luknjo Ø11."; if (sel.M === 8) return "M8 je za luknjo Ø11 premajhen — za luknjo Ø11 je vijak M10."; const pot = 2 * TSP + 2 + 2 + 2.5 + 8 + 2; return sel.L < pot ? `${sel.L} mm je prekratko: plošči ${2 * TSP} + podložki 4 + vzmetna 2,5 + matica 8 + 2 navoja = ${pot} mm.` : sel.L > pot + 12 ? `${sel.L} mm je predolgo — vijak bi štrlel čez matico.` : null; },
    potrdilo: (I) => `DIN 933 M10 × ${I.L}.` }],
  vijak: { vstavi: "Vstavi vijak s podložko", brezPrivijanja: true, L: (I) => I.L ?? 40, d: 10, navoj: "metricni", glava: "sestroba", koncnaGlava: -2 - 7, vstaviNavodilo: "Klikni v luknjo — vijak DIN 933 s podložko DIN 125 vstavi skozi obe plošči." },
  matica: { d: 10, spodaj: true, vzmetna: true, naY: () => 2 * TSP, podlozkaKorak: "Podložki 125 + 127B", podlozkaNavodilo: "Klikni pod vijak — nadeni podložko DIN 125 in vzmetno podložko DIN 127B.", korak: "Zategni matico DIN 934", navodilo: "Nastavi ključ na matico in drži." },
  risbaNad: (s) => (s.korak >= 2 || s.koncano ? <g>{[500, 700].map((x) => <rect key={x} x={x - 20} y={-2 * 4.2} width="40" height={2 * 4.2} fill="#d5d9dc" stroke={C.ink} strokeWidth="1" />)}</g> : null),
  orodja: [roka("vijak", "DIN 933 + DIN 125", "Vijak s podložko je v roki. Klikni v luknjo."), roka("podlozka", "Podložki 125 + 127B", "Podložki sta v roki. Klikni pod vijak.", "element"), OROD.kljuc],
  oznaka: (I) => `DIN 933 M10 × ${I.L}`,
  doseg: 130,
  napisi: [{ x: 28, y: 300 + 2 * TSP * 4.2 + 26, t: "DVE JEKLENI PLOŠČI 2 × 10 mm", velikost: 14 }],
  podatki: [["Vijak", "DIN 933 / DIN 931"], ["Podložka", "DIN 125"], ["Vzmetna podložka", "DIN 127B"], ["Matica", "DIN 934"], ["Dolžina", "spoj + podložke + matica + 2 navoja"], ["Namesto vzmetne", "samovarovalna matica DIN 985"]],
  konec: { napis: "PRITRJENO", kratko: "Spoj je zategnjen.", naslov: "Spoj po DIN je zategnjen", besedilo: "Premer ste izbrali po luknji, dolžino po debelini spoja s podložkami in matico. Namesto vzmetne podložke lahko uporabite samovarovalno matico DIN 985.", povezave: [ponudba("asco")] },
});

/* Montažne igre za ostale izdelke (ASfix, ASco). Koraki sledijo montažnim videom.
   Kjer točnega podatka (npr. premera svedra) nimamo potrjenega, igra ne ponuja izbire. */

import { sestavi, OROD, Napis, Puscica, C } from "./sestavljalnik";

const roka = (id, naziv, izbrano, ikona = "vlozek") => ({ id, naziv, risba: "roka", ikona, izbrano, brezRotacije: false });
const vrtalnik = { id: "sveder", naziv: "Vrtalnik", risba: "sveder", ikona: "sveder", sirina: 14, dolzina: 230, izbrano: "Vrtalnik je v roki. Drži miško nad rdečo oznako." };
const svedriIzbira = (prav, mozni, napaka) => mozni.map((d) => ({
  id: `sveder${d}`, naziv: `Sveder Ø${d}`, risba: "sveder", ikona: "sveder", oznaka: `Ø${d}`, sirina: 6 + d, dolzina: 230,
  ...(d === prav ? { izbrano: `V vrtalnik je vpet sveder Ø${d}. Drži miško nad rdečo oznako.` } : { napaka: napaka(d) }),
}));
const ponudba = (vir) => ({ href: `/kontakt?vir=igra-${vir}`, label: "Zahtevaj ponudbo" });

/* ---------- elementi (risbe v lokalnem prerezu: y < 0 je pred podlago) ---------- */
const okvir = (t, x0 = 60, x1 = 540) => () => <rect x={x0} y={-t} width={x1 - x0} height={t} fill="url(#v-les)" stroke={C.ink} strokeWidth="2" />;
const plosca = (t, x0, x1, barva = C.jeklo) => () => <rect x={x0} y={-t} width={x1 - x0} height={t} fill={barva} stroke={C.ink} strokeWidth="2" />;

/* =================================================================
   AF-RS — okenski okvir skozi element v zid
   ================================================================= */
export const afrs = sestavi({
  id: "afrs", postavitev: "stena", podlaga: "zid", naslov: "AF-RS: okvir skozi element v zid",
  luknje: [210, 390],
  element: { ime: "Okvir", korak: "Prisloni okvir", gumbNapis: "PRISLONI OKVIR", gumb: { x: 760, y: 270 }, debelina: 50, risba: okvir(50, 150, 450), potrdilo: "Okvir je na mestu. Vrtaš kar skozi okvir — vložek gre skozi element." },
  vrtanje: { orodje: "sveder10", globina: 140, premer: 20, mera: "Ø10 · h₁ = 70 mm", delci: "#c9a08a", navodilo: "Drži miško ob rdeči oznaki — vrtaj skozi okvir v zid." },
  pihaj: true,
  vlozek: { korak: "Vstavi AF-RS", dolzina: 50 + 120, sirina: 18, prirobnicaNaElementu: true, navodilo: "Klikni v vsako luknjo — vložek potisni skozi okvir, prirobnica naleže na okvir." },
  vijak: { korak: "Privij vijak", L: 160, d: 9, navoj: "metricni", glava: "plosca", koncnaGlava: -50 - 8, izstop: 36 },
  orodja: [
    ...svedriIzbira(10, [8, 10, 12], (d) => `AF-RS 10 potrebuje izvrtino Ø10 — ${d < 10 ? "v premajhno ga ne vstaviš" : "v preveliki se vložek ne razpre"}.`),
    OROD.pihalka,
    roka("vlozek", "AF-RS 10 × 100", "AF-RS je v roki. Klikni v izvrtino."),
    OROD.vijacnik,
    { ...OROD.kladivo, napaka: "AF-RS ne zabijaš — privij vijak, da se vložek razpre v zidu." },
  ],
  napisi: [{ x: 24, y: 576, t: "ZID", velikost: 18 }, { x: 498, y: 576, t: "OKVIR" }],
  podatki: [["Vložek", "AF-RS 10 × 100"], ["Premeri", "Ø8, Ø10, Ø12"], ["Sveder", "enak premeru vložka"], ["Montaža", "skozi element"], ["Glava", "ugreznjena, torx"], ["Podlage", "beton, opeka, zidaki, siporex"], ["Ocena", "ETA-21/0610"]],
  banner: { x: 860, y: 520, sirina: 300 },
  konec: { napis: "PRITRJENO", kratko: "Okvir je pritrjen.", naslov: "Okvir je pritrjen skozi element", besedilo: "Okvir ste prislonili, vrtali skozi okvir v zid, izvrtini očistili in vložka AF-RS potisnili skozi okvir. Ko vijak privijete, se vložek razpre v zidu, ugreznjena glava pa ostane poravnana z okvirjem.", povezave: [ponudba("afrs")] },
});

/* =================================================================
   ZIDNI VLOŽEK MQ — nosilec police na opečni zid
   ================================================================= */
export const mq = sestavi({
  id: "mq", postavitev: "stena", podlaga: "zid", naslov: "Zidni vložek MQ: nosilec v zid",
  luknje: [210, 390],
  vrtanje: { orodje: "sveder8", globina: 110, premer: 16, mera: "Ø8 · globina ≥ dolžina vložka", delci: "#c9a08a" },
  pihaj: true,
  vlozek: { korak: "Vstavi MQ", dolzina: 96, sirina: 16, barva: "#5c6064", razpr: 4, navodilo: "Klikni v vsako luknjo — vložek potisni do prirobnice." },
  element: { ime: "Nosilec", potem: true, predVijakom: true, korak: "Prisloni nosilec", debelina: 0, risba: plosca(8, 170, 430), vRoki: () => <rect x="-50" y="-8" width="100" height="8" fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" />, potrdilo: "Nosilec je na mestu. Zdaj privij vijaka." },
  vijak: { korak: "Privij vijaka", zakasni: true, L: 104, d: 8, navoj: "lesni", glava: "plosca", koncnaGlava: -16, izstop: 50, preskok: "Najprej prisloni nosilec." },
  orodja: [
    ...svedriIzbira(8, [6, 8, 10], (d) => `MQ Ø8 potrebuje izvrtino Ø8 — ${d < 8 ? "v premajhno ga ne vstaviš" : "v preveliki se vložek ne razpre"}.`),
    OROD.pihalka,
    roka("vlozek", "Vložek MQ Ø8", "Vložek MQ je v roki. Klikni v izvrtino."),
    { id: "element", naziv: "Nosilec", risba: "roka", ikona: "element", izbrano: "Nosilec je v roki. Klikni v prizor." },
    OROD.vijacnik,
  ],
  napisi: [{ x: 24, y: 576, t: "OPEČNI ZID", velikost: 18 }],
  nad: (s) => (s.nap[1][4] > 0 ? <g><Napis x={110} y={530}>vložek se razpre na štiri strani</Napis></g> : null),
  podatki: [["Vložek", "MQ, najlon"], ["Premeri", "Ø5 do Ø14"], ["Sveder", "enak premeru vložka"], ["Globina", "vsaj dolžina vložka"], ["Podlage", "beton, polna in votla opeka"]],
  banner: { x: 860, y: 520, sirina: 300 },
  konec: { napis: "PRITRJENO", kratko: "Nosilec je pritrjen.", naslov: "Nosilec je pritrjen", besedilo: "Izvrtali ste luknji, ju očistili, vstavili vložka MQ in skozi nosilec privili vijaka. Vložek se razpre na štiri strani in se zagozdi v opeki.", povezave: [ponudba("mq")] },
});

/* =================================================================
   KEMIČNA MASA — navojna palica v beton (EASF / PESF) in nosilec
   ================================================================= */
function kemija({ id, naslov, zid = false, konec, podatki, vir }) {
  return sestavi({
    id, postavitev: "stena", podlaga: zid ? "zid" : "beton", naslov,
    luknje: [210, 390],
    vrtanje: { orodje: "sveder", globina: 200, premer: 26, delci: zid ? "#c9a08a" : "#b9b4a4", navodilo: "Drži miško ob rdeči oznaki, dokler luknja ni izvrtana." },
    pihaj: !zid,
    ...(zid ? { vlozek: { korak: "Vstavi mrežico", dolzina: 196, sirina: 26, barva: "#c9ced2", navodilo: "Klikni v vsako luknjo — kovinsko mrežico vstavi do dna." } } : {}),
    masa: true,
    vijak: { korak: "Vstavi palico", orodje: "palica", L: 290, d: 14, navoj: "palica", glava: "brez", koncnaGlava: -92, izstop: 140, hitrost: 5, navodilo: "Drži miško nad luknjo — palico vstavi z rahlim vrtenjem do dna.", preskok: "Najprej napolni luknjo z maso." },
    element: { ime: "Nosilec", potem: true, korak: "Namesti nosilec", debelina: 0, risba: plosca(18, 170, 430), vRoki: () => <rect x="-50" y="-18" width="100" height="18" fill={C.jeklo} stroke={C.ink} strokeWidth="1.5" />, navodilo: "Ko masa otrdi, klikni v prizor, da namestiš jeklen nosilec.", potrdilo: "Nosilec je na palicah. Nadeni podložki in zategni matici." },
    matica: { d: 14, naY: () => -18, podlozka: { korak: "Podložka" }, korak: "Zategni matico" },
    orodja: [
      vrtalnik,
      ...(zid ? [] : [OROD.pihalka]),
      ...(zid ? [roka("vlozek", "Kovinska mrežica", "Kovinska mrežica je v roki. Klikni v luknjo.")] : []),
      OROD.pistola,
      roka("palica", "Navojna palica", "Navojna palica je v roki. Drži miško nad luknjo."),
      { id: "element", naziv: "Nosilec", risba: "roka", ikona: "element", izbrano: "Nosilec je v roki. Klikni v prizor." },
      roka("podlozka", "Podložka", "Podložka je v roki. Klikni na palico.", "element"),
      OROD.kljuc,
    ],
    napisi: [{ x: 24, y: 576, t: zid ? "VOTLA OPEKA" : "BETON", velikost: 18 }, (s, tr) => (s.nap[0][zid ? 2 : 2] > 0 && s.nap[0][zid ? 2 : 2] < 100 ? <Napis {...tr(120, 60)}>masa od dna navzgor</Napis> : null)],
    podatki,
    banner: { x: 860, y: 520, sirina: 300 },
    konec: { napis: "PRITRJENO", kratko: "Nosilec je pritrjen.", ...konec, povezave: [ponudba(vir)] },
  });
}
export const kemijaBeton = kemija({
  id: "kemija-beton", vir: "kemija", naslov: "Kemična masa: palica v beton",
  podatki: [["EASF TOP", "suha in vlažna podlaga, navojne in armaturne palice"], ["PESF TOP", "suha podlaga, navojne palice, popravilo lukenj"], ["Kartuša", "300 ml, pištola za kartuše"], ["Beton", "luknjo očisti in izpihaj"], ["Prvi del mase", "iztisni v odpadek"]],
  konec: { naslov: "Nosilec je pritrjen s kemično maso", besedilo: "Luknji ste izvrtali in očistili, ju od dna navzgor napolnili z maso in z vrtenjem vstavili navojni palici. Ko je masa otrdela, ste namestili nosilec, podložki in matici." },
});
export const kemijaVotla = kemija({
  id: "kemija-votla", vir: "mrezica", zid: true, naslov: "Kemična masa v votlo opeko z mrežico",
  podatki: [["Mrežica", "kovinska, dolžina 1 m"], ["Rezanje", "odrežeš na potrebno dolžino"], ["Premeri", "več premerov"], ["Votla stena", "luknje ne čistiš"], ["Masa", "EASF TOP ali PESF TOP"]],
  konec: { naslov: "Nosilec je pritrjen v votlo opeko", besedilo: "V votlo opeko ste vstavili kovinsko mrežico, jo napolnili z maso in vstavili palici. Mrežica zadrži maso, da ne steče v votline opeke, in z njo tvori trden čep." },
});
export const kemija975 = kemija({
  id: "palica-975", vir: "din975", naslov: "Navojna palica DIN 975: nosilec na beton",
  podatki: [["Palica", "DIN 975, navoj po celi dolžini"], ["Matica", "DIN 934"], ["Podložka", "DIN 125"], ["Spajanje palic", "podaljšana matica DIN 6334"], ["Masa", "ASfix EASF TOP ali PESF TOP"]],
  konec: { naslov: "Nosilec je pritrjen", besedilo: "Navojni palici ste vgradili v beton s kemično maso, nato ste namestili nosilec ter ga privili s podložkama DIN 125 in maticama DIN 934. Palico DIN 975 odrežete na potrebno dolžino." },
});

/* =================================================================
   KOMPLET ZA WC ŠKOLJKO — v tla
   ================================================================= */
export const wc = sestavi({
  id: "wc", postavitev: "tla", podlaga: "beton", naslov: "Komplet za WC školjko",
  luknje: [500, 700],
  vrtanje: { orodje: "sveder", globina: 120, premer: 18, mera: "globina ≥ dolžina vložka" },
  pihaj: true,
  vlozek: { korak: "Vstavi vložek", dolzina: 100, sirina: 18, barva: "#f4f4f2", navodilo: "Klikni v vsako luknjo — vložek ZV.A potisni do roba." },
  element: { ime: "WC školjka", potem: true, predVijakom: true, korak: "Postavi školjko", debelina: 0,
    risba: () => (<g><path d="M 440 -36 L 760 -36 L 760 0 L 440 0 Z" fill="#fbfbfb" stroke={C.ink} strokeWidth="2.5" /><path d="M 460 -36 C 460 -130 740 -130 740 -36" fill="#fbfbfb" stroke={C.ink} strokeWidth="2.5" /></g>),
    vRoki: () => <rect x="-60" y="-30" width="120" height="30" rx="6" fill="#fbfbfb" stroke={C.ink} strokeWidth="2" />, potrdilo: "Školjka je na mestu. Privij vijaka s ključem." },
  vijak: { korak: "Privij s ključem", orodje: "kljuc", zakasni: true, L: 150, d: 10, navoj: "lesni", glava: "sestroba", koncnaGlava: -36 - 14, izstop: 46, preskok: "Najprej postavi školjko." },
  orodja: [vrtalnik, OROD.pihalka, roka("vlozek", "Vložek ZV.A", "Vložek je v roki. Klikni v luknjo."), { id: "element", naziv: "WC školjka", risba: "roka", ikona: "enota", izbrano: "Školjka je v roki. Klikni v prizor." }, OROD.kljuc],
  napisi: [{ x: 24, y: 576, t: "TLA", velikost: 18 }],
  podatki: [["Vsebina", "vložek, vijak DIN 571, podložka, kapica"], ["Pakiranje", "2 kos"], ["Vijak", "šestroba glava, ključ"], ["Kapica", "bela, prekrije glavo"], ["Podlage", "beton, opeka, votlaki"]],
  konec: { napis: "PRITRJENO", kratko: "Školjka je pritrjena.", naslov: "WC školjka je pritrjena", besedilo: "Luknji ste izvrtali in izpihali, vstavili vložka ZV.A, postavili školjko in vijaka DIN 571 privili s ključem. Na koncu glavo prekrije bela kapica.", povezave: [ponudba("wc")] },
});

/* =================================================================
   BOJLER / UMIVALNIK — hanger vijak, podložka, matica
   ================================================================= */
function obesi({ id, naslov, ime, risba, vRoki, konec, podatki, vir }) {
  return sestavi({
    id, postavitev: "stena", podlaga: "zid", naslov,
    luknje: [210, 390],
    vrtanje: { orodje: "sveder", globina: 130, premer: 20, delci: "#c9a08a" },
    pihaj: true,
    vlozek: { korak: "Vstavi vložek", dolzina: 120, sirina: 20, barva: "#f4f4f2" },
    vijak: { korak: "Privij hanger vijak", tip: "hanger", Lles: 120, Lmet: 70, d: 12, navodilo: "Drži miško nad vijakom — lesni navoj privij v vložek, metrični navoj ostane zunaj." },
    element: { ime, potem: true, korak: `Obesi ${ime.toLowerCase()}`, debelina: 0, risba, vRoki, navodilo: `Klikni v prizor — ${ime.toLowerCase()} nadeneš od strani na vijaka.`, potrdilo: `${ime} visi na vijakih. Nadeni podložki in privij matici.` },
    matica: { d: 12, naY: () => -12, podlozka: { korak: "Podložka" }, korak: "Zategni matico" },
    orodja: [vrtalnik, OROD.pihalka, roka("vlozek", "Vložek", "Vložek je v roki. Klikni v luknjo."), roka("vijak", "Hanger vijak", "Hanger vijak je v roki."), OROD.vijacnik, { id: "element", naziv: ime, risba: "roka", ikona: "enota", izbrano: `${ime} je v roki. Klikni v prizor.` }, roka("podlozka", "Podložka", "Podložka je v roki. Klikni na vijak.", "element"), OROD.kljuc],
    napisi: [{ x: 24, y: 576, t: "ZID", velikost: 18 }],
    podatki, banner: { x: 860, y: 520, sirina: 300 },
    konec: { napis: "PRITRJENO", kratko: `${ime} je pritrjen.`, ...konec, povezave: [ponudba(vir)] },
  });
}
export const bojler = obesi({
  id: "bojler", vir: "bojler", ime: "Bojler", naslov: "Komplet za bojler",
  risba: () => (<g><rect x="160" y="-12" width="280" height="12" fill={C.jeklo} stroke={C.ink} strokeWidth="2" /><rect x="140" y="-400" width="320" height="388" rx="30" fill="#f4f5f6" stroke={C.ink} strokeWidth="2.5" /></g>),
  vRoki: () => <rect x="-60" y="-50" width="120" height="50" rx="10" fill="#f4f5f6" stroke={C.ink} strokeWidth="2" />,
  podatki: [["Vsebina", "hanger vijak, vložek, podložka, matica"], ["Pakiranje", "2 kos"], ["Dimenzije", "8 × 100 do 10 × 140"], ["Matica", "omogoča poravnavo"], ["Površina", "pocinkano"]],
  konec: { naslov: "Bojler je obešen", besedilo: "V vložka ste privili hanger vijaka, bojler nadeli od strani, nato nadeli podložki in matici zategnili s ključem. Z maticama bojler poravnate v navpičnico." },
});
export const umivalnik = obesi({
  id: "umivalnik", vir: "umivalnik", ime: "Umivalnik", naslov: "Komplet za umivalnik",
  risba: () => (<g><rect x="160" y="-30" width="280" height="30" fill="#fbfbfb" stroke={C.ink} strokeWidth="2.5" /><path d="M 160 -30 L 160 -220 Q 300 -250 440 -220 L 440 -30" fill="#fbfbfb" stroke={C.ink} strokeWidth="2.5" /></g>),
  vRoki: () => <rect x="-60" y="-30" width="120" height="30" rx="6" fill="#fbfbfb" stroke={C.ink} strokeWidth="2" />,
  podatki: [["Vsebina", "hanger vijak, vložek, podložka, matica"], ["Pakiranje", "2 kos"], ["Dimenzije", "8 × 100 do 10 × 140"], ["Podlage", "beton, opeka"]],
  konec: { naslov: "Umivalnik je pritrjen", besedilo: "V vložka ste privili hanger vijaka, umivalnik nadeli na vijaka, nato podložki in matici zategnili s ključem." },
});

/* =================================================================
   CEVNO DRŽALO — na steno ali v strop (vložek MQ + hanger vijak)
   ================================================================= */
function cevno({ id, strop }) {
  const Lmet = 60;
  return sestavi({
    id, postavitev: strop ? "strop" : "stena", podlaga: "beton", naslov: strop ? "Cevno držalo v strop" : "Cevno držalo na steno",
    luknje: strop ? [500, 700] : [210, 390],
    vrtanje: { orodje: "sveder", globina: 110, premer: 18 },
    pihaj: true,
    vlozek: { korak: "Vstavi MQ", dolzina: 96, sirina: 18, barva: "#5c6064", razpr: 3 },
    vijak: { korak: "Privij hanger", tip: "hanger", Lles: 90, Lmet, d: 10, navodilo: "Drži miško nad vijakom — lesni navoj v vložek, metrični navoj M8 ostane zunaj." },
    element: { ime: "Cevno držalo", potem: true, korak: "Privij držalo", debelina: 0,
      risba: (s) => (<g>{(strop ? [500, 700] : [210, 390]).map((x) => (<g key={x}><rect x={x - 12} y={-Lmet - 22} width="24" height="26" fill="#b9c1c7" stroke={C.ink} strokeWidth="1.5" /><circle cx={x} cy={-Lmet - 22 - 50} r="48" fill="none" stroke="#9aa3aa" strokeWidth="14" /><circle cx={x} cy={-Lmet - 22 - 50} r="42" fill="none" stroke="#232527" strokeWidth="6" />{s.nap[0][s.nap[0].length - 1] >= 100 && <circle cx={x} cy={-Lmet - 22 - 50} r="38" fill="#d5dadf" stroke="#a9b0b6" strokeWidth="3" />}</g>))}</g>),
      vRoki: () => <circle cx="0" cy="-60" r="50" fill="none" stroke="#9aa3aa" strokeWidth="10" />, navodilo: "Klikni v prizor — držali privij na metrični navoj.", potrdilo: "Držali sta na vijakih. Zdaj vstavi cev." },
    dodatniKorak: { naziv: "Vstavi cev", tip: "postavi", orodje: "cev", navodilo: "Klikni v prizor — vstavi cev v držali in jih zapri.", potrdilo: "Cev je v držalih." },
    orodja: [vrtalnik, OROD.pihalka, roka("vlozek", "Vložek MQ", "Vložek MQ je v roki. Klikni v luknjo."), OROD.vijacnik, { id: "element", naziv: "Cevno držalo", risba: "roka", ikona: "element", izbrano: "Cevno držalo je v roki. Klikni v prizor." }, { id: "cev", naziv: "Vodovodna cev", risba: "roka", ikona: "trak", izbrano: "Cev je v roki. Klikni v prizor." }],
    vRoki: (idx) => (idx === "cev" ? <circle cx="0" cy="-40" r="36" fill="#d5dadf" stroke="#a9b0b6" strokeWidth="3" /> : null),
    napisi: [strop ? { x: 24, y: 210, t: "STROP", velikost: 18 } : { x: 24, y: 576, t: "STENA", velikost: 18 }],
    podatki: [["Vložek", "zidni vložek MQ"], ["Vijak", "hanger, lesni + metrični navoj M8"], ["Držalo", "z gumijastim vložkom"], ["Premeri cevi", "od 12–14 mm (1/4\") naprej"]],
    banner: { x: 860, y: strop ? 520 : 520, sirina: 300 },
    konec: { napis: "PRITRJENO", kratko: "Cev je pritrjena.", naslov: "Cev je pritrjena", besedilo: `V ${strop ? "strop" : "steno"} ste vstavili vložka MQ, vanju privili hanger vijaka in na metrični navoj privili cevni držali. Gumijasti vložek duši tresljaje in hrup.`, povezave: [ponudba(id)] },
  });
}
export const cevnoStena = cevno({ id: "cevno", strop: false });
export const cevnoStrop = cevno({ id: "hanger", strop: true });

/* =================================================================
   VLOŽEK ZA STIROPOR — svetilo na fasado
   ================================================================= */
export const stiropor = sestavi({
  id: "stiropor", postavitev: "stena", naslov: "Vložek za stiropor: svetilo na fasado",
  podlage: [{ tip: "eps", od: 0, do: 160 }, { tip: "zid", od: 160, do: 600 }],
  luknje: [210, 390],
  vlozek: { korak: "Privij vložek", dolzina: 110, sirina: 26, barva: "#f4f4f2", navodilo: "Klikni na rdeči oznaki — vložek privij v stiropor, prirobnica poravnana s fasado." },
  element: { ime: "Svetilo", potem: true, predVijakom: true, korak: "Prisloni svetilo", debelina: 0,
    risba: () => (<g><rect x="170" y="-14" width="260" height="14" fill="#3a3f44" stroke={C.ink} strokeWidth="2" /><rect x="230" y="-90" width="140" height="76" rx="14" fill="#f2f2ee" stroke={C.ink} strokeWidth="2" /></g>),
    vRoki: () => <rect x="-60" y="-50" width="120" height="50" rx="10" fill="#f2f2ee" stroke={C.ink} strokeWidth="2" />, potrdilo: "Svetilo je na mestu. Privij lesna vijaka 4 × 40." },
  vijak: { korak: "Privij vijaka", zakasni: true, L: 80, d: 8, navoj: "lesni", glava: "plosca", koncnaGlava: -22, izstop: 50, navodilo: "Drži miško nad vijakom — ne pretegni, da se stiropor ne poškoduje.", preskok: "Najprej prisloni svetilo." },
  orodja: [roka("vlozek", "Vložek 95 mm", "Vložek je v roki. Klikni na rdečo oznako."), { id: "element", naziv: "Svetilo", risba: "roka", ikona: "enota", izbrano: "Svetilo je v roki. Klikni v prizor." }, OROD.vijacnik, { ...vrtalnik, napaka: "Vložek za stiropor se sam privije v izolacijo — vrtanje ni potrebno." }],
  napisi: [{ x: 150, y: 576, t: "STIROPOR (EPS)", velikost: 16 }, { x: 14, y: 576, t: "ZID", velikost: 16 }],
  podatki: [["Velikosti", "50, 60 in 95 mm"], ["Vijak", "lesni vijak 4 × 40"], ["Za", "svetila, nabiralnike, hišne številke"], ["Ni za", "pritrjevanje izolacijskih plošč"], ["Pozor", "vijaka ne pretegni"]],
  banner: { x: 860, y: 520, sirina: 300 },
  konec: { napis: "PRITRJENO", kratko: "Svetilo je pritrjeno.", naslov: "Svetilo je na fasadi", besedilo: "Vložka ste privili v stiropor, prislonili svetilo in privili lesna vijaka 4 × 40. Vložek ostane v izolaciji in ne sega do zidu, zato ne nastane toplotni most.", povezave: [ponudba("stiropor")] },
});

/* =================================================================
   ASco: DIN 7504 — trapezna pločevina na jekleno lego
   ================================================================= */
const trapez = (t) => () => (
  <path d={`M -400 ${-t} L 520 ${-t} L 545 ${-t - 40} L 655 ${-t - 40} L 680 ${-t} L 1600 ${-t} L 1600 0 L -400 0 Z`} fill="#8fa3b5" stroke={C.ink} strokeWidth="2" />
);
export const din7504 = sestavi({
  id: "din7504", postavitev: "tla", naslov: "Samovrtalni vijak: pločevina na jekleno lego",
  podlage: [{ tip: "jeklo", od: 0, do: 34 }],
  luknje: [470, 730],
  element: { ime: "Trapezna pločevina", korak: "Položi pločevino", gumbNapis: "POLOŽI PLOČEVINO", gumb: { x: 600, y: 120 }, debelina: 6, risba: trapez(6), potrdilo: "Pločevina leži na jekleni legi." },
  vijak: { vstavi: "Nastavi vijak", korak: "Privij", L: 80, d: 12, navoj: "svedrast", glava: "prirobnica", koncnaGlava: -6 - 14, izstop: 46, hitrost: 3, navodilo: "Drži miško nad vijakom — konica izvrta luknjo, vijak izreže navoj in se privije." },
  orodja: [roka("vijak", "DIN 7504 K", "Samovrtalni vijak je v roki. Klikni na rdečo oznako."), OROD.vijacnik, { ...vrtalnik, napaka: "Samovrtalnega vijaka ne predvrtaš — svedrasta konica sama izvrta luknjo." }],
  napisi: [{ x: 28, y: 382, t: "JEKLENA LEGA", velikost: 16 }],
  podatki: [["Vijak", "DIN 7504 K, šestroba glava s prirobnico"], ["Druge glave", "N lečasta, P ugrezna"], ["Konica", "svedrasta"], ["Predvrtanje", "ni potrebno"], ["Za", "pločevino na jeklene profile"]],
  konec: { napis: "PRITRJENO", kratko: "Pločevina je pritrjena.", naslov: "Pločevina je pritrjena", besedilo: "Samovrtalni vijak je v enem koraku izvrtal luknjo skozi pločevino in lego, izrezal navoj in se privil — brez predvrtanja.", povezave: [ponudba("din7504")] },
});

/* =================================================================
   ASco: KNIPING DIN 7981 / 7982 — prezračevalni kanal
   ================================================================= */
export const kniping = sestavi({
  id: "kniping", postavitev: "tla", naslov: "Kniping vijak: spoj prezračevalnega kanala",
  podlage: [{ tip: "jeklo", od: 0, do: 6 }],
  luknje: [500, 700],
  element: { ime: "Spojni del", korak: "Prekrij spoj", gumbNapis: "PREKRIJ SPOJ", gumb: { x: 600, y: 120 }, debelina: 6, risba: plosca(6, 400, 800, "#b2bbc1"), potrdilo: "Spojni del prekriva kanal." },
  vrtanje: { orodje: "sveder", globina: 6, premer: 8, navodilo: "Drži miško nad rdečo oznako — izvrtaj luknjo skozi spojni del in kanal." },
  vijak: { vstavi: "Nastavi vijak", korak: "Privij", L: 60, d: 10, navoj: "metricni", glava: "plosca", koncnaGlava: -6 - 8, izstop: 40, navodilo: "Drži miško nad vijakom — navoj se oblikuje v pločevini." },
  orodja: [vrtalnik, roka("vijak", "DIN 7981", "Kniping vijak je v roki. Klikni v luknjo."), OROD.vijacnik],
  napisi: [{ x: 28, y: 372, t: "KANAL", velikost: 16 }],
  podatki: [["Vijak", "DIN 7981 lečasta ali DIN 7982 ugrezna glava"], ["Konica", "ostra"], ["Navoj", "se oblikuje v pločevini"], ["Za", "tanko pločevino"]],
  konec: { napis: "PRITRJENO", kratko: "Kanal je spojen.", naslov: "Kanal je spojen", besedilo: "Skozi spojni del in kanal ste izvrtali luknji, nastavili kniping vijaka in ju privili — vijak si sam oblikuje navoj v pločevini.", povezave: [ponudba("kniping")] },
});

/* =================================================================
   ASco: DIN 603 — deska stranice na jeklen steber prikolice
   ================================================================= */
export const din603 = sestavi({
  id: "din603", postavitev: "tla", naslov: "Sponski vijak: stranica prikolice",
  podlage: [{ tip: "les", od: 0, do: 60 }, { tip: "jeklo", od: 60, do: 74 }],
  luknje: [500, 700],
  vrtanje: { orodje: "sveder8", globina: 74, premer: 16, mera: "Ø8 · skozi desko in steber" },
  vijak: { vstavi: "Vstavi vijak", korak: "Zabij do glave", orodje: "kladivo", L: 130, d: 14, navoj: "metricni", glava: "goba", koncnaGlava: -8, izstop: 14, navodilo: "Dva udarca — štirirobi vrat se zagozdi v les." },
  matica: { d: 14, spodaj: true, naY: () => 74, podlozka: { korak: "Podložka DIN 125" }, korak: "Zategni matico", navodilo: "Drži miško pod steborom — matico zategni s ključem." },
  orodja: [...svedriIzbira(8, [6, 8, 10], (d) => `Za vijak M8 vrtaj s svedrom Ø8 — ${d < 8 ? "vijak ne gre skozi" : "vrat se v preveliki luknji ne zagozdi"}.`), roka("vijak", "DIN 603 M8", "Sponski vijak je v roki. Klikni v luknjo."), OROD.kladivo, roka("podlozka", "Podložka DIN 125", "Podložka je v roki. Klikni na vijak.", "element"), OROD.kljuc],
  napisi: [{ x: 28, y: 392, t: "DESKA STRANICE", velikost: 16 }, { x: 28, y: 490, t: "JEKLEN STEBER", velikost: 16 }],
  podatki: [["Vijak", "DIN 603, polokrogla glava"], ["Vrat", "štirirobi — se zagozdi v les"], ["Matica", "DIN 934"], ["Podložka", "DIN 125"], ["Za", "prikolice, ograje, pergole"]],
  konec: { napis: "PRITRJENO", kratko: "Stranica je pritrjena.", naslov: "Stranica prikolice je pritrjena", besedilo: "Skozi desko in jeklen steber ste izvrtali luknji, vstavili sponska vijaka in ju s kladivom zabili do glave. Štirirobi vrat se zagozdi v les, zato se vijak pri zategovanju matice ne vrti.", povezave: [ponudba("din603")] },
});

/* =================================================================
   ASco: DIN 571 — kotnik na lesen steber pergole
   ================================================================= */
export const din571 = sestavi({
  id: "din571", postavitev: "stena", podlaga: "les", naslov: "Vijak stojalni: kotnik na steber",
  luknje: [210, 390],
  element: { ime: "Kotnik", korak: "Prisloni kotnik", gumbNapis: "PRISLONI KOTNIK", gumb: { x: 760, y: 270 }, debelina: 10, risba: () => (<g><rect x="140" y="-10" width="320" height="10" fill={C.jeklo} stroke={C.ink} strokeWidth="2" /><rect x="140" y="-120" width="10" height="120" fill={C.jeklo} stroke={C.ink} strokeWidth="2" /></g>), potrdilo: "Kotnik je na mestu. Skozi luknje predvrtaj les." },
  vrtanje: { orodje: "sveder", globina: 150, premer: 10, delci: "#c99a62", navodilo: "Drži miško ob rdeči oznaki — predvrtaj les skozi luknjo v kotniku." },
  vijak: { vstavi: "Nastavi vijak", korak: "Privij s ključem", orodje: "kljuc", L: 170, d: 14, navoj: "lesni", glava: "sestroba", koncnaGlava: -10 - 14, izstop: 50, navodilo: "Drži miško nad glavo — vijak privij s ključem, da naleže na kotnik." },
  orodja: [vrtalnik, roka("vijak", "DIN 571", "Vijak stojalni je v roki. Klikni v luknjo."), OROD.kljuc, { ...OROD.vijacnik, napaka: "Šestroba glava DIN 571 se privija s ključem ali nasadnim ključem." }],
  napisi: [{ x: 24, y: 576, t: "LESEN STEBER", velikost: 18 }],
  podatki: [["Vijak", "DIN 571, šestroba glava"], ["Navoj", "lesni"], ["Privijanje", "ključ ali nasadni ključ"], ["Podložka", "DIN 125"], ["Za", "les, kotnike in nosilce"]],
  banner: { x: 860, y: 520, sirina: 300 },
  konec: { napis: "PRITRJENO", kratko: "Kotnik je pritrjen.", naslov: "Kotnik je pritrjen", besedilo: "Kotnik ste prislonili, les predvrtali skozi njegove luknje in vijaka DIN 571 privili s ključem.", povezave: [ponudba("din571")] },
});

/* =================================================================
   ASco: matični spoj DIN 933 + DIN 125 + DIN 127B + DIN 934
   ================================================================= */
export const maticniSpoj = sestavi({
  id: "maticni", postavitev: "tla", naslov: "Spoj po DIN: vijak, podložki, matica",
  podlage: [{ tip: "jeklo", od: 0, do: 34 }, { tip: "jeklo", od: 34, do: 68 }],
  luknje: [500, 700],
  risbaPod: () => <g>{[500, 700].map((x) => <rect key={x} x={x - 9} y="0" width="18" height="68" fill="#fff" />)}</g>,
  vijak: { vstavi: "Vstavi vijak", brezPrivijanja: true, L: 120, d: 16, navoj: "metricni", glava: "sestroba", koncnaGlava: -18, vstaviNavodilo: "Klikni v luknjo — vijak DIN 933 s podložko DIN 125 vstavi skozi oba dela." },
  matica: { d: 16, spodaj: true, vzmetna: true, naY: () => 68, podlozka: { korak: "Podložki", navodilo: "Klikni na vijak — spodaj nadeni podložko DIN 125 in vzmetno podložko DIN 127B." }, korak: "Zategni matico", navodilo: "Drži miško pod spojem — matico DIN 934 zategni s ključem." },
  orodja: [roka("vijak", "DIN 933", "Vijak DIN 933 je v roki. Klikni v luknjo."), roka("podlozka", "Podložki 125 + 127B", "Podložki sta v roki. Klikni na vijak.", "element"), OROD.kljuc],
  napisi: [{ x: 28, y: 392, t: "JEKLENA DELA", velikost: 16 }, (s, tr) => (s.nap[0][s.nap[0].length - 1] >= 100 ? <Napis {...tr(820, 120)}>DIN 933 · DIN 125 · DIN 127B · DIN 934</Napis> : null)],
  podatki: [["Vijak", "DIN 933 / DIN 931"], ["Podložka", "DIN 125"], ["Vzmetna podložka", "DIN 127B"], ["Matica", "DIN 934"], ["Namesto vzmetne", "samovarovalna matica DIN 985"], ["Material", "pocinkano ZnB ali INOX"]],
  konec: { napis: "PRITRJENO", kratko: "Spoj je zategnjen.", naslov: "Spoj po DIN je zategnjen", besedilo: "Vijak DIN 933 s podložko DIN 125 ste vstavili skozi oba dela, spodaj nadeli podložko in vzmetno podložko DIN 127B ter zategnili matico DIN 934. Namesto vzmetne podložke lahko uporabite samovarovalno matico DIN 985.", povezave: [ponudba("asco")] },
});

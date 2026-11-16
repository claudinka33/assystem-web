// Prevod drevesa React (strežniške komponente) za /en in /de.
// Stran se izriše v slovenščini, nato se iz drevesa poberejo vsa vidna
// besedila, se prevedejo naenkrat in vstavijo nazaj. Notranje povezave
// dobijo jezikovno predpono.

import { isValidElement, cloneElement, Fragment, createElement } from "react";
import { prevedi } from "./prevajalnik";
import { kljuc, zaPrevod, obdrziRobove, potZJezikom, VIDNE_LASTNOSTI, KLJUCI_BESEDIL, jeLastnostZaPrevod } from "./skupno";

const ODJEMALSKA = Symbol.for("react.client.reference");

const jeOdjemalska = (type) => {
  try {
    return !!type && type.$$typeof === ODJEMALSKA;
  } catch {
    return false;
  }
};
const jeStreznikaFunkcija = (type) =>
  typeof type === "function" && !jeOdjemalska(type) && !(type.prototype && type.prototype.isReactComponent);
const jeNavadenObjekt = (v) => v !== null && typeof v === "object" && Object.getPrototypeOf(v) === Object.prototype;

const NE_PREVAJAJ_ZNACK = new Set(["script", "style", "code", "pre", "svg", "path", "noscript", "textarea"]);

// ---------- 1. razširi strežniške komponente in zberi besedila ----------
async function razsiri(vozel, zbir) {
  if (vozel === null || vozel === undefined || typeof vozel === "boolean" || typeof vozel === "number") return vozel;
  if (typeof vozel === "string") {
    if (zaPrevod(vozel)) zbir.besedila.add(kljuc(vozel));
    return vozel;
  }
  if (Array.isArray(vozel)) return Promise.all(vozel.map((v) => razsiri(v, zbir)));
  if (typeof vozel?.then === "function") return razsiri(await vozel, zbir);
  if (!isValidElement(vozel)) return vozel;

  const { type, props } = vozel;

  if (jeStreznikaFunkcija(type)) {
    const izhod = await razsiri(await type(props), zbir);
    return vozel.key != null ? createElement(Fragment, { key: vozel.key }, izhod) : izhod;
  }

  if (typeof type === "string" && NE_PREVAJAJ_ZNACK.has(type)) return vozel;
  if (props?.translate === "no" || props?.["data-ne-prevedi"]) return vozel;

  const odjemalska = jeOdjemalska(type);
  const nove = {};
  let spremenjeno = false;
  for (const [k, v] of Object.entries(props ?? {})) {
    if (k === "children" || isValidElement(v) || (Array.isArray(v) && v.some(isValidElement))) {
      const r = await razsiri(v, zbir);
      if (r !== v) {
        nove[k] = r;
        spremenjeno = true;
      }
    } else if (typeof v === "string") {
      if ((VIDNE_LASTNOSTI.includes(k) && zaPrevod(v)) || (odjemalska && jeLastnostZaPrevod(k, v))) zbir.besedila.add(kljuc(v));
    } else if (k === "dangerouslySetInnerHTML" && typeof v?.__html === "string" && v.__html.trim()) {
      zbir.html.add(v.__html.trim());
    } else if (odjemalska && (Array.isArray(v) || jeNavadenObjekt(v))) {
      zberiPodatke(v, zbir, 0);
    }
  }
  return spremenjeno ? cloneElement(vozel, nove) : vozel;
}

function zberiPodatke(v, zbir, globina, kljucStarsa = null) {
  if (globina > 6 || v === null || v === undefined) return;
  if (typeof v === "string") {
    if (kljucStarsa && KLJUCI_BESEDIL.has(kljucStarsa) && zaPrevod(v)) zbir.besedila.add(kljuc(v));
    return;
  }
  if (Array.isArray(v)) {
    for (const x of v) zberiPodatke(x, zbir, globina + 1, kljucStarsa);
    return;
  }
  if (isValidElement(v)) return;
  if (jeNavadenObjekt(v)) for (const [k, x] of Object.entries(v)) zberiPodatke(x, zbir, globina + 1, k);
}

// ---------- 2. vstavi prevode in jezikovne predpone ----------
function zamenjajNiz(s, slovar) {
  const p = slovar[kljuc(s)];
  return p ? obdrziRobove(s, p) : s;
}

const KLJUCI_POTI = new Set(["pot", "href", "povezava", "url", "link"]);
function zamenjajPodatke(v, slovar, jezik, globina, kljucStarsa = null) {
  if (globina > 6 || v === null || v === undefined) return v;
  if (typeof v === "string") {
    if (kljucStarsa && KLJUCI_POTI.has(kljucStarsa)) return potZJezikom(v, jezik);
    return kljucStarsa && KLJUCI_BESEDIL.has(kljucStarsa) ? zamenjajNiz(v, slovar) : v;
  }
  if (Array.isArray(v)) return v.map((x) => zamenjajPodatke(x, slovar, jezik, globina + 1, kljucStarsa));
  if (isValidElement(v) || !jeNavadenObjekt(v)) return v;
  const o = {};
  for (const [k, x] of Object.entries(v)) o[k] = zamenjajPodatke(x, slovar, jezik, globina + 1, k);
  return o;
}

function vstavi(vozel, slovar, html, jezik) {
  if (typeof vozel === "string") return zamenjajNiz(vozel, slovar);
  if (Array.isArray(vozel)) return vozel.map((v) => vstavi(v, slovar, html, jezik));
  if (!isValidElement(vozel)) return vozel;
  const { type, props } = vozel;
  if (typeof type === "string" && NE_PREVAJAJ_ZNACK.has(type)) return vozel;
  if (props?.translate === "no" || props?.["data-ne-prevedi"]) return vozel;
  const odjemalska = jeOdjemalska(type);
  const nove = {};
  for (const [k, v] of Object.entries(props ?? {})) {
    if (k === "children" || isValidElement(v) || (Array.isArray(v) && v.some(isValidElement))) {
      nove[k] = vstavi(v, slovar, html, jezik);
    } else if (typeof v === "string") {
      if (k === "href" || k === "action" || (odjemalska && (k === "pot" || k === "povezava" || k === "url"))) nove[k] = potZJezikom(v, jezik);
      else if (VIDNE_LASTNOSTI.includes(k) || (odjemalska && jeLastnostZaPrevod(k, v))) nove[k] = zamenjajNiz(v, slovar);
    } else if (k === "dangerouslySetInnerHTML" && typeof v?.__html === "string") {
      const p = html[v.__html.trim()];
      if (p) nove[k] = { __html: p };
    } else if (k === "href" && jeNavadenObjekt(v) && typeof v.pathname === "string") {
      nove[k] = { ...v, pathname: potZJezikom(v.pathname, jezik) };
    } else if (odjemalska && (Array.isArray(v) || jeNavadenObjekt(v))) {
      nove[k] = zamenjajPodatke(v, slovar, jezik, 0);
    }
  }
  return Object.keys(nove).length ? cloneElement(vozel, nove) : vozel;
}

/** Prevede celotno drevo (stran, nogo …) v izbrani jezik. */
export async function prevediDrevo(vozel, jezik) {
  if (!jezik || jezik === "sl") return vozel;
  const zbir = { besedila: new Set(), html: new Set() };
  const razsirjeno = await razsiri(vozel, zbir);
  const [slovar, html] = await Promise.all([
    prevedi(jezik, [...zbir.besedila]),
    zbir.html.size ? prevedi(jezik, [...zbir.html], { html: true }) : {},
  ]);
  return vstavi(razsirjeno, slovar, html, jezik);
}

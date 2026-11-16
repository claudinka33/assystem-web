"use client";

// Prevod komponent, ki tečejo v brskalniku (meni, obrazci, košarica …).
// Slovar dobi postavitev strani (app/(splet)/layout.js) za vse nize iz
// lib/i18n/nizi-odjemalca.json, ki jih ob vsaki gradnji zbere scripts/i18n-zberi.mjs.

import { createContext, useContext, isValidElement, cloneElement, createElement } from "react";
import Link from "next/link";
import Image from "next/image";
import { kljuc, obdrziRobove, potZJezikom, VIDNE_LASTNOSTI } from "./skupno";

const JezikKontekst = createContext({ jezik: "sl", slovar: null });

export function JezikProvider({ jezik = "sl", slovar = null, children }) {
  return <JezikKontekst.Provider value={{ jezik, slovar }}>{children}</JezikKontekst.Provider>;
}

/** Trenutni jezik in funkcija t() za posamezen niz. */
export function useJezik() {
  const { jezik, slovar } = useContext(JezikKontekst);
  const t = (s) => {
    if (jezik === "sl" || !slovar || typeof s !== "string") return s;
    const p = slovar[kljuc(s)];
    return p ? obdrziRobove(s, p) : s;
  };
  return { jezik, t, pot: (href) => potZJezikom(href, jezik) };
}

const NE_OVIJ = new Set([Link, Image]);
const NE_PREVAJAJ_ZNACK = new Set(["script", "style", "code", "pre", "svg", "path", "noscript", "textarea"]);
const ovoji = new WeakMap();

function jeKomponentaZaOvoj(type) {
  return (
    typeof type === "function" &&
    !type.__prevedeno &&
    !NE_OVIJ.has(type) &&
    !(type.prototype && type.prototype.isReactComponent)
  );
}

function ovij(type) {
  let o = ovoji.get(type);
  if (!o) {
    o = function PrevedenaKomponenta(props) {
      const ctx = useContext(JezikKontekst);
      const izhod = type(props);
      return ctx.jezik === "sl" ? izhod : prevediOdjemalec(izhod, ctx);
    };
    o.__prevedeno = true;
    o.displayName = type.displayName || type.name || "Komponenta";
    ovoji.set(type, o);
  }
  return o;
}

function prevediNiz(s, slovar) {
  if (!slovar) return s;
  const p = slovar[kljuc(s)];
  return p ? obdrziRobove(s, p) : s;
}

function prevediOdjemalec(vozel, ctx) {
  if (typeof vozel === "string") return prevediNiz(vozel, ctx.slovar);
  if (Array.isArray(vozel)) return vozel.map((v) => prevediOdjemalec(v, ctx));
  if (!isValidElement(vozel)) return vozel;
  const { type, props } = vozel;
  if (typeof type === "string" && NE_PREVAJAJ_ZNACK.has(type)) return vozel;
  if (props?.translate === "no" || props?.["data-ne-prevedi"]) return vozel;

  const nove = {};
  for (const [k, v] of Object.entries(props ?? {})) {
    if (k === "children" || isValidElement(v) || (Array.isArray(v) && v.some(isValidElement))) {
      const r = prevediOdjemalec(v, ctx);
      if (r !== v) nove[k] = r;
    } else if (typeof v === "string") {
      if (k === "href" || k === "action") {
        const r = potZJezikom(v, ctx.jezik);
        if (r !== v) nove[k] = r;
      } else if (VIDNE_LASTNOSTI.includes(k)) {
        const r = prevediNiz(v, ctx.slovar);
        if (r !== v) nove[k] = r;
      }
    }
  }
  if (jeKomponentaZaOvoj(type)) {
    // zamenjamo vrsto elementa z ovojem, ki prevede tudi njegov izhod
    const lastnosti = { ...props, ...nove };
    if (vozel.key != null) lastnosti.key = vozel.key;
    return createElement(ovij(type), lastnosti);
  }
  return Object.keys(nove).length ? cloneElement(vozel, nove) : vozel;
}

/** Ovoj komponente v brskalniku: na /en in /de se njen izhod prevede. */
export function prevedeno(Komponenta) {
  if (Komponenta.__prevedeno) return Komponenta;
  function Prevedeno(props) {
    const ctx = useContext(JezikKontekst);
    const izhod = Komponenta(props);
    return ctx.jezik === "sl" ? izhod : prevediOdjemalec(izhod, ctx);
  }
  Prevedeno.__prevedeno = true;
  Prevedeno.displayName = Komponenta.displayName || Komponenta.name || "Komponenta";
  return Prevedeno;
}

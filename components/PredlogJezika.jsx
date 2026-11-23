"use client";

// Obiskovalcu iz tujine (jezik brskalnika ni slovenščina) ponudi stran v njegovem jeziku.
import { useEffect, useState } from "react";
import { potZJezikom, brezJezika } from "@/lib/i18n/skupno";

const BESEDILA = {
  en: { tx: "This website is also available in English.", gumb: "Switch to English", zapri: "Stay in Slovenian" },
  de: { tx: "Diese Website gibt es auch auf Deutsch.", gumb: "Auf Deutsch ansehen", zapri: "Auf Slowenisch bleiben" },
  hr: { tx: "Ova stranica dostupna je i na hrvatskom jeziku.", gumb: "Prikaži na hrvatskom", zapri: "Ostani na slovenskom" },
};
const KLJUC = "as_jezik_predlog";

function zeleniJezik() {
  const seznam = (navigator.languages?.length ? navigator.languages : [navigator.language || ""]).map((l) => String(l).toLowerCase());
  if (seznam[0]?.startsWith("sl")) return null;
  for (const l of seznam) {
    if (l.startsWith("sl")) return null;
    if (l.startsWith("de")) return "de";
    if (l.startsWith("hr") || l.startsWith("bs") || l.startsWith("sr") || l.startsWith("me")) return "hr";
    if (l.startsWith("en")) return "en";
  }
  return seznam.length ? "en" : null;
}

export default function PredlogJezika({ jezik = "sl" }) {
  const [predlog, setPredlog] = useState(null);
  useEffect(() => {
    if (jezik !== "sl") return;
    try { if (localStorage.getItem(KLJUC)) return; } catch {}
    setPredlog(zeleniJezik());
  }, [jezik]);
  if (!predlog) return null;
  const b = BESEDILA[predlog];
  const zapri = () => {
    try { localStorage.setItem(KLJUC, "1"); } catch {}
    setPredlog(null);
  };
  const pot = potZJezikom(brezJezika(window.location.pathname) + window.location.search, predlog);
  return (
    <div className="predlog-jezika" lang={predlog} translate="no" role="region" aria-label={b.tx}>
      <span>{b.tx}</span>
      <a href={pot} onClick={() => { try { localStorage.setItem(KLJUC, "1"); } catch {} }}>{b.gumb} →</a>
      <button type="button" onClick={zapri}>{b.zapri}</button>
    </div>
  );
}

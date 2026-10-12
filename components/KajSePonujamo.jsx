"use client";

import { useEffect, useState } from "react";
import KarticeIzdelkov from "@/components/KarticeIzdelkov";

// "Kaj vse še ponujamo": ob vsakem obisku drugačen izbor izdelkov iz drugih skupin.
// Iz vsake skupine najprej po en izdelek, da stranka vidi širino programa.
const NAJVEC = 8;

function premesaj(seznam) {
  const a = [...seznam];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function izberi(izdelki) {
  // izdelki s sliko imajo prednost
  const zSliko = izdelki.filter((x) => x.slika_url);
  const bazen = premesaj(zSliko.length >= NAJVEC ? zSliko : izdelki);
  const poSkupinah = new Map();
  for (const x of bazen) {
    if (!poSkupinah.has(x.skupina)) poSkupinah.set(x.skupina, []);
    poSkupinah.get(x.skupina).push(x);
  }
  const skupine = premesaj([...poSkupinah.values()]);
  const out = [];
  while (out.length < NAJVEC && skupine.some((s) => s.length)) {
    for (const s of skupine) {
      if (s.length && out.length < NAJVEC) out.push(s.shift());
    }
  }
  return out;
}

export default function KajSePonujamo({ izdelki }) {
  const [izbor, setIzbor] = useState([]);

  useEffect(() => {
    if (!izdelki?.length) return;
    const t = setTimeout(() => setIzbor(izberi(izdelki)), 0);
    return () => clearTimeout(t);
  }, [izdelki]);

  return (
    <KarticeIzdelkov
      oznaka="Celoten program"
      naslov="Kaj vse še ponujamo"
      izdelki={izbor}
      vec={{ href: "/program", naziv: "Ves program" }}
    />
  );
}

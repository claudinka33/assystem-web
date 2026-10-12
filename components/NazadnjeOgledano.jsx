"use client";

import { useEffect, useState } from "react";
import KarticeIzdelkov from "@/components/KarticeIzdelkov";

// Izdelki, ki jih je obiskovalec že odprl. Shranjeno samo v njegovem brskalniku.
const KLJUC = "as_nazadnje_ogledano";
const NAJVEC_SHRANJENIH = 12;
const NAJVEC_PRIKAZANIH = 8;

function preberi() {
  try {
    const v = JSON.parse(window.localStorage.getItem(KLJUC) || "[]");
    return Array.isArray(v) ? v.filter((x) => x && x.slug && x.href && x.naziv) : [];
  } catch {
    return [];
  }
}

export default function NazadnjeOgledano({ trenutni }) {
  const [seznam, setSeznam] = useState([]);
  const slug = trenutni?.slug;

  useEffect(() => {
    if (!slug) return;
    const prej = preberi().filter((x) => x.slug !== slug);
    try {
      window.localStorage.setItem(KLJUC, JSON.stringify([trenutni, ...prej].slice(0, NAJVEC_SHRANJENIH)));
    } catch {}
    const t = setTimeout(() => setSeznam(prej.slice(0, NAJVEC_PRIKAZANIH)), 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return <KarticeIzdelkov oznaka="Vaš ogled" naslov="Nazadnje ogledano" izdelki={seznam} />;
}

"use client";

import { useState, useTransition } from "react";
import { preklopiZakljucenoPovprasevanje } from "@/lib/akcije/skupno";

// Kljukica odpre / zapre povpraševanje (vse v niti stranke).
export default function KljukicaZakljuceno({ ids, zakljuceno }) {
  const [st, setSt] = useState(zakljuceno);
  const [caka, zacni] = useTransition();
  return (
    <label className={`povp-zakl${st ? " on" : ""}`} onClick={(e) => e.stopPropagation()} title={st ? "Odkljukaj, da povpraševanje spet odpreš" : "Odkljukaj, ko je urejeno"}>
      <input
        type="checkbox"
        checked={st}
        disabled={caka}
        onChange={(e) => {
          const v = e.target.checked;
          setSt(v);
          zacni(async () => {
            const r = await preklopiZakljucenoPovprasevanje(ids, v);
            if (!r?.ok) setSt(!v);
          });
        }}
      />
      {st ? "Zaključeno" : "Odprto"}
    </label>
  );
}

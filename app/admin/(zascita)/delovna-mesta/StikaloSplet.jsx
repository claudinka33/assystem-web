"use client";

import { useState, useTransition } from "react";
import { preklopiDelovnoMesto } from "@/lib/akcije/skupno";

// Stikalo »Na spletu« — takoj prikaže ali skrije delovno mesto na strani Zaposlitev.
export default function StikaloSplet({ id, vidno }) {
  const [on, setOn] = useState(Boolean(vidno));
  const [caka, zacni] = useTransition();
  return (
    <label className="stikalo" style={{ marginTop: 0, fontSize: 12 }} title={on ? "Prikazano na spletni strani" : "Skrito na spletni strani"}>
      <input
        type="checkbox"
        checked={on}
        disabled={caka}
        onChange={(e) => {
          const v = e.target.checked;
          setOn(v);
          zacni(async () => {
            const r = await preklopiDelovnoMesto(id, v);
            if (!r?.ok) {
              setOn(!v);
              alert(`Ni shranjeno: ${r?.napaka ?? "napaka"}`);
            }
          });
        }}
      />
      <span className="stikalo-drsnik" />
      <span style={{ color: on ? "#1a7f3c" : "#6e7276", minWidth: 58 }}>{on ? "Na spletu" : "Skrito"}</span>
    </label>
  );
}

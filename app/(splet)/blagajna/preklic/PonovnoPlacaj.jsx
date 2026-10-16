"use client";

import { useState, useTransition } from "react";
import { ponovnoPlacaj } from "@/lib/akcije/narocila";

export default function PonovnoPlacaj({ stevilka }) {
  const [napaka, setNapaka] = useState("");
  const [cakam, zacni] = useTransition();
  return (
    <div style={{ marginTop: 20 }}>
      <button
        type="button"
        className="b b-r"
        disabled={cakam}
        onClick={() =>
          zacni(async () => {
            setNapaka("");
            const r = await ponovnoPlacaj(stevilka);
            if (r?.preusmeritev) window.location.href = r.preusmeritev;
            else setNapaka(r?.napaka ?? "Napaka.");
          })
        }
      >
        {cakam ? "Pripravljam plačilo …" : "Poskusi plačati znova"}
      </button>
      {napaka && <p className="blag-nap" style={{ marginTop: 10 }}>{napaka}</p>}
    </div>
  );
}

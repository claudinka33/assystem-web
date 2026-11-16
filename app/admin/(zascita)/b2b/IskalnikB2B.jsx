"use client";

import { useState } from "react";

const norm = (x) => String(x ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const FILTRI = [
  ["", "Vsi"],
  ["caka_odobritev", "Čaka na odobritev"],
  ["preverjanje", "Preverjanje"],
  ["aktiven", "Aktivni"],
  ["zavrnjen", "Zavrnjeni"],
  ["racuni", "Računi vklopljeni"],
];

// Iskanje in filtri nad seznamom podjetij (vrstice so izrisane na strežniku, tu jih samo skrivamo).
export default function IskalnikB2B({ skupaj, stevci }) {
  const [q, setQ] = useState("");
  const [f, setF] = useState("");
  const [vidnih, setVidnih] = useState(skupaj);

  function uporabi(nq, nf) {
    setQ(nq);
    setF(nf);
    const besede = norm(nq).split(/\s+/).filter(Boolean);
    let n = 0;
    document.querySelectorAll(".b2ba-podj").forEach((el) => {
      const ok =
        besede.every((b) => el.dataset.isk.includes(b)) &&
        (!nf || (nf === "racuni" ? el.dataset.racuni === "1" : el.dataset.status.split(" ").includes(nf)));
      el.hidden = !ok;
      if (ok) n++;
    });
    const ni = document.getElementById("b2ba-ni");
    if (ni) ni.hidden = n > 0;
    setVidnih(n);
  }

  return (
    <div className="b2ba-isk">
      <input
        type="search"
        value={q}
        onChange={(e) => uporabi(e.target.value, f)}
        placeholder="Išči po nazivu, davčni, šifri Vasco, naslovu, poslovalnici, e-naslovu, osebi …"
        autoFocus
      />
      <div className="b2ba-filtri">
        {FILTRI.map(([k, ime]) => {
          const st = k ? stevci[k] : skupaj;
          return (
            <button key={k} type="button" className={f === k ? "on" : ""} onClick={() => uporabi(q, k)}>
              {ime} <em>{st}</em>
            </button>
          );
        })}
      </div>
      <span className="adm-info">{vidnih} / {skupaj} podjetij</span>
    </div>
  );
}

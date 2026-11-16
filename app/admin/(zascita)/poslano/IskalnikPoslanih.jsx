"use client";

import { useState } from "react";

const norm = (x) => String(x ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export default function IskalnikPoslanih({ skupaj }) {
  const [q, setQ] = useState("");
  const [n, setN] = useState(skupaj);
  function isci(v) {
    setQ(v);
    const b = norm(v).split(/\s+/).filter(Boolean);
    let k = 0;
    document.querySelectorAll(".ps-sp").forEach((el) => {
      const ok = b.every((x) => el.dataset.isk.includes(x));
      el.hidden = !ok;
      if (ok) k++;
    });
    const ni = document.getElementById("ps-ni");
    if (ni) ni.hidden = k > 0;
    setN(k);
  }
  return (
    <div className="bz-orodja">
      <div className="bz-isk">
        <input type="search" value={q} onChange={(e) => isci(e.target.value)} autoComplete="off" placeholder="Išči po prejemniku, zadevi, stanju …" />
      </div>
      <span className="siv" style={{ alignSelf: "center", fontSize: 12 }}>{n} od {skupaj}</span>
    </div>
  );
}

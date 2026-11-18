"use client";

import { useEffect, useMemo, useRef, useState } from "react";

// Vsi spustni meniji v administraciji (z vsaj 6 možnostmi) dobijo iskalnik:
// klik na meni odpre okno z iskalnim poljem in seznamom, ki se filtrira med tipkanjem.
// Deluje na obstoječih <select> elementih, zato obrazcev ni treba spreminjati.
const MIN_MOZNOSTI = 6;
const norm = (s) => String(s ?? "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

function nastaviVrednost(sel, vrednost) {
  const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, "value").set;
  setter.call(sel, vrednost);
  sel.dispatchEvent(new Event("input", { bubbles: true }));
  sel.dispatchEvent(new Event("change", { bubbles: true }));
}

function primeren(el) {
  return (
    el instanceof HTMLSelectElement &&
    !el.multiple &&
    !el.disabled &&
    el.closest(".adm") &&
    !el.hasAttribute("data-brez-iskanja") &&
    el.options.length >= MIN_MOZNOSTI
  );
}

export default function IskalniSeznami() {
  const [odprt, setOdprt] = useState(null); // { sel, moznosti, poz }
  const [q, setQ] = useState("");
  const [akt, setAkt] = useState(0);
  const vnos = useRef(null);
  const seznam = useRef(null);

  useEffect(() => {
    const odpri = (sel) => {
      const r = sel.getBoundingClientRect();
      const moznosti = [...sel.options].map((o, i) => ({
        i,
        vrednost: o.value,
        besedilo: o.text,
        skupina: o.parentElement instanceof HTMLOptGroupElement ? o.parentElement.label : "",
        onemogocena: o.disabled,
        izbrana: o.selected,
      }));
      const spodaj = window.innerHeight - r.bottom;
      setOdprt({
        sel,
        moznosti,
        poz: { left: r.left, width: Math.max(r.width, 260), top: spodaj > 300 ? r.bottom + 4 : null, bottom: spodaj > 300 ? null : window.innerHeight - r.top + 4 },
      });
      setQ("");
      setAkt(Math.max(0, moznosti.findIndex((m) => m.izbrana)));
    };
    const naKlik = (e) => {
      const sel = e.target instanceof HTMLOptionElement ? e.target.parentElement : e.target;
      if (!primeren(sel)) return;
      e.preventDefault();
      sel.focus();
      odpri(sel);
    };
    const naTipko = (e) => {
      const sel = e.target;
      if (!primeren(sel)) return;
      if (e.key === "Enter" || e.key === " " || (e.altKey && e.key === "ArrowDown")) {
        e.preventDefault();
        odpri(sel);
      }
    };
    document.addEventListener("mousedown", naKlik, true);
    document.addEventListener("keydown", naTipko, true);
    return () => {
      document.removeEventListener("mousedown", naKlik, true);
      document.removeEventListener("keydown", naTipko, true);
    };
  }, []);

  useEffect(() => {
    if (!odprt) return;
    vnos.current?.focus();
    const zapri = (e) => {
      if (e.target.closest?.(".isk-okno")) return;
      setOdprt(null);
    };
    const ob = () => setOdprt(null);
    document.addEventListener("mousedown", zapri);
    window.addEventListener("resize", ob);
    return () => {
      document.removeEventListener("mousedown", zapri);
      window.removeEventListener("resize", ob);
    };
  }, [odprt]);

  const vidne = useMemo(() => {
    if (!odprt) return [];
    const besede = norm(q).split(/\s+/).filter(Boolean);
    return odprt.moznosti.filter((m) => {
      const t = norm(`${m.besedilo} ${m.skupina} ${m.vrednost}`);
      return besede.every((b) => t.includes(b));
    });
  }, [odprt, q]);

  useEffect(() => {
    seznam.current?.querySelector(".isk-akt")?.scrollIntoView({ block: "nearest" });
  }, [akt, vidne]);

  if (!odprt) return null;

  const izberi = (m) => {
    if (!m || m.onemogocena) return;
    nastaviVrednost(odprt.sel, m.vrednost);
    const sel = odprt.sel;
    setOdprt(null);
    sel.focus();
  };

  return (
    <div className="isk-okno" style={{ left: odprt.poz.left, width: odprt.poz.width, top: odprt.poz.top ?? "auto", bottom: odprt.poz.bottom ?? "auto" }}>
      <input
        ref={vnos}
        type="search"
        placeholder="Išči …"
        value={q}
        onChange={(e) => { setQ(e.target.value); setAkt(0); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setAkt((a) => Math.min(vidne.length - 1, a + 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setAkt((a) => Math.max(0, a - 1)); }
          else if (e.key === "Enter") { e.preventDefault(); izberi(vidne[akt]); }
          else if (e.key === "Escape") { e.preventDefault(); const s = odprt.sel; setOdprt(null); s.focus(); }
        }}
      />
      <ul ref={seznam}>
        {vidne.map((m, k) => (
          <li
            key={m.i}
            className={`${k === akt ? "isk-akt" : ""}${m.izbrana ? " isk-izb" : ""}${m.onemogocena ? " isk-ne" : ""}`}
            onMouseEnter={() => setAkt(k)}
            onMouseDown={(e) => { e.preventDefault(); izberi(m); }}
          >
            {m.besedilo || "—"}
            {m.skupina && <small>{m.skupina}</small>}
          </li>
        ))}
        {vidne.length === 0 && <li className="isk-ne">Ni zadetkov</li>}
      </ul>
    </div>
  );
}

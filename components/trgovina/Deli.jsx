"use client";

import { useState, useTransition } from "react";
import { eur, zaokrozi, POSTNINA_RAZREDI } from "@/lib/cene";
import { preveriKodo } from "@/lib/akcije/narocila";

const BREZPLACNO_NAD = POSTNINA_RAZREDI[POSTNINA_RAZREDI.length - 1].do;

// ---------- ikone (enoten slog, 20 px, črta 1.8) ----------
const pot = {
  tovornjak: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM17 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
  trgovina: "M4 9l1.5-5h13L20 9M4 9v11h16V9M4 9h16M9 20v-6h6v6",
  kartica: "M3 6h18v12H3zM3 10h18M7 15h4",
  paypal: "M8 20l1.2-7h3.6c3 0 5-1.6 5.4-4.5C18.6 5.6 16.8 4 14 4H8.6L6 20zM9.2 13l1-5.5",
  banka: "M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18",
  denar: "M3 7h18v10H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 10v4M18 10v4",
  racun: "M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7",
  scit: "M12 3l8 3v5c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6z M8.5 12l2.5 2.5 4.5-5",
  skatla: "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  tovarna: "M3 21V10l6 3V9l6 3V5h4v16zM7 17h2M12 17h2",
  vozicek: "M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h9.7a1 1 0 0 0 1-.8L21 8H6M9 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM18 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
};
export function Ikona({ ime, velikost = 20 }) {
  return (
    <svg width={velikost} height={velikost} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={pot[ime]} />
    </svg>
  );
}

export function Koraki({ korak }) {
  const k = [
    ["Košarica", 1],
    ["Podatki in plačilo", 2],
    ["Potrditev", 3],
  ];
  return (
    <ol className="trg-koraki" aria-label="Koraki nakupa">
      {k.map(([ime, n]) => (
        <li key={n} className={n === korak ? "on" : n < korak ? "ok" : ""} aria-current={n === korak ? "step" : undefined}>
          <i>{n < korak ? "✓" : n}</i>
          <span>{ime}</span>
        </li>
      ))}
    </ol>
  );
}

export function Zaupanje() {
  return (
    <>
      <ul className="trg-zaupanje">
        <li><Ikona ime="scit" velikost={17} /> Varno plačilo — podatkov o kartici ne vidimo in ne hranimo</li>
        <li><Ikona ime="tovornjak" velikost={17} /> Odprema v 1–2 delovnih dneh s Pošto Slovenije</li>
        <li><Ikona ime="tovarna" velikost={17} /> Kupujete neposredno pri proizvajalcu, od 1993</li>
      </ul>
      <div className="trg-placila" aria-label="Načini plačila">
        {["VISA", "Mastercard", "Maestro", "AMEX", "Apple Pay", "Google Pay", "PayPal", "Predračun"].map((x) => (
          <span key={x}>{x}</span>
        ))}
      </div>
    </>
  );
}

// Trak »še X € do brezplačne dostave«
export function BrezplacnaDostava({ bruto }) {
  const manjka = zaokrozi(BREZPLACNO_NAD - bruto);
  const delez = Math.min(100, Math.round((bruto / BREZPLACNO_NAD) * 100));
  if (manjka <= 0)
    return (
      <div className="trg-dost ok">
        <b>Dostava je brezplačna.</b>
        <div className="trg-dost-p"><i style={{ width: "100%" }} /></div>
      </div>
    );
  return (
    <div className="trg-dost">
      Še <b>{eur(manjka)}</b> do brezplačne dostave.
      <div className="trg-dost-p"><i style={{ width: `${delez}%` }} /></div>
    </div>
  );
}

// Polje za kodo: predogled na strežniku; uporabljena koda gre z naročilom (strežnik jo ponovno preveri).
export function KodaPopust({ postavke, koda, setKoda }) {
  const [odprto, setOdprto] = useState(false);
  const [vnos, setVnos] = useState("");
  const [napaka, setNapaka] = useState("");
  const [cakam, zacni] = useTransition();
  if (koda)
    return (
      <div className="trg-koda-ok">
        <span>Koda <b>{koda.koda}</b> — {koda.opis}</span>
        <button type="button" onClick={() => setKoda(null)}>odstrani</button>
      </div>
    );
  if (!odprto)
    return (
      <div style={{ margin: "2px 0 8px" }}>
        <button type="button" className="trg-link" onClick={() => setOdprto(true)}>Imate kodo za popust?</button>
      </div>
    );
  function uporabi() {
    setNapaka("");
    zacni(async () => {
      const r = await preveriKodo(vnos, postavke);
      if (r?.napaka) setNapaka(r.napaka);
      else setKoda(r);
    });
  }
  return (
    <>
      <div className="trg-koda">
        <input
          value={vnos}
          onChange={(e) => setVnos(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              uporabi();
            }
          }}
          placeholder="Koda za popust"
          aria-label="Koda za popust"
          autoFocus
        />
        <button type="button" onClick={uporabi} disabled={cakam || !vnos.trim()}>{cakam ? "…" : "Uporabi"}</button>
      </div>
      {napaka && <div className="bl-nap" style={{ marginTop: -4, marginBottom: 8 }}>{napaka}</div>}
    </>
  );
}

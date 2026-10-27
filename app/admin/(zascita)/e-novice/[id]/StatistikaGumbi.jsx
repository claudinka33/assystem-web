"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { osveziStatistikoKampanje, ponovnoNeodprtim, istimPrejemnikom } from "@/lib/akcije/enovice-kampanje";

// Osveži statistiko iz Resenda (samodejno ob odprtju, če je stara) + akcije.
export function OsveziStatistiko({ id, samodejno, statistikaOb }) {
  const router = useRouter();
  const [caka, zacni] = useTransition();
  const [napaka, setNapaka] = useState(null);
  const enkrat = useRef(false);

  const osvezi = () =>
    zacni(async () => {
      setNapaka(null);
      const r = await osveziStatistikoKampanje(id);
      if (!r.ok) setNapaka(r.napaka);
      else router.refresh();
    });

  useEffect(() => {
    if (samodejno && !enkrat.current) {
      enkrat.current = true;
      osvezi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [samodejno]);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", fontSize: 12.5, color: "#6e767e" }}>
      <button type="button" className="gumb siv mini" onClick={osvezi} disabled={caka}>
        {caka ? "Osvežujem …" : "↻ Osveži statistiko"}
      </button>
      {statistikaOb && !caka && (
        <span>
          Stanje:{" "}
          {new Date(statistikaOb).toLocaleString("sl-SI", { dateStyle: "short", timeStyle: "short" })}
        </span>
      )}
      {napaka && <span style={{ color: "#cb2026" }}>{napaka}</span>}
    </div>
  );
}

export function PonovnoNeodprtim({ id, stevilo }) {
  const router = useRouter();
  const [caka, zacni] = useTransition();
  const [napaka, setNapaka] = useState(null);

  const klik = () => {
    if (
      !window.confirm(
        `Naredim nov osnutek, ki gre samo ${stevilo ?? "tistim"} prejemnikom, ki maila niso odprli?\n\nV Resendu se ustvari nov segment »Niso odprli …«. Zadevo lahko pred pošiljanjem spremeniš.`
      )
    )
      return;
    zacni(async () => {
      setNapaka(null);
      const r = await ponovnoNeodprtim(id);
      if (!r.ok) setNapaka(r.napaka);
      else router.push(`/admin/e-novice/${r.id}`);
    });
  };

  return (
    <>
      <button type="button" className="gumb" onClick={klik} disabled={caka} style={{ width: "100%" }}>
        {caka ? "Pripravljam …" : `Pošlji ponovno neodprtim${stevilo ? ` (${stevilo})` : ""}`}
      </button>
      {napaka && (
        <div className="opozorilo" style={{ margin: "8px 0", padding: "8px 12px", fontSize: 13 }}>
          {napaka}
        </div>
      )}
    </>
  );
}

export function IstimPrejemnikom({ id, stevilo }) {
  const router = useRouter();
  const [caka, zacni] = useTransition();
  const [napaka, setNapaka] = useState(null);

  const klik = () => {
    if (
      !window.confirm(
        `Naredim nov prazen osnutek za iste prejemnike${stevilo ? ` (${stevilo})` : ""} – brez odbitih, odjavljenih in prijav spama?\n\nV Resendu se ustvari nov segment. V osnutek nato prilepiš novo HTML kodo.`
      )
    )
      return;
    zacni(async () => {
      setNapaka(null);
      const r = await istimPrejemnikom(id);
      if (!r.ok) setNapaka(r.napaka);
      else router.push(`/admin/e-novice/${r.id}`);
    });
  };

  return (
    <>
      <button type="button" className="gumb siv" onClick={klik} disabled={caka} style={{ width: "100%", marginTop: 8 }}>
        {caka ? "Pripravljam …" : `Nov mailing istim prejemnikom${stevilo ? ` (${stevilo})` : ""}`}
      </button>
      {napaka && (
        <div className="opozorilo" style={{ margin: "8px 0", padding: "8px 12px", fontSize: 13 }}>
          {napaka}
        </div>
      )}
    </>
  );
}

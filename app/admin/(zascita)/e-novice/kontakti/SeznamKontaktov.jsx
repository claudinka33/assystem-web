"use client";

import { useMemo, useState } from "react";
import { nastaviPanoge, spremeniPrijavo, izbrisiKontakt } from "@/lib/akcije/enovice-kontakti";

const sivo = "#6e767e";
const polje = { padding: "9px 11px", border: "1px solid #c6cace", borderRadius: 6, fontSize: 14 };

function Stevec({ n, naziv, on, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: `1px solid ${on ? "#C8102E" : "#e3e5e8"}`,
        background: on ? "#C8102E" : "#fff",
        color: on ? "#fff" : "inherit",
        borderRadius: 20,
        padding: "6px 14px",
        fontSize: 13.5,
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {naziv} <span style={{ opacity: 0.75 }}>{n}</span>
    </button>
  );
}

export default function SeznamKontaktov({ kontakti, panoge }) {
  const [iskanje, setIskanje] = useState("");
  const [status, setStatus] = useState("vsi");
  const [panoga, setPanoga] = useState("");
  const imePanoge = Object.fromEntries(panoge.map((p) => [p.id, p.ime]));

  const vrstice = useMemo(() => {
    const q = iskanje.trim().toLowerCase();
    return kontakti
      .filter((k) => (status === "prijavljeni" ? !k.odjavljen : status === "odjavljeni" ? k.odjavljen : true))
      .filter((k) => (panoga === "__brez__" ? k.panoge.length === 0 : panoga ? k.panoge.includes(panoga) : true))
      .filter((k) => !q || k.email.includes(q) || k.ime.toLowerCase().includes(q))
      .sort((a, b) => String(b.dodan).localeCompare(String(a.dodan)));
  }, [kontakti, iskanje, status, panoga]);

  const prijavljeni = kontakti.filter((k) => !k.odjavljen).length;
  const brezPanoge = kontakti.filter((k) => k.panoge.length === 0).length;

  function izvozi() {
    const vr = [["email", "ime", "status", "panoge", "dodan"], ...vrstice.map((k) => [k.email, k.ime, k.odjavljen ? "odjavljen" : "prijavljen", k.panoge.map((p) => imePanoge[p]).join(" | "), k.dodan?.slice(0, 10) ?? ""])];
    const csv = "﻿" + vr.map((r) => r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(";")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    a.download = "e-novice-kontakti.csv";
    a.click();
  }

  return (
    <>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <Stevec n={kontakti.length} naziv="Vsi" on={status === "vsi"} onClick={() => setStatus("vsi")} />
        <Stevec n={prijavljeni} naziv="Prijavljeni" on={status === "prijavljeni"} onClick={() => setStatus("prijavljeni")} />
        <Stevec n={kontakti.length - prijavljeni} naziv="Odjavljeni" on={status === "odjavljeni"} onClick={() => setStatus("odjavljeni")} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16, alignItems: "center" }}>
        <input value={iskanje} onChange={(e) => setIskanje(e.target.value)} placeholder="Išči po e-naslovu ali imenu …" style={{ ...polje, flex: "1 1 260px" }} />
        <select value={panoga} onChange={(e) => setPanoga(e.target.value)} style={{ ...polje, flex: "0 1 260px" }}>
          <option value="">Vse panoge</option>
          {panoge.map((p) => (
            <option key={p.id} value={p.id}>
              {p.ime} ({kontakti.filter((k) => k.panoge.includes(p.id)).length})
            </option>
          ))}
          <option value="__brez__">Brez panoge ({brezPanoge})</option>
        </select>
        <button type="button" className="gumb siv" onClick={izvozi}>
          Izvozi CSV ({vrstice.length})
        </button>
      </div>

      <table className="adm-tab">
        <thead>
          <tr>
            <th>E-naslov</th>
            <th>Ime</th>
            <th>Panoge</th>
            <th>Status</th>
            <th style={{ textAlign: "right" }}>Dejanja</th>
          </tr>
        </thead>
        <tbody>
          {vrstice.length === 0 && (
            <tr>
              <td colSpan={5} style={{ color: sivo }}>Ni kontaktov za ta izbor.</td>
            </tr>
          )}
          {vrstice.slice(0, 500).map((k) => (
            <tr key={k.email} style={k.odjavljen ? { opacity: 0.6 } : undefined}>
              <td style={{ fontWeight: 600 }}>{k.email}</td>
              <td>{k.ime || <span style={{ color: "#9aa0a6" }}>—</span>}</td>
              <td>
                <details>
                  <summary style={{ cursor: "pointer", listStyle: "none", display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {k.panoge.length ? (
                      k.panoge.map((p) => (
                        <span key={p} className="znacka ne" style={{ whiteSpace: "nowrap" }}>
                          {imePanoge[p] ?? "?"}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: "#C8102E", fontSize: 13 }}>+ dodaj panogo</span>
                    )}
                    <span style={{ fontSize: 12, color: sivo }}>✎</span>
                  </summary>
                  <form action={nastaviPanoge} style={{ marginTop: 8, padding: 10, background: "#f6f7f8", borderRadius: 8 }}>
                    <input type="hidden" name="email" value={k.email} />
                    <input type="hidden" name="prej" value={k.panoge.join(",")} />
                    {panoge.map((p) => (
                      <label key={p.id} style={{ display: "flex", gap: 6, alignItems: "center", fontSize: 13.5, fontWeight: 400, padding: "2px 0" }}>
                        <input type="checkbox" name="panoge" value={p.id} defaultChecked={k.panoge.includes(p.id)} style={{ width: "auto", margin: 0 }} /> {p.ime}
                      </label>
                    ))}
                    <button className="gumb mini" type="submit" style={{ marginTop: 8 }}>
                      Shrani panoge
                    </button>
                  </form>
                </details>
              </td>
              <td>
                {k.odjavljen ? <span className="znacka novo">odjavljen</span> : <span className="znacka" style={{ background: "#eaf6ee", color: "#1e7a3c" }}>prijavljen</span>}
              </td>
              <td style={{ whiteSpace: "nowrap", textAlign: "right" }}>
                <form action={spremeniPrijavo} style={{ display: "inline" }}>
                  <input type="hidden" name="email" value={k.email} />
                  <input type="hidden" name="akcija" value={k.odjavljen ? "prijavi" : "odjavi"} />
                  <button className="gumb siv mini" type="submit">
                    {k.odjavljen ? "Ponovno prijavi" : "Odjavi"}
                  </button>
                </form>{" "}
                <form
                  action={izbrisiKontakt}
                  style={{ display: "inline" }}
                  onSubmit={(e) => {
                    if (!confirm(`Izbrišem kontakt ${k.email}? Tega ni mogoče razveljaviti.`)) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="email" value={k.email} />
                  <button className="gumb siv mini" type="submit">
                    Izbriši
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {vrstice.length > 500 && <p style={{ color: sivo, fontSize: 13 }}>Prikazanih je prvih 500 — zoži iskanje.</p>}
    </>
  );
}

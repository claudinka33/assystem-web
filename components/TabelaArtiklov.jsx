"use client";

import { useMemo, useState } from "react";

// Tabela artiklov na strani izdelka: iskanje, filtri po lastnostih
// (material, trdnost, pakiranje ...) in postopen prikaz pri dolgih seznamih.
const KORAK = 80;

function Zaloga({ vrednost }) {
  if (vrednost === null || vrednost === undefined) return "—";
  return vrednost > 0 ? (
    <span style={{ color: "#1a7f3c", fontWeight: 700 }}>Na zalogi</span>
  ) : (
    <span style={{ color: "var(--color-muted)" }}>Po naročilu</span>
  );
}

function pakiranje(a) {
  if (a.pakiranje) return `${a.pakiranje} ${a.enota && a.enota !== "kos" ? a.enota : "kos"}`;
  if (a.enota && a.enota !== "kos") return a.enota;
  return "—";
}

export default function TabelaArtiklov({ artikli, stolpci, naziviRazlicni }) {
  const [iskanje, setIskanje] = useState("");
  const [izbrani, setIzbrani] = useState({});
  const [prikazano, setPrikazano] = useState(KORAK);

  // Filtri samo za lastnosti z nekaj vrednostmi (2–10)
  const filtri = useMemo(
    () =>
      stolpci
        .map((k) => {
          const vrednosti = [...new Set(artikli.map((a) => (a.lastnosti ?? {})[k]).filter(Boolean))];
          return [k, vrednosti.sort((x, y) => String(x).localeCompare(String(y), "sl", { numeric: true }))];
        })
        .filter(([, v]) => v.length >= 2 && v.length <= 10),
    [artikli, stolpci]
  );

  const vidni = useMemo(() => {
    const q = iskanje.trim().toLowerCase().replace(/\s+/g, "");
    return artikli.filter((a) => {
      for (const [k, v] of Object.entries(izbrani)) {
        if (v && (a.lastnosti ?? {})[k] !== v) return false;
      }
      if (!q) return true;
      const niz = `${a.sifra} ${a.dimenzija ?? ""} ${a.ean ?? ""}`.toLowerCase().replace(/\s+/g, "");
      return niz.includes(q);
    });
  }, [artikli, izbrani, iskanje]);

  const dolg = artikli.length > 20;
  const prikaz = vidni.slice(0, prikazano);

  return (
    <>
      {dolg && (
        <div className="izd-filtri">
          <input
            type="search"
            placeholder="Išči po dimenziji ali šifri, npr. M8x40"
            value={iskanje}
            onChange={(e) => {
              setIskanje(e.target.value);
              setPrikazano(KORAK);
            }}
          />
          {filtri.map(([k, vrednosti]) => (
            <div key={k} className="izd-filter">
              <em>{k}</em>
              <button
                type="button"
                className={!izbrani[k] ? "on" : ""}
                onClick={() => setIzbrani({ ...izbrani, [k]: undefined })}
              >
                vse
              </button>
              {vrednosti.map((v) => (
                <button
                  key={v}
                  type="button"
                  className={izbrani[k] === v ? "on" : ""}
                  onClick={() => {
                    setIzbrani({ ...izbrani, [k]: izbrani[k] === v ? undefined : v });
                    setPrikazano(KORAK);
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          ))}
          {vidni.length !== artikli.length && (
            <span className="izd-stevec">
              Prikazanih {vidni.length} od {artikli.length}
            </span>
          )}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>Šifra</th>
              {naziviRazlicni && <th>Naziv</th>}
              <th>Dimenzija</th>
              {stolpci.map((k) => (
                <th key={k}>{k}</th>
              ))}
              <th>EAN</th>
              <th>Pakiranje</th>
              <th>Zaloga</th>
            </tr>
          </thead>
          <tbody>
            {prikaz.map((a) => (
              <tr key={a.id}>
                <td>
                  <b>{a.sifra}</b>
                </td>
                {naziviRazlicni && <td>{a.naziv}</td>}
                <td>{a.dimenzija ?? "—"}</td>
                {stolpci.map((k) => (
                  <td key={k}>{(a.lastnosti ?? {})[k] ?? "—"}</td>
                ))}
                <td className="izd-siv">{a.ean ?? "—"}</td>
                <td>{pakiranje(a)}</td>
                <td>
                  <Zaloga vrednost={a.zaloga} />
                </td>
              </tr>
            ))}
            {prikaz.length === 0 && (
              <tr>
                <td colSpan={20} className="izd-siv">
                  Ni zadetkov za izbrane filtre.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {vidni.length > prikazano && (
        <button type="button" className="izd-vec" onClick={() => setPrikazano(prikazano + KORAK * 3)}>
          Prikaži več ({vidni.length - prikazano} še)
        </button>
      )}
    </>
  );
}

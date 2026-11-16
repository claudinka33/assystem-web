"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

// Brez šumnikov in velikih črk, da »vijak sumnik« najde »Vijak šumnik«.
const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");

export default function SeznamIzdelkov({ seznam }) {
  const [q, setQ] = useState("");
  const pripravljen = useMemo(
    () => seznam.map((i) => ({ ...i, _b: norm(i.besedilo), _a: i.artikli.map((a) => ({ raw: a, n: norm(a) })) })),
    [seznam]
  );

  const kljuc = norm(q).trim();
  const zadetki = useMemo(() => {
    const besede = kljuc.split(/\s+/).filter(Boolean);
    if (!besede.length) return pripravljen.map((i) => ({ i, art: [] }));
    const out = [];
    for (const i of pripravljen) {
      // beseda se lahko ujema z izdelkom ali s katerim koli artiklom
      const art = i._a.filter((a) => besede.some((b) => a.n.includes(b)));
      const ok = besede.every((b) => i._b.includes(b) || art.some((a) => a.n.includes(b)));
      if (ok) out.push({ i, art: art.filter((a) => besede.every((b) => a.n.includes(b) || i._b.includes(b))) });
    }
    return out;
  }, [pripravljen, kljuc]);

  return (
    <>
      <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
        <input
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Išči po šifri, EAN, nazivu, kategoriji, znamki, dimenziji … (npr. »TXH7 10x100« ali »3830«)"
          style={{ maxWidth: 560 }}
        />
        <span className="adm-info">
          {kljuc ? `${zadetki.length} od ${seznam.length} izdelkov` : `${seznam.length} izdelkov`}
        </span>
      </div>
      {zadetki.length === 0 ? (
        <div className="opozorilo">Ni zadetkov za »{q}«.</div>
      ) : (
        <table className="adm-tab">
          <thead>
            <tr>
              <th style={{ width: 48 }}>Slika</th>
              <th>Naziv</th>
              <th>Kategorija</th>
              <th style={{ width: 100 }}>Znamka</th>
              <th style={{ width: 70 }}>Artiklov</th>
              <th style={{ width: 90 }}>Stanje</th>
              <th style={{ width: 70 }}></th>
            </tr>
          </thead>
          <tbody>
            {zadetki.map(({ i, art }) => (
              <tr key={i.id}>
                <td>{i.slika ? <img src={i.slika} alt="" /> : <span style={{ color: "#ccd2d8" }}>—</span>}</td>
                <td>
                  <Link href={`/admin/izdelki/${i.id}`} style={{ color: "inherit" }}>
                    <b>{i.naziv}</b>
                  </Link>
                  <div style={{ fontSize: 11, color: "#6e767e" }}>{i.slug}</div>
                  {art.length > 0 && (
                    <div style={{ fontSize: 11, color: "#3f4140", marginTop: 2 }}>
                      {art.slice(0, 4).map((a) => {
                        const [sifra, ean, naziv] = a.raw.split("|");
                        return (
                          <div key={a.raw}>
                            <b style={{ color: "#cb2026" }}>{sifra}</b> {naziv}
                            {ean && <span style={{ color: "#6e767e" }}> · EAN {ean}</span>}
                          </div>
                        );
                      })}
                      {art.length > 4 && <span style={{ color: "#6e767e" }}>+ še {art.length - 4} artiklov</span>}
                    </div>
                  )}
                </td>
                <td style={{ color: "#6e767e" }}>{i.kategorija}</td>
                <td>{i.znamka}</td>
                <td>{i.stArtiklov}</td>
                <td>
                  <span className={i.objavljeno ? "znacka da" : "znacka ne"}>{i.objavljeno ? "Objavljeno" : "Skrito"}</span>
                </td>
                <td style={{ textAlign: "right" }}>
                  <Link className="gumb siv mini" href={`/admin/izdelki/${i.id}`}>
                    Uredi
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

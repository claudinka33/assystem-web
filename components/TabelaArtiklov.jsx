"use client";

import Image from "next/image";
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

// Vrstni red vrednosti: najprej ZnB, nato črn, inox A2, inox A4, vroče cinkano, medenina
const VRSTNI_RED = {
  Material: ["ZnB", "ZnR", "črn", "črn (brez zaščite)", "INOX A2", "INOX A4", "vroče cinkano", "vroče cinkano (HDG)", "medenina", "poliamid"],
  Pakiranje: ["škatla", "osnovno", "razsuto (cena/100 kos)", "vrečka", "blister", "mala škatla", "pakirano"],
};
function rang(k, v) {
  const r = (VRSTNI_RED[k] ?? []).indexOf(v);
  return r === -1 ? 99 : r;
}
function primerjaj(k) {
  return (x, y) => rang(k, x) - rang(k, y) || String(x).localeCompare(String(y), "sl", { numeric: true });
}

// Privzeta legenda pakiranj (velja za vse izdelke, izdelek jo lahko dopolni s poljem "embalaza")
const PRIVZETA_EMBALAZA = [
  { lastnost: "Pakiranje", vrednost: "škatla", naziv: "Škatla", opis: "Originalno pakiranje za podjetja in serviserje. Število kosov v škatli je v stolpcu »Kos v pak.«.", slika: "/slike/embalaza/ASco_skatla.png" },
  { lastnost: "Pakiranje", vrednost: "vrečka", naziv: "Vrečka", opis: "Maloprodajna vrečka z eurolukno za obešanje na prodajno stojalo.", slika: "/slike/embalaza/ASco_vrecka_modra.png" },
  { lastnost: "Pakiranje", vrednost: "blister", naziv: "Blister", opis: "Maloprodajno pakiranje v blistru za obešanje na stojalo." },
  { lastnost: "Pakiranje", vrednost: "mala škatla", naziv: "Mala škatla", opis: "Manjša škatla z nekaj deset kosi za trgovine." },
];

function Legenda({ vnosi, artikli, izbrani, izberi }) {
  const prisotni = vnosi
    .map((e) => ({ ...e, n: artikli.filter((a) => (a.lastnosti ?? {})[e.lastnost] === e.vrednost).length }))
    .filter((e) => e.n > 0);
  if (!prisotni.length) return null;
  return (
    <div className="izd-emb">
      <p className="izd-mali">Pakiranje — klikni za prikaz artiklov</p>
      <div className="izd-emb-k">
        {prisotni.map((e) => {
          const on = izbrani[e.lastnost] === e.vrednost;
          return (
            <button key={e.lastnost + e.vrednost} type="button" className={on ? "on" : ""} onClick={() => izberi(e.lastnost, on ? undefined : e.vrednost)}>
              <span className="izd-emb-sl">
                {e.slika ? <Image src={e.slika} alt={e.naziv} fill sizes="90px" style={{ objectFit: "contain", padding: 4 }} /> : <span className="izd-emb-ni">{e.naziv.slice(0, 1)}</span>}
              </span>
              <span className="izd-emb-tx">
                <b>{e.naziv}</b>
                <em>{e.n} {e.n === 1 ? "artikel" : e.n < 5 ? "artikli" : "artiklov"}</em>
                {e.opis && <span>{e.opis}</span>}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function TabelaArtiklov({ artikli: vhodni, stolpci, naziviRazlicni, embalaza = [] }) {
  const artikli = useMemo(
    () =>
      [...vhodni].sort((a, b) => {
        const la = a.lastnosti ?? {}, lb = b.lastnosti ?? {};
        return (
          rang("Material", la.Material) - rang("Material", lb.Material) ||
          (a.premer ?? 0) - (b.premer ?? 0) ||
          (a.dolzina ?? 0) - (b.dolzina ?? 0) ||
          rang("Pakiranje", la.Pakiranje) - rang("Pakiranje", lb.Pakiranje)
        );
      }),
    [vhodni]
  );
  const [iskanje, setIskanje] = useState("");
  const [izbrani, setIzbrani] = useState({});
  const [prikazano, setPrikazano] = useState(KORAK);

  // Legenda: najprej posebnosti izdelka (npr. škatla AFR41), nato privzeta pakiranja
  const vnosiLegende = useMemo(() => {
    const vsi = [...(Array.isArray(embalaza) ? embalaza : []), ...PRIVZETA_EMBALAZA];
    const videni = new Set();
    return vsi.filter((e) => {
      const k = e.lastnost + "|" + e.vrednost;
      if (videni.has(k)) return false;
      videni.add(k);
      return true;
    });
  }, [embalaza]);
  const kljuciLegende = useMemo(() => {
    const s = new Set();
    for (const e of vnosiLegende) if (artikli.some((a) => (a.lastnosti ?? {})[e.lastnost] === e.vrednost)) s.add(e.lastnost);
    return s;
  }, [vnosiLegende, artikli]);
  const izberi = (k, v) => {
    setIzbrani((prej) => ({ ...prej, [k]: v }));
    setPrikazano(KORAK);
  };

  // Filtri samo za lastnosti z nekaj vrednostmi (2–10)
  const filtri = useMemo(
    () =>
      stolpci
        .map((k) => {
          const vrednosti = [...new Set(artikli.map((a) => (a.lastnosti ?? {})[k]).filter(Boolean))];
          return [k, vrednosti.sort(primerjaj(k))];
        })
        .filter(([k, v]) => v.length >= 2 && v.length <= 10 && !kljuciLegende.has(k)),
    [artikli, stolpci, kljuciLegende]
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
      <Legenda vnosi={vnosiLegende} artikli={artikli} izbrani={izbrani} izberi={izberi} />

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
              <th>{stolpci.includes("Pakiranje") ? "Kos v pak." : "Pakiranje"}</th>
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

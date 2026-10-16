"use client";

import { useState, useTransition } from "react";
import { shraniVideeIzdelka } from "@/lib/akcije/skupno";

// Iz YouTube povezave izlušči ID (watch?v=, youtu.be/, shorts/, embed/).
export function youtubeId(vnos) {
  const s = String(vnos ?? "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function VideiIzdelka({ izdelekId, zacetni }) {
  const [videi, setVidei] = useState(zacetni ?? []);
  const [povezava, setPovezava] = useState("");
  const [naslov, setNaslov] = useState("");
  const [samodejno, setSamodejno] = useState(false);
  const [sporocilo, setSporocilo] = useState("");
  const [, zacni] = useTransition();

  function shrani(novi) {
    setVidei(novi);
    zacni(async () => {
      const r = await shraniVideeIzdelka(izdelekId, novi);
      setSporocilo(r?.napaka ? `Napaka: ${r.napaka}` : "✓ Shranjeno — velja tudi na spletni strani.");
    });
  }

  function dodaj() {
    const id = youtubeId(povezava);
    if (!id) return setSporocilo("To ni veljavna YouTube povezava.");
    shrani([...videi.filter((v) => v.id !== id), { id, naslov: naslov.trim(), samodejno }]);
    setPovezava("");
    setNaslov("");
    setSamodejno(false);
  }

  const predogled = youtubeId(povezava);

  return (
    <div className="adm-obr" style={{ maxWidth: "none" }}>
      {videi.length > 0 && (
        <div className="video-seznam">
          {videi.map((v, i) => (
            <div key={v.id} className="video-el">
              <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" />
              <div className="video-podatki">
                <b>{v.naslov || "Brez naslova"}</b>
                <a href={`https://youtu.be/${v.id}`} target="_blank" rel="noreferrer">youtu.be/{v.id} ↗</a>
                <label>
                  <input
                    type="checkbox"
                    checked={!!v.samodejno}
                    onChange={(e) => shrani(videi.map((x, j) => (j === i ? { ...x, samodejno: e.target.checked } : x)))}
                  />
                  Predvajaj takoj (brez zvoka)
                </label>
                {i === 0 && <span className="znacka da" style={{ alignSelf: "flex-start" }}>Prikazan na strani izdelka</span>}
              </div>
              <div className="video-gumbi">
                {i > 0 && (
                  <button type="button" className="gumb siv mini" onClick={() => shrani([v, ...videi.filter((_, j) => j !== i)])}>
                    Postavi na prvo mesto
                  </button>
                )}
                <button
                  type="button"
                  className="gumb siv mini"
                  onClick={() => confirm("Odstranim video?") && shrani(videi.filter((_, j) => j !== i))}
                >
                  Odstrani
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label>YouTube povezava</label>
          <input type="text" value={povezava} onChange={(e) => setPovezava(e.target.value)} placeholder="https://www.youtube.com/watch?v=…" />
        </div>
        <div className="adm-polje">
          <label>Naslov videa</label>
          <input type="text" value={naslov} onChange={(e) => setNaslov(e.target.value)} placeholder="npr. Vgradnja sidra TXH7" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        {predogled && <img src={`https://i.ytimg.com/vi/${predogled}/default.jpg`} alt="" style={{ height: 48, borderRadius: 6 }} />}
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
          <input type="checkbox" checked={samodejno} onChange={(e) => setSamodejno(e.target.checked)} />
          Predvajaj takoj ob odprtju strani (brez zvoka, v zanki)
        </label>
        <button type="button" className="gumb" onClick={dodaj} disabled={!povezava.trim()}>
          Dodaj video
        </button>
      </div>
      <p className="namig" style={{ marginTop: 12 }}>
        {sporocilo || "Brez kljukice se video začne šele, ko obiskovalec klikne nanj (stran ostane hitrejša)."}
      </p>
    </div>
  );
}

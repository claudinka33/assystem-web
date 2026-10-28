"use client";

import { useState, useTransition } from "react";
import { shraniVideeIzdelka } from "@/lib/akcije/skupno";
import { naloziVShrambo } from "@/app/admin/nalaganje";

// Iz YouTube povezave izlušči ID (watch?v=, youtu.be/, shorts/, embed/).
export function youtubeId(vnos) {
  const s = String(vnos ?? "").trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(s)) return s;
  const m = s.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

// MP4: pot na strani (/videi/…mp4) ali https povezava do .mp4
function mp4Povezava(vnos) {
  const s = String(vnos ?? "").trim();
  if (/^\/[A-Za-z0-9/_.-]+\.mp4$/i.test(s)) return s;
  if (/^https:\/\/\S+\.mp4(\?\S*)?$/i.test(s)) return s;
  return null;
}

const kljuc = (v) => v.mp4 || v.id;

export default function VideiIzdelka({ izdelekId, zacetni }) {
  const [videi, setVidei] = useState(zacetni ?? []);
  const [povezava, setPovezava] = useState("");
  const [naslov, setNaslov] = useState("");
  const [samodejno, setSamodejno] = useState(true);
  const [nalagam, setNalagam] = useState(false);
  const [sporocilo, setSporocilo] = useState("");
  const [, zacni] = useTransition();

  function shrani(novi) {
    setVidei(novi);
    zacni(async () => {
      const r = await shraniVideeIzdelka(izdelekId, novi);
      setSporocilo(r?.napaka ? `Napaka: ${r.napaka}` : "✓ Shranjeno — velja tudi na spletni strani.");
    });
  }

  function dodajVnos(vnos) {
    shrani([...videi.filter((v) => kljuc(v) !== kljuc(vnos)), vnos]);
    setPovezava("");
    setNaslov("");
  }

  function dodaj() {
    const mp4 = mp4Povezava(povezava);
    if (mp4) return dodajVnos({ mp4, poster: null, naslov: naslov.trim(), samodejno });
    const id = youtubeId(povezava);
    if (!id) return setSporocilo("To ni veljavna povezava — prilepi YouTube povezavo ali povezavo do .mp4 datoteke.");
    dodajVnos({ id, naslov: naslov.trim(), samodejno });
  }

  async function naloziMp4(e) {
    const datoteka = e.target.files?.[0];
    e.target.value = "";
    if (!datoteka) return;
    if (!/\.mp4$/i.test(datoteka.name)) return setSporocilo("Naloži datoteko .mp4.");
    setNalagam(true);
    setSporocilo(`Nalagam ${datoteka.name} …`);
    const r = await naloziVShrambo(datoteka, "dokumenti");
    setNalagam(false);
    if (r?.napaka) return setSporocilo(`Napaka pri nalaganju: ${r.napaka}`);
    dodajVnos({ mp4: r.url, poster: null, naslov: naslov.trim() || datoteka.name.replace(/\.mp4$/i, ""), samodejno });
  }

  const ytPredogled = youtubeId(povezava);

  return (
    <div>
      {videi.length > 0 && (
        <div className="video-seznam">
          {videi.map((v, i) => (
            <div key={kljuc(v)} className="video-el">
              {v.mp4 ? (
                <video src={v.mp4} poster={v.poster || undefined} muted playsInline preload="metadata" style={{ width: 160, aspectRatio: "16 / 9", objectFit: "cover", background: "#000" }} />
              ) : (
                <img src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`} alt="" />
              )}
              <div className="video-podatki">
                <b>
                  {v.naslov || "Brez naslova"} <span className="znacka" style={{ marginLeft: 6 }}>{v.mp4 ? "MP4" : "YouTube"}</span>
                </b>
                {v.mp4 ? (
                  <a href={v.mp4} target="_blank" rel="noreferrer">{v.mp4.split("/").pop()} ↗</a>
                ) : (
                  <a href={`https://youtu.be/${v.id}`} target="_blank" rel="noreferrer">youtu.be/{v.id} ↗</a>
                )}
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
          <label>Povezava (YouTube ali .mp4)</label>
          <input type="text" value={povezava} onChange={(e) => setPovezava(e.target.value)} placeholder="https://youtu.be/… ali /videi/ime.mp4" />
        </div>
        <div className="adm-polje">
          <label>Naslov videa</label>
          <input type="text" value={naslov} onChange={(e) => setNaslov(e.target.value)} placeholder="npr. Vgradnja sidra TXH7" />
        </div>
      </div>
      <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        {ytPredogled && <img src={`https://i.ytimg.com/vi/${ytPredogled}/default.jpg`} alt="" style={{ height: 48, borderRadius: 6 }} />}
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
          <input type="checkbox" checked={samodejno} onChange={(e) => setSamodejno(e.target.checked)} />
          Predvajaj takoj ob odprtju strani (brez zvoka, v zanki)
        </label>
        <button type="button" className="gumb" onClick={dodaj} disabled={!povezava.trim()}>
          Dodaj video
        </button>
        <label className="gumb siv" style={{ cursor: nalagam ? "wait" : "pointer" }}>
          {nalagam ? "Nalagam …" : "Naloži MP4"}
          <input type="file" accept="video/mp4,.mp4" onChange={naloziMp4} disabled={nalagam} style={{ display: "none" }} />
        </label>
      </div>
      <p className="namig" style={{ marginTop: 12 }}>
        {sporocilo || "MP4 je vedno v polni kakovosti in brez YouTube logotipa. Video naj bo stisnjen za splet (do ~10 MB)."}
      </p>
    </div>
  );
}

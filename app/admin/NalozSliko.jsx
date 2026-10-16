"use client";

import { useRef, useState } from "react";
import { naloziVShrambo } from "./nalaganje";

// Polje za sliko ali PDF: povleci datoteko sem ali klikni. Datoteka gre v Supabase
// shrambo in se na spletni strani pokaže takoj po shranjevanju obrazca.
export default function NalozSliko({ ime, zacetna, oznaka = "Slika", vedro = "slike", privzeta = null, namig = null }) {
  const [url, setUrl] = useState(zacetna ?? "");
  const [caka, setCaka] = useState(false);
  const [napaka, setNapaka] = useState("");
  const [nad, setNad] = useState(false);
  const vnos = useRef(null);
  const jeSlika = vedro === "slike";

  async function nalozi(datoteka) {
    if (!datoteka) return;
    setCaka(true);
    setNapaka("");
    const r = await naloziVShrambo(datoteka, vedro);
    setCaka(false);
    if (r.napaka) setNapaka(r.napaka);
    else setUrl(r.url);
  }

  const prikaz = url || privzeta;

  return (
    <div className="adm-polje">
      <label>{oznaka}</label>
      <input type="hidden" name={ime} value={url} />
      <div
        className={`nalozi${nad ? " nad" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setNad(true); }}
        onDragLeave={() => setNad(false)}
        onDrop={(e) => { e.preventDefault(); setNad(false); nalozi(e.dataTransfer.files?.[0]); }}
      >
        {jeSlika ? (
          <div className="nalozi-predogled">
            {prikaz ? <img src={prikaz} alt="" /> : <span>Ni slike</span>}
            {!url && privzeta && <em>privzeta</em>}
          </div>
        ) : (
          <div className="nalozi-predogled pdf">{url ? "PDF" : "—"}</div>
        )}
        <div className="nalozi-desno">
          <button type="button" className="gumb siv mini" onClick={() => vnos.current?.click()} disabled={caka}>
            {caka ? "Nalagam …" : url ? "Zamenjaj" : "Izberi datoteko"}
          </button>
          {url && (
            <button type="button" className="gumb siv mini" onClick={() => setUrl("")}>
              Odstrani
            </button>
          )}
          <p className="namig" style={{ margin: "8px 0 0" }}>
            {caka
              ? "Nalagam …"
              : namig ??
                (jeSlika
                  ? !url && privzeta
                    ? "Trenutno se prikazuje privzeta slika. Povleci novo sliko sem, da jo zamenjaš."
                    : "Povleci sliko sem ali klikni »Izberi datoteko«. JPG, PNG ali WEBP."
                  : "Povleci PDF sem ali klikni »Izberi datoteko«. Tudi veliki katalogi (do 50 MB).")}
          </p>
          {url && !jeSlika && (
            <a href={url} target="_blank" rel="noreferrer" className="namig" style={{ color: "#cb2026" }}>Odpri naloženo datoteko ↗</a>
          )}
          {napaka && <p className="namig" style={{ color: "#cb2026" }}>Napaka: {napaka}</p>}
        </div>
        <input
          ref={vnos}
          type="file"
          hidden
          accept={jeSlika ? "image/*" : ".pdf,application/pdf"}
          onChange={(e) => nalozi(e.target.files?.[0])}
        />
      </div>
      <details className="nalozi-url">
        <summary>ali prilepi povezavo</summary>
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
      </details>
    </div>
  );
}

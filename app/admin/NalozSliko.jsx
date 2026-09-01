"use client";

import { useState } from "react";
import { naloziDatoteko } from "@/lib/akcije/skupno";

// Naloži sliko ali PDF v Supabase shrambo in vrne javno povezavo.
export default function NalozSliko({ ime, zacetna, oznaka = "Slika", vedro = "slike" }) {
  const [url, setUrl] = useState(zacetna ?? "");
  const [caka, setCaka] = useState(false);
  const [napaka, setNapaka] = useState("");

  async function nalozi(e) {
    const datoteka = e.target.files?.[0];
    if (!datoteka) return;

    setCaka(true);
    setNapaka("");

    const fd = new FormData();
    fd.append("datoteka", datoteka);
    fd.append("vedro", vedro);

    const rezultat = await naloziDatoteko(fd);
    setCaka(false);

    if (rezultat?.napaka) setNapaka(rezultat.napaka);
    else setUrl(rezultat.url);
  }

  return (
    <div className="adm-polje">
      <label>{oznaka}</label>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        {url && vedro === "slike" && (
          <img
            src={url}
            alt=""
            style={{ width: 76, height: 76, objectFit: "contain", background: "#f4f6f7", border: "1px solid #e6e9ec" }}
          />
        )}
        <div style={{ flex: 1 }}>
          <input type="hidden" name={ime} value={url} />
          <input type="file" onChange={nalozi} accept={vedro === "slike" ? "image/*" : ".pdf"} />
          {caka && <p className="namig">Nalagam…</p>}
          {napaka && <p className="namig" style={{ color: "#c8102e" }}>{napaka}</p>}
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="ali prilepi povezavo"
            style={{ marginTop: 8 }}
          />
        </div>
      </div>
    </div>
  );
}

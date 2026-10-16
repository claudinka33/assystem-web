"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { dodajVGalerijoVec, shraniGalerijo } from "@/lib/akcije/skupno";
import { naloziVShrambo } from "./nalaganje";

// Galerija izdelka: povleci več slik naenkrat, razvrsti z vlečenjem, določi glavno sliko.
export default function GalerijaIzdelka({ izdelekId, glavna, galerija: zacetna }) {
  const router = useRouter();
  const [slike, setSlike] = useState(zacetna ?? []);
  const [glavnaSlika, setGlavna] = useState(glavna ?? "");
  const [nalagam, setNalagam] = useState(0);
  const [sporocilo, setSporocilo] = useState("");
  const [nad, setNad] = useState(false);
  const vlecem = useRef(null);
  const vnos = useRef(null);
  const [, zacni] = useTransition();

  function shrani(nove, novaGlavna = glavnaSlika) {
    setSlike(nove);
    setGlavna(novaGlavna);
    zacni(async () => {
      const r = await shraniGalerijo(izdelekId, nove, novaGlavna);
      setSporocilo(r?.napaka ? `Napaka: ${r.napaka}` : "✓ Shranjeno — velja tudi na spletni strani.");
      router.refresh();
    });
  }

  async function naloziVec(datoteke) {
    const seznam = [...(datoteke ?? [])].filter((d) => d.type.startsWith("image/"));
    if (!seznam.length) return;
    setNalagam(seznam.length);
    setSporocilo("");
    const urlji = [];
    for (const d of seznam) {
      const r = await naloziVShrambo(d, "slike");
      if (r.url) urlji.push(r.url);
      else setSporocilo(`Napaka pri ${d.name}: ${r.napaka}`);
      setNalagam((n) => n - 1);
    }
    if (urlji.length) {
      const r = await dodajVGalerijoVec(izdelekId, urlji);
      if (r?.napaka) setSporocilo(`Napaka: ${r.napaka}`);
      else {
        const nove = [...slike, ...urlji.filter((u) => !slike.includes(u))];
        setSlike(nove);
        // če izdelek še nima glavne slike, postane prva naložena glavna
        if (!glavnaSlika) shrani(nove, urlji[0]);
        else setSporocilo(`✓ Dodanih ${urlji.length} slik.`);
        router.refresh();
      }
    }
  }

  function premakni(od, na) {
    if (od == null || na == null || od === na) return;
    const nove = [...slike];
    const [x] = nove.splice(od, 1);
    nove.splice(na, 0, x);
    shrani(nove);
  }

  return (
    <div>
      <div
        className={`nalozi velika${nad ? " nad" : ""}`}
        onDragOver={(e) => { if (vlecem.current == null) { e.preventDefault(); setNad(true); } }}
        onDragLeave={() => setNad(false)}
        onDrop={(e) => { if (vlecem.current != null) return; e.preventDefault(); setNad(false); naloziVec(e.dataTransfer.files); }}
        onClick={() => vnos.current?.click()}
      >
        <b>{nalagam ? `Nalagam … še ${nalagam}` : "Povleci slike sem"}</b>
        <span>ali klikni za izbiro — lahko izbereš več slik naenkrat</span>
        <input ref={vnos} type="file" hidden multiple accept="image/*" onChange={(e) => naloziVec(e.target.files)} />
      </div>

      {slike.length > 0 && (
        <div className="galerija-mreza">
          {slike.map((url, i) => (
            <div
              key={url}
              className={`galerija-el${url === glavnaSlika ? " glavna" : ""}`}
              draggable
              onDragStart={() => { vlecem.current = i; }}
              onDragEnd={() => { vlecem.current = null; }}
              onDragOver={(e) => { if (vlecem.current != null) e.preventDefault(); }}
              onDrop={(e) => { e.preventDefault(); premakni(vlecem.current, i); vlecem.current = null; }}
            >
              <img src={url} alt="" />
              {url === glavnaSlika && <span className="oznaka">Glavna</span>}
              <div className="galerija-gumbi">
                {url !== glavnaSlika && (
                  <button type="button" onClick={() => shrani(slike, url)} title="Nastavi kot glavno sliko">★ Glavna</button>
                )}
                <button
                  type="button"
                  className="nevaren"
                  onClick={() => {
                    if (!confirm("Odstranim to sliko iz galerije?")) return;
                    shrani(slike.filter((s) => s !== url), url === glavnaSlika ? "" : glavnaSlika);
                  }}
                >
                  Odstrani
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="namig" style={{ marginTop: 12 }}>
        {sporocilo || "Slike razvrstiš z vlečenjem. »★ Glavna« določi sliko, ki se pokaže na seznamu izdelkov."}
      </p>
    </div>
  );
}

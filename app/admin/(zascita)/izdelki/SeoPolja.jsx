"use client";

import { useState } from "react";

// SEO polja z živim predogledom, kako bo izdelek videti v Googlu.
export default function SeoPolja({ izdelek }) {
  const i = izdelek ?? {};
  const [naslov, setNaslov] = useState(i.seo_naslov ?? "");
  const [opis, setOpis] = useState(i.seo_opis ?? "");
  const prikazNaslov = naslov || `${i.naziv ?? "Naziv izdelka"} | AS system`;
  const prikazOpis = opis || i.kratek_opis || "Opis, ki ga Google pokaže pod naslovom.";
  const stevec = (n, max) => <span className={n > max ? "stevec-zn cez" : "stevec-zn"}>{n}/{max}</span>;

  return (
    <div className="seo-mreza">
      <div>
        <div className="adm-polje">
          <label htmlFor="seo_naslov">SEO naslov {stevec(naslov.length, 60)}</label>
          <input form="izdelek" id="seo_naslov" name="seo_naslov" type="text" value={naslov} onChange={(e) => setNaslov(e.target.value)} placeholder={`${i.naziv ?? "Naziv"} | AS system`} />
        </div>
        <div className="adm-polje">
          <label htmlFor="seo_opis">SEO opis {stevec(opis.length, 160)}</label>
          <textarea form="izdelek" id="seo_opis" name="seo_opis" value={opis} onChange={(e) => setOpis(e.target.value)} style={{ minHeight: 80 }} />
        </div>
      </div>
      <div className="google">
        <small>Predogled v Googlu</small>
        <span className="google-url">assystem.si › program › {i.slug || "izdelek"}</span>
        <b>{prikazNaslov.length > 62 ? prikazNaslov.slice(0, 60) + "…" : prikazNaslov}</b>
        <p>{prikazOpis.length > 162 ? prikazOpis.slice(0, 158) + "…" : prikazOpis}</p>
      </div>
    </div>
  );
}

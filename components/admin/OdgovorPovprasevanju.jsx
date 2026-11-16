"use client";

import { useActionState, useRef, useState } from "react";
import { odgovoriNaPovprasevanje } from "@/lib/akcije/odgovori";

const velikost = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} kB`);

export default function OdgovorPovprasevanju({ id, email, zadeva, od, odEmail }) {
  const [odprto, setOdprto] = useState(false);
  const [datoteke, setDatoteke] = useState([]);
  const vnos = useRef(null);
  const [stanje, akcija, caka] = useActionState(odgovoriNaPovprasevanje, null);

  if (stanje?.stanje === "ok")
    return (
      <div className="odg-ok">
        <span>✓</span> {stanje.sporocilo}
      </div>
    );

  if (!odprto)
    return (
      <button type="button" className="odg-odpri" onClick={() => setOdprto(true)}>
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 5 5v6" />
        </svg>
        Odgovori stranki
      </button>
    );

  function izberi(e) {
    setDatoteke([...e.target.files]);
  }
  function odstrani(i) {
    const dt = new DataTransfer();
    datoteke.filter((_, j) => j !== i).forEach((f) => dt.items.add(f));
    vnos.current.files = dt.files;
    setDatoteke([...dt.files]);
  }
  const skupaj = datoteke.reduce((s, f) => s + f.size, 0);

  return (
    <form action={akcija} className="odg">
      <input type="hidden" name="id" value={id} />

      <div className="odg-vrsta">
        <span>Od</span>
        <div>
          <b>{od}</b> <small>· odgovori pridejo na {odEmail}</small>
        </div>
      </div>
      <div className="odg-vrsta">
        <span>Za</span>
        <div>
          <b>{email}</b>
        </div>
      </div>
      <div className="odg-vrsta">
        <span>Zadeva</span>
        <input type="text" name="zadeva" defaultValue={zadeva} required />
      </div>

      <textarea name="besedilo" rows={8} required defaultValue={"Pozdravljeni,\n\n\n\nLep pozdrav,"} className="odg-tekst" />

      <div className="odg-podpis">
        <b>{od}</b>
        <br />
        AS system d.o.o. · {odEmail}
        <br />
        <em>Vprašanje stranke se doda pod odgovor samodejno.</em>
      </div>

      <div className="odg-dol">
        <label className="odg-pripni">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="m21 12-8.5 8.5a5 5 0 0 1-7-7L14 5a3.3 3.3 0 0 1 4.7 4.7l-8.5 8.5a1.7 1.7 0 0 1-2.4-2.4L16 7.6" />
          </svg>
          Pripni ponudbo (PDF)
          <input ref={vnos} type="file" name="priloga" multiple accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx" onChange={izberi} hidden />
        </label>

        <div className="odg-gumbi">
          <button type="button" className="gumb siv" onClick={() => setOdprto(false)}>
            Prekliči
          </button>
          <button className="gumb" type="submit" disabled={caka || skupaj > 4 * 1024 * 1024}>
            {caka ? "Pošiljam…" : "Pošlji odgovor"}
          </button>
        </div>
      </div>

      {datoteke.length > 0 && (
        <ul className="odg-dat">
          {datoteke.map((f, i) => (
            <li key={i}>
              <span className="odg-pdf">{f.name.split(".").pop().toUpperCase()}</span>
              <span className="odg-ime">{f.name}</span>
              <small>{velikost(f.size)}</small>
              <button type="button" aria-label="Odstrani" onClick={() => odstrani(i)}>
                ×
              </button>
            </li>
          ))}
          {skupaj > 4 * 1024 * 1024 && <li className="odg-nap">Priloge so skupaj večje od 4 MB.</li>}
        </ul>
      )}

      {stanje?.stanje === "napaka" && <p className="odg-nap">{stanje.sporocilo}</p>}
    </form>
  );
}

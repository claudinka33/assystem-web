"use client";

import { useActionState, useState } from "react";
import { odgovoriNaPovprasevanje } from "@/lib/akcije/odgovori";

export default function OdgovorPovprasevanju({ id, email, zadeva, besedilo }) {
  const [odprto, setOdprto] = useState(false);
  const [stanje, akcija, caka] = useActionState(odgovoriNaPovprasevanje, null);

  if (stanje?.stanje === "ok")
    return <p style={{ marginTop: 14, fontSize: 13, color: "#1a7f3c", fontWeight: 600 }}>✓ {stanje.sporocilo}</p>;

  if (!odprto)
    return (
      <button type="button" className="gumb" style={{ marginTop: 14 }} onClick={() => setOdprto(true)}>
        Odgovori stranki
      </button>
    );

  return (
    <form action={akcija} className="odg-forma">
      <input type="hidden" name="id" value={id} />
      <div className="odg-za">
        Za: <b>{email}</b>
      </div>
      <div className="adm-polje">
        <label>Zadeva</label>
        <input type="text" name="zadeva" defaultValue={zadeva} required />
      </div>
      <div className="adm-polje">
        <label>Sporočilo</label>
        <textarea name="besedilo" rows={9} defaultValue={besedilo} required />
      </div>
      <div className="adm-polje">
        <label>Priloga (npr. ponudba PDF, skupaj do 4 MB)</label>
        <input type="file" name="priloga" multiple accept=".pdf,.jpg,.jpeg,.png,.xlsx,.docx" />
      </div>
      {stanje?.stanje === "napaka" && <p style={{ color: "#c8102e", fontSize: 13, margin: "0 0 10px" }}>{stanje.sporocilo}</p>}
      <div style={{ display: "flex", gap: 10 }}>
        <button className="gumb" type="submit" disabled={caka}>
          {caka ? "Pošiljam…" : "Pošlji"}
        </button>
        <button type="button" className="gumb siv" onClick={() => setOdprto(false)}>
          Prekliči
        </button>
      </div>
    </form>
  );
}

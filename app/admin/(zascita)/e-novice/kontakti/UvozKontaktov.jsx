"use client";

import { useActionState, useMemo, useState } from "react";
import { uvoziKontakte } from "@/lib/akcije/enovice-kontakti";

const EMAIL = /[A-Z0-9._%+'-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const polje = { width: "100%", padding: "8px 10px", border: "1px solid #c6cace", fontSize: 13 };

export default function UvozKontaktov({ segmenti }) {
  const [besedilo, setBesedilo] = useState("");
  const [segment, setSegment] = useState("");
  const [stanje, akcija, caka] = useActionState(uvoziKontakte, null);

  const naslovi = useMemo(() => [...new Set((besedilo.match(EMAIL) ?? []).map((e) => e.toLowerCase()))], [besedilo]);

  return (
    <form action={akcija} className="adm-obr" style={{ maxWidth: 720, padding: 18 }}>
      {stanje && (
        <div className={stanje.stanje === "ok" ? "uspeh" : "opozorilo"} style={{ fontSize: 15 }}>
          {stanje.stanje === "ok" ? "✓ " : ""}
          {stanje.sporocilo}
        </div>
      )}

      <div className="adm-polje">
        <label htmlFor="kontakti">Kontakti</label>
        <textarea
          id="kontakti"
          name="kontakti"
          value={besedilo}
          onChange={(e) => setBesedilo(e.target.value)}
          placeholder={"En kontakt na vrstico – lahko kar kopiraš iz Excela ali maila:\njanez@firma.si\nJanez Novak <janez@firma.si>\nJanez Novak; janez@firma.si"}
          style={{ minHeight: 180, fontSize: 13 }}
        />
        <p className="namig">
          Najdenih e-naslovov: <b>{naslovi.length}</b>
          {naslovi.length > 0 && ` · npr. ${naslovi.slice(0, 3).join(", ")}${naslovi.length > 3 ? " …" : ""}`}
        </p>
      </div>

      <div className="adm-polje">
        <label htmlFor="segment">Panoga</label>
        <select id="segment" name="segment" value={segment} onChange={(e) => setSegment(e.target.value)} style={polje}>
          <option value="" disabled>
            — izberi panogo —
          </option>
          {segmenti.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
          <option value="__nova__">+ Nova panoga …</option>
        </select>
      </div>

      <input type="hidden" name="segment_ime" value={segment === "__nova__" ? "" : segmenti.find((s) => s.id === segment)?.name ?? ""} />

      {segment === "__nova__" && (
        <div className="adm-polje">
          <label htmlFor="nova_panoga">Ime nove panoge</label>
          <input id="nova_panoga" name="nova_panoga" type="text" placeholder="npr. Distributerji tujina" style={polje} />
        </div>
      )}

      <button className="gumb" type="submit" disabled={caka || naslovi.length === 0 || !segment}>
        {caka ? "Uvažam …" : `Shrani ${naslovi.length || ""} kontaktov`}
      </button>
      <p className="namig" style={{ marginTop: 10 }}>
        Če kontakt že obstaja, ga posodobimo in dodamo še v to panogo (en kontakt je lahko v več panogah).
      </p>
    </form>
  );
}

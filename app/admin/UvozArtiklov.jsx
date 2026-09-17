"use client";

import { useActionState } from "react";
import { uvoziArtikle } from "@/lib/akcije/skupno";

export default function UvozArtiklov({ izdelekId }) {
  const [stanje, akcija, caka] = useActionState(uvoziArtikle, null);

  return (
    <form className="adm-obr" action={akcija} style={{ marginTop: 16 }}>
      <input type="hidden" name="izdelek_id" value={izdelekId} />

      <h3 style={{ fontSize: 16, fontWeight: 700, textTransform: "uppercase", marginBottom: 12 }}>
        Uvoz iz Excela
      </h3>

      {stanje?.stanje === "ok" && <div className="uspeh">{stanje.sporocilo}</div>}
      {stanje?.stanje === "napaka" && <div className="opozorilo">{stanje.sporocilo}</div>}

      <div className="adm-polje">
        <label htmlFor="podatki">Prilepi vrstice iz preglednice</label>
        <textarea
          id="podatki"
          name="podatki"
          style={{ minHeight: 160, fontFamily: "ui-monospace, monospace", fontSize: 13 }}
          placeholder="TXH7-0860	TXH7 ZnB M8x60	M8 x 60	3830000000001	100	1,25	250	42"
        />
        <p className="namig">
          Vrstni red stolpcev: <b>šifra · naziv · dimenzija · EAN · pakiranje · MPC · zaloga · teža (g)</b>.
          Obvezna sta samo prva dva. V Excelu označi vrstice, kopiraj in prilepi
          sem. Če šifra že obstaja, se artikel posodobi in ne podvoji.
        </p>
      </div>

      <button className="gumb" type="submit" disabled={caka}>
        {caka ? "Uvažam…" : "Uvozi artikle"}
      </button>
    </form>
  );
}

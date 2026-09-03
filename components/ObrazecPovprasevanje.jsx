"use client";

import { useActionState, useEffect } from "react";
import { dogodek } from "@/lib/dogodki";
import { posljiPovprasevanje } from "@/lib/akcije/obrazci";

export default function ObrazecPovprasevanje({ vir = "kontakt", izdelek, naslov }) {
  const [stanje, akcija, caka] = useActionState(posljiPovprasevanje, null);

  // Konverzija za Google Analytics in Meta Pixel.
  useEffect(() => {
    if (stanje?.stanje === "ok") dogodek("povprasevanje_poslano", { vir });
  }, [stanje]);

  if (stanje?.stanje === "ok") {
    return (
      <div className="obr-uspeh">
        <h3>Sporočilo je poslano</h3>
        <p>Hvala. Odgovorimo v enem delovnem dnevu, običajno prej.</p>
      </div>
    );
  }

  return (
    <form action={akcija} className="obr">
      {naslov && <h3 className="obr-naslov">{naslov}</h3>}

      <input type="hidden" name="vir" value={vir} />
      {izdelek && <input type="hidden" name="izdelek" value={izdelek} />}

      {/* Pasti za robote — človek tega polja ne vidi. */}
      <input
        type="text"
        name="polje_za_robote"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px" }}
      />

      {stanje?.stanje === "napaka" && <p className="obr-napaka">{stanje.sporocilo}</p>}

      <div className="obr-vrsta">
        <div className="obr-polje">
          <label htmlFor="ime">Ime in priimek *</label>
          <input id="ime" name="ime" type="text" required autoComplete="name" />
        </div>
        <div className="obr-polje">
          <label htmlFor="podjetje">Podjetje</label>
          <input id="podjetje" name="podjetje" type="text" autoComplete="organization" />
        </div>
      </div>

      <div className="obr-vrsta">
        <div className="obr-polje">
          <label htmlFor="email">E-naslov *</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="obr-polje">
          <label htmlFor="telefon">Telefon</label>
          <input id="telefon" name="telefon" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="obr-polje">
        <label htmlFor="sporocilo">Sporočilo</label>
        <textarea
          id="sporocilo"
          name="sporocilo"
          rows={6}
          placeholder="Dimenzije, količine, podlaga v katero pritrjujete…"
        />
      </div>

      <button className="b b-r" type="submit" disabled={caka}>
        {caka ? "Pošiljam…" : "Pošlji povpraševanje"}
      </button>

      <p className="obr-drobno">
        Podatke uporabimo izključno za odgovor na vaše povpraševanje.
      </p>
    </form>
  );
}

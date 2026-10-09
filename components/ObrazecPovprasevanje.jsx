"use client";

import { useActionState, useEffect } from "react";
import { dogodek } from "@/lib/dogodki";
import { posljiPovprasevanje } from "@/lib/akcije/obrazci";

export default function ObrazecPovprasevanje({ vir = "kontakt", izdelek, naslov, dodatnaPolja = [], priloga = null, namig }) {
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

      {dodatnaPolja.length > 0 && (
        <div className="obr-vrsta">
          {dodatnaPolja.map((p) => (
            <div key={p.oznaka} className="obr-polje">
              <label htmlFor={`dod-${p.oznaka}`}>{p.oznaka}</label>
              {p.moznosti ? (
                <select id={`dod-${p.oznaka}`} name={`dod:${p.oznaka}`} defaultValue="">
                  <option value="">— izberite —</option>
                  {p.moznosti.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              ) : (
                <input id={`dod-${p.oznaka}`} name={`dod:${p.oznaka}`} type="text" placeholder={p.namig} />
              )}
            </div>
          ))}
        </div>
      )}

      {priloga && (
        <div className="obr-polje">
          <label htmlFor="priloga">{priloga}</label>
          <input id="priloga" name="priloga" type="file" multiple accept=".pdf,.dwg,.dxf,.step,.stp,.igs,.iges,.jpg,.jpeg,.png,.zip" />
          <small style={{ color: "var(--color-muted)", fontSize: 12.5 }}>PDF, DWG, DXF, STEP, IGES, JPG, PNG ali ZIP, skupaj do 4 MB. Večje datoteke pošljite po e-pošti.</small>
        </div>
      )}

      <div className="obr-polje">
        <label htmlFor="sporocilo">Sporočilo</label>
        <textarea
          id="sporocilo"
          name="sporocilo"
          rows={6}
          placeholder={namig ?? "Dimenzije, količine, podlaga v katero pritrjujete…"}
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

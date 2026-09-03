"use client";

import { useActionState } from "react";
import { posljiPrijavo } from "@/lib/akcije/obrazci";

export default function ObrazecPrijava({ delovnaMesta = [] }) {
  const [stanje, akcija, caka] = useActionState(posljiPrijavo, null);

  if (stanje?.stanje === "ok") {
    return (
      <div className="obr-uspeh">
        <h3>Prijava je oddana</h3>
        <p>Hvala za zanimanje. Če bo vaš profil ustrezal, vas kontaktiramo.</p>
      </div>
    );
  }

  return (
    <form action={akcija} className="obr">
      <input
        type="text"
        name="polje_za_robote"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px" }}
      />

      {stanje?.stanje === "napaka" && <p className="obr-napaka">{stanje.sporocilo}</p>}

      {delovnaMesta.length > 0 && (
        <div className="obr-polje">
          <label htmlFor="delovno_mesto_id">Delovno mesto</label>
          <select id="delovno_mesto_id" name="delovno_mesto_id">
            <option value="">Splošna prijava</option>
            {delovnaMesta.map((d) => (
              <option key={d.id} value={d.id}>
                {d.naziv}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="obr-vrsta">
        <div className="obr-polje">
          <label htmlFor="ime">Ime in priimek *</label>
          <input id="ime" name="ime" type="text" required autoComplete="name" />
        </div>
        <div className="obr-polje">
          <label htmlFor="telefon">Telefon</label>
          <input id="telefon" name="telefon" type="tel" autoComplete="tel" />
        </div>
      </div>

      <div className="obr-polje">
        <label htmlFor="email">E-naslov *</label>
        <input id="email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className="obr-polje">
        <label htmlFor="cv">Življenjepis (PDF, DOC, do 8 MB)</label>
        <input id="cv" name="cv" type="file" accept=".pdf,.doc,.docx" />
      </div>

      <div className="obr-polje">
        <label htmlFor="sporocilo">Nekaj besed o sebi</label>
        <textarea id="sporocilo" name="sporocilo" rows={5} />
      </div>

      <button className="b b-r" type="submit" disabled={caka}>
        {caka ? "Pošiljam…" : "Oddaj prijavo"}
      </button>

      <p className="obr-drobno">
        Podatke hranimo eno leto in jih uporabimo samo za izbirni postopek.
      </p>
    </form>
  );
}

"use client";

import { useActionState, useEffect, useState } from "react";
import { dogodek } from "@/lib/dogodki";
import { posljiPovprasevanje } from "@/lib/akcije/obrazci";

// Vodeno povpraševanje za trgovce v treh korakih: program → prostor → kontakt.
// Pošlje se z isto akcijo kot ostali obrazci (polja »dod:…« pridejo v sporočilo).
const PROGRAMI = [
  { v: "ASfix", o: "Sidra, vložki, udarni vijaki" },
  { v: "ASco", o: "Vijačno blago po DIN in ISO" },
  { v: "Silvermate", o: "Lesni vijaki" },
  { v: "Še ne vem", o: "Svetujemo vam" },
];
const PROSTOR = [
  { v: "1 m", o: "Pult, manjša trgovina", s: 1 },
  { v: "2 m", o: "Najpogostejša izbira", s: 2 },
  { v: "4 m", o: "Gradbeni center", s: 4 },
  { v: "6 m in več", o: "Večja postavitev", s: 6 },
  { v: "Stojalo", o: "Samostoječe stojalo", s: 0 },
  { v: "Še ne vem", o: "Pridemo pogledat", s: -1 },
];

function Polica({ s }) {
  if (s < 0) return <span className="ot-ik ot-vpr">?</span>;
  if (s === 0)
    return (
      <svg className="ot-ik" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="14" y="4" width="12" height="30" rx="1" />
        <path d="M14 12h12M14 19h12M14 26h12M11 36h18" />
      </svg>
    );
  const w = Math.min(36, 6 + s * 5);
  return (
    <svg className="ot-ik" viewBox="0 0 40 40" aria-hidden="true">
      <rect x={20 - w / 2} y="6" width={w} height="28" rx="1" />
      <path d={`M${20 - w / 2} 15h${w}M${20 - w / 2} 24h${w}M${20 - w / 2 + 2} 36h${w - 4}`} />
    </svg>
  );
}

export default function ObrazecTrgovci() {
  const [stanje, akcija, caka] = useActionState(posljiPovprasevanje, null);
  const [korak, setKorak] = useState(1);
  const [programi, setProgrami] = useState([]);
  const [prostor, setProstor] = useState("");

  useEffect(() => {
    if (stanje?.stanje === "ok") dogodek("povprasevanje_poslano", { vir: "za-trgovce" });
  }, [stanje]);

  if (stanje?.stanje === "ok") {
    return (
      <div className="obr-uspeh ot-uspeh">
        <span className="ot-kljukica">✓</span>
        <h3>Hvala, povpraševanje je poslano</h3>
        <p>Pripravimo predlog police in vas pokličemo ali vam pišemo v enem delovnem dnevu.</p>
      </div>
    );
  }

  const preklopi = (v) =>
    setProgrami((p) => (v === "Še ne vem" ? ["Še ne vem"] : p.includes(v) ? p.filter((x) => x !== v) : [...p.filter((x) => x !== "Še ne vem"), v]));

  return (
    <form action={akcija} className="obr ot">
      <div className="ot-glava">
        <h3 className="obr-naslov">Predlog police v 3 korakih</h3>
        <div className="ot-napredek" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= korak ? "on" : ""} />
          ))}
        </div>
        <small>Korak {korak} od 3 · traja manj kot minuto</small>
      </div>

      <input type="hidden" name="vir" value="za-trgovce" />
      <input type="hidden" name="dod:Program" value={programi.join(", ")} />
      <input type="hidden" name="dod:Prostor za polico" value={prostor} />
      <input type="text" name="polje_za_robote" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />

      {stanje?.stanje === "napaka" && <p className="obr-napaka">{stanje.sporocilo}</p>}

      {/* Korak 1 */}
      <fieldset className="ot-korak" hidden={korak !== 1}>
        <legend>Kaj bi radi prodajali?</legend>
        <p className="ot-pomoc">Izberete lahko več programov.</p>
        <div className="ot-izbire ot-2">
          {PROGRAMI.map((p) => (
            <button key={p.v} type="button" aria-pressed={programi.includes(p.v)} className={`ot-izb${programi.includes(p.v) ? " on" : ""}`} onClick={() => preklopi(p.v)}>
              <b>{p.v}</b>
              <small>{p.o}</small>
              <i aria-hidden="true">✓</i>
            </button>
          ))}
        </div>
        <div className="ot-gumbi">
          <span />
          <button type="button" className="b b-r" disabled={!programi.length} onClick={() => setKorak(2)}>
            Naprej →
          </button>
        </div>
      </fieldset>

      {/* Korak 2 */}
      <fieldset className="ot-korak" hidden={korak !== 2}>
        <legend>Koliko prostora imate?</legend>
        <p className="ot-pomoc">Približno je dovolj — postavitev prilagodimo.</p>
        <div className="ot-izbire ot-3">
          {PROSTOR.map((p) => (
            <button
              key={p.v}
              type="button"
              aria-pressed={prostor === p.v}
              className={`ot-izb ot-pr${prostor === p.v ? " on" : ""}`}
              onClick={() => {
                setProstor(p.v);
                setTimeout(() => setKorak(3), 180);
              }}
            >
              <Polica s={p.s} />
              <b>{p.v}</b>
              <small>{p.o}</small>
            </button>
          ))}
        </div>
        <div className="ot-gumbi">
          <button type="button" className="ot-nazaj" onClick={() => setKorak(1)}>
            ← Nazaj
          </button>
          <button type="button" className="b b-r" disabled={!prostor} onClick={() => setKorak(3)}>
            Naprej →
          </button>
        </div>
      </fieldset>

      {/* Korak 3 */}
      <fieldset className="ot-korak" hidden={korak !== 3}>
        <legend>Kam pošljemo predlog?</legend>
        <div className="ot-povzetek">
          <span>{programi.join(" + ")}</span>
          <span>{prostor}</span>
          <button type="button" onClick={() => setKorak(1)}>spremeni</button>
        </div>
        <div className="obr-vrsta">
          <div className="obr-polje">
            <label htmlFor="ot-ime">Ime in priimek *</label>
            <input id="ot-ime" name="ime" type="text" required autoComplete="name" />
          </div>
          <div className="obr-polje">
            <label htmlFor="ot-email">E-naslov *</label>
            <input id="ot-email" name="email" type="email" required autoComplete="email" />
          </div>
        </div>
        <div className="obr-vrsta">
          <div className="obr-polje">
            <label htmlFor="ot-trg">Trgovina in kraj</label>
            <input id="ot-trg" name="podjetje" type="text" autoComplete="organization" placeholder="npr. Gradbeni center, Celje" />
          </div>
          <div className="obr-polje">
            <label htmlFor="ot-tel">Telefon</label>
            <input id="ot-tel" name="telefon" type="tel" autoComplete="tel" placeholder="Pokličemo vas mi" />
          </div>
        </div>
        <div className="obr-polje">
          <label htmlFor="ot-spo">Še kaj? (neobvezno)</label>
          <textarea id="ot-spo" name="sporocilo" rows={3} placeholder="Kupci, obstoječa polica, želeni rok …" />
        </div>
        <div className="ot-gumbi">
          <button type="button" className="ot-nazaj" onClick={() => setKorak(2)}>
            ← Nazaj
          </button>
          <button className="b b-r" type="submit" disabled={caka}>
            {caka ? "Pošiljam…" : "Pošlji povpraševanje"}
          </button>
        </div>
        <p className="obr-drobno">Brez obveznosti. Podatke uporabimo samo za odgovor na vaše povpraševanje.</p>
      </fieldset>
    </form>
  );
}

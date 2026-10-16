"use client";

import { useActionState, useEffect, useState } from "react";
import { dogodek } from "@/lib/dogodki";
import { posljiPovprasevanje } from "@/lib/akcije/obrazci";

// Vodeno povpraševanje private label v treh korakih: izdelki → embalaža in količina → kontakt.
const IZDELKI = [
  { v: "Jeklena sidra", o: "TXH7 z oceno ETA" },
  { v: "Udarni vijaki", o: "Z najlonskim vložkom" },
  { v: "Zidni vložki", o: "Za polne in votle stene" },
  { v: "Vložki za mavčne plošče", o: "Kovinski in plastični" },
  { v: "Drugo", o: "Opišete v zadnjem koraku" },
  { v: "Še ne vem", o: "Svetujemo vam" },
];
const EMBALAZA = [
  { v: "Bela škatla z vašo nalepko", o: "Hitro, z vašim logotipom" },
  { v: "Škatla z vašim dizajnom", o: "Pošljemo mrežo škatle" },
  { v: "Vrečka z vašo podobo", o: "Za perforirano steno" },
  { v: "Še ne vem", o: "Predlagamo mi" },
];
const KOLICINE = ["do 10.000 kos/leto", "10.000 – 100.000", "nad 100.000", "Še ne vem"];

export default function ObrazecPrivateLabel() {
  const [stanje, akcija, caka] = useActionState(posljiPovprasevanje, null);
  const [korak, setKorak] = useState(1);
  const [izdelki, setIzdelki] = useState([]);
  const [embalaza, setEmbalaza] = useState("");
  const [kolicina, setKolicina] = useState("");

  useEffect(() => {
    if (stanje?.stanje === "ok") dogodek("povprasevanje_poslano", { vir: "private-label" });
  }, [stanje]);

  if (stanje?.stanje === "ok") {
    return (
      <div className="obr-uspeh ot-uspeh">
        <span className="ot-kljukica">✓</span>
        <h3>Hvala, povpraševanje je poslano</h3>
        <p>Pripravimo predlog asortimana, embalaže in ponudbo. Odgovorimo v enem delovnem dnevu.</p>
      </div>
    );
  }

  const preklopi = (v) =>
    setIzdelki((p) => (v === "Še ne vem" ? ["Še ne vem"] : p.includes(v) ? p.filter((x) => x !== v) : [...p.filter((x) => x !== "Še ne vem"), v]));

  return (
    <form action={akcija} className="obr ot">
      <div className="ot-glava">
        <h3 className="obr-naslov">Vaša znamka v 3 korakih</h3>
        <div className="ot-napredek" aria-hidden="true">
          {[1, 2, 3].map((n) => (
            <span key={n} className={n <= korak ? "on" : ""} />
          ))}
        </div>
        <small>Korak {korak} od 3 · traja manj kot minuto</small>
      </div>

      <input type="hidden" name="vir" value="private-label" />
      <input type="hidden" name="dod:Izdelki" value={izdelki.join(", ")} />
      <input type="hidden" name="dod:Embalaža" value={embalaza} />
      <input type="hidden" name="dod:Letna količina" value={kolicina} />
      <input type="text" name="polje_za_robote" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />

      {stanje?.stanje === "napaka" && <p className="obr-napaka">{stanje.sporocilo}</p>}

      <fieldset className="ot-korak" hidden={korak !== 1}>
        <legend>Katere izdelke bi prodajali?</legend>
        <p className="ot-pomoc">Izberete lahko več izdelkov.</p>
        <div className="ot-izbire ot-2">
          {IZDELKI.map((p) => (
            <button key={p.v} type="button" aria-pressed={izdelki.includes(p.v)} className={`ot-izb${izdelki.includes(p.v) ? " on" : ""}`} onClick={() => preklopi(p.v)}>
              <b>{p.v}</b>
              <small>{p.o}</small>
              <i aria-hidden="true">✓</i>
            </button>
          ))}
        </div>
        <div className="ot-gumbi">
          <span />
          <button type="button" className="b b-r" disabled={!izdelki.length} onClick={() => setKorak(2)}>
            Naprej →
          </button>
        </div>
      </fieldset>

      <fieldset className="ot-korak" hidden={korak !== 2}>
        <legend>Kakšno embalažo želite?</legend>
        <div className="ot-izbire ot-2">
          {EMBALAZA.map((p) => (
            <button key={p.v} type="button" aria-pressed={embalaza === p.v} className={`ot-izb${embalaza === p.v ? " on" : ""}`} onClick={() => setEmbalaza(p.v)}>
              <b>{p.v}</b>
              <small>{p.o}</small>
              <i aria-hidden="true">✓</i>
            </button>
          ))}
        </div>
        <p className="ot-pomoc" style={{ margin: "6px 0 0", fontWeight: 700, color: "#2b2f33" }}>Približna letna količina</p>
        <div className="ot-cipi">
          {KOLICINE.map((k) => (
            <button key={k} type="button" aria-pressed={kolicina === k} className={kolicina === k ? "on" : ""} onClick={() => setKolicina(k)}>
              {k}
            </button>
          ))}
        </div>
        <div className="ot-gumbi">
          <button type="button" className="ot-nazaj" onClick={() => setKorak(1)}>
            ← Nazaj
          </button>
          <button type="button" className="b b-r" disabled={!embalaza} onClick={() => setKorak(3)}>
            Naprej →
          </button>
        </div>
      </fieldset>

      <fieldset className="ot-korak" hidden={korak !== 3}>
        <legend>Kam pošljemo predlog?</legend>
        <div className="ot-povzetek">
          <span>{izdelki.join(" + ")}</span>
          <span>{embalaza}</span>
          {kolicina && <span>{kolicina}</span>}
          <button type="button" onClick={() => setKorak(1)}>spremeni</button>
        </div>
        <div className="obr-vrsta">
          <div className="obr-polje">
            <label htmlFor="pl-ime">Ime in priimek *</label>
            <input id="pl-ime" name="ime" type="text" required autoComplete="name" />
          </div>
          <div className="obr-polje">
            <label htmlFor="pl-email">E-naslov *</label>
            <input id="pl-email" name="email" type="email" required autoComplete="email" />
          </div>
        </div>
        <div className="obr-vrsta">
          <div className="obr-polje">
            <label htmlFor="pl-pod">Podjetje in država</label>
            <input id="pl-pod" name="podjetje" type="text" autoComplete="organization" placeholder="npr. Gradnja d.o.o., Hrvaška" />
          </div>
          <div className="obr-polje">
            <label htmlFor="pl-tel">Telefon</label>
            <input id="pl-tel" name="telefon" type="tel" autoComplete="tel" placeholder="Pokličemo vas mi" />
          </div>
        </div>
        <div className="obr-polje">
          <label htmlFor="pl-log">Vaš logotip (neobvezno)</label>
          <input id="pl-log" name="priloga" type="file" accept=".pdf,.jpg,.jpeg,.png,.zip" />
        </div>
        <div className="obr-polje">
          <label htmlFor="pl-spo">Še kaj? (neobvezno)</label>
          <textarea id="pl-spo" name="sporocilo" rows={3} placeholder="Dimenzije, jezik embalaže, certifikati, rok …" />
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

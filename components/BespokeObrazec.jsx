"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { dogodek } from "@/lib/dogodki";
import { posljiPovprasevanje } from "@/lib/akcije/obrazci";
import { zNalaganjem } from "@/lib/nalaganje-klient";

const oddaj = zNalaganjem(posljiPovprasevanje, "priloga");
import { prevedeno, useJezik } from "@/lib/i18n/odjemalec";

const IMAM = [
  { v: "Risbo ali skico", opis: "PDF, DWG, STEP, fotografija skice", ikona: "✎" },
  { v: "Vzorec", opis: "Pošljete kos, mi ga izmerimo", ikona: "◎" },
  { v: "Samo opis", opis: "Povejte, kaj mora izdelek narediti", ikona: "✦" },
];
const IZDELKI = ["Vijak po risbi", "Jekleno sidro", "Udarni vijak", "Zidni vložek", "Perforiran trak", "Naš izdelek v vaši embalaži", "Drugo"];
const KOLICINE = ["do 10.000 kos", "10.000–100.000 kos", "100.000–1 mio kos", "več kot 1 mio kos", "Ne vem še"];
const MATERIALI = ["Jeklo", "Borovo jeklo (kaljeno)", "Nerjavno jeklo", "Plastika (PA, PP)", "Po risbi / ne vem"];
const ZASCITE = ["Pocinkano", "Črno", "Brez zaščite", "Po risbi / ne vem"];
const KORAKI = ["Izdelek", "Podrobnosti", "Kontakt"];

function Cip({ ime, vrednost, izbrano, onIzberi, vec = false }) {
  const aktiven = vec ? izbrano.includes(vrednost) : izbrano === vrednost;
  return (
    <button type="button" className={`bo-cip${aktiven ? " on" : ""}`} aria-pressed={aktiven} onClick={() => onIzberi(vrednost)}>
      {vrednost}
      {!vec && <input type="radio" name={ime} value={vrednost} checked={aktiven} readOnly hidden />}
    </button>
  );
}

function BespokeObrazec() {
  const { t } = useJezik();
  const [stanje, akcija, caka] = useActionState(oddaj, null);
  const [korak, setKorak] = useState(0);
  const [imam, setImam] = useState("");
  const [izdelki, setIzdelki] = useState([]);
  const [kolicina, setKolicina] = useState("");
  const [material, setMaterial] = useState("");
  const [zascita, setZascita] = useState("");
  const [datoteke, setDatoteke] = useState([]);
  const [vlecem, setVlecem] = useState(false);
  const [opozorilo, setOpozorilo] = useState("");
  const datRef = useRef(null);
  const vrhRef = useRef(null);

  useEffect(() => {
    if (stanje?.stanje === "ok") dogodek("povprasevanje_poslano", { vir: "bespoke" });
  }, [stanje]);

  const preklopi = (v) => setIzdelki((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));

  const nastaviDatoteke = (seznam) => {
    if (!datRef.current || !seznam?.length) return;
    const dt = new DataTransfer();
    [...(datRef.current.files ?? [])].forEach((f) => dt.items.add(f));
    [...seznam].forEach((f) => dt.items.add(f));
    datRef.current.files = dt.files;
    setDatoteke([...dt.files].map((f) => f.name));
  };
  const odstrani = (i) => {
    const dt = new DataTransfer();
    [...datRef.current.files].forEach((f, j) => j !== i && dt.items.add(f));
    datRef.current.files = dt.files;
    setDatoteke([...dt.files].map((f) => f.name));
  };

  const naprej = () => {
    if (korak === 0 && (!imam || izdelki.length === 0)) {
      setOpozorilo("Izberite, kaj imate, in vsaj en izdelek.");
      return;
    }
    setOpozorilo("");
    setKorak((k) => Math.min(k + 1, 2));
    vrhRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (stanje?.stanje === "ok") {
    return (
      <div className="bo bo-uspeh">
        <span className="bo-kljukica">✓</span>
        <h3>Povpraševanje je poslano</h3>
        <p>Hvala. Tehnolog pregleda vaše podatke in priloge, nato vas kontaktiramo s predlogom izvedbe in ponudbo.</p>
      </div>
    );
  }

  return (
    <form action={akcija} className="bo" ref={vrhRef}>
      <input type="hidden" name="vir" value="bespoke" />
      <input type="hidden" name="dod:Kaj ima stranka" value={imam} />
      <input type="hidden" name="dod:Izdelek" value={izdelki.join(", ")} />
      <input type="hidden" name="dod:Letna količina" value={kolicina} />
      <input type="hidden" name="dod:Material" value={material} />
      <input type="hidden" name="dod:Površinska zaščita" value={zascita} />
      <input type="text" name="polje_za_robote" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />

      <ol className="bo-koraki">
        {KORAKI.map((k, i) => (
          <li key={k} className={i === korak ? "on" : i < korak ? "opr" : ""}>
            <button type="button" onClick={() => i < korak && setKorak(i)} disabled={i > korak}>
              <b>{i < korak ? "✓" : i + 1}</b>
              <span>{k}</span>
            </button>
          </li>
        ))}
      </ol>

      {stanje?.stanje === "napaka" && <p className="obr-napaka">{stanje.sporocilo}</p>}

      {/* 1. korak */}
      <div className="bo-korak" hidden={korak !== 0}>
        <h3>Kaj imate?</h3>
        <div className="bo-imam">
          {IMAM.map((x) => (
            <button type="button" key={x.v} className={`bo-imam-k${imam === x.v ? " on" : ""}`} aria-pressed={imam === x.v} onClick={() => setImam(x.v)}>
              <i aria-hidden="true">{x.ikona}</i>
              <b>{x.v}</b>
              <span>{x.opis}</span>
            </button>
          ))}
        </div>

        <h3>Kaj potrebujete?</h3>
        <p className="bo-namig">Izberete lahko več.</p>
        <div className="bo-cipi">
          {IZDELKI.map((x) => (
            <Cip key={x} vrednost={x} izbrano={izdelki} onIzberi={preklopi} vec />
          ))}
        </div>
      </div>

      {/* 2. korak */}
      <div className="bo-korak" hidden={korak !== 1}>
        <h3>{imam === "Vzorec" ? "Fotografija vzorca" : "Risba ali skica"}</h3>
        <label
          className={`bo-nalozi${vlecem ? " vlecem" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setVlecem(true);
          }}
          onDragLeave={() => setVlecem(false)}
          onDrop={(e) => {
            e.preventDefault();
            setVlecem(false);
            nastaviDatoteke(e.dataTransfer.files);
          }}
        >
          <input
            ref={datRef}
            type="file"
            name="priloga"
            multiple
            accept=".pdf,.dwg,.dxf,.step,.stp,.igs,.iges,.jpg,.jpeg,.png,.zip"
            onChange={(e) => setDatoteke([...e.target.files].map((f) => f.name))}
          />
          <b>Povlecite datoteke sem</b>
          <span>ali kliknite za izbiro · PDF, DWG, DXF, STEP, JPG, PNG, ZIP · do 10 MB na datoteko</span>
        </label>
        {datoteke.length > 0 && (
          <ul className="bo-dat">
            {datoteke.map((d, i) => (
              <li key={d + i}>
                <span>{d}</span>
                <button type="button" onClick={() => odstrani(i)} aria-label={t("Odstrani")}>✕</button>
              </li>
            ))}
          </ul>
        )}
        {imam === "Vzorec" && <p className="bo-namig">Vzorec lahko pošljete tudi po pošti na naš naslov v Šmarju pri Jelšah. Navedite podjetje in kontakt.</p>}

        <h3>Letna količina</h3>
        <div className="bo-cipi">
          {KOLICINE.map((x) => (
            <Cip key={x} ime="_kolicina" vrednost={x} izbrano={kolicina} onIzberi={setKolicina} />
          ))}
        </div>

        <div className="bo-dva">
          <div>
            <h3>Material</h3>
            <div className="bo-cipi">
              {MATERIALI.map((x) => (
                <Cip key={x} ime="_material" vrednost={x} izbrano={material} onIzberi={setMaterial} />
              ))}
            </div>
          </div>
          <div>
            <h3>Površinska zaščita</h3>
            <div className="bo-cipi">
              {ZASCITE.map((x) => (
                <Cip key={x} ime="_zascita" vrednost={x} izbrano={zascita} onIzberi={setZascita} />
              ))}
            </div>
          </div>
        </div>

        <div className="obr-vrsta">
          <div className="obr-polje">
            <label htmlFor="bo-rok">Želeni rok prve serije</label>
            <input id="bo-rok" name="dod:Želeni rok" type="text" placeholder="npr. v 8 tednih" />
          </div>
          <div className="obr-polje">
            <label htmlFor="bo-emb">Embalaža</label>
            <select id="bo-emb" name="dod:Embalaža" defaultValue="">
              <option value="">— izberite —</option>
              <option>Razsuto v kartonu</option>
              <option>Škatle z vašo znamko</option>
              <option>Vrečke z vašo znamko</option>
              <option>Ne vem še</option>
            </select>
          </div>
        </div>

        <div className="obr-polje">
          <label htmlFor="bo-opis">Namen uporabe in posebne zahteve</label>
          <textarea id="bo-opis" name="sporocilo" rows={4} placeholder="Kje bo izdelek vgrajen, obremenitev, standard, certifikat 3.1 …" />
        </div>
      </div>

      {/* 3. korak */}
      <div className="bo-korak" hidden={korak !== 2}>
        <h3>Komu pošljemo ponudbo?</h3>
        <div className="obr-vrsta">
          <div className="obr-polje">
            <label htmlFor="bo-ime">Ime in priimek *</label>
            <input id="bo-ime" name="ime" type="text" required={korak === 2} autoComplete="name" />
          </div>
          <div className="obr-polje">
            <label htmlFor="bo-podj">Podjetje</label>
            <input id="bo-podj" name="podjetje" type="text" autoComplete="organization" />
          </div>
        </div>
        <div className="obr-vrsta">
          <div className="obr-polje">
            <label htmlFor="bo-email">E-naslov *</label>
            <input id="bo-email" name="email" type="email" required={korak === 2} autoComplete="email" />
          </div>
          <div className="obr-polje">
            <label htmlFor="bo-tel">Telefon</label>
            <input id="bo-tel" name="telefon" type="tel" autoComplete="tel" placeholder="+386 …" />
          </div>
        </div>
        <div className="obr-polje">
          <label htmlFor="bo-drz">Država</label>
          <input id="bo-drz" name="dod:Država" type="text" autoComplete="country-name" />
        </div>

        <div className="bo-povzetek">
          <b>Povzetek</b>
          <span>{imam || "—"}</span>
          <span>{izdelki.join(", ") || "—"}</span>
          {kolicina && <span>{kolicina}</span>}
          {datoteke.length > 0 && <span>{datoteke.length} {t("prilog")}</span>}
        </div>
      </div>

      {opozorilo && <p className="obr-napaka">{opozorilo}</p>}

      <div className="bo-gumbi">
        {korak > 0 && (
          <button type="button" className="b b-o" onClick={() => setKorak((k) => k - 1)}>
            ← Nazaj
          </button>
        )}
        {korak < 2 ? (
          <button type="button" className="b b-r" onClick={naprej}>
            Naprej →
          </button>
        ) : (
          <button className="b b-g" type="submit" disabled={caka}>
            {caka ? "Pošiljam…" : "Pošljite povpraševanje"}
          </button>
        )}
      </div>

      <p className="obr-drobno">Podatke in priloge uporabimo izključno za pripravo ponudbe.</p>
    </form>
  );
}

export default prevedeno(BespokeObrazec);

"use client";

import { useEffect, useState } from "react";
import { mojKontaktB2B, vprasajZaRok } from "@/lib/akcije/obrazci";
import { imaSejo } from "@/lib/b2b-klient";
import { dogodek } from "@/lib/dogodki";
import { prevedeno } from "@/lib/i18n/odjemalec";

// Okence »Vprašaj za rok«: sporočilo je že napisano, kupec samo pošlje.
// Prijavljen B2B kupec ne vpisuje ničesar, ostali vpišejo e-naslov za odgovor.
function VprasajZaRok({ sifra, naziv, dimenzija }) {
  const [odprto, setOdprto] = useState(false);
  const [b2b, setB2b] = useState(undefined); // undefined = preverjam, null = ni prijave
  const [email, setEmail] = useState("");
  const [ime, setIme] = useState("");
  const [telefon, setTelefon] = useState("");
  const [sporocilo, setSporocilo] = useState("");
  const [stanje, setStanje] = useState(null);
  const [caka, setCaka] = useState(false);

  const artikel = `${naziv ?? ""} ${dimenzija ?? ""}`.trim();

  useEffect(() => {
    if (!odprto) return;
    setSporocilo(`Pozdravljeni,\n\nzanima me rok dobave za artikel ${artikel} (šifra ${sifra}).\nKoličina: \n\nHvala.`);
    setStanje(null);
    const esc = (e) => e.key === "Escape" && setOdprto(false);
    window.addEventListener("keydown", esc);
    if (!imaSejo()) setB2b(null);
    else mojKontaktB2B().then((k) => setB2b(k)).catch(() => setB2b(null));
    return () => window.removeEventListener("keydown", esc);
  }, [odprto, artikel, sifra]);

  async function poslji(e) {
    e.preventDefault();
    setCaka(true);
    const r = await vprasajZaRok({ sifra, naziv, dimenzija, sporocilo, email, ime, telefon }).catch(() => ({
      stanje: "napaka",
      sporocilo: "Povezava ni uspela. Poskusite znova.",
    }));
    setCaka(false);
    setStanje(r);
    if (r?.stanje === "ok") dogodek("povprasevanje_poslano", { vir: "rok-dobave" });
  }

  return (
    <>
      <button type="button" className="rok-gumb" onClick={() => setOdprto(true)}>
        Vprašaj za rok →
      </button>

      {odprto && (
        <div className="rok-ozadje" onClick={() => setOdprto(false)}>
          <div className="rok-okno" role="dialog" aria-modal="true" aria-label="Vprašaj za rok dobave" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="rok-zapri" aria-label="Zapri" onClick={() => setOdprto(false)}>
              ×
            </button>
            <h3>Rok dobave</h3>
            <p className="rok-art">
              {artikel} <span>· {sifra}</span>
            </p>

            {stanje?.stanje === "ok" ? (
              <div className="rok-uspeh">
                <b>Poslano.</b>
                <p>Rok dobave vam sporočimo na {b2b?.email ?? email} v najkrajšem možnem času.</p>
                <button type="button" className="b b-d" onClick={() => setOdprto(false)}>
                  Zapri
                </button>
              </div>
            ) : (
              <form onSubmit={poslji}>
                {b2b ? (
                  <p className="rok-kdo">
                    Odgovorimo vam na <b>{b2b.email}</b>
                    {b2b.podjetje ? ` (${b2b.podjetje})` : ""}.
                  </p>
                ) : b2b === null ? (
                  <>
                    <label>
                      Kam vam odgovorimo? *
                      <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vas@email.si" autoFocus />
                    </label>
                    <div className="rok-dva">
                      <label>
                        Ime
                        <input type="text" value={ime} onChange={(e) => setIme(e.target.value)} autoComplete="name" />
                      </label>
                      <label>
                        Telefon
                        <input type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} autoComplete="tel" />
                      </label>
                    </div>
                  </>
                ) : (
                  <p className="rok-kdo">Preverjam prijavo …</p>
                )}
                <label>
                  Sporočilo
                  <textarea rows={6} value={sporocilo} onChange={(e) => setSporocilo(e.target.value)} />
                </label>
                {stanje?.stanje === "napaka" && <p className="obr-napaka">{stanje.sporocilo}</p>}
                <button className="b b-g" type="submit" disabled={caka || b2b === undefined}>
                  {caka ? "Pošiljam…" : "Pošlji"}
                </button>
                {b2b === null && <p className="rok-drobno">Podatke uporabimo samo za odgovor na to vprašanje.</p>}
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default prevedeno(VprasajZaRok);

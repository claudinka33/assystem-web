"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { dogodek } from "@/lib/dogodki";
import { prijavaNaNovice } from "@/lib/akcije/enovice";

// Rdeči pas z vzorcem vijakov nad nogo — prijava na e-novice (Resend Contacts).
export default function PrijavaNovice() {
  const [stanje, akcija, caka] = useActionState(prijavaNaNovice, null);

  useEffect(() => {
    if (stanje?.stanje === "ok") dogodek("prijava_novice");
  }, [stanje]);

  return (
    <section className="enov" aria-labelledby="enov-naslov">
      <div className="w">
        <div className="enov-besedilo">
          <h2 id="enov-naslov">Prijava na e-novice</h2>
          <p>Novi izdelki, akcijske cene in novosti iz naše proizvodnje — največ enkrat mesečno.</p>
        </div>

        {stanje?.stanje === "ok" ? (
          <p className="enov-uspeh" role="status">
            <b>Hvala, prijava je uspela.</b> Prvo e-novico prejmete ob naslednji izdaji.
          </p>
        ) : (
          <form action={akcija} className="enov-obr">
            <input
              type="text"
              name="polje_za_robote"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              style={{ position: "absolute", left: "-9999px" }}
            />
            <div className="enov-vrsta">
              <label className="sr-only" htmlFor="enov-ime">Ime</label>
              <input id="enov-ime" name="ime" type="text" placeholder="Ime" autoComplete="given-name" />
              <label className="sr-only" htmlFor="enov-email">E-naslov</label>
              <input id="enov-email" name="email" type="email" placeholder="Vaš e-naslov *" required autoComplete="email" />
              <button type="submit" disabled={caka}>{caka ? "Pošiljam …" : "Prijava"}</button>
            </div>
            <label className="enov-privolitev">
              <input type="checkbox" name="privolitev" required />
              <span>
                Strinjam se s prejemanjem e-novic AS system. Odjava je mogoča kadar koli prek povezave v vsakem sporočilu.{" "}
                <Link href="/zasebnost">Varstvo podatkov</Link>
              </span>
            </label>
            {stanje?.stanje === "napaka" && <p className="enov-napaka" role="alert">{stanje.sporocilo}</p>}
          </form>
        )}
      </div>
    </section>
  );
}

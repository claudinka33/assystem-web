"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { oddajPopupB2B } from "@/lib/akcije/obrazci";

const KLJUC = "as_popup_b2b"; // "zaprto:<čas>" ali "oddano"
const ZAKASNITEV = 15000; // 15 s na strani
const PREMOR_DNI = 7; // po zaprtju se 7 dni ne pokaže
const BREZ = ["/blagajna", "/kosarica", "/b2b", "/v-pripravi", "/zaposlitev"];

const beri = () => {
  try {
    return localStorage.getItem(KLJUC) || "";
  } catch {
    return "";
  }
};
const pisi = (v) => {
  try {
    localStorage.setItem(KLJUC, v);
  } catch {}
};

export default function PopupB2B() {
  const pot = usePathname() || "/";
  const [odprt, setOdprt] = useState(false);
  const [stanje, oddaj, poteka] = useActionState(oddajPopupB2B, null);

  useEffect(() => {
    if (BREZ.some((p) => pot === p || pot.startsWith(p + "/"))) return;
    if (/(^|;\s*)sb-b2b-auth-token/.test(document.cookie)) return; // že B2B kupec
    const v = beri();
    if (v === "oddano") return;
    if (v.startsWith("zaprto:") && Date.now() - Number(v.slice(7)) < PREMOR_DNI * 86400000) return;
    const t = setTimeout(() => setOdprt(true), ZAKASNITEV);
    return () => clearTimeout(t);
  }, [pot]);

  useEffect(() => {
    if (stanje?.stanje === "ok") pisi("oddano");
  }, [stanje]);

  useEffect(() => {
    if (!odprt) return;
    const esc = (e) => e.key === "Escape" && zapri();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  });

  function zapri() {
    if (stanje?.stanje !== "ok") pisi(`zaprto:${Date.now()}`);
    setOdprt(false);
  }

  if (!odprt) return null;
  const ok = stanje?.stanje === "ok";

  return (
    <div className="popb2b-zavesa" onClick={(e) => e.target === e.currentTarget && zapri()} role="dialog" aria-modal="true" aria-labelledby="popb2b-naslov">
      <div className="popb2b">
        <button type="button" className="popb2b-x" onClick={zapri} aria-label="Zapri">×</button>
        <div className="popb2b-levo" aria-hidden="true">
          <span className="popb2b-znacka">B2B</span>
          <b>Cene za podjetja</b>
          <ul>
            <li>Ponudba v 1–2 delovnih dneh</li>
            <li>Posebne cene in rabati</li>
            <li>Plačilo na račun</li>
            <li>Lastna proizvodnja od 1993</li>
          </ul>
        </div>
        <div className="popb2b-desno">
          {ok ? (
            <div className="popb2b-hvala">
              <div className="popb2b-kljukica">✓</div>
              <h2 id="popb2b-naslov">Hvala! Prejeli smo vaš kontakt.</h2>
              <p>V 1–2 delovnih dneh vas kontaktiramo in pripravimo ponudbo za vaše podjetje.</p>
              <button type="button" className="popb2b-gumb" onClick={() => setOdprt(false)}>Nadaljuj na strani</button>
            </div>
          ) : (
            <>
              <p className="popb2b-nad">Pritrdilna tehnika ASfix · vijačno blago ASco</p>
              <h2 id="popb2b-naslov">Kupujete za podjetje?</h2>
              <p className="popb2b-opis">
                Pustite kontakt — v <b>1–2 delovnih dneh</b> vas pokličemo in pripravimo <b>ponudbo s cenami za vaše podjetje</b>.
              </p>
              <form action={oddaj}>
                <input type="text" name="polje_za_robote" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: -9999 }} aria-hidden="true" />
                <input type="hidden" name="stran" value={pot} />
                <input type="email" name="email" required placeholder="Službeni e-naslov *" autoComplete="email" autoFocus />
                <div className="popb2b-vrsta">
                  <input type="text" name="podjetje" placeholder="Podjetje" autoComplete="organization" />
                  <input type="tel" name="telefon" placeholder="Telefon" autoComplete="tel" />
                </div>
                <label className="popb2b-kljuk">
                  <input type="checkbox" name="novice" defaultChecked />
                  <span>Pošiljajte mi tudi akcije in novosti za podjetja (odjava kadarkoli).</span>
                </label>
                {stanje?.stanje === "napaka" && <p className="popb2b-napaka">{stanje.sporocilo}</p>}
                <button className="popb2b-gumb" type="submit" disabled={poteka}>{poteka ? "Pošiljam …" : "Pošljite mi ponudbo"}</button>
                <p className="popb2b-mali">
                  Podatke uporabimo samo za pripravo ponudbe. <Link href="/zasebnost">Politika zasebnosti</Link>
                  {" · "}Že imate B2B račun? <Link href="/b2b" onClick={zapri}>Prijava</Link>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

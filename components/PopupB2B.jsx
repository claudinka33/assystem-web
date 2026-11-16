"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { oddajPopupB2B } from "@/lib/akcije/obrazci";
import { prevedeno } from "@/lib/i18n/odjemalec";

import { PRIVZETO_POPUP } from "@/lib/popup";

const KLJUC = "as_popup_b2b"; // "zaprto:<čas>" ali "oddano"

// **besedilo** -> krepko
const krepko = (s) =>
  String(s ?? "")
    .split(/(\*\*[^*]+\*\*)/)
    .map((d, i) => (d.startsWith("**") && d.endsWith("**") ? <b key={i}>{d.slice(2, -2)}</b> : d));

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

function PopupB2B({ n = PRIVZETO_POPUP }) {
  const pot = usePathname() || "/";
  const ZAKASNITEV = Number(n.zakasnitev ?? 15) * 1000;
  const PREMOR_DNI = Number(n.premor ?? 7);
  const BREZ = n.brezStrani ?? [];
  const [odprt, setOdprt] = useState(false);
  const [stanje, oddaj, poteka] = useActionState(oddajPopupB2B, null);

  useEffect(() => {
    if (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("popup") === "1") {
      const t0 = setTimeout(() => setOdprt(true), 300); // predogled iz administracije
      return () => clearTimeout(t0);
    }
    if (!n.vklopljen) return;
    if (BREZ.some((p) => pot === p || pot.startsWith(p + "/"))) return;
    if (/(^|;\s*)sb-b2b-auth-token/.test(document.cookie)) return; // že B2B kupec
    const v = beri();
    if (v === "oddano") return;
    if (v.startsWith("zaprto:") && Date.now() - Number(v.slice(7)) < PREMOR_DNI * 86400000) return;
    const t = setTimeout(() => setOdprt(true), ZAKASNITEV);
    return () => clearTimeout(t);
  }, [pot]); // eslint-disable-line react-hooks/exhaustive-deps

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
          {n.znacka && <span className="popb2b-znacka">{n.znacka}</span>}
          <b>{n.naslovLevo}</b>
          <ul>
            {(n.alineje ?? []).map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
        <div className="popb2b-desno">
          {ok ? (
            <div className="popb2b-hvala">
              <div className="popb2b-kljukica">✓</div>
              <h2 id="popb2b-naslov">{n.hvalaNaslov}</h2>
              <p>{n.hvalaBesedilo}</p>
              <button type="button" className="popb2b-gumb" onClick={() => setOdprt(false)}>Nadaljuj na strani</button>
            </div>
          ) : (
            <>
              {n.nadnaslov && <p className="popb2b-nad">{n.nadnaslov}</p>}
              <h2 id="popb2b-naslov">{n.naslov}</h2>
              <p className="popb2b-opis">{krepko(n.opis)}</p>
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
                <button className="popb2b-gumb" type="submit" disabled={poteka}>{poteka ? "Pošiljam …" : n.gumb}</button>
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

export default prevedeno(PopupB2B);

"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { dogodek } from "@/lib/dogodki";
import { registracija, poisciPodjetjeJavno } from "@/lib/akcije/b2b";

export default function Registracija() {
  const [stanje, akcija, cakam] = useActionState(registracija, null);
  const [davcna, setDavcna] = useState("");
  const [podj, setPodj] = useState({ podjetje: "", naslov: "", posta: "", kraj: "" });
  const [iskanje, setIskanje] = useState(null);
  const [isce, zacni] = useTransition();
  const poisci = () =>
    zacni(async () => {
      const r = await poisciPodjetjeJavno(davcna);
      setIskanje(r);
      if (r?.najdeno) setPodj({ podjetje: r.podjetje, naslov: r.naslov, posta: r.posta, kraj: r.kraj });
    });
  const polje = (k) => ({ value: podj[k], onChange: (e) => setPodj({ ...podj, [k]: e.target.value }) });
  useEffect(() => {
    if (stanje?.ok && !stanje.obstojec) dogodek("b2b_registracija");
  }, [stanje]);
  if (stanje?.ok && stanje.obstojec)
    return (
      <div className="b2b-ok">
        <b>Podjetje je dodano tvojemu obstoječemu računu.</b> Prijavi se na <Link href="/b2b">B2B prijavi</Link> z istim geslom —
        podatke podjetja preverimo v nekaj minutah.
      </div>
    );
  if (stanje?.ok)
    return (
      <div className="b2b-ok">
        <b>Skoraj končano.</b> Na <b>{stanje.email}</b> smo poslali povezavo za potrditev e-naslova. Klikni jo, nato se lahko prijaviš.
        Če sporočila ni v nekaj minutah, preveri mapo z neželeno pošto.
      </div>
    );
  return (
    <form action={akcija}>
      {stanje?.napaka && <p className="blag-nap">{stanje.napaka}</p>}
      <div className="blag-polja reg-mreza">
        <label className="r2">
          Davčna številka *
          <span style={{ display: "flex", gap: 8 }}>
            <input
              name="davcna"
              required
              placeholder="SI12345678"
              inputMode="text"
              value={davcna}
              onChange={(e) => setDavcna(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  poisci();
                }
              }}
              style={{ flex: 1, minWidth: 0 }}
            />
            <button type="button" className="b b-d" onClick={poisci} disabled={isce || davcna.replace(/\D/g, "").length < 8} style={{ whiteSpace: "nowrap", padding: "0 14px" }}>
              {isce ? "Iščem …" : "Poišči"}
            </button>
          </span>
          {iskanje?.najdeno && <small style={{ color: "#1a7f3c" }}>Podatki so izpolnjeni — preverite jih.</small>}
          {iskanje && !iskanje.najdeno && iskanje.napaka && <small style={{ color: "var(--color-red)" }}>{iskanje.napaka}</small>}
        </label>
        <label className="r2">Naziv podjetja *<input name="podjetje" required autoComplete="organization" {...polje("podjetje")} /></label>
        <label className="r2">Ulica in hišna številka<input name="naslov" autoComplete="street-address" {...polje("naslov")} /></label>
        <label>Poštna številka<input name="posta" autoComplete="postal-code" {...polje("posta")} /></label>
        <label>Kraj<input name="kraj" autoComplete="address-level2" {...polje("kraj")} /></label>
        <label className="r2">
          Poslovalnica (neobvezno — prazno = sedež)
          <input name="poslovalnica" placeholder="npr. PE Celje, Mariborska 10" />
        </label>
        <label>Ime in priimek *<input name="ime" required autoComplete="name" /></label>
        <label>Telefon *<input name="telefon" required autoComplete="tel" /></label>
        <label className="r2">Službeni e-naslov *<input name="email" type="email" required autoComplete="email" /></label>
        <label>Geslo * (min. 8 znakov)<input name="geslo" type="password" required minLength={8} autoComplete="new-password" /></label>
        <label>Ponovi geslo *<input name="geslo2" type="password" required minLength={8} autoComplete="new-password" /></label>
      </div>
      <p className="blag-op" style={{ margin: "10px 0 6px" }}>
        Uporabite službeni e-naslov podjetja — če se ujema s podatki v našem sistemu, dostop odobrimo samodejno.
      </p>
      <div className="reg-dno">
        <label className="blag-pog" style={{ margin: 0 }}>
          <input type="checkbox" name="pogoji" required /> Strinjam se s{" "}
          <Link href="/splosni-pogoji" target="_blank">splošnimi pogoji poslovanja</Link> in z obdelavo podatkov po{" "}
          <Link href="/zasebnost" target="_blank">politiki zasebnosti</Link>.
        </label>
        <button className="b b-r" type="submit" disabled={cakam}>{cakam ? "Pošiljam …" : "Registriraj podjetje"}</button>
      </div>
    </form>
  );
}

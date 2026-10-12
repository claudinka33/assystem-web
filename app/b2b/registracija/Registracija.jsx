"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registracija } from "@/lib/akcije/b2b";

export default function Registracija() {
  const [stanje, akcija, cakam] = useActionState(registracija, null);
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
      <div className="blag-polja">
        <label className="cela">Naziv podjetja *<input name="podjetje" required autoComplete="organization" /></label>
        <label>Davčna številka *<input name="davcna" required placeholder="SI12345678" inputMode="text" /></label>
        <label>Telefon *<input name="telefon" required autoComplete="tel" /></label>
        <label className="cela">Ulica in hišna številka<input name="naslov" autoComplete="street-address" /></label>
        <label>Poštna številka<input name="posta" autoComplete="postal-code" /></label>
        <label>Kraj<input name="kraj" autoComplete="address-level2" /></label>
        <label>Ime in priimek *<input name="ime" required autoComplete="name" /></label>
        <label>Službeni e-naslov *<input name="email" type="email" required autoComplete="email" /></label>
        <label>Geslo * (vsaj 8 znakov)<input name="geslo" type="password" required minLength={8} autoComplete="new-password" /></label>
        <label>Ponovi geslo *<input name="geslo2" type="password" required minLength={8} autoComplete="new-password" /></label>
      </div>
      <p className="blag-op" style={{ marginTop: 12 }}>
        Uporabi službeni e-naslov podjetja — če se ujema s podatki v našem sistemu, dostop odobrimo samodejno.
      </p>
      <label className="blag-pog">
        <input type="checkbox" name="pogoji" required /> Strinjam se s{" "}
        <Link href="/splosni-pogoji" target="_blank">splošnimi pogoji poslovanja</Link> in z obdelavo podatkov po{" "}
        <Link href="/zasebnost" target="_blank">politiki zasebnosti</Link>.
      </label>
      <button className="b b-r" type="submit" disabled={cakam}>{cakam ? "Pošiljam …" : "Registriraj podjetje"}</button>
    </form>
  );
}

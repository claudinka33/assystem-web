"use client";

import { useActionState } from "react";
import { pozabljenoGeslo } from "@/lib/akcije/b2b";

export default function Pozabljeno() {
  const [stanje, akcija, cakam] = useActionState(pozabljenoGeslo, null);
  if (stanje?.ok)
    return <div className="b2b-ok">Če je e-naslov registriran, smo nanj poslali povezavo za novo geslo. Povezava velja 1 uro.</div>;
  return (
    <form action={akcija} className="b2b-obr">
      {stanje?.napaka && <p className="blag-nap">{stanje.napaka}</p>}
      <label>E-naslov<input name="email" type="email" required autoComplete="username" /></label>
      <button className="b b-r" type="submit" disabled={cakam}>{cakam ? "Pošiljam …" : "Pošlji povezavo"}</button>
    </form>
  );
}

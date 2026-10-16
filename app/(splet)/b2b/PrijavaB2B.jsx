"use client";

import { useActionState } from "react";
import { prijava } from "@/lib/akcije/b2b";

export default function PrijavaB2B({ naprej }) {
  const [stanje, akcija, cakam] = useActionState(prijava, null);
  return (
    <form action={akcija} className="b2b-obr">
      <input type="hidden" name="naprej" value={naprej} />
      {stanje?.napaka && <p className="blag-nap">{stanje.napaka}</p>}
      <label>E-naslov<input name="email" type="email" required autoComplete="username" /></label>
      <label>Geslo<input name="geslo" type="password" required autoComplete="current-password" /></label>
      <button className="b b-r" type="submit" disabled={cakam}>{cakam ? "Prijavljam …" : "Prijava"}</button>
    </form>
  );
}

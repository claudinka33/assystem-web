"use client";

import { useActionState } from "react";
import { novoGeslo } from "@/lib/akcije/b2b";
import { prevedeno } from "@/lib/i18n/odjemalec";

function NovoGeslo() {
  const [stanje, akcija, cakam] = useActionState(novoGeslo, null);
  return (
    <form action={akcija} className="b2b-obr">
      {stanje?.napaka && <p className="blag-nap">{stanje.napaka}</p>}
      <label>Novo geslo (vsaj 8 znakov)<input name="geslo" type="password" required minLength={8} autoComplete="new-password" /></label>
      <label>Ponovi geslo<input name="geslo2" type="password" required minLength={8} autoComplete="new-password" /></label>
      <button className="b b-g" type="submit" disabled={cakam}>{cakam ? "Shranjujem …" : "Shrani geslo"}</button>
    </form>
  );
}

export default prevedeno(NovoGeslo);

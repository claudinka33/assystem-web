import { redirect } from "next/navigation";
import { supabaseServer, trenutniAdmin } from "@/lib/supabase-server";
import PrijavaObrazec from "./PrijavaObrazec";
import MicrosoftGumb from "./MicrosoftGumb";
import Odjava from "../Odjava";

export const dynamic = "force-dynamic";

export default async function Prijava({ searchParams }) {
  const sp = (await searchParams) ?? {};
  const sb = await supabaseServer();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (user && (await trenutniAdmin())) redirect("/admin");

  return (
    <div className="prijava">
      <div className="box">
        <img className="prijava-logo" src="/logo-as-system.png" alt="AS system" />
        <h1>Administracija</h1>
        <p className="pod">Prijava za urejanje spletne strani assystem.si.</p>

        {user ? (
          <>
            <div className="opozorilo">
              Račun <b>{user.email}</b> nima dostopa do administracije. Za dostop se obrni na Claudio Seidl.
            </div>
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <Odjava />
            </div>
          </>
        ) : (
          <>
            {sp.napaka === "ms" && <div className="opozorilo">Prijava z Microsoft ni uspela. Poskusi znova.</div>}
            <MicrosoftGumb />
            <p style={{ textAlign: "center", fontSize: 13, opacity: 0.6, margin: "18px 0 10px" }}>ali z e-naslovom in geslom</p>
            <PrijavaObrazec />
          </>
        )}

        <p className="prijava-noga">Dostop imajo samo pooblaščeni uredniki.</p>
      </div>
    </div>
  );
}

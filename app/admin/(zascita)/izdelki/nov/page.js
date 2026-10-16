import { supabaseAdmin } from "@/lib/supabase-server";
import IzdelekObrazec from "../IzdelekObrazec";

export const dynamic = "force-dynamic";

export default async function NovIzdelek() {
  const { data } = await supabaseAdmin().from("kategorije").select("id, naziv").order("naziv");

  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">Izdelki</div>
          <h1>Nov izdelek</h1>
        </div>
      </div>
      <div className="adm-telo izd-telo">
        <div className="izd-manjka" style={{ background: "#f4f7fb", borderColor: "#d6e0ec", borderLeftColor: "#3f4140" }}>
          Najprej vpiši osnovne podatke in izdelek ustvari — nato dodaš slike, videe, artikle in dokumente.
        </div>
        <IzdelekObrazec kategorije={data ?? []} />
      </div>
    </>
  );
}

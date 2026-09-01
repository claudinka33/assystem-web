import { supabaseAdmin } from "@/lib/supabase-server";
import IzdelekObrazec from "../IzdelekObrazec";

export const dynamic = "force-dynamic";

export default async function NovIzdelek() {
  const { data } = await supabaseAdmin().from("kategorije").select("id, naziv").order("naziv");

  return (
    <>
      <div className="adm-glava">
        <h1>Nov izdelek</h1>
      </div>
      <div className="adm-telo">
        <IzdelekObrazec kategorije={data ?? []} />
        <div className="namig" style={{ marginTop: 14, fontSize: 13, color: "#6e767e" }}>
          Artikle (šifre, dimenzije, cene) in dokumente dodaš, ko izdelek prvič shraniš.
        </div>
      </div>
    </>
  );
}

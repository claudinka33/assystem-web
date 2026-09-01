import { supabaseAdmin } from "@/lib/supabase-server";
import KategorijaObrazec from "../KategorijaObrazec";

export const dynamic = "force-dynamic";

export default async function NovaKategorija() {
  const { data } = await supabaseAdmin().from("kategorije").select("id, naziv").order("naziv");

  return (
    <>
      <div className="adm-glava">
        <h1>Nova kategorija</h1>
      </div>
      <div className="adm-telo">
        <KategorijaObrazec kategorije={data ?? []} />
      </div>
    </>
  );
}

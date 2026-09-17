import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import DelovnoMestoObrazec from "../DelovnoMestoObrazec";

export const dynamic = "force-dynamic";

export default async function UrediDelovnoMesto({ params }) {
  const { id } = await params;
  const { data } = await supabaseAdmin().from("delovna_mesta").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();

  return (
    <>
      <div className="adm-glava">
        <h1>{data.naziv}</h1>
      </div>
      <div className="adm-telo">
        <DelovnoMestoObrazec mesto={data} />
      </div>
    </>
  );
}

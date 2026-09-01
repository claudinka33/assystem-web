import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import NovicaObrazec from "../NovicaObrazec";

export const dynamic = "force-dynamic";

export default async function UrediNovico({ params }) {
  const { id } = await params;
  const { data } = await supabaseAdmin().from("novice").select("*").eq("id", id).single();
  if (!data) notFound();

  return (
    <>
      <div className="adm-glava">
        <h1>{data.naslov}</h1>
      </div>
      <div className="adm-telo">
        <NovicaObrazec novica={data} />
      </div>
    </>
  );
}

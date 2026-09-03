import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { shraniVsebino } from "@/lib/akcije/skupno";
import NalozSliko from "@/app/admin/NalozSliko";

export const dynamic = "force-dynamic";

export default async function UrediVsebino({ params }) {
  const { kljuc } = await params;
  const { data } = await supabaseAdmin()
    .from("vsebine")
    .select("*")
    .eq("kljuc", decodeURIComponent(kljuc))
    .maybeSingle();

  if (!data) notFound();

  return (
    <>
      <div className="adm-glava">
        <h1>Uredi besedilo</h1>
        <span style={{ fontSize: 13, color: "#6e7276" }}>{data.kljuc}</span>
      </div>

      <div className="adm-telo">
        <form className="adm-obr" action={shraniVsebino}>
          <input type="hidden" name="kljuc" value={data.kljuc} />

          <div className="adm-polje">
            <label htmlFor="naslov">Naslov</label>
            <input id="naslov" name="naslov" type="text" defaultValue={data.naslov ?? ""} />
          </div>

          <div className="adm-polje">
            <label htmlFor="besedilo">Besedilo</label>
            <textarea id="besedilo" name="besedilo" defaultValue={data.besedilo ?? ""} style={{ minHeight: 160 }} />
            <p className="namig">Prazna vrstica pomeni nov odstavek.</p>
          </div>

          <NalozSliko ime="slika_url" zacetna={data.slika_url} oznaka="Slika (če blok ima sliko)" />

          <button className="gumb" type="submit">
            Shrani
          </button>{" "}
          <Link className="gumb siv" href="/admin/vsebine">
            Prekliči
          </Link>
        </form>
      </div>
    </>
  );
}

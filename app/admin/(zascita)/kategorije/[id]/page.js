import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import KategorijaObrazec from "../KategorijaObrazec";
import { lokalnaSlikaKategorije } from "@/lib/podatki";

export const dynamic = "force-dynamic";

export default async function UrediKategorijo({ params }) {
  const { id } = await params;
  const sb = supabaseAdmin();

  const [{ data: kategorija }, { data: vse }] = await Promise.all([
    sb.from("kategorije").select("*").eq("id", id).single(),
    sb.from("kategorije").select("id, naziv").order("naziv"),
  ]);

  if (!kategorija) notFound();
  const lokalnaSlika = lokalnaSlikaKategorije(kategorija.slug, kategorija.naziv);

  return (
    <>
      <div className="adm-glava">
        <h1>{kategorija.naziv}</h1>
      </div>
      <div className="adm-telo">
        {lokalnaSlika && (
          <div className="opozorilo" style={{ display: "flex", gap: 14, alignItems: "center", maxWidth: 920 }}>
            <img src={lokalnaSlika} alt="" style={{ width: 64, height: 64, objectFit: "contain", background: "#fff", borderRadius: 6 }} />
            <span>
              Na strani se za to kategorijo prikazuje slika iz repa (<code>{lokalnaSlika}</code>).
              Ima prednost pred sliko, naloženo spodaj — za zamenjavo jo je treba zamenjati v repu.
            </span>
          </div>
        )}
        <KategorijaObrazec kategorija={kategorija} kategorije={vse ?? []} />
      </div>
    </>
  );
}

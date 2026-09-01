import Link from "next/link";
import { shraniNovico } from "@/lib/akcije/skupno";
import NalozSliko from "@/app/admin/NalozSliko";

export default function NovicaObrazec({ novica }) {
  const n = novica ?? {};

  return (
    <form className="adm-obr" action={shraniNovico}>
      {n.id && <input type="hidden" name="id" value={n.id} />}

      <div className="adm-polje">
        <label htmlFor="naslov">Naslov *</label>
        <input id="naslov" name="naslov" type="text" defaultValue={n.naslov ?? ""} required />
      </div>

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="slug">Slug</label>
          <input id="slug" name="slug" type="text" defaultValue={n.slug ?? ""} />
        </div>
        <div className="adm-polje">
          <label htmlFor="objavljeno_dne">Datum objave</label>
          <input
            id="objavljeno_dne"
            name="objavljeno_dne"
            type="date"
            defaultValue={n.objavljeno_dne ?? new Date().toISOString().slice(0, 10)}
          />
        </div>
      </div>

      <div className="adm-polje">
        <label htmlFor="povzetek">Povzetek</label>
        <textarea id="povzetek" name="povzetek" defaultValue={n.povzetek ?? ""} style={{ minHeight: 70 }} />
      </div>

      <div className="adm-polje">
        <label htmlFor="vsebina">Vsebina</label>
        <textarea id="vsebina" name="vsebina" defaultValue={n.vsebina ?? ""} style={{ minHeight: 220 }} />
        <p className="namig">Prazna vrstica pomeni nov odstavek.</p>
      </div>

      <NalozSliko ime="slika_url" zacetna={n.slika_url} oznaka="Naslovna slika" />

      <div className="adm-polje">
        <label style={{ fontWeight: 400, display: "flex", gap: 8, alignItems: "center" }}>
          <input name="objavljeno" type="checkbox" defaultChecked={n.objavljeno ?? false} />
          Objavljeno na spletni strani
        </label>
      </div>

      <button className="gumb" type="submit">
        Shrani
      </button>{" "}
      <Link className="gumb siv" href="/admin/novice">
        Prekliči
      </Link>
    </form>
  );
}

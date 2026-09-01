import Link from "next/link";
import { shraniKategorijo } from "@/lib/akcije/skupno";
import NalozSliko from "@/app/admin/NalozSliko";

export default function KategorijaObrazec({ kategorija, kategorije }) {
  const k = kategorija ?? {};

  return (
    <form className="adm-obr" action={shraniKategorijo}>
      {k.id && <input type="hidden" name="id" value={k.id} />}

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="naziv">Naziv *</label>
          <input id="naziv" name="naziv" type="text" defaultValue={k.naziv ?? ""} required />
        </div>
        <div className="adm-polje">
          <label htmlFor="slug">Slug (naslov v povezavi)</label>
          <input id="slug" name="slug" type="text" defaultValue={k.slug ?? ""} />
          <p className="namig">Pusti prazno in se ustvari sam iz naziva.</p>
        </div>
      </div>

      <div className="adm-polje">
        <label htmlFor="opis">Kratek opis</label>
        <textarea id="opis" name="opis" defaultValue={k.opis ?? ""} style={{ minHeight: 80 }} />
      </div>

      <NalozSliko ime="slika_url" zacetna={k.slika_url} oznaka="Slika kategorije" />

      <div className="adm-vrsta-3">
        <div className="adm-polje">
          <label htmlFor="nadrejena_id">Nadrejena kategorija</label>
          <select id="nadrejena_id" name="nadrejena_id" defaultValue={k.nadrejena_id ?? ""}>
            <option value="">— brez (glavna skupina) —</option>
            {kategorije
              .filter((x) => x.id !== k.id)
              .map((x) => (
                <option key={x.id} value={x.id}>
                  {x.naziv}
                </option>
              ))}
          </select>
        </div>
        <div className="adm-polje">
          <label htmlFor="vrstni_red">Vrstni red</label>
          <input id="vrstni_red" name="vrstni_red" type="number" defaultValue={k.vrstni_red ?? 0} />
        </div>
        <div className="adm-polje">
          <label htmlFor="objavljeno">Objava</label>
          <label style={{ fontWeight: 400, display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
            <input
              id="objavljeno"
              name="objavljeno"
              type="checkbox"
              defaultChecked={k.objavljeno ?? true}
            />
            Prikaži na spletni strani
          </label>
        </div>
      </div>

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="seo_naslov">SEO naslov</label>
          <input id="seo_naslov" name="seo_naslov" type="text" defaultValue={k.seo_naslov ?? ""} />
        </div>
        <div className="adm-polje">
          <label htmlFor="seo_opis">SEO opis</label>
          <input id="seo_opis" name="seo_opis" type="text" defaultValue={k.seo_opis ?? ""} />
        </div>
      </div>

      <button className="gumb" type="submit">
        Shrani
      </button>{" "}
      <Link className="gumb siv" href="/admin/kategorije">
        Prekliči
      </Link>
    </form>
  );
}

import Link from "next/link";
import { shraniIzdelek } from "@/lib/akcije/skupno";
import NalozSliko from "@/app/admin/NalozSliko";

export default function IzdelekObrazec({ izdelek, kategorije }) {
  const i = izdelek ?? {};
  const vrstice = (polje) => (Array.isArray(polje) ? polje.join("\n") : "");

  return (
    <form className="adm-obr" action={shraniIzdelek}>
      {i.id && <input type="hidden" name="id" value={i.id} />}

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="naziv">Naziv *</label>
          <input id="naziv" name="naziv" type="text" defaultValue={i.naziv ?? ""} required />
        </div>
        <div className="adm-polje">
          <label htmlFor="kategorija_id">Kategorija</label>
          <select id="kategorija_id" name="kategorija_id" defaultValue={i.kategorija_id ?? ""}>
            <option value="">— izberi —</option>
            {kategorije.map((k) => (
              <option key={k.id} value={k.id}>
                {k.naziv}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="slug">Slug</label>
          <input id="slug" name="slug" type="text" defaultValue={i.slug ?? ""} />
          <p className="namig">Pusti prazno in se ustvari sam.</p>
        </div>
        <div className="adm-polje">
          <label htmlFor="eta_stevilka">Številka ETA</label>
          <input id="eta_stevilka" name="eta_stevilka" type="text" defaultValue={i.eta_stevilka ?? ""} placeholder="npr. ETA-20/0533" />
        </div>
      </div>

      <div className="adm-polje">
        <label htmlFor="kratek_opis">Kratek opis (v seznamu)</label>
        <textarea id="kratek_opis" name="kratek_opis" defaultValue={i.kratek_opis ?? ""} style={{ minHeight: 70 }} />
      </div>

      <div className="adm-polje">
        <label htmlFor="opis">Opis izdelka</label>
        <textarea id="opis" name="opis" defaultValue={i.opis ?? ""} />
      </div>

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="uporaba">Uporaba (ena postavka na vrstico)</label>
          <textarea id="uporaba" name="uporaba" defaultValue={vrstice(i.uporaba)} />
        </div>
        <div className="adm-polje">
          <label htmlFor="prednosti">Prednosti (ena na vrstico)</label>
          <textarea id="prednosti" name="prednosti" defaultValue={vrstice(i.prednosti)} />
        </div>
      </div>

      <div className="adm-polje">
        <label htmlFor="tehnicni_opis">Tehnični opis</label>
        <textarea id="tehnicni_opis" name="tehnicni_opis" defaultValue={i.tehnicni_opis ?? ""} style={{ minHeight: 90 }} />
      </div>

      <NalozSliko ime="slika_url" zacetna={i.slika_url} oznaka="Glavna slika izdelka" />

      <div className="adm-vrsta-3">
        <div className="adm-polje">
          <label htmlFor="material">Material</label>
          <input id="material" name="material" type="text" defaultValue={i.material ?? ""} placeholder="npr. jeklo ZnB" />
        </div>
        <div className="adm-polje">
          <label htmlFor="vrstni_red">Vrstni red</label>
          <input id="vrstni_red" name="vrstni_red" type="number" defaultValue={i.vrstni_red ?? 0} />
        </div>
        <div className="adm-polje">
          <label htmlFor="objavljeno">Objava</label>
          <label style={{ fontWeight: 400, display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
            <input id="objavljeno" name="objavljeno" type="checkbox" defaultChecked={i.objavljeno ?? true} />
            Prikaži na strani
          </label>
        </div>
      </div>

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="seo_naslov">SEO naslov</label>
          <input id="seo_naslov" name="seo_naslov" type="text" defaultValue={i.seo_naslov ?? ""} />
        </div>
        <div className="adm-polje">
          <label htmlFor="seo_opis">SEO opis</label>
          <input id="seo_opis" name="seo_opis" type="text" defaultValue={i.seo_opis ?? ""} />
        </div>
      </div>

      <button className="gumb" type="submit">
        Shrani
      </button>{" "}
      <Link className="gumb siv" href="/admin/izdelki">
        Nazaj
      </Link>
    </form>
  );
}

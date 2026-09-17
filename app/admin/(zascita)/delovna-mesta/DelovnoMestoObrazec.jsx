import Link from "next/link";
import { shraniDelovnoMesto } from "@/lib/akcije/skupno";
import NalozSliko from "@/app/admin/NalozSliko";

export default function DelovnoMestoObrazec({ mesto }) {
  const m = mesto ?? {};
  const vrstice = (polje) => (Array.isArray(polje) ? polje.join("\n") : "");

  return (
    <form className="adm-obr" action={shraniDelovnoMesto}>
      {m.id && <input type="hidden" name="id" value={m.id} />}

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="naziv">Naziv delovnega mesta *</label>
          <input id="naziv" name="naziv" type="text" defaultValue={m.naziv ?? ""} required />
        </div>
        <div className="adm-polje">
          <label htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            type="text"
            defaultValue={m.slug ?? ""}
            pattern="[a-z0-9-]*"
            placeholder="npr. orodjar"
          />
          <p className="namig">Del spletnega naslova. Pusti prazno in se ustvari sam.</p>
        </div>
      </div>

      <div className="adm-vrsta-3">
        <div className="adm-polje">
          <label htmlFor="lokacija">Lokacija</label>
          <input id="lokacija" name="lokacija" type="text" defaultValue={m.lokacija ?? ""} placeholder="Šmarje pri Jelšah" />
        </div>
        <div className="adm-polje">
          <label htmlFor="vrsta">Vrsta zaposlitve</label>
          <input id="vrsta" name="vrsta" type="text" defaultValue={m.vrsta ?? ""} placeholder="polni čas" />
        </div>
        <div className="adm-polje">
          <label htmlFor="rok_prijave">Rok prijave</label>
          <input id="rok_prijave" name="rok_prijave" type="date" defaultValue={m.rok_prijave ?? ""} />
        </div>
      </div>

      <div className="adm-polje">
        <label htmlFor="kratek_opis">Kratek opis (v seznamu)</label>
        <input id="kratek_opis" name="kratek_opis" type="text" defaultValue={m.kratek_opis ?? ""} />
      </div>

      <div className="adm-polje">
        <label htmlFor="opis">Opis delovnega mesta</label>
        <textarea id="opis" name="opis" defaultValue={m.opis ?? ""} />
      </div>

      <div className="adm-vrsta-3">
        <div className="adm-polje">
          <label htmlFor="naloge">Naloge (ena na vrstico)</label>
          <textarea id="naloge" name="naloge" defaultValue={vrstice(m.naloge)} />
        </div>
        <div className="adm-polje">
          <label htmlFor="pricakujemo">Pričakujemo (ena na vrstico)</label>
          <textarea id="pricakujemo" name="pricakujemo" defaultValue={vrstice(m.pricakujemo)} />
        </div>
        <div className="adm-polje">
          <label htmlFor="ponujamo">Ponujamo (ena na vrstico)</label>
          <textarea id="ponujamo" name="ponujamo" defaultValue={vrstice(m.ponujamo)} />
        </div>
      </div>

      <NalozSliko ime="slika_url" zacetna={m.slika_url} oznaka="Slika delovnega mesta" />

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="vrstni_red">Vrstni red</label>
          <input id="vrstni_red" name="vrstni_red" type="number" defaultValue={m.vrstni_red ?? 0} />
        </div>
        <div className="adm-polje">
          <label>Objava</label>
          <label style={{ fontWeight: 400, display: "flex", gap: 8, alignItems: "center", marginTop: 10 }}>
            <input name="aktivno" type="checkbox" defaultChecked={m.aktivno ?? true} />
            Prikaži med odprtimi mesti
          </label>
        </div>
      </div>

      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="seo_naslov">SEO naslov</label>
          <input id="seo_naslov" name="seo_naslov" type="text" defaultValue={m.seo_naslov ?? ""} />
        </div>
        <div className="adm-polje">
          <label htmlFor="seo_opis">SEO opis</label>
          <input id="seo_opis" name="seo_opis" type="text" defaultValue={m.seo_opis ?? ""} />
        </div>
      </div>

      <button className="gumb" type="submit">
        Shrani
      </button>{" "}
      <Link className="gumb siv" href="/admin/delovna-mesta">
        Prekliči
      </Link>
    </form>
  );
}

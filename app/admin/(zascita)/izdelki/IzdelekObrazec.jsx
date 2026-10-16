import Link from "next/link";
import { shraniIzdelek } from "@/lib/akcije/skupno";
import NalozSliko from "@/app/admin/NalozSliko";
import { ZNAMKE, ZNAMKE_INFO, normZnamka } from "@/lib/znamke";
import SeoPolja from "./SeoPolja";

// Polja izdelka so razdeljena na kartice (Osnovno, Opisi, SEO), ki so lahko kjerkoli na strani —
// vsa so povezana z istim obrazcem prek atributa form="izdelek".
export const OBRAZEC = "izdelek";
const vrstice = (polje) => (Array.isArray(polje) ? polje.join("\n") : "");

export function Kartica({ id, naslov, opis, desno, children }) {
  return (
    <section className="izd-kartica" id={id}>
      <header>
        <div>
          <h2>{naslov}</h2>
          {opis && <p>{opis}</p>}
        </div>
        {desno}
      </header>
      <div className="izd-kartica-telo">{children}</div>
    </section>
  );
}

export function ObrazecIzdelka({ izdelek }) {
  const i = izdelek ?? {};
  return (
    <form id={OBRAZEC} action={shraniIzdelek}>
      {i.id && <input type="hidden" name="id" value={i.id} />}
    </form>
  );
}

export function ShraniVrstica({ izdelek }) {
  return (
    <div className="izd-shrani">
      <span>Besedila, osnovni podatki in SEO se shranijo z gumbom. Slike, videi, artikli in dokumenti se shranijo sproti.</span>
      <div style={{ display: "flex", gap: 8 }}>
        <Link className="gumb siv" href="/admin/izdelki">Nazaj na seznam</Link>
        <button className="gumb" type="submit" form={OBRAZEC}>{izdelek?.id ? "Shrani spremembe" : "Ustvari izdelek"}</button>
      </div>
    </div>
  );
}

export function OsnovnoPolja({ izdelek, kategorije }) {
  const i = izdelek ?? {};
  const f = OBRAZEC;
  return (
    <>
      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="naziv">Naziv izdelka *</label>
          <input form={f} id="naziv" name="naziv" type="text" defaultValue={i.naziv ?? ""} required placeholder="npr. Jekleno sidro TXH7" />
        </div>
        <div className="adm-polje">
          <label htmlFor="kategorija_id">Kategorija</label>
          <select form={f} id="kategorija_id" name="kategorija_id" defaultValue={i.kategorija_id ?? ""} style={{ width: "100%" }}>
            <option value="">— izberi —</option>
            {kategorije.map((k) => <option key={k.id} value={k.id}>{k.naziv}</option>)}
          </select>
        </div>
      </div>
      <div className="adm-vrsta-3">
        <div className="adm-polje">
          <label htmlFor="znamka">Znamka</label>
          <select form={f} id="znamka" name="znamka" defaultValue={normZnamka(i.znamka) ?? ""} style={{ width: "100%" }}>
            <option value="">— samodejno po šifri —</option>
            {ZNAMKE.map((z) => <option key={z} value={z}>{ZNAMKE_INFO[z].ime}</option>)}
          </select>
        </div>
        <div className="adm-polje">
          <label htmlFor="eta_stevilka">Številka ETA</label>
          <input form={f} id="eta_stevilka" name="eta_stevilka" type="text" defaultValue={i.eta_stevilka ?? ""} placeholder="npr. ETA-21/0597" />
        </div>
        <div className="adm-polje">
          <label htmlFor="material">Material</label>
          <input form={f} id="material" name="material" type="text" defaultValue={i.material ?? ""} placeholder="npr. pocinkano jeklo" />
        </div>
      </div>
      <div className="adm-vrsta-3">
        <div className="adm-polje">
          <label htmlFor="slug">Spletni naslov (slug)</label>
          <input form={f} id="slug" name="slug" type="text" defaultValue={i.slug ?? ""} pattern="[a-z0-9-]*" placeholder="se ustvari sam" />
        </div>
        <div className="adm-polje">
          <label htmlFor="vrstni_red">Vrstni red v kategoriji</label>
          <input form={f} id="vrstni_red" name="vrstni_red" type="number" defaultValue={i.vrstni_red ?? 0} />
        </div>
        <div className="adm-polje">
          <label>Objava</label>
          <label className="stikalo">
            <input form={f} id="objavljeno" name="objavljeno" type="checkbox" defaultChecked={i.objavljeno ?? true} />
            <span className="stikalo-drsnik" />
            Prikaži na spletni strani
          </label>
        </div>
      </div>
      {!i.id && (
        <NalozSliko ime="slika_url" zacetna={i.slika_url} oznaka="Glavna slika" form={f} />
      )}
    </>
  );
}

export function OpisiPolja({ izdelek }) {
  const i = izdelek ?? {};
  const f = OBRAZEC;
  return (
    <>
      <div className="adm-polje">
        <label htmlFor="kratek_opis">Kratek opis <span className="opomba">— en stavek, ki se pokaže na seznamu izdelkov</span></label>
        <textarea form={f} id="kratek_opis" name="kratek_opis" defaultValue={i.kratek_opis ?? ""} style={{ minHeight: 64 }} />
      </div>
      <div className="adm-polje">
        <label htmlFor="opis">Opis izdelka <span className="opomba">— glavno besedilo na strani izdelka</span></label>
        <textarea form={f} id="opis" name="opis" defaultValue={i.opis ?? ""} style={{ minHeight: 170 }} />
      </div>
      <div className="adm-vrsta">
        <div className="adm-polje">
          <label htmlFor="uporaba">Uporaba <span className="opomba">— ena postavka na vrstico</span></label>
          <textarea form={f} id="uporaba" name="uporaba" defaultValue={vrstice(i.uporaba)} />
        </div>
        <div className="adm-polje">
          <label htmlFor="prednosti">Prednosti <span className="opomba">— ena na vrstico</span></label>
          <textarea form={f} id="prednosti" name="prednosti" defaultValue={vrstice(i.prednosti)} />
        </div>
      </div>
      <div className="adm-polje">
        <label htmlFor="tehnicni_opis">Tehnični opis in vgradnja</label>
        <textarea form={f} id="tehnicni_opis" name="tehnicni_opis" defaultValue={i.tehnicni_opis ?? ""} style={{ minHeight: 100 }} />
      </div>
    </>
  );
}

export { SeoPolja };

// Združljivost: stari uvoz "IzdelekObrazec" (nov izdelek) — vse kartice v enem.
export default function IzdelekObrazec({ izdelek, kategorije }) {
  return (
    <>
      <ObrazecIzdelka izdelek={izdelek} />
      <Kartica id="osnovno" naslov="Osnovni podatki"><OsnovnoPolja izdelek={izdelek} kategorije={kategorije} /></Kartica>
      <Kartica id="opisi" naslov="Opisi"><OpisiPolja izdelek={izdelek} /></Kartica>
      <Kartica id="seo" naslov="Iskalniki (SEO)"><SeoPolja izdelek={izdelek} /></Kartica>
      <ShraniVrstica izdelek={izdelek} />
    </>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import { izbrisiArtikel, izbrisiDokument, izbrisiIzdelek, shraniArtikel, shraniDokument } from "@/lib/akcije/skupno";
import { Kartica, ObrazecIzdelka, OpisiPolja, OsnovnoPolja, SeoPolja, ShraniVrstica } from "../IzdelekObrazec";
import NalozSliko from "@/app/admin/NalozSliko";
import UvozArtiklov from "@/app/admin/UvozArtiklov";
import GalerijaIzdelka from "@/app/admin/GalerijaIzdelka";
import VideiIzdelka from "@/app/admin/VideiIzdelka";
import IzbrisiGumb from "@/app/admin/IzbrisiGumb";
import { VIDEI_IZDELKOV } from "@/lib/videi";

export const dynamic = "force-dynamic";

const tipiDokumentov = [
  ["eta", "ETA — evropska tehnična ocena"],
  ["dop", "DoP — izjava o lastnostih"],
  ["certifikat", "Certifikat"],
  ["letak", "Letak"],
  ["katalog", "Katalog"],
  ["navodila", "Navodila za vgradnjo"],
  ["risba", "Tehnična risba"],
];
const JEZIKI = { sl: "SLO", en: "ENG", de: "DEU", hr: "HRV" };

export default async function UrediIzdelek({ params }) {
  const { id } = await params;
  const sb = supabaseAdmin();

  const [{ data: izdelek }, { data: kategorije }, { data: artikli }, { data: dokumenti }] = await Promise.all([
    sb.from("izdelki").select("*").eq("id", id).single(),
    sb.from("kategorije").select("id, naziv, slug").order("naziv"),
    sb.from("artikli").select("*").eq("izdelek_id", id).order("sifra"),
    sb.from("dokumenti").select("*").eq("izdelek_id", id).order("tip"),
  ]);

  if (!izdelek) notFound();

  const galerija = [...new Set([izdelek.slika_url, ...(Array.isArray(izdelek.galerija) ? izdelek.galerija : [])].filter(Boolean))];
  const videi = Array.isArray(izdelek.videi) && izdelek.videi.length
    ? izdelek.videi
    : VIDEI_IZDELKOV[izdelek.slug]
      ? [{ ...VIDEI_IZDELKOV[izdelek.slug], samodejno: true }]
      : [];
  const kat = (kategorije ?? []).find((k) => k.id === izdelek.kategorija_id);
  const javniUrl = kat ? `/program/${kat.slug}/${izdelek.slug}` : null;
  const art = artikli ?? [];
  const dok = dokumenti ?? [];

  // kontrolni seznam — kaj izdelku še manjka
  const manjka = [
    !izdelek.slika_url && ["slike", "glavna slika"],
    !izdelek.opis && ["opisi", "opis"],
    !izdelek.kratek_opis && ["opisi", "kratek opis"],
    art.length === 0 && ["artikli", "artikli (šifre)"],
    !izdelek.seo_opis && ["seo", "SEO opis"],
  ].filter(Boolean);

  const nav = [
    ["osnovno", "Osnovno"],
    ["slike", `Slike · ${galerija.length}`],
    ["opisi", "Opisi"],
    ["videi", `Videi · ${videi.length}`],
    ["artikli", `Artikli · ${art.length}`],
    ["dokumenti", `Dokumenti · ${dok.length}`],
    ["seo", "SEO"],
  ];

  return (
    <>
      <div className="adm-glava izd-glava">
        <div className="izd-glava-levo">
          <span className="izd-slika">{izdelek.slika_url ? <img src={izdelek.slika_url} alt="" /> : null}</span>
          <div>
            <div className="adm-nad">
              <Link href="/admin/izdelki" style={{ color: "inherit" }}>Izdelki</Link>
              {kat && <> · {kat.naziv}</>}
            </div>
            <h1>{izdelek.naziv}</h1>
            <div className="izd-znacke">
              <span className={izdelek.objavljeno ? "znacka da" : "znacka ne"}>{izdelek.objavljeno ? "Objavljeno" : "Skrito"}</span>
              {izdelek.znamka && <span className="znacka ne">{izdelek.znamka}</span>}
              {izdelek.eta_stevilka && <span className="znacka ne">{izdelek.eta_stevilka}</span>}
              <span className="znacka ne">{art.length} artiklov</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {javniUrl && <a className="gumb siv" href={javniUrl} target="_blank" rel="noreferrer">Poglej na strani ↗</a>}
          <IzbrisiGumb action={izbrisiIzdelek} id={izdelek.id} ime={izdelek.naziv} opozorilo="Tega ni mogoče razveljaviti." />
        </div>
      </div>

      <nav className="izd-nav">
        {nav.map(([a, n]) => <a key={a} href={`#${a}`}>{n}</a>)}
      </nav>

      <div className="adm-telo izd-telo">
        {manjka.length > 0 && (
          <div className="izd-manjka">
            <b>Za popoln izdelek manjka:</b>
            {manjka.map(([a, n]) => <a key={n} href={`#${a}`}>{n}</a>)}
          </div>
        )}

        <ObrazecIzdelka izdelek={izdelek} />

        <Kartica id="osnovno" naslov="Osnovni podatki" opis="Naziv, kategorija, znamka in objava.">
          <OsnovnoPolja izdelek={izdelek} kategorije={kategorije ?? []} />
        </Kartica>

        <Kartica id="slike" naslov="Slike" opis="Povleci več slik naenkrat. Prva oz. »★ Glavna« je slika na seznamu izdelkov.">
          <GalerijaIzdelka izdelekId={izdelek.id} glavna={izdelek.slika_url} galerija={galerija} />
        </Kartica>

        <Kartica id="opisi" naslov="Opisi" opis="Besedila na strani izdelka.">
          <OpisiPolja izdelek={izdelek} />
        </Kartica>

        <Kartica id="videi" naslov="Videi (YouTube)" opis="Prvi video se pokaže na strani izdelka.">
          <VideiIzdelka izdelekId={izdelek.id} zacetni={videi} />
        </Kartica>

        <Kartica id="artikli" naslov="Artikli" opis="Posamezne izvedbe s šifro, dimenzijo, ceno in zalogo.">
          {art.length > 0 ? (
            <table className="adm-tab">
              <thead>
                <tr>
                  <th>Šifra</th>
                  <th>Naziv</th>
                  <th>Dimenzija</th>
                  <th>EAN</th>
                  <th style={{ textAlign: "right" }}>Pak.</th>
                  <th style={{ textAlign: "right" }}>MPC €</th>
                  <th style={{ textAlign: "right" }}>Zaloga</th>
                  <th></th>
                  <th style={{ width: 44 }}></th>
                </tr>
              </thead>
              <tbody>
                {art.map((a) => (
                  <tr key={a.id}>
                    <td><b>{a.sifra}</b></td>
                    <td>{a.naziv}</td>
                    <td>{a.dimenzija ?? "—"}</td>
                    <td style={{ color: "#6e7276", fontSize: 13 }}>{a.ean ?? "—"}</td>
                    <td style={{ textAlign: "right" }}>{a.pakiranje ?? "—"}</td>
                    <td style={{ textAlign: "right" }}>{a.cena_mpc ?? "—"}</td>
                    <td style={{ textAlign: "right" }}>{a.zaloga ?? "—"}</td>
                    <td>{!a.objavljeno && <span className="znacka ne">skrit</span>}</td>
                    <td style={{ textAlign: "right" }}>
                      <form action={izbrisiArtikel} style={{ display: "inline" }}>
                        <input type="hidden" name="id" value={a.id} />
                        <input type="hidden" name="izdelek_id" value={izdelek.id} />
                        <button className="ikona-gumb nevaren" type="submit" title="Izbriši artikel">✕</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="prazno-besedilo">Izdelek še nima artiklov. Dodaj jih ročno ali uvozi iz Excela.</p>
          )}

          <div className="izd-razpri">
            <details>
              <summary>+ Dodaj artikel ročno</summary>
              <form action={shraniArtikel} style={{ marginTop: 14 }}>
                <input type="hidden" name="izdelek_id" value={izdelek.id} />
                <div className="adm-vrsta-3">
                  <div className="adm-polje"><label htmlFor="sifra">Šifra *</label><input id="sifra" name="sifra" type="text" required placeholder="TXH7-1090" /></div>
                  <div className="adm-polje"><label htmlFor="a_naziv">Naziv *</label><input id="a_naziv" name="naziv" type="text" required placeholder="TXH7 ZnB M10x90" /></div>
                  <div className="adm-polje"><label htmlFor="dimenzija">Dimenzija</label><input id="dimenzija" name="dimenzija" type="text" placeholder="M10 x 90" /></div>
                </div>
                <div className="adm-vrsta-3">
                  <div className="adm-polje"><label htmlFor="premer">Premer (mm)</label><input id="premer" name="premer" type="text" /></div>
                  <div className="adm-polje"><label htmlFor="dolzina">Dolžina (mm)</label><input id="dolzina" name="dolzina" type="text" /></div>
                  <div className="adm-polje"><label htmlFor="ean">EAN</label><input id="ean" name="ean" type="text" /></div>
                </div>
                <div className="adm-vrsta-3">
                  <div className="adm-polje"><label htmlFor="pakiranje">Pakiranje (kos)</label><input id="pakiranje" name="pakiranje" type="text" /></div>
                  <div className="adm-polje"><label htmlFor="cena_mpc">MPC z DDV (€)</label><input id="cena_mpc" name="cena_mpc" type="text" /></div>
                  <div className="adm-polje"><label htmlFor="zaloga">Zaloga</label><input id="zaloga" name="zaloga" type="text" /></div>
                </div>
                <div className="adm-vrsta-3">
                  <div className="adm-polje"><label htmlFor="teza_g">Teža (g)</label><input id="teza_g" name="teza_g" type="text" /></div>
                  <div className="adm-polje"><label htmlFor="min_narocilo">Najmanjše naročilo</label><input id="min_narocilo" name="min_narocilo" type="number" defaultValue={1} /></div>
                  <div className="adm-polje">
                    <label>Stanje</label>
                    <label style={{ fontWeight: 400, display: "flex", gap: 8, alignItems: "center" }}><input name="objavljeno" type="checkbox" defaultChecked /> Objavljeno</label>
                    <label style={{ fontWeight: 400, display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}><input name="v_trgovini" type="checkbox" defaultChecked /> Na voljo v trgovini</label>
                  </div>
                </div>
                <button className="gumb" type="submit">Dodaj artikel</button>
              </form>
            </details>
            <details>
              <summary>⇪ Uvozi artikle iz Excela</summary>
              <UvozArtiklov izdelekId={izdelek.id} />
            </details>
          </div>
        </Kartica>

        <Kartica id="dokumenti" naslov="Dokumenti" opis="ETA, DoP, letak, navodila … Prikažejo se na strani izdelka in na strani Katalogi.">
          {dok.length > 0 ? (
            <div className="dok-seznam">
              {dok.map((d) => (
                <div key={d.id} className="dok-el">
                  <span className="dok-ikona">PDF</span>
                  <div className="dok-ime">
                    <b>{d.naziv}</b>
                    <small>{(tipiDokumentov.find(([t]) => t === d.tip)?.[1] ?? d.tip).split(" — ")[0]} · {JEZIKI[d.jezik] ?? d.jezik}</small>
                  </div>
                  <a className="gumb siv mini" href={d.datoteka_url} target="_blank" rel="noreferrer">Odpri</a>
                  <form action={izbrisiDokument}>
                    <input type="hidden" name="id" value={d.id} />
                    <input type="hidden" name="izdelek_id" value={izdelek.id} />
                    <button className="ikona-gumb nevaren" type="submit" title="Izbriši dokument">✕</button>
                  </form>
                </div>
              ))}
            </div>
          ) : (
            <p className="prazno-besedilo">Ni dokumentov.</p>
          )}
          <div className="izd-razpri">
            <details>
              <summary>+ Dodaj dokument</summary>
              <form action={shraniDokument} style={{ marginTop: 14 }}>
                <input type="hidden" name="izdelek_id" value={izdelek.id} />
                <NalozSliko ime="datoteka_url" oznaka="PDF datoteka" vedro="dokumenti" />
                <div className="adm-vrsta-3">
                  <div className="adm-polje"><label htmlFor="d_naziv">Naziv *</label><input id="d_naziv" name="naziv" type="text" required placeholder="ETA-21/0597" /></div>
                  <div className="adm-polje">
                    <label htmlFor="tip">Vrsta *</label>
                    <select id="tip" name="tip" required style={{ width: "100%" }}>
                      {tipiDokumentov.map(([v, o]) => <option key={v} value={v}>{o}</option>)}
                    </select>
                  </div>
                  <div className="adm-polje">
                    <label htmlFor="jezik">Jezik</label>
                    <select id="jezik" name="jezik" defaultValue="sl" style={{ width: "100%" }}>
                      <option value="sl">Slovensko</option><option value="en">Angleško</option><option value="de">Nemško</option><option value="hr">Hrvaško</option>
                    </select>
                  </div>
                </div>
                <button className="gumb" type="submit">Dodaj dokument</button>
              </form>
            </details>
          </div>
        </Kartica>

        <Kartica id="seo" naslov="Iskalniki (SEO)" opis="Kako je izdelek videti v Googlu. Če pustiš prazno, se uporabita naziv in kratek opis.">
          <SeoPolja izdelek={izdelek} />
        </Kartica>

        <ShraniVrstica izdelek={izdelek} />
      </div>
    </>
  );
}

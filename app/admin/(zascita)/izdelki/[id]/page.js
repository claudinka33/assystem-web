import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import {
  izbrisiArtikel,
  izbrisiDokument,
  izbrisiIzdelek,
  shraniArtikel,
  shraniDokument,
} from "@/lib/akcije/skupno";
import IzdelekObrazec from "../IzdelekObrazec";
import NalozSliko from "@/app/admin/NalozSliko";

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

export default async function UrediIzdelek({ params }) {
  const { id } = await params;
  const sb = supabaseAdmin();

  const [{ data: izdelek }, { data: kategorije }, { data: artikli }, { data: dokumenti }] =
    await Promise.all([
      sb.from("izdelki").select("*").eq("id", id).single(),
      sb.from("kategorije").select("id, naziv").order("naziv"),
      sb.from("artikli").select("*").eq("izdelek_id", id).order("sifra"),
      sb.from("dokumenti").select("*").eq("izdelek_id", id).order("tip"),
    ]);

  if (!izdelek) notFound();

  return (
    <>
      <div className="adm-glava">
        <h1>{izdelek.naziv}</h1>
        <form action={izbrisiIzdelek}>
          <input type="hidden" name="id" value={izdelek.id} />
          <button className="gumb siv" type="submit">
            Izbriši izdelek
          </button>
        </form>
      </div>

      <div className="adm-telo">
        <IzdelekObrazec izdelek={izdelek} kategorije={kategorije ?? []} />

        {/* ---------------- ARTIKLI ---------------- */}
        <h2 style={{ margin: "38px 0 14px", fontSize: 19, fontWeight: 800, textTransform: "uppercase" }}>
          Artikli ({artikli?.length ?? 0})
        </h2>

        {artikli?.length > 0 && (
          <table className="adm-tab" style={{ marginBottom: 18 }}>
            <thead>
              <tr>
                <th>Šifra</th>
                <th>Naziv</th>
                <th>Dimenzija</th>
                <th>EAN</th>
                <th style={{ width: 80 }}>Pakiranje</th>
                <th style={{ width: 90 }}>MPC €</th>
                <th style={{ width: 80 }}>Zaloga</th>
                <th style={{ width: 90 }}></th>
              </tr>
            </thead>
            <tbody>
              {artikli.map((a) => (
                <tr key={a.id}>
                  <td>
                    <b>{a.sifra}</b>
                  </td>
                  <td>{a.naziv}</td>
                  <td>{a.dimenzija ?? "—"}</td>
                  <td style={{ color: "#6e767e" }}>{a.ean ?? "—"}</td>
                  <td>{a.pakiranje ?? "—"}</td>
                  <td>{a.cena_mpc ?? "—"}</td>
                  <td>{a.zaloga ?? "—"}</td>
                  <td style={{ textAlign: "right" }}>
                    <form action={izbrisiArtikel} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={a.id} />
                      <input type="hidden" name="izdelek_id" value={izdelek.id} />
                      <button className="gumb siv mini" type="submit">
                        Izbriši
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form className="adm-obr" action={shraniArtikel}>
          <input type="hidden" name="izdelek_id" value={izdelek.id} />
          <div className="adm-vrsta-3">
            <div className="adm-polje">
              <label htmlFor="sifra">Šifra *</label>
              <input id="sifra" name="sifra" type="text" required placeholder="TXH7-1090" />
            </div>
            <div className="adm-polje">
              <label htmlFor="a_naziv">Naziv *</label>
              <input id="a_naziv" name="naziv" type="text" required placeholder="TXH7 ZnB M10x90" />
            </div>
            <div className="adm-polje">
              <label htmlFor="dimenzija">Dimenzija</label>
              <input id="dimenzija" name="dimenzija" type="text" placeholder="M10 x 90" />
            </div>
          </div>
          <div className="adm-vrsta-3">
            <div className="adm-polje">
              <label htmlFor="premer">Premer (mm)</label>
              <input id="premer" name="premer" type="text" />
            </div>
            <div className="adm-polje">
              <label htmlFor="dolzina">Dolžina (mm)</label>
              <input id="dolzina" name="dolzina" type="text" />
            </div>
            <div className="adm-polje">
              <label htmlFor="ean">EAN</label>
              <input id="ean" name="ean" type="text" />
            </div>
          </div>
          <div className="adm-vrsta-3">
            <div className="adm-polje">
              <label htmlFor="pakiranje">Pakiranje (kos)</label>
              <input id="pakiranje" name="pakiranje" type="text" />
            </div>
            <div className="adm-polje">
              <label htmlFor="cena_mpc">MPC z DDV (€)</label>
              <input id="cena_mpc" name="cena_mpc" type="text" />
            </div>
            <div className="adm-polje">
              <label htmlFor="zaloga">Zaloga</label>
              <input id="zaloga" name="zaloga" type="text" />
            </div>
          </div>
          <div className="adm-vrsta-3">
            <div className="adm-polje">
              <label htmlFor="teza_g">Teža (g)</label>
              <input id="teza_g" name="teza_g" type="text" />
            </div>
            <div className="adm-polje">
              <label htmlFor="min_narocilo">Najmanjše naročilo</label>
              <input id="min_narocilo" name="min_narocilo" type="number" defaultValue={1} />
            </div>
            <div className="adm-polje">
              <label>Stanje</label>
              <label style={{ fontWeight: 400, display: "flex", gap: 8, alignItems: "center" }}>
                <input name="objavljeno" type="checkbox" defaultChecked />
                Objavljeno
              </label>
              <label style={{ fontWeight: 400, display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                <input name="v_trgovini" type="checkbox" defaultChecked />
                Na voljo v trgovini
              </label>
            </div>
          </div>
          <button className="gumb" type="submit">
            Dodaj artikel
          </button>
        </form>

        {/* ---------------- DOKUMENTI ---------------- */}
        <h2 style={{ margin: "38px 0 14px", fontSize: 19, fontWeight: 800, textTransform: "uppercase" }}>
          Dokumenti ({dokumenti?.length ?? 0})
        </h2>

        {dokumenti?.length > 0 && (
          <table className="adm-tab" style={{ marginBottom: 18 }}>
            <thead>
              <tr>
                <th style={{ width: 120 }}>Tip</th>
                <th>Naziv</th>
                <th style={{ width: 70 }}>Jezik</th>
                <th>Povezava</th>
                <th style={{ width: 90 }}></th>
              </tr>
            </thead>
            <tbody>
              {dokumenti.map((d) => (
                <tr key={d.id}>
                  <td>
                    <span className="znacka novo">{d.tip}</span>
                  </td>
                  <td>{d.naziv}</td>
                  <td>{d.jezik}</td>
                  <td style={{ fontSize: 12.5 }}>
                    <a href={d.datoteka_url} target="_blank" rel="noreferrer" style={{ color: "#c8102e" }}>
                      Odpri
                    </a>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <form action={izbrisiDokument} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={d.id} />
                      <input type="hidden" name="izdelek_id" value={izdelek.id} />
                      <button className="gumb siv mini" type="submit">
                        Izbriši
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <form className="adm-obr" action={shraniDokument}>
          <input type="hidden" name="izdelek_id" value={izdelek.id} />
          <div className="adm-vrsta-3">
            <div className="adm-polje">
              <label htmlFor="d_naziv">Naziv *</label>
              <input id="d_naziv" name="naziv" type="text" required placeholder="ETA-20/0533" />
            </div>
            <div className="adm-polje">
              <label htmlFor="tip">Tip *</label>
              <select id="tip" name="tip" required>
                {tipiDokumentov.map(([v, o]) => (
                  <option key={v} value={v}>
                    {o}
                  </option>
                ))}
              </select>
            </div>
            <div className="adm-polje">
              <label htmlFor="jezik">Jezik</label>
              <select id="jezik" name="jezik" defaultValue="sl">
                <option value="sl">Slovensko</option>
                <option value="en">Angleško</option>
                <option value="de">Nemško</option>
                <option value="hr">Hrvaško</option>
              </select>
            </div>
          </div>
          <NalozSliko ime="datoteka_url" oznaka="PDF datoteka" vedro="dokumenti" />
          <button className="gumb" type="submit">
            Dodaj dokument
          </button>
        </form>

        <p style={{ marginTop: 24 }}>
          <Link className="gumb siv" href="/admin/izdelki">
            Nazaj na seznam
          </Link>
        </p>
      </div>
    </>
  );
}

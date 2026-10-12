import { supabaseAdmin } from "@/lib/supabase-server";
import { preklopiKodo, izbrisiKodo } from "@/lib/akcije/popusti-admin";
import { ZNAMKE } from "@/lib/popusti";
import ObrazecKode from "./ObrazecKode";

export const dynamic = "force-dynamic";

const datum = (d) => (d ? new Date(d).toLocaleDateString("sl-SI") : "");

function opisVrednosti(k) {
  if (k.tip === "dostava") return "brezplačna dostava";
  if (k.tip === "odstotek") return `−${Number(k.vrednost)} %`;
  return `−${Number(k.vrednost).toFixed(2).replace(".", ",")} € z DDV`;
}

export default async function Popusti() {
  const sb = supabaseAdmin();
  const [{ data, error }, { data: kat }] = await Promise.all([
    sb.from("popust_kode").select("*").order("ustvarjeno", { ascending: false }),
    sb.from("kategorije").select("id, naziv, nadrejena_id").order("vrstni_red"),
  ]);
  if (error)
    return (
      <div className="adm-telo">
        <div className="opozorilo">Tabela za kode še ne obstaja. V Supabase (assystem-web) zaženi SQL »41-popusti.sql«.</div>
      </div>
    );
  const kategorije = kat ?? [];
  const imeKat = Object.fromEntries(kategorije.map((k) => [String(k.id), k.naziv]));
  // glavne kategorije, pod njimi podkategorije
  const glavne = kategorije.filter((k) => !k.nadrejena_id);
  const seznamKat = glavne.flatMap((g) => [
    { id: String(g.id), naziv: g.naziv },
    ...kategorije.filter((k) => String(k.nadrejena_id) === String(g.id)).map((k) => ({ id: String(k.id), naziv: `— ${k.naziv}` })),
  ]);

  const veljaZa = (k) =>
    k.velja_za === "trgovina"
      ? "celotno naročilo"
      : k.velja_za === "kategorija"
        ? `kategorija: ${imeKat[k.kategorija_id] ?? k.kategorija_id}`
        : k.velja_za === "znamka"
          ? `znamka: ${k.znamka}`
          : `artikel: ${k.artikel_sifra}`;

  return (
    <>
      <div className="adm-glava">
        <h1>Kode za popust</h1>
        <span style={{ fontSize: 14, color: "#6e767e" }}>{(data ?? []).filter((k) => k.aktivno).length} aktivnih</span>
      </div>
      <div className="adm-telo">
        <ObrazecKode kategorije={seznamKat} znamke={ZNAMKE} />

        <h2 style={{ fontSize: 16, margin: "28px 0 10px" }}>Vse kode</h2>
        {(data ?? []).length === 0 ? (
          <div className="opozorilo">Ni še kod.</div>
        ) : (
          <table className="adm-tab">
            <thead>
              <tr><th>Koda</th><th>Popust</th><th>Velja za</th><th>Kupci</th><th>Pogoji</th><th>Uporabe</th><th>Stanje</th><th></th></tr>
            </thead>
            <tbody>
              {data.map((k) => (
                <tr key={k.id}>
                  <td><b>{k.koda}</b>{k.opis && <div style={{ fontSize: 12.5, color: "#6e767e" }}>{k.opis}</div>}</td>
                  <td>{opisVrednosti(k)}</td>
                  <td>{veljaZa(k)}</td>
                  <td>{k.kupci === "vsi" ? "vsi" : k.kupci.toUpperCase()}</td>
                  <td style={{ fontSize: 13 }}>
                    {k.min_znesek ? `nad ${Number(k.min_znesek)} €` : ""}
                    {k.velja_od || k.velja_do ? <div>{datum(k.velja_od)} – {datum(k.velja_do)}</div> : null}
                  </td>
                  <td>{k.uporabljeno}{k.max_uporab ? ` / ${k.max_uporab}` : ""}</td>
                  <td><span className={k.aktivno ? "znacka da" : "znacka ne"}>{k.aktivno ? "aktivna" : "izklopljena"}</span></td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <form action={preklopiKodo} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={k.id} />
                      <input type="hidden" name="aktivno" value={k.aktivno ? "0" : "1"} />
                      <button className="gumb siv mini" type="submit">{k.aktivno ? "Izklopi" : "Vklopi"}</button>
                    </form>{" "}
                    <form action={izbrisiKodo} style={{ display: "inline" }}>
                      <input type="hidden" name="id" value={k.id} />
                      <button className="gumb siv mini" type="submit">Izbriši</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

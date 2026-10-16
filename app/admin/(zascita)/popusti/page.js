import { supabaseAdmin } from "@/lib/supabase-server";
import { preklopiKodo, izbrisiKodo } from "@/lib/akcije/popusti-admin";
import { ZNAMKE } from "@/lib/popusti";
import ObrazecKode from "./ObrazecKode";
import IzbrisiGumb from "../../IzbrisiGumb";

export const dynamic = "force-dynamic";

const datum = (d) => (d ? new Date(d).toLocaleDateString("sl-SI") : "");

function opisVrednosti(k) {
  if (k.tip === "dostava") return "Brezplačna dostava";
  if (k.tip === "odstotek") return `−${Number(k.vrednost)} %`;
  return `−${Number(k.vrednost).toFixed(2).replace(".", ",")} €`;
}

function stanjeKode(k) {
  const danes = new Date().toISOString().slice(0, 10);
  if (!k.aktivno) return ["izklopljena", "ne"];
  if (k.velja_do && k.velja_do < danes) return ["potekla", "ne"];
  if (k.velja_od && k.velja_od > danes) return ["še ne velja", "ne"];
  if (k.max_uporab && k.uporabljeno >= k.max_uporab) return ["porabljena", "ne"];
  return ["aktivna", "da"];
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
  const glavne = kategorije.filter((k) => !k.nadrejena_id);
  const seznamKat = glavne.flatMap((g) => [
    { id: String(g.id), naziv: g.naziv },
    ...kategorije.filter((k) => String(k.nadrejena_id) === String(g.id)).map((k) => ({ id: String(k.id), naziv: `— ${k.naziv}` })),
  ]);

  const veljaZa = (k) =>
    k.velja_za === "trgovina"
      ? "celotno naročilo"
      : k.velja_za === "kategorija"
        ? imeKat[k.kategorija_id] ?? `kategorija ${k.kategorija_id}`
        : k.velja_za === "znamka"
          ? `znamka ${k.znamka}`
          : `artikel ${k.artikel_sifra}`;

  const kode = data ?? [];
  const aktivnih = kode.filter((k) => stanjeKode(k)[1] === "da").length;
  const uporab = kode.reduce((s, k) => s + (k.uporabljeno ?? 0), 0);

  return (
    <>
      <div className="adm-glava">
        <div>
          <div className="adm-nad">Prodaja</div>
          <h1>Kode za popust</h1>
        </div>
        <span className="adm-info">{aktivnih} aktivnih · {kode.length} skupaj · {uporab} uporab</span>
      </div>
      <div className="adm-telo">
        <ObrazecKode kategorije={seznamKat} znamke={ZNAMKE} />

        <h2 className="adm-naslov">Vse kode</h2>
        {kode.length === 0 ? (
          <p className="prazno-besedilo">Ni še kod. Ustvari prvo zgoraj.</p>
        ) : (
          <div className="kupon-seznam">
            {kode.map((k) => {
              const [st, razred] = stanjeKode(k);
              return (
                <div key={k.id} className={`kupon-el${razred === "da" ? "" : " neaktiven"}`}>
                  <div className="kupon-el-levo">
                    <b>{opisVrednosti(k)}</b>
                    <span className="kupon-el-koda">{k.koda}</span>
                  </div>
                  <div className="kupon-el-sredina">
                    <div className="kupon-el-vrsta">
                      <span className={`znacka ${razred}`}>{st}</span>
                      {k.opis && <span className="kupon-el-opis">{k.opis}</span>}
                    </div>
                    <div className="kupon-el-pogoji">
                      <span>Velja za: <b>{veljaZa(k)}</b></span>
                      <span>Kupci: <b>{k.kupci === "vsi" ? "vsi" : k.kupci.toUpperCase()}</b></span>
                      {k.min_znesek ? <span>Nakup nad <b>{Number(k.min_znesek)} €</b></span> : null}
                      {k.velja_od || k.velja_do ? <span>Obdobje: <b>{datum(k.velja_od) || "…"} – {datum(k.velja_do) || "…"}</b></span> : null}
                      <span>Uporabljena: <b>{k.uporabljeno}{k.max_uporab ? ` / ${k.max_uporab}` : "×"}</b></span>
                    </div>
                  </div>
                  <div className="kupon-el-gumbi">
                    <form action={preklopiKodo}>
                      <input type="hidden" name="id" value={k.id} />
                      <input type="hidden" name="aktivno" value={k.aktivno ? "0" : "1"} />
                      <button className="gumb siv mini" type="submit">{k.aktivno ? "Izklopi" : "Vklopi"}</button>
                    </form>
                    <IzbrisiGumb action={izbrisiKodo} id={k.id} ime={k.koda} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

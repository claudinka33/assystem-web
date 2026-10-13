import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { uvoziSilvermate } from "@/lib/akcije/silvermate-admin";
import { SILVERMATE_KATEGORIJA, SILVERMATE_IZDELKI } from "@/lib/silvermate";
import { SILVERMATE_ARTIKLI } from "@/lib/silvermate-artikli";

export const dynamic = "force-dynamic";

// Uvoz lesnih vijakov Silvermate v katalog (kategorija, izdelka Pozi in Torx, artikli iz Vasca).
export default async function SilvermateUvoz({ searchParams }) {
  const { ok, napaka } = (await searchParams) ?? {};
  const sb = supabaseAdmin();
  const { data: kat } = await sb.from("kategorije").select("id, naziv").eq("slug", SILVERMATE_KATEGORIJA.slug).maybeSingle();
  const izdelki = [];
  for (const iz of Object.values(SILVERMATE_IZDELKI)) {
    const { data } = await sb.from("izdelki").select("id, naziv, slug").eq("slug", iz.slug).maybeSingle();
    let n = 0;
    if (data) {
      const { count } = await sb.from("artikli").select("id", { count: "exact", head: true }).eq("izdelek_id", data.id);
      n = count ?? 0;
    }
    izdelki.push({ ...iz, id: data?.id, n });
  }
  const sifre = SILVERMATE_ARTIKLI.map((a) => a[0]);
  const { data: obst } = await sb.from("artikli").select("sifra").in("sifra", sifre);

  return (
    <>
      <div className="adm-glava">
        <h1>Silvermate v katalogu</h1>
        <form action={uvoziSilvermate}>
          <button className="gumb" type="submit">
            {kat ? "Posodobi Silvermate" : "Ustvari kategorijo, izdelka in artikle"}
          </button>
        </form>
      </div>
      <div className="adm-telo">
        {ok && <div className="obvestilo" style={{ marginBottom: 16, padding: 12, background: "#e8f6ec", borderLeft: "3px solid #1a7f3c" }}>Končano: {ok}</div>}
        {napaka && <div className="opozorilo" style={{ marginBottom: 16 }}>Napaka: {napaka}</div>}

        <p style={{ color: "#6e767e", marginBottom: 14, maxWidth: 820 }}>
          Gumb ustvari (ali posodobi) kategorijo »{SILVERMATE_KATEGORIJA.naziv}« (med glavnimi kategorijami), dva izdelka —
          Pozi (AS811 cel + AS812 delni navoj) in Torx (AS814 cel + AS816 delni navoj) — ter {SILVERMATE_ARTIKLI.length}{" "}
          artiklov iz Vasca. V tabeli izdelka je stolpec »Navoj« s filtrom cel / delni. Zalogo in ceno potem osvežuje
          sinhronizacija z Vascom. Če so bili artikli prej pri drugem izdelku, se premaknejo; izdelek brez artiklov se skrije.
        </p>

        <table className="adm-tab" style={{ maxWidth: 820 }}>
          <tbody>
            <tr>
              <td>Kategorija</td>
              <td>{kat ? <Link href={`/program/${SILVERMATE_KATEGORIJA.slug}`} target="_blank">{kat.naziv} ↗</Link> : <i>še ne obstaja</i>}</td>
            </tr>
            {izdelki.map((i) => (
              <tr key={i.slug}>
                <td>{i.naziv}</td>
                <td>
                  {i.id ? (
                    <>
                      <Link href={`/admin/izdelki/${i.id}`}>uredi</Link> ·{" "}
                      <Link href={`/program/${SILVERMATE_KATEGORIJA.slug}/${i.slug}`} target="_blank">na strani ↗</Link> · {i.n} artiklov
                    </>
                  ) : (
                    <i>še ne obstaja</i>
                  )}
                </td>
              </tr>
            ))}
            <tr>
              <td>Artikli AS811–AS816 v bazi</td>
              <td>{obst?.length ?? 0} od {SILVERMATE_ARTIKLI.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

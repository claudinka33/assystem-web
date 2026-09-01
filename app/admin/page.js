import Link from "next/link";
import { supabaseAdmin, trenutniAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

async function prestej(tabela, filter) {
  const sb = supabaseAdmin();
  let q = sb.from(tabela).select("id", { count: "exact", head: true });
  if (filter) q = q.eq(filter[0], filter[1]);
  const { count } = await q;
  return count ?? 0;
}

export default async function NadzornaPlosca() {
  const admin = await trenutniAdmin();

  const [kategorij, izdelkov, artiklov, novih] = await Promise.all([
    prestej("kategorije"),
    prestej("izdelki"),
    prestej("artikli"),
    prestej("povprasevanja", ["status", "novo"]),
  ]);

  return (
    <>
      <div className="adm-glava">
        <h1>Nadzorna plošča</h1>
        <span style={{ fontSize: 14, color: "#6e767e" }}>Prijavljena: {admin.ime}</span>
      </div>

      <div className="adm-telo">
        <div className="adm-kartice">
          <div className="adm-kartica">
            <b>{kategorij}</b>
            <span>Kategorij</span>
          </div>
          <div className="adm-kartica">
            <b>{izdelkov}</b>
            <span>Izdelkov</span>
          </div>
          <div className="adm-kartica">
            <b>{artiklov}</b>
            <span>Artiklov s šifro</span>
          </div>
          <div className="adm-kartica">
            <b>{novih}</b>
            <span>Novih povpraševanj</span>
          </div>
        </div>

        <div style={{ marginTop: 28, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="gumb" href="/admin/kategorije/nova">
            Nova kategorija
          </Link>
          <Link className="gumb siv" href="/admin/izdelki/nov">
            Nov izdelek
          </Link>
          <Link className="gumb siv" href="/admin/novice/nova">
            Nova novica
          </Link>
        </div>

        {kategorij === 0 && (
          <div className="opozorilo" style={{ marginTop: 28 }}>
            Baza je še prazna. Začni s kategorijami — izdelek se veže na kategorijo,
            artikel pa na izdelek.
          </div>
        )}
      </div>
    </>
  );
}

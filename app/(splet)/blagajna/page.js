import Blagajna from "./Blagajna";
import BlagajnaB2B from "./BlagajnaB2B";
import { pridobiDostave, pridobiPlacila } from "@/lib/akcije/narocila";
import { trenutniB2B, jeAktiven, prodajalneKupca, jeTestniB2B } from "@/lib/b2b";
import { prevedenaStran, prevediMetadata } from "@/lib/i18n/streznik";
import Link from "next/link";

const metadataSl = { title: "Blagajna", robots: { index: false } };
export const dynamic = "force-dynamic";

async function Stran() {
  const k = await trenutniB2B();
  const b2b = jeAktiven(k);
  // Naročanje je samo za odobrene B2B kupce
  if (!b2b)
    return (
      <section className="trg">
        <div className="w">
          <div className="b2b-zaklep">
            {k && k.status !== "zavrnjen" ? (
              <>
                <h1>Vaš B2B račun čaka na odobritev</h1>
                <p>Naročilo boste lahko oddali, ko vaš račun pregledamo in odobrimo. Običajno v 1–2 delovnih dneh. Do takrat vidite redne veleprodajne cene.</p>
                <Link className="b b-r" href="/program">Na prodajni program</Link>
              </>
            ) : (
              <>
                <h1>Naročanje je na voljo B2B kupcem</h1>
                <p>Cene, zaloga in spletno naročanje so na voljo registriranim podjetjem. Registrirajte se in po potrditvi e-naslova takoj vidite cene.</p>
                <Link className="b b-r" href="/b2b/registracija">Postanite B2B kupec →</Link> <Link className="b b-o" href="/b2b">Prijava</Link>
              </>
            )}
          </div>
        </div>
      </section>
    );
  const [dostave, placila, prodajalne] = await Promise.all([
    pridobiDostave(),
    pridobiPlacila(),
    b2b ? prodajalneKupca(k.vasco_partner) : [],
  ]);
  return (
    <section className="trg">
      <div className="w">
        {b2b ? (
          <BlagajnaB2B
            dostave={dostave}
            prodajalne={prodajalne}
            kupec={{
              podjetje: k.vasco_naziv || k.podjetje,
              naslov: k.vasco_naslov ? `${k.vasco_naslov}, ${k.vasco_posta ?? ""}` : `${k.naslov ?? ""}, ${k.posta ?? ""} ${k.kraj ?? ""}`,
              prodajalna: k.prodajalna ?? null,
              ime: k.ime,
              email: k.email,
              telefon: k.telefon,
              rok: k.rok_placila,
              ustavljena: k.ustavljena_prodaja && !jeTestniB2B(k),
            }}
          />
        ) : (
          <Blagajna dostave={dostave} placila={placila} />
        )}
      </div>
    </section>
  );
}

export default prevedenaStran(Stran);

export async function generateMetadata() {
  return prevediMetadata(metadataSl);
}

import Blagajna from "./Blagajna";
import BlagajnaB2B from "./BlagajnaB2B";
import { pridobiDostave, pridobiPlacila } from "@/lib/akcije/narocila";
import { trenutniB2B, jeAktiven, prodajalneKupca } from "@/lib/b2b";

export const metadata = { title: "Blagajna", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function Stran() {
  const k = await trenutniB2B();
  const b2b = jeAktiven(k);
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
              ustavljena: k.ustavljena_prodaja,
            }}
          />
        ) : (
          <Blagajna dostave={dostave} placila={placila} />
        )}
      </div>
    </section>
  );
}

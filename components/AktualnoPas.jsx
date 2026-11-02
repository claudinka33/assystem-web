import Image from "next/image";
import Link from "next/link";
import { pridobiNovice } from "@/lib/podatki";
import { datumSlo } from "@/lib/pomoc";

// Pas z zadnjo novico na vrhu domače strani (antracit + vzorec vijakov).
export default async function AktualnoPas() {
  const [n] = await pridobiNovice(1);
  if (!n) return null;

  return (
    <section className="akt-pas" aria-label="Aktualno">
      <div className="w akt-pas-w">
        {n.slika_url && (
          <Link href={`/aktualno/${n.slug}`} className="akt-pas-sl" tabIndex={-1} aria-hidden="true">
            <Image src={n.slika_url} alt="" fill sizes="180px" />
          </Link>
        )}
        <div className="akt-pas-bes">
          <div className="akt-pas-nad">
            <span className="akt-pas-oz">Aktualno</span>
            {n.objavljeno_dne && <span>{datumSlo(n.objavljeno_dne)}</span>}
          </div>
          <Link href={`/aktualno/${n.slug}`} className="akt-pas-nas">
            {n.naslov}
          </Link>
          {n.povzetek && <p>{n.povzetek}</p>}
        </div>
        <div className="akt-pas-gumbi">
          <Link href={`/aktualno/${n.slug}`} className="akt-pas-gumb">
            Preberi več →
          </Link>
          <Link href="/aktualno" className="akt-pas-vse">
            Vse novice
          </Link>
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { datumSlo } from "@/lib/pomoc";
import { nazivVrste } from "@/lib/vrste-clankov";

// Kartica članka v slogu »Kaj iščete?« (vrata): slika zgoraj, oznaka, naslov, rdeč gumb.
export default function BlogKartica({ n }) {
  const pot = `/aktualno/${n.slug}`;
  return (
    <div className="vrata-k blog-tab">
      <Link href={pot} className={`blog-tab-sl${n.slika_url ? "" : " prazna"}`} tabIndex={-1} aria-hidden="true">
        {n.slika_url && <Image src={n.slika_url} alt="" fill sizes="(max-width: 620px) 100vw, (max-width: 1100px) 50vw, 300px" />}
      </Link>
      <div className="blog-tab-tx">
        <em>
          {nazivVrste(n.vrsta)}
          {n.objavljeno_dne ? ` · ${datumSlo(n.objavljeno_dne)}` : ""}
        </em>
        <h3>
          <Link href={pot}>{n.naslov}</Link>
        </h3>
        {n.povzetek && <p>{n.povzetek}</p>}
        <div className="vrata-cta">
          <Link className="b b-r" href={pot}>
            Preberi →
          </Link>
        </div>
      </div>
    </div>
  );
}

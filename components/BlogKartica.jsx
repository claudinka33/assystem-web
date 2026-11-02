import Image from "next/image";
import Link from "next/link";
import { datumSlo } from "@/lib/pomoc";
import { nazivVrste } from "@/lib/vrste-clankov";

export default function BlogKartica({ n, glavni = false }) {
  return (
    <Link href={`/aktualno/${n.slug}`} className={`blog-kart${glavni ? " blog-glavni" : ""}`}>
      <div className={`blog-sl${n.slika_url ? "" : " prazna"}`}>
        {n.slika_url && (
          <Image src={n.slika_url} alt={n.naslov} fill sizes={glavni ? "(max-width: 900px) 100vw, 760px" : "(max-width: 900px) 100vw, 360px"} />
        )}
        <span className="blog-oz">{nazivVrste(n.vrsta)}</span>
      </div>
      <div className="blog-tx">
        {n.objavljeno_dne && <span className="blog-dat">{datumSlo(n.objavljeno_dne)}</span>}
        <h3>{n.naslov}</h3>
        {n.povzetek && <p>{n.povzetek}</p>}
        <span className="blog-vec">Preberi članek →</span>
      </div>
    </Link>
  );
}

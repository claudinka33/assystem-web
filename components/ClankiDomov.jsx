import Image from "next/image";
import Link from "next/link";
import { pridobiNovice } from "@/lib/podatki";
import { datumSlo } from "@/lib/pomoc";
import { nazivVrste } from "@/lib/vrste-clankov";
import BlogKartica from "@/components/BlogKartica";

// Domača stran: zadnji članek kot banner, naslednji trije kot kartice.
export default async function ClankiDomov() {
  const clanki = await pridobiNovice(4);
  if (clanki.length === 0) return null;
  const [glavni, ...ostali] = clanki;

  return (
    <section className="sec" id="aktualno">
      <div className="w">
        <div className="st" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span>Aktualno</span>
            <h2>Novosti in nasveti</h2>
          </div>
          <Link className="more" href="/aktualno">
            Vsi članki →
          </Link>
        </div>

        {/* banner */}
        <Link href={`/aktualno/${glavni.slug}`} className={`blog-ban${glavni.slika_url ? "" : " brez-slike"}`}>
          {glavni.slika_url && (
            <div className="blog-ban-sl">
              <Image src={glavni.slika_url} alt={glavni.naslov} fill sizes="(max-width: 900px) 100vw, 560px" />
            </div>
          )}
          <div className="blog-ban-tx">
            <div className="blog-ban-nad">
              <span className="blog-oz">{nazivVrste(glavni.vrsta)}</span>
              {glavni.objavljeno_dne && <span>{datumSlo(glavni.objavljeno_dne)}</span>}
            </div>
            <h3>{glavni.naslov}</h3>
            {glavni.povzetek && <p>{glavni.povzetek}</p>}
            <span className="blog-ban-gumb">Preberi članek →</span>
          </div>
        </Link>

        {/* kartice */}
        {ostali.length > 0 && (
          <div className="blog-vrsta">
            {ostali.map((n) => (
              <BlogKartica key={n.slug} n={n} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

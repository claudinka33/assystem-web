import Link from "next/link";
import { pridobiNovice } from "@/lib/podatki";
import BlogKartica from "@/components/BlogKartica";

// Domača stran: zadnji članki — en izpostavljen, dva ob strani.
export default async function ClankiDomov() {
  const clanki = await pridobiNovice(3);
  if (clanki.length === 0) return null;
  const [glavni, ...ostali] = clanki;

  return (
    <section className="sec" id="aktualno">
      <div className="w">
        <div className="st row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div>
            <span>Aktualno</span>
            <h2>Novosti in nasveti</h2>
          </div>
          <Link className="more" href="/aktualno">
            Vsi članki →
          </Link>
        </div>

        <div className="blog-mreza" style={ostali.length === 0 ? { gridTemplateColumns: "1fr" } : undefined}>
          <BlogKartica n={glavni} glavni />
          {ostali.length > 0 && (
            <div className="blog-stran">
              {ostali.map((n) => (
                <BlogKartica key={n.slug} n={n} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

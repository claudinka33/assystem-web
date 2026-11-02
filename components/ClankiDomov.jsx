import Link from "next/link";
import { pridobiNovice } from "@/lib/podatki";
import BlogKartica from "@/components/BlogKartica";

// Domača stran: zadnji štirje članki kot tablice (enak slog kot »Kaj iščete?«).
export default async function ClankiDomov() {
  const clanki = await pridobiNovice(4);
  if (clanki.length === 0) return null;

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
        <div className="vrata">
          {clanki.map((n) => (
            <BlogKartica key={n.slug} n={n} />
          ))}
        </div>
      </div>
    </section>
  );
}

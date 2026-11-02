import Link from "next/link";
import NaslovStrani from "@/components/NaslovStrani";
import VPripravi from "@/components/VPripravi";
import BlogKartica from "@/components/BlogKartica";
import { pridobiNovice } from "@/lib/podatki";
import { VRSTE_CLANKOV } from "@/lib/vrste-clankov";

export const revalidate = 60;

export const metadata = {
  title: "Aktualno — novosti in nasveti",
  description: "Novosti, nasveti za montažo in obvestila podjetja AS system.",
  alternates: { canonical: "/aktualno" },
};

export default async function Aktualno({ searchParams }) {
  const { vrsta } = (await searchParams) ?? {};
  const izbrana = VRSTE_CLANKOV.some((v) => v.kljuc === vrsta) ? vrsta : null;
  const clanki = await pridobiNovice(60, izbrana);

  return (
    <>
      <NaslovStrani
        oznaka="Aktualno"
        naslov="Novosti in nasveti"
        opis="Novosti iz proizvodnje in programa, nasveti za pravilno montažo in obvestila podjetja."
      />
      <section className="sec">
        <div className="w">
          <nav className="blog-filtri" aria-label="Vrsta članka">
            <Link href="/aktualno" className={!izbrana ? "on" : undefined}>
              Vsi
            </Link>
            {VRSTE_CLANKOV.map((v) => (
              <Link key={v.kljuc} href={`/aktualno?vrsta=${v.kljuc}`} className={izbrana === v.kljuc ? "on" : undefined}>
                {v.naziv}
              </Link>
            ))}
          </nav>

          {clanki.length === 0 ? (
            <VPripravi kaj="Prvi članki bodo objavljeni v kratkem." />
          ) : (
            <div className="blog-vsi">
              {clanki.map((n) => (
                <BlogKartica key={n.slug} n={n} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
